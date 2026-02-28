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

/**
 * Immediate CHECKPOINT — use for critical writes (auth tokens, settings)
 * where we can't afford to lose data on a fast reload.
 */
export async function checkpoint() {
  if (!_usingOpfs || !_conn) return;
  if (_checkpointTimer) { clearTimeout(_checkpointTimer); _checkpointTimer = null; }
  try {
    await _conn.query("CHECKPOINT");
  } catch (e) {
    console.warn("[db] CHECKPOINT failed:", e?.message ?? e);
  }
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

  // Best-effort flush on page unload and visibility change.
  if (_usingOpfs && typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      _conn.query("CHECKPOINT").catch(() => {});
    });
    // visibilitychange fires reliably on mobile and when switching tabs,
    // giving us a chance to flush before the page is frozen/discarded.
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        _conn.query("CHECKPOINT").catch(() => {});
      }
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
    -- ── Static lookup tables ──────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS sm_event_types (
      name     VARCHAR PRIMARY KEY,
      label    VARCHAR
    );

    CREATE TABLE IF NOT EXISTS sm_event_categories (
      name     VARCHAR PRIMARY KEY,
      label    VARCHAR,
      priority INTEGER
    );

    CREATE TABLE IF NOT EXISTS sm_sources (
      name     VARCHAR PRIMARY KEY,
      label    VARCHAR,
      platform VARCHAR,
      api      VARCHAR,
      enabled  BOOLEAN DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS sm_execution_policies (
      name        VARCHAR PRIMARY KEY,
      label       VARCHAR,
      description VARCHAR
    );

    CREATE TABLE IF NOT EXISTS sm_actions (
      name  VARCHAR PRIMARY KEY,
      label VARCHAR
    );

    CREATE TABLE IF NOT EXISTS sm_plugins (
      name    VARCHAR PRIMARY KEY,
      label   VARCHAR,
      version VARCHAR,
      enabled BOOLEAN DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS sm_plugin_actions (
      plugin_name VARCHAR,
      action_name VARCHAR,
      PRIMARY KEY (plugin_name, action_name)
    );

    CREATE TABLE IF NOT EXISTS sm_plugin_sources (
      plugin_name VARCHAR,
      source_name VARCHAR,
      PRIMARY KEY (plugin_name, source_name)
    );

    -- ── Rules ─────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS sm_rules (
      id          VARCHAR PRIMARY KEY,
      name        VARCHAR,
      description VARCHAR,
      enabled     BOOLEAN DEFAULT true,
      priority    INTEGER DEFAULT 5,
      created_at  BIGINT
    );

    CREATE TABLE IF NOT EXISTS sm_rule_triggers (
      rule_id      VARCHAR,
      trigger_type VARCHAR,   -- 'event_type' | 'event_category'
      trigger_name VARCHAR
    );

    CREATE TABLE IF NOT EXISTS sm_rule_actions (
      rule_id     VARCHAR,
      action_name VARCHAR,
      order_idx   INTEGER
    );

    CREATE TABLE IF NOT EXISTS sm_rule_policies (
      rule_id     VARCHAR PRIMARY KEY,
      policy_name VARCHAR
    );

    -- ── Events (immutable, audit trail) ─────────────────────────────
    CREATE TABLE IF NOT EXISTS sm_events (
      id             VARCHAR PRIMARY KEY,
      content        VARCHAR,
      subject        VARCHAR,
      sender         VARCHAR,
      timestamp      BIGINT,
      status         VARCHAR,   -- completed | awaiting_user | failed | escalated
      event_type     VARCHAR,
      event_category VARCHAR,
      source_name    VARCHAR,
      rule_id        VARCHAR,   -- rule that processed this
      actions_taken  VARCHAR,   -- JSON array of action names
      output         VARCHAR    -- JSON blob (summarize output, etc.)
    );

    CREATE INDEX IF NOT EXISTS idx_sm_events_status    ON sm_events (status);
    CREATE INDEX IF NOT EXISTS idx_sm_events_type      ON sm_events (event_type);
    CREATE INDEX IF NOT EXISTS idx_sm_events_source    ON sm_events (source_name);
    CREATE INDEX IF NOT EXISTS idx_sm_events_timestamp ON sm_events (timestamp);
  `);

  await _seedSignalMap(conn);

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

// ── Seed data ─────────────────────────────────────────────────────────

async function _seedSignalMap(conn) {
  // Only seed if tables are empty (idempotent)
  const hasTypes = await conn.query(`SELECT COUNT(*) as n FROM sm_event_types`);
  const count = hasTypes.toArray()[0]?.n ?? hasTypes.toArray()[0]?.toJSON?.()?.n ?? 0;
  if (Number(count) > 0) return;

  await conn.query(`
    INSERT INTO sm_execution_policies VALUES
      ('auto',       'Automatic',  'Agent executes without human input'),
      ('supervised', 'Supervised', 'Executes then notifies user'),
      ('manual',     'Manual',     'Waits for explicit user approval');

    INSERT INTO sm_event_types VALUES
      ('ad',                   'Advertisement'),
      ('newsletter',           'Newsletter'),
      ('personal_message',     'Personal Message'),
      ('work_email',           'Work Email'),
      ('instagram_post',       'Instagram Post'),
      ('youtube_video',        'YouTube Video'),
      ('security_alert',       'Security Alert'),
      ('invoice',              'Invoice'),
      ('social_mention',       'Social Mention'),
      ('startup_notification', 'Startup Notification');

    INSERT INTO sm_event_categories VALUES
      ('noise',         'Noise',         1),
      ('informational', 'Informational', 2),
      ('important',     'Important',     3),
      ('urgent',        'Urgent',        4);

    INSERT INTO sm_sources VALUES
      ('gmail',     'Gmail',     'email',     'gmail_api_v1',          true),
      ('telegram',  'Telegram',  'messenger', 'telegram_bot_api',      false),
      ('instagram', 'Instagram', 'social',    'instagram_graph_api',   false),
      ('youtube',   'YouTube',   'video',     'youtube_data_api_v3',   false),
      ('slack',     'Slack',     'messenger', 'slack_web_api',         false),
      ('twitter',   'Twitter/X', 'social',    'twitter_api_v2',        false);

    INSERT INTO sm_actions VALUES
      ('delete',      'Delete'),
      ('archive',     'Archive'),
      ('mark_read',   'Mark as Read'),
      ('reply',       'Reply'),
      ('forward',     'Forward'),
      ('summarize',   'Summarize'),
      ('notify_user', 'Notify User'),
      ('tag',         'Tag'),
      ('escalate',    'Escalate'),
      ('unsubscribe', 'Unsubscribe');

    INSERT INTO sm_plugins VALUES
      ('gmail_plugin',     'Gmail',          '2.1.0', true),
      ('telegram_plugin',  'Telegram',       '3.0.1', false),
      ('instagram_plugin', 'Instagram',      '1.3.0', false),
      ('ai_summarizer',    'AI Summarizer',  '1.0.0', true),
      ('notifier',         'Notifier',       '1.1.0', true),
      ('ai_classifier',    'AI Classifier',  '2.0.0', true);

    INSERT INTO sm_plugin_actions VALUES
      ('gmail_plugin',    'delete'),
      ('gmail_plugin',    'archive'),
      ('gmail_plugin',    'reply'),
      ('gmail_plugin',    'mark_read'),
      ('gmail_plugin',    'forward'),
      ('gmail_plugin',    'unsubscribe'),
      ('telegram_plugin', 'reply'),
      ('telegram_plugin', 'forward'),
      ('telegram_plugin', 'notify_user'),
      ('instagram_plugin','reply'),
      ('instagram_plugin','tag'),
      ('ai_summarizer',   'summarize'),
      ('notifier',        'notify_user'),
      ('notifier',        'escalate');

    INSERT INTO sm_plugin_sources VALUES
      ('gmail_plugin',    'gmail'),
      ('telegram_plugin', 'telegram'),
      ('instagram_plugin','instagram');
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
