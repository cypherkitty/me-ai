//! me-ai-core: business logic and IndexedDB persistence via Rexie (WASM).
//!
//! **Architecture: Rust owns all DB access; no JS adapter.**
//! - Persistence is IndexedDB via the Rexie crate. No SQL; stores and indexes only.
//! - TS calls core WASM methods only; no query/exec from the app layer.
//!
//! Error handling: [thiserror](https://docs.rs/thiserror) + [anyhow](https://docs.rs/anyhow) internally;
//! errors are converted to JsValue at the WASM boundary.

mod app;
mod audit;
mod classifications;
mod db;
mod error;
mod events;
mod items;
mod pipelines;
mod rexie_schema;
mod rules;
mod rules_data;
mod schema;
mod sync;

use serde_wasm_bindgen::to_value;
use wasm_bindgen::prelude::*;

use crate::error::{to_js as error_to_js, CoreError};

/// Initialize the core. No adapter; Rexie opens IndexedDB on first use.
#[wasm_bindgen(js_name = init)]
pub fn init() -> Result<(), JsValue> {
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

/// Fetch event categories (name, label, priority, policy) from sm_event_categories. Requires init(adapter) first.
#[wasm_bindgen(js_name = getEventCategories)]
pub async fn get_event_categories() -> Result<JsValue, JsValue> {
    wasm_result(events::get_event_categories().await)
}

/// Insert event type if not present (for LLM-seeded types).
#[wasm_bindgen(js_name = upsertEventType)]
pub async fn upsert_event_type_wasm(
    name: &str,
    label: &str,
    category_name: &str,
    auto_created: bool,
) -> Result<(), JsValue> {
    events::upsert_event_type(name, label, category_name, auto_created)
        .await
        .map_err(|e| error_to_js(&e))
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

/// Audit stats: (completed count, failed count).
#[wasm_bindgen(js_name = getAuditStats)]
pub async fn get_audit_stats_wasm() -> Result<JsValue, JsValue> {
    let (completed, failed) = audit::get_audit_stats().await.map_err(|e| error_to_js(&e))?;
    #[derive(serde::Serialize)]
    struct Out {
        completed: u32,
        failed: u32,
    }
    wasm_result(Ok(Out { completed, failed }))
}

// ── Pipelines / config ────────────────────────────────────────────────

#[wasm_bindgen(js_name = getCategoryPipelineActions)]
pub async fn get_category_pipeline_actions_wasm(category_name: &str) -> Result<JsValue, JsValue> {
    wasm_result(pipelines::get_category_pipeline_actions(category_name).await)
}

#[wasm_bindgen(js_name = getTypePipelineActions)]
pub async fn get_type_pipeline_actions_wasm(type_name: &str) -> Result<JsValue, JsValue> {
    wasm_result(pipelines::get_type_pipeline_actions(type_name).await)
}

#[wasm_bindgen(js_name = getEventTypeCategory)]
pub async fn get_event_type_category_wasm(type_name: &str) -> Result<JsValue, JsValue> {
    let opt = pipelines::get_event_type_category(type_name)
        .await
        .map_err(|e| error_to_js(&e))?;
    match opt {
        Some(s) => Ok(JsValue::from_str(&s)),
        None => Ok(JsValue::NULL),
    }
}

#[wasm_bindgen(js_name = getEventCategoryPolicy)]
pub async fn get_event_category_policy_wasm(category_name: &str) -> Result<JsValue, JsValue> {
    let opt = pipelines::get_event_category_policy(category_name)
        .await
        .map_err(|e| error_to_js(&e))?;
    match opt {
        Some(s) => Ok(JsValue::from_str(&s)),
        None => Ok(JsValue::NULL),
    }
}

#[wasm_bindgen(js_name = updateCategoryPipeline)]
pub async fn update_category_pipeline_wasm(
    category_name: &str,
    actions_js: JsValue,
) -> Result<(), JsValue> {
    let arr: Vec<serde_json::Value> = serde_wasm_bindgen::from_value(actions_js)
        .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?;
    let actions: Vec<(String, String)> = arr
        .iter()
        .map(|a| {
            let p = a.get("pluginId").and_then(|v| v.as_str()).unwrap_or("");
            let c = a.get("commandId").and_then(|v| v.as_str()).unwrap_or("");
            (p.to_string(), c.to_string())
        })
        .collect();
    pipelines::update_category_pipeline(category_name, &actions)
        .await
        .map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = updateCategoryPolicy)]
pub async fn update_category_policy_wasm(
    category_name: &str,
    policy: &str,
) -> Result<(), JsValue> {
    pipelines::update_category_policy(category_name, policy)
        .await
        .map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = updateEventTypeCategory)]
pub async fn update_event_type_category_wasm(
    type_name: &str,
    category_name: &str,
) -> Result<(), JsValue> {
    pipelines::update_event_type_category(type_name, category_name)
        .await
        .map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = clearEventTypeCategory)]
pub async fn clear_event_type_category_wasm(type_name: &str) -> Result<(), JsValue> {
    pipelines::clear_event_type_category(type_name)
        .await
        .map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = deleteEventType)]
pub async fn delete_event_type_wasm(type_name: &str) -> Result<(), JsValue> {
    pipelines::delete_event_type(type_name)
        .await
        .map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = setSourceEnabled)]
pub async fn set_source_enabled_wasm(name: &str, enabled: bool) -> Result<(), JsValue> {
    pipelines::set_source_enabled(name, enabled)
        .await
        .map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = setPluginEnabled)]
pub async fn set_plugin_enabled_wasm(name: &str, enabled: bool) -> Result<(), JsValue> {
    pipelines::set_plugin_enabled(name, enabled)
        .await
        .map_err(|e| error_to_js(&e))
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

#[wasm_bindgen(js_name = clearContacts)]
pub async fn clear_contacts_wasm() -> Result<(), JsValue> {
    sync::clear_contacts().await.map_err(|e| error_to_js(&e))
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

#[wasm_bindgen(js_name = getPlugins)]
pub async fn get_plugins_wasm() -> Result<JsValue, JsValue> {
    wasm_result(rules::get_plugins().await)
}

#[wasm_bindgen(js_name = getRules)]
pub async fn get_rules_wasm() -> Result<JsValue, JsValue> {
    wasm_result(rules_data::get_rules().await)
}

#[wasm_bindgen(js_name = getRule)]
pub async fn get_rule_wasm(id: &str) -> Result<JsValue, JsValue> {
    let opt = rules_data::get_rule(id).await.map_err(|e| error_to_js(&e))?;
    match opt {
        Some(v) => serde_wasm_bindgen::to_value(&v).map_err(|e| error_to_js(&CoreError::Serialize(e.to_string()))),
        None => Ok(JsValue::NULL),
    }
}

#[wasm_bindgen(js_name = saveRule)]
pub async fn save_rule_wasm(payload: JsValue) -> Result<(), JsValue> {
    let v: serde_json::Value = serde_wasm_bindgen::from_value(payload)
        .map_err(|e| error_to_js(&CoreError::Deserialize(e.to_string())))?;
    rules_data::save_rule(v).await.map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = deleteRule)]
pub async fn delete_rule_wasm(id: &str) -> Result<(), JsValue> {
    rules_data::delete_rule(id).await.map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = getEvents)]
pub async fn get_events_wasm(limit: u32, offset: u32) -> Result<JsValue, JsValue> {
    wasm_result(rules_data::get_events(limit, offset).await)
}

#[wasm_bindgen(js_name = updateEventStatus)]
pub async fn update_event_status_wasm(id: &str, status: &str) -> Result<(), JsValue> {
    rules_data::update_event_status(id, status)
        .await
        .map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = clearEvents)]
pub async fn clear_events_wasm() -> Result<(), JsValue> {
    rules_data::clear_events().await.map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = insertEvent)]
pub async fn insert_event_wasm(
    id: &str,
    content: Option<String>,
    subject: Option<String>,
    sender: Option<String>,
    timestamp: f64,
    status: Option<String>,
    event_type: Option<String>,
    event_category: Option<String>,
    source_name: Option<String>,
    rule_id: Option<String>,
    actions_taken: Option<String>,
    output: Option<String>,
) -> Result<(), JsValue> {
    rules_data::insert_event(
        id,
        content.as_deref(),
        subject.as_deref(),
        sender.as_deref(),
        timestamp as i64,
        status.as_deref(),
        event_type.as_deref(),
        event_category.as_deref(),
        source_name.as_deref(),
        rule_id.as_deref(),
        actions_taken.as_deref(),
        output.as_deref(),
    )
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

// ── Items (single get) ─────────────────────────────────────────────────────

#[wasm_bindgen(js_name = getItemById)]
pub async fn get_item_by_id_wasm(id: &str) -> Result<JsValue, JsValue> {
    let opt = sync::get_item_by_id(id).await.map_err(|e| error_to_js(&e))?;
    match opt {
        Some(row) => serialize_to_js(&row),
        None => Ok(JsValue::NULL),
    }
}

#[wasm_bindgen(js_name = getItemsGmailByDateDesc)]
pub async fn get_items_gmail_by_date_desc_wasm(limit: u32) -> Result<JsValue, JsValue> {
    wasm_result(sync::get_items_gmail_by_date_desc(limit).await)
}

#[wasm_bindgen(js_name = getItemsBySource)]
pub async fn get_items_by_source_wasm(
    source_type: &str,
    limit: u32,
    offset: u32,
) -> Result<JsValue, JsValue> {
    wasm_result(sync::get_items_by_source(source_type, limit, offset).await)
}

// ── Email classifications (for triage and views) ───────────────────────────

#[wasm_bindgen(js_name = getEmailClassifications)]
pub async fn get_email_classifications_wasm(
    action_filter: Option<String>,
    limit: Option<u32>,
) -> Result<JsValue, JsValue> {
    let filter = action_filter.as_deref();
    wasm_result(classifications::get_classifications(filter, limit).await)
}

#[wasm_bindgen(js_name = updateEmailClassificationStatus)]
pub async fn update_email_classification_status_wasm(
    email_id: &str,
    status: &str,
) -> Result<(), JsValue> {
    classifications::update_classification_status(email_id, status)
        .await
        .map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = clearEmailClassifications)]
pub async fn clear_email_classifications_wasm() -> Result<(), JsValue> {
    classifications::clear_classifications().await.map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = deleteEmailClassification)]
pub async fn delete_email_classification_wasm(email_id: &str) -> Result<(), JsValue> {
    classifications::delete_classification(email_id).await.map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = deleteEmailClassificationsByAction)]
pub async fn delete_email_classifications_by_action_wasm(action: &str) -> Result<(), JsValue> {
    classifications::delete_classifications_by_action(action)
        .await
        .map_err(|e| error_to_js(&e))
}

#[wasm_bindgen(js_name = putEmailClassification)]
pub async fn put_email_classification_wasm(
    email_id: &str,
    action: Option<String>,
    category: Option<String>,
    reason: Option<String>,
    summary: Option<String>,
    tags: Option<String>,
    subject: Option<String>,
    from: Option<String>,
    date: Option<f64>,
    scanned_at: Option<f64>,
    status: Option<String>,
) -> Result<(), JsValue> {
    classifications::put_classification(
        email_id,
        action.as_deref(),
        category.as_deref(),
        reason.as_deref(),
        summary.as_deref(),
        tags.as_deref(),
        subject.as_deref(),
        from.as_deref(),
        date.map(|f| f as i64),
        scanned_at.map(|f| f as i64),
        status.as_deref(),
    )
    .await
    .map_err(|e| error_to_js(&e))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn placeholder() {
        assert!(true);
    }
}
