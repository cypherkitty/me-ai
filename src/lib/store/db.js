/**
 * Dexie database — persistent IndexedDB storage.
 *
 * Single module-level instance; import `db` directly or call `getDb()`
 * (synchronous — Dexie opens lazily on first operation).
 */

import Dexie from "dexie";

export const db = new Dexie("me-ai");

db.version(1).stores({
  items:                "id, sourceType, date, threadKey, [sourceType+date]",
  contacts:             "email, lastSeen",
  syncState:            "sourceType",
  emailClassifications: "emailId, action, group, date, scannedAt, status, [action+status], [group+status]",
  settings:             "key",
  auditLog:             "id, emailId, eventType, executedAt, success",
});

/**
 * Synchronous accessor kept for backward-compat with `await getDb()` callers.
 * Dexie opens the database lazily — no async init required.
 */
export function getDb() {
  return db;
}

/**
 * Generate a universal item ID from source type and source-specific ID.
 * @param {string} sourceType - e.g. "gmail"
 * @param {string} sourceId   - source-specific ID
 * @returns {string} e.g. "gmail:18e12345abcd"
 */
export function makeItemId(sourceType, sourceId) {
  return `${sourceType}:${sourceId}`;
}
