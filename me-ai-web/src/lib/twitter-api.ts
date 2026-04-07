/**
 * Thin wrapper around the Twitter/X API v2 — delegates all HTTP to me-ai-core (Rust/WASM).
 */

import { getCore } from "./store/core-store.js";
import type { TwitterUser, Tweet, ApiResponse, TimelineOptions, TwitterUserInfo } from "./core.js";

function requireCore() {
  return getCore();
}

/**
 * Get authenticated user's profile.
 */
export function getMe(token: string): Promise<ApiResponse<TwitterUser>> {
  return requireCore().getTwitterMe(token) as unknown as Promise<ApiResponse<TwitterUser>>;
}

/**
 * Get a user's timeline (their tweets and retweets).
 */
export function getUserTimeline(
  token: string,
  userId: string,
  options: TimelineOptions = {}
): Promise<ApiResponse<Tweet[]>> {
  const { maxResults = 10, paginationToken } = options;
  return requireCore().getTwitterTimeline(
    token,
    userId,
    Math.min(maxResults, 100),
    paginationToken ?? null
  ) as unknown as Promise<ApiResponse<Tweet[]>>;
}

/**
 * Resolve author usernames from the `includes.users` expansion.
 */
export function buildUserMap(response: ApiResponse<unknown>): Map<string, TwitterUserInfo> {
  const map = new Map<string, TwitterUserInfo>();
  const users = response?.includes?.users as
    | { id: string; username: string; name: string }[]
    | undefined;
  if (users) {
    for (const u of users) {
      map.set(u.id, { username: u.username, name: u.name });
    }
  }
  return map;
}
