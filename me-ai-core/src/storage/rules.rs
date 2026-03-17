//! Rules and events CRUD via Rexie (sm_rules, sm_rule_triggers, sm_rule_commands, sm_events).

use serde::{Deserialize, Serialize};
use tsify_next::Tsify;
use wasm_bindgen::prelude::*;

use crate::db::{key_range_only, store, DbRef};
use crate::error::CoreError;

#[wasm_bindgen(typescript_custom_section)]
const RULES_TYPES: &'static str = r#"
export interface Action {
    id: string;
    pluginId: string;
    commandId: string;
    name: string;
    description: string;
    icon?: string;
}

export interface Trigger {
    type: "event_type" | "event_category";
    name: string;
}

export interface Rule {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    priority: number;
    created_at: number;
    triggers: Trigger[];
    actions: Action[];
    policy?: string;
}

export interface CreateRuleInput {
    name: string;
    description?: string;
    enabled?: boolean;
    priority?: number;
    triggers?: Trigger[];
    actions?: Action[];
}

export interface EventStats {
    awaiting_user: number;
    escalated: number;
    completed: number;
    failed: number;
    total: number;
}

export interface PendingItemByCategory {
    id: string;
    emailId: string;
    subject: string;
    from: string;
    eventType: string;
    event_category: string;
    sourceType: string;
    status: string;
}

export interface PipelineForEvent {
    actions: Array<{ pluginId: string; commandId: string; order: number }>;
    policy: string;
    category: string;
    isOverride?: boolean;
}

export interface CategoryPipelineDisplay {
    category: string;
    label: string;
    priority: number;
    policy: string;
    actions: Array<{ pluginId: string; commandId: string; order: number }>;
    eventTypes: Array<{ name: string; label: string; autoCreated: boolean }>;
}
"#;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct RuleRow {
    pub id: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    #[serde(default)]
    pub enabled: bool,
    #[serde(default)]
    pub priority: i64,
    #[serde(rename = "created_at")]
    pub created_at: Option<i64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct RuleTriggerRow {
    pub id: Option<String>,
    #[serde(rename = "rule_id")]
    pub rule_id: Option<String>,
    #[serde(rename = "trigger_type", default)]
    pub trigger_type: String,
    #[serde(rename = "trigger_name", default)]
    pub trigger_name: String,
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
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub icon: String,
    #[serde(rename = "order_idx", default)]
    pub order_idx: i64,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EventRow {
    pub id: Option<String>,
    pub content: Option<String>,
    pub subject: Option<String>,
    pub sender: Option<String>,
    pub timestamp: Option<i64>,
    pub status: Option<String>,
    #[serde(rename = "event_type")]
    #[wasm_bindgen(js_name = "event_type")]
    pub event_type: Option<String>,
    #[serde(rename = "event_category")]
    #[wasm_bindgen(js_name = "event_category")]
    pub event_category: Option<String>,
    #[serde(rename = "source_name")]
    #[wasm_bindgen(js_name = "source_name")]
    pub source_name: Option<String>,
    #[serde(rename = "rule_id")]
    #[wasm_bindgen(js_name = "rule_id")]
    pub rule_id: Option<String>,
    #[serde(rename = "actions_taken")]
    #[wasm_bindgen(js_name = "actions_taken")]
    pub actions_taken: Option<String>,
    pub output: Option<String>,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize)]
pub struct RuleTriggerView {
    /// Exposed as `type` in JS (matching original serde rename).
    #[serde(rename = "type")]
    #[wasm_bindgen(js_name = "type")]
    pub trigger_type: String,
    pub name: String,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize)]
pub struct RuleActionView {
    #[serde(default)]
    pub id: String,
    #[serde(rename = "pluginId", default)]
    #[wasm_bindgen(js_name = "pluginId")]
    pub plugin_id: String,
    #[serde(rename = "commandId", default)]
    #[wasm_bindgen(js_name = "commandId")]
    pub command_id: String,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub icon: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct RulePolicyRow {
    #[serde(rename = "rule_id")]
    pub rule_id: Option<String>,
    pub policy: Option<String>,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize)]
pub struct RuleView {
    pub id: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub enabled: bool,
    pub priority: i64,
    #[serde(rename = "created_at")]
    #[wasm_bindgen(js_name = "created_at")]
    pub created_at: Option<i64>,
    pub triggers: Vec<RuleTriggerView>,
    pub actions: Vec<RuleActionView>,
    pub policy: Option<String>,
}

/// Payload from JS for saving a rule.
#[derive(Clone, Debug, Deserialize, Serialize, Tsify)]
#[tsify(from_wasm_abi)]
pub struct RuleSavePayload {
    pub id: String,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub description: String,
    #[serde(default = "default_true")]
    pub enabled: bool,
    #[serde(default = "default_priority")]
    pub priority: i64,
    pub created_at: Option<i64>,
    #[serde(default)]
    pub triggers: Vec<RuleTriggerInput>,
    #[serde(default)]
    pub actions: Vec<RuleActionInput>,
}

fn default_true() -> bool {
    true
}
fn default_priority() -> i64 {
    5
}

#[derive(Clone, Debug, Deserialize, Serialize, Tsify)]
pub struct RuleTriggerInput {
    #[serde(rename = "type", default)]
    pub trigger_type: String,
    #[serde(default)]
    pub name: String,
}

#[derive(Clone, Debug, Deserialize, Serialize, Tsify)]
pub struct RuleActionInput {
    #[serde(default)]
    pub id: String,
    #[serde(rename = "pluginId", default)]
    pub plugin_id: String,
    #[serde(rename = "commandId", default)]
    pub command_id: String,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub icon: String,
}

#[derive(Clone, Debug, Serialize)]
struct RuleDoc {
    id: String,
    name: String,
    description: String,
    enabled: bool,
    priority: i64,
    created_at: Option<i64>,
}

#[derive(Clone, Debug, Serialize)]
struct RuleTriggerDoc {
    id: String,
    #[serde(rename = "rule_id")]
    rule_id: String,
    #[serde(rename = "trigger_type")]
    trigger_type: String,
    #[serde(rename = "trigger_name")]
    trigger_name: String,
}

#[derive(Clone, Debug, Serialize)]
struct RuleCommandDoc {
    id: String,
    #[serde(rename = "rule_id")]
    rule_id: String,
    #[serde(rename = "command_id")]
    command_id: Option<String>,
    #[serde(rename = "plugin_id")]
    plugin_id: Option<String>,
    #[serde(rename = "action_id")]
    action_id: Option<String>,
    name: Option<String>,
    description: Option<String>,
    icon: Option<String>,
    #[serde(rename = "order_idx")]
    order_idx: usize,
}

#[derive(Clone, Debug, Serialize)]
struct EventDoc {
    id: String,
    content: Option<String>,
    subject: Option<String>,
    sender: Option<String>,
    timestamp: i64,
    status: Option<String>,
    #[serde(rename = "event_type")]
    event_type: Option<String>,
    #[serde(rename = "event_category")]
    event_category: Option<String>,
    #[serde(rename = "source_name")]
    source_name: Option<String>,
    #[serde(rename = "rule_id")]
    rule_id: Option<String>,
    #[serde(rename = "actions_taken")]
    actions_taken: Option<String>,
    output: Option<String>,
}

/// Get all rules with triggers and commands.
pub async fn get_rules(db: DbRef<'_>) -> Result<Vec<RuleView>, CoreError> {
    let rules: Vec<RuleRow> = db.store_get_all(store::SM_RULES, None, None).await?;
    let mut out: Vec<RuleView> = Vec::new();
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
            let triggers: Vec<RuleTriggerRow> = db
                .index_get_all(store::SM_RULE_TRIGGERS, "rule_id", Some(range.clone()), None)
                .await?;
            let commands: Vec<RuleCommandRow> =
                db.index_get_all(store::SM_RULE_COMMANDS, "rule_id", Some(range), None).await?;
            (triggers, commands)
        } else {
            (Vec::new(), Vec::new())
        };
        let trigger_views = triggers
            .into_iter()
            .map(|t| RuleTriggerView {
                trigger_type: t.trigger_type,
                name: t.trigger_name,
            })
            .collect();
        let action_views = commands
            .into_iter()
            .map(|c| RuleActionView {
                id: c.command_id.unwrap_or_default(),
                plugin_id: c.plugin_id.unwrap_or_default(),
                command_id: c.action_id.unwrap_or_default(),
                name: c.name,
                description: c.description,
                icon: c.icon,
            })
            .collect();
        let policy = if let Some(id) = id {
            db.store_get::<RulePolicyRow>(store::SM_RULE_POLICIES, id)
                .await?
                .and_then(|row| row.policy)
        } else {
            None
        };
        out.push(RuleView {
            id: r.id,
            name: r.name,
            description: r.description,
            enabled: r.enabled,
            priority: r.priority,
            created_at: r.created_at,
            triggers: trigger_views,
            actions: action_views,
            policy,
        });
    }
    out.sort_by(|a, b| b.priority.cmp(&a.priority));
    Ok(out)
}

/// Get one rule by id.
pub async fn get_rule(db: DbRef<'_>, id: &str) -> Result<Option<RuleView>, CoreError> {
    let r: Option<RuleRow> = db.store_get(store::SM_RULES, id).await?;
    let Some(r) = r else {
        return Ok(None);
    };
    let range = key_range_only(id)?;
    let triggers: Vec<RuleTriggerRow> = db
        .index_get_all(store::SM_RULE_TRIGGERS, "rule_id", Some(range.clone()), None)
        .await?;
    let commands: Vec<RuleCommandRow> =
        db.index_get_all(store::SM_RULE_COMMANDS, "rule_id", Some(range), None).await?;
    let trigger_views = triggers
        .into_iter()
        .map(|t| RuleTriggerView {
            trigger_type: t.trigger_type,
            name: t.trigger_name,
        })
        .collect();
    let action_views = commands
        .into_iter()
        .map(|c| RuleActionView {
            id: c.command_id.unwrap_or_default(),
            plugin_id: c.plugin_id.unwrap_or_default(),
            command_id: c.action_id.unwrap_or_default(),
            name: c.name,
            description: c.description,
            icon: c.icon,
        })
        .collect();
    let policy = db
        .store_get::<RulePolicyRow>(store::SM_RULE_POLICIES, id)
        .await?
        .and_then(|row| row.policy);
    Ok(Some(RuleView {
        id: r.id,
        name: r.name,
        description: r.description,
        enabled: r.enabled,
        priority: r.priority,
        created_at: r.created_at,
        triggers: trigger_views,
        actions: action_views,
        policy,
    }))
}

/// Find enabled rules whose triggers match the given event type and category.
/// Returns rules sorted by priority desc (from `get_rules`).
pub async fn find_matching_rules(
    db: DbRef<'_>,
    event_type: &str,
    event_category: &str,
) -> Result<Vec<RuleView>, CoreError> {
    let all_rules = get_rules(db).await?;
    let matching: Vec<RuleView> = all_rules
        .into_iter()
        .filter(|rule| {
            if !rule.enabled {
                return false;
            }
            let type_triggers: Vec<_> = rule
                .triggers
                .iter()
                .filter(|t| t.trigger_type == "event_type")
                .collect();
            let cat_triggers: Vec<_> = rule
                .triggers
                .iter()
                .filter(|t| t.trigger_type == "event_category")
                .collect();
            let type_match =
                type_triggers.is_empty() || type_triggers.iter().any(|t| t.name == event_type);
            let cat_match =
                cat_triggers.is_empty() || cat_triggers.iter().any(|t| t.name == event_category);
            type_match && cat_match
        })
        .collect();
    Ok(matching)
}

/// Save rule (upsert) with triggers and commands.
pub async fn save_rule(db: DbRef<'_>, payload: RuleSavePayload) -> Result<(), CoreError> {
    let id = payload.id.as_str();

    let rule_doc = RuleDoc {
        id: payload.id.clone(),
        name: payload.name.clone(),
        description: payload.description.clone(),
        enabled: payload.enabled,
        priority: payload.priority,
        created_at: payload.created_at,
    };
    db.store_put(store::SM_RULES, &rule_doc, Some(id)).await?;

    // Delete existing triggers and commands for this rule
    let range = key_range_only(id)?;
    let old_triggers: Vec<RuleTriggerRow> = db
        .index_get_all(store::SM_RULE_TRIGGERS, "rule_id", Some(range.clone()), None)
        .await?;
    for t in old_triggers {
        if let Some(ref tid) = t.id {
            db.store_delete(store::SM_RULE_TRIGGERS, tid).await?;
        }
    }
    let old_commands: Vec<RuleCommandRow> =
        db.index_get_all(store::SM_RULE_COMMANDS, "rule_id", Some(range), None).await?;
    for c in old_commands {
        if let Some(ref cid) = c.id {
            db.store_delete(store::SM_RULE_COMMANDS, cid).await?;
        }
    }

    for t in &payload.triggers {
        let tid = format!("{}|{}|{}", id, t.trigger_type, t.name);
        let doc = RuleTriggerDoc {
            id: tid.clone(),
            rule_id: id.to_string(),
            trigger_type: t.trigger_type.clone(),
            trigger_name: t.name.clone(),
        };
        db.store_put(store::SM_RULE_TRIGGERS, &doc, Some(&tid)).await?;
    }

    for (i, a) in payload.actions.iter().enumerate() {
        let cid = format!("{}|{}", id, i);
        let doc = RuleCommandDoc {
            id: cid.clone(),
            rule_id: id.to_string(),
            command_id: Some(a.id.clone()),
            plugin_id: Some(a.plugin_id.clone()),
            action_id: Some(a.command_id.clone()),
            name: Some(a.name.clone()),
            description: Some(a.description.clone()),
            icon: Some(a.icon.clone()),
            order_idx: i,
        };
        db.store_put(store::SM_RULE_COMMANDS, &doc, Some(&cid)).await?;
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rule_save_payload_deserializes_nested_triggers_and_actions() {
        let json = r#"{
            "id":"rule_1",
            "name":"Test Rule",
            "enabled":false,
            "priority":10,
            "triggers":[{"type":"event_type","name":"REPLY"}],
            "actions":[{"id":"a1","pluginId":"gmail","commandId":"mark_read"}]
        }"#;
        let payload: RuleSavePayload = serde_json::from_str(json).unwrap();
        assert_eq!(payload.id, "rule_1");
        assert!(!payload.enabled);
        assert_eq!(payload.triggers[0].trigger_type, "event_type");
        assert_eq!(payload.actions[0].plugin_id, "gmail");
    }
}

/// Payload for creating a new rule (ID is generated server-side).
#[derive(Clone, Debug, Deserialize, Tsify)]
#[tsify(from_wasm_abi)]
pub struct CreateRulePayload {
    pub name: String,
    pub description: Option<String>,
    pub enabled: Option<bool>,
    pub priority: Option<i64>,
    pub triggers: Option<Vec<RuleTriggerInput>>,
    pub actions: Option<Vec<RuleActionInput>>,
}

/// Partial update fields for an existing rule.
#[derive(Clone, Debug, Deserialize, Tsify)]
#[tsify(from_wasm_abi)]
pub struct RuleUpdateInput {
    pub name: Option<String>,
    pub description: Option<String>,
    pub enabled: Option<bool>,
    pub priority: Option<i64>,
    pub triggers: Option<Vec<RuleTriggerInput>>,
    pub actions: Option<Vec<RuleActionInput>>,
}

/// Create a new rule with a generated ID. Returns the generated ID.
pub async fn create_rule(db: DbRef<'_>, payload: CreateRulePayload) -> Result<String, CoreError> {
    let now = js_sys::Date::now() as i64;
    let rand = js_sys::Math::random().to_string();
    let rand_part = rand.trim_start_matches("0.").chars().take(5).collect::<String>();
    let id = format!("rule_{}_{}", now, rand_part);
    let save = RuleSavePayload {
        id: id.clone(),
        name: payload.name,
        description: payload.description.unwrap_or_default(),
        enabled: payload.enabled.unwrap_or(true),
        priority: payload.priority.unwrap_or(5),
        created_at: Some(now),
        triggers: payload.triggers.unwrap_or_default(),
        actions: payload.actions.unwrap_or_default(),
    };
    save_rule(db, save).await?;
    Ok(id)
}

/// Update an existing rule by merging optional fields onto the current state.
pub async fn update_rule(db: DbRef<'_>, id: &str, updates: RuleUpdateInput) -> Result<(), CoreError> {
    let Some(existing) = get_rule(db, id).await? else {
        return Ok(());
    };
    let payload = RuleSavePayload {
        id: id.to_string(),
        name: updates.name.unwrap_or_else(|| existing.name.unwrap_or_default()),
        description: updates.description.unwrap_or_else(|| existing.description.unwrap_or_default()),
        enabled: updates.enabled.unwrap_or(existing.enabled),
        priority: updates.priority.unwrap_or(existing.priority),
        created_at: existing.created_at,
        triggers: updates.triggers.unwrap_or_else(|| {
            existing.triggers.into_iter().map(|t| RuleTriggerInput {
                trigger_type: t.trigger_type,
                name: t.name,
            }).collect()
        }),
        actions: updates.actions.unwrap_or_else(|| {
            existing.actions.into_iter().map(|a| RuleActionInput {
                id: a.id,
                plugin_id: a.plugin_id,
                command_id: a.command_id,
                name: a.name,
                description: a.description,
                icon: a.icon,
            }).collect()
        }),
    };
    save_rule(db, payload).await
}

/// Toggle the enabled flag on a rule, preserving all other fields.
pub async fn set_rule_enabled(db: DbRef<'_>, id: &str, enabled: bool) -> Result<(), CoreError> {
    let Some(existing) = get_rule(db, id).await? else {
        return Ok(());
    };
    let payload = RuleSavePayload {
        id: id.to_string(),
        name: existing.name.unwrap_or_default(),
        description: existing.description.unwrap_or_default(),
        enabled,
        priority: existing.priority,
        created_at: existing.created_at,
        triggers: existing.triggers.into_iter().map(|t| RuleTriggerInput {
            trigger_type: t.trigger_type,
            name: t.name,
        }).collect(),
        actions: existing.actions.into_iter().map(|a| RuleActionInput {
            id: a.id,
            plugin_id: a.plugin_id,
            command_id: a.command_id,
            name: a.name,
            description: a.description,
            icon: a.icon,
        }).collect(),
    };
    save_rule(db, payload).await
}

/// Delete rule and its triggers and commands.
pub async fn delete_rule(db: DbRef<'_>, id: &str) -> Result<(), CoreError> {
    let range = key_range_only(id)?;
    let triggers: Vec<RuleTriggerRow> = db
        .index_get_all(store::SM_RULE_TRIGGERS, "rule_id", Some(range.clone()), None)
        .await?;
    for t in triggers {
        if let Some(tid) = t.id {
            db.store_delete(store::SM_RULE_TRIGGERS, &tid).await?;
        }
    }
    let commands: Vec<RuleCommandRow> =
        db.index_get_all(store::SM_RULE_COMMANDS, "rule_id", Some(range), None).await?;
    for c in commands {
        if let Some(cid) = c.id {
            db.store_delete(store::SM_RULE_COMMANDS, &cid).await?;
        }
    }
    db.store_delete(store::SM_RULES, id).await?;
    db.store_delete(store::SM_RULE_POLICIES, id).await?;
    Ok(())
}

/// Get events (paginated). Sorted by timestamp desc.
pub async fn get_events(db: DbRef<'_>, limit: u32, offset: u32) -> Result<Vec<EventRow>, CoreError> {
    let mut all: Vec<EventRow> = db.store_get_all(store::SM_EVENTS, None, Some(limit + offset)).await?;
    all.sort_by(|a, b| b.timestamp.unwrap_or(0).cmp(&a.timestamp.unwrap_or(0)));
    let skip = offset as usize;
    if skip >= all.len() {
        return Ok(vec![]);
    }
    let end = (skip + limit as usize).min(all.len());
    Ok(all[skip..end].to_vec())
}

/// Update event status.
pub async fn update_event_status(db: DbRef<'_>, id: &str, status: &str) -> Result<(), CoreError> {
    if let Some(mut row) = db.store_get::<EventRow>(store::SM_EVENTS, id).await? {
        row.status = Some(status.to_string());
        db.store_put(store::SM_EVENTS, &row, Some(id)).await?;
    }
    Ok(())
}

/// Clear all events.
pub async fn clear_events(db: DbRef<'_>) -> Result<(), CoreError> {
    db.store_clear(store::SM_EVENTS).await
}

/// Insert one event.
#[allow(clippy::too_many_arguments)]
pub async fn insert_event(
    db: DbRef<'_>,
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
    let doc = EventDoc {
        id: id.to_string(),
        content: content.map(|v| v.to_string()),
        subject: subject.map(|v| v.to_string()),
        sender: sender.map(|v| v.to_string()),
        timestamp,
        status: status.map(|v| v.to_string()),
        event_type: event_type.map(|v| v.to_string()),
        event_category: event_category.map(|v| v.to_string()),
        source_name: source_name.map(|v| v.to_string()),
        rule_id: rule_id.map(|v| v.to_string()),
        actions_taken: actions_taken.map(|v| v.to_string()),
        output: output.map(|v| v.to_string()),
    };
    db.store_put(store::SM_EVENTS, &doc, Some(id)).await
}
