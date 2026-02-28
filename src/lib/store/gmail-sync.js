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

import { query, exec, execBatch, checkpoint, makeItemId, toJson, fromJson } from "./db.js";
import {
  idbPutItems, idbDeleteItems, idbClearItemsBySource,
  idbPutSyncState, idbDeleteSyncState,
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

const SOURCE_TYPE        = "gmail";
const BATCH_SIZE         = 8;
const DEFAULT_SYNC_LIMIT = 50;
const PAGE_SIZE          = 100;

// ── Public API ──────────────────────────────────────────────────────

/**
 * Main sync entry point.
 * - First sync: downloads `limit` most recent messages.
 * - Subsequent syncs: incremental via History API (adds + deletes).
 *
 * @param {string} token - OAuth access token
 * @param {object} options
 * @param {number} [options.limit=50] - Max messages for initial sync (0 = Infinity/all)
 * @param {function} [options.onProgress] - Progress callback
 * @param {AbortSignal} [options.signal] - Optional abort signal
 * @returns {Promise<{added: number, deleted: number, errors: number}>}
 */
export async function syncGmail(
  token,
  { limit = DEFAULT_SYNC_LIMIT, onProgress = () => {}, signal } = {}
) {
  const state = await getSyncState(SOURCE_TYPE);

  if (state?.historyId) {
    try {
      return await incrementalSync(token, state, onProgress, signal);
    } catch (e) {
      const isHistoryExpired =
        (e instanceof GmailApiError && (e.status === 404 || e.code === "notFound")) ||
        e.message?.includes("Start history id");

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

/**
 * Continue downloading older messages beyond the initial sync.
 * Resumes from where the last full sync left off.
 *
 * @param {string} token - OAuth access token
 * @param {object} options
 * @param {number} [options.limit=50] - How many more to download (0 = all remaining)
 * @param {function} [options.onProgress] - Progress callback
 * @param {AbortSignal} [options.signal] - Optional abort signal
 * @returns {Promise<{added: number, errors: number}>}
 */
export async function syncGmailMore(
  token,
  { limit = DEFAULT_SYNC_LIMIT, onProgress = () => {}, signal } = {}
) {
  const state = await getSyncState(SOURCE_TYPE);

  if (!state?.oldestPageToken) {
    onProgress({ phase: "done", message: "All messages already synced" });
    return { added: 0, errors: 0 };
  }

  const effectiveLimit = limit === 0 ? Infinity : limit;
  return await continueFetch(token, state, effectiveLimit, onProgress, signal);
}

/**
 * Get current sync status for Gmail.
 */
export async function getGmailSyncStatus() {
  const state = await getSyncState(SOURCE_TYPE);

  if (!state) return { synced: false, totalItems: 0, lastSyncAt: null, hasMore: false };

  return {
    synced:     true,
    totalItems: state.totalItems || 0,
    lastSyncAt: state.lastSyncAt,
    historyId:  state.historyId,
    hasMore:    !!state.oldestPageToken,
  };
}

/**
 * Clear all Gmail data from the store.
 */
export async function clearGmailData() {
  await exec(`DELETE FROM items WHERE sourceType = ?`, [SOURCE_TYPE]);
  await exec(`DELETE FROM syncState WHERE sourceType = ?`, [SOURCE_TYPE]);
  await idbClearItemsBySource(SOURCE_TYPE);
  await idbDeleteSyncState(SOURCE_TYPE);
}

/**
 * Get count of locally stored Gmail messages.
 */
export async function getGmailItemCount() {
  const [row] = await query(
    `SELECT COUNT(*) AS cnt FROM items WHERE sourceType = ?`,
    [SOURCE_TYPE]
  );
  return Number(row?.cnt ?? 0);
}

// ── Full sync (initial) ─────────────────────────────────────────────

async function fullSync(token, limit, onProgress, signal) {
  onProgress({ phase: "counting", message: "Getting mailbox info..." });
  throwIfAborted(signal);

  const profile = await getProfile(token);

  onProgress({
    phase:   "listing",
    message: "Listing messages...",
    current: 0,
    total:   Math.min(profile.messagesTotal || limit, limit),
  });

  const allIds = [];
  let pageToken = undefined;
  let nextPageAfterLimit = null;

  while (allIds.length < limit) {
    throwIfAborted(signal);
    const remaining = limit - allIds.length;
    const result = await listMessages(token, {
      maxResults: Math.min(PAGE_SIZE, remaining),
      pageToken,
    });

    const ids = (result.messages || []).map((m) => m.id);
    allIds.push(...ids);

    onProgress({
      phase:   "listing",
      message: `Listed ${allIds.length} messages...`,
      current: allIds.length,
      total:   Math.min(profile.messagesTotal || limit, limit),
    });

    pageToken = result.nextPageToken;
    if (!pageToken || ids.length === 0) break;
  }

  nextPageAfterLimit = pageToken || null;

  if (allIds.length === 0) {
    await upsertSyncState({
      sourceType:      SOURCE_TYPE,
      historyId:       profile.historyId,
      lastSyncAt:      Date.now(),
      totalItems:      0,
      oldestPageToken: "",
    });
    return { added: 0, deleted: 0, errors: 0 };
  }

  const { added, errors } = await batchFetchAndStore(token, allIds, onProgress, signal);
  const totalItems = await getGmailItemCount();

  await upsertSyncState({
    sourceType:      SOURCE_TYPE,
    historyId:       profile.historyId,
    lastSyncAt:      Date.now(),
    totalItems,
    oldestPageToken: nextPageAfterLimit ?? "",
  });

  // Flush WAL to OPFS so emails survive a page reload.
  await checkpoint();

  onProgress({
    phase:   "done",
    message: `Synced ${added} messages`,
    current: added,
    total:   added,
  });

  return { added, deleted: 0, errors };
}

// ── Continue fetch (sync more older messages) ───────────────────────

async function continueFetch(token, state, limit, onProgress, signal) {
  onProgress({ phase: "listing", message: "Loading more messages...", current: 0 });
  throwIfAborted(signal);

  const allIds = [];
  let pageToken = state.oldestPageToken;
  let nextPageAfterLimit = null;

  while (allIds.length < limit) {
    throwIfAborted(signal);
    const remaining = limit - allIds.length;
    const result = await listMessages(token, {
      maxResults: Math.min(PAGE_SIZE, remaining),
      pageToken,
    });

    const ids = (result.messages || []).map((m) => m.id);
    allIds.push(...ids);

    onProgress({
      phase:   "listing",
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

  // Flush WAL to OPFS so emails survive a page reload.
  await checkpoint();

  onProgress({
    phase:   "done",
    message: nextPageAfterLimit
      ? `Downloaded ${added} more (more available)`
      : `Downloaded ${added} more (all synced)`,
    current: totalItems,
    total:   totalItems,
  });

  return { added, errors };
}

// ── Incremental sync ────────────────────────────────────────────────

async function incrementalSync(token, state, onProgress, signal) {
  onProgress({ phase: "syncing", message: "Checking for changes..." });
  throwIfAborted(signal);

  let added = 0;
  let deleted = 0;
  let errors = 0;
  let nextPageToken = undefined;
  let newHistoryId = state.historyId;

  do {
    throwIfAborted(signal);

    const history = await listHistory(token, {
      startHistoryId: state.historyId,
      pageToken:      nextPageToken,
    });

    newHistoryId  = history.historyId || newHistoryId;
    nextPageToken = history.nextPageToken;

    if (!history.history) continue;

    for (const record of history.history) {
      if (record.messagesAdded) {
        const newIds    = record.messagesAdded.map((m) => m.message.id);
        const uniqueIds = [...new Set(newIds.filter(Boolean))];

        if (uniqueIds.length > 0) {
          const results = await Promise.allSettled(
            uniqueIds.map((id) => getMessage(token, id))
          );

          const items = [];
          for (const result of results) {
            if (result.status === "fulfilled") {
              items.push(normalizeGmailMessage(result.value));
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
          .map((m) => makeItemId(SOURCE_TYPE, m.message.id))
          .filter(Boolean);

        if (deletedIds.length > 0) {
          await bulkDeleteItems(deletedIds);
          deleted += deletedIds.length;
        }
      }
    }

    onProgress({
      phase:   "syncing",
      message: `Changes: +${added} -${deleted}`,
      current: added + deleted,
    });
  } while (nextPageToken);

  const totalItems = await getGmailItemCount();

  await upsertSyncState({
    sourceType:      SOURCE_TYPE,
    historyId:       newHistoryId,
    lastSyncAt:      Date.now(),
    totalItems,
    oldestPageToken: state.oldestPageToken ?? "",
  });

  // Flush WAL to OPFS so changes survive a page reload.
  await checkpoint();

  onProgress({
    phase:   "done",
    message: added === 0 && deleted === 0
      ? "Already up to date"
      : `Synced: +${added} -${deleted}`,
    current: totalItems,
    total:   totalItems,
  });

  return { added, deleted, errors };
}

// ── Shared: batch fetch and store ───────────────────────────────────

async function batchFetchAndStore(token, ids, onProgress, signal) {
  onProgress({
    phase:   "downloading",
    message: "Downloading messages...",
    current: 0,
    total:   ids.length,
  });

  let added  = 0;
  let errors = 0;

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    throwIfAborted(signal);

    const batch   = ids.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((id) => getMessage(token, id))
    );

    const items = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        items.push(normalizeGmailMessage(result.value));
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
      phase:   "downloading",
      message: `Downloaded ${added} of ${ids.length} messages`,
      current: added,
      total:   ids.length,
    });
  }

  return { added, errors };
}

// ── Normalisation ───────────────────────────────────────────────────

function normalizeGmailMessage(msg) {
  const from       = getHeader(msg, "From")        ?? "";
  const to         = getHeader(msg, "To")          ?? "";
  const cc         = getHeader(msg, "Cc")          ?? "";
  const subject    = getHeader(msg, "Subject")     || "(no subject)";
  const dateStr    = getHeader(msg, "Date");
  const messageId  = getHeader(msg, "Message-ID")  ?? "";
  const inReplyTo  = getHeader(msg, "In-Reply-To") ?? "";
  const references = getHeader(msg, "References")  ?? "";

  let date;
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
    id:         makeItemId(SOURCE_TYPE, msg.id),
    sourceType: SOURCE_TYPE,
    sourceId:   msg.id,
    threadKey:  `gmail:${msg.threadId ?? "unknown"}`,
    type:       "email",
    from,
    to,
    cc,
    subject,
    snippet:    msg.snippet || "",
    body:       getBody(msg) ?? "",
    htmlBody:   getHtmlBody(msg) ?? "",
    date,
    labels:     msg.labelIds || [],
    messageId,
    inReplyTo,
    references,
    raw:        msg,
    syncedAt:   Date.now(),
  };
}

// ── Bulk DB helpers ─────────────────────────────────────────────────

async function bulkUpsertItems(items) {
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

  await execBatch(items.map(item => ({
    sql,
    params: [
      item.id, item.sourceType, item.sourceId, item.threadKey, item.type,
      item.from, item.to, item.cc, item.subject, item.snippet,
      item.body, item.htmlBody, item.date,
      toJson(item.labels),
      item.messageId, item.inReplyTo, item.references,
      toJson(item.raw),
      item.syncedAt,
    ],
  })));

  // Write-through to IndexedDB — the reliable persistence layer.
  // Store labels and raw as JSON strings (same as DuckDB columns) so
  // rehydration can insert them back verbatim.
  await idbPutItems(items.map(item => ({
    ...item,
    labels: toJson(item.labels),
    raw:    toJson(item.raw),
  })));
}

async function bulkDeleteItems(ids) {
  await execBatch(ids.map(id => ({
    sql: `DELETE FROM items WHERE id = ?`,
    params: [id],
  })));
  await idbDeleteItems(ids);
}

// ── Contact extraction ──────────────────────────────────────────────

async function upsertContacts(items) {
  const contactMap = new Map();

  for (const item of items) {
    for (const field of [item.from, item.to, item.cc]) {
      if (!field) continue;
      const addresses = field.split(",").map((s) => s.trim()).filter(Boolean);
      for (const addr of addresses) {
        const parsed = parseEmailAddress(addr);
        if (parsed && !contactMap.has(parsed.email)) {
          contactMap.set(parsed.email, { ...parsed, date: item.date });
        }
      }
    }
  }

  const idbBatch = [];

  for (const [email, { name, date }] of contactMap) {
    try {
      const existing = await query(
        `SELECT * FROM contacts WHERE email = ?`,
        [email]
      );

      if (existing.length > 0) {
        const updates = [];
        const vals    = [];
        if (name && !existing[0].name) { updates.push(`name = ?`);     vals.push(name); }
        if (date > (Number(existing[0].lastSeen) || 0)) { updates.push(`lastSeen = ?`); vals.push(date); }
        if (updates.length > 0) {
          await exec(
            `UPDATE contacts SET ${updates.join(", ")} WHERE email = ?`,
            [...vals, email]
          );
        }
        idbBatch.push({ email, name: existing[0].name || name || "", firstSeen: Number(existing[0].firstSeen) || date, lastSeen: Math.max(date, Number(existing[0].lastSeen) || 0) });
      } else {
        await exec(
          `INSERT INTO contacts (email, name, firstSeen, lastSeen) VALUES (?, ?, ?, ?)`,
          [email, name || "", date, date]
        );
        idbBatch.push({ email, name: name || "", firstSeen: date, lastSeen: date });
      }
    } catch (e) {
      console.debug("Contact upsert skipped:", email, e?.message || e);
    }
  }

  if (idbBatch.length > 0) {
    await idbPutContacts(idbBatch);
  }
}

function parseEmailAddress(str) {
  if (!str) return null;
  const match = str.match(/<([^>]+)>/);
  if (match) {
    const email = match[1].toLowerCase().trim();
    const name  = str.slice(0, str.indexOf("<")).replace(/"/g, "").trim();
    return { email, name };
  }
  const email = str.toLowerCase().trim();
  if (email.includes("@")) return { email, name: "" };
  return null;
}

// ── syncState helpers ───────────────────────────────────────────────

async function getSyncState(sourceType) {
  const rows = await query(
    `SELECT * FROM syncState WHERE sourceType = ?`,
    [sourceType]
  );
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    sourceType:      r.sourceType,
    historyId:       r.historyId,
    lastSyncAt:      r.lastSyncAt != null ? Number(r.lastSyncAt) : null,
    totalItems:      r.totalItems != null ? Number(r.totalItems) : 0,
    oldestPageToken: r.oldestPageToken ?? "",
  };
}

async function upsertSyncState({ sourceType, historyId, lastSyncAt, totalItems, oldestPageToken }) {
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
  // Mirror to IndexedDB — reliable persistence.
  await idbPutSyncState({ sourceType, historyId, lastSyncAt, totalItems, oldestPageToken });
}

// ── Utilities ───────────────────────────────────────────────────────

function throwIfAborted(signal) {
  if (signal?.aborted) {
    throw new DOMException("Sync was cancelled", "AbortError");
  }
}
