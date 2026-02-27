/**
 * Settings Store — key/value persistence via DuckDB (OPFS).
 *
 * API mirrors the old Dexie-based interface:
 *   getSetting(key, fallback?)  →  async get
 *   setSetting(key, value)      →  async set
 *   removeSetting(key)          →  async remove
 *   getSettings(keys[])         →  async bulk-get
 *
 * Values are JSON-encoded so any serialisable type is supported.
 */

import { query, exec, toJson, fromJson } from "./db.js";

/**
 * Get a setting value by key.
 * @template T
 * @param {string} key
 * @param {T} [fallback] - Value returned if key is not found
 * @returns {Promise<T|null>}
 */
export async function getSetting(key, fallback = null) {
  try {
    const rows = await query(
      `SELECT value FROM settings WHERE key = ?`,
      [key]
    );
    if (rows.length === 0) return fallback;
    return fromJson(rows[0].value, fallback);
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
    await exec(
      `INSERT INTO settings (key, value) VALUES (?, ?)
       ON CONFLICT (key) DO UPDATE SET value = excluded.value`,
      [key, toJson(value)]
    );
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
    await exec(`DELETE FROM settings WHERE key = ?`, [key]);
  } catch {}
}

/**
 * Get multiple settings at once.
 * @param {string[]} keys
 * @returns {Promise<Record<string, *>>}
 */
export async function getSettings(keys) {
  if (keys.length === 0) return {};
  const placeholders = keys.map(() => "?").join(", ");
  const rows = await query(
    `SELECT key, value FROM settings WHERE key IN (${placeholders})`,
    keys
  );
  const map = Object.fromEntries(rows.map(r => [r.key, fromJson(r.value)]));
  return Object.fromEntries(keys.map(k => [k, map[k] ?? null]));
}
