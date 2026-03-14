//! Plugin catalog + execution helpers: available actions, required scopes,
//! source-to-plugin mapping, and WASM-side execution.

mod exec;

pub use exec::{
    execute_pipeline, execute_pipeline_batch, ActionInput, EventInput, PipelineBatchResult,
    PipelineResult,
};

use serde::Serialize;

const GMAIL_SCOPE_MODIFY: &str = "https://www.googleapis.com/auth/gmail.modify";

/// Gmail plugin action IDs. Parse from strings at the boundary; use enum for type-safe dispatch.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum GmailAction {
    MarkRead,
    MarkUnread,
    Star,
    Unstar,
    Trash,
    Delete,
    MarkSpam,
    Archive,
    ApplyLabel,
    RemoveLabel,
    MarkImportant,
    MarkNotImportant,
}

impl GmailAction {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::MarkRead => "mark_read",
            Self::MarkUnread => "mark_unread",
            Self::Star => "star",
            Self::Unstar => "unstar",
            Self::Trash => "trash",
            Self::Delete => "delete",
            Self::MarkSpam => "mark_spam",
            Self::Archive => "archive",
            Self::ApplyLabel => "apply_label",
            Self::RemoveLabel => "remove_label",
            Self::MarkImportant => "mark_important",
            Self::MarkNotImportant => "mark_not_important",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "mark_read" => Some(Self::MarkRead),
            "mark_unread" => Some(Self::MarkUnread),
            "star" => Some(Self::Star),
            "unstar" => Some(Self::Unstar),
            "trash" => Some(Self::Trash),
            "delete" => Some(Self::Delete),
            "mark_spam" => Some(Self::MarkSpam),
            "archive" => Some(Self::Archive),
            "apply_label" => Some(Self::ApplyLabel),
            "remove_label" => Some(Self::RemoveLabel),
            "mark_important" => Some(Self::MarkImportant),
            "mark_not_important" => Some(Self::MarkNotImportant),
            _ => None,
        }
    }

    fn metadata(self) -> ActionMetadata {
        let (name, description) = match self {
            Self::MarkRead => ("Mark as Read", "Remove the UNREAD label"),
            Self::MarkUnread => ("Mark as Unread", "Add the UNREAD label"),
            Self::Star => ("Star", "Add the STARRED label"),
            Self::Unstar => ("Unstar", "Remove the STARRED label"),
            Self::Trash => ("Move to Trash", "Move message to trash (recoverable for 30 days)"),
            Self::Delete => ("Delete Permanently", "Permanently delete message (cannot be recovered)"),
            Self::MarkSpam => ("Mark as Spam", "Move message to spam folder"),
            Self::Archive => ("Archive", "Remove from inbox (keeps message, removes INBOX label)"),
            Self::ApplyLabel => ("Apply Label", "Apply a custom label to the message"),
            Self::RemoveLabel => ("Remove Label", "Remove a label from the message"),
            Self::MarkImportant => ("Mark as Important", "Add the IMPORTANT label"),
            Self::MarkNotImportant => ("Mark as Not Important", "Remove the IMPORTANT label"),
        };
        ActionMetadata {
            id: self.as_str().into(),
            name: name.into(),
            description: description.into(),
            required_scopes: vec![GMAIL_SCOPE_MODIFY.into()],
        }
    }

    fn all() -> &'static [Self] {
        &[
            Self::MarkRead,
            Self::MarkUnread,
            Self::Star,
            Self::Unstar,
            Self::Trash,
            Self::Delete,
            Self::MarkSpam,
            Self::Archive,
            Self::ApplyLabel,
            Self::RemoveLabel,
            Self::MarkImportant,
            Self::MarkNotImportant,
        ]
    }
}

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

fn gmail_actions() -> Vec<ActionMetadata> {
    GmailAction::all().iter().map(|a| a.metadata()).collect()
}

fn twitter_actions() -> Vec<ActionMetadata> {
    vec![
        ActionMetadata {
            id: "twitter:like".into(),
            name: "Like Tweet".into(),
            description: "Like a tweet".into(),
            required_scopes: vec!["like.write".into()],
        },
        ActionMetadata {
            id: "twitter:unlike".into(),
            name: "Unlike Tweet".into(),
            description: "Remove like from a tweet".into(),
            required_scopes: vec!["like.write".into()],
        },
        ActionMetadata {
            id: "twitter:retweet".into(),
            name: "Retweet".into(),
            description: "Retweet a tweet".into(),
            required_scopes: vec!["tweet.write".into()],
        },
        ActionMetadata {
            id: "twitter:unretweet".into(),
            name: "Undo Retweet".into(),
            description: "Undo a retweet".into(),
            required_scopes: vec!["tweet.write".into()],
        },
        ActionMetadata {
            id: "twitter:bookmark".into(),
            name: "Bookmark Tweet".into(),
            description: "Bookmark a tweet for later".into(),
            required_scopes: vec!["bookmark.write".into()],
        },
        ActionMetadata {
            id: "twitter:remove_bookmark".into(),
            name: "Remove Bookmark".into(),
            description: "Remove a tweet bookmark".into(),
            required_scopes: vec!["bookmark.write".into()],
        },
        ActionMetadata {
            id: "twitter:mute_author".into(),
            name: "Mute Author".into(),
            description: "Mute the author of a tweet".into(),
            required_scopes: vec!["users.read".into()],
        },
        ActionMetadata {
            id: "twitter:block_author".into(),
            name: "Block Author".into(),
            description: "Block the author of a tweet".into(),
            required_scopes: vec!["users.read".into()],
        },
    ]
}

fn plugin_definitions() -> Vec<PluginDefinition> {
    vec![
        PluginDefinition {
            plugin_id: "gmail".into(),
            plugin_name: "Gmail".into(),
            actions: gmail_actions(),
        },
        PluginDefinition {
            plugin_id: "twitter".into(),
            plugin_name: "Twitter/X".into(),
            actions: twitter_actions(),
        },
    ]
}

/// Resolve source name to plugin ID.
pub fn resolve_plugin_id(source: &str) -> String {
    match source.to_lowercase().as_str() {
        "gmail" => "gmail".into(),
        "twitter" => "twitter".into(),
        _ => source.to_string(),
    }
}

/// Get available actions for a source (metadata only).
pub fn get_available_actions(source: &str) -> Vec<ActionMetadata> {
    let plugin_id = resolve_plugin_id(source);
    plugin_definitions()
        .into_iter()
        .find(|p| p.plugin_id == plugin_id)
        .map(|p| p.actions)
        .unwrap_or_default()
}

/// Get required OAuth scopes for an action.
pub fn get_required_scopes(action_id: &str, source: &str) -> Vec<String> {
    let plugin_id = resolve_plugin_id(source);
    let actions = plugin_definitions()
        .into_iter()
        .find(|p| p.plugin_id == plugin_id)
        .map(|p| p.actions)
        .unwrap_or_default();
    let candidates: Vec<String> = if plugin_id.as_str() == "twitter" && !action_id.starts_with("twitter:") {
        vec![format!("twitter:{}", action_id), action_id.to_string()]
    } else {
        vec![action_id.to_string()]
    };
    for a in actions {
        if candidates.iter().any(|c| c == &a.id) {
            return a.required_scopes.clone();
        }
    }
    vec![]
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
