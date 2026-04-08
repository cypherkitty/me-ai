/**
 * Minimal DB helpers. Persistence is IndexedDB via me-ai-core (Rexie).
 *
 * Exports: makeItemId, toJson, fromJson, wipeAllData, nukeAllLocalData, deleteDbAndReload.
 * All data operations go through core (direct WASM exports).
 */

import { getCore } from "./core-store.js";
import { clearSavedChatSessions } from "../chat-sessions.js";

/**
 * Clear all user data via core (items, syncState, contacts, rules, events, etc.) and reload.
 */
export async function wipeAllData(): Promise<void> {
  await getCore().clearAllData();
  clearSavedChatSessions();
  if (typeof window !== "undefined") {
    window.location.reload();
  }
}

/**
 * Delete the IndexedDB database "me-ai", clear caches and localStorage, then reload.
 */
export async function nukeAllLocalData(): Promise<void> {
  try {
    const dbs = (await indexedDB.databases?.()) ?? [];
    for (const { name } of dbs) {
      if (name) {
        await new Promise<void>((resolve) => {
          const r = indexedDB.deleteDatabase(name);
          r.onsuccess = () => resolve();
          r.onerror = () => resolve();
          r.onblocked = () => resolve();
          setTimeout(resolve, 3000);
        });
      }
    }
  } catch (e) {
    console.warn("[db] nukeAllLocalData: IDB sweep failed:", (e as Error)?.message);
  }
  try {
    if ("caches" in globalThis) {
      const names = await caches.keys();
      await Promise.allSettled(names.map((n) => caches.delete(n)));
    }
  } catch (e) {
    console.warn("[db] nukeAllLocalData: Cache API failed:", (e as Error)?.message);
  }
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    window.location.reload();
  }
}

// ─── Utilities (no DB) ─────────────────────────────────────────────────────

export function makeItemId(sourceType: string, sourceId: string): string {
  return `${sourceType}:${sourceId}`;
}

export function toJson(value: unknown): string {
  return JSON.stringify(value ?? null);
}

export function fromJson<T>(text: string | null | undefined, fallback: T): T {
  if (text == null) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}
