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
  const dbs = (await indexedDB.databases?.()) ?? [];
  for (const { name } of dbs) {
    if (name) {
      await new Promise<void>((resolve, reject) => {
        const r = indexedDB.deleteDatabase(name);
        r.onsuccess = () => resolve();
        r.onerror = () =>
          reject(
            new Error(
              `Failed to delete IndexedDB "${name}": ${r.error?.message ?? "unknown error"}`
            )
          );
        r.onblocked = () =>
          reject(new Error(`Deleting IndexedDB "${name}" is blocked by an open connection`));
        setTimeout(() => reject(new Error(`Timeout deleting IndexedDB "${name}"`)), 3000);
      });
    }
  }
  try {
    if ("caches" in globalThis) {
      const names = await caches.keys();
      await Promise.allSettled(names.map((n) => caches.delete(n)));
    }
  } catch (e) {
    console.warn("[db] nukeAllLocalData: Cache API failed:", (e as Error)?.message);
  }
  localStorage.clear();
  sessionStorage.clear();
  if (typeof window !== "undefined") {
    window.location.reload();
  }
}

// ─── Utilities (no DB) ─────────────────────────────────────────────────────

export function toJson(value: unknown): string {
  return JSON.stringify(value ?? null);
}
