/**
 * Gmail sync adapter.
 *
 * Handles two sync modes:
 * 1. Full sync — paginate through all messages (up to configurable limit),
 *    fetch full details, and store in IndexedDB.
 * 2. Incremental sync — use Gmail History API to efficiently fetch only
 *    changes (new messages, deletions) since the last sync.
 *
 * Incremental sync falls back to full sync if the saved historyId has expired
 * (Gmail keeps history for ~30 days, varies by account).
 */

import { db, makeItemId } from "./db.js";
import {
  getProfile,
  listMessages,
  getMessage,
  getHeader,
  getBody,
  getHtmlBody,
  listHistory,
} from "../gmail-api.js";

const SOURCE_TYPE = "gmail";
const BATCH_SIZE = 8;
const INITIAL_SYNC_LIMIT = 500;
const PAGE_SIZE = 100;

// ── Public API ──────────────────────────────────────────────────────

/**
 * Main sync entry point. Decides between full and incremental sync.
 *
 * @param {string} token - OAuth access token
 * @param {object} options
 * @param {function} options.onProgress - Progress callback
 *   ({ phase, current, total, message })
 * @param {AbortSignal} [options.signal] - Optional abort signal to cancel sync
 * @returns {Promise<{added: number, deleted: number, errors: number}>}
 */
export async function syncGmail(token, { onProgress = () => {}, signal } = {}) {
  const state = await db.syncState.get(SOURCE_TYPE);

  if (state?.historyId) {
    try {
      return await incrementalSync(token, state, onProgress, signal);
    } catch (e) {
      // historyId expired (404) or invalid — fall through to full sync
      if (
        e.message?.includes("404") ||
        e.message?.includes("notFound") ||
        e.message?.includes("Start history id")
      ) {
        onProgress({
          phase: "info",
          message: "History expired, performing full re-sync...",
        });
      } else {
        throw e;
      }
    }
  }

  return await fullSync(token, onProgress, signal);
}

/**
 * Get current sync status for Gmail.
 * @returns {Promise<{synced: boolean, totalItems: number, lastSyncAt: number|null}>}
 */
export async function getGmailSyncStatus() {
  const state = await db.syncState.get(SOURCE_TYPE);
  if (!state) return { synced: false, totalItems: 0, lastSyncAt: null };

  return {
    synced: true,
    totalItems: state.totalItems || 0,
    lastSyncAt: state.lastSyncAt,
    historyId: state.historyId,
  };
}

/**
 * Clear all Gmail data from the store.
 */
export async function clearGmailData() {
  await db.transaction("rw", [db.items, db.syncState], async () => {
    await db.items.where("sourceType").equals(SOURCE_TYPE).delete();
    await db.syncState.delete(SOURCE_TYPE);
  });
}

/**
 * Get count of locally stored Gmail messages.
 */
export async function getGmailItemCount() {
  return db.items.where("sourceType").equals(SOURCE_TYPE).count();
}

// ── Full sync ───────────────────────────────────────────────────────

async function fullSync(token, onProgress, signal) {
  onProgress({ phase: "counting", message: "Getting mailbox info..." });
  throwIfAborted(signal);

  const profile = await getProfile(token);
  const totalEstimate = Math.min(
    profile.messagesTotal || INITIAL_SYNC_LIMIT,
    INITIAL_SYNC_LIMIT
  );

  // Step 1: Collect message IDs (paginated)
  onProgress({
    phase: "listing",
    message: "Listing messages...",
    current: 0,
    total: totalEstimate,
  });

  const allIds = [];
  let pageToken = undefined;

  while (allIds.length < INITIAL_SYNC_LIMIT) {
    throwIfAborted(signal);
    const remaining = INITIAL_SYNC_LIMIT - allIds.length;
    const result = await listMessages(token, {
      maxResults: Math.min(PAGE_SIZE, remaining),
      pageToken,
    });

    const ids = (result.messages || []).map((m) => m.id);
    allIds.push(...ids);

    onProgress({
      phase: "listing",
      message: `Listed ${allIds.length} messages...`,
      current: allIds.length,
      total: totalEstimate,
    });

    pageToken = result.nextPageToken;
    if (!pageToken || ids.length === 0) break;
  }

  if (allIds.length === 0) {
    await db.syncState.put({
      sourceType: SOURCE_TYPE,
      historyId: profile.historyId,
      lastSyncAt: Date.now(),
      totalItems: 0,
    });
    return { added: 0, deleted: 0, errors: 0 };
  }

  // Step 2: Batch-fetch full message details and store
  onProgress({
    phase: "downloading",
    message: "Downloading messages...",
    current: 0,
    total: allIds.length,
  });

  let added = 0;
  let errors = 0;

  for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
    throwIfAborted(signal);

    const batch = allIds.slice(i, i + BATCH_SIZE);
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
      await db.items.bulkPut(items);
      await upsertContacts(items);
    }

    added += items.length;
    onProgress({
      phase: "downloading",
      message: `Downloaded ${added} of ${allIds.length} messages`,
      current: added,
      total: allIds.length,
    });
  }

  // Step 3: Save sync state
  await db.syncState.put({
    sourceType: SOURCE_TYPE,
    historyId: profile.historyId,
    lastSyncAt: Date.now(),
    totalItems: added,
  });

  onProgress({
    phase: "done",
    message: `Synced ${added} messages`,
    current: added,
    total: added,
  });

  return { added, deleted: 0, errors };
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
      pageToken: nextPageToken,
    });

    newHistoryId = history.historyId || newHistoryId;
    nextPageToken = history.nextPageToken;

    if (!history.history) continue;

    for (const record of history.history) {
      // Handle added messages
      if (record.messagesAdded) {
        const newIds = record.messagesAdded.map((m) => m.message.id);
        // Deduplicate — same message can appear in multiple history records
        const uniqueIds = [
          ...new Set(newIds.filter((id) => id)),
        ];

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
            await db.items.bulkPut(items);
            await upsertContacts(items);
            added += items.length;
          }
        }
      }

      // Handle deleted messages
      if (record.messagesDeleted) {
        const deletedIds = record.messagesDeleted
          .map((m) => makeItemId(SOURCE_TYPE, m.message.id))
          .filter((id) => id);

        if (deletedIds.length > 0) {
          await db.items.bulkDelete(deletedIds);
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

  // Update sync state
  const totalItems = await db.items
    .where("sourceType")
    .equals(SOURCE_TYPE)
    .count();

  await db.syncState.put({
    sourceType: SOURCE_TYPE,
    historyId: newHistoryId,
    lastSyncAt: Date.now(),
    totalItems,
  });

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

// ── Normalization ───────────────────────────────────────────────────

/**
 * Convert a Gmail API Message resource to our universal item format.
 * Preserves raw data for future graph building / analysis.
 */
function normalizeGmailMessage(msg) {
  const from = getHeader(msg, "From");
  const to = getHeader(msg, "To");
  const cc = getHeader(msg, "Cc");
  const subject = getHeader(msg, "Subject") || "(no subject)";
  const dateStr = getHeader(msg, "Date");
  const messageId = getHeader(msg, "Message-ID");
  const inReplyTo = getHeader(msg, "In-Reply-To");
  const references = getHeader(msg, "References");

  let date;
  try {
    date = dateStr ? new Date(dateStr).getTime() : msg.internalDate ? Number(msg.internalDate) : Date.now();
  } catch {
    date = Date.now();
  }

  return {
    id: makeItemId(SOURCE_TYPE, msg.id),
    sourceType: SOURCE_TYPE,
    sourceId: msg.id,
    threadKey: `gmail:${msg.threadId}`,
    type: "email",
    from,
    to,
    cc,
    subject,
    snippet: msg.snippet || "",
    body: getBody(msg),
    htmlBody: getHtmlBody(msg),
    date,
    labels: msg.labelIds || [],
    // Headers useful for graph building (reply chains, threading)
    messageId,
    inReplyTo,
    references,
    // Preserve full API response for future analysis
    raw: msg,
    syncedAt: Date.now(),
  };
}

// ── Contact extraction ──────────────────────────────────────────────

/**
 * Extract contacts from items and upsert into contacts table.
 * Builds the social graph incrementally.
 */
async function upsertContacts(items) {
  const contactMap = new Map();

  for (const item of items) {
    for (const field of [item.from, item.to, item.cc]) {
      if (!field) continue;
      // Handle comma-separated addresses
      const addresses = field
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      for (const addr of addresses) {
        const parsed = parseEmailAddress(addr);
        if (parsed && !contactMap.has(parsed.email)) {
          contactMap.set(parsed.email, { ...parsed, date: item.date });
        }
      }
    }
  }

  for (const [email, { name, date }] of contactMap) {
    try {
      const existing = await db.contacts.where("email").equals(email).first();
      if (existing) {
        const updates = {};
        if (name && !existing.name) updates.name = name;
        if (date > (existing.lastSeen || 0)) updates.lastSeen = date;
        if (Object.keys(updates).length > 0) {
          await db.contacts.update(existing.id, updates);
        }
      } else {
        await db.contacts.add({
          email,
          name: name || "",
          firstSeen: date,
          lastSeen: date,
        });
      }
    } catch {
      // Silently skip duplicate/constraint errors during concurrent upserts
    }
  }
}

/**
 * Parse "Name <email@example.com>" or plain "email@example.com" format.
 */
function parseEmailAddress(str) {
  if (!str) return null;
  const match = str.match(/<([^>]+)>/);
  if (match) {
    const email = match[1].toLowerCase().trim();
    const name = str
      .slice(0, str.indexOf("<"))
      .replace(/"/g, "")
      .trim();
    return { email, name };
  }
  // Plain email address
  const email = str.toLowerCase().trim();
  if (email.includes("@")) {
    return { email, name: "" };
  }
  return null;
}

// ── Utilities ───────────────────────────────────────────────────────

function throwIfAborted(signal) {
  if (signal?.aborted) {
    throw new DOMException("Sync was cancelled", "AbortError");
  }
}
