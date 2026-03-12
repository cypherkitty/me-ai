//! me-ai-core: business logic and type-safe DuckDB queries (WASM).
//!
//! All SQL is built with sea-query (SQLite backend for DuckDB compatibility)
//! and executed via the JS adapter (query/exec). OPFS persistence stays in JS.

use wasm_bindgen::prelude::*;

/// Initialize the core with the JS DB adapter.
/// The adapter must expose: query(sql: string, params: unknown[]) => Promise<unknown[]>, exec(sql: string, params: unknown[]) => Promise<void>.
#[wasm_bindgen(js_name = init)]
pub fn init(_db: JsValue) -> Result<(), JsValue> {
    // TODO: store adapter, implement run_query/run_exec and sea-query -> (sql, params) conversion
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn placeholder() {
        assert!(true);
    }
}
