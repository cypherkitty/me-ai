/**
 * Thin IndexedDB wrapper used as write-through cache for DuckDB.
 *
 * DuckDB-WASM's OPFS backend has known WAL-replay and checksum issues that
 * cause data loss on page reload. This module provides a simple IndexedDB
 * store that:
 *
 *   - Persists raw email rows and syncState across reloads (write-through)
 *   - Rehydrates DuckDB in-memory tables on startup
 *
 * Stores:
 *   "items"     — email rows (keyed by id)
 *   "syncState" — one row per sourceType
 *   "contacts"  — contact rows (keyed by email)
 */

import type { SyncState, ContactRow } from '$lib/types';

/** IDB item row: same as StoredItem but labels/raw may be JSON strings when stored for rehydration */
export interface IdbItemRow {
  id: string;
  sourceType: string;
  sourceId: string;
  threadKey: string;
  type: string;
  from: string;
  to: string;
  cc: string;
  subject: string;
  snippet: string;
  body: string;
  htmlBody: string | null;
  date: number | null;
  labels?: string | string[];
  messageId: string;
  inReplyTo: string;
  references: string;
  raw?: string | unknown;
  syncedAt: number | null;
}

const DB_NAME = "me-ai-store";
const DB_VERSION = 1;

let _idb: IDBDatabase | null = null;

function openIdb(): Promise<IDBDatabase> {
  if (_idb) return Promise.resolve(_idb);
  const idbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("items"))
        db.createObjectStore("items", { keyPath: "id" });
      if (!db.objectStoreNames.contains("syncState"))
        db.createObjectStore("syncState", { keyPath: "sourceType" });
      if (!db.objectStoreNames.contains("contacts"))
        db.createObjectStore("contacts", { keyPath: "email" });
    };
    req.onsuccess = (e) => {
      _idb = (e.target as IDBOpenDBRequest).result;
      resolve(_idb);
    };
    req.onerror = () => reject(req.error);
  });
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("IDB open timed out after 5 s")), 5000)
  );
  return Promise.race([idbPromise, timeout]);
}

/** Close the cached IDB connection so deleteDatabase is not blocked. */
export function closeIdb(): void {
  if (_idb) {
    try {
      _idb.close();
    } catch {
      /* ignore */
    }
    _idb = null;
  }
}

function tx<T>(
  storeName: "items" | "syncState" | "contacts",
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openIdb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(storeName, mode);
        const store = t.objectStore(storeName);
        const req = fn(store);
        t.oncomplete = () => resolve(req.result);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      })
  );
}

// ── Items (emails) ────────────────────────────────────────────────────

/** Upsert a batch of item rows. */
export async function idbPutItems(items: IdbItemRow[]): Promise<void> {
  if (!items.length) return;
  const db = await openIdb();
  await new Promise<void>((resolve, reject) => {
    const t = db.transaction("items", "readwrite");
    const s = t.objectStore("items");
    for (const item of items) s.put(item);
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

/** Delete item rows by id. */
export async function idbDeleteItems(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const db = await openIdb();
  await new Promise<void>((resolve, reject) => {
    const t = db.transaction("items", "readwrite");
    const s = t.objectStore("items");
    for (const id of ids) s.delete(id);
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

/** Return all item rows. */
export function idbGetAllItems(): Promise<IdbItemRow[]> {
  return tx("items", "readonly", (s) => s.getAll());
}

/** Delete all items for a given sourceType. */
export async function idbClearItemsBySource(sourceType: string): Promise<void> {
  const all = await idbGetAllItems();
  const ids = all.filter((r) => r.sourceType === sourceType).map((r) => r.id);
  return idbDeleteItems(ids);
}

// ── SyncState ─────────────────────────────────────────────────────────

export function idbPutSyncState(row: SyncState): Promise<void> {
  return tx("syncState", "readwrite", (s) => s.put(row)).then(() => {});
}

export function idbGetSyncState(sourceType: string): Promise<SyncState | undefined> {
  return tx("syncState", "readonly", (s) => s.get(sourceType));
}

export function idbDeleteSyncState(sourceType: string): Promise<void> {
  return tx("syncState", "readwrite", (s) => s.delete(sourceType));
}

export function idbGetAllSyncStates(): Promise<SyncState[]> {
  return tx("syncState", "readonly", (s) => s.getAll());
}

// ── Contacts ──────────────────────────────────────────────────────────

export async function idbPutContacts(contacts: ContactRow[]): Promise<void> {
  if (!contacts.length) return;
  const db = await openIdb();
  await new Promise<void>((resolve, reject) => {
    const t = db.transaction("contacts", "readwrite");
    const s = t.objectStore("contacts");
    for (const c of contacts) s.put(c);
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

export function idbGetAllContacts(): Promise<ContactRow[]> {
  return tx("contacts", "readonly", (s) => s.getAll());
}

/** Delete all contacts. */
export function idbClearAllContacts(): Promise<void> {
  return tx("contacts", "readwrite", (s) => s.clear());
}

/**
 * Wipe every store — items, syncState, contacts.
 * Called when the user resets all local data.
 */
export async function idbWipeAll(): Promise<void> {
  const db = await openIdb();
  await new Promise<void>((resolve, reject) => {
    const t = db.transaction(["items", "syncState", "contacts"], "readwrite");
    t.objectStore("items").clear();
    t.objectStore("syncState").clear();
    t.objectStore("contacts").clear();
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}
