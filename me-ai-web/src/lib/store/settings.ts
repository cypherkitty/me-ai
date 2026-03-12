/**
 * Settings Store — key/value persistence via DuckDB (OPFS).
 * All SQL runs in me-ai-core; this module calls the core.
 */

import { toJson, fromJson } from "./db.js";
import { getWasm } from "../core.js";

async function wasm() {
  return getWasm();
}

/**
 * Get a setting value by key.
 */
export async function getSetting<T>(key: string, fallback: T | null = null): Promise<T | null> {
  try {
    const w = await wasm();
    const raw = await w.getSetting(key);
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
    const w = await wasm();
    await w.setSetting(key, toJson(value));
  } catch (e) {
    console.error(`[settings] setSetting("${key}") failed:`, e);
  }
}

/**
 * Remove a setting by key.
 */
export async function removeSetting(key: string): Promise<void> {
  try {
    const w = await wasm();
    await w.removeSetting(key);
  } catch {
    /* ignore */
  }
}

/**
 * Get multiple settings at once (calls core getSetting per key).
 */
export async function getSettings(keys: string[]): Promise<Record<string, unknown>> {
  if (keys.length === 0) return {};
  const w = await wasm();
  const entries = await Promise.all(
    keys.map(async (k) => [k, fromJson<unknown>(String(await w.getSetting(k) ?? ""), null)] as const)
  );
  return Object.fromEntries(entries);
}
