//! Pipeline resolution: given an event type, resolve which pipeline actions and
//! policy apply (type-specific override or category fallback).

use js_sys::Function;
use serde::{Deserialize, Serialize};
use tsify_next::Tsify;
use wasm_bindgen::prelude::*;

use crate::db::RexieDb;
use crate::error::CoreError;
use crate::plugins::pipeline::{emit_progress, execute_pipeline};
use crate::plugins::types::{ActionInput, ActionResult, EventInput, PipelineResult};
use crate::storage;


#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct PipelineForEventResult {
    pub actions: Vec<PipelineActionForEvent>,
    pub policy: String,
    pub category: String,
    pub is_override: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct PipelineActionForEvent {
    pub plugin_id: String,
    pub command_id: String,
    pub order: i64,
}

/// UI `Action` row built from a resolved pipeline (replaces TS `getActionsForEvent` mapping).
#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct PipelineActionDisplay {
    pub id: String,
    #[wasm_bindgen(js_name = pluginId)]
    pub plugin_id: String,
    #[wasm_bindgen(js_name = commandId)]
    pub command_id: String,
    pub name: String,
    pub description: String,
}

pub fn pipeline_actions_to_display(actions: &[PipelineActionForEvent]) -> Vec<PipelineActionDisplay> {
    actions
        .iter()
        .enumerate()
        .map(|(i, a)| {
            let cmd = a.command_id.as_str();
            let base = if cmd.is_empty() { "cmd" } else { cmd };
            PipelineActionDisplay {
                id: format!("{base}_{i}"),
                plugin_id: a.plugin_id.clone(),
                command_id: a.command_id.clone(),
                name: cmd.replace('_', " "),
                description: String::new(),
            }
        })
        .collect()
}

/// Resolve the pipeline (actions + policy) for a given event type.
///
/// 1. Normalize the event type name (uppercase, spaces to underscores, ASCII alphanumeric + `_`).
/// 2. Look up type-specific pipeline actions; if present, use them (is_override = true).
/// 3. Otherwise fall back to the category's default pipeline (is_override = false).
/// 4. Category comes from the event type's `category_name`; defaults to `"critical"`.
/// 5. Policy comes from the category row; defaults to `"manual"`.
pub async fn get_pipeline_for_event(
    db: &RexieDb,
    event_type: &str,
) -> Result<Option<PipelineForEventResult>, CoreError> {
    // 1. Normalize
    let normalized: String = event_type
        .to_uppercase()
        .replace(' ', "_")
        .chars()
        .filter(|c| c.is_ascii_alphanumeric() || *c == '_')
        .collect();
    if normalized.is_empty() {
        return Ok(None);
    }

    // 2. Type-specific pipeline actions
    let type_actions = storage::pipelines::get_type_pipeline_actions(db, &normalized).await?;

    // 3. Category for this event type
    let category = storage::pipelines::get_event_type_category(db, &normalized)
        .await?
        .unwrap_or_else(|| "critical".to_string());

    // 4. Policy for the category
    let policy = storage::pipelines::get_event_category_policy(db, &category)
        .await?
        .unwrap_or_else(|| "manual".to_string());

    // 5. If type-specific actions exist, use them
    if !type_actions.is_empty() {
        let actions = type_actions
            .iter()
            .map(|a| PipelineActionForEvent {
                plugin_id: a.plugin_id.clone(),
                command_id: a.command_id.clone(),
                order: a.action_idx,
            })
            .collect();
        return Ok(Some(PipelineForEventResult {
            actions,
            policy,
            category,
            is_override: true,
        }));
    }

    // 6. Fall back to category pipeline
    let cat_actions = storage::pipelines::get_category_pipeline_actions(db, &category).await?;
    if cat_actions.is_empty() {
        return Ok(None);
    }
    let actions = cat_actions
        .iter()
        .map(|a| PipelineActionForEvent {
            plugin_id: a.plugin_id.clone(),
            command_id: a.command_id.clone(),
            order: a.action_idx,
        })
        .collect();
    Ok(Some(PipelineForEventResult {
        actions,
        policy,
        category,
        is_override: false,
    }))
}

// ---------------------------------------------------------------------------
// resolve_and_execute_pipeline — Phase 3
// ---------------------------------------------------------------------------

/// Input for an action override from the caller (e.g. `options.actionsOverride` in TS).
#[derive(Clone, Debug, Deserialize, Serialize, Tsify)]
#[tsify(from_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct ActionOverrideInput {
    #[serde(default)]
    pub plugin_id: String,
    #[serde(default)]
    pub command_id: String,
}

/// Normalised action representation included in the result.
#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct NormalisedAction {
    pub id: String,
    pub plugin_id: String,
    pub command_id: String,
    pub name: String,
}

/// Result of [`resolve_and_execute_pipeline`].
#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct ResolveExecuteResult {
    pub success: bool,
    pub message: String,
    #[serde(skip_serializing_if = "Vec::is_empty", default)]
    pub results: Vec<ActionResultSerializable>,
    pub requires_approval: bool,
    pub category: String,
    pub actions: Vec<NormalisedAction>,
    pub filesystem_actions: Vec<NormalisedAction>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rule_name: Option<String>,
}

/// Type alias — `ActionResult` is now fully serializable; this alias preserves
/// internal usage names without renaming all call sites.
pub(crate) type ActionResultSerializable = ActionResult;

/// Map a policy string to (category, requires_approval).
fn resolve_policy(policy: &str) -> (String, bool) {
    match policy {
        "manual" => ("CRITICAL".to_string(), true),
        "auto" => ("NOISE".to_string(), false),
        _ => ("INFO".to_string(), false),
    }
}

struct AuditFields<'a> {
    email_id: &'a str,
    subject: &'a str,
    from: &'a str,
}

fn extract_audit_fields(event: &EventInput) -> AuditFields<'_> {
    let email_id = event.data.get("emailId").or_else(|| event.data.get("id"))
        .and_then(|v| v.as_str()).unwrap_or("");
    let subject = event.data.get("subject").and_then(|v| v.as_str()).unwrap_or("");
    let from = event.data.get("from").and_then(|v| v.as_str()).unwrap_or("");
    AuditFields { email_id, subject, from }
}

fn split_actions(actions: &[NormalisedAction]) -> (Vec<NormalisedAction>, Vec<NormalisedAction>) {
    let core = actions.iter().filter(|a| a.plugin_id != "filesystem").cloned().collect();
    let filesystem = actions.iter().filter(|a| a.plugin_id == "filesystem").cloned().collect();
    (core, filesystem)
}

fn normalise_override(idx: usize, ov: &ActionOverrideInput) -> NormalisedAction {
    let cmd = ov.command_id.clone();
    NormalisedAction {
        id: format!("{}_{}", cmd, idx),
        plugin_id: if ov.plugin_id.is_empty() { "gmail".to_string() } else { ov.plugin_id.clone() },
        command_id: cmd.clone(),
        name: cmd.replace('_', " "),
    }
}

fn normalise_rule_action(a: &crate::storage::rules::RuleActionView) -> NormalisedAction {
    let cmd = a.command_id.clone();
    NormalisedAction {
        id: a.id.clone(),
        plugin_id: a.plugin_id.clone(),
        command_id: cmd.clone(),
        name: if a.name.is_empty() { cmd.replace('_', " ") } else { a.name.clone() },
    }
}

fn normalise_pipeline_action(a: &PipelineActionForEvent) -> NormalisedAction {
    NormalisedAction {
        id: format!("{}_{}", a.command_id, a.order),
        plugin_id: a.plugin_id.clone(),
        command_id: a.command_id.clone(),
        name: a.command_id.replace('_', " "),
    }
}

fn to_action_input(n: &NormalisedAction) -> ActionInput {
    ActionInput {
        id: n.id.clone(),
        plugin_id: n.plugin_id.clone(),
        command_id: n.command_id.clone(),
        name: n.name.clone(),
    }
}

fn empty_result(
    message: &str,
    category: &str,
    requires_approval: bool,
    actions: Vec<NormalisedAction>,
    rule_name: Option<String>,
) -> ResolveExecuteResult {
    ResolveExecuteResult {
        success: true,
        message: message.to_string(),
        results: Vec::new(),
        requires_approval,
        category: category.to_string(),
        actions,
        filesystem_actions: Vec::new(),
        rule_name,
    }
}

/// Resolve which pipeline actions apply for an event, optionally execute them,
/// and log the result to the audit store.
///
/// Ports `execution-service.ts:134-259` into Rust.
pub async fn resolve_and_execute_pipeline(
    db: &RexieDb,
    event: EventInput,
    approved: bool,
    actions_override: Option<Vec<ActionOverrideInput>>,
    on_progress: Option<Function>,
) -> Result<ResolveExecuteResult, CoreError> {
    let mut actions: Vec<NormalisedAction> = Vec::new();
    let mut category = String::new();
    let mut requires_approval = false;
    let mut rule_name: Option<String> = None;

    // ------------------------------------------------------------------
    // 1. If caller provided explicit action overrides, use them directly
    // ------------------------------------------------------------------
    if let Some(ref overrides) = actions_override {
        if !overrides.is_empty() {
            actions = overrides
                .iter()
                .enumerate()
                .map(|(i, o)| normalise_override(i, o))
                .collect();
            category = "CRITICAL".to_string();
            requires_approval = true;
        }
    }

    // ------------------------------------------------------------------
    // 2. Otherwise resolve from rules
    // ------------------------------------------------------------------
    if actions.is_empty() {
        let category_str = event
            .data
            .get("category")
            .or_else(|| event.metadata.as_ref().and_then(|m| m.get("category")))
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string();

        let rules = storage::rules::find_matching_rules(db, &event.event_type, &category_str).await?;

        if let Some(rule) = rules.first() {
            let policy = rule.policy.clone().unwrap_or_default();
            let (cat, approval) = resolve_policy(&policy);
            category = cat;
            requires_approval = approval;
            actions = rule.actions.iter().map(normalise_rule_action).collect();
            rule_name = rule.name.clone();
        }
    }

    // ------------------------------------------------------------------
    // 3. If still no actions, fallback to pipeline
    // ------------------------------------------------------------------
    if actions.is_empty() {
        if let Some(pipeline) = get_pipeline_for_event(db, &event.event_type).await? {
            if !pipeline.actions.is_empty() {
                let (cat, approval) = resolve_policy(&pipeline.policy);
                category = cat;
                requires_approval = approval;
                actions = pipeline.actions.iter().map(normalise_pipeline_action).collect();
            }
        }
    }

    // ------------------------------------------------------------------
    // 4. No actions at all
    // ------------------------------------------------------------------
    if actions.is_empty() {
        return Ok(empty_result(
            "No actions/pipeline for event type",
            &category,
            false,
            Vec::new(),
            rule_name,
        ));
    }

    // ------------------------------------------------------------------
    // 5. Approval gate
    // ------------------------------------------------------------------
    if requires_approval && !approved {
        return Ok(empty_result(
            "Requires approval",
            &category,
            true,
            actions,
            rule_name,
        ));
    }

    // ------------------------------------------------------------------
    // 6. Split: core vs filesystem
    // ------------------------------------------------------------------
    let (core_actions, filesystem_actions) = split_actions(&actions);

    // ------------------------------------------------------------------
    // 7. Fetch access token from DB if core actions need it
    // ------------------------------------------------------------------
    let access_token = if !core_actions.is_empty() {
        match storage::settings::get_google_token(db).await? {
            Some(t) => t.access_token(),
            None => {
                return Err(CoreError::Auth(
                    "Not authenticated. Please sign in to Gmail first.".to_string(),
                ))
            }
        }
    } else {
        String::new()
    };

    // ------------------------------------------------------------------
    // 8. Execute core actions
    // ------------------------------------------------------------------
    let action_inputs: Vec<ActionInput> = core_actions.iter().map(to_action_input).collect();
    let pipeline_result: PipelineResult = execute_pipeline(
        action_inputs.clone(),
        event.clone(),
        access_token,
        on_progress,
        None,
    )
    .await?;

    // ------------------------------------------------------------------
    // 8. Audit logging
    // ------------------------------------------------------------------
    let audit = extract_audit_fields(&event);

    storage::audit::log_and_sync_execution(
        db,
        audit.email_id,
        audit.subject,
        audit.from,
        &event.event_type,
        &action_inputs,
        &pipeline_result.results,
        pipeline_result.success,
    )
    .await?;

    // ------------------------------------------------------------------
    // 9. Build result
    // ------------------------------------------------------------------
    let serializable_results: Vec<ActionResultSerializable> =
        pipeline_result.results.to_vec();

    Ok(ResolveExecuteResult {
        success: pipeline_result.success,
        message: pipeline_result.message,
        results: serializable_results,
        requires_approval: false,
        category,
        actions,
        filesystem_actions,
        rule_name,
    })
}

// ---------------------------------------------------------------------------
// resolve_and_execute_batch — Phase 4
// ---------------------------------------------------------------------------

/// Result of [`resolve_and_execute_batch`].
#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct ResolveBatchResult {
    pub success: bool,
    pub message: String,
    pub results: Vec<BatchEventResult>,
    pub requires_approval: bool,
    pub category: String,
    pub actions: Vec<NormalisedAction>,
    pub filesystem_actions: Vec<NormalisedAction>,
    pub total: usize,
    pub successful: usize,
    pub failed: usize,
}

/// Per-event result within a batch execution.
#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct BatchEventResult {
    pub event: Option<serde_json::Value>,
    pub results: Vec<ActionResultSerializable>,
    pub success: bool,
    pub message: String,
}

/// Resolve pipeline actions for an event type and execute them over a batch of events.
///
/// Ports `execution-service.ts:261-435` into Rust.
pub async fn resolve_and_execute_batch(
    db: &RexieDb,
    event_type: &str,
    events: Vec<EventInput>,
    approved: bool,
    on_progress: Option<Function>,
) -> Result<ResolveBatchResult, CoreError> {
    let event_count = events.len();

    // 1. Emit starting progress
    emit_progress(
        &on_progress,
        &serde_json::json!({
            "phase": "starting",
            "eventType": event_type,
            "eventCount": event_count,
        }),
    );

    // 2. Extract category from first event
    let category_str = events
        .first()
        .and_then(|ev| {
            ev.metadata.as_ref()
                .and_then(|m| m.get("category"))
                .or_else(|| ev.data.get("category"))
                .and_then(|v| v.as_str())
        })
        .unwrap_or("")
        .to_string();

    // 3. Find matching rules
    let rules = storage::rules::find_matching_rules(db, event_type, &category_str).await?;

    // 4. Use first rule to determine category/policy/actions
    let rule = match rules.first() {
        Some(r) => r,
        None => {
            return Ok(ResolveBatchResult {
                success: true,
                message: format!(
                    "No enabled pipeline rule matches event type \"{}\" / category \"{}\"",
                    event_type, category_str
                ),
                results: Vec::new(),
                requires_approval: false,
                category: category_str,
                actions: Vec::new(),
                filesystem_actions: Vec::new(),
                total: event_count,
                successful: 0,
                failed: 0,
            });
        }
    };

    let policy = rule.policy.clone().unwrap_or_default();
    let (category, requires_approval) = resolve_policy(&policy);

    let actions: Vec<NormalisedAction> = rule.actions.iter().map(normalise_rule_action).collect();

    // 5. Approval gate
    if requires_approval && !approved {
        return Ok(ResolveBatchResult {
            success: true,
            message: "Requires approval".to_string(),
            results: Vec::new(),
            requires_approval: true,
            category,
            actions,
            filesystem_actions: Vec::new(),
            total: event_count,
            successful: 0,
            failed: 0,
        });
    }

    // 6. No actions on rule
    if actions.is_empty() {
        return Ok(ResolveBatchResult {
            success: true,
            message: format!(
                "No actions defined for rule \"{}\"",
                rule.name.as_deref().unwrap_or("(unnamed)")
            ),
            results: Vec::new(),
            requires_approval: false,
            category,
            actions: Vec::new(),
            filesystem_actions: Vec::new(),
            total: event_count,
            successful: 0,
            failed: 0,
        });
    }

    // 7. Split: core vs filesystem
    let (core_actions, filesystem_actions) = split_actions(&actions);

    // 8. Fetch access token from DB if core actions need it
    let access_token = if !core_actions.is_empty() {
        match storage::settings::get_google_token(db).await? {
            Some(t) => t.access_token(),
            None => {
                return Err(CoreError::Auth(
                    "Not authenticated. Please sign in to Gmail first.".to_string(),
                ))
            }
        }
    } else {
        String::new()
    };

    let core_action_inputs: Vec<ActionInput> = core_actions.iter().map(to_action_input).collect();

    // 9. Emit pipeline_loaded progress
    emit_progress(
        &on_progress,
        &serde_json::json!({
            "phase": "pipeline_loaded",
            "actions": actions,
            "actionCount": actions.len(),
        }),
    );

    // 10. Loop over events
    let mut batch_results: Vec<BatchEventResult> = Vec::with_capacity(event_count);

    for (i, event_input) in events.iter().enumerate() {
        emit_progress(
            &on_progress,
            &serde_json::json!({
                "phase": "batch_event",
                "eventIndex": i,
                "totalEvents": event_count,
                "event": event_input.data,
            }),
        );

        let pipeline_result: PipelineResult = execute_pipeline(
            core_action_inputs.clone(),
            event_input.clone(),
            access_token.clone(),
            on_progress.clone(),
            None,
        )
        .await?;

        // 11. Audit logging for each event
        let audit = extract_audit_fields(event_input);

        storage::audit::log_and_sync_execution(
            db,
            audit.email_id,
            audit.subject,
            audit.from,
            event_type,
            &core_action_inputs,
            &pipeline_result.results,
            pipeline_result.success,
        )
        .await?;

        let serializable_results: Vec<ActionResultSerializable> =
            pipeline_result.results.to_vec();

        batch_results.push(BatchEventResult {
            event: Some(event_input.data.clone()),
            results: serializable_results,
            success: pipeline_result.success,
            message: pipeline_result.message,
        });
    }

    let successful = batch_results.iter().filter(|r| r.success).count();
    let failed = batch_results.len() - successful;

    let result = ResolveBatchResult {
        success: failed == 0,
        message: format!(
            "Processed {} event(s): {} successful, {} failed",
            event_count, successful, failed
        ),
        results: batch_results,
        requires_approval: false,
        category,
        actions,
        filesystem_actions,
        total: event_count,
        successful,
        failed,
    };

    // 12. Emit done progress
    emit_progress(
        &on_progress,
        &serde_json::json!({
            "phase": "done",
            "total": result.total,
            "successful": result.successful,
            "failed": result.failed,
        }),
    );

    Ok(result)
}
