use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize)]
pub struct ActionInput {
    pub id: Option<String>,
    #[serde(rename = "pluginId")]
    pub plugin_id: Option<String>,
    #[serde(rename = "commandId")]
    pub command_id: Option<String>,
    pub name: Option<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct EventInput {
    #[serde(rename = "type")]
    pub event_type: String,
    pub source: String,
    #[serde(default)]
    pub data: serde_json::Value,
    pub metadata: Option<serde_json::Value>,
}

#[derive(Clone, Debug, Serialize)]
pub struct PluginResult {
    pub success: bool,
    pub message: Option<String>,
    pub data: Option<serde_json::Value>,
}

impl PluginResult {
    pub fn ok(message: impl Into<String>, data: Option<serde_json::Value>) -> Self {
        Self {
            success: true,
            message: Some(message.into()),
            data,
        }
    }

    pub fn ok_with_data<T: Serialize>(message: impl Into<String>, data: T) -> Self {
        Self::ok(message, serde_json::to_value(data).ok())
    }

    pub fn err(message: impl Into<String>) -> Self {
        Self {
            success: false,
            message: Some(message.into()),
            data: None,
        }
    }
}

#[derive(Clone, Debug, Serialize)]
pub struct ActionResult {
    #[serde(rename = "actionId")]
    pub action_id: Option<String>,
    #[serde(rename = "actionName")]
    pub action_name: Option<String>,
    #[serde(rename = "pluginId")]
    pub plugin_id: Option<String>,
    #[serde(rename = "commandId")]
    pub command_id: Option<String>,
    pub success: bool,
    pub message: Option<String>,
    pub data: Option<serde_json::Value>,
}

#[derive(Clone, Debug, Serialize)]
pub struct PipelineResult {
    pub success: bool,
    pub results: Vec<ActionResult>,
    pub message: String,
}

#[derive(Clone, Debug, Serialize)]
pub struct PipelineBatchResultEntry {
    pub event: EventInput,
    pub success: bool,
    pub results: Vec<ActionResult>,
    pub message: String,
}

#[derive(Clone, Debug, Serialize)]
pub struct PipelineBatchResult {
    pub success: bool,
    pub results: Vec<PipelineBatchResultEntry>,
    pub total: usize,
    pub successful: usize,
    pub failed: usize,
    pub message: String,
}
