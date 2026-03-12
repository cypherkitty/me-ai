/**
 * DuckDB-WASM database — persistent OPFS storage (falls back to in-memory).
 *
 * Exports:
 *   getDb()         — async, returns initialised AsyncDuckDB instance
 *   query(sql, p)   — run a SELECT, returns rows as plain objects
 *   exec(sql, p)    — run INSERT / UPDATE / DELETE / DDL
 *   makeItemId()    — utility to build composite IDs
 *
 * All callers must await getDb() (or use query/exec directly) — there is no
 * synchronous access because DuckDB WASM is inherently async.
 *
 * Persistence strategy:
 *   Chrome/Edge  → OPFS  (survives restarts, cache clears)
 *   Firefox/Safari → in-memory (data lost on tab close)
 *
 * OPFS + CHECKPOINT:
 *   DuckDB WASM uses a WAL; writes are buffered in memory and only reach
 *   the OPFS file after an explicit CHECKPOINT.  exec() schedules a
 *   debounced checkpoint (50 ms) after every write, and a best-effort
 *   checkpoint fires on beforeunload.
 */

import duckdb_mvp_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import duckdb_eh_wasm from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import mvp_worker_url from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import eh_worker_url from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";
import * as duckdb from "@duckdb/duckdb-wasm";

/** Minimal DuckDB connection interface (package has no types). */
interface DuckDBQueryResult {
  toArray(): Array<{ toJSON?: () => Record<string, unknown> }>;
}
interface DuckDBPreparedStatement {
  query(...params: unknown[]): Promise<DuckDBQueryResult>;
  close(): Promise<void>;
}
export interface DuckDBConnection {
  query(sql: string): Promise<DuckDBQueryResult>;
  prepare(sql: string): Promise<DuckDBPreparedStatement>;
  close(): Promise<void>;
}

// ── Singleton ────────────────────────────────────────────────────────

let _db: InstanceType<typeof duckdb.AsyncDuckDB> | null = null;
let _conn: DuckDBConnection | null = null;
let _initPromise: Promise<InstanceType<typeof duckdb.AsyncDuckDB>> | null = null;
let _usingOpfs = false;
let _opfsWriteFailed = false;
let _checkpointTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Debounced CHECKPOINT — flushes the DuckDB WAL to the OPFS file.
 * DuckDB WASM does NOT auto-flush on page unload, so without this every
 * write is lost when the tab is closed or reloaded.
 *
 * We debounce (50 ms) to batch rapid writes (e.g. bulk email sync) into
 * a single checkpoint rather than one per row.
 */
function _scheduleCheckpoint(): void {
  if (!_usingOpfs || !_conn) return;
  if (_checkpointTimer) clearTimeout(_checkpointTimer);
  _checkpointTimer = setTimeout(async () => {
    try {
      await _conn!.query("CHECKPOINT");
    } catch (e) {
      console.warn("[db] CHECKPOINT failed:", (e as Error)?.message ?? e);
    }
    _checkpointTimer = null;
  }, 50);
}

/**
 * Immediate CHECKPOINT — use for critical writes (auth tokens, settings)
 * where we can't afford to lose data on a fast reload.
 */
export async function checkpoint(): Promise<void> {
  if (!_usingOpfs || !_conn) return;
  if (_checkpointTimer) {
    clearTimeout(_checkpointTimer);
    _checkpointTimer = null;
  }
  try {
    await _conn.query("CHECKPOINT");
  } catch (e) {
    console.warn("[db] CHECKPOINT failed:", (e as Error)?.message ?? e);
  }
}

// ── Init ─────────────────────────────────────────────────────────────

async function _init(): Promise<InstanceType<typeof duckdb.AsyncDuckDB>> {
  const BUNDLES = {
    mvp: { mainModule: duckdb_mvp_wasm, mainWorker: mvp_worker_url },
    eh: { mainModule: duckdb_eh_wasm, mainWorker: eh_worker_url },
  };

  const bundle = await duckdb.selectBundle(BUNDLES);
  const workerUrl = bundle.mainWorker;
  if (!workerUrl) throw new Error("DuckDB bundle missing mainWorker");
  const worker = new Worker(workerUrl);
  const logger = new duckdb.VoidLogger();

  _db = new duckdb.AsyncDuckDB(logger, worker);
  await _db.instantiate(bundle.mainModule, bundle.pthreadWorker);

  const opfsSupported =
    typeof navigator !== "undefined" &&
    typeof navigator.storage?.getDirectory === "function";

  if (opfsSupported && !_opfsWriteFailed) {
    try {
      await _db.open({
        path: "opfs://me-ai.db",
        accessMode: duckdb.DuckDBAccessMode.READ_WRITE,
      });
      _usingOpfs = true;
      console.info("[db] Using OPFS persistence (opfs://me-ai.db)");
    } catch (e) {
      console.warn(
        "[db] OPFS open failed, falling back to in-memory:",
        (e as Error)?.message ?? e
      );
      await _db.open({ path: ":memory:" });
    }
  } else {
    if (_opfsWriteFailed) {
      console.info(
        "[db] Using in-memory (OPFS write probe failed earlier this session)"
      );
    } else {
      console.info("[db] OPFS not available, using in-memory database");
    }
    await _db.open({ path: ":memory:" });
  }

  _conn = (await _db.connect()) as DuckDBConnection;

  if (_usingOpfs) {
    try {
      await _conn.query("CREATE TABLE IF NOT EXISTS __opfs_probe (x INTEGER)");
      await _conn.query("INSERT INTO __opfs_probe VALUES (1)");
      await _conn.query("DROP TABLE __opfs_probe");
    } catch (e) {
      const msg = (e as Error)?.message ?? String(e);
      if (msg.includes("write mode") || msg.includes("TransactionContext")) {
        console.warn(
          "[db] OPFS writes failed, falling back to in-memory for this session:",
          msg
        );
        _opfsWriteFailed = true;
        try {
          await _conn.close();
        } catch {
          /* ignore */
        }
        try {
          await _db.terminate();
        } catch {
          /* ignore */
        }
        _conn = null;
        _db = null;
        _initPromise = null;
        _usingOpfs = false;
        return getDb();
      }
      throw e;
    }
  }

  if (_usingOpfs && typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      _conn?.query("CHECKPOINT").catch(() => {});
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        _conn?.query("CHECKPOINT").catch(() => {});
      }
    });
  }

  // Schema and migrations run from me-ai-core when the core is first used (createSchemaAndMigrations).
  // Post-schema steps (items count, rehydrate) run from core.ts getWasm() via postSchemaInit().

  return _db;
}

/**
 * Run after core.createSchemaAndMigrations(): fresh-OPFS IDB wipe and rehydrate from IDB.
 * itemsCount comes from core.getItemsCount() (no SQL in JS).
 */
export async function postSchemaInit(itemsCount: number): Promise<void> {
  if (!_conn) return;
  if (_usingOpfs && itemsCount === 0) {
    try {
      const { idbWipeAll } = await import("./idb.js");
      await idbWipeAll();
      console.info("[db] Fresh OPFS detected — wiped IDB cache to stay in sync");
    } catch {
      /* ignore */
    }
  }
  await _rehydrateFromIdb(_conn);
}

async function _rehydrateFromIdb(conn: DuckDBConnection): Promise<void> {
  try {
    const { idbGetAllItems, idbGetAllSyncStates, idbGetAllContacts } =
      await import("./idb.js");

    const [items, syncStates, contacts] = await Promise.all([
      idbGetAllItems(),
      idbGetAllSyncStates(),
      idbGetAllContacts(),
    ]);

    if (items.length > 0) {
      console.info(`[db] Rehydrating ${items.length} emails from IDB cache`);
      const sql = `INSERT INTO items
         (id, sourceType, sourceId, threadKey, type, "from", "to", cc, subject,
          snippet, body, htmlBody, date, labels, messageId, inReplyTo, "references",
          raw, syncedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (id) DO NOTHING`;
      for (const item of items) {
        try {
          const stmt = await conn.prepare(sql);
          await stmt.query(
            item.id,
            item.sourceType,
            item.sourceId,
            item.threadKey,
            item.type,
            item.from,
            item.to,
            item.cc,
            item.subject,
            item.snippet,
            item.body,
            item.htmlBody,
            item.date,
            item.labels,
            item.messageId,
            item.inReplyTo,
            item.references,
            item.raw,
            item.syncedAt
          );
          await stmt.close();
        } catch {
          /* ignore */
        }
      }
    }

    for (const s of syncStates) {
      try {
        const stmt = await conn.prepare(
          `INSERT INTO syncState (sourceType, historyId, lastSyncAt, totalItems, oldestPageToken)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT (sourceType) DO NOTHING`
        );
        await stmt.query(
          s.sourceType,
          s.historyId,
          s.lastSyncAt,
          s.totalItems,
          s.oldestPageToken
        );
        await stmt.close();
      } catch {
        /* ignore */
      }
    }

    for (const c of contacts) {
      try {
        const stmt = await conn.prepare(
          `INSERT INTO contacts (email, name, firstSeen, lastSeen)
           VALUES (?, ?, ?, ?)
           ON CONFLICT (email) DO NOTHING`
        );
        await stmt.query(c.email, c.name, c.firstSeen, c.lastSeen);
        await stmt.close();
      } catch {
        /* ignore */
      }
    }

    if (items.length > 0 || syncStates.length > 0) {
      console.info("[db] Rehydration complete");
    }
  } catch (e) {
    console.warn(
      "[db] Rehydration from IDB cache failed:",
      (e as Error)?.message ?? e
    );
  }
}

/**
 * Returns the initialised DuckDB instance (lazy singleton).
 */
export function getDb(): Promise<InstanceType<typeof duckdb.AsyncDuckDB>> {
  if (!_initPromise) _initPromise = _init();
  return _initPromise;
}

/**
 * Nuke all user data — items, syncState, contacts — from DuckDB and IDB cache.
 * Does NOT touch schema tables (event categories, pipelines, etc.).
 */
export async function wipeAllData(): Promise<void> {
  const { idbWipeAll } = await import("./idb.js");

  if (_conn) {
    try {
      await _conn.query(`DELETE FROM items`);
    } catch {}
    try {
      await _conn.query(`DELETE FROM syncState`);
    } catch {}
    try {
      await _conn.query(`DELETE FROM contacts`);
    } catch {}
  }

  if (_conn) {
    try {
      await _conn.close();
    } catch {}
    _conn = null;
  }
  if (_db) {
    try {
      await _db.terminate();
    } catch {}
    _db = null;
  }
  _initPromise = null;
  _usingOpfs = false;

  try {
    const opfsRoot = await navigator.storage.getDirectory();
    for (const name of ["me-ai.db", "me-ai.db.wal"]) {
      try {
        await opfsRoot.removeEntry(name);
      } catch {
        /* already gone */
      }
    }
  } catch {
    /* OPFS not supported or already gone */
  }

  await idbWipeAll();

  window.location.reload();
}

// ── Query helpers ─────────────────────────────────────────────────────

async function _getConn(): Promise<DuckDBConnection> {
  await getDb();
  return _conn!;
}

/**
 * Run a SQL query and return rows as plain JS objects.
 */
export async function query(
  sql: string,
  params: unknown[] = []
): Promise<Record<string, unknown>[]> {
  const conn = await _getConn();
  let result: DuckDBQueryResult;
  if (params.length > 0) {
    const stmt = await conn.prepare(sql);
    result = await stmt.query(...params);
    await stmt.close();
  } else {
    result = await conn.query(sql);
  }
  return result.toArray().map((row) => (row.toJSON ? row.toJSON() : (row as Record<string, unknown>)));
}

/**
 * Execute a SQL statement (INSERT / UPDATE / DELETE / DDL).
 * Schedules a debounced CHECKPOINT to flush the WAL to OPFS.
 */
export async function exec(sql: string, params: unknown[] = []): Promise<void> {
  const conn = await _getConn();
  if (params.length > 0) {
    const stmt = await conn.prepare(sql);
    await stmt.query(...params);
    await stmt.close();
  } else {
    await conn.query(sql);
  }
  _scheduleCheckpoint();
}

export interface ExecBatchStatement {
  sql: string;
  params?: unknown[];
}

/**
 * Execute multiple SQL statements (bulk inserts). Calls checkpoint after.
 */
export async function execBatch(statements: ExecBatchStatement[]): Promise<void> {
  if (!statements.length) return;
  const conn = await _getConn();

  if (_usingOpfs) {
    for (const { sql, params = [] } of statements) {
      if (params.length > 0) {
        const stmt = await conn.prepare(sql);
        await stmt.query(...params);
        await stmt.close();
      } else {
        await conn.query(sql);
      }
    }
  } else {
    await conn.query("BEGIN");
    try {
      for (const { sql, params = [] } of statements) {
        if (params.length > 0) {
          const stmt = await conn.prepare(sql);
          await stmt.query(...params);
          await stmt.close();
        } else {
          await conn.query(sql);
        }
      }
      await conn.query("COMMIT");
    } catch (e) {
      try {
        await conn.query("ROLLBACK");
      } catch {
        /* ignore */
      }
      throw e;
    }
  }
  await checkpoint();
}

// ── OPFS helpers ──────────────────────────────────────────────────────

/** OPFS file size in bytes (for stats). Table counts live in me-ai-core; use getOpfsStats from core. */
export async function getOpfsFileBytes(): Promise<number> {
  const supported =
    typeof navigator !== "undefined" &&
    typeof navigator.storage?.getDirectory === "function";
  if (!supported) return 0;
  try {
    const root = await navigator.storage.getDirectory();
    const fh = await root.getFileHandle("me-ai.db", { create: false });
    const file = await fh.getFile();
    return file.size;
  } catch {
    return 0;
  }
}

/**
 * Close the DuckDB connection, delete the OPFS file, then reload the page.
 */
export async function deleteOpfsFileAndReload(): Promise<void> {
  try {
    await checkpoint();
  } catch {}

  try {
    await _conn?.close();
  } catch {}
  try {
    await _db?.terminate();
  } catch {}
  _conn = null;
  _db = null;
  _initPromise = null;

  try {
    const root = await navigator.storage.getDirectory();
    await root.removeEntry("me-ai.db");
  } catch (e) {
    console.warn("[db] Could not delete OPFS file:", (e as Error)?.message);
  }

  window.location.reload();
}

/**
 * Wipe ALL local data for this origin and reload.
 */
export async function nukeAllLocalData(): Promise<void> {
  try {
    await checkpoint();
  } catch {}
  try {
    await _conn?.close();
  } catch {}
  try {
    await _db?.terminate();
  } catch {}
  _conn = null;
  _db = null;
  _initPromise = null;

  try {
    const root = await navigator.storage.getDirectory();
    const entries: string[] = [];
    const dir = root as unknown as { entries(): AsyncIterableIterator<[string, FileSystemHandle]> };
    for await (const [name] of dir.entries()) {
      entries.push(name);
    }
    await Promise.allSettled(
      entries.map((name) => root.removeEntry(name, { recursive: true }))
    );
  } catch (e) {
    console.warn("[db] nukeAllLocalData: OPFS sweep failed:", (e as Error)?.message);
  }

  try {
    const { closeIdb } = await import("./idb.js");
    closeIdb();
  } catch {}

  try {
    const dbs = (await indexedDB.databases?.()) ?? [];
    await Promise.allSettled(
      dbs.map(
        ({ name }) =>
          new Promise<void>((res) => {
            if (!name) return res();
            const r = indexedDB.deleteDatabase(name);
            r.onsuccess = () => res();
            r.onerror = () => res();
            r.onblocked = () => {
              console.warn(`[db] deleteDatabase("${name}") blocked — force-proceeding`);
              res();
            };
            setTimeout(res, 3000);
          })
      )
    );
  } catch (e) {
    console.warn("[db] nukeAllLocalData: IDB sweep failed:", (e as Error)?.message);
  }

  try {
    if ("caches" in window) {
      const names = await caches.keys();
      await Promise.allSettled(names.map((n) => caches.delete(n)));
    }
  } catch (e) {
    console.warn("[db] nukeAllLocalData: Cache API sweep failed:", (e as Error)?.message);
  }

  try {
    localStorage.clear();
  } catch {}
  try {
    sessionStorage.clear();
  } catch {}

  window.location.reload();
}

// ── Utilities ─────────────────────────────────────────────────────────

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
