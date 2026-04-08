/**
 * Twitter/X OAuth 2.0 PKCE — browser-only wiring (IndexedDB + redirect).
 * PKCE material is stored via me-ai-core until the callback; token exchange, refresh, and revoke are in Rust.
 */

import { getCore } from "./store/core-store.js";

function defaultRedirectUri(): string {
  return `${window.location.origin}/#oauth-twitter`;
}

/**
 * Start the OAuth 2.0 PKCE flow (redirects the browser).
 */
export async function requestTwitterAccessToken(
  clientId: string,
  redirectUri?: string
): Promise<void> {
  const uri = redirectUri ?? defaultRedirectUri();
  const start = getCore().twitterOAuthBeginLogin(clientId, uri);
  await getCore().saveTwitterPkcePending(start.verifier, start.state);
  window.location.href = start.authorizeUrl;
}

/**
 * Complete OAuth after Twitter redirects back.
 */
export async function handleTwitterCallback(
  code: string,
  state: string,
  clientId: string,
  redirectUri?: string
): Promise<{ access_token: string; refresh_token: string }> {
  const pending = await getCore().takeTwitterPkcePending();
  if (!pending) {
    throw new Error("Missing PKCE session — auth flow may have been interrupted.");
  }
  if (pending.state !== state) {
    throw new Error("Invalid state parameter — possible CSRF attack.");
  }

  const uri = redirectUri ?? defaultRedirectUri();
  const tokens = await getCore().twitterOAuthExchangeCode(clientId, uri, code, pending.verifier);
  return {
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken ?? "",
  };
}

type SessionObj = { accessToken?: string; refreshToken?: string };

export async function getSavedTwitterToken(): Promise<{
  access_token: string;
  refresh_token?: string;
} | null> {
  const v = (await getCore().twitterOAuthSession()) as SessionObj | null | undefined;
  if (v == null || typeof v !== "object" || !v.accessToken) {
    return null;
  }
  return { access_token: v.accessToken, refresh_token: v.refreshToken };
}

export async function revokeTwitterToken(): Promise<void> {
  await getCore().twitterOAuthRevoke();
}
