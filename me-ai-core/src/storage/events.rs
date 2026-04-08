//! Event types and categories from Rexie stores.

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::db::{store, RexieDb};
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
pub async fn get_event_types(db: &RexieDb) -> Result<Vec<EventTypeRow>, CoreError> {
    let mut rows: Vec<EventTypeRow> = db.store_get_all(store::SM_EVENT_TYPES, None, None).await?;
    rows.sort_by(|a, b| a.name.cmp(&b.name));
    Ok(rows)
}

/// Fetch event categories (name, label, priority, policy). Sorted by priority in Rust.
pub async fn get_event_categories(db: &RexieDb) -> Result<Vec<EventCategoryRow>, CoreError> {
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

// ── Tier definitions ──────────────────────────────────────────────────

/// Static tier definition returned by `getEventCategoryTiers`.
#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EventCategoryTier {
    pub id: String,
    pub label: String,
    pub description: String,
    #[wasm_bindgen(js_name = "autoExecute")]
    pub auto_execute: bool,
    #[wasm_bindgen(js_name = "requiresApproval")]
    pub requires_approval: bool,
    pub color: String,
}

pub fn get_event_category_tiers() -> Vec<EventCategoryTier> {
    vec![
        EventCategoryTier {
            id: "NOISE".into(),
            label: "Noise".into(),
            description: "Unimportant messages that can be safely deleted automatically.".into(),
            auto_execute: true,
            requires_approval: false,
            color: "#6b7280".into(),
        },
        EventCategoryTier {
            id: "INFO".into(),
            label: "Info".into(),
            description: "Useful but not urgent — will be silently archived.".into(),
            auto_execute: true,
            requires_approval: false,
            color: "#3b82f6".into(),
        },
        EventCategoryTier {
            id: "CRITICAL".into(),
            label: "Critical".into(),
            description: "Requires attention. User must review before any action runs.".into(),
            auto_execute: false,
            requires_approval: true,
            color: "#ef4444".into(),
        },
    ]
}

/// Normalize a raw category string to one of: NOISE, INFO, CRITICAL.
pub fn normalize_category(raw: &str) -> &'static str {
    match raw.to_uppercase().as_str() {
        "NOISE" => "NOISE",
        "INFO" | "INFORMATIONAL" => "INFO",
        "CRITICAL" | "IMPORTANT" | "URGENT" => "CRITICAL",
        _ => "CRITICAL",
    }
}

/// Normalize category to lowercase: NOISE → noise, INFO → info, CRITICAL → critical.
pub fn normalize_category_lower(raw: &str) -> &'static str {
    match normalize_category(raw) {
        "NOISE" => "noise",
        "INFO" => "info",
        _ => "critical",
    }
}

/// Seed an event type from LLM classification. Normalizes the category and
/// upserts into the eventTypes store.
pub async fn seed_event_type_from_llm(
    db: &RexieDb,
    event_type: &str,
    category: &str,
) -> Result<(), CoreError> {
    // Normalize event type name
    let normalized: String = event_type
        .to_uppercase()
        .chars()
        .map(|c| if c.is_alphanumeric() || c == '_' { c } else if c == ' ' { '_' } else { '\0' })
        .filter(|&c| c != '\0')
        .collect();
    if normalized.is_empty() {
        return Ok(());
    }

    let cat = normalize_category_lower(category);
    let label = normalized.replace('_', " ");
    upsert_event_type(db, &normalized, &label, cat, true).await
}

/// Fetch all known event type names (from both the eventTypes store and classifications).
pub async fn get_all_event_types(db: &RexieDb) -> Result<Vec<String>, CoreError> {
    use std::collections::BTreeSet;

    let type_rows: Vec<EventTypeRow> = db.store_get_all(store::SM_EVENT_TYPES, None, None).await?;
    let mut names: BTreeSet<String> = type_rows.into_iter().map(|r| r.name).collect();

    // Also collect action names from classifications
    let class_rows: Vec<ClassificationActionOnly> =
        db.store_get_all(store::EMAIL_CLASSIFICATIONS, None, None).await?;
    for row in class_rows {
        if let Some(action) = row.action {
            if !action.is_empty() {
                names.insert(action);
            }
        }
    }

    Ok(names.into_iter().collect())
}

/// Look up the category for an event type from the eventTypes store.
pub async fn get_category_for_event_type(
    db: &RexieDb,
    event_type: &str,
) -> Result<String, CoreError> {
    let normalized = event_type.to_uppercase();
    if let Some(row) = db.store_get::<EventTypeRow>(store::SM_EVENT_TYPES, &normalized).await? {
        if let Some(cat) = &row.category_name {
            return Ok(normalize_category(cat).to_string());
        }
    }
    Ok("CRITICAL".to_string())
}

#[derive(Deserialize)]
struct ClassificationActionOnly {
    action: Option<String>,
}

/// Insert event type if not present (for LLM-seeded types).
pub async fn upsert_event_type(
    db: &RexieDb,
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
