//! me-ai-core: business logic and type-safe DuckDB queries (WASM).
//!
//! **Architecture: Rust owns SQL; JS is thin.**
//! - All SQL is built here with sea-query (SQLite backend for DuckDB compatibility).
//! - Rust passes each (sql, params) to the JS adapter via `query(sql, params)` or `exec(sql, params)`.
//! - The adapter is execution-only: it runs the SQL and returns rows/nothing. No SQL lives in app JS.
//!
//! Error handling: [thiserror](https://docs.rs/thiserror) + [anyhow](https://docs.rs/anyhow) internally;
//! errors are converted to JsValue at the WASM boundary.

mod app;
mod audit;
mod db;
mod error;
mod events;
mod items;
mod rules;
mod schema;
mod sync;

use serde_wasm_bindgen::to_value;
use wasm_bindgen::prelude::*;

use crate::error::{to_js as error_to_js, CoreError};

/// Initialize the core with the JS DB adapter.
/// The adapter must expose: query(sql: string, params: unknown[]) => Promise<unknown[]>, exec(sql: string, params: unknown[]) => Promise<void>.
#[wasm_bindgen(js_name = init)]
pub fn init(db: JsValue) -> Result<(), JsValue> {
    db::set_adapter(db);
    Ok(())
}

fn serialize_to_js<T: serde::Serialize>(value: &T) -> Result<JsValue, JsValue> {
    to_value(value).map_err(|e| error_to_js(&CoreError::Serialize(e.to_string())))
}

/// Map Result<T, CoreError> to Result<JsValue, JsValue> at the WASM boundary.
fn wasm_result<T: serde::Serialize>(r: Result<T, CoreError>) -> Result<JsValue, JsValue> {
    r.map_err(|e| error_to_js(&e)).and_then(|v| serialize_to_js(&v))
}

/// Fetch event types (name, label) from sm_event_types. Requires init(adapter) first.
#[wasm_bindgen(js_name = getEventTypes)]
pub async fn get_event_types() -> Result<JsValue, JsValue> {
    wasm_result(events::get_event_types().await)
}

/// Fetch event categories (name, label, priority) from sm_event_categories. Requires init(adapter) first.
#[wasm_bindgen(js_name = getEventCategories)]
pub async fn get_event_categories() -> Result<JsValue, JsValue> {
    wasm_result(events::get_event_categories().await)
}

/// Fetch sources from sm_sources. Requires init(adapter) first.
#[wasm_bindgen(js_name = getSources)]
pub async fn get_sources() -> Result<JsValue, JsValue> {
    wasm_result(rules::get_sources().await)
}

/// Fetch actions from sm_actions. Requires init(adapter) first.
#[wasm_bindgen(js_name = getActions)]
pub async fn get_actions() -> Result<JsValue, JsValue> {
    wasm_result(rules::get_actions().await)
}

/// Count of all items (for post-schema init). Requires init(adapter) first.
#[wasm_bindgen(js_name = getItemsCount)]
pub async fn get_items_count() -> Result<JsValue, JsValue> {
    wasm_result(items::get_items_count().await)
}

/// Count of items with sourceType = 'gmail'. Requires init(adapter) first.
#[wasm_bindgen(js_name = getItemsCountGmail)]
pub async fn get_items_count_gmail() -> Result<JsValue, JsValue> {
    wasm_result(items::get_items_count_gmail().await)
}

/// Count of contacts. Requires init(adapter) first.
#[wasm_bindgen(js_name = getContactsCount)]
pub async fn get_contacts_count() -> Result<JsValue, JsValue> {
    wasm_result(items::get_contacts_count().await)
}

/// Oldest date among gmail items (ms). Requires init(adapter) first.
#[wasm_bindgen(js_name = getItemsDateMin)]
pub async fn get_items_date_min() -> Result<JsValue, JsValue> {
    wasm_result(items::get_items_date_min().await)
}

/// Newest date among gmail items (ms). Requires init(adapter) first.
#[wasm_bindgen(js_name = getItemsDateMax)]
pub async fn get_items_date_max() -> Result<JsValue, JsValue> {
    wasm_result(items::get_items_date_max().await)
}

/// Count of email classifications. Requires init(adapter) first.
#[wasm_bindgen(js_name = getEmailClassificationsCount)]
pub async fn get_email_classifications_count() -> Result<JsValue, JsValue> {
    wasm_result(items::get_email_classifications_count().await)
}

/// Create all tables, seed data, and run migrations. Call after init(adapter).
#[wasm_bindgen(js_name = createSchemaAndMigrations)]
pub async fn create_schema_and_migrations() -> Result<(), JsValue> {
    app::create_schema_and_migrations().await.map_err(|e| error_to_js(&e))
}

/// Row count for a known table (for stats). Table must be in allowlist.
#[wasm_bindgen(js_name = getTableCount)]
pub async fn get_table_count(table: &str) -> Result<JsValue, JsValue> {
    wasm_result(app::get_table_count(table).await)
}

/// Clear all user-data tables (keeps schema and seed data).
#[wasm_bindgen(js_name = clearAllData)]
pub async fn clear_all_data() -> Result<(), JsValue> {
    app::clear_all_data().await.map_err(|e| error_to_js(&e))
}

/// Get a setting value by key. Returns null if not found.
#[wasm_bindgen(js_name = getSetting)]
pub async fn get_setting(key: &str) -> Result<JsValue, JsValue> {
    wasm_result(app::get_setting(key).await)
}

/// Set a setting (insert or replace). Value must be JSON string.
#[wasm_bindgen(js_name = setSetting)]
pub async fn set_setting(key: &str, value: &str) -> Result<(), JsValue> {
    app::set_setting(key, value).await.map_err(|e| error_to_js(&e))
}

/// Remove a setting by key.
#[wasm_bindgen(js_name = removeSetting)]
pub async fn remove_setting(key: &str) -> Result<(), JsValue> {
    app::remove_setting(key).await.map_err(|e| error_to_js(&e))
}

// ── Audit log (no SQL in JS) ─────────────────────────────────────────────

/// Log one pipeline execution to auditLog.
#[wasm_bindgen(js_name = logAuditExecution)]
pub async fn log_audit_execution(
    id: &str,
    email_id: &str,
    subject: &str,
    from: &str,
    event_type: &str,
    executed_at: f64,
    success: bool,
    error: &str,
    steps_json: &str,
) -> Result<(), JsValue> {
    audit::log_execution(
        id,
        email_id,
        subject,
        from,
        event_type,
        executed_at as i64,
        success,
        error,
        steps_json,
    )
    .await
    .map_err(|e| error_to_js(&e))
}

/// Mark email executed; delete_item = true to remove from items (destructive/archive).
#[wasm_bindgen(js_name = syncAfterAuditExecution)]
pub async fn sync_after_audit_execution(email_id: &str, delete_item: bool) -> Result<(), JsValue> {
    audit::sync_after_execution(email_id, delete_item)
        .await
        .map_err(|e| error_to_js(&e))
}

/// Get audit log page. Returns { entries, total }.
#[wasm_bindgen(js_name = getAuditLog)]
pub async fn get_audit_log_wasm(
    limit: u32,
    offset: u32,
    failures_only: bool,
) -> Result<JsValue, JsValue> {
    wasm_result(audit::get_audit_log(limit as i64, offset as i64, failures_only).await)
}

/// Delete all audit log entries.
#[wasm_bindgen(js_name = clearAuditLog)]
pub async fn clear_audit_log_wasm() -> Result<(), JsValue> {
    audit::clear_audit_log().await.map_err(|e| error_to_js(&e))
}

// ── Sync / items / contacts (no SQL in JS) ─────────────────────────────

#[wasm_bindgen(js_name = deleteSyncState)]
pub async fn delete_sync_state_wasm(source_type: &str) -> Result<(), JsValue> {
    sync::delete_sync_state(source_type).await.map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = deleteItemsBySource)]
pub async fn delete_items_by_source_wasm(source_type: &str) -> Result<(), JsValue> {
    sync::delete_items_by_source(source_type).await.map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = clearItemsSyncContacts)]
pub async fn clear_items_sync_contacts_wasm() -> Result<(), JsValue> {
    sync::clear_items_sync_contacts().await.map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = getItemsCountBySource)]
pub async fn get_items_count_by_source_wasm(source_type: &str) -> Result<JsValue, JsValue> {
    wasm_result(sync::get_items_count_by_source(source_type).await)
}

#[wasm_bindgen(js_name = getSyncState)]
pub async fn get_sync_state_wasm(source_type: &str) -> Result<JsValue, JsValue> {
    let opt = sync::get_sync_state(source_type).await.map_err(|e| error_to_js(&e))?;
    match opt {
        Some(row) => serialize_to_js(&row),
        None => Ok(JsValue::NULL),
    }
}

#[wasm_bindgen(js_name = upsertSyncState)]
pub async fn upsert_sync_state_wasm(
    source_type: &str,
    history_id: &str,
    last_sync_at: f64,
    total_items: i32,
    oldest_page_token: &str,
) -> Result<(), JsValue> {
    sync::upsert_sync_state(
        source_type,
        history_id,
        last_sync_at as i64,
        total_items as i64,
        oldest_page_token,
    )
    .await
    .map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = insertItemsBatch)]
pub async fn insert_items_batch_wasm(rows: JsValue) -> Result<(), JsValue> {
    sync::insert_items_batch(rows).await.map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = insertSyncStateBatch)]
pub async fn insert_sync_state_batch_wasm(rows: JsValue) -> Result<(), JsValue> {
    sync::insert_sync_state_batch(rows).await.map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = insertContactsBatch)]
pub async fn insert_contacts_batch_wasm(rows: JsValue) -> Result<(), JsValue> {
    sync::insert_contacts_batch(rows).await.map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = deleteItemsByIds)]
pub async fn delete_items_by_ids_wasm(ids: JsValue) -> Result<(), JsValue> {
    sync::delete_items_by_ids(ids).await.map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = getContactByEmail)]
pub async fn get_contact_by_email_wasm(email: &str) -> Result<JsValue, JsValue> {
    let opt = sync::get_contact_by_email(email).await.map_err(|e| error_to_js(&e))?;
    match opt {
        Some(row) => serialize_to_js(&row),
        None => Ok(JsValue::NULL),
    }
}

#[wasm_bindgen(js_name = upsertContact)]
pub async fn upsert_contact_wasm(
    email: &str,
    name: &str,
    first_seen: f64,
    last_seen: f64,
) -> Result<(), JsValue> {
    sync::upsert_contact(email, name, first_seen as i64, last_seen as i64)
        .await
        .map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = getNewestSourceId)]
pub async fn get_newest_source_id_wasm(source_type: &str) -> Result<JsValue, JsValue> {
    let opt = sync::get_newest_source_id(source_type).await.map_err(|e| error_to_js(&e))?;
    match opt {
        Some(s) => Ok(JsValue::from_str(&s)),
        None => Ok(JsValue::NULL),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn placeholder() {
        assert!(true);
    }
}
