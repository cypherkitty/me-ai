/**
 * Google Identity Services (GIS) OAuth wrapper.
 * Browser-only — no server required.
 *
 * Uses the "implicit grant" flow via google.accounts.oauth2.initTokenClient
 * to get an access_token directly in the browser.
 *
 * Token is persisted in IndexedDB (settings table) so it survives page
 * navigation and refreshes. Cleared on revoke or expiry.
 */

const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";
const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.modify";
const TOKEN_KEY = "me-ai:oauth-token";
const EXPIRY_MARGIN_MS = 5 * 60 * 1000; // 5 min buffer before actual expiry

let tokenClient = null;
let _pendingResolve = null;
let _expiresAt = 0; // in-memory expiry tracker (epoch ms)

// ── Token persistence via IndexedDB ─────────────────────────────────

async function saveToken(accessToken, expiresIn) {
  _expiresAt = Date.now() + expiresIn * 1000;
  const { setSetting } = await import("./store/settings.js");
  await setSetting(TOKEN_KEY, { access_token: accessToken, expires_at: _expiresAt });
}

async function clearSavedToken() {
  _expiresAt = 0;
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  const { removeSetting } = await import("./store/settings.js");
  await removeSetting(TOKEN_KEY);
}

/**
 * Restore a previously saved token if it hasn't expired.
 * Returns { access_token } or null.
 */
export async function getSavedToken() {
  try {
    const { getSetting, setSetting } = await import("./store/settings.js");
    let data = await getSetting(TOKEN_KEY);
    
    // Fallback/Migration: Check sessionStorage/localStorage
    if (!data) {
      const legacyData = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
      if (legacyData) {
        data = JSON.parse(legacyData);
        // Migrate to IndexedDB
        if (data && data.access_token && data.expires_at) {
          await setSetting(TOKEN_KEY, data);
        }
      }
    }

    if (!data) return null;
    const { access_token, expires_at } = data;
    if (!access_token || Date.now() > expires_at - EXPIRY_MARGIN_MS) {
      await clearSavedToken();
      return null;
    }
    _expiresAt = expires_at;
    return { access_token };
  } catch {
    await clearSavedToken();
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

    _pendingResolve = async (response) => {
      if (response.error) {
        reject(new Error(response.error_description || response.error));
      } else {
        await saveToken(response.access_token, response.expires_in);
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

    _pendingResolve = async (response) => {
      if (response.error) {
        reject(new Error(response.error_description || response.error));
      } else {
        await saveToken(response.access_token, response.expires_in);
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
export async function revokeToken(token) {
  await clearSavedToken();
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      google.accounts.oauth2.revoke(token, () => resolve());
    } else {
      resolve();
    }
  });
}
