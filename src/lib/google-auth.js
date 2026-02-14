/**
 * Google Identity Services (GIS) OAuth wrapper.
 * Browser-only — no server required.
 *
 * Uses the "implicit grant" flow via google.accounts.oauth2.initTokenClient
 * to get an access_token directly in the browser.
 */

const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";
const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

let tokenClient = null;
let _pendingResolve = null;

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
 * Revoke the given access token.
 */
export function revokeToken(token) {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      google.accounts.oauth2.revoke(token, () => resolve());
    } else {
      resolve();
    }
  });
}
