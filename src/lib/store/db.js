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
  items:
    "id, sourceType, sourceId, threadKey, date, from, *labels, [sourceType+date]",
  contacts: "++id, &email, name, lastSeen",
  syncState: "sourceType",
  emailClassifications: "emailId, action, date, scannedAt, status, [action+status]",
  actionItems: null,
});

db.version(4).stores({
  // ── Data items (emails, messages, posts, etc.) ─────────────────────
  items:
    "id, sourceType, sourceId, threadKey, date, from, *labels, [sourceType+date]",

  // ── Contacts extracted from data items ─────────────────────────────
  contacts: "++id, &email, name, lastSeen",

  // ── Sync state per source type ─────────────────────────────────────
  syncState: "sourceType",

  // ── Email classifications by LLM triage ────────────────────────────
  // action: dynamic UPPER_SNAKE_CASE string (e.g. DELETE, TRACK_DELIVERY)
  // tags: multi-entry index for tag-based queries
  // summary: LLM-generated summary of the email
  emailClassifications: "emailId, action, date, scannedAt, status, *tags, [action+status]",
});

db.version(5).stores({
  items:
    "id, sourceType, sourceId, threadKey, date, from, *labels, [sourceType+date]",
  contacts: "++id, &email, name, lastSeen",
  syncState: "sourceType",
  emailClassifications: "emailId, action, date, scannedAt, status, *tags, [action+status]",

  // ── App settings & auth tokens ──────────────────────────────────────
  // key-value store for all app settings and session tokens.
  // Replaces localStorage and sessionStorage entirely.
  settings: "&key",
});

db.version(6).stores({
  items:
    "id, sourceType, sourceId, threadKey, date, from, *labels, [sourceType+date]",
  contacts: "++id, &email, name, lastSeen",
  syncState: "sourceType",

  // ── Email classifications by LLM triage ──────────────────────────────
  // group: NOISE | INFO | CRITICAL — execution tier for the event type
  emailClassifications: "emailId, action, group, date, scannedAt, status, *tags, [action+status], [group+status]",

  settings: "&key",
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
