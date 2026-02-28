/**
 * Thin IndexedDB wrapper for reliable email + sync-state persistence.
 *
 * DuckDB-WASM's OPFS backend has known WAL-replay and checksum issues that
 * cause data loss on page reload. This module provides a simple, battle-tested
 * IndexedDB store that:
 *
 *   - Persists raw email rows and syncState across reloads (write-through)
 *   - Rehydrates DuckDB in-memory tables on startup
 *
 * Stores:
 *   "items"     — email rows (keyed by id)
 *   "syncState" — one row per sourceType
 *   "contacts"  — contact rows (keyed by email)
 */

const DB_NAME    = "me-ai-store";
const DB_VERSION = 1;

/** @type {IDBDatabase | null} */
let _idb = null;

function openIdb() {
  if (_idb) return Promise.resolve(_idb);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("items"))
        db.createObjectStore("items", { keyPath: "id" });
      if (!db.objectStoreNames.contains("syncState"))
        db.createObjectStore("syncState", { keyPath: "sourceType" });
      if (!db.objectStoreNames.contains("contacts"))
        db.createObjectStore("contacts", { keyPath: "email" });
    };
    req.onsuccess  = (e) => { _idb = e.target.result; resolve(_idb); };
    req.onerror    = ()  => reject(req.error);
  });
}

function tx(storeName, mode, fn) {
  return openIdb().then(db => new Promise((resolve, reject) => {
    const t     = db.transaction(storeName, mode);
    const store = t.objectStore(storeName);
    const req   = fn(store);
    t.oncomplete = () => resolve(req?.result);
    t.onerror    = () => reject(t.error);
    t.onabort    = () => reject(t.error);
  }));
}

// ── Items (emails) ────────────────────────────────────────────────────

/** Upsert a batch of item rows. */
export async function idbPutItems(items) {
  if (!items.length) return;
  const db = await openIdb();
  await new Promise((resolve, reject) => {
    const t = db.transaction("items", "readwrite");
    const s = t.objectStore("items");
    for (const item of items) s.put(item);
    t.oncomplete = resolve;
    t.onerror    = () => reject(t.error);
    t.onabort    = () => reject(t.error);
  });
}

/** Delete item rows by id. */
export async function idbDeleteItems(ids) {
  if (!ids.length) return;
  const db = await openIdb();
  await new Promise((resolve, reject) => {
    const t = db.transaction("items", "readwrite");
    const s = t.objectStore("items");
    for (const id of ids) s.delete(id);
    t.oncomplete = resolve;
    t.onerror    = () => reject(t.error);
    t.onabort    = () => reject(t.error);
  });
}

/** Return all item rows. */
export function idbGetAllItems() {
  return tx("items", "readonly", s => s.getAll());
}

/** Delete all items for a given sourceType. */
export async function idbClearItemsBySource(sourceType) {
  const all = await idbGetAllItems();
  const ids = all.filter(r => r.sourceType === sourceType).map(r => r.id);
  return idbDeleteItems(ids);
}

// ── SyncState ─────────────────────────────────────────────────────────

export function idbPutSyncState(row) {
  return tx("syncState", "readwrite", s => s.put(row));
}

export function idbGetSyncState(sourceType) {
  return tx("syncState", "readonly", s => s.get(sourceType));
}

export function idbDeleteSyncState(sourceType) {
  return tx("syncState", "readwrite", s => s.delete(sourceType));
}

export function idbGetAllSyncStates() {
  return tx("syncState", "readonly", s => s.getAll());
}

// ── Contacts ──────────────────────────────────────────────────────────

export async function idbPutContacts(contacts) {
  if (!contacts.length) return;
  const db = await openIdb();
  await new Promise((resolve, reject) => {
    const t = db.transaction("contacts", "readwrite");
    const s = t.objectStore("contacts");
    for (const c of contacts) s.put(c);
    t.oncomplete = resolve;
    t.onerror    = () => reject(t.error);
    t.onabort    = () => reject(t.error);
  });
}

export function idbGetAllContacts() {
  return tx("contacts", "readonly", s => s.getAll());
}
