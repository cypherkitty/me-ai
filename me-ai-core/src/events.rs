//! Event types and simple queries (sea-query + run_query).

use serde::{Deserialize, Serialize};
use sea_query::{Alias, Order, Query, SqliteQueryBuilder};
use wasm_bindgen::JsValue;

use crate::db::{run_query, values_to_js_array};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EventTypeRow {
    pub name: String,
    pub label: Option<String>,
}

/// Build SELECT name, label FROM sm_event_types ORDER BY name.
/// Returns (sql, params) for the JS adapter.
fn select_event_types() -> (String, sea_query::Values) {
    let table = Alias::new("sm_event_types");
    let name = Alias::new("name");
    let label = Alias::new("label");
    let stmt = Query::select()
        .columns([(table.clone(), name.clone()), (table.clone(), label.clone())])
        .from(table.clone())
        .order_by((table, name), Order::Asc)
        .to_owned();
    stmt.build(SqliteQueryBuilder)
}

/// Fetch event types from the DB (requires init() with adapter first).
pub async fn get_event_types() -> Result<Vec<EventTypeRow>, JsValue> {
    let (sql, values) = select_event_types();
    let params = values_to_js_array(&values);
    run_query::<EventTypeRow>(&sql, &params).await
}
