use serde::Serialize;
use wasm_bindgen::JsValue;
use js_sys::Function;

use crate::error::CoreError;
use super::{
    gmail::execute_gmail_action,
    twitter::execute_twitter_action,
    types::{
        ActionInput, ActionResult, EventInput, PipelineBatchResult, PipelineBatchResultEntry,
        PipelineResult, PluginResult,
    },
    PluginId,
};

/// Serializable summary of a pipeline result (for progress events only).
#[derive(Clone, Debug, Serialize)]
struct PipelineResultSummary {
    pub success: bool,
    pub message: String,
}

#[derive(Clone, Debug, Serialize)]
#[serde(tag = "phase", rename_all = "snake_case")]
enum ProgressEvent {
    Executing {
        #[serde(rename = "actionId")]
        action_id: String,
        #[serde(rename = "actionName")]
        action_name: String,
    },
    Completed {
        #[serde(rename = "actionId")]
        action_id: String,
        #[serde(rename = "actionName")]
        action_name: String,
        result: PluginResult,
    },
    Failed {
        #[serde(rename = "actionId")]
        action_id: String,
        #[serde(rename = "actionName")]
        action_name: String,
        error: String,
    },
    ActionStart {
        #[serde(rename = "actionId")]
        action_id: String,
        #[serde(rename = "actionName")]
        action_name: String,
        #[serde(rename = "pluginId")]
        plugin_id: String,
        #[serde(rename = "commandId")]
        command_id: String,
    },
    ActionComplete {
        #[serde(rename = "actionId")]
        action_id: String,
        #[serde(rename = "actionName")]
        action_name: String,
        result: PluginResult,
    },
    BatchEventStart {
        #[serde(rename = "eventIndex")]
        event_index: usize,
        #[serde(rename = "totalEvents")]
        total_events: usize,
        event: EventInput,
    },
    BatchEventComplete {
        #[serde(rename = "eventIndex")]
        event_index: usize,
        #[serde(rename = "totalEvents")]
        total_events: usize,
        event: EventInput,
        result: PipelineResultSummary,
    },
}

#[derive(Clone)]
struct PluginContext {
    access_token: String,
    event: EventInput,
    config: Option<serde_json::Value>,
    on_progress: Option<Function>,
}

pub(crate) fn emit_progress<T: Serialize>(cb: &Option<Function>, payload: &T) {
    if let Some(f) = cb {
        if let Ok(js_val) = serde_wasm_bindgen::to_value(payload) {
            let _ = f.call1(&JsValue::NULL, &js_val);
        }
    }
}

fn resolve_action_plugin(action: &ActionInput, event: &EventInput) -> PluginId {
    if action.plugin_id.is_empty() {
        PluginId::from_source(&event.source)
    } else {
        PluginId::from_source(&action.plugin_id)
    }
}

async fn execute_action(action: &ActionInput, ctx: &PluginContext) -> PluginResult {
    let plugin = resolve_action_plugin(action, &ctx.event);
    let mut command_id = if !action.command_id.is_empty() {
        action.command_id.clone()
    } else if !action.id.is_empty() {
        action.id.clone()
    } else {
        String::new()
    };

    let plugin_id = plugin.as_str();
    if !plugin_id.is_empty() {
        let prefix = format!("{plugin_id}:");
        if command_id.starts_with(&prefix) {
            command_id = command_id[prefix.len()..].to_string();
        }
    }

    emit_progress(
        &ctx.on_progress,
        &ProgressEvent::Executing {
            action_id: action.id.clone(),
            action_name: action.name.clone(),
        },
    );

    let result = match plugin {
        PluginId::Gmail => {
            execute_gmail_action(&command_id, &ctx.event, &ctx.access_token, ctx.config.as_ref())
                .await
        }
        PluginId::Twitter => {
            execute_twitter_action(&command_id, &ctx.event, &ctx.access_token, ctx.config.as_ref())
                .await
        }
        PluginId::Filesystem => {
            PluginResult::err("Filesystem plugin executes in web layer; pipeline should be split before calling core.".to_string())
        }
        PluginId::Other(id) => {
            PluginResult::err(format!("Plugin \"{id}\" not found. Is it registered?"))
        }
    };

    if result.success {
        emit_progress(
            &ctx.on_progress,
            &ProgressEvent::Completed {
                action_id: action.id.clone(),
                action_name: action.name.clone(),
                result: result.clone(),
            },
        );
    } else {
        emit_progress(
            &ctx.on_progress,
            &ProgressEvent::Failed {
                action_id: action.id.clone(),
                action_name: action.name.clone(),
                error: result.message.clone(),
            },
        );
    }

    result
}

pub async fn execute_pipeline(
    actions: Vec<ActionInput>,
    event: EventInput,
    access_token: String,
    on_progress: Option<Function>,
    config: Option<serde_json::Value>,
) -> Result<PipelineResult, CoreError> {
    let ctx = PluginContext {
        access_token,
        event,
        config,
        on_progress: on_progress.clone(),
    };

    let mut results: Vec<ActionResult> = Vec::with_capacity(actions.len());
    let mut all_success = true;

    for action in actions.iter() {
        emit_progress(
            &on_progress,
            &ProgressEvent::ActionStart {
                action_id: action.id.clone(),
                action_name: action.name.clone(),
                plugin_id: action.plugin_id.clone(),
                command_id: action.command_id.clone(),
            },
        );

        let result = execute_action(action, &ctx).await;
        if !result.success {
            all_success = false;
        }

        let resolved_plugin_id = resolve_action_plugin(action, &ctx.event)
            .as_str()
            .to_string();

        emit_progress(
            &on_progress,
            &ProgressEvent::ActionComplete {
                action_id: action.id.clone(),
                action_name: action.name.clone(),
                result: result.clone(),
            },
        );

        let action_result = ActionResult::from_plugin_result(
            action.id.clone(),
            action.name.clone(),
            resolved_plugin_id,
            action.command_id.clone(),
            result,
        );
        results.push(action_result);
    }

    let failed_results: Vec<&ActionResult> = results.iter().filter(|r| !r.success).collect();
    let failure_messages = failed_results
        .iter()
        .map(|r| {
                format!("{}·{}: {}", r.plugin_id, r.command_id, r.message)
        })
        .collect::<Vec<String>>()
        .join("; ");
    let success_messages = results
        .iter()
        .filter(|r| r.success)
        .map(|r| {
            format!("{}·{}", r.plugin_id, r.command_id)
        })
        .collect::<Vec<String>>()
        .join(", ");

    let message = if all_success {
        format!("Successfully executed: {success_messages}")
    } else {
        format!("Pipeline failed: {failure_messages}")
    };

    Ok(PipelineResult {
        success: all_success,
        results,
        message,
    })
}

pub async fn execute_pipeline_batch(
    actions: Vec<ActionInput>,
    events: Vec<EventInput>,
    access_token: String,
    on_progress: Option<Function>,
    config: Option<serde_json::Value>,
) -> Result<PipelineBatchResult, CoreError> {
    let mut results: Vec<PipelineBatchResultEntry> = Vec::with_capacity(events.len());

    for (i, event) in events.iter().enumerate() {
        emit_progress(
            &on_progress,
            &ProgressEvent::BatchEventStart {
                event_index: i,
                total_events: events.len(),
                event: event.clone(),
            },
        );

        let result = execute_pipeline(
            actions.clone(),
            event.clone(),
            access_token.clone(),
            on_progress.clone(),
            config.clone(),
        )
        .await?;

        emit_progress(
            &on_progress,
            &ProgressEvent::BatchEventComplete {
                event_index: i,
                total_events: events.len(),
                event: event.clone(),
                result: PipelineResultSummary {
                    success: result.success,
                    message: result.message.clone(),
                },
            },
        );

        let entry = PipelineBatchResultEntry::new(event, result.success, result.results, result.message);
        results.push(entry);
    }

    let successful = results.iter().filter(|r| r.success).count();
    let failed = results.len() - successful;

    Ok(PipelineBatchResult {
        success: failed == 0,
        total: results.len(),
        successful,
        failed,
        message: format!(
            "Processed {} event(s): {} successful, {} failed",
            results.len(),
            successful,
            failed
        ),
        results,
    })
}
