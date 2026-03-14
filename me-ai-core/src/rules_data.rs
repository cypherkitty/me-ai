//! Rules and events CRUD via Rexie (sm_rules, sm_rule_triggers, sm_rule_commands, sm_events).

use serde::{Deserialize, Serialize};

use crate::db::{
    index_get_all, key_range_only, store_clear, store_delete, store_get, store_get_all,
    store_put,
};
use crate::error::CoreError;
use crate::schema::store;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct RuleRow {
    pub id: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub enabled: Option<bool>,
    pub priority: Option<i64>,
    #[serde(rename = "created_at")]
    pub created_at: Option<i64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct RuleTriggerRow {
    pub id: Option<String>,
    #[serde(rename = "rule_id")]
    pub rule_id: Option<String>,
    #[serde(rename = "trigger_type")]
    pub trigger_type: Option<String>,
    #[serde(rename = "trigger_name")]
    pub trigger_name: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct RuleCommandRow {
    pub id: Option<String>,
    #[serde(rename = "rule_id")]
    pub rule_id: Option<String>,
    #[serde(rename = "command_id")]
    pub command_id: Option<String>,
    #[serde(rename = "plugin_id")]
    pub plugin_id: Option<String>,
    #[serde(rename = "action_id")]
    pub action_id: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub icon: Option<String>,
    #[serde(rename = "order_idx")]
    pub order_idx: Option<i64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EventRow {
    pub id: Option<String>,
    pub content: Option<String>,
    pub subject: Option<String>,
    pub sender: Option<String>,
    pub timestamp: Option<i64>,
    pub status: Option<String>,
    #[serde(rename = "event_type")]
    pub event_type: Option<String>,
    #[serde(rename = "event_category")]
    pub event_category: Option<String>,
    #[serde(rename = "source_name")]
    pub source_name: Option<String>,
    #[serde(rename = "rule_id")]
    pub rule_id: Option<String>,
    #[serde(rename = "actions_taken")]
    pub actions_taken: Option<String>,
    pub output: Option<String>,
}

/// Get all rules with triggers and commands.
pub async fn get_rules() -> Result<Vec<serde_json::Value>, CoreError> {
    let rules: Vec<RuleRow> = store_get_all(store::SM_RULES, None, None).await?;
    let mut out = Vec::new();
    for r in rules {
        let id = r.id.as_deref().and_then(|v| {
            let trimmed = v.trim();
            if trimmed.is_empty() {
                None
            } else {
                Some(trimmed)
            }
        });
        let (triggers, commands) = if let Some(id) = id {
            let range = key_range_only(id)?;
            let triggers: Vec<RuleTriggerRow> = index_get_all(
                store::SM_RULE_TRIGGERS,
                "rule_id",
                Some(range.clone()),
                None,
            )
            .await?;
            let commands: Vec<RuleCommandRow> =
                index_get_all(store::SM_RULE_COMMANDS, "rule_id", Some(range), None).await?;
            (triggers, commands)
        } else {
            (Vec::new(), Vec::new())
        };
        out.push(serde_json::json!({
            "id": r.id,
            "name": r.name,
            "description": r.description,
            "enabled": r.enabled,
            "priority": r.priority,
            "created_at": r.created_at,
            "triggers": triggers.into_iter().map(|t| serde_json::json!({"type": t.trigger_type, "name": t.trigger_name})).collect::<Vec<_>>(),
            "actions": commands.into_iter().map(|c| serde_json::json!({
                "id": c.command_id,
                "pluginId": c.plugin_id,
                "commandId": c.action_id,
                "name": c.name,
                "description": c.description,
                "icon": c.icon
            })).collect::<Vec<_>>()
        }));
    }
    out.sort_by(|a, b| {
        let pa = a.get("priority").and_then(|v| v.as_i64()).unwrap_or(0);
        let pb = b.get("priority").and_then(|v| v.as_i64()).unwrap_or(0);
        pb.cmp(&pa)
    });
    Ok(out)
}

/// Get one rule by id.
pub async fn get_rule(id: &str) -> Result<Option<serde_json::Value>, CoreError> {
    let r: Option<RuleRow> = store_get(store::SM_RULES, id).await?;
    let Some(r) = r else {
        return Ok(None);
    };
    let range = key_range_only(id)?;
    let triggers: Vec<RuleTriggerRow> = index_get_all(
        store::SM_RULE_TRIGGERS,
        "rule_id",
        Some(range.clone()),
        None,
    )
    .await?;
    let commands: Vec<RuleCommandRow> =
        index_get_all(store::SM_RULE_COMMANDS, "rule_id", Some(range), None).await?;
    Ok(Some(serde_json::json!({
        "id": r.id,
        "name": r.name,
        "description": r.description,
        "enabled": r.enabled,
        "priority": r.priority,
        "created_at": r.created_at,
        "triggers": triggers.into_iter().map(|t| serde_json::json!({"type": t.trigger_type, "name": t.trigger_name})).collect::<Vec<_>>(),
        "actions": commands.into_iter().map(|c| serde_json::json!({
            "id": c.command_id,
            "pluginId": c.plugin_id,
            "commandId": c.action_id,
            "name": c.name,
            "description": c.description,
            "icon": c.icon
        })).collect::<Vec<_>>()
    })))
}

/// Save rule (upsert) with triggers and commands. payload: JSON object from JS.
pub async fn save_rule(payload: serde_json::Value) -> Result<(), CoreError> {
    let id = payload
        .get("id")
        .and_then(|v| v.as_str())
        .ok_or_else(|| CoreError::Serialize("rule.id required".into()))?;
    let name = payload.get("name").and_then(|v| v.as_str()).unwrap_or("");
    let description = payload.get("description").and_then(|v| v.as_str()).unwrap_or("");
    let enabled = payload.get("enabled").and_then(|v| v.as_bool()).unwrap_or(true);
    let priority = payload.get("priority").and_then(|v| v.as_i64()).unwrap_or(5);
    let created_at = payload.get("created_at").and_then(|v| v.as_i64());

    let rule_doc = serde_json::json!({
        "id": id,
        "name": name,
        "description": description,
        "enabled": enabled,
        "priority": priority,
        "created_at": created_at
    });
    store_put(store::SM_RULES, &rule_doc, Some(id)).await?;

    // Delete existing triggers and commands for this rule
    let range = key_range_only(id)?;
    let old_triggers: Vec<RuleTriggerRow> = index_get_all(
        store::SM_RULE_TRIGGERS,
        "rule_id",
        Some(range.clone()),
        None,
    )
    .await?;
    for t in old_triggers {
        if let Some(ref tid) = t.id {
            store_delete(store::SM_RULE_TRIGGERS, tid).await?;
        }
    }
    let old_commands: Vec<RuleCommandRow> =
        index_get_all(store::SM_RULE_COMMANDS, "rule_id", Some(range), None).await?;
    for c in old_commands {
        if let Some(ref cid) = c.id {
            store_delete(store::SM_RULE_COMMANDS, cid).await?;
        }
    }

    let empty_arr: Vec<serde_json::Value> = vec![];
    let triggers = payload.get("triggers").and_then(|v| v.as_array()).unwrap_or(&empty_arr);
    for t in triggers.iter() {
        let ty = t.get("type").and_then(|v| v.as_str()).unwrap_or("");
        let name = t.get("name").and_then(|v| v.as_str()).unwrap_or("");
        let tid = format!("{}|{}|{}", id, ty, name);
        let doc = serde_json::json!({
            "id": tid,
            "rule_id": id,
            "trigger_type": t.get("type"),
            "trigger_name": t.get("name")
        });
        store_put(store::SM_RULE_TRIGGERS, &doc, Some(&tid)).await?;
    }

    let empty_actions: Vec<serde_json::Value> = vec![];
    let actions = payload.get("actions").and_then(|v| v.as_array()).unwrap_or(&empty_actions);
    for (i, a) in actions.iter().enumerate() {
        let cid = format!("{}|{}", id, i);
        let doc = serde_json::json!({
            "id": cid,
            "rule_id": id,
            "command_id": a.get("id"),
            "plugin_id": a.get("pluginId"),
            "action_id": a.get("commandId"),
            "name": a.get("name"),
            "description": a.get("description"),
            "icon": a.get("icon"),
            "order_idx": i
        });
        store_put(store::SM_RULE_COMMANDS, &doc, Some(&cid)).await?;
    }

    Ok(())
}

/// Delete rule and its triggers and commands.
pub async fn delete_rule(id: &str) -> Result<(), CoreError> {
    let range = key_range_only(id)?;
    let triggers: Vec<RuleTriggerRow> = index_get_all(
        store::SM_RULE_TRIGGERS,
        "rule_id",
        Some(range.clone()),
        None,
    )
    .await?;
    for t in triggers {
        if let Some(tid) = t.id {
            store_delete(store::SM_RULE_TRIGGERS, &tid).await?;
        }
    }
    let commands: Vec<RuleCommandRow> =
        index_get_all(store::SM_RULE_COMMANDS, "rule_id", Some(range), None).await?;
    for c in commands {
        if let Some(cid) = c.id {
            store_delete(store::SM_RULE_COMMANDS, &cid).await?;
        }
    }
    store_delete(store::SM_RULES, id).await?;
    store_delete(store::SM_RULE_POLICIES, id).await?;
    Ok(())
}

/// Get events (paginated). Sorted by timestamp desc.
pub async fn get_events(limit: u32, offset: u32) -> Result<Vec<EventRow>, CoreError> {
    let mut all: Vec<EventRow> = store_get_all(store::SM_EVENTS, None, Some(limit + offset)).await?;
    all.sort_by(|a, b| b.timestamp.unwrap_or(0).cmp(&a.timestamp.unwrap_or(0)));
    let skip = offset as usize;
    if skip >= all.len() {
        return Ok(vec![]);
    }
    let end = (skip + limit as usize).min(all.len());
    Ok(all[skip..end].to_vec())
}

/// Update event status.
pub async fn update_event_status(id: &str, status: &str) -> Result<(), CoreError> {
    if let Some(mut row) = store_get::<EventRow>(store::SM_EVENTS, id).await? {
        row.status = Some(status.to_string());
        store_put(store::SM_EVENTS, &row, Some(id)).await?;
    }
    Ok(())
}

/// Clear all events.
pub async fn clear_events() -> Result<(), CoreError> {
    store_clear(store::SM_EVENTS).await
}

/// Insert one event.
pub async fn insert_event(
    id: &str,
    content: Option<&str>,
    subject: Option<&str>,
    sender: Option<&str>,
    timestamp: i64,
    status: Option<&str>,
    event_type: Option<&str>,
    event_category: Option<&str>,
    source_name: Option<&str>,
    rule_id: Option<&str>,
    actions_taken: Option<&str>,
    output: Option<&str>,
) -> Result<(), CoreError> {
    let doc = serde_json::json!({
        "id": id,
        "content": content,
        "subject": subject,
        "sender": sender,
        "timestamp": timestamp,
        "status": status,
        "event_type": event_type,
        "event_category": event_category,
        "source_name": source_name,
        "rule_id": rule_id,
        "actions_taken": actions_taken,
        "output": output
    });
    store_put(store::SM_EVENTS, &doc, Some(id)).await
}
