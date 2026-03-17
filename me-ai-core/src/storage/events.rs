//! Event types and categories from Rexie stores.

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::db::{store, DbRef};
use crate::error::CoreError;

#[wasm_bindgen(typescript_custom_section)]
const EVENTS_TYPES: &'static str = r#"
export type EventCategory = "NOISE" | "INFO" | "CRITICAL";

export interface EmailEvent {
    type: string;
    source: string;
    data: { subject?: string; from?: string; date?: string; snippet?: string; [k: string]: unknown };
    metadata?: { reason?: string; summary?: string; tags?: string[]; category?: EventCategory; [k: string]: unknown };
}

export interface ExecutionProgress {
    phase: string;
    actionId?: string;
    actionName?: string;
    pluginId?: string;
    commandId?: string;
    result?: unknown;
    error?: string;
    category?: EventCategory;
    eventIndex?: number;
    totalEvents?: number;
    event?: EmailEvent;
    eventType?: string;
    eventCount?: number;
    actions?: unknown[];
    actionCount?: number;
}

export interface ByCategory {
    categories: Record<string, Array<{ emailId?: string; subject?: string; from?: string; date?: number; summary?: string; reason?: string; tags?: string[]; status?: string }>>;
    order: string[];
}

export interface ClassificationLike {
    action: string;
    reason?: string;
    summary?: string;
    tags?: string[];
    categoryTier?: EventCategory;
}

export interface EmailLike {
    subject?: string;
    from?: string;
    date?: string | number;
    snippet?: string;
    body?: string;
}
"#;

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EventTypeRow {
    pub name: String,
    #[serde(default)]
    pub label: String,
    #[serde(rename = "category_name")]
    pub category_name: Option<String>,
    #[serde(rename = "auto_created", default)]
    pub auto_created: bool,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EventCategoryRow {
    pub name: String,
    #[serde(default)]
    pub label: String,
    #[serde(default)]
    pub priority: i64,
    #[serde(default)]
    pub policy: String,
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
    rows.sort_by(|a, b| a.priority.cmp(&b.priority));
    Ok(rows)
}

#[derive(Clone, Debug, Serialize, Deserialize)]
struct EventTypeStoreRow {
    name: String,
    #[serde(default)]
    label: String,
    #[serde(rename = "category_name")]
    category_name: Option<String>,
    #[serde(rename = "auto_created", default)]
    auto_created: bool,
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
        label: label.to_string(),
        category_name: Some(category_name.to_string()),
        auto_created,
    };
    db.store_put(store::SM_EVENT_TYPES, &row, Some(name)).await
}
