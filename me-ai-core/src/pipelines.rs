//! Pipeline and config: category/type pipelines, event type category, source/plugin enabled.
//! All via Rexie (sm_category_pipeline, sm_type_pipeline, sm_event_types, sm_event_categories, sm_sources, sm_plugins).

use serde::{Deserialize, Serialize};

use crate::db::{
    index_get_all, key_range_only, store_delete, store_get, store_put,
};
use crate::error::CoreError;
use crate::schema::store;

#[derive(Clone, Debug, Serialize, Deserialize)]
struct CategoryPipelineRow {
    id: String,
    #[serde(rename = "category_name")]
    category_name: String,
    #[serde(rename = "action_idx")]
    action_idx: i64,
    #[serde(rename = "plugin_id")]
    plugin_id: String,
    #[serde(rename = "command_id")]
    command_id: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
struct TypePipelineRow {
    id: String,
    #[serde(rename = "type_name")]
    type_name: String,
    #[serde(rename = "action_idx")]
    action_idx: i64,
    #[serde(rename = "plugin_id")]
    plugin_id: String,
    #[serde(rename = "command_id")]
    command_id: String,
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

#[derive(Clone, Debug, Serialize, Deserialize)]
struct EventCategoryStoreRow {
    name: String,
    label: Option<String>,
    priority: Option<i64>,
    policy: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
struct SourceStoreRow {
    name: String,
    label: Option<String>,
    platform: Option<String>,
    api: Option<String>,
    enabled: Option<bool>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
struct PluginStoreRow {
    name: String,
    label: Option<String>,
    version: Option<String>,
    enabled: Option<bool>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PipelineActionRow {
    #[serde(rename = "plugin_id")]
    pub plugin_id: String,
    #[serde(rename = "command_id")]
    pub command_id: String,
    #[serde(rename = "action_idx")]
    pub action_idx: i64,
}

/// Get category pipeline actions (ordered by action_idx).
pub async fn get_category_pipeline_actions(
    category_name: &str,
) -> Result<Vec<PipelineActionRow>, CoreError> {
    let range = key_range_only(category_name)?;
    let mut rows: Vec<CategoryPipelineRow> = index_get_all(
        store::SM_CATEGORY_PIPELINE,
        "category_name",
        Some(range),
        Some(200),
    )
    .await?;
    rows.sort_by_key(|r| r.action_idx);
    Ok(rows
        .into_iter()
        .map(|r| PipelineActionRow {
            plugin_id: r.plugin_id,
            command_id: r.command_id,
            action_idx: r.action_idx,
        })
        .collect())
}

/// Get type pipeline actions (ordered by action_idx).
pub async fn get_type_pipeline_actions(
    type_name: &str,
) -> Result<Vec<PipelineActionRow>, CoreError> {
    let range = key_range_only(type_name)?;
    let mut rows: Vec<TypePipelineRow> = index_get_all(
        store::SM_TYPE_PIPELINE,
        "type_name",
        Some(range),
        Some(200),
    )
    .await?;
    rows.sort_by_key(|r| r.action_idx);
    Ok(rows
        .into_iter()
        .map(|r| PipelineActionRow {
            plugin_id: r.plugin_id,
            command_id: r.command_id,
            action_idx: r.action_idx,
        })
        .collect())
}

/// Get event type's category_name.
pub async fn get_event_type_category(type_name: &str) -> Result<Option<String>, CoreError> {
    let row: Option<EventTypeStoreRow> = store_get(store::SM_EVENT_TYPES, type_name).await?;
    Ok(row.and_then(|r| r.category_name))
}

/// Get event category policy.
pub async fn get_event_category_policy(
    category_name: &str,
) -> Result<Option<String>, CoreError> {
    let row: Option<EventCategoryStoreRow> =
        store_get(store::SM_EVENT_CATEGORIES, category_name).await?;
    Ok(row.and_then(|r| r.policy))
}

/// Replace category pipeline with given actions.
pub async fn update_category_pipeline(
    category_name: &str,
    actions: &[(String, String)],
) -> Result<(), CoreError> {
    let range = key_range_only(category_name)?;
    let existing: Vec<CategoryPipelineRow> = index_get_all(
        store::SM_CATEGORY_PIPELINE,
        "category_name",
        Some(range),
        Some(200),
    )
    .await?;
    for r in &existing {
        store_delete(store::SM_CATEGORY_PIPELINE, &r.id).await?;
    }
    for (i, (plugin_id, command_id)) in actions.iter().enumerate() {
        let id = format!("{}|{}", category_name, i);
        let row = CategoryPipelineRow {
            id: id.clone(),
            category_name: category_name.to_string(),
            action_idx: i as i64,
            plugin_id: plugin_id.clone(),
            command_id: command_id.clone(),
        };
        store_put(store::SM_CATEGORY_PIPELINE, &row, Some(&id)).await?;
    }
    Ok(())
}

/// Update event category policy.
pub async fn update_category_policy(
    category_name: &str,
    policy: &str,
) -> Result<(), CoreError> {
    let mut row: EventCategoryStoreRow = store_get(store::SM_EVENT_CATEGORIES, category_name)
        .await?
        .ok_or_else(|| CoreError::Rexie(format!("category not found: {}", category_name)))?;
    row.policy = Some(policy.to_string());
    store_put(
        store::SM_EVENT_CATEGORIES,
        &row,
        Some(category_name),
    )
    .await
}

/// Set event type's category.
pub async fn update_event_type_category(
    type_name: &str,
    category_name: &str,
) -> Result<(), CoreError> {
    let mut row: EventTypeStoreRow = store_get(store::SM_EVENT_TYPES, type_name)
        .await?
        .ok_or_else(|| CoreError::Rexie(format!("event type not found: {}", type_name)))?;
    row.category_name = Some(category_name.to_string());
    store_put(store::SM_EVENT_TYPES, &row, Some(type_name)).await
}

/// Clear event type's category (set to null).
pub async fn clear_event_type_category(type_name: &str) -> Result<(), CoreError> {
    let mut row: EventTypeStoreRow = store_get(store::SM_EVENT_TYPES, type_name)
        .await?
        .ok_or_else(|| CoreError::Rexie(format!("event type not found: {}", type_name)))?;
    row.category_name = None;
    store_put(store::SM_EVENT_TYPES, &row, Some(type_name)).await
}

/// Delete event type and its type pipeline.
pub async fn delete_event_type(type_name: &str) -> Result<(), CoreError> {
    let range = key_range_only(type_name)?;
    let existing: Vec<TypePipelineRow> = index_get_all(
        store::SM_TYPE_PIPELINE,
        "type_name",
        Some(range),
        Some(200),
    )
    .await?;
    for r in &existing {
        store_delete(store::SM_TYPE_PIPELINE, &r.id).await?;
    }
    store_delete(store::SM_EVENT_TYPES, type_name).await
}

/// Set source enabled flag.
pub async fn set_source_enabled(name: &str, enabled: bool) -> Result<(), CoreError> {
    let mut row: SourceStoreRow = store_get(store::SM_SOURCES, name)
        .await?
        .ok_or_else(|| CoreError::Rexie(format!("source not found: {}", name)))?;
    row.enabled = Some(enabled);
    store_put(store::SM_SOURCES, &row, Some(name)).await
}

/// Set plugin enabled flag.
pub async fn set_plugin_enabled(name: &str, enabled: bool) -> Result<(), CoreError> {
    let mut row: PluginStoreRow = store_get(store::SM_PLUGINS, name)
        .await?
        .ok_or_else(|| CoreError::Rexie(format!("plugin not found: {}", name)))?;
    row.enabled = Some(enabled);
    store_put(store::SM_PLUGINS, &row, Some(name)).await
}
