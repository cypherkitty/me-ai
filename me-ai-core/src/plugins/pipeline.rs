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

#[derive(Clone, Debug, Serialize)]
#[serde(tag = "phase", rename_all = "snake_case")]
enum ProgressEvent {
    Executing {
        #[serde(rename = "actionId")]
        action_id: Option<String>,
        #[serde(rename = "actionName")]
        action_name: Option<String>,
    },
    Completed {
        #[serde(rename = "actionId")]
        action_id: Option<String>,
        #[serde(rename = "actionName")]
        action_name: Option<String>,
        result: PluginResult,
    },
    Failed {
        #[serde(rename = "actionId")]
        action_id: Option<String>,
        #[serde(rename = "actionName")]
        action_name: Option<String>,
        error: String,
    },
    ActionStart {
        #[serde(rename = "actionId")]
        action_id: Option<String>,
        #[serde(rename = "actionName")]
        action_name: Option<String>,
        #[serde(rename = "pluginId")]
        plugin_id: Option<String>,
        #[serde(rename = "commandId")]
        command_id: Option<String>,
    },
    ActionComplete {
        #[serde(rename = "actionId")]
        action_id: Option<String>,
        #[serde(rename = "actionName")]
        action_name: Option<String>,
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
        result: PipelineResult,
    },
}

#[derive(Clone)]
struct PluginContext {
    access_token: String,
    event: EventInput,
    config: Option<serde_json::Value>,
    on_progress: Option<Function>,
}

fn emit_progress<T: Serialize>(cb: &Option<Function>, payload: &T) {
    if let Some(f) = cb {
        if let Ok(js_val) = serde_wasm_bindgen::to_value(payload) {
            let _ = f.call1(&JsValue::NULL, &js_val);
        }
    }
}

fn resolve_action_plugin(action: &ActionInput, event: &EventInput) -> PluginId {
    match action.plugin_id.as_deref() {
        Some(id) => PluginId::from_source(id),
        None => PluginId::from_source(&event.source),
    }
}

async fn execute_action(action: &ActionInput, ctx: &PluginContext) -> PluginResult {
    let plugin = resolve_action_plugin(action, &ctx.event);
    let mut command_id = action
        .command_id
        .clone()
        .or_else(|| action.id.clone())
        .unwrap_or_default();

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
                error: result
                    .message
                    .clone()
                    .unwrap_or_else(|| "Unknown error".to_string()),
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
        let action_result = ActionResult {
            action_id: action.id.clone(),
            action_name: action.name.clone(),
            plugin_id: Some(resolved_plugin_id),
            command_id: action.command_id.clone(),
            success: result.success,
            message: result.message.clone(),
            data: result.data.clone(),
        };
        results.push(action_result.clone());

        emit_progress(
            &on_progress,
            &ProgressEvent::ActionComplete {
                action_id: action.id.clone(),
                action_name: action.name.clone(),
                result,
            },
        );
    }

    let failed_results: Vec<&ActionResult> = results.iter().filter(|r| !r.success).collect();
    let failure_messages = failed_results
        .iter()
        .map(|r| {
            let plugin_id = r.plugin_id.clone().unwrap_or_else(|| "undefined".to_string());
            let command_id = r.command_id.clone().unwrap_or_else(|| "undefined".to_string());
            let msg = r
                .message
                .clone()
                .unwrap_or_else(|| "Unknown error".to_string());
            format!("{plugin_id}·{command_id}: {msg}")
        })
        .collect::<Vec<String>>()
        .join("; ");
    let success_messages = results
        .iter()
        .filter(|r| r.success)
        .map(|r| {
            let plugin_id = r.plugin_id.clone().unwrap_or_else(|| "undefined".to_string());
            let command_id = r.command_id.clone().unwrap_or_else(|| "undefined".to_string());
            format!("{plugin_id}·{command_id}")
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

        let entry = PipelineBatchResultEntry {
            event: event.clone(),
            success: result.success,
            results: result.results.clone(),
            message: result.message.clone(),
        };
        results.push(entry.clone());

        emit_progress(
            &on_progress,
            &ProgressEvent::BatchEventComplete {
                event_index: i,
                total_events: events.len(),
                event: event.clone(),
                result: result.clone(),
            },
        );
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
