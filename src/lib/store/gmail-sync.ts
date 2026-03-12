/**
 * Gmail sync adapter.
 *
 * Three operations:
 * 1. syncGmail()     — First time: full sync (configurable limit, default 50).
 *                      Subsequent: incremental sync via History API (new + deleted).
 * 2. syncGmailMore() — Continue downloading older messages beyond the initial sync.
 * 3. clearGmailData() — Wipe all local Gmail data.
 *
 * syncState tracks:
 * - historyId       — for incremental sync
 * - oldestPageToken — resume point for "sync more" (null = all synced)
 * - hasMore         — whether there are older messages to download
 * - totalItems      — count of locally stored items
 */

import { query, exec, execBatch, checkpoint, makeItemId, toJson } from "./db.js";
import {
  idbPutItems,
  idbDeleteItems,
  idbClearItemsBySource,
  idbPutSyncState,
  idbDeleteSyncState,
  idbPutContacts,
} from "./idb.js";
import {
  getProfile,
  listMessages,
  getMessage,
  getHeader,
  getBody,
  getHtmlBody,
  listHistory,
  GmailApiError,
} from "../gmail-api.js";
import type { SyncState, SyncProgress } from "$lib/types";
import type { StoredItem } from "$lib/types";

const SOURCE_TYPE = "gmail";
const BATCH_SIZE = 8;
const DEFAULT_SYNC_LIMIT = 50;
const PAGE_SIZE = 100;

export interface SyncGmailOptions {
  limit?: number;
  onProgress?: (p: SyncProgress) => void;
  signal?: AbortSignal;
}

export interface SyncGmailResult {
  added: number;
  deleted: number;
  errors: number;
}

export interface SyncGmailMoreResult {
  added: number;
  errors: number;
}

export interface GmailSyncStatus {
  synced: boolean;
  totalItems: number;
  lastSyncAt: number | null;
  historyId?: string;
  hasMore: boolean;
}

/** Gmail API message shape (minimal for normalisation). */
interface GmailMessage {
  id: string;
  threadId?: string;
  snippet?: string;
  labelIds?: string[];
  internalDate?: string;
  payload?: { headers?: Array<{ name: string; value: string }>; body?: { data?: string }; parts?: unknown[]; mimeType?: string };
}

// ── Public API ──────────────────────────────────────────────────────

export async function syncGmail(
  token: string,
  { limit = DEFAULT_SYNC_LIMIT, onProgress = () => {}, signal }: SyncGmailOptions = {}
): Promise<SyncGmailResult> {
  const state = await getSyncState(SOURCE_TYPE);

  if (state?.historyId) {
    try {
      return await incrementalSync(token, state, onProgress, signal);
    } catch (e) {
      const isHistoryExpired =
        (e instanceof GmailApiError && (e.status === 404 || e.code === "notFound")) ||
        (e as Error)?.message?.includes("Start history id");

      if (isHistoryExpired) {
        onProgress({
          phase: "info",
          message: "History expired, performing full re-sync...",
        });
        await exec(`DELETE FROM syncState WHERE sourceType = ?`, [SOURCE_TYPE]);
      } else {
        throw e;
      }
    }
  }

  const effectiveLimit = limit === 0 ? Infinity : limit;
  return await fullSync(token, effectiveLimit, onProgress, signal);
}

export async function syncGmailMore(
  token: string,
  { limit = DEFAULT_SYNC_LIMIT, onProgress = () => {}, signal }: SyncGmailOptions = {}
): Promise<SyncGmailMoreResult> {
  const state = await getSyncState(SOURCE_TYPE);

  if (!state?.oldestPageToken) {
    onProgress({ phase: "done", message: "All messages already synced" });
    return { added: 0, errors: 0 };
  }

  const effectiveLimit = limit === 0 ? Infinity : limit;
  return await continueFetch(token, state, effectiveLimit, onProgress, signal);
}

export async function getGmailSyncStatus(): Promise<GmailSyncStatus> {
  const state = await getSyncState(SOURCE_TYPE);

  if (!state)
    return { synced: false, totalItems: 0, lastSyncAt: null, hasMore: false };

  return {
    synced: true,
    totalItems: state.totalItems || 0,
    lastSyncAt: state.lastSyncAt,
    historyId: state.historyId,
    hasMore: !!state.oldestPageToken,
  };
}

export async function clearGmailData(): Promise<void> {
  await exec(`DELETE FROM items WHERE sourceType = ?`, [SOURCE_TYPE]);
  await exec(`DELETE FROM syncState WHERE sourceType = ?`, [SOURCE_TYPE]);
  await idbClearItemsBySource(SOURCE_TYPE);
  await idbDeleteSyncState(SOURCE_TYPE);
}

export async function getGmailItemCount(): Promise<number> {
  const [row] = await query(
    `SELECT COUNT(*) AS cnt FROM items WHERE sourceType = ?`,
    [SOURCE_TYPE]
  );
  return Number(row?.cnt ?? 0);
}

// ── Full sync (initial) ─────────────────────────────────────────────

async function fullSync(
  token: string,
  limit: number,
  onProgress: (p: SyncProgress) => void,
  signal?: AbortSignal
): Promise<SyncGmailResult> {
  onProgress({ phase: "counting", message: "Getting mailbox info..." });
  throwIfAborted(signal);

  const profile = (await getProfile(token)) as { messagesTotal?: number; historyId?: string };

  onProgress({
    phase: "listing",
    message: "Listing messages...",
    current: 0,
    total: Math.min(profile.messagesTotal ?? limit, limit),
  });

  const allIds: string[] = [];
  let pageToken: string | undefined = undefined;
  let nextPageAfterLimit: string | null = null;

  while (allIds.length < limit) {
    throwIfAborted(signal);
    const remaining = limit - allIds.length;
    const result = (await listMessages(token, {
      maxResults: Math.min(PAGE_SIZE, remaining),
      pageToken,
    })) as { messages?: Array<{ id: string }>; nextPageToken?: string };

    const ids = (result.messages || []).map((m) => m.id);
    allIds.push(...ids);

    onProgress({
      phase: "listing",
      message: `Listed ${allIds.length} messages...`,
      current: allIds.length,
      total: Math.min(profile.messagesTotal ?? limit, limit),
    });

    pageToken = result.nextPageToken;
    if (!pageToken || ids.length === 0) break;
  }

  nextPageAfterLimit = pageToken || null;

  if (allIds.length === 0) {
    await upsertSyncState({
      sourceType: SOURCE_TYPE,
      historyId: profile.historyId ?? "",
      lastSyncAt: Date.now(),
      totalItems: 0,
      oldestPageToken: "",
    });
    return { added: 0, deleted: 0, errors: 0 };
  }

  const { added, errors } = await batchFetchAndStore(token, allIds, onProgress, signal);
  const totalItems = await getGmailItemCount();

  await upsertSyncState({
    sourceType: SOURCE_TYPE,
    historyId: profile.historyId ?? "",
    lastSyncAt: Date.now(),
    totalItems,
    oldestPageToken: nextPageAfterLimit ?? "",
  });

  await checkpoint();

  onProgress({
    phase: "done",
    message: `Synced ${added} messages`,
    current: added,
    total: added,
  });

  return { added, deleted: 0, errors };
}

// ── Continue fetch (sync more older messages) ───────────────────────

async function continueFetch(
  token: string,
  state: SyncState,
  limit: number,
  onProgress: (p: SyncProgress) => void,
  signal?: AbortSignal
): Promise<SyncGmailMoreResult> {
  onProgress({ phase: "listing", message: "Loading more messages...", current: 0 });
  throwIfAborted(signal);

  const allIds: string[] = [];
  let pageToken: string | undefined = state.oldestPageToken || undefined;
  let nextPageAfterLimit: string | null = null;

  while (allIds.length < limit) {
    throwIfAborted(signal);
    const remaining = limit - allIds.length;
    const result = (await listMessages(token, {
      maxResults: Math.min(PAGE_SIZE, remaining),
      pageToken,
    })) as { messages?: Array<{ id: string }>; nextPageToken?: string };

    const ids = (result.messages || []).map((m) => m.id);
    allIds.push(...ids);

    onProgress({
      phase: "listing",
      message: `Listed ${allIds.length} more messages...`,
      current: allIds.length,
    });

    pageToken = result.nextPageToken;
    if (!pageToken || ids.length === 0) break;
  }

  nextPageAfterLimit = pageToken || null;

  if (allIds.length === 0) {
    await exec(
      `UPDATE syncState SET oldestPageToken = '', lastSyncAt = ? WHERE sourceType = ?`,
      [Date.now(), SOURCE_TYPE]
    );
    onProgress({ phase: "done", message: "All messages synced" });
    return { added: 0, errors: 0 };
  }

  const { added, errors } = await batchFetchAndStore(token, allIds, onProgress, signal);
  const totalItems = await getGmailItemCount();

  await exec(
    `UPDATE syncState SET totalItems = ?, lastSyncAt = ?, oldestPageToken = ?
     WHERE sourceType = ?`,
    [totalItems, Date.now(), nextPageAfterLimit ?? "", SOURCE_TYPE]
  );

  await checkpoint();

  onProgress({
    phase: "done",
    message: nextPageAfterLimit
      ? `Downloaded ${added} more (more available)`
      : `Downloaded ${added} more (all synced)`,
    current: totalItems,
    total: totalItems,
  });

  return { added, errors };
}

// ── Incremental sync ────────────────────────────────────────────────

async function incrementalSync(
  token: string,
  state: SyncState,
  onProgress: (p: SyncProgress) => void,
  signal?: AbortSignal
): Promise<SyncGmailResult> {
  onProgress({ phase: "syncing", message: "Checking for changes..." });
  throwIfAborted(signal);

  let added = 0;
  let deleted = 0;
  let errors = 0;
  let nextPageToken: string | undefined = undefined;
  let newHistoryId = state.historyId;

  do {
    throwIfAborted(signal);

    const history = (await listHistory(token, {
      startHistoryId: state.historyId,
      pageToken: nextPageToken,
    })) as {
      historyId?: string;
      nextPageToken?: string;
      history?: Array<{
        messagesAdded?: Array<{ message: { id: string } }>;
        messagesDeleted?: Array<{ message: { id: string } }>;
      }>;
    };

    newHistoryId = history.historyId ?? newHistoryId;
    nextPageToken = history.nextPageToken;

    if (!history.history) continue;

    for (const record of history.history) {
      if (record.messagesAdded) {
        const newIds = record.messagesAdded.map((m) => m.message.id);
        const uniqueIds = [...new Set(newIds.filter(Boolean))];

        if (uniqueIds.length > 0) {
          const results = await Promise.allSettled(
            uniqueIds.map((id: string) => getMessage(token, id))
          );

          const items: StoredItem[] = [];
          for (const result of results) {
            if (result.status === "fulfilled") {
              items.push(normalizeGmailMessage(result.value as unknown as GmailMessage));
            } else {
              errors++;
            }
          }

          if (items.length > 0) {
            await bulkUpsertItems(items);
            await upsertContacts(items);
            added += items.length;
          }
        }
      }

      if (record.messagesDeleted) {
        const deletedIds = record.messagesDeleted
          .map((m: { message: { id: string } }) => makeItemId(SOURCE_TYPE, m.message.id))
          .filter(Boolean);

        if (deletedIds.length > 0) {
          await bulkDeleteItems(deletedIds);
          deleted += deletedIds.length;
        }
      }
    }

    onProgress({
      phase: "syncing",
      message: `Changes: +${added} -${deleted}`,
      current: added + deleted,
    });
  } while (nextPageToken);

  const totalItems = await getGmailItemCount();

  await upsertSyncState({
    sourceType: SOURCE_TYPE,
    historyId: newHistoryId,
    lastSyncAt: Date.now(),
    totalItems,
    oldestPageToken: state.oldestPageToken ?? "",
  });

  await checkpoint();

  onProgress({
    phase: "done",
    message:
      added === 0 && deleted === 0
        ? "Already up to date"
        : `Synced: +${added} -${deleted}`,
    current: totalItems,
    total: totalItems,
  });

  return { added, deleted, errors };
}

// ── Shared: batch fetch and store ───────────────────────────────────

async function batchFetchAndStore(
  token: string,
  ids: string[],
  onProgress: (p: SyncProgress) => void,
  signal?: AbortSignal
): Promise<{ added: number; errors: number }> {
  onProgress({
    phase: "downloading",
    message: "Downloading messages...",
    current: 0,
    total: ids.length,
  });

  let added = 0;
  let errors = 0;

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    throwIfAborted(signal);

    const batch = ids.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(batch.map((id) => getMessage(token, id)));

    const items: StoredItem[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        items.push(normalizeGmailMessage(result.value as unknown as GmailMessage));
      } else {
        errors++;
      }
    }

    if (items.length > 0) {
      await bulkUpsertItems(items);
      await upsertContacts(items);
    }

    added += items.length;
    onProgress({
      phase: "downloading",
      message: `Downloaded ${added} of ${ids.length} messages`,
      current: added,
      total: ids.length,
    });
  }

  return { added, errors };
}

// ── Normalisation ───────────────────────────────────────────────────

function normalizeGmailMessage(msg: GmailMessage): StoredItem {
  const m = msg as unknown as Record<string, unknown>;
  const from = getHeader(m, "From") ?? "";
  const to = getHeader(m, "To") ?? "";
  const cc = getHeader(m, "Cc") ?? "";
  const subject = getHeader(m, "Subject") || "(no subject)";
  const dateStr = getHeader(m, "Date");
  const messageId = getHeader(m, "Message-ID") ?? "";
  const inReplyTo = getHeader(m, "In-Reply-To") ?? "";
  const references = getHeader(m, "References") ?? "";

  let date: number;
  try {
    date = dateStr
      ? new Date(dateStr).getTime()
      : msg.internalDate
        ? Number(msg.internalDate)
        : Date.now();
  } catch {
    date = Date.now();
  }

  return {
    id: makeItemId(SOURCE_TYPE, msg.id),
    sourceType: SOURCE_TYPE,
    sourceId: msg.id,
    threadKey: `gmail:${msg.threadId ?? "unknown"}`,
    type: "email",
    from,
    to,
    cc,
    subject,
    snippet: msg.snippet || "",
    body: getBody(m) ?? "",
    htmlBody: getHtmlBody(m) ?? "",
    date,
    labels: msg.labelIds || [],
    messageId,
    inReplyTo,
    references,
    raw: msg,
    syncedAt: Date.now(),
  };
}

// ── Bulk DB helpers ─────────────────────────────────────────────────

async function bulkUpsertItems(items: StoredItem[]): Promise<void> {
  const sql = `INSERT INTO items
       (id, sourceType, sourceId, threadKey, type, "from", "to", cc, subject,
        snippet, body, htmlBody, date, labels, messageId, inReplyTo, "references",
        raw, syncedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (id) DO UPDATE SET
       sourceType   = excluded.sourceType,
       sourceId     = excluded.sourceId,
       threadKey    = excluded.threadKey,
       type         = excluded.type,
       "from"       = excluded."from",
       "to"         = excluded."to",
       cc           = excluded.cc,
       subject      = excluded.subject,
       snippet      = excluded.snippet,
       body         = excluded.body,
       htmlBody     = excluded.htmlBody,
       date         = excluded.date,
       labels       = excluded.labels,
       messageId    = excluded.messageId,
       inReplyTo    = excluded.inReplyTo,
       "references" = excluded."references",
       raw          = excluded.raw,
       syncedAt     = excluded.syncedAt`;

  await execBatch(
    items.map((item) => ({
      sql,
      params: [
        item.id,
        item.sourceType,
        item.sourceId,
        item.threadKey,
        item.type,
        item.from,
        item.to,
        item.cc,
        item.subject,
        item.snippet,
        item.body,
        item.htmlBody,
        item.date,
        toJson(item.labels),
        item.messageId,
        item.inReplyTo,
        item.references,
        toJson(item.raw),
        item.syncedAt,
      ],
    }))
  );

  await idbPutItems(
    items.map((item) => ({
      ...item,
      labels: toJson(item.labels),
      raw: toJson(item.raw),
    }))
  );
}

async function bulkDeleteItems(ids: string[]): Promise<void> {
  await execBatch(ids.map((id) => ({ sql: `DELETE FROM items WHERE id = ?`, params: [id] })));
  await idbDeleteItems(ids);
}

// ── Contact extraction ──────────────────────────────────────────────

interface ParsedEmail {
  email: string;
  name: string;
}

async function upsertContacts(items: StoredItem[]): Promise<void> {
  const contactMap = new Map<
    string,
    { email: string; name: string; date: number }
  >();

  for (const item of items) {
    for (const field of [item.from, item.to, item.cc]) {
      if (!field) continue;
      const addresses = field.split(",").map((s) => s.trim()).filter(Boolean);
      for (const addr of addresses) {
        const parsed = parseEmailAddress(addr);
        if (parsed && !contactMap.has(parsed.email)) {
          contactMap.set(parsed.email, { ...parsed, date: item.date ?? Date.now() });
        }
      }
    }
  }

  const idbBatch: Array<{ email: string; name: string; firstSeen: number; lastSeen: number }> = [];

  for (const [email, { name, date }] of contactMap) {
    try {
      const existing = await query(`SELECT * FROM contacts WHERE email = ?`, [email]);

      if (existing.length > 0) {
        const row = existing[0] as Record<string, unknown>;
        const updates: string[] = [];
        const vals: unknown[] = [];
        if (name && !row.name) {
          updates.push(`name = ?`);
          vals.push(name);
        }
        if (date > (Number(row.lastSeen) || 0)) {
          updates.push(`lastSeen = ?`);
          vals.push(date);
        }
        if (updates.length > 0) {
          await exec(
            `UPDATE contacts SET ${updates.join(", ")} WHERE email = ?`,
            [...vals, email]
          );
        }
        idbBatch.push({
          email,
          name: (row.name as string) || name || "",
          firstSeen: Number(row.firstSeen) || date,
          lastSeen: Math.max(date, Number(row.lastSeen) || 0),
        });
      } else {
        await exec(
          `INSERT INTO contacts (email, name, firstSeen, lastSeen) VALUES (?, ?, ?, ?)`,
          [email, name || "", date, date]
        );
        idbBatch.push({ email, name: name || "", firstSeen: date, lastSeen: date });
      }
    } catch (e) {
      console.debug("Contact upsert skipped:", email, (e as Error)?.message ?? e);
    }
  }

  if (idbBatch.length > 0) {
    await idbPutContacts(idbBatch);
  }
}

function parseEmailAddress(str: string): ParsedEmail | null {
  if (!str) return null;
  const match = str.match(/<([^>]+)>/);
  if (match) {
    const email = match[1].toLowerCase().trim();
    const name = str.slice(0, str.indexOf("<")).replace(/"/g, "").trim();
    return { email, name };
  }
  const email = str.toLowerCase().trim();
  if (email.includes("@")) return { email, name: "" };
  return null;
}

// ── syncState helpers ───────────────────────────────────────────────

async function getSyncState(sourceType: string): Promise<SyncState | null> {
  const rows = await query(
    `SELECT * FROM syncState WHERE sourceType = ?`,
    [sourceType]
  );
  if (rows.length === 0) return null;
  const r = rows[0] as Record<string, unknown>;
  return {
    sourceType: r.sourceType as string,
    historyId: r.historyId as string,
    lastSyncAt: r.lastSyncAt != null ? Number(r.lastSyncAt) : null,
    totalItems: r.totalItems != null ? Number(r.totalItems) : 0,
    oldestPageToken: (r.oldestPageToken as string) ?? "",
  };
}

async function upsertSyncState({
  sourceType,
  historyId,
  lastSyncAt,
  totalItems,
  oldestPageToken,
}: SyncState): Promise<void> {
  await exec(
    `INSERT INTO syncState (sourceType, historyId, lastSyncAt, totalItems, oldestPageToken)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (sourceType) DO UPDATE SET
       historyId       = excluded.historyId,
       lastSyncAt      = excluded.lastSyncAt,
       totalItems      = excluded.totalItems,
       oldestPageToken = excluded.oldestPageToken`,
    [sourceType, historyId, lastSyncAt, totalItems, oldestPageToken]
  );
  await idbPutSyncState({
    sourceType,
    historyId,
    lastSyncAt,
    totalItems,
    oldestPageToken,
  });
}

// ── Utilities ───────────────────────────────────────────────────────

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException("Sync was cancelled", "AbortError");
  }
}
