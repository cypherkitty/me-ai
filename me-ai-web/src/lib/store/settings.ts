/**
 * Settings Store — key/value persistence via me-ai-core (IndexedDB/Rexie).
 * No fallbacks; fails explicitly when IndexedDB is unavailable.
 */

import { toJson, fromJson } from "./db.js";
import {
  getSetting as getSettingRaw,
  setSetting as setSettingRaw,
  removeSetting as removeSettingRaw,
} from "../core.js";

/**
 * Get a setting value by key.
 * @param fallback — default value when the key is absent (not a storage fallback).
 */
export async function getSetting<T>(key: string, fallback: T | null = null): Promise<T | null> {
  const raw = await getSettingRaw(key);
  if (raw == null || raw === undefined) return fallback;
  return fromJson(String(raw), fallback as T) as T | null;
}

/**
 * Set a setting value.
 */
export async function setSetting(key: string, value: unknown): Promise<void> {
  await setSettingRaw(key, toJson(value));
}

/**
 * Remove a setting by key.
 */
export async function removeSetting(key: string): Promise<void> {
  await removeSettingRaw(key);
}

/**
 * Get multiple settings at once (calls core getSetting per key).
 */
export async function getSettings(keys: string[]): Promise<Record<string, unknown>> {
  if (keys.length === 0) return {};
  const entries = await Promise.all(
    keys.map(async (k) => [k, fromJson<unknown>(String(await getSettingRaw(k) ?? ""), null)] as const)
  );
  return Object.fromEntries(entries);
}
