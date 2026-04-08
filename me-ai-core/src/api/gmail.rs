//! Gmail REST API v1 — read-only wrapper using reqwest.
//! Matches the interface of me-ai-web/src/lib/gmail-api.ts.

use std::sync::LazyLock;

use base64::Engine as _;
use regex_lite::Regex;

use super::ApiJson;
use crate::error::CoreError;

const BASE: &str = "https://gmail.googleapis.com/gmail/v1/users/me";

fn bearer(token: &str) -> reqwest::header::HeaderValue {
    // `format!` only fails if `token` contains invalid header bytes (e.g. CR/LF).
    reqwest::header::HeaderValue::from_str(&format!("Bearer {token}"))
        .expect("Gmail OAuth token must not contain header-invalid bytes")
}

pub async fn get_profile(token: &str) -> Result<ApiJson, CoreError> {
    let url = format!("{BASE}/profile");
    let resp = reqwest::Client::new()
        .get(&url)
        .header(reqwest::header::AUTHORIZATION, bearer(token))
        .send()
        .await
        .map_err(|e| CoreError::Plugin(e.to_string()))?;
    if !resp.status().is_success() {
        let status = resp.status().as_u16();
        let body: serde_json::Value = resp.json().await.unwrap_or_default();
        let msg = body["error"]["message"]
            .as_str()
            .unwrap_or(&format!("Gmail API error: {status}"))
            .to_string();
        return Err(CoreError::Plugin(format!("{status}:{msg}")));
    }
    resp.json().await.map_err(|e| CoreError::Plugin(e.to_string()))
}

pub async fn list_messages(
    token: &str,
    max_results: u32,
    page_token: Option<&str>,
    q: Option<&str>,
) -> Result<ApiJson, CoreError> {
    let url = format!("{BASE}/messages");
    let mut req = reqwest::Client::new()
        .get(&url)
        .header(reqwest::header::AUTHORIZATION, bearer(token))
        .query(&[("maxResults", max_results.to_string())]);
    if let Some(pt) = page_token {
        req = req.query(&[("pageToken", pt)]);
    }
    if let Some(q) = q {
        req = req.query(&[("q", q)]);
    }
    let resp = req.send().await.map_err(|e| CoreError::Plugin(e.to_string()))?;
    if !resp.status().is_success() {
        let status = resp.status().as_u16();
        let body: serde_json::Value = resp.json().await.unwrap_or_default();
        let msg = body["error"]["message"]
            .as_str()
            .unwrap_or(&format!("Gmail API error: {status}"))
            .to_string();
        return Err(CoreError::Plugin(format!("{status}:{msg}")));
    }
    resp.json().await.map_err(|e| CoreError::Plugin(e.to_string()))
}

pub async fn get_message(token: &str, message_id: &str, format: &str) -> Result<ApiJson, CoreError> {
    let url = format!("{BASE}/messages/{message_id}");
    let resp = reqwest::Client::new()
        .get(&url)
        .header(reqwest::header::AUTHORIZATION, bearer(token))
        .query(&[("format", format)])
        .send()
        .await
        .map_err(|e| CoreError::Plugin(e.to_string()))?;
    if !resp.status().is_success() {
        let status = resp.status().as_u16();
        let body: serde_json::Value = resp.json().await.unwrap_or_default();
        let msg = body["error"]["message"]
            .as_str()
            .unwrap_or(&format!("Gmail API error: {status}"))
            .to_string();
        return Err(CoreError::Plugin(format!("{status}:{msg}")));
    }
    resp.json().await.map_err(|e| CoreError::Plugin(e.to_string()))
}

pub async fn get_messages_batch(
    token: &str,
    message_ids: Vec<String>,
    batch_size: u32,
) -> Result<ApiJson, CoreError> {
    let _ = batch_size; // sequential in WASM
    let client = reqwest::Client::new();
    let mut results: Vec<serde_json::Value> = Vec::with_capacity(message_ids.len());
    for id in &message_ids {
        let url = format!("{BASE}/messages/{id}?format=full");
        let resp = client
            .get(&url)
            .header(reqwest::header::AUTHORIZATION, format!("Bearer {token}"))
            .send()
            .await
            .map_err(|e| CoreError::Plugin(e.to_string()))?;
        if resp.status().is_success() {
            if let Ok(v) = resp.json::<serde_json::Value>().await {
                results.push(v);
            }
        }
    }
    Ok(ApiJson::Array(results))
}

pub async fn list_history(
    token: &str,
    start_history_id: &str,
    page_token: Option<&str>,
    max_results: u32,
) -> Result<ApiJson, CoreError> {
    let url = format!("{BASE}/history");
    let mut req = reqwest::Client::new()
        .get(&url)
        .header(reqwest::header::AUTHORIZATION, bearer(token))
        .query(&[
            ("startHistoryId", start_history_id),
            ("maxResults", &max_results.to_string()),
            ("historyTypes", "messageAdded"),
            ("historyTypes", "messageDeleted"),
        ]);
    if let Some(pt) = page_token {
        req = req.query(&[("pageToken", pt)]);
    }
    let resp = req.send().await.map_err(|e| CoreError::Plugin(e.to_string()))?;
    if !resp.status().is_success() {
        let status = resp.status().as_u16();
        let body: serde_json::Value = resp.json().await.unwrap_or_default();
        let msg = body["error"]["message"]
            .as_str()
            .unwrap_or(&format!("Gmail API error: {status}"))
            .to_string();
        return Err(CoreError::Plugin(format!("{status}:{msg}")));
    }
    resp.json().await.map_err(|e| CoreError::Plugin(e.to_string()))
}

// ── MIME / body parsing ─────────────────────────────────────────────────────

fn decode_base64url(data: &str) -> String {
    let padded = {
        let mut s = data.replace('-', "+").replace('_', "/");
        match s.len() % 4 {
            2 => s += "==",
            3 => s += "=",
            _ => {}
        }
        s
    };
    base64::engine::general_purpose::STANDARD
        .decode(&padded)
        .ok()
        .and_then(|bytes| String::from_utf8(bytes).ok())
        .unwrap_or_default()
}

static STRIP_HTML_STYLE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"(?is)<style[^>]*>.*?</style>").expect("strip_html style regex")
});
static STRIP_HTML_SCRIPT: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"(?is)<script[^>]*>.*?</script>").expect("strip_html script regex")
});
static STRIP_HTML_TAGS: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"<[^>]+>").expect("strip_html tags regex"));
static STRIP_HTML_WS: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"\s{2,}").expect("strip_html ws regex"));

fn strip_html(html: &str) -> String {
    let mut s = STRIP_HTML_STYLE.replace_all(html, "").into_owned();
    s = STRIP_HTML_SCRIPT.replace_all(&s, "").into_owned();
    s = STRIP_HTML_TAGS.replace_all(&s, " ").into_owned();
    s = s
        .replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", "\"")
        .replace("&apos;", "'");
    STRIP_HTML_WS.replace_all(s.trim(), " ").into_owned()
}

/// Recursively find a MIME part by mimeType within a `parts` JSON array.
fn find_part<'a>(parts: &'a serde_json::Value, mime_type: &str) -> Option<&'a serde_json::Value> {
    let arr = parts.as_array()?;
    for part in arr {
        if part["mimeType"].as_str() == Some(mime_type) {
            return Some(part);
        }
        if let Some(found) = find_part(&part["parts"], mime_type) {
            return Some(found);
        }
    }
    None
}

/// Extract the plain-text body from a raw Gmail message JSON string.
pub fn parse_gmail_body(message_json: &str) -> String {
    let msg: serde_json::Value = match serde_json::from_str(message_json) {
        Ok(v) => v,
        Err(_) => return String::new(),
    };
    let payload = &msg["payload"];
    if payload.is_null() {
        return String::new();
    }

    // Direct body data
    if let Some(data) = payload["body"]["data"].as_str() {
        if !data.is_empty() {
            return decode_base64url(data);
        }
    }

    let parts = &payload["parts"];
    // Prefer text/plain
    if let Some(plain) = find_part(parts, "text/plain") {
        if let Some(data) = plain["body"]["data"].as_str() {
            if !data.is_empty() {
                return decode_base64url(data);
            }
        }
    }
    // Fall back to text/html stripped
    if let Some(html_part) = find_part(parts, "text/html") {
        if let Some(data) = html_part["body"]["data"].as_str() {
            if !data.is_empty() {
                return strip_html(&decode_base64url(data));
            }
        }
    }
    "(no body)".to_string()
}

/// Extract the raw HTML body from a raw Gmail message JSON string. Returns None if not found.
pub fn parse_gmail_html_body(message_json: &str) -> Option<String> {
    let msg: serde_json::Value = serde_json::from_str(message_json).ok()?;
    let payload = &msg["payload"];
    if payload.is_null() {
        return None;
    }

    if payload["mimeType"].as_str() == Some("text/html") {
        if let Some(data) = payload["body"]["data"].as_str() {
            if !data.is_empty() {
                return Some(decode_base64url(data));
            }
        }
    }

    let parts = &payload["parts"];
    let html_part = find_part(parts, "text/html")?;
    let data = html_part["body"]["data"].as_str()?;
    if data.is_empty() {
        return None;
    }
    Some(decode_base64url(data))
}

/// Get a header value by name (case-insensitive) from a raw Gmail message JSON string.
pub fn get_gmail_header(message_json: &str, header_name: &str) -> String {
    let msg: serde_json::Value = match serde_json::from_str(message_json) {
        Ok(v) => v,
        Err(_) => return String::new(),
    };
    let Some(headers) = msg["payload"]["headers"].as_array() else {
        return String::new();
    };
    headers
        .iter()
        .find(|h| {
            h["name"]
                .as_str()
                .is_some_and(|n| n.eq_ignore_ascii_case(header_name))
        })
        .and_then(|h| h["value"].as_str())
        .unwrap_or("")
        .to_string()
}
