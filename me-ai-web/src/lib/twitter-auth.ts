/**
 * Twitter/X OAuth 2.0 PKCE Authentication
 * Browser-only — no server required.
 *
 * Uses the Authorization Code Flow with PKCE (Proof Key for Code Exchange)
 * for public clients (SPAs). No client_secret needed.
 *
 * Token is persisted in IndexedDB via me-ai-core WASM token management.
 */

import {
  getTwitterToken as coreGetTwitterToken,
  getTwitterTokenRaw as coreGetTwitterTokenRaw,
  saveTwitterToken as coreSaveTwitterToken,
  clearTwitterToken as coreClearTwitterToken,
} from "./core.js";

const TWITTER_AUTH_URL = "https://twitter.com/i/oauth2/authorize";
const TWITTER_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";
const TWITTER_REVOKE_URL = "https://api.twitter.com/2/oauth2/revoke";

const SCOPES = ["tweet.read", "users.read", "like.read", "like.write", "bookmark.read", "bookmark.write", "offline.access"].join(" ");
const LS_VERIFIER_KEY = "me-ai:twitter-pkce-verifier";
const LS_STATE_KEY = "me-ai:twitter-pkce-state";

let _clientId: string | null = null;
let _redirectUri: string | null = null;

function generateRandomString(length: number = 64): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("").slice(0, length);
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const data = new TextEncoder().encode(plain);
  return crypto.subtle.digest("SHA-256", data);
}

function base64UrlEncode(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const hash = await sha256(verifier);
  return base64UrlEncode(hash);
}

async function saveToken(accessToken: string, refreshToken: string | undefined, expiresIn: number): Promise<void> {
  await coreSaveTwitterToken(accessToken, refreshToken ?? null, expiresIn);
}

async function clearSavedToken(): Promise<void> {
  await coreClearTwitterToken();
}

/**
 * Initialize Twitter auth with a client ID.
 */
export function initTwitterAuth(clientId: string, redirectUri?: string): void {
  _clientId = clientId;
  _redirectUri = redirectUri ?? `${window.location.origin}/#oauth-twitter`;
}

/**
 * Start the OAuth 2.0 PKCE authorization flow.
 */
export async function requestTwitterAccessToken(): Promise<void> {
  if (!_clientId) throw new Error("Twitter Auth not initialized. Call initTwitterAuth first.");

  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(32);

  localStorage.setItem(LS_VERIFIER_KEY, codeVerifier);
  localStorage.setItem(LS_STATE_KEY, state);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: _clientId,
    redirect_uri: _redirectUri ?? `${window.location.origin}/#oauth-twitter`,
    scope: SCOPES,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  window.location.href = `${TWITTER_AUTH_URL}?${params}`;
}

/**
 * Handle the OAuth callback after Twitter redirects back.
 */
export async function handleTwitterCallback(
  code: string,
  state: string
): Promise<{ access_token: string; refresh_token: string }> {
  const savedState = localStorage.getItem(LS_STATE_KEY);
  const codeVerifier = localStorage.getItem(LS_VERIFIER_KEY);

  localStorage.removeItem(LS_STATE_KEY);
  localStorage.removeItem(LS_VERIFIER_KEY);

  if (!savedState || savedState !== state) {
    throw new Error("Invalid state parameter — possible CSRF attack.");
  }
  if (!codeVerifier) {
    throw new Error("Missing PKCE code verifier — auth flow may have been interrupted.");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: _redirectUri ?? `${window.location.origin}/#oauth-twitter`,
    client_id: _clientId!,
    code_verifier: codeVerifier,
  });

  const res = await fetch(TWITTER_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error_description?: string; error?: string };
    throw new Error(err.error_description || err.error || `Token exchange failed: ${res.status}`);
  }

  const data = (await res.json()) as { access_token: string; refresh_token: string; expires_in?: number };
  await saveToken(data.access_token, data.refresh_token, data.expires_in ?? 7200);

  return { access_token: data.access_token, refresh_token: data.refresh_token };
}

/**
 * Restore a previously saved token if it hasn't expired.
 */
export async function getSavedTwitterToken(): Promise<{ access_token: string; refresh_token?: string } | null> {
  const token = await coreGetTwitterToken();
  if (token) return token;
  // Try raw (possibly expired) — attempt refresh
  const raw = await coreGetTwitterTokenRaw();
  if (raw?.refresh_token) {
    try {
      await refreshTwitterToken(raw.refresh_token);
      return coreGetTwitterToken();
    } catch (_e) {
      console.warn("Twitter token refresh failed:", _e);
      await coreClearTwitterToken();
      return null;
    }
  }
  return null;
}

/**
 * Refresh the Twitter access token using the refresh token.
 */
async function refreshTwitterToken(
  refreshTokenOverride?: string
): Promise<{ access_token: string; refresh_token: string }> {
  let refreshTok = refreshTokenOverride;
  if (!refreshTok) {
    const raw = await coreGetTwitterTokenRaw();
    refreshTok = raw?.refresh_token;
  }
  if (!refreshTok) throw new Error("No refresh token available.");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshTok,
    client_id: _clientId!,
  });

  const res = await fetch(TWITTER_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error_description?: string; error?: string };
    throw new Error(err.error_description || err.error || `Token refresh failed: ${res.status}`);
  }

  const data = (await res.json()) as { access_token: string; refresh_token?: string; expires_in?: number };
  await saveToken(data.access_token, data.refresh_token ?? refreshTok, data.expires_in ?? 7200);
  return { access_token: data.access_token, refresh_token: data.refresh_token ?? refreshTok };
}

export async function revokeTwitterToken(): Promise<void> {
  const token = await coreGetTwitterTokenRaw();
  if (token?.access_token && _clientId) {
    try {
      await fetch(TWITTER_REVOKE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token: token.access_token, client_id: _clientId }),
      });
    } catch {
      /* ignore */
    }
  }
  await clearSavedToken();
}
