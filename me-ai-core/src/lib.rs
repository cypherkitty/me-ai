//! me-ai-core: business logic and type-safe DuckDB queries (WASM).
//!
//! All SQL is built with sea-query (SQLite backend for DuckDB compatibility)
//! and executed via the JS adapter (query/exec). OPFS persistence stays in JS.

mod db;
mod events;

use serde_wasm_bindgen::to_value;
use wasm_bindgen::prelude::*;

/// Initialize the core with the JS DB adapter.
/// The adapter must expose: query(sql: string, params: unknown[]) => Promise<unknown[]>, exec(sql: string, params: unknown[]) => Promise<void>.
#[wasm_bindgen(js_name = init)]
pub fn init(db: JsValue) -> Result<(), JsValue> {
    db::set_adapter(db);
    Ok(())
}

/// Fetch event types (name, label) from sm_event_types. Requires init(adapter) first.
#[wasm_bindgen(js_name = getEventTypes)]
pub async fn get_event_types() -> Result<JsValue, JsValue> {
    let rows = events::get_event_types().await?;
    to_value(&rows).map_err(|e| JsValue::from_str(&format!("serialize: {:?}", e)))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn placeholder() {
        assert!(true);
    }
}
