//! Sources, actions, and plugins from Rexie stores.

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::db::{key_range_only, store, RexieDb};
use crate::error::CoreError;

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SourceRow {
    pub name: String,
    #[serde(default)]
    pub label: String,
    #[serde(default)]
    pub platform: String,
    #[serde(default)]
    pub api: String,
    #[serde(default)]
    pub enabled: bool,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ActionRow {
    pub name: String,
    #[serde(default)]
    pub label: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PluginRow {
    pub name: String,
    #[serde(default)]
    pub label: String,
    #[serde(default)]
    pub version: String,
    #[serde(default)]
    pub enabled: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PluginActionRow {
    #[serde(rename = "action_name", default)]
    pub action_name: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PluginSourceRow {
    #[serde(rename = "source_name", default)]
    pub source_name: String,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize)]
pub struct LabelRef {
    pub name: String,
    #[serde(default)]
    pub label: String,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize)]
pub struct PluginSummary {
    pub name: String,
    #[serde(default)]
    pub label: String,
    #[serde(default)]
    pub version: String,
    pub enabled: bool,
    pub actions: Vec<LabelRef>,
    pub sources: Vec<LabelRef>,
}

/// Fetch sources. Sorted by name in Rust.
pub async fn get_sources(db: &RexieDb) -> Result<Vec<SourceRow>, CoreError> {
    let mut rows: Vec<SourceRow> = db.store_get_all(store::SM_SOURCES, None, None).await?;
    rows.sort_by(|a, b| a.name.cmp(&b.name));
    Ok(rows)
}

/// Fetch actions. Sorted by name in Rust.
pub async fn get_actions(db: &RexieDb) -> Result<Vec<ActionRow>, CoreError> {
    let mut rows: Vec<ActionRow> = db.store_get_all(store::SM_ACTIONS, None, None).await?;
    rows.sort_by(|a, b| a.name.cmp(&b.name));
    Ok(rows)
}

/// Fetch plugins with nested actions and sources (for rules UI).
pub async fn get_plugins(db: &RexieDb) -> Result<Vec<PluginSummary>, CoreError> {
    let plugins: Vec<PluginRow> = db.store_get_all(store::SM_PLUGINS, None, None).await?;
    let mut out: Vec<PluginSummary> = Vec::with_capacity(plugins.len());
    for p in plugins {
        let name = p.name.clone();
        let range_act = key_range_only(&name)?;
        let actions: Vec<PluginActionRow> = db
            .index_get_all(store::SM_PLUGIN_ACTIONS, "plugin_name", Some(range_act), None)
            .await?;
        let action_names: Vec<String> = actions
            .into_iter()
            .filter(|a| !a.action_name.is_empty())
            .map(|a| a.action_name)
            .collect();
        let mut action_labels: Vec<LabelRef> = Vec::new();
        for an in &action_names {
            if let Ok(Some(a)) = db.store_get::<ActionRow>(store::SM_ACTIONS, an).await {
                action_labels.push(LabelRef {
                    name: a.name,
                    label: a.label,
                });
            }
        }
        let range_src = key_range_only(&name)?;
        let sources: Vec<PluginSourceRow> = db
            .index_get_all(store::SM_PLUGIN_SOURCES, "plugin_name", Some(range_src), None)
            .await?;
        let source_names: Vec<String> = sources
            .into_iter()
            .filter(|s| !s.source_name.is_empty())
            .map(|s| s.source_name)
            .collect();
        let mut source_labels: Vec<LabelRef> = Vec::new();
        for sn in &source_names {
            if let Ok(Some(s)) = db.store_get::<SourceRow>(store::SM_SOURCES, sn).await {
                source_labels.push(LabelRef {
                    name: s.name,
                    label: s.label,
                });
            }
        }
        out.push(PluginSummary {
            name: p.name,
            label: p.label,
            version: p.version,
            enabled: p.enabled,
            actions: action_labels,
            sources: source_labels,
        });
    }
    out.sort_by(|a, b| {
        a.name.cmp(&b.name)
    });
    Ok(out)
}
