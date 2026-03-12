/**
 * Thin wrapper around the Twitter/X API v2.
 * All functions take an OAuth access_token as the first argument.
 */

const BASE = "https://api.twitter.com/2";

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

function authHeaders(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}

async function api<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { detail?: string; title?: string; type?: string };
    const message = body.detail || body.title || `Twitter API error: ${res.status}`;
    const code = body.type ?? undefined;
    throw new TwitterApiError(message, res.status, code);
  }
  return res.json() as Promise<T>;
}

async function apiPost<T>(token: string, path: string, body: object | null = null): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errBody = (await res.json().catch(() => ({}))) as { detail?: string; title?: string };
    const message = errBody.detail || errBody.title || `Twitter API error: ${res.status}`;
    throw new TwitterApiError(message, res.status);
  }
  return res.json() as Promise<T>;
}

async function apiDelete<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const errBody = (await res.json().catch(() => ({}))) as { detail?: string; title?: string };
    const message = errBody.detail || errBody.title || `Twitter API error: ${res.status}`;
    throw new TwitterApiError(message, res.status);
  }
  return res.json() as Promise<T>;
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

/**
 * Get authenticated user's profile.
 */
export function getMe(token: string): Promise<ApiResponse<TwitterUser>> {
  return api(token, "/users/me?user.fields=id,name,username,profile_image_url,public_metrics");
}

export interface TimelineOptions {
  maxResults?: number;
  paginationToken?: string;
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
  const params = new URLSearchParams({
    max_results: String(Math.min(maxResults, 100)),
    "tweet.fields": "created_at,author_id,public_metrics,referenced_tweets,conversation_id,text",
    "user.fields": "username,name",
    expansions: "author_id",
  });
  if (paginationToken) params.set("pagination_token", paginationToken);
  return api(token, `/users/${userId}/tweets?${params}`);
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
  const params = new URLSearchParams({
    max_results: String(Math.min(maxResults, 100)),
    "tweet.fields": "created_at,author_id,public_metrics,text",
    "user.fields": "username,name",
    expansions: "author_id",
  });
  if (paginationToken) params.set("pagination_token", paginationToken);
  return api(token, `/users/${userId}/mentions?${params}`);
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
  const params = new URLSearchParams({
    query,
    max_results: String(Math.min(maxResults, 100)),
    "tweet.fields": "created_at,author_id,public_metrics,text",
    "user.fields": "username,name",
    expansions: "author_id",
  });
  return api(token, `/tweets/search/recent?${params}`);
}

/**
 * Get a single tweet by ID.
 */
export function getTweet(token: string, tweetId: string): Promise<ApiResponse<Tweet>> {
  return api(
    token,
    `/tweets/${tweetId}?tweet.fields=created_at,author_id,public_metrics,referenced_tweets,text&user.fields=username,name&expansions=author_id`
  );
}

export function likeTweet(token: string, userId: string, tweetId: string): Promise<unknown> {
  return apiPost(token, `/users/${userId}/likes`, { tweet_id: tweetId });
}

export function unlikeTweet(token: string, userId: string, tweetId: string): Promise<unknown> {
  return apiDelete(token, `/users/${userId}/likes/${tweetId}`);
}

export function retweet(token: string, userId: string, tweetId: string): Promise<unknown> {
  return apiPost(token, `/users/${userId}/retweets`, { tweet_id: tweetId });
}

export function unretweet(token: string, userId: string, tweetId: string): Promise<unknown> {
  return apiDelete(token, `/users/${userId}/retweets/${tweetId}`);
}

export function bookmarkTweet(token: string, userId: string, tweetId: string): Promise<unknown> {
  return apiPost(token, `/users/${userId}/bookmarks`, { tweet_id: tweetId });
}

export function removeBookmark(token: string, userId: string, tweetId: string): Promise<unknown> {
  return apiDelete(token, `/users/${userId}/bookmarks/${tweetId}`);
}

export function muteUser(token: string, sourceUserId: string, targetUserId: string): Promise<unknown> {
  return apiPost(token, `/users/${sourceUserId}/muting`, { target_user_id: targetUserId });
}

export function blockUser(token: string, sourceUserId: string, targetUserId: string): Promise<unknown> {
  return apiPost(token, `/users/${sourceUserId}/blocking`, { target_user_id: targetUserId });
}

export interface UserInfo {
  username: string;
  name: string;
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
