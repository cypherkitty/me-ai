/**
 * Thin wrapper around the Twitter/X API v2 — delegates all HTTP to me-ai-core (Rust/WASM).
 */

import { getCore } from "./store/core-store.js";

function requireCore() {
  return getCore();
}

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  public_metrics?: unknown;
}

interface Tweet {
  id: string;
  text: string;
  author_id?: string;
  created_at?: string;
  public_metrics?: unknown;
  referenced_tweets?: unknown[];
  conversation_id?: string;
}

interface ApiResponse<T> {
  data?: T;
  includes?: { users?: TwitterUser[] };
  meta?: { next_token?: string; result_count?: number };
}

interface TimelineOptions {
  maxResults?: number;
  paginationToken?: string;
}

interface UserInfo {
  username: string;
  name: string;
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
  return requireCore().getTwitterTimeline(token, userId, Math.min(maxResults, 100), paginationToken ?? null) as unknown as Promise<ApiResponse<Tweet[]>>;
}

/**
 * Resolve author usernames from the `includes.users` expansion.
 */
export function buildUserMap(response: ApiResponse<unknown>): Map<string, UserInfo> {
  const map = new Map<string, UserInfo>();
  const users = response?.includes?.users as { id: string; username: string; name: string }[] | undefined;
  if (users) {
    for (const u of users) {
      map.set(u.id, { username: u.username, name: u.name });
    }
  }
  return map;
}
