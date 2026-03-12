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

  await _createSchema(_conn);

  if (_usingOpfs) {
    try {
      const res = await _conn.query(`SELECT COUNT(*) AS cnt FROM items`);
      const row = res.toArray()[0];
      const count = Number(row?.toJSON?.()?.cnt ?? 0);
      if (count === 0) {
        const { idbWipeAll } = await import("./idb.js");
        await idbWipeAll();
        console.info("[db] Fresh OPFS detected — wiped IDB cache to stay in sync");
      }
    } catch {
      /* ignore */
    }
  }

  await _rehydrateFromIdb(_conn);

  return _db;
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

// ── Schema ───────────────────────────────────────────────────────────

async function _createSchema(conn: DuckDBConnection): Promise<void> {
  await conn.query(`
    -- ── Static lookup tables ──────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS sm_event_types (
      name          VARCHAR PRIMARY KEY,
      label         VARCHAR,
      category_name VARCHAR DEFAULT 'critical',
      auto_created  BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS sm_event_categories (
      name     VARCHAR PRIMARY KEY,
      label    VARCHAR,
      priority INTEGER,
      policy   VARCHAR DEFAULT 'manual'
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

    -- ── Category-based pipelines (RBAC model) ────────────────────────
    CREATE TABLE IF NOT EXISTS sm_category_pipeline (
      category_name VARCHAR,
      action_idx    INTEGER,
      plugin_id     VARCHAR,
      command_id    VARCHAR,
      PRIMARY KEY (category_name, action_idx)
    );

    CREATE TABLE IF NOT EXISTS sm_type_pipeline (
      type_name  VARCHAR,
      action_idx INTEGER,
      plugin_id  VARCHAR,
      command_id VARCHAR,
      PRIMARY KEY (type_name, action_idx)
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
      trigger_type VARCHAR,
      trigger_name VARCHAR
    );

    CREATE TABLE IF NOT EXISTS sm_rule_commands (
      rule_id     VARCHAR,
      command_id  VARCHAR,
      plugin_id   VARCHAR,
      action_id   VARCHAR,
      name        VARCHAR,
      description VARCHAR,
      icon        VARCHAR,
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
      status         VARCHAR,
      event_type     VARCHAR,
      event_category VARCHAR,
      source_name    VARCHAR,
      rule_id        VARCHAR,
      actions_taken  VARCHAR,
      output         VARCHAR
    );

    CREATE INDEX IF NOT EXISTS idx_sm_events_status    ON sm_events (status);
    CREATE INDEX IF NOT EXISTS idx_sm_events_type      ON sm_events (event_type);
    CREATE INDEX IF NOT EXISTS idx_sm_events_source    ON sm_events (source_name);
    CREATE INDEX IF NOT EXISTS idx_sm_events_timestamp ON sm_events (timestamp);
  `);

  await _seedSignalMap(conn);
  await _migrateEventCategoriesTo3Tier(conn);

  await conn.query(`
    DELETE FROM sm_rule_commands WHERE plugin_id IS NULL AND action_id IS NULL
  `);

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
      labels      VARCHAR,
      messageId   VARCHAR,
      inReplyTo   VARCHAR,
      "references" VARCHAR,
      raw         VARCHAR,
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
      tags       VARCHAR,
      subject    VARCHAR,
      "from"     VARCHAR,
      date       BIGINT,
      scannedAt  BIGINT,
      status     VARCHAR
    );

    CREATE INDEX IF NOT EXISTS idx_ec_action        ON emailClassifications (action);
    CREATE INDEX IF NOT EXISTS idx_ec_group         ON emailClassifications ("group");
    CREATE INDEX IF NOT EXISTS idx_ec_status        ON emailClassifications (status);
    CREATE INDEX IF NOT EXISTS idx_ec_action_status ON emailClassifications (action, status);
    CREATE INDEX IF NOT EXISTS idx_ec_group_status  ON emailClassifications ("group", status);

    CREATE TABLE IF NOT EXISTS settings (
      key   VARCHAR PRIMARY KEY,
      value VARCHAR
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
      steps       VARCHAR
    );

    CREATE INDEX IF NOT EXISTS idx_audit_emailId    ON auditLog (emailId);
    CREATE INDEX IF NOT EXISTS idx_audit_executedAt ON auditLog (executedAt);
    CREATE INDEX IF NOT EXISTS idx_audit_success    ON auditLog (success);
  `);
}

async function _seedSignalMap(conn: DuckDBConnection): Promise<void> {
  const hasTypes = await conn.query(`SELECT COUNT(*) as n FROM sm_event_types`);
  const arr = hasTypes.toArray();
  const first = arr[0];
  const count = first?.toJSON?.()?.n ?? 0;
  if (Number(count) > 0) return;

  await conn.query(`
    INSERT INTO sm_execution_policies VALUES
      ('auto',       'Automatic',  'Agent executes without human input'),
      ('supervised', 'Supervised', 'Executes then notifies user'),
      ('manual',     'Manual',     'Waits for explicit user approval');

    INSERT INTO sm_event_types (name, label, category_name, auto_created) VALUES
      ('ad',                   'Advertisement',         'noise',    false),
      ('newsletter',           'Newsletter',            'noise',    false),
      ('personal_message',     'Personal Message',      'critical', false),
      ('work_email',           'Work Email',            'critical', false),
      ('instagram_post',       'Instagram Post',        'info',     false),
      ('youtube_video',        'YouTube Video',         'info',     false),
      ('security_alert',       'Security Alert',        'critical', false),
      ('invoice',              'Invoice',               'critical', false),
      ('social_mention',       'Social Mention',        'info',     false),
      ('startup_notification', 'Startup Notification',  'info',     false),
      ('tweet',                'Tweet',                 'info',     false),
      ('retweet',              'Retweet',               'noise',    false),
      ('twitter_mention',      'Twitter Mention',       'info',     false),
      ('twitter_thread',       'Twitter Thread',        'info',     false);

    INSERT INTO sm_event_categories VALUES
      ('noise',    'Noise',    1, 'auto'),
      ('info',     'Info',     2, 'supervised'),
      ('critical', 'Critical', 3, 'manual');

    INSERT INTO sm_sources VALUES
      ('gmail',     'Gmail',     'email',     'gmail_api_v1',          true),
      ('telegram',  'Telegram',  'messenger', 'telegram_bot_api',      false),
      ('instagram', 'Instagram', 'social',    'instagram_graph_api',   false),
      ('youtube',   'YouTube',   'video',     'youtube_data_api_v3',   false),
      ('slack',     'Slack',     'messenger', 'slack_web_api',         false),
      ('twitter',   'Twitter/X', 'social',    'twitter_api_v2',        true);

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
      ('twitter_plugin',   'Twitter/X',      '1.0.0', true),
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
      ('twitter_plugin',  'twitter'),
      ('telegram_plugin', 'telegram'),
      ('instagram_plugin','instagram');

    INSERT INTO sm_category_pipeline VALUES
      ('noise',    0, 'gmail', 'trash'),
      ('info',     0, 'gmail', 'mark_read'),
      ('info',     1, 'gmail', 'archive');
  `);
}

async function _migrateEventCategoriesTo3Tier(conn: DuckDBConnection): Promise<void> {
  try {
    const hasOld = await conn.query(`
      SELECT 1 FROM sm_event_categories WHERE name = 'informational' LIMIT 1
    `);
    if (!hasOld.toArray?.()?.length) return;

    await conn.query(`
      UPDATE sm_event_types SET category_name = 'info' WHERE category_name = 'informational';
      UPDATE sm_event_types SET category_name = 'critical' WHERE category_name IN ('important', 'urgent');
    `);
    await conn.query(`
      UPDATE emailClassifications SET "group" = 'INFO' WHERE UPPER(TRIM("group")) = 'INFORMATIONAL';
      UPDATE emailClassifications SET "group" = 'CRITICAL' WHERE UPPER(TRIM("group")) IN ('IMPORTANT', 'URGENT');
    `);
    await conn.query(`
      DELETE FROM sm_category_pipeline WHERE category_name = 'informational';
      INSERT INTO sm_category_pipeline VALUES ('info', 0, 'gmail', 'mark_read'), ('info', 1, 'gmail', 'archive');
    `);
    await conn.query(`
      DELETE FROM sm_event_categories WHERE name IN ('informational', 'important', 'urgent');
      INSERT INTO sm_event_categories VALUES ('info', 'Info', 2, 'supervised'), ('critical', 'Critical', 3, 'manual');
    `);
  } catch (e) {
    console.warn(
      "[db] 4-tier→3-tier migration skipped or failed:",
      (e as Error)?.message ?? e
    );
  }
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

export interface OpfsStats {
  supported: boolean;
  fileBytes: number;
  tables: Record<string, number>;
}

export async function getOpfsStats(): Promise<OpfsStats> {
  const supported =
    typeof navigator !== "undefined" &&
    typeof navigator.storage?.getDirectory === "function";

  let fileBytes = 0;
  if (supported) {
    try {
      const root = await navigator.storage.getDirectory();
      const fh = await root.getFileHandle("me-ai.db", { create: false });
      const file = await fh.getFile();
      fileBytes = file.size;
    } catch {
      /* file may not exist yet */
    }
  }

  await getDb();
  const tables: Record<string, number> = {};
  for (const tbl of [
    "sm_rules",
    "sm_rule_triggers",
    "sm_rule_commands",
    "sm_events",
    "items",
    "emailClassifications",
    "contacts",
    "settings",
  ]) {
    try {
      const rows = await query(`SELECT COUNT(*) AS n FROM ${tbl}`);
      tables[tbl] = Number(rows[0]?.n ?? 0);
    } catch {
      tables[tbl] = 0;
    }
  }

  return { supported, fileBytes, tables };
}

/**
 * Clear all user-data tables in DuckDB (keeps lookup/seed tables).
 */
export async function clearAllDuckDbData(): Promise<void> {
  const conn = await _getConn();
  const deletes = [
    "DELETE FROM sm_events",
    "DELETE FROM sm_rule_commands",
    "DELETE FROM sm_rule_triggers",
    "DELETE FROM sm_rule_policies",
    "DELETE FROM sm_rules",
    "DELETE FROM items",
    "DELETE FROM emailClassifications",
    "DELETE FROM contacts",
    "DELETE FROM syncState",
    "DELETE FROM settings",
    "DELETE FROM auditLog",
  ];
  if (_usingOpfs) {
    for (const sql of deletes) await conn.query(sql);
  } else {
    await conn.query("BEGIN");
    try {
      for (const sql of deletes) await conn.query(sql);
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
