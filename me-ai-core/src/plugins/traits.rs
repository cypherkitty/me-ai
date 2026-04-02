//! Plugin trait — async interface for action execution and metadata.

use async_trait::async_trait;

use super::registry::ActionMetadata;
use super::types::{EventInput, PluginResult};
use super::PluginId;

/// Trait for action plugins. WASM is single-threaded, so no `Send` bound.
#[async_trait(?Send)]
#[allow(dead_code)]
pub trait Plugin {
    /// Plugin identifier.
    fn id(&self) -> PluginId;

    /// Metadata for all actions this plugin supports.
    fn metadata(&self) -> Vec<ActionMetadata>;

    /// Required OAuth scopes for a specific action.
    fn required_scopes(&self, action_id: &str) -> Vec<String>;

    /// Execute an action by command ID.
    async fn execute(
        &self,
        command_id: &str,
        event: &EventInput,
        access_token: &str,
        config: Option<&serde_json::Value>,
    ) -> PluginResult;
}
