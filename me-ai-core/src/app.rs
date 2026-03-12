//! All application SQL lives here. Schema, migrations, and every query/exec
//! used by the web app. JS only runs what the core asks via the adapter.

use serde::{Deserialize, Serialize};

use crate::db::{empty_params, run_exec_raw, run_query_raw, str_param, Param, ParamValue};
use crate::error::CoreError;

// ── Schema (DDL) ───────────────────────────────────────────────────────

const SCHEMA_SIGNAL_MAP: &str = r#"
-- Static lookup tables
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
"#;

const SCHEMA_ITEMS: &str = r#"
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
  category   VARCHAR,
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
CREATE INDEX IF NOT EXISTS idx_ec_category      ON emailClassifications (category);
CREATE INDEX IF NOT EXISTS idx_ec_status        ON emailClassifications (status);
CREATE INDEX IF NOT EXISTS idx_ec_action_status ON emailClassifications (action, status);
CREATE INDEX IF NOT EXISTS idx_ec_category_status ON emailClassifications (category, status);

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
"#;

/// Run all schema DDL and migrations. Call after init(adapter).
pub async fn create_schema_and_migrations() -> Result<(), CoreError> {
    let empty = empty_params();
    run_exec_raw(SCHEMA_SIGNAL_MAP, empty.clone()).await?;
    run_exec_raw(SCHEMA_ITEMS, empty.clone()).await?;
    seed_signal_map().await?;
    migrate_event_categories_3tier().await?;
    migrate_remove_supervised().await?;
    migrate_email_classifications_category().await?;
    run_exec_raw(
        "DELETE FROM sm_rule_commands WHERE plugin_id IS NULL AND action_id IS NULL",
        empty,
    )
    .await?;
    Ok(())
}

async fn seed_signal_map() -> Result<(), CoreError> {
    #[derive(Deserialize)]
    struct CountRow {
        n: Option<i64>,
    }
    let rows = run_query_raw::<CountRow>("SELECT COUNT(*) as n FROM sm_event_types", vec![]).await?;
    let n = rows.first().and_then(|r| r.n).unwrap_or(0);
    if n > 0 {
        return Ok(());
    }

    let seed = r#"
INSERT INTO sm_execution_policies VALUES
  ('auto',   'Automatic', 'Agent executes without human input'),
  ('manual', 'Manual',    'Waits for explicit user approval');

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
  ('twitter_mention',      'Twitter Mention',      'info',     false),
  ('twitter_thread',       'Twitter Thread',        'info',     false);

INSERT INTO sm_event_categories VALUES
  ('noise',    'Noise',    1, 'auto'),
  ('info',     'Info',     2, 'auto'),
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
"#;
    run_exec_raw(seed, vec![]).await?;
    Ok(())
}

async fn migrate_event_categories_3tier() -> Result<(), CoreError> {
    #[derive(Deserialize)]
    struct Dummy {}
    let rows = run_query_raw::<Dummy>(
        "SELECT 1 FROM sm_event_categories WHERE name = 'informational' LIMIT 1",
        vec![],
    )
    .await?;
    if rows.is_empty() {
        return Ok(());
    }
    let empty = empty_params();
    run_exec_raw("UPDATE sm_event_types SET category_name = 'info' WHERE category_name = 'informational'", empty.clone()).await?;
    run_exec_raw("UPDATE sm_event_types SET category_name = 'critical' WHERE category_name IN ('important', 'urgent')", empty.clone()).await?;
    run_exec_raw("UPDATE emailClassifications SET category = 'info' WHERE UPPER(TRIM(category)) = 'INFORMATIONAL'", empty.clone()).await?;
    run_exec_raw("UPDATE emailClassifications SET category = 'critical' WHERE UPPER(TRIM(category)) IN ('IMPORTANT', 'URGENT')", empty.clone()).await?;
    run_exec_raw("DELETE FROM sm_category_pipeline WHERE category_name = 'informational'", empty.clone()).await?;
    run_exec_raw("INSERT INTO sm_category_pipeline VALUES ('info', 0, 'gmail', 'mark_read'), ('info', 1, 'gmail', 'archive')", empty.clone()).await?;
    run_exec_raw("DELETE FROM sm_event_categories WHERE name IN ('informational', 'important', 'urgent')", empty.clone()).await?;
    run_exec_raw("INSERT INTO sm_event_categories VALUES ('info', 'Info', 2, 'auto'), ('critical', 'Critical', 3, 'manual')", empty.clone()).await?;
    Ok(())
}

async fn migrate_remove_supervised() -> Result<(), CoreError> {
    let empty = empty_params();
    let _ = run_exec_raw("UPDATE sm_event_categories SET policy = 'auto' WHERE policy = 'supervised'", empty.clone()).await;
    let _ = run_exec_raw("UPDATE sm_rule_policies SET policy_name = 'auto' WHERE policy_name = 'supervised'", empty.clone()).await;
    let _ = run_exec_raw("DELETE FROM sm_execution_policies WHERE name = 'supervised'", empty).await;
    Ok(())
}

async fn migrate_email_classifications_category() -> Result<(), CoreError> {
    // ADD COLUMN only for existing DBs that had "group" and no category; ignore if column exists.
    let _ = run_exec_raw("ALTER TABLE emailClassifications ADD COLUMN category VARCHAR", vec![]).await.ok();
    // Backfill category from legacy "group" column only if that column exists (old DBs); ignore if no "group".
    let _ = run_exec_raw(
        r#"UPDATE emailClassifications SET category = "group" WHERE category IS NULL AND "group" IS NOT NULL"#,
        vec![],
    )
    .await
    .ok();
    Ok(())
}

// ── Table count (for getOpfsStats) ─────────────────────────────────────

const ALLOWED_TABLES: &[&str] = &[
    "sm_rules", "sm_rule_triggers", "sm_rule_commands", "sm_events",
    "items", "emailClassifications", "contacts", "settings",
];

#[derive(Serialize, Deserialize)]
pub struct TableCountRow {
    pub n: Option<i64>,
}

pub async fn get_table_count(table: &str) -> Result<i64, CoreError> {
    if !ALLOWED_TABLES.contains(&table) {
        return Ok(0);
    }
    let sql = format!("SELECT COUNT(*) AS n FROM {}", table);
    let rows = run_query_raw::<TableCountRow>(&sql, vec![]).await?;
    Ok(rows.first().and_then(|r| r.n).unwrap_or(0))
}

// ── Clear all data ─────────────────────────────────────────────────────

pub async fn clear_all_data() -> Result<(), CoreError> {
    let stmts = [
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
    let empty = empty_params();
    for sql in stmts {
        let _ = run_exec_raw(sql, empty.clone()).await;
    }
    Ok(())
}

// ── Settings ───────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize)]
pub struct SettingRow {
    pub value: Option<String>,
}

pub async fn get_setting(key: &str) -> Result<Option<String>, CoreError> {
    let params = vec![str_param(key)];
    let rows = run_query_raw::<SettingRow>("SELECT value FROM settings WHERE key = ?", params).await?;
    Ok(rows.into_iter().next().and_then(|r| r.value))
}

pub async fn set_setting(key: &str, value: &str) -> Result<(), CoreError> {
    let params = vec![str_param(key), str_param(value)];
    run_exec_raw(
        "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value",
        params,
    )
    .await
}

pub async fn remove_setting(key: &str) -> Result<(), CoreError> {
    run_exec_raw("DELETE FROM settings WHERE key = ?", vec![str_param(key)]).await
}
