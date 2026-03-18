use serde::{Deserialize, Serialize};
use tsify_next::Tsify;
use wasm_bindgen::prelude::*;

/// Input for a single action in a pipeline.
#[derive(Clone, Debug, Deserialize, Serialize, Tsify)]
#[tsify(from_wasm_abi)]
pub struct ActionInput {
    #[serde(default)]
    pub id: String,
    #[serde(rename = "pluginId", default)]
    pub plugin_id: String,
    #[serde(rename = "commandId", default)]
    pub command_id: String,
    #[serde(default)]
    pub name: String,
}

/// Input event for pipeline execution.
#[derive(Clone, Debug, Deserialize, Serialize, Tsify)]
#[tsify(from_wasm_abi)]
pub struct EventInput {
    #[serde(rename = "type")]
    pub event_type: String,
    pub source: String,
    #[serde(default)]
    pub data: serde_json::Value,
    pub metadata: Option<serde_json::Value>,
}

/// Internal plugin result (not returned directly across WASM boundary).
#[derive(Clone, Debug, Serialize)]
pub struct PluginResult {
    pub success: bool,
    pub message: String,
    pub data: Option<serde_json::Value>,
}

impl PluginResult {
    pub fn ok(message: impl Into<String>, data: Option<serde_json::Value>) -> Self {
        Self {
            success: true,
            message: message.into(),
            data,
        }
    }

    pub fn ok_with_data<T: Serialize>(message: impl Into<String>, data: T) -> Self {
        Self::ok(message, serde_json::to_value(data).ok())
    }

    pub fn err(message: impl Into<String>) -> Self {
        Self {
            success: false,
            message: message.into(),
            data: None,
        }
    }
}

/// Result of a single action in a pipeline.
#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct ActionResult {
    pub action_id: String,
    pub action_name: String,
    pub plugin_id: String,
    pub command_id: String,
    pub success: bool,
    pub message: String,
    /// Optional action result data.
    pub data: Option<serde_json::Value>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn plugin_result_ok() {
        let r = PluginResult::ok("done", None);
        assert!(r.success);
        assert_eq!(r.message, "done".to_string());
        assert!(r.data.is_none());
    }

    #[test]
    fn plugin_result_err() {
        let r = PluginResult::err("bad");
        assert!(!r.success);
        assert_eq!(r.message, "bad".to_string());
        assert!(r.data.is_none());
    }

    #[test]
    fn plugin_result_ok_with_data() {
        let r = PluginResult::ok_with_data("ok", 42u32);
        assert!(r.success);
        assert_eq!(r.message, "ok".to_string());
        let data = r.data.as_ref().expect("data must be Some");
        assert_eq!(*data, serde_json::json!(42));
    }
}

impl ActionResult {
    pub fn from_plugin_result(
        action_id: String,
        action_name: String,
        plugin_id: String,
        command_id: String,
        result: PluginResult,
    ) -> Self {
        Self {
            action_id,
            action_name,
            plugin_id,
            command_id,
            success: result.success,
            message: result.message,
            data: result.data,
        }
    }
}

/// Result of a full pipeline execution.
#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct PipelineResult {
    pub success: bool,
    pub results: Vec<ActionResult>,
    pub message: String,
}

/// A single entry in a batch pipeline result.
#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct PipelineBatchResultEntry {
    /// The event that was processed.
    pub event: EventInput,
    pub success: bool,
    pub results: Vec<ActionResult>,
    pub message: String,
}

impl PipelineBatchResultEntry {
    pub fn new(event: &EventInput, success: bool, results: Vec<ActionResult>, message: String) -> Self {
        Self {
            event: event.clone(),
            success,
            results,
            message,
        }
    }
}

/// Result of a batch pipeline execution.
#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi)]
#[serde(rename_all = "camelCase")]
pub struct PipelineBatchResult {
    pub success: bool,
    pub results: Vec<PipelineBatchResultEntry>,
    pub total: usize,
    pub successful: usize,
    pub failed: usize,
    pub message: String,
}
