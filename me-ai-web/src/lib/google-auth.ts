/**
 * Google Identity Services (GIS) OAuth wrapper.
 * Browser-only — no server required.
 *
 * Uses the "implicit grant" flow via google.accounts.oauth2.initTokenClient
 * to get an access_token directly in the browser.
 *
 * Token is persisted in IndexedDB via me-ai-core WASM token management.
 */

import type { GoogleTokenResponse } from "./core.js";
import { getCore } from "./store/core-store.js";

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

const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";
const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.modify";

type TokenClient = { requestAccessToken: (opts?: { prompt?: string }) => void };
let tokenClient: TokenClient | null = null;
let _pendingResolve: ((response: GoogleTokenResponse) => void) | null = null;

async function saveToken(accessToken: string, expiresIn: number): Promise<void> {
  await getCore().saveGoogleToken(accessToken, expiresIn);
}

async function clearSavedToken(): Promise<void> {
  await getCore().clearGoogleToken();
}

/**
 * Restore a previously saved token if it hasn't expired.
 */
export async function getSavedToken(): Promise<{ access_token: string } | null> {
  const token = await getCore().getGoogleToken();
  if (!token) return null;
  return { access_token: token.accessToken };
}

export async function isTokenValid(): Promise<boolean> {
  return getCore().isGoogleTokenValid();
}

export async function getTokenTTL(): Promise<number> {
  return getCore().getGoogleTokenTTL();
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
