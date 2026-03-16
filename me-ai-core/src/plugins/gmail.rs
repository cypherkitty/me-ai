use serde::Serialize;

use super::http::{fetch_with_body, serialize_body, HttpMethod};
use super::registry::ActionMetadata;
use super::types::{EventInput, PluginResult};
use super::utils::value_to_string;

const GMAIL_BASE: &str = "https://gmail.googleapis.com/gmail/v1/users/me";
const GMAIL_SCOPE_MODIFY: &str = "https://www.googleapis.com/auth/gmail.modify";
const GMAIL_ACTION_PREFIX: &str = "gmail:";
const GMAIL_LABEL_INBOX: &str = "INBOX";
const GMAIL_LABEL_UNREAD: &str = "UNREAD";
const GMAIL_LABEL_STARRED: &str = "STARRED";
const GMAIL_LABEL_SPAM: &str = "SPAM";
const GMAIL_LABEL_IMPORTANT: &str = "IMPORTANT";
const GMAIL_ID_PREFIX: &str = "gmail:";

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
        let normalized = s.trim().to_ascii_lowercase();
        let normalized = normalized
            .strip_prefix(GMAIL_ACTION_PREFIX)
            .unwrap_or(&normalized);
        match normalized {
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

pub(crate) fn actions_metadata() -> Vec<ActionMetadata> {
    GmailAction::all().iter().map(|a| a.metadata()).collect()
}

pub(crate) fn required_scopes(action_id: &str) -> Vec<String> {
    GmailAction::from_str(action_id)
        .map(|a| a.metadata().required_scopes)
        .unwrap_or_default()
}

#[derive(Clone, Debug, Serialize)]
struct GmailModifyLabelsRequest {
    #[serde(rename = "addLabelIds", skip_serializing_if = "Vec::is_empty")]
    add_label_ids: Vec<String>,
    #[serde(rename = "removeLabelIds", skip_serializing_if = "Vec::is_empty")]
    remove_label_ids: Vec<String>,
}

#[derive(Clone, Debug, Serialize)]
struct MessageIdData {
    #[serde(rename = "messageId")]
    message_id: String,
}

#[derive(Clone, Debug, Serialize)]
struct MessageLabelData {
    #[serde(rename = "messageId")]
    message_id: String,
    #[serde(rename = "labelId")]
    label_id: String,
}

fn extract_message_id(event: &EventInput) -> Option<String> {
    let data = &event.data;
    let id = data.get("emailId").or_else(|| data.get("id"))?;
    let mut id = value_to_string(id)?;
    if let Some(stripped) = id.strip_prefix(GMAIL_ID_PREFIX) {
        id = stripped.to_string();
    }
    Some(id)
}

fn extract_label_id(config: Option<&serde_json::Value>) -> Option<String> {
    config?.get("labelId").and_then(value_to_string)
}

async fn gmail_api(
    token: &str,
    method: HttpMethod,
    path: &str,
    body: Option<GmailModifyLabelsRequest>,
) -> Result<(), String> {
    let url = format!("{GMAIL_BASE}{path}");
    let body = match body {
        Some(body) => Some(serialize_body(body)?),
        None => None,
    };
    let resp = fetch_with_body(method, &url, token, body)
        .await
        .map_err(|e| e.to_string())?;
    if resp.status().is_success() {
        return Ok(());
    }
    let status = resp.status();
    if let Ok(json) = resp.json::<serde_json::Value>().await {
        if let Some(msg) = json
            .get("error")
            .and_then(|v| v.get("message"))
            .and_then(|v| v.as_str())
        {
            return Err(msg.to_string());
        }
    }
    Err(format!("Gmail API error: {status}"))
}

pub(crate) async fn execute_gmail_action(
    command_id: &str,
    event: &EventInput,
    access_token: &str,
    config: Option<&serde_json::Value>,
) -> PluginResult {
    let message_id = match extract_message_id(event) {
        Some(id) => id,
        None => return PluginResult::err("No message ID provided"),
    };
    let action = match GmailAction::from_str(command_id) {
        Some(a) => a,
        None => return PluginResult::err(format!("Command \"{command_id}\" not supported")),
    };
    match action {
        GmailAction::MarkRead => {
            let body = GmailModifyLabelsRequest {
                add_label_ids: Vec::new(),
                remove_label_ids: vec![GMAIL_LABEL_UNREAD.into()],
            };
            if let Err(msg) = gmail_api(
                access_token,
                HttpMethod::Post,
                &format!("/messages/{message_id}/modify"),
                Some(body),
            )
            .await
            {
                return PluginResult::err(msg);
            }
            PluginResult::ok_with_data(
                "Marked message as read",
                MessageIdData {
                    message_id: message_id.clone(),
                },
            )
        }
        GmailAction::MarkUnread => {
            let body = GmailModifyLabelsRequest {
                add_label_ids: vec![GMAIL_LABEL_UNREAD.into()],
                remove_label_ids: Vec::new(),
            };
            if let Err(msg) = gmail_api(
                access_token,
                HttpMethod::Post,
                &format!("/messages/{message_id}/modify"),
                Some(body),
            )
            .await
            {
                return PluginResult::err(msg);
            }
            PluginResult::ok_with_data(
                "Marked message as unread",
                MessageIdData {
                    message_id: message_id.clone(),
                },
            )
        }
        GmailAction::Star => {
            let body = GmailModifyLabelsRequest {
                add_label_ids: vec![GMAIL_LABEL_STARRED.into()],
                remove_label_ids: Vec::new(),
            };
            if let Err(msg) = gmail_api(
                access_token,
                HttpMethod::Post,
                &format!("/messages/{message_id}/modify"),
                Some(body),
            )
            .await
            {
                return PluginResult::err(msg);
            }
            PluginResult::ok_with_data(
                "Starred message",
                MessageIdData {
                    message_id: message_id.clone(),
                },
            )
        }
        GmailAction::Unstar => {
            let body = GmailModifyLabelsRequest {
                add_label_ids: Vec::new(),
                remove_label_ids: vec![GMAIL_LABEL_STARRED.into()],
            };
            if let Err(msg) = gmail_api(
                access_token,
                HttpMethod::Post,
                &format!("/messages/{message_id}/modify"),
                Some(body),
            )
            .await
            {
                return PluginResult::err(msg);
            }
            PluginResult::ok_with_data(
                "Unstarred message",
                MessageIdData {
                    message_id: message_id.clone(),
                },
            )
        }
        GmailAction::Trash => {
            if let Err(msg) = gmail_api(
                access_token,
                HttpMethod::Post,
                &format!("/messages/{message_id}/trash"),
                None,
            )
            .await
            {
                return PluginResult::err(msg);
            }
            PluginResult::ok_with_data(
                "Moved message to trash",
                MessageIdData {
                    message_id: message_id.clone(),
                },
            )
        }
        GmailAction::Delete => {
            if let Err(msg) = gmail_api(
                access_token,
                HttpMethod::Delete,
                &format!("/messages/{message_id}"),
                None,
            )
            .await
            {
                return PluginResult::err(msg);
            }
            PluginResult::ok_with_data(
                "Permanently deleted message",
                MessageIdData {
                    message_id: message_id.clone(),
                },
            )
        }
        GmailAction::MarkSpam => {
            let body = GmailModifyLabelsRequest {
                add_label_ids: vec![GMAIL_LABEL_SPAM.into()],
                remove_label_ids: vec![GMAIL_LABEL_INBOX.into()],
            };
            if let Err(msg) = gmail_api(
                access_token,
                HttpMethod::Post,
                &format!("/messages/{message_id}/modify"),
                Some(body),
            )
            .await
            {
                return PluginResult::err(msg);
            }
            PluginResult::ok_with_data(
                "Marked message as spam",
                MessageIdData {
                    message_id: message_id.clone(),
                },
            )
        }
        GmailAction::Archive => {
            let body = GmailModifyLabelsRequest {
                add_label_ids: Vec::new(),
                remove_label_ids: vec![GMAIL_LABEL_INBOX.into()],
            };
            if let Err(msg) = gmail_api(
                access_token,
                HttpMethod::Post,
                &format!("/messages/{message_id}/modify"),
                Some(body),
            )
            .await
            {
                return PluginResult::err(msg);
            }
            PluginResult::ok_with_data(
                "Archived message",
                MessageIdData {
                    message_id: message_id.clone(),
                },
            )
        }
        GmailAction::ApplyLabel => {
            let label_id = match extract_label_id(config) {
                Some(label_id) => label_id,
                None => return PluginResult::err("No label ID provided in config"),
            };
            let body = GmailModifyLabelsRequest {
                add_label_ids: vec![label_id.clone()],
                remove_label_ids: Vec::new(),
            };
            if let Err(msg) = gmail_api(
                access_token,
                HttpMethod::Post,
                &format!("/messages/{message_id}/modify"),
                Some(body),
            )
            .await
            {
                return PluginResult::err(msg);
            }
            PluginResult::ok_with_data(
                format!("Applied label: {label_id}"),
                MessageLabelData {
                    message_id: message_id.clone(),
                    label_id,
                },
            )
        }
        GmailAction::RemoveLabel => {
            let label_id = match extract_label_id(config) {
                Some(label_id) => label_id,
                None => return PluginResult::err("No label ID provided in config"),
            };
            let body = GmailModifyLabelsRequest {
                add_label_ids: Vec::new(),
                remove_label_ids: vec![label_id.clone()],
            };
            if let Err(msg) = gmail_api(
                access_token,
                HttpMethod::Post,
                &format!("/messages/{message_id}/modify"),
                Some(body),
            )
            .await
            {
                return PluginResult::err(msg);
            }
            PluginResult::ok_with_data(
                format!("Removed label: {label_id}"),
                MessageLabelData {
                    message_id: message_id.clone(),
                    label_id,
                },
            )
        }
        GmailAction::MarkImportant => {
            let body = GmailModifyLabelsRequest {
                add_label_ids: vec![GMAIL_LABEL_IMPORTANT.into()],
                remove_label_ids: Vec::new(),
            };
            if let Err(msg) = gmail_api(
                access_token,
                HttpMethod::Post,
                &format!("/messages/{message_id}/modify"),
                Some(body),
            )
            .await
            {
                return PluginResult::err(msg);
            }
            PluginResult::ok_with_data(
                "Marked as important",
                MessageIdData {
                    message_id: message_id.clone(),
                },
            )
        }
        GmailAction::MarkNotImportant => {
            let body = GmailModifyLabelsRequest {
                add_label_ids: Vec::new(),
                remove_label_ids: vec![GMAIL_LABEL_IMPORTANT.into()],
            };
            if let Err(msg) = gmail_api(
                access_token,
                HttpMethod::Post,
                &format!("/messages/{message_id}/modify"),
                Some(body),
            )
            .await
            {
                return PluginResult::err(msg);
            }
            PluginResult::ok_with_data(
                "Marked as not important",
                MessageIdData {
                    message_id: message_id.clone(),
                },
            )
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn gmail_action_from_str_normalizes_and_strips_prefix() {
        assert_eq!(GmailAction::from_str("gmail:mark_read"), Some(GmailAction::MarkRead));
        assert_eq!(GmailAction::from_str("  Mark_Read  "), Some(GmailAction::MarkRead));
        assert_eq!(GmailAction::from_str("unknown"), None);
    }

    #[test]
    fn from_str_mark_read_bare() {
        assert_eq!(GmailAction::from_str("mark_read"), Some(GmailAction::MarkRead));
    }

    #[test]
    fn from_str_with_gmail_prefix() {
        assert_eq!(GmailAction::from_str("gmail:mark_read"), Some(GmailAction::MarkRead));
    }

    #[test]
    fn from_str_case_insensitive() {
        assert_eq!(GmailAction::from_str("MARK_READ"), Some(GmailAction::MarkRead));
    }

    #[test]
    fn from_str_trims_whitespace() {
        assert_eq!(GmailAction::from_str("  trash  "), Some(GmailAction::Trash));
    }

    #[test]
    fn from_str_unknown_returns_none() {
        assert_eq!(GmailAction::from_str("unknown_action"), None);
    }

    #[test]
    fn round_trip_all_variants() {
        for action in GmailAction::all() {
            assert_eq!(
                GmailAction::from_str(action.as_str()),
                Some(*action),
                "round-trip failed for {:?}",
                action
            );
        }
    }

    #[test]
    fn as_str_mark_read() {
        assert_eq!(GmailAction::MarkRead.as_str(), "mark_read");
    }
}
