/**
 * Thin wrapper around the Twitter/X API v2.
 * All functions take an OAuth access_token as the first argument.
 * No SDK needed — just fetch() with Bearer token.
 */

const BASE = "https://api.twitter.com/2";

/**
 * Typed error for Twitter API failures.
 */
export class TwitterApiError extends Error {
    constructor(message, status, code) {
        super(message);
        this.name = "TwitterApiError";
        this.status = status;
        this.code = code || null;
    }
}

function authHeaders(token) {
    return { Authorization: `Bearer ${token}` };
}

async function api(token, path) {
    const res = await fetch(`${BASE}${path}`, {
        headers: authHeaders(token),
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message = body.detail || body.title || `Twitter API error: ${res.status}`;
        const code = body.type || undefined;
        throw new TwitterApiError(message, res.status, code);
    }
    return res.json();
}

async function apiPost(token, path, body = null) {
    const res = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: { ...authHeaders(token), "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message = errBody.detail || errBody.title || `Twitter API error: ${res.status}`;
        throw new TwitterApiError(message, res.status);
    }
    return res.json();
}

async function apiDelete(token, path) {
    const res = await fetch(`${BASE}${path}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
    if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message = errBody.detail || errBody.title || `Twitter API error: ${res.status}`;
        throw new TwitterApiError(message, res.status);
    }
    return res.json();
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Get authenticated user's profile.
 * Returns { data: { id, name, username, profile_image_url, ... } }
 */
export function getMe(token) {
    return api(token, "/users/me?user.fields=id,name,username,profile_image_url,public_metrics");
}

/**
 * Get a user's timeline (their tweets and retweets).
 * @param {string} token
 * @param {string} userId
 * @param {object} options
 * @returns {Promise<{data: Tweet[], meta: {next_token, result_count}}>}
 */
export function getUserTimeline(token, userId, { maxResults = 10, paginationToken } = {}) {
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
export function getUserMentions(token, userId, { maxResults = 10, paginationToken } = {}) {
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
export function searchRecentTweets(token, query, { maxResults = 10 } = {}) {
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
export function getTweet(token, tweetId) {
    return api(
        token,
        `/tweets/${tweetId}?tweet.fields=created_at,author_id,public_metrics,referenced_tweets,text&user.fields=username,name&expansions=author_id`
    );
}

// ── Write actions ───────────────────────────────────────────────────

/**
 * Like a tweet.
 * @param {string} token
 * @param {string} userId - The authenticated user's ID
 * @param {string} tweetId
 */
export function likeTweet(token, userId, tweetId) {
    return apiPost(token, `/users/${userId}/likes`, { tweet_id: tweetId });
}

/**
 * Unlike a tweet.
 */
export function unlikeTweet(token, userId, tweetId) {
    return apiDelete(token, `/users/${userId}/likes/${tweetId}`);
}

/**
 * Retweet a tweet.
 */
export function retweet(token, userId, tweetId) {
    return apiPost(token, `/users/${userId}/retweets`, { tweet_id: tweetId });
}

/**
 * Undo a retweet.
 */
export function unretweet(token, userId, tweetId) {
    return apiDelete(token, `/users/${userId}/retweets/${tweetId}`);
}

/**
 * Bookmark a tweet.
 */
export function bookmarkTweet(token, userId, tweetId) {
    return apiPost(token, `/users/${userId}/bookmarks`, { tweet_id: tweetId });
}

/**
 * Remove a bookmark.
 */
export function removeBookmark(token, userId, tweetId) {
    return apiDelete(token, `/users/${userId}/bookmarks/${tweetId}`);
}

/**
 * Mute a user.
 */
export function muteUser(token, sourceUserId, targetUserId) {
    return apiPost(token, `/users/${sourceUserId}/muting`, { target_user_id: targetUserId });
}

/**
 * Block a user.
 */
export function blockUser(token, sourceUserId, targetUserId) {
    return apiPost(token, `/users/${sourceUserId}/blocking`, { target_user_id: targetUserId });
}

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Resolve author usernames from the `includes.users` expansion.
 * @param {object} response - API response with `data` and `includes`
 * @returns {Map<string, {username: string, name: string}>}
 */
export function buildUserMap(response) {
    const map = new Map();
    if (response?.includes?.users) {
        for (const u of response.includes.users) {
            map.set(u.id, { username: u.username, name: u.name });
        }
    }
    return map;
}
