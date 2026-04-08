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

import { getCore } from "./core-store.js";
import { getUserTimeline, getMe, buildUserMap } from "../twitter-api.js";
import { getSyncState, writeSyncState, bulkUpsertItems, throwIfAborted } from "./sync-base.js";
import type { SyncProgress, SyncState, StoredItem } from "$lib/types";

const DEFAULT_SYNC_LIMIT = 50;

interface SyncTwitterOptions {
  limit?: number;
  onProgress?: (p: SyncProgress) => void;
  signal?: AbortSignal;
}

export interface TwitterSyncStatus {
  synced: boolean;
  totalItems: number;
  lastSyncAt: number | null;
  hasMore: boolean;
}

/** Twitter API tweet shape (minimal). */
interface TweetRow {
  id: string;
  text?: string;
  author_id?: string;
  conversation_id?: string;
  created_at?: string;
  referenced_tweets?: unknown[];
  public_metrics?: { like_count?: number; retweet_count?: number };
}

type UserMap = Map<string, { username?: string; name?: string }>;

/** Timeline response shape. */
interface TimelineResponse {
  data?: TweetRow[];
  meta?: { next_token?: string };
}

// ── Public API ──────────────────────────────────────────────────────

export async function syncTwitter(
  token: string,
  { limit = DEFAULT_SYNC_LIMIT, onProgress = () => {}, signal }: SyncTwitterOptions = {}
): Promise<{ added: number; errors: number }> {
  throwIfAborted(signal);

  const me = await getMe(token);
  const userId = me.data?.id;
  const username = me.data?.username;
  if (!userId || !username) throw new Error("Twitter me.data missing");

  const state = await getSyncState("twitter");

  if (!state) {
    return await fullSync(token, userId, username, limit, onProgress, signal);
  }
  return await incrementalSync(token, userId, username, state, limit, onProgress, signal);
}

export async function syncTwitterMore(
  token: string,
  { limit = DEFAULT_SYNC_LIMIT, onProgress = () => {}, signal }: SyncTwitterOptions = {}
): Promise<{ added: number; errors: number }> {
  throwIfAborted(signal);

  const me = await getMe(token);
  const userId = me.data?.id;
  const username = me.data?.username;
  if (!userId || !username) throw new Error("Twitter me.data missing");

  const state = await getSyncState("twitter");
  if (!state?.oldestPageToken) {
    return { added: 0, errors: 0 };
  }

  return await continueFetch(token, userId, username, state, limit, onProgress, signal);
}

export async function getTwitterSyncStatus(): Promise<TwitterSyncStatus> {
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

export async function clearTwitterData(): Promise<void> {
  await getCore().deleteItemsBySource("twitter");
  await getCore().deleteSyncState("twitter");
}

// ── Full sync (initial) ─────────────────────────────────────────────

async function fullSync(
  token: string,
  userId: string,
  username: string,
  limit: number,
  onProgress: (p: SyncProgress) => void,
  signal?: AbortSignal
): Promise<{ added: number; errors: number }> {
  let added = 0;
  let errors = 0;
  let paginationToken: string | undefined = undefined;
  let newestId: string | null = null;
  let oldestPageToken: string | null = null;

  onProgress({ phase: "listing", message: "Fetching tweets…", current: 0, total: limit });

  while (added < limit) {
    throwIfAborted(signal);

    const batchSize = Math.min(limit - added, 100);
    let response: TimelineResponse;
    try {
      response = (await getUserTimeline(token, userId, {
        maxResults: batchSize,
        paginationToken,
      })) as unknown as TimelineResponse;
    } catch (e) {
      errors++;
      console.warn("[twitter-sync] API error:", (e as Error)?.message);
      break;
    }

    const tweets = response?.data ?? [];
    if (tweets.length === 0) break;

    const userMap = buildUserMap(response);
    const items = tweets.map((t) => normalizeTweet(t, userMap, username));

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

  await writeSyncState({
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

async function incrementalSync(
  token: string,
  userId: string,
  username: string,
  state: SyncState,
  limit: number,
  onProgress: (p: SyncProgress) => void,
  signal?: AbortSignal
): Promise<{ added: number; errors: number }> {
  let added = 0;
  let errors = 0;
  let paginationToken: string | undefined = undefined;

  onProgress({
    phase: "incremental",
    message: "Checking for new tweets…",
    current: 0,
    total: 0,
  });

  while (added < limit) {
    throwIfAborted(signal);

    const batchSize = Math.min(limit - added, 100);
    let response: TimelineResponse;
    try {
      response = (await getUserTimeline(token, userId, {
        maxResults: batchSize,
        paginationToken,
      })) as unknown as TimelineResponse;
    } catch (e) {
      errors++;
      console.warn("[twitter-sync] Incremental sync error:", (e as Error)?.message);
      break;
    }

    const tweets = response?.data ?? [];
    if (tweets.length === 0) break;

    const userMap = buildUserMap(response);

    const newTweets: TweetRow[] = [];
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

  const newTotal = (state.totalItems || 0) + added;
  const newestId = added > 0 ? (await getNewestTweetId()) || state.historyId : state.historyId;

  await writeSyncState({
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

async function continueFetch(
  token: string,
  userId: string,
  username: string,
  state: SyncState,
  limit: number,
  onProgress: (p: SyncProgress) => void,
  signal?: AbortSignal
): Promise<{ added: number; errors: number }> {
  let added = 0;
  let errors = 0;
  let paginationToken: string | null = state.oldestPageToken;

  onProgress({
    phase: "fetching",
    message: "Fetching older tweets…",
    current: 0,
    total: limit,
  });

  while (added < limit && paginationToken) {
    throwIfAborted(signal);

    const batchSize = Math.min(limit - added, 100);
    let response: TimelineResponse;
    try {
      response = (await getUserTimeline(token, userId, {
        maxResults: batchSize,
        paginationToken,
      })) as unknown as TimelineResponse;
    } catch {
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

  await writeSyncState({
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

function normalizeTweet(
  tweet: TweetRow,
  userMap: UserMap | undefined,
  currentUsername: string
): StoredItem {
  const author = userMap?.get(tweet.author_id ?? "");
  const authorHandle = author?.username || currentUsername || "unknown";
  const text = tweet.text || "";
  const subject = text.slice(0, 120).replace(/\n/g, " ");
  const date = tweet.created_at ? new Date(tweet.created_at).getTime() : Date.now();

  const labels = tweet.public_metrics
    ? [`♡${tweet.public_metrics.like_count ?? 0}`, `🔄${tweet.public_metrics.retweet_count ?? 0}`]
    : [];

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
    labels,
    messageId: tweet.id,
    inReplyTo: "",
    references: "",
    raw: tweet,
    syncedAt: Date.now(),
  };
}

// ── Local helpers ───────────────────────────────────────────────────

async function getNewestTweetId(): Promise<string | null> {
  return (await getCore().getNewestSourceId("twitter")) ?? null;
}
