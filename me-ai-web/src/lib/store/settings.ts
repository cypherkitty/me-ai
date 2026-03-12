/**
 * Settings Store — key/value persistence via DuckDB (OPFS).
 * All SQL runs in me-ai-core; this module calls the core.
 */

import { toJson, fromJson } from "./db.js";
import { getCore } from "../core.js";

/**
 * Get a setting value by key.
 */
export async function getSetting<T>(key: string, fallback: T | null = null): Promise<T | null> {
  try {
    const core = await getCore();
    const raw = await core.getSetting(key);
    if (raw == null || raw === undefined) return fallback;
    return fromJson(String(raw), fallback as T) as T | null;
  } catch {
    return fallback;
  }
}

/**
 * Set a setting value.
 */
export async function setSetting(key: string, value: unknown): Promise<void> {
  try {
    const core = await getCore();
    await core.setSetting(key, toJson(value));
  } catch (e) {
    console.error(`[settings] setSetting("${key}") failed:`, e);
  }
}

/**
 * Remove a setting by key.
 */
export async function removeSetting(key: string): Promise<void> {
  try {
    const core = await getCore();
    await core.removeSetting(key);
  } catch {
    /* ignore */
  }
}

/**
 * Get multiple settings at once (calls core getSetting per key).
 */
export async function getSettings(keys: string[]): Promise<Record<string, unknown>> {
  if (keys.length === 0) return {};
  const core = await getCore();
  const entries = await Promise.all(
    keys.map(async (k) => [k, fromJson<unknown>(String(await core.getSetting(k) ?? ""), null)] as const)
  );
  return Object.fromEntries(entries);
}
