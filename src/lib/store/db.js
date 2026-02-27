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

import duckdb_mvp_wasm  from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import duckdb_eh_wasm   from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import mvp_worker_url   from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import eh_worker_url    from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";
import * as duckdb      from "@duckdb/duckdb-wasm";

// ── Singleton ────────────────────────────────────────────────────────

/** @type {duckdb.AsyncDuckDB | null} */
let _db   = null;
/** @type {duckdb.AsyncDuckDBConnection | null} */
let _conn = null;
/** @type {Promise<duckdb.AsyncDuckDB> | null} */
let _initPromise = null;
/** @type {boolean} Whether the current open path is OPFS (not :memory:) */
let _usingOpfs = false;
/** @type {ReturnType<typeof setTimeout> | null} */
let _checkpointTimer = null;

/**
 * Debounced CHECKPOINT — flushes the DuckDB WAL to the OPFS file.
 * DuckDB WASM does NOT auto-flush on page unload, so without this every
 * write is lost when the tab is closed or reloaded.
 *
 * We debounce (50 ms) to batch rapid writes (e.g. bulk email sync) into
 * a single checkpoint rather than one per row.
 */
function _scheduleCheckpoint() {
  if (!_usingOpfs || !_conn) return;
  if (_checkpointTimer) clearTimeout(_checkpointTimer);
  _checkpointTimer = setTimeout(async () => {
    try {
      await _conn.query("CHECKPOINT");
    } catch (e) {
      console.warn("[db] CHECKPOINT failed:", e?.message ?? e);
    }
    _checkpointTimer = null;
  }, 50);
}

// ── Init ─────────────────────────────────────────────────────────────

async function _init() {
  const BUNDLES = {
    mvp: { mainModule: duckdb_mvp_wasm, mainWorker: mvp_worker_url },
    eh:  { mainModule: duckdb_eh_wasm,  mainWorker: eh_worker_url  },
  };

  const bundle = await duckdb.selectBundle(BUNDLES);
  const worker = new Worker(bundle.mainWorker);
  const logger = new duckdb.VoidLogger();

  _db = new duckdb.AsyncDuckDB(logger, worker);
  await _db.instantiate(bundle.mainModule, bundle.pthreadWorker);

  // Try OPFS persistence; fall back to in-memory.
  const opfsSupported = typeof navigator !== "undefined" &&
    typeof navigator.storage?.getDirectory === "function";

  if (opfsSupported) {
    try {
      await _db.open({ path: "opfs://me-ai.db", accessMode: duckdb.DuckDBAccessMode.READ_WRITE });
      _usingOpfs = true;
      console.info("[db] Using OPFS persistence (opfs://me-ai.db)");
    } catch (e) {
      console.warn("[db] OPFS open failed, falling back to in-memory:", e?.message ?? e);
      await _db.open({ path: ":memory:" });
    }
  } else {
    await _db.open({ path: ":memory:" });
    console.info("[db] OPFS not available, using in-memory database");
  }

  _conn = await _db.connect();

  // Best-effort flush on page unload.
  if (_usingOpfs && typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      _conn.query("CHECKPOINT").catch(() => {});
    });
  }

  await _createSchema(_conn);

  return _db;
}

/**
 * Returns the initialised DuckDB instance (lazy singleton).
 * @returns {Promise<duckdb.AsyncDuckDB>}
 */
export function getDb() {
  if (!_initPromise) _initPromise = _init();
  return _initPromise;
}

// ── Schema ───────────────────────────────────────────────────────────

async function _createSchema(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS items (
      id          VARCHAR PRIMARY KEY,
      sourceType  VARCHAR NOT NULL,
      sourceId    VARCHAR,
      threadKey   VARCHAR,
      type        VARCHAR,
      "from"      VARCHAR,
      "to"        VARCHAR,
      cc          VARCHAR,
      subject     VARCHAR,
      snippet     VARCHAR,
      body        VARCHAR,
      htmlBody    VARCHAR,
      date        BIGINT,
      labels      VARCHAR,   -- JSON array stored as text
      messageId   VARCHAR,
      inReplyTo   VARCHAR,
      "references" VARCHAR,
      raw         VARCHAR,   -- JSON blob
      syncedAt    BIGINT
    );

    CREATE INDEX IF NOT EXISTS idx_items_sourceType ON items (sourceType);
    CREATE INDEX IF NOT EXISTS idx_items_date       ON items (date);
    CREATE INDEX IF NOT EXISTS idx_items_threadKey  ON items (threadKey);
    CREATE INDEX IF NOT EXISTS idx_items_src_date   ON items (sourceType, date);

    CREATE TABLE IF NOT EXISTS contacts (
      email     VARCHAR PRIMARY KEY,
      name      VARCHAR,
      firstSeen BIGINT,
      lastSeen  BIGINT
    );

    CREATE INDEX IF NOT EXISTS idx_contacts_lastSeen ON contacts (lastSeen);

    CREATE TABLE IF NOT EXISTS syncState (
      sourceType      VARCHAR PRIMARY KEY,
      historyId       VARCHAR,
      lastSyncAt      BIGINT,
      totalItems      INTEGER,
      oldestPageToken VARCHAR
    );

    CREATE TABLE IF NOT EXISTS emailClassifications (
      emailId    VARCHAR PRIMARY KEY,
      action     VARCHAR,
      "group"    VARCHAR,
      reason     VARCHAR,
      summary    VARCHAR,
      tags       VARCHAR,   -- JSON array
      subject    VARCHAR,
      "from"     VARCHAR,
      date       BIGINT,
      scannedAt  BIGINT,
      status     VARCHAR    -- 'pending' | 'executed'
    );

    CREATE INDEX IF NOT EXISTS idx_ec_action        ON emailClassifications (action);
    CREATE INDEX IF NOT EXISTS idx_ec_group         ON emailClassifications ("group");
    CREATE INDEX IF NOT EXISTS idx_ec_status        ON emailClassifications (status);
    CREATE INDEX IF NOT EXISTS idx_ec_action_status ON emailClassifications (action, status);
    CREATE INDEX IF NOT EXISTS idx_ec_group_status  ON emailClassifications ("group", status);

    CREATE TABLE IF NOT EXISTS settings (
      key   VARCHAR PRIMARY KEY,
      value VARCHAR   -- JSON-encoded value
    );

    CREATE TABLE IF NOT EXISTS auditLog (
      id          VARCHAR PRIMARY KEY,
      emailId     VARCHAR,
      subject     VARCHAR,
      "from"      VARCHAR,
      eventType   VARCHAR,
      executedAt  BIGINT,
      success     BOOLEAN,
      error       VARCHAR,
      steps       VARCHAR   -- JSON array
    );

    CREATE INDEX IF NOT EXISTS idx_audit_emailId    ON auditLog (emailId);
    CREATE INDEX IF NOT EXISTS idx_audit_executedAt ON auditLog (executedAt);
    CREATE INDEX IF NOT EXISTS idx_audit_success    ON auditLog (success);
  `);
}

// ── Query helpers ─────────────────────────────────────────────────────

/**
 * Ensure the connection is ready and return it.
 * @returns {Promise<duckdb.AsyncDuckDBConnection>}
 */
async function _getConn() {
  await getDb();
  return _conn;
}

/**
 * Run a SQL query and return rows as plain JS objects.
 * Supports positional parameters via Apache Arrow / DuckDB prepared statements.
 *
 * @param {string}  sql
 * @param {any[]}   [params]
 * @returns {Promise<object[]>}
 */
export async function query(sql, params = []) {
  const conn = await _getConn();
  let result;
  if (params.length > 0) {
    const stmt = await conn.prepare(sql);
    result = await stmt.query(...params);
    await stmt.close();
  } else {
    result = await conn.query(sql);
  }
  return result.toArray().map(row => row.toJSON ? row.toJSON() : row);
}

/**
 * Execute a SQL statement (INSERT / UPDATE / DELETE / DDL).
 * Returns nothing — use query() if you need results.
 * Schedules a debounced CHECKPOINT to flush the WAL to OPFS.
 *
 * @param {string}  sql
 * @param {any[]}   [params]
 */
export async function exec(sql, params = []) {
  const conn = await _getConn();
  if (params.length > 0) {
    const stmt = await conn.prepare(sql);
    await stmt.query(...params);
    await stmt.close();
  } else {
    await conn.query(sql);
  }
  // Flush WAL to OPFS after every write so data survives page reloads.
  _scheduleCheckpoint();
}

// ── Utilities ─────────────────────────────────────────────────────────

/**
 * Generate a universal item ID from source type and source-specific ID.
 * @param {string} sourceType - e.g. "gmail"
 * @param {string} sourceId   - source-specific ID
 * @returns {string} e.g. "gmail:18e12345abcd"
 */
export function makeItemId(sourceType, sourceId) {
  return `${sourceType}:${sourceId}`;
}

/** Encode a JS value for storage in a VARCHAR JSON column. */
export function toJson(value) {
  return JSON.stringify(value ?? null);
}

/** Decode a VARCHAR JSON column back to a JS value. */
export function fromJson(text, fallback = null) {
  if (text == null) return fallback;
  try { return JSON.parse(text); } catch { return fallback; }
}
