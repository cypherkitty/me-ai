use serde::{Deserialize, Serialize};
use tsify_next::Tsify;
use wasm_bindgen::prelude::*;

/// Input for a single action in a pipeline.
#[derive(Clone, Debug, Deserialize, Serialize, Tsify)]
#[tsify(from_wasm_abi)]
pub struct ActionInput {
    pub id: Option<String>,
    #[serde(rename = "pluginId")]
    pub plugin_id: Option<String>,
    #[serde(rename = "commandId")]
    pub command_id: Option<String>,
    pub name: Option<String>,
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

/// Result of a single action in a pipeline. Returned as part of PipelineResult.
/// `data` is a JsValue (serialized JSON or null) because serde_json::Value is not wasm-bindgen-compatible.
#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct ActionResult {
    #[wasm_bindgen(js_name = "actionId")]
    pub action_id: Option<String>,
    #[wasm_bindgen(js_name = "actionName")]
    pub action_name: Option<String>,
    #[wasm_bindgen(js_name = "pluginId")]
    pub plugin_id: Option<String>,
    #[wasm_bindgen(js_name = "commandId")]
    pub command_id: Option<String>,
    pub success: bool,
    pub message: String,
    /// Serialized action data as a JS value (object or null).
    pub data: JsValue,
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
        action_id: Option<String>,
        action_name: Option<String>,
        plugin_id: Option<String>,
        command_id: Option<String>,
        result: PluginResult,
    ) -> Self {
        let data = result
            .data
            .as_ref()
            .and_then(|v| serde_wasm_bindgen::to_value(v).ok())
            .unwrap_or(JsValue::NULL);
        Self {
            action_id,
            action_name,
            plugin_id,
            command_id,
            success: result.success,
            message: result.message,
            data,
        }
    }
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct PipelineResult {
    pub success: bool,
    pub results: Vec<ActionResult>,
    pub message: String,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct PipelineBatchResultEntry {
    /// The event that was processed, serialized as a JS value.
    pub event: JsValue,
    pub success: bool,
    pub results: Vec<ActionResult>,
    pub message: String,
}

impl PipelineBatchResultEntry {
    pub fn new(event: &EventInput, success: bool, results: Vec<ActionResult>, message: String) -> Self {
        let event_js = serde_wasm_bindgen::to_value(event).unwrap_or(JsValue::NULL);
        Self {
            event: event_js,
            success,
            results,
            message,
        }
    }
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct PipelineBatchResult {
    pub success: bool,
    pub results: Vec<PipelineBatchResultEntry>,
    pub total: usize,
    pub successful: usize,
    pub failed: usize,
    pub message: String,
}
