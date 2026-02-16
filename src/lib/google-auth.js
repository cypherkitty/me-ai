/**
 * Google Identity Services (GIS) OAuth wrapper.
 * Browser-only — no server required.
 *
 * Uses the "implicit grant" flow via google.accounts.oauth2.initTokenClient
 * to get an access_token directly in the browser.
 *
 * Token is persisted in sessionStorage for the life of the browser tab,
 * so navigating between pages or refreshing doesn't require re-auth.
 * The token is cleared automatically when the tab/browser is closed.
 */

const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";
const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
const TOKEN_KEY = "me-ai:oauth-token";
const EXPIRY_MARGIN_MS = 5 * 60 * 1000; // 5 min buffer before actual expiry

let tokenClient = null;
let _pendingResolve = null;
let _expiresAt = 0; // in-memory expiry tracker (epoch ms)

// ── Session persistence helpers ─────────────────────────────────────

function saveToken(accessToken, expiresIn) {
  _expiresAt = Date.now() + expiresIn * 1000;
  try {
    sessionStorage.setItem(
      TOKEN_KEY,
      JSON.stringify({ access_token: accessToken, expires_at: _expiresAt })
    );
  } catch {}
}

function clearSavedToken() {
  _expiresAt = 0;
  try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
}

/**
 * Restore a previously saved token if it hasn't expired.
 * Returns { access_token } or null.
 */
export function getSavedToken() {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const { access_token, expires_at } = JSON.parse(raw);
    if (!access_token || Date.now() > expires_at - EXPIRY_MARGIN_MS) {
      clearSavedToken();
      return null;
    }
    _expiresAt = expires_at;
    return { access_token };
  } catch {
    clearSavedToken();
    return null;
  }
}

/**
 * Check whether the current token is still valid (not expired).
 * Uses the in-memory expiry timestamp set during save/restore.
 */
export function isTokenValid() {
  return _expiresAt > 0 && Date.now() < _expiresAt - EXPIRY_MARGIN_MS;
}

/**
 * Returns milliseconds until the token expires, or 0 if already expired.
 */
export function getTokenTTL() {
  if (_expiresAt <= 0) return 0;
  return Math.max(0, _expiresAt - EXPIRY_MARGIN_MS - Date.now());
}

/**
 * Attempt a silent token refresh (no popup if user previously consented).
 * Falls back to an interactive popup if the silent attempt fails.
 * Returns { access_token, expires_in } or throws on failure.
 */
export function refreshToken() {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error("Google Auth not initialized."));
      return;
    }

    _pendingResolve = (response) => {
      if (response.error) {
        reject(new Error(response.error_description || response.error));
      } else {
        saveToken(response.access_token, response.expires_in);
        resolve({
          access_token: response.access_token,
          expires_in: response.expires_in,
        });
      }
    };

    // prompt: '' → silent refresh (no popup if consent was previously granted)
    tokenClient.requestAccessToken({ prompt: "" });
  });
}

// ── Load GIS script dynamically ─────────────────────────────────────
function loadGisScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const existing = document.querySelector(
      `script[src="${GIS_SCRIPT_URL}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Google Identity Services"))
      );
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Load the GIS library and create the token client.
 * Must be called once before requestAccessToken().
 */
export async function initGoogleAuth(clientId) {
  await loadGisScript();

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: GMAIL_SCOPE,
    callback: (response) => {
      if (_pendingResolve) {
        _pendingResolve(response);
        _pendingResolve = null;
      }
    },
  });
}

/**
 * Opens the Google OAuth consent popup and returns the token response.
 * The token is automatically saved to sessionStorage for persistence.
 * Resolves with { access_token, expires_in } on success.
 */
export function requestAccessToken() {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(
        new Error("Google Auth not initialized. Call initGoogleAuth first.")
      );
      return;
    }

    _pendingResolve = (response) => {
      if (response.error) {
        reject(new Error(response.error_description || response.error));
      } else {
        saveToken(response.access_token, response.expires_in);
        resolve({
          access_token: response.access_token,
          expires_in: response.expires_in,
        });
      }
    };

    tokenClient.requestAccessToken();
  });
}

/**
 * Revoke the given access token and clear saved session.
 */
export function revokeToken(token) {
  clearSavedToken();
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      google.accounts.oauth2.revoke(token, () => resolve());
    } else {
      resolve();
    }
  });
}
