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
mod db;
mod error;
mod events;
mod items;
mod rules;
mod schema;

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

/// Fetch event types (name, label) from sm_event_types. Requires init(adapter) first.
#[wasm_bindgen(js_name = getEventTypes)]
pub async fn get_event_types() -> Result<JsValue, JsValue> {
    let rows = events::get_event_types().await.map_err(|e| error_to_js(&e))?;
    serialize_to_js(&rows)
}

/// Fetch event categories (name, label, priority) from sm_event_categories. Requires init(adapter) first.
#[wasm_bindgen(js_name = getEventCategories)]
pub async fn get_event_categories() -> Result<JsValue, JsValue> {
    let rows = events::get_event_categories().await.map_err(|e| error_to_js(&e))?;
    serialize_to_js(&rows)
}

/// Fetch sources from sm_sources. Requires init(adapter) first.
#[wasm_bindgen(js_name = getSources)]
pub async fn get_sources() -> Result<JsValue, JsValue> {
    let rows = rules::get_sources().await.map_err(|e| error_to_js(&e))?;
    serialize_to_js(&rows)
}

/// Fetch actions from sm_actions. Requires init(adapter) first.
#[wasm_bindgen(js_name = getActions)]
pub async fn get_actions() -> Result<JsValue, JsValue> {
    let rows = rules::get_actions().await.map_err(|e| error_to_js(&e))?;
    serialize_to_js(&rows)
}

/// Count of all items (for post-schema init). Requires init(adapter) first.
#[wasm_bindgen(js_name = getItemsCount)]
pub async fn get_items_count() -> Result<JsValue, JsValue> {
    let n = items::get_items_count().await.map_err(|e| error_to_js(&e))?;
    serialize_to_js(&n)
}

/// Count of items with sourceType = 'gmail'. Requires init(adapter) first.
#[wasm_bindgen(js_name = getItemsCountGmail)]
pub async fn get_items_count_gmail() -> Result<JsValue, JsValue> {
    let n = items::get_items_count_gmail().await.map_err(|e| error_to_js(&e))?;
    serialize_to_js(&n)
}

/// Count of contacts. Requires init(adapter) first.
#[wasm_bindgen(js_name = getContactsCount)]
pub async fn get_contacts_count() -> Result<JsValue, JsValue> {
    let n = items::get_contacts_count().await.map_err(|e| error_to_js(&e))?;
    serialize_to_js(&n)
}

/// Oldest date among gmail items (ms). Requires init(adapter) first.
#[wasm_bindgen(js_name = getItemsDateMin)]
pub async fn get_items_date_min() -> Result<JsValue, JsValue> {
    let d = items::get_items_date_min().await.map_err(|e| error_to_js(&e))?;
    serialize_to_js(&d)
}

/// Newest date among gmail items (ms). Requires init(adapter) first.
#[wasm_bindgen(js_name = getItemsDateMax)]
pub async fn get_items_date_max() -> Result<JsValue, JsValue> {
    let d = items::get_items_date_max().await.map_err(|e| error_to_js(&e))?;
    serialize_to_js(&d)
}

/// Count of email classifications. Requires init(adapter) first.
#[wasm_bindgen(js_name = getEmailClassificationsCount)]
pub async fn get_email_classifications_count() -> Result<JsValue, JsValue> {
    let n = items::get_email_classifications_count().await.map_err(|e| error_to_js(&e))?;
    serialize_to_js(&n)
}

/// Create all tables, seed data, and run migrations. Call after init(adapter).
#[wasm_bindgen(js_name = createSchemaAndMigrations)]
pub async fn create_schema_and_migrations() -> Result<(), JsValue> {
    app::create_schema_and_migrations().await.map_err(|e| error_to_js(&e))
}

/// Row count for a known table (for stats). Table must be in allowlist.
#[wasm_bindgen(js_name = getTableCount)]
pub async fn get_table_count(table: &str) -> Result<JsValue, JsValue> {
    let n = app::get_table_count(table).await.map_err(|e| error_to_js(&e))?;
    serialize_to_js(&n)
}

/// Clear all user-data tables (keeps schema and seed data).
#[wasm_bindgen(js_name = clearAllData)]
pub async fn clear_all_data() -> Result<(), JsValue> {
    app::clear_all_data().await.map_err(|e| error_to_js(&e))
}

/// Get a setting value by key. Returns null if not found.
#[wasm_bindgen(js_name = getSetting)]
pub async fn get_setting(key: &str) -> Result<JsValue, JsValue> {
    let v = app::get_setting(key).await.map_err(|e| error_to_js(&e))?;
    serialize_to_js(&v)
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

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn placeholder() {
        assert!(true);
    }
}
