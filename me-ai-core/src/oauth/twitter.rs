//! Twitter/X OAuth 2.0 PKCE token exchange, refresh, and revoke (no navigation).
//!
//! Authorization URL and PKCE verifier/state are produced here; the app persists verifier/state
//! in IndexedDB (`saveTwitterPkcePending`) and performs the browser redirect / callback in TypeScript.

use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use base64::Engine as _;
use serde::Deserialize;
use sha2::{Digest, Sha256};
use wasm_bindgen::prelude::*;

use crate::error::CoreError;

/// Return value for [`begin_login`] (browser redirects to `authorize_url`).
#[wasm_bindgen(getter_with_clone)]
#[derive(Clone)]
pub struct TwitterOAuthLoginStart {
    #[wasm_bindgen(js_name = authorizeUrl)]
    pub authorize_url: String,
    pub verifier: String,
    pub state: String,
}

/// Tokens after exchange or for UI use (mirrors prior `twitter-auth.ts` shape).
#[wasm_bindgen(getter_with_clone)]
#[derive(Clone)]
pub struct TwitterOAuthTokens {
    #[wasm_bindgen(js_name = accessToken)]
    pub access_token: String,
    #[wasm_bindgen(js_name = refreshToken)]
    pub refresh_token: Option<String>,
}

/// Build verifier, state, challenge, and authorize URL for the PKCE redirect step.
pub fn begin_login(client_id: &str, redirect_uri: &str) -> Result<TwitterOAuthLoginStart, CoreError> {
    let verifier = random_pkce_verifier()?;
    let state = random_oauth_state()?;
    let code_challenge = pkce_code_challenge_s256(&verifier)?;
    let authorize_url = build_authorize_url(client_id, redirect_uri, &state, &code_challenge);
    Ok(TwitterOAuthLoginStart {
        authorize_url,
        verifier,
        state,
    })
}

const AUTH_URL: &str = "https://twitter.com/i/oauth2/authorize";
const TOKEN_URL: &str = "https://api.twitter.com/2/oauth2/token";
const REVOKE_URL: &str = "https://api.twitter.com/2/oauth2/revoke";

/// Scopes aligned with `twitter-auth.ts` / sync needs.
const SCOPES: &str = "tweet.read users.read like.read like.write bookmark.read bookmark.write offline.access";

/// Random verifier: 32 bytes as 64 lowercase hex chars (matches prior TS behaviour).
pub fn random_pkce_verifier() -> Result<String, CoreError> {
    let mut buf = [0u8; 32];
    getrandom::getrandom(&mut buf).map_err(|e| CoreError::Auth(format!("pkce random: {e}")))?;
    Ok(hex::encode(buf))
}

/// Random OAuth `state` parameter: 16 bytes as 32 hex chars.
pub fn random_oauth_state() -> Result<String, CoreError> {
    let mut buf = [0u8; 16];
    getrandom::getrandom(&mut buf).map_err(|e| CoreError::Auth(format!("oauth state random: {e}")))?;
    Ok(hex::encode(buf))
}

/// PKCE code challenge: BASE64URL(SHA256(verifier)) without padding.
pub fn pkce_code_challenge_s256(verifier: &str) -> Result<String, CoreError> {
    let hash = Sha256::digest(verifier.as_bytes());
    Ok(URL_SAFE_NO_PAD.encode(hash))
}

/// Build the Twitter authorize URL (client redirects the browser here).
pub fn build_authorize_url(client_id: &str, redirect_uri: &str, state: &str, code_challenge: &str) -> String {
    format!(
        "{AUTH_URL}?response_type=code&client_id={}&redirect_uri={}&scope={}&state={}&code_challenge={}&code_challenge_method=S256",
        urlencoding::encode(client_id),
        urlencoding::encode(redirect_uri),
        urlencoding::encode(SCOPES),
        urlencoding::encode(state),
        urlencoding::encode(code_challenge),
    )
}

#[derive(Debug, Deserialize)]
struct TokenJson {
    access_token: String,
    refresh_token: Option<String>,
    expires_in: Option<u64>,
}

fn token_error_message(status: u16, body: &serde_json::Value) -> String {
    body["error_description"]
        .as_str()
        .or_else(|| body["error"].as_str())
        .unwrap_or(&format!("Twitter token error: {status}"))
        .to_string()
}

/// Authorization-code exchange (PKCE).
pub async fn exchange_authorization_code(
    client_id: &str,
    redirect_uri: &str,
    code: &str,
    code_verifier: &str,
) -> Result<(String, Option<String>, f64), CoreError> {
    let client = reqwest::Client::new();
    let res = client
        .post(TOKEN_URL)
        .header(reqwest::header::CONTENT_TYPE, "application/x-www-form-urlencoded")
        .body(format!(
            "grant_type=authorization_code&code={}&redirect_uri={}&client_id={}&code_verifier={}",
            urlencoding::encode(code),
            urlencoding::encode(redirect_uri),
            urlencoding::encode(client_id),
            urlencoding::encode(code_verifier),
        ))
        .send()
        .await
        .map_err(|e| CoreError::Auth(e.to_string()))?;

    let status = res.status();
    let body: serde_json::Value = res.json().await.unwrap_or_default();
    if !status.is_success() {
        return Err(CoreError::Auth(token_error_message(status.as_u16(), &body)));
    }
    let parsed: TokenJson = serde_json::from_value(body).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    let expires_in = parsed.expires_in.unwrap_or(7200) as f64;
    Ok((parsed.access_token, parsed.refresh_token, expires_in))
}

/// Refresh access token.
pub async fn refresh_with_refresh_token(
    client_id: &str,
    refresh_token: &str,
) -> Result<(String, Option<String>, f64), CoreError> {
    let client = reqwest::Client::new();
    let res = client
        .post(TOKEN_URL)
        .header(reqwest::header::CONTENT_TYPE, "application/x-www-form-urlencoded")
        .body(format!(
            "grant_type=refresh_token&refresh_token={}&client_id={}",
            urlencoding::encode(refresh_token),
            urlencoding::encode(client_id),
        ))
        .send()
        .await
        .map_err(|e| CoreError::Auth(e.to_string()))?;

    let status = res.status();
    let body: serde_json::Value = res.json().await.unwrap_or_default();
    if !status.is_success() {
        return Err(CoreError::Auth(token_error_message(status.as_u16(), &body)));
    }
    let parsed: TokenJson = serde_json::from_value(body).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    let expires_in = parsed.expires_in.unwrap_or(7200) as f64;
    let refresh_out = parsed.refresh_token.or_else(|| Some(refresh_token.to_string()));
    Ok((parsed.access_token, refresh_out, expires_in))
}

/// Revoke the access token at Twitter (best-effort).
pub async fn revoke_access_token(client_id: &str, access_token: &str) -> Result<(), CoreError> {
    let client = reqwest::Client::new();
    let _ = client
        .post(REVOKE_URL)
        .header(reqwest::header::CONTENT_TYPE, "application/x-www-form-urlencoded")
        .body(format!(
            "token={}&client_id={}",
            urlencoding::encode(access_token),
            urlencoding::encode(client_id),
        ))
        .send()
        .await
        .map_err(|e| CoreError::Auth(e.to_string()))?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn pkce_challenge_matches_vector() {
        let verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
        let expected = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM";
        let got = pkce_code_challenge_s256(verifier).unwrap();
        assert_eq!(got, expected);
    }
}
