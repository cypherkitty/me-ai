/**
 * Twitter/X OAuth 2.0 PKCE — browser-only wiring (localStorage + redirect).
 * PKCE, token exchange, refresh, and revoke are implemented in me-ai-core (Rust).
 */

import { getCore } from "./store/core-store.js";

const LS_VERIFIER_KEY = "me-ai:twitter-pkce-verifier";
const LS_STATE_KEY = "me-ai:twitter-pkce-state";

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
  localStorage.setItem(LS_VERIFIER_KEY, start.verifier);
  localStorage.setItem(LS_STATE_KEY, start.state);
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

  const uri = redirectUri ?? defaultRedirectUri();
  const tokens = await getCore().twitterOAuthExchangeCode(clientId, uri, code, codeVerifier);
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
