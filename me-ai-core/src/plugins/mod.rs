//! Plugin catalog + execution helpers: available actions, required scopes,
//! source-to-plugin mapping, and WASM-side execution.

mod filesystem;
mod gmail;
mod http;
mod pipeline;
mod registry;
mod twitter;
mod types;
mod utils;

#[allow(unused_imports)]
pub use gmail::GmailAction;
pub use pipeline::{execute_pipeline, execute_pipeline_batch};
#[allow(unused_imports)]
pub use registry::{
    get_available_actions, get_plugin_registry, get_plugins_for_prompt, get_required_scopes,
    ActionMetadata, PluginActionRef, PluginDefinition, PluginForPrompt,
};
#[allow(unused_imports)]
pub use twitter::TwitterAction;
#[allow(unused_imports)]
pub use types::{ActionInput, EventInput, PipelineBatchResult, PipelineResult};

/// Plugin identifier. Normalizes source strings (case, whitespace) for dispatch.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum PluginId {
    Gmail,
    Twitter,
    Filesystem,
    Other(String),
}

impl PluginId {
    pub fn as_str(&self) -> &str {
        match self {
            Self::Gmail => "gmail",
            Self::Twitter => "twitter",
            Self::Filesystem => "filesystem",
            Self::Other(value) => value.as_str(),
        }
    }

    pub fn into_string(self) -> String {
        match self {
            Self::Gmail => "gmail".into(),
            Self::Twitter => "twitter".into(),
            Self::Filesystem => "filesystem".into(),
            Self::Other(value) => value,
        }
    }

    /// Parse from source string (normalizes case and whitespace).
    pub fn from_source(source: &str) -> Self {
        let normalized = source.trim().to_ascii_lowercase();
        match normalized.as_str() {
            "gmail" => Self::Gmail,
            "twitter" => Self::Twitter,
            "filesystem" => Self::Filesystem,
            _ => Self::Other(source.trim().to_string()),
        }
    }
}

impl std::fmt::Display for PluginId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.as_str())
    }
}

/// Resolve source name to plugin ID string.
pub fn resolve_plugin_id(source: &str) -> String {
    PluginId::from_source(source).into_string()
}
