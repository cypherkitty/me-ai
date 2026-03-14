use serde::Serialize;

use super::{filesystem, gmail, twitter, PluginId};

#[derive(Clone, Serialize)]
pub struct ActionMetadata {
    #[serde(rename = "actionId")]
    pub id: String,
    pub name: String,
    pub description: String,
    #[serde(rename = "requiredScopes")]
    pub required_scopes: Vec<String>,
}

#[derive(Clone, Serialize)]
pub struct PluginForPrompt {
    pub plugin_id: String,
    #[serde(rename = "pluginName")]
    pub plugin_name: String,
    pub actions: Vec<PluginActionRef>,
}

#[derive(Clone, Serialize)]
pub struct PluginActionRef {
    #[serde(rename = "actionId")]
    pub action_id: String,
}

#[derive(Clone, Serialize)]
pub struct PluginDefinition {
    #[serde(rename = "pluginId")]
    pub plugin_id: String,
    #[serde(rename = "pluginName")]
    pub plugin_name: String,
    pub actions: Vec<ActionMetadata>,
}

fn plugin_definitions() -> Vec<PluginDefinition> {
    vec![
        PluginDefinition {
            plugin_id: PluginId::Gmail.as_str().into(),
            plugin_name: "Gmail".into(),
            actions: gmail::actions_metadata(),
        },
        PluginDefinition {
            plugin_id: PluginId::Twitter.as_str().into(),
            plugin_name: "Twitter/X".into(),
            actions: twitter::actions_metadata(),
        },
        PluginDefinition {
            plugin_id: PluginId::Filesystem.as_str().into(),
            plugin_name: "Local Filesystem".into(),
            actions: filesystem::actions_metadata(),
        },
    ]
}

/// Get available actions for a plugin (metadata only).
pub fn get_available_actions(plugin: PluginId) -> Vec<ActionMetadata> {
    match plugin {
        PluginId::Gmail => gmail::actions_metadata(),
        PluginId::Twitter => twitter::actions_metadata(),
        PluginId::Filesystem => filesystem::actions_metadata(),
        PluginId::Other(_) => Vec::new(),
    }
}

/// Get required OAuth scopes for an action.
pub fn get_required_scopes(action_id: &str, plugin: PluginId) -> Vec<String> {
    match plugin {
        PluginId::Gmail => gmail::required_scopes(action_id),
        PluginId::Twitter => twitter::required_scopes(action_id),
        PluginId::Filesystem => filesystem::required_scopes(action_id),
        PluginId::Other(ref id) => {
            let actions = plugin_definitions()
                .into_iter()
                .find(|p| p.plugin_id == id.as_str())
                .map(|p| p.actions)
                .unwrap_or_default();
            for a in actions {
                if a.id == action_id {
                    return a.required_scopes;
                }
            }
            vec![]
        }
    }
}

/// Get plugins with actions for LLM prompt (triage system prompt).
pub fn get_plugins_for_prompt() -> Vec<PluginForPrompt> {
    plugin_definitions()
        .into_iter()
        .map(|p| PluginForPrompt {
            plugin_id: p.plugin_id,
            plugin_name: p.plugin_name,
            actions: p
                .actions
                .into_iter()
                .map(|a| PluginActionRef { action_id: a.id })
                .collect(),
        })
        .collect()
}

/// Get full plugin registry (for UI catalog).
pub fn get_plugin_registry() -> Vec<PluginDefinition> {
    plugin_definitions()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_required_scopes_returns_empty_for_unknown_action_not_unknown_plugin() {
        let scopes = get_required_scopes("nonexistent_action", PluginId::Gmail);
        assert!(scopes.is_empty());
    }
}
