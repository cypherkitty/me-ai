//! Sources, actions, and plugins from Rexie stores.

use serde::{Deserialize, Serialize};

use crate::db::{key_range_only, store, DbRef};
use crate::error::CoreError;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SourceRow {
    pub name: String,
    pub label: Option<String>,
    pub platform: Option<String>,
    pub api: Option<String>,
    pub enabled: Option<bool>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ActionRow {
    pub name: String,
    pub label: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PluginRow {
    pub name: String,
    pub label: Option<String>,
    pub version: Option<String>,
    pub enabled: Option<bool>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PluginActionRow {
    #[serde(rename = "action_name")]
    pub action_name: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PluginSourceRow {
    #[serde(rename = "source_name")]
    pub source_name: Option<String>,
}

/// Fetch sources. Sorted by name in Rust.
pub async fn get_sources(db: DbRef<'_>) -> Result<Vec<SourceRow>, CoreError> {
    let mut rows: Vec<SourceRow> = db.store_get_all(store::SM_SOURCES, None, None).await?;
    rows.sort_by(|a, b| a.name.cmp(&b.name));
    Ok(rows)
}

/// Fetch actions. Sorted by name in Rust.
pub async fn get_actions(db: DbRef<'_>) -> Result<Vec<ActionRow>, CoreError> {
    let mut rows: Vec<ActionRow> = db.store_get_all(store::SM_ACTIONS, None, None).await?;
    rows.sort_by(|a, b| a.name.cmp(&b.name));
    Ok(rows)
}

/// Fetch plugins with nested actions and sources (for rules UI).
pub async fn get_plugins(db: DbRef<'_>) -> Result<Vec<serde_json::Value>, CoreError> {
    let plugins: Vec<PluginRow> = db.store_get_all(store::SM_PLUGINS, None, None).await?;
    let mut out = Vec::with_capacity(plugins.len());
    for p in plugins {
        let name = p.name.clone();
        let range_act = key_range_only(&name)?;
        let actions: Vec<PluginActionRow> = db
            .index_get_all(store::SM_PLUGIN_ACTIONS, "plugin_name", Some(range_act), None)
            .await?;
        let action_names: Vec<String> = actions
            .into_iter()
            .filter_map(|a| a.action_name)
            .collect();
        let mut action_labels: Vec<serde_json::Value> = Vec::new();
        for an in &action_names {
            if let Ok(Some(a)) = db.store_get::<ActionRow>(store::SM_ACTIONS, an).await {
                action_labels.push(serde_json::json!({ "name": a.name, "label": a.label }));
            }
        }
        let range_src = key_range_only(&name)?;
        let sources: Vec<PluginSourceRow> = db
            .index_get_all(store::SM_PLUGIN_SOURCES, "plugin_name", Some(range_src), None)
            .await?;
        let source_names: Vec<String> = sources.into_iter().filter_map(|s| s.source_name).collect();
        let mut source_labels: Vec<serde_json::Value> = Vec::new();
        for sn in &source_names {
            if let Ok(Some(s)) = db.store_get::<SourceRow>(store::SM_SOURCES, sn).await {
                source_labels.push(serde_json::json!({ "name": s.name, "label": s.label }));
            }
        }
        out.push(serde_json::json!({
            "name": p.name,
            "label": p.label,
            "version": p.version,
            "enabled": p.enabled,
            "actions": action_labels,
            "sources": source_labels,
        }));
    }
    out.sort_by(|a, b| {
        let na = a.get("name").and_then(|v| v.as_str()).unwrap_or("");
        let nb = b.get("name").and_then(|v| v.as_str()).unwrap_or("");
        na.cmp(nb)
    });
    Ok(out)
}
