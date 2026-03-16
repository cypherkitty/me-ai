/**
 * Thin wrapper around the Twitter/X API v2 — delegates all HTTP to me-ai-core (Rust/WASM).
 */

import { getCore } from "./store/core-store.js";

function requireCore() {
  return getCore();
}

export class TwitterApiError extends Error {
  status: number;
  code: string | null;
  constructor(message: string, status: number, code?: string | null) {
    super(message);
    this.name = "TwitterApiError";
    this.status = status;
    this.code = code ?? null;
  }
}

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  public_metrics?: unknown;
}

export interface Tweet {
  id: string;
  text: string;
  author_id?: string;
  created_at?: string;
  public_metrics?: unknown;
  referenced_tweets?: unknown[];
  conversation_id?: string;
}

export interface ApiResponse<T> {
  data?: T;
  includes?: { users?: TwitterUser[] };
  meta?: { next_token?: string; result_count?: number };
}

export interface TimelineOptions {
  maxResults?: number;
  paginationToken?: string;
}

export interface UserInfo {
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
 * Get tweets mentioning the authenticated user.
 */
export function getUserMentions(
  token: string,
  userId: string,
  options: TimelineOptions = {}
): Promise<ApiResponse<Tweet[]>> {
  const { maxResults = 10, paginationToken } = options;
  return requireCore().getTwitterMentions(token, userId, Math.min(maxResults, 100), paginationToken ?? null) as unknown as Promise<ApiResponse<Tweet[]>>;
}

/**
 * Search recent tweets (last 7 days).
 */
export function searchRecentTweets(
  token: string,
  query: string,
  options: { maxResults?: number } = {}
): Promise<ApiResponse<Tweet[]>> {
  const { maxResults = 10 } = options;
  return requireCore().searchTwitterRecentTweets(token, query, Math.min(maxResults, 100)) as unknown as Promise<ApiResponse<Tweet[]>>;
}

/**
 * Get a single tweet by ID.
 */
export function getTweet(token: string, tweetId: string): Promise<ApiResponse<Tweet>> {
  return requireCore().getTwitterTweet(token, tweetId) as unknown as Promise<ApiResponse<Tweet>>;
}

export function likeTweet(token: string, userId: string, tweetId: string): Promise<unknown> {
  return requireCore().twitterLike(token, userId, tweetId) as unknown as Promise<unknown>;
}

export function unlikeTweet(token: string, userId: string, tweetId: string): Promise<unknown> {
  return requireCore().twitterUnlike(token, userId, tweetId) as unknown as Promise<unknown>;
}

export function retweet(token: string, userId: string, tweetId: string): Promise<unknown> {
  return requireCore().twitterRetweet(token, userId, tweetId) as unknown as Promise<unknown>;
}

export function unretweet(token: string, userId: string, tweetId: string): Promise<unknown> {
  return requireCore().twitterUnretweet(token, userId, tweetId) as unknown as Promise<unknown>;
}

export function bookmarkTweet(token: string, userId: string, tweetId: string): Promise<unknown> {
  return requireCore().twitterBookmark(token, userId, tweetId) as unknown as Promise<unknown>;
}

export function removeBookmark(token: string, userId: string, tweetId: string): Promise<unknown> {
  return requireCore().twitterRemoveBookmark(token, userId, tweetId) as unknown as Promise<unknown>;
}

export function muteUser(token: string, sourceUserId: string, targetUserId: string): Promise<unknown> {
  return requireCore().twitterMuteUser(token, sourceUserId, targetUserId) as unknown as Promise<unknown>;
}

export function blockUser(token: string, sourceUserId: string, targetUserId: string): Promise<unknown> {
  return requireCore().twitterBlockUser(token, sourceUserId, targetUserId) as unknown as Promise<unknown>;
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
