/**
 * Twitter/X sync adapter.
 *
 * Three operations:
 * 1. syncTwitter()     — First time: full sync of user's timeline.
 *                         Subsequent: incremental (fetch newer tweets).
 * 2. syncTwitterMore() — Continue fetching older tweets beyond initial sync.
 * 3. clearTwitterData()— Wipe all local Twitter data.
 *
 * Uses the same `items` table as Gmail with `sourceType = 'twitter'`.
 * Stores syncState in the same `syncState` table.
 */

import { query, exec } from "./db.js";
import { getUserTimeline, getMe, buildUserMap } from "../twitter-api.js";
import { idbPutItems } from "./idb.js";

const DEFAULT_SYNC_LIMIT = 50;

// ── Public API ──────────────────────────────────────────────────────

/**
 * Main sync entry point.
 * @param {string} token - OAuth access token
 * @param {object} options
 * @param {number} [options.limit=50]
 * @param {Function} [options.onProgress]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<{added: number, errors: number}>}
 */
export async function syncTwitter(
    token,
    { limit = DEFAULT_SYNC_LIMIT, onProgress = () => { }, signal } = {}
) {
    throwIfAborted(signal);

    // Get the authenticated user's ID
    const me = await getMe(token);
    const userId = me.data.id;
    const username = me.data.username;

    const state = await getSyncState("twitter");

    if (!state) {
        // First sync — fetch newest tweets
        return await fullSync(token, userId, username, limit, onProgress, signal);
    } else {
        // Incremental — fetch tweets newer than last sync
        return await incrementalSync(token, userId, username, state, limit, onProgress, signal);
    }
}

/**
 * Continue fetching older tweets beyond the initial sync.
 */
export async function syncTwitterMore(
    token,
    { limit = DEFAULT_SYNC_LIMIT, onProgress = () => { }, signal } = {}
) {
    throwIfAborted(signal);

    const me = await getMe(token);
    const userId = me.data.id;
    const username = me.data.username;

    const state = await getSyncState("twitter");
    if (!state?.oldestPageToken) {
        return { added: 0, errors: 0 };
    }

    return await continueFetch(token, userId, username, state, limit, onProgress, signal);
}

/**
 * Get current sync status for Twitter.
 */
export async function getTwitterSyncStatus() {
    const state = await getSyncState("twitter");
    if (!state) {
        return { synced: false, totalItems: 0, lastSyncAt: null, hasMore: false };
    }
    return {
        synced: true,
        totalItems: state.totalItems || 0,
        lastSyncAt: state.lastSyncAt,
        hasMore: !!state.oldestPageToken,
    };
}

/**
 * Clear all Twitter data from the store.
 */
export async function clearTwitterData() {
    await exec(`DELETE FROM items WHERE sourceType = 'twitter'`);
    await exec(`DELETE FROM syncState WHERE sourceType = 'twitter'`);
    // Also clear from IDB
    try {
        const { idbGetAllItems, idbDeleteItems } = await import("./idb.js");
        const all = await idbGetAllItems();
        const twitterIds = all.filter((r) => r.sourceType === "twitter").map((r) => r.id);
        if (twitterIds.length > 0) await idbDeleteItems(twitterIds);
    } catch { }
}

// ── Full sync (initial) ─────────────────────────────────────────────

async function fullSync(token, userId, username, limit, onProgress, signal) {
    let added = 0;
    let errors = 0;
    let paginationToken = undefined;
    let newestId = null;
    let oldestPageToken = null;

    onProgress({ phase: "listing", message: "Fetching tweets…", current: 0, total: limit });

    while (added < limit) {
        throwIfAborted(signal);

        const batchSize = Math.min(limit - added, 100);
        let response;
        try {
            response = await getUserTimeline(token, userId, {
                maxResults: batchSize,
                paginationToken,
            });
        } catch (e) {
            errors++;
            console.warn("[twitter-sync] API error:", e?.message);
            break;
        }

        const tweets = response?.data ?? [];
        if (tweets.length === 0) break;

        const userMap = buildUserMap(response);
        const items = tweets.map((t) => normalizeTweet(t, userMap, username));

        // Track newest tweet for incremental sync
        if (!newestId && items.length > 0) {
            newestId = items[0].sourceId;
        }

        await bulkUpsertItems(items);
        added += items.length;

        onProgress({
            phase: "fetching",
            message: `Downloaded ${added} tweets…`,
            current: added,
            total: limit,
        });

        const nextToken = response?.meta?.next_token;
        if (!nextToken) break;
        paginationToken = nextToken;
        oldestPageToken = nextToken;
    }

    // Save sync state
    await upsertSyncState({
        sourceType: "twitter",
        historyId: newestId || "",
        lastSyncAt: Date.now(),
        totalItems: added,
        oldestPageToken: oldestPageToken || "",
    });

    onProgress({
        phase: "done",
        message: `Synced ${added} tweets`,
        current: added,
        total: added,
    });

    return { added, errors };
}

// ── Incremental sync ────────────────────────────────────────────────

async function incrementalSync(token, userId, username, state, limit, onProgress, signal) {
    let added = 0;
    let errors = 0;
    let paginationToken = undefined;

    onProgress({ phase: "incremental", message: "Checking for new tweets…", current: 0, total: 0 });

    // Fetch newest tweets and stop when we hit a tweet we already have
    while (added < limit) {
        throwIfAborted(signal);

        const batchSize = Math.min(limit - added, 100);
        let response;
        try {
            response = await getUserTimeline(token, userId, {
                maxResults: batchSize,
                paginationToken,
            });
        } catch (e) {
            errors++;
            console.warn("[twitter-sync] Incremental sync error:", e?.message);
            break;
        }

        const tweets = response?.data ?? [];
        if (tweets.length === 0) break;

        const userMap = buildUserMap(response);

        // Filter out tweets we already have (stop at the known newest)
        const newTweets = [];
        let hitKnown = false;
        for (const t of tweets) {
            if (t.id === state.historyId) {
                hitKnown = true;
                break;
            }
            newTweets.push(t);
        }

        if (newTweets.length > 0) {
            const items = newTweets.map((t) => normalizeTweet(t, userMap, username));
            await bulkUpsertItems(items);
            added += items.length;

            onProgress({
                phase: "incremental",
                message: `${added} new tweets…`,
                current: added,
                total: 0,
            });
        }

        if (hitKnown || !response?.meta?.next_token) break;
        paginationToken = response.meta.next_token;
    }

    // Update sync state
    const newTotal = (state.totalItems || 0) + added;
    const newestId = added > 0 ? (await getNewestTweetId()) || state.historyId : state.historyId;

    await upsertSyncState({
        sourceType: "twitter",
        historyId: newestId,
        lastSyncAt: Date.now(),
        totalItems: newTotal,
        oldestPageToken: state.oldestPageToken,
    });

    onProgress({
        phase: "done",
        message: added > 0 ? `${added} new tweets synced` : "Already up to date",
        current: added,
        total: added,
    });

    return { added, errors };
}

// ── Continue fetch (older tweets) ───────────────────────────────────

async function continueFetch(token, userId, username, state, limit, onProgress, signal) {
    let added = 0;
    let errors = 0;
    let paginationToken = state.oldestPageToken;

    onProgress({ phase: "fetching", message: "Fetching older tweets…", current: 0, total: limit });

    while (added < limit && paginationToken) {
        throwIfAborted(signal);

        const batchSize = Math.min(limit - added, 100);
        let response;
        try {
            response = await getUserTimeline(token, userId, {
                maxResults: batchSize,
                paginationToken,
            });
        } catch (e) {
            errors++;
            break;
        }

        const tweets = response?.data ?? [];
        if (tweets.length === 0) break;

        const userMap = buildUserMap(response);
        const items = tweets.map((t) => normalizeTweet(t, userMap, username));
        await bulkUpsertItems(items);
        added += items.length;

        onProgress({
            phase: "fetching",
            message: `Downloaded ${state.totalItems + added} tweets total…`,
            current: added,
            total: limit,
        });

        paginationToken = response?.meta?.next_token || null;
    }

    await upsertSyncState({
        sourceType: "twitter",
        historyId: state.historyId,
        lastSyncAt: Date.now(),
        totalItems: (state.totalItems || 0) + added,
        oldestPageToken: paginationToken || "",
    });

    onProgress({
        phase: "done",
        message: `Fetched ${added} more tweets`,
        current: added,
        total: added,
    });

    return { added, errors };
}

// ── Normalisation ───────────────────────────────────────────────────

function normalizeTweet(tweet, userMap, currentUsername) {
    const author = userMap?.get(tweet.author_id);
    const authorHandle = author?.username || currentUsername || "unknown";
    const authorName = author?.name || authorHandle;
    const text = tweet.text || "";
    const subject = text.slice(0, 120).replace(/\n/g, " ");
    const date = tweet.created_at ? new Date(tweet.created_at).getTime() : Date.now();

    return {
        id: `twitter:${tweet.id}`,
        sourceType: "twitter",
        sourceId: tweet.id,
        threadKey: tweet.conversation_id || tweet.id,
        type: tweet.referenced_tweets?.length ? "retweet" : "tweet",
        from: `@${authorHandle}`,
        to: "",
        cc: "",
        subject,
        snippet: text.slice(0, 200),
        body: text,
        htmlBody: null,
        date,
        labels: JSON.stringify(tweet.public_metrics ? [`♡${tweet.public_metrics.like_count}`, `🔄${tweet.public_metrics.retweet_count}`] : []),
        messageId: tweet.id,
        inReplyTo: "",
        references: "",
        raw: JSON.stringify(tweet),
        syncedAt: Date.now(),
    };
}

// ── Bulk DB helpers ─────────────────────────────────────────────────

async function bulkUpsertItems(items) {
    if (!items.length) return;

    // Write to IDB first (reliable persistence)
    try {
        await idbPutItems(items);
    } catch { }

    // Then to DuckDB
    for (const item of items) {
        try {
            await exec(
                `INSERT INTO items (id, sourceType, sourceId, threadKey, type, "from", "to", cc, subject,
          snippet, body, htmlBody, date, labels, messageId, inReplyTo, "references", raw, syncedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (id) DO NOTHING`,
                [
                    item.id, item.sourceType, item.sourceId, item.threadKey, item.type,
                    item.from, item.to, item.cc, item.subject, item.snippet,
                    item.body, item.htmlBody, item.date, item.labels,
                    item.messageId, item.inReplyTo, item.references, item.raw, item.syncedAt,
                ]
            );
        } catch { }
    }
}

// ── syncState helpers ───────────────────────────────────────────────

async function getSyncState(sourceType) {
    try {
        const rows = await query(
            `SELECT sourceType, historyId, lastSyncAt, totalItems, oldestPageToken
       FROM syncState WHERE sourceType = ?`,
            [sourceType]
        );
        if (!rows.length) return null;
        const r = rows[0];
        return {
            sourceType: r.sourceType,
            historyId: r.historyId,
            lastSyncAt: Number(r.lastSyncAt),
            totalItems: Number(r.totalItems),
            oldestPageToken: r.oldestPageToken || null,
        };
    } catch {
        return null;
    }
}

async function upsertSyncState({ sourceType, historyId, lastSyncAt, totalItems, oldestPageToken }) {
    await exec(
        `INSERT INTO syncState (sourceType, historyId, lastSyncAt, totalItems, oldestPageToken)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (sourceType) DO UPDATE SET
       historyId = excluded.historyId,
       lastSyncAt = excluded.lastSyncAt,
       totalItems = excluded.totalItems,
       oldestPageToken = excluded.oldestPageToken`,
        [sourceType, historyId, lastSyncAt, totalItems, oldestPageToken || ""]
    );

    // Also persist to IDB
    try {
        const { idbPutSyncState } = await import("./idb.js");
        await idbPutSyncState({ sourceType, historyId, lastSyncAt, totalItems, oldestPageToken });
    } catch { }
}

async function getNewestTweetId() {
    try {
        const rows = await query(
            `SELECT sourceId FROM items WHERE sourceType = 'twitter' ORDER BY date DESC LIMIT 1`
        );
        return rows[0]?.sourceId || null;
    } catch {
        return null;
    }
}

// ── Utilities ───────────────────────────────────────────────────────

function throwIfAborted(signal) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
}
