/**
 * Filesystem source — persist FileSystemDirectoryHandle entries in IndexedDB.
 * Supports multiple named directories as part of the Filesystem source config.
 */

const DB_NAME = "me-ai-filesystem";
const STORE_NAME = "handles";
const DB_VERSION = 2;

export interface DirectoryEntry {
  id: string;
  label: string;
  handle: FileSystemDirectoryHandle;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
  });
}

export async function getDirectories(): Promise<DirectoryEntry[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
    req.onsuccess = () => {
      db.close();
      resolve(req.result as DirectoryEntry[]);
    };
  });
}

export async function addDirectory(
  label: string,
  handle: FileSystemDirectoryHandle
): Promise<DirectoryEntry> {
  const db = await openDb();
  const entry: DirectoryEntry = { id: crypto.randomUUID(), label, handle };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(entry);
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
    req.onsuccess = () => {
      db.close();
      resolve(entry);
    };
  });
}

export async function removeDirectory(id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
    req.onsuccess = () => {
      db.close();
      resolve();
    };
  });
}

/** Returns the first configured directory's handle, or null if none. */
export async function getDefaultDirectory(): Promise<FileSystemDirectoryHandle | null> {
  const dirs = await getDirectories();
  return dirs[0]?.handle ?? null;
}
