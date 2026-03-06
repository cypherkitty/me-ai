/**
 * Twitter/X OAuth 2.0 PKCE Authentication
 * Browser-only — no server required.
 *
 * Uses the Authorization Code Flow with PKCE (Proof Key for Code Exchange)
 * for public clients (SPAs). No client_secret needed.
 *
 * Token is persisted in two places for reliability:
 *   1. localStorage  — synchronous, survives reloads instantly
 *   2. DuckDB/OPFS   — async, kept in sync for consistency
 */

const TWITTER_AUTH_URL = "https://twitter.com/i/oauth2/authorize";
const TWITTER_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";
const TWITTER_REVOKE_URL = "https://api.twitter.com/2/oauth2/revoke";

const SCOPES = ["tweet.read", "users.read", "like.read", "like.write", "bookmark.read", "bookmark.write", "offline.access"].join(" ");
const LS_TOKEN_KEY = "me-ai:twitter-token";
const LS_VERIFIER_KEY = "me-ai:twitter-pkce-verifier";
const LS_STATE_KEY = "me-ai:twitter-pkce-state";
const SETTINGS_TOKEN_KEY = "me-ai:twitter-token";
const EXPIRY_MARGIN_MS = 5 * 60 * 1000; // 5 min buffer

let _clientId = null;
let _redirectUri = null;
let _expiresAt = 0;

// ── PKCE helpers ────────────────────────────────────────────────────

function generateRandomString(length = 64) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("").slice(0, length);
}

async function sha256(plain) {
    const data = new TextEncoder().encode(plain);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return hash;
}

function base64UrlEncode(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    let str = "";
    for (const b of bytes) str += String.fromCharCode(b);
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function generateCodeChallenge(verifier) {
    const hash = await sha256(verifier);
    return base64UrlEncode(hash);
}

// ── localStorage helpers ────────────────────────────────────────────

function _lsSave(tokenData) {
    try {
        localStorage.setItem(LS_TOKEN_KEY, JSON.stringify(tokenData));
    } catch { }
}

function _lsClear() {
    try { localStorage.removeItem(LS_TOKEN_KEY); } catch { }
}

function _lsRead() {
    try {
        const raw = localStorage.getItem(LS_TOKEN_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch { return null; }
}

// ── Token persistence ───────────────────────────────────────────────

async function saveToken(accessToken, refreshToken, expiresIn) {
    const expiresAt = Date.now() + expiresIn * 1000;
    _expiresAt = expiresAt;
    const data = { access_token: accessToken, refresh_token: refreshToken, expires_at: expiresAt };
    _lsSave(data);
    try {
        const { setSetting } = await import("./store/settings.js");
        await setSetting(SETTINGS_TOKEN_KEY, data);
        const { checkpoint } = await import("./store/db.js");
        await checkpoint();
    } catch { }
}

async function clearSavedToken() {
    _expiresAt = 0;
    _lsClear();
    try {
        const { removeSetting } = await import("./store/settings.js");
        await removeSetting(SETTINGS_TOKEN_KEY);
    } catch { }
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Initialize Twitter auth with a client ID.
 * @param {string} clientId - Twitter OAuth 2.0 Client ID
 * @param {string} [redirectUri] - Redirect URI (defaults to current origin + /#oauth-twitter)
 */
export function initTwitterAuth(clientId, redirectUri) {
    _clientId = clientId;
    _redirectUri = redirectUri || `${window.location.origin}/#oauth-twitter`;
}

/**
 * Start the OAuth 2.0 PKCE authorization flow.
 * Redirects the user to Twitter's authorization page.
 */
export async function requestTwitterAccessToken() {
    if (!_clientId) throw new Error("Twitter Auth not initialized. Call initTwitterAuth first.");

    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateRandomString(32);

    // Save PKCE verifier and state for the callback
    localStorage.setItem(LS_VERIFIER_KEY, codeVerifier);
    localStorage.setItem(LS_STATE_KEY, state);

    const params = new URLSearchParams({
        response_type: "code",
        client_id: _clientId,
        redirect_uri: _redirectUri,
        scope: SCOPES,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
    });

    window.location.href = `${TWITTER_AUTH_URL}?${params}`;
}

/**
 * Handle the OAuth callback after Twitter redirects back.
 * Exchanges the authorization code for an access token.
 *
 * @param {string} code - Authorization code from the redirect
 * @param {string} state - State parameter from the redirect
 * @returns {Promise<{access_token: string, refresh_token: string}>}
 */
export async function handleTwitterCallback(code, state) {
    const savedState = localStorage.getItem(LS_STATE_KEY);
    const codeVerifier = localStorage.getItem(LS_VERIFIER_KEY);

    // Cleanup PKCE state
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
        redirect_uri: _redirectUri || `${window.location.origin}/#oauth-twitter`,
        client_id: _clientId,
        code_verifier: codeVerifier,
    });

    const res = await fetch(TWITTER_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error_description || err.error || `Token exchange failed: ${res.status}`);
    }

    const data = await res.json();
    await saveToken(data.access_token, data.refresh_token, data.expires_in || 7200);

    return { access_token: data.access_token, refresh_token: data.refresh_token };
}

/**
 * Restore a previously saved token if it hasn't expired.
 * @returns {Promise<{access_token: string, refresh_token: string}|null>}
 */
export async function getSavedTwitterToken() {
    // Fast path: localStorage
    const ls = _lsRead();
    if (ls?.access_token && Date.now() < ls.expires_at - EXPIRY_MARGIN_MS) {
        _expiresAt = ls.expires_at;
        return { access_token: ls.access_token, refresh_token: ls.refresh_token };
    }

    // Slow path: DuckDB
    try {
        const { getSetting } = await import("./store/settings.js");
        const data = await getSetting(SETTINGS_TOKEN_KEY);
        if (!data?.access_token) { _lsClear(); return null; }
        if (Date.now() > data.expires_at - EXPIRY_MARGIN_MS) {
            // Token expired — try refresh
            if (data.refresh_token) {
                try {
                    return await refreshTwitterToken(data.refresh_token);
                } catch {
                    await clearSavedToken();
                    return null;
                }
            }
            await clearSavedToken();
            return null;
        }
        _expiresAt = data.expires_at;
        _lsSave(data);
        return { access_token: data.access_token, refresh_token: data.refresh_token };
    } catch {
        await clearSavedToken();
        return null;
    }
}

/**
 * Check whether the current Twitter token is still valid.
 */
export function isTwitterTokenValid() {
    return _expiresAt > 0 && Date.now() < _expiresAt - EXPIRY_MARGIN_MS;
}

/**
 * Refresh the Twitter access token using the refresh token.
 * @param {string} [refreshTokenOverride] - Optional refresh token (uses saved one if not provided)
 * @returns {Promise<{access_token: string, refresh_token: string}>}
 */
export async function refreshTwitterToken(refreshTokenOverride) {
    let refreshTok = refreshTokenOverride;
    if (!refreshTok) {
        const ls = _lsRead();
        refreshTok = ls?.refresh_token;
    }
    if (!refreshTok) throw new Error("No refresh token available.");

    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshTok,
        client_id: _clientId,
    });

    const res = await fetch(TWITTER_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error_description || err.error || `Token refresh failed: ${res.status}`);
    }

    const data = await res.json();
    await saveToken(data.access_token, data.refresh_token || refreshTok, data.expires_in || 7200);
    return { access_token: data.access_token, refresh_token: data.refresh_token || refreshTok };
}

/**
 * Revoke the Twitter token and clear saved session.
 */
export async function revokeTwitterToken() {
    const ls = _lsRead();
    if (ls?.access_token && _clientId) {
        try {
            await fetch(TWITTER_REVOKE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ token: ls.access_token, client_id: _clientId }),
            });
        } catch { }
    }
    await clearSavedToken();
}
