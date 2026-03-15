//! Event types and categories from Rexie stores.

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::db::{store, DbRef};
use crate::error::CoreError;

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EventTypeRow {
    pub name: String,
    pub label: Option<String>,
    #[serde(rename = "category_name")]
    pub category_name: Option<String>,
    #[serde(rename = "auto_created")]
    pub auto_created: Option<bool>,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EventCategoryRow {
    pub name: String,
    pub label: Option<String>,
    pub priority: Option<i64>,
    pub policy: Option<String>,
}

/// Fetch event types (name, label). Sorted by name in Rust.
pub async fn get_event_types(db: DbRef<'_>) -> Result<Vec<EventTypeRow>, CoreError> {
    let mut rows: Vec<EventTypeRow> = db.store_get_all(store::SM_EVENT_TYPES, None, None).await?;
    rows.sort_by(|a, b| a.name.cmp(&b.name));
    Ok(rows)
}

/// Fetch event categories (name, label, priority, policy). Sorted by priority in Rust.
pub async fn get_event_categories(db: DbRef<'_>) -> Result<Vec<EventCategoryRow>, CoreError> {
    let mut rows: Vec<EventCategoryRow> =
        db.store_get_all(store::SM_EVENT_CATEGORIES, None, None).await?;
    rows.sort_by(|a, b| {
        let pa = a.priority.unwrap_or(0);
        let pb = b.priority.unwrap_or(0);
        pa.cmp(&pb)
    });
    Ok(rows)
}

#[derive(Clone, Debug, Serialize, Deserialize)]
struct EventTypeStoreRow {
    name: String,
    label: Option<String>,
    #[serde(rename = "category_name")]
    category_name: Option<String>,
    #[serde(rename = "auto_created")]
    auto_created: Option<bool>,
}

/// Insert event type if not present (for LLM-seeded types).
pub async fn upsert_event_type(
    db: DbRef<'_>,
    name: &str,
    label: &str,
    category_name: &str,
    auto_created: bool,
) -> Result<(), CoreError> {
    if db.store_get::<EventTypeStoreRow>(store::SM_EVENT_TYPES, name).await?.is_some() {
        return Ok(());
    }
    let row = EventTypeStoreRow {
        name: name.to_string(),
        label: Some(label.to_string()),
        category_name: Some(category_name.to_string()),
        auto_created: Some(auto_created),
    };
    db.store_put(store::SM_EVENT_TYPES, &row, Some(name)).await
}
