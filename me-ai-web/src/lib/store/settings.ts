/**
 * Settings Store — key/value persistence via me-ai-core (IndexedDB/Rexie).
 * No fallbacks; fails explicitly when IndexedDB is unavailable.
 */

import { toJson, fromJson } from "./db.js";
import { getCore } from "../core.js";

/**
 * Get a setting value by key.
 * @param fallback — default value when the key is absent (not a storage fallback).
 */
export async function getSetting<T>(key: string, fallback: T | null = null): Promise<T | null> {
  const core = await getCore();
  const raw = await core.getSetting(key);
  if (raw == null || raw === undefined) return fallback;
  return fromJson(String(raw), fallback as T) as T | null;
}

/**
 * Set a setting value.
 */
export async function setSetting(key: string, value: unknown): Promise<void> {
  const core = await getCore();
  await core.setSetting(key, toJson(value));
}

/**
 * Remove a setting by key.
 */
export async function removeSetting(key: string): Promise<void> {
  const core = await getCore();
  await core.removeSetting(key);
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
