/**
 * Universal data store backed by IndexedDB via Dexie.
 *
 * Designed to hold data from multiple sources (Gmail, messengers, social networks)
 * with a common schema that enables cross-source querying and LLM access.
 *
 * Schema design considerations:
 * - Items use composite IDs ("sourceType:sourceId") for uniqueness across sources
 * - Compound index [sourceType+date] enables efficient per-source date queries
 * - Multi-entry index on labels enables Gmail label filtering
 * - Contacts table builds a natural social graph across all sources
 * - Raw field preserves original API responses for future analysis / graph building
 */

import Dexie from "dexie";

export const db = new Dexie("me-ai-store");

db.version(1).stores({
  items:
    "id, sourceType, sourceId, threadKey, date, from, *labels, [sourceType+date]",
  contacts: "++id, &email, name, lastSeen",
  syncState: "sourceType",
});

db.version(2).stores({
  items:
    "id, sourceType, sourceId, threadKey, date, from, *labels, [sourceType+date]",
  contacts: "++id, &email, name, lastSeen",
  syncState: "sourceType",
  actionItems: "++id, type, status, sourceItemId, createdAt, dueDate, [type+status]",
});

db.version(3).stores({
  // ── Data items (emails, messages, posts, etc.) ─────────────────────
  items:
    "id, sourceType, sourceId, threadKey, date, from, *labels, [sourceType+date]",

  // ── Contacts extracted from data items ─────────────────────────────
  contacts: "++id, &email, name, lastSeen",

  // ── Sync state per source type ─────────────────────────────────────
  syncState: "sourceType",

  // ── Email classifications by LLM triage ────────────────────────────
  // emailId: reference to items table (e.g. "gmail:18e12345abcd")
  // action: DELETE | NOTIFY | READ_SUMMARIZE | REPLY_NEEDED | REVIEW | NO_ACTION
  // status: pending | acted | dismissed
  emailClassifications: "emailId, action, date, scannedAt, status, [action+status]",

  // Drop v2 table
  actionItems: null,
});

/**
 * Generate a universal item ID from source type and source-specific ID.
 * @param {string} sourceType - e.g. "gmail", "telegram"
 * @param {string} sourceId - source-specific ID
 * @returns {string} Universal ID like "gmail:18e12345abcd"
 */
export function makeItemId(sourceType, sourceId) {
  return `${sourceType}:${sourceId}`;
}
