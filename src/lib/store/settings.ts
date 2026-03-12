/**
 * Settings Store — key/value persistence via DuckDB (OPFS).
 *
 * API mirrors the old Dexie-based interface (now backed by DuckDB):
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
 */
export async function getSetting<T>(key: string, fallback: T | null = null): Promise<T | null> {
  try {
    const rows = await query(`SELECT value FROM settings WHERE key = ?`, [key]);
    if (rows.length === 0) return fallback;
    const raw = rows[0].value as string | undefined;
    return fromJson(raw ?? "", fallback as T) as T | null;
  } catch {
    return fallback;
  }
}

/**
 * Set a setting value.
 */
export async function setSetting(key: string, value: unknown): Promise<void> {
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
 */
export async function removeSetting(key: string): Promise<void> {
  try {
    await exec(`DELETE FROM settings WHERE key = ?`, [key]);
  } catch {
    /* ignore */
  }
}

/**
 * Get multiple settings at once.
 */
export async function getSettings(keys: string[]): Promise<Record<string, unknown>> {
  if (keys.length === 0) return {};
  const placeholders = keys.map(() => "?").join(", ");
  const rows = await query(
    `SELECT key, value FROM settings WHERE key IN (${placeholders})`,
    keys
  );
  const map = Object.fromEntries(
    rows.map((r) => [r.key as string, fromJson<unknown>(r.value as string, null)])
  );
  return Object.fromEntries(keys.map((k) => [k, map[k] ?? null]));
}
