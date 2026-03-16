/**
 * Google Identity Services (GIS) OAuth wrapper.
 * Browser-only — no server required.
 *
 * Uses the "implicit grant" flow via google.accounts.oauth2.initTokenClient
 * to get an access_token directly in the browser.
 *
 * Token is persisted in two places for reliability:
 *   1. localStorage  — synchronous, survives reloads instantly (primary read source)
 *   2. IndexedDB     — async, kept in sync for consistency with the rest of the app
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
          }) => { requestAccessToken: (opts?: { prompt?: string }) => void };
          revoke: (token: string, done: () => void) => void;
        };
      };
    };
  }
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";
const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.modify";
const LS_KEY = "me-ai:oauth-token";
const EXPIRY_MARGIN_MS = 5 * 60 * 1000;

type TokenClient = { requestAccessToken: (opts?: { prompt?: string }) => void };
let tokenClient: TokenClient | null = null;
let _pendingResolve: ((response: GoogleTokenResponse) => void) | null = null;
let _expiresAt = 0;

function _lsSave(accessToken: string, expiresAt: number): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ access_token: accessToken, expires_at: expiresAt }));
  } catch {
    /* ignore */
  }
}

function _lsClear(): void {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {
    /* ignore */
  }
}

function _lsRead(): { access_token: string; expires_at: number } | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { access_token: string; expires_at: number };
  } catch {
    return null;
  }
}

async function saveToken(accessToken: string, expiresIn: number): Promise<void> {
  _expiresAt = Date.now() + expiresIn * 1000;
  _lsSave(accessToken, _expiresAt);
  try {
    const { saveSettings, SettingValue, GoogleToken } = await import("./core.js");
    const token = new GoogleToken(accessToken, _expiresAt);
    const sv = new SettingValue();
    sv.googleToken = token;
    await saveSettings(sv);
  } catch {
    /* ignore */
  }
}

async function clearSavedToken(): Promise<void> {
  _expiresAt = 0;
  _lsClear();
  try {
    const { removeSetting } = await import("./core.js");
    await removeSetting("me-ai:oauth-token");
  } catch {
    /* ignore */
  }
}

/**
 * Restore a previously saved token if it hasn't expired.
 */
export async function getSavedToken(): Promise<{ access_token: string } | null> {
  const ls = _lsRead();
  if (ls?.access_token && Date.now() < ls.expires_at - EXPIRY_MARGIN_MS) {
    _expiresAt = ls.expires_at;
    return { access_token: ls.access_token };
  }

  try {
    const { loadSettings } = await import("./core.js");
    const sv = await loadSettings();
    const data = sv.googleToken;
    if (!data) {
      _lsClear();
      return null;
    }
    const access_token = data.accessToken;
    const expires_at = data.expiresAt;
    if (!access_token || !expires_at || Date.now() > expires_at - EXPIRY_MARGIN_MS) {
      await clearSavedToken();
      return null;
    }
    _expiresAt = expires_at;
    _lsSave(access_token, expires_at);
    return { access_token };
  } catch {
    await clearSavedToken();
    return null;
  }
}

export function isTokenValid(): boolean {
  return _expiresAt > 0 && Date.now() < _expiresAt - EXPIRY_MARGIN_MS;
}

export function getTokenTTL(): number {
  if (_expiresAt <= 0) return 0;
  return Math.max(0, _expiresAt - EXPIRY_MARGIN_MS - Date.now());
}

export function refreshToken(): Promise<{ access_token: string; expires_in: number }> {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error("Google Auth not initialized."));
      return;
    }

    _pendingResolve = async (response: GoogleTokenResponse) => {
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

    tokenClient.requestAccessToken({ prompt: "" });
  });
}

function loadGisScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${GIS_SCRIPT_URL}"]`);
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

export async function initGoogleAuth(clientId: string): Promise<void> {
  await loadGisScript();

  tokenClient = window.google!.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: GMAIL_SCOPE,
    callback: (response: GoogleTokenResponse) => {
      if (_pendingResolve) {
        _pendingResolve(response);
        _pendingResolve = null;
      }
    },
  });
}

export function requestAccessToken(): Promise<{ access_token: string; expires_in: number }> {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error("Google Auth not initialized. Call initGoogleAuth first."));
      return;
    }

    _pendingResolve = async (response: GoogleTokenResponse) => {
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

export async function revokeToken(token: string): Promise<void> {
  await clearSavedToken();
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(token, () => resolve());
    } else {
      resolve();
    }
  });
}
