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

impl std::str::FromStr for GmailAction {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let normalized = s.trim().to_ascii_lowercase();
        let normalized = normalized
            .strip_prefix(GMAIL_ACTION_PREFIX)
            .unwrap_or(&normalized);
        match normalized {
            "mark_read" => Ok(Self::MarkRead),
            "mark_unread" => Ok(Self::MarkUnread),
            "star" => Ok(Self::Star),
            "unstar" => Ok(Self::Unstar),
            "trash" => Ok(Self::Trash),
            "delete" => Ok(Self::Delete),
            "mark_spam" => Ok(Self::MarkSpam),
            "archive" => Ok(Self::Archive),
            "apply_label" => Ok(Self::ApplyLabel),
            "remove_label" => Ok(Self::RemoveLabel),
            "mark_important" => Ok(Self::MarkImportant),
            "mark_not_important" => Ok(Self::MarkNotImportant),
            _ => Err(format!("unknown gmail action: {s}")),
        }
    }
}

pub(crate) fn actions_metadata() -> Vec<ActionMetadata> {
    GmailAction::all().iter().map(|a| a.metadata()).collect()
}

pub(crate) fn required_scopes(action_id: &str) -> Vec<String> {
    action_id
        .parse::<GmailAction>()
        .ok()
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

async fn modify_labels(
    token: &str,
    msg_id: &str,
    add: &[&str],
    remove: &[&str],
    success_msg: &str,
) -> PluginResult {
    let body = GmailModifyLabelsRequest {
        add_label_ids: add.iter().map(|s| (*s).to_string()).collect(),
        remove_label_ids: remove.iter().map(|s| (*s).to_string()).collect(),
    };
    if let Err(msg) = gmail_api(
        token,
        HttpMethod::Post,
        &format!("/messages/{msg_id}/modify"),
        Some(body),
    )
    .await
    {
        return PluginResult::err(msg);
    }
    PluginResult::ok_with_data(
        success_msg,
        MessageIdData {
            message_id: msg_id.to_string(),
        },
    )
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
    let action: GmailAction = match command_id.parse() {
        Ok(a) => a,
        Err(_) => return PluginResult::err(format!("Command \"{command_id}\" not supported")),
    };
    match action {
        GmailAction::MarkRead => {
            modify_labels(access_token, &message_id, &[], &[GMAIL_LABEL_UNREAD], "Marked message as read").await
        }
        GmailAction::MarkUnread => {
            modify_labels(access_token, &message_id, &[GMAIL_LABEL_UNREAD], &[], "Marked message as unread").await
        }
        GmailAction::Star => {
            modify_labels(access_token, &message_id, &[GMAIL_LABEL_STARRED], &[], "Starred message").await
        }
        GmailAction::Unstar => {
            modify_labels(access_token, &message_id, &[], &[GMAIL_LABEL_STARRED], "Unstarred message").await
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
            modify_labels(access_token, &message_id, &[GMAIL_LABEL_SPAM], &[GMAIL_LABEL_INBOX], "Marked message as spam").await
        }
        GmailAction::Archive => {
            modify_labels(access_token, &message_id, &[], &[GMAIL_LABEL_INBOX], "Archived message").await
        }
        GmailAction::ApplyLabel | GmailAction::RemoveLabel => {
            let label_id = match extract_label_id(config) {
                Some(label_id) => label_id,
                None => return PluginResult::err("No label ID provided in config"),
            };
            let is_apply = matches!(action, GmailAction::ApplyLabel);
            let body = GmailModifyLabelsRequest {
                add_label_ids: if is_apply { vec![label_id.clone()] } else { Vec::new() },
                remove_label_ids: if is_apply { Vec::new() } else { vec![label_id.clone()] },
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
            let verb = if is_apply { "Applied" } else { "Removed" };
            PluginResult::ok_with_data(
                format!("{verb} label: {label_id}"),
                MessageLabelData {
                    message_id: message_id.clone(),
                    label_id,
                },
            )
        }
        GmailAction::MarkImportant => {
            modify_labels(access_token, &message_id, &[GMAIL_LABEL_IMPORTANT], &[], "Marked as important").await
        }
        GmailAction::MarkNotImportant => {
            modify_labels(access_token, &message_id, &[], &[GMAIL_LABEL_IMPORTANT], "Marked as not important").await
        }
    }
}

pub struct GmailPlugin;

#[async_trait::async_trait(?Send)]
impl super::traits::Plugin for GmailPlugin {
    fn id(&self) -> super::PluginId {
        super::PluginId::Gmail
    }

    fn metadata(&self) -> Vec<ActionMetadata> {
        actions_metadata()
    }

    fn required_scopes(&self, action_id: &str) -> Vec<String> {
        required_scopes(action_id)
    }

    async fn execute(
        &self,
        command_id: &str,
        event: &EventInput,
        access_token: &str,
        config: Option<&serde_json::Value>,
    ) -> PluginResult {
        execute_gmail_action(command_id, event, access_token, config).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn gmail_action_from_str_normalizes_and_strips_prefix() {
        assert_eq!("gmail:mark_read".parse::<GmailAction>(), Ok(GmailAction::MarkRead));
        assert_eq!("  Mark_Read  ".parse::<GmailAction>(), Ok(GmailAction::MarkRead));
        assert!("unknown".parse::<GmailAction>().is_err());
    }

    #[test]
    fn from_str_mark_read_bare() {
        assert_eq!("mark_read".parse::<GmailAction>(), Ok(GmailAction::MarkRead));
    }

    #[test]
    fn from_str_with_gmail_prefix() {
        assert_eq!("gmail:mark_read".parse::<GmailAction>(), Ok(GmailAction::MarkRead));
    }

    #[test]
    fn from_str_case_insensitive() {
        assert_eq!("MARK_READ".parse::<GmailAction>(), Ok(GmailAction::MarkRead));
    }

    #[test]
    fn from_str_trims_whitespace() {
        assert_eq!("  trash  ".parse::<GmailAction>(), Ok(GmailAction::Trash));
    }

    #[test]
    fn from_str_unknown_returns_err() {
        assert_eq!(
            "unknown_action".parse::<GmailAction>(),
            Err("unknown gmail action: unknown_action".to_string())
        );
    }

    #[test]
    fn round_trip_all_variants() {
        for action in GmailAction::all() {
            assert_eq!(
                action.as_str().parse::<GmailAction>(),
                Ok(*action),
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
