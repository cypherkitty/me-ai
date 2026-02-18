/**
 * Settings Store — key/value persistence via IndexedDB.
 *
 * Replaces localStorage and sessionStorage entirely.
 * All app settings, preferences, and session tokens live here.
 *
 * API mirrors localStorage for easy migration:
 *   getSetting(key, fallback?)  →  async get
 *   setSetting(key, value)      →  async set
 *   removeSetting(key)          →  async remove
 */

import { db } from "./db.js";

/**
 * Get a setting value by key.
 * @template T
 * @param {string} key
 * @param {T} [fallback] - Value returned if key is not found
 * @returns {Promise<T|null>}
 */
export async function getSetting(key, fallback = null) {
  try {
    const row = await db.settings.get(key);
    return row?.value ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Set a setting value.
 * @param {string} key
 * @param {*} value - Any JSON-serialisable value
 * @returns {Promise<void>}
 */
export async function setSetting(key, value) {
  try {
    await db.settings.put({ key, value });
  } catch (e) {
    console.error(`[settings] setSetting("${key}") failed:`, e);
  }
}

/**
 * Remove a setting by key.
 * @param {string} key
 * @returns {Promise<void>}
 */
export async function removeSetting(key) {
  try {
    await db.settings.delete(key);
  } catch {}
}

/**
 * Get multiple settings at once.
 * @param {string[]} keys
 * @returns {Promise<Record<string, *>>}
 */
export async function getSettings(keys) {
  const rows = await db.settings.bulkGet(keys);
  return Object.fromEntries(
    keys.map((key, i) => [key, rows[i]?.value ?? null])
  );
}
