use serde::{Deserialize, Serialize};
use serde_json::json;
use wasm_bindgen::JsValue;
use js_sys::Function;
use reqwest::Client;

use crate::error::CoreError;
use super::{resolve_plugin_id, GmailAction};

const GMAIL_BASE: &str = "https://gmail.googleapis.com/gmail/v1/users/me";
const TWITTER_BASE: &str = "https://api.twitter.com/2";

const GMAIL_LABEL_INBOX: &str = "INBOX";
const GMAIL_LABEL_UNREAD: &str = "UNREAD";
const GMAIL_LABEL_STARRED: &str = "STARRED";
const GMAIL_LABEL_SPAM: &str = "SPAM";
const GMAIL_LABEL_IMPORTANT: &str = "IMPORTANT";

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

#[derive(Clone)]
struct PluginContext {
    access_token: String,
    event: EventInput,
    config: Option<serde_json::Value>,
    on_progress: Option<Function>,
}

fn emit_progress(cb: &Option<Function>, payload: serde_json::Value) {
    if let Some(f) = cb {
        if let Ok(js_val) = serde_wasm_bindgen::to_value(&payload) {
            let _ = f.call1(&JsValue::NULL, &js_val);
        }
    }
}

fn value_to_string(v: &serde_json::Value) -> Option<String> {
    match v {
        serde_json::Value::String(s) => Some(s.clone()),
        serde_json::Value::Number(n) => Some(n.to_string()),
        serde_json::Value::Bool(b) => Some(b.to_string()),
        _ => None,
    }
}

fn extract_message_id(event: &EventInput) -> Option<String> {
    let data = &event.data;
    let id = data.get("emailId").or_else(|| data.get("id"))?;
    let mut id = value_to_string(id)?;
    if let Some(stripped) = id.strip_prefix("gmail:") {
        id = stripped.to_string();
    }
    Some(id)
}

fn extract_tweet_id(event: &EventInput) -> Option<String> {
    let data = &event.data;
    let id = data.get("sourceId").or_else(|| data.get("id"))?;
    let mut id = value_to_string(id)?;
    if let Some(stripped) = id.strip_prefix("twitter:") {
        id = stripped.to_string();
    }
    Some(id)
}

fn extract_label_id(config: &Option<serde_json::Value>) -> Option<String> {
    config.as_ref()?.get("labelId").and_then(value_to_string)
}

fn extract_twitter_user_id(config: &Option<serde_json::Value>) -> Option<String> {
    let cfg = config.as_ref()?;
    cfg.get("userId")
        .or_else(|| cfg.get("twitterUserId"))
        .and_then(value_to_string)
}

fn extract_twitter_author_id(event: &EventInput) -> Option<String> {
    let raw = event.data.get("raw")?;
    match raw {
        serde_json::Value::String(s) => {
            let parsed: serde_json::Value = serde_json::from_str(s).ok()?;
            parsed.get("author_id").and_then(value_to_string)
        }
        serde_json::Value::Object(map) => map.get("author_id").and_then(value_to_string),
        _ => None,
    }
}

fn http_client() -> Client {
    Client::new()
}

async fn fetch_with_body(
    method: &str,
    url: &str,
    token: &str,
    body: Option<serde_json::Value>,
) -> Result<reqwest::Response, CoreError> {
    let client = http_client();
    let auth = format!("Bearer {}", token);

    let mut req = match method {
        "GET" => client.get(url),
        "POST" => client.post(url),
        "DELETE" => client.delete(url),
        _ => return Err(CoreError::Plugin(format!("Unsupported method: {method}"))),
    };

    req = req.header("Authorization", auth);

    if let Some(body_val) = body {
        req = req
            .header("Content-Type", "application/json")
            .json(&body_val);
    }

    let resp = req.send().await.map_err(|e| CoreError::Plugin(e.to_string()))?;
    Ok(resp)
}

async fn gmail_api(
    token: &str,
    method: &str,
    path: &str,
    body: Option<serde_json::Value>,
) -> Result<(), String> {
    let url = format!("{GMAIL_BASE}{path}");
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

async fn twitter_post(token: &str, path: &str, body: serde_json::Value) -> Result<(), String> {
    let url = format!("{TWITTER_BASE}{path}");
    let resp = fetch_with_body("POST", &url, token, Some(body))
        .await
        .map_err(|e| e.to_string())?;
    if resp.status().is_success() {
        return Ok(());
    }
    let status = resp.status();
    if let Ok(json) = resp.json::<serde_json::Value>().await {
        if let Some(detail) = json.get("detail").and_then(|v| v.as_str()) {
            return Err(detail.to_string());
        }
        if let Some(title) = json.get("title").and_then(|v| v.as_str()) {
            return Err(title.to_string());
        }
    }
    Err(format!("Twitter API error: {status}"))
}

async fn twitter_delete(token: &str, path: &str) -> Result<(), String> {
    let url = format!("{TWITTER_BASE}{path}");
    let resp = fetch_with_body("DELETE", &url, token, None)
        .await
        .map_err(|e| e.to_string())?;
    if resp.status().is_success() {
        return Ok(());
    }
    let status = resp.status();
    if let Ok(json) = resp.json::<serde_json::Value>().await {
        if let Some(detail) = json.get("detail").and_then(|v| v.as_str()) {
            return Err(detail.to_string());
        }
        if let Some(title) = json.get("title").and_then(|v| v.as_str()) {
            return Err(title.to_string());
        }
    }
    Err(format!("Twitter API error: {status}"))
}

fn plugin_ok(message: &str, data: Option<serde_json::Value>) -> PluginResult {
    PluginResult {
        success: true,
        message: Some(message.to_string()),
        data,
    }
}

fn plugin_err(message: &str) -> PluginResult {
    PluginResult {
        success: false,
        message: Some(message.to_string()),
        data: None,
    }
}

async fn execute_gmail_action(command_id: &str, ctx: &PluginContext) -> PluginResult {
    let message_id = match extract_message_id(&ctx.event) {
        Some(id) => id,
        None => return plugin_err("No message ID provided"),
    };
    let action = match GmailAction::from_str(command_id) {
        Some(a) => a,
        None => return plugin_err(&format!("Command \"{command_id}\" not supported")),
    };
    match action {
        GmailAction::MarkRead => {
            if let Err(msg) = gmail_api(
                &ctx.access_token,
                "POST",
                &format!("/messages/{message_id}/modify"),
                Some(json!({ "removeLabelIds": [GMAIL_LABEL_UNREAD] })),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok("Marked message as read", Some(json!({ "messageId": message_id })))
        }
        GmailAction::MarkUnread => {
            if let Err(msg) = gmail_api(
                &ctx.access_token,
                "POST",
                &format!("/messages/{message_id}/modify"),
                Some(json!({ "addLabelIds": [GMAIL_LABEL_UNREAD] })),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok("Marked message as unread", Some(json!({ "messageId": message_id })))
        }
        GmailAction::Star => {
            if let Err(msg) = gmail_api(
                &ctx.access_token,
                "POST",
                &format!("/messages/{message_id}/modify"),
                Some(json!({ "addLabelIds": [GMAIL_LABEL_STARRED] })),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok("Starred message", Some(json!({ "messageId": message_id })))
        }
        GmailAction::Unstar => {
            if let Err(msg) = gmail_api(
                &ctx.access_token,
                "POST",
                &format!("/messages/{message_id}/modify"),
                Some(json!({ "removeLabelIds": [GMAIL_LABEL_STARRED] })),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok("Unstarred message", Some(json!({ "messageId": message_id })))
        }
        GmailAction::Trash => {
            if let Err(msg) = gmail_api(
                &ctx.access_token,
                "POST",
                &format!("/messages/{message_id}/trash"),
                None,
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok("Moved message to trash", Some(json!({ "messageId": message_id })))
        }
        GmailAction::Delete => {
            if let Err(msg) = gmail_api(
                &ctx.access_token,
                "DELETE",
                &format!("/messages/{message_id}"),
                None,
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok("Permanently deleted message", Some(json!({ "messageId": message_id })))
        }
        GmailAction::MarkSpam => {
            if let Err(msg) = gmail_api(
                &ctx.access_token,
                "POST",
                &format!("/messages/{message_id}/modify"),
                Some(json!({
                    "addLabelIds": [GMAIL_LABEL_SPAM],
                    "removeLabelIds": [GMAIL_LABEL_INBOX]
                })),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok("Marked message as spam", Some(json!({ "messageId": message_id })))
        }
        GmailAction::Archive => {
            if let Err(msg) = gmail_api(
                &ctx.access_token,
                "POST",
                &format!("/messages/{message_id}/modify"),
                Some(json!({ "removeLabelIds": [GMAIL_LABEL_INBOX] })),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok("Archived message", Some(json!({ "messageId": message_id })))
        }
        GmailAction::ApplyLabel => {
            let label_id = match extract_label_id(&ctx.config) {
                Some(label_id) => label_id,
                None => return plugin_err("No label ID provided in config"),
            };
            if let Err(msg) = gmail_api(
                &ctx.access_token,
                "POST",
                &format!("/messages/{message_id}/modify"),
                Some(json!({ "addLabelIds": [label_id] })),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok(
                &format!("Applied label: {label_id}"),
                Some(json!({ "messageId": message_id, "labelId": label_id })),
            )
        }
        GmailAction::RemoveLabel => {
            let label_id = match extract_label_id(&ctx.config) {
                Some(label_id) => label_id,
                None => return plugin_err("No label ID provided in config"),
            };
            if let Err(msg) = gmail_api(
                &ctx.access_token,
                "POST",
                &format!("/messages/{message_id}/modify"),
                Some(json!({ "removeLabelIds": [label_id] })),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok(
                &format!("Removed label: {label_id}"),
                Some(json!({ "messageId": message_id, "labelId": label_id })),
            )
        }
        GmailAction::MarkImportant => {
            if let Err(msg) = gmail_api(
                &ctx.access_token,
                "POST",
                &format!("/messages/{message_id}/modify"),
                Some(json!({ "addLabelIds": [GMAIL_LABEL_IMPORTANT] })),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok("Marked as important", Some(json!({ "messageId": message_id })))
        }
        GmailAction::MarkNotImportant => {
            if let Err(msg) = gmail_api(
                &ctx.access_token,
                "POST",
                &format!("/messages/{message_id}/modify"),
                Some(json!({ "removeLabelIds": [GMAIL_LABEL_IMPORTANT] })),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok("Marked as not important", Some(json!({ "messageId": message_id })))
        }
    }
}

async fn execute_twitter_action(command_id: &str, ctx: &PluginContext) -> PluginResult {
    let normalized = command_id.strip_prefix("twitter:").unwrap_or(command_id);
    match normalized {
        "like" => {
            let tweet_id = match extract_tweet_id(&ctx.event) {
                Some(id) => id,
                None => return plugin_err("Missing tweet ID or user ID"),
            };
            let user_id = match extract_twitter_user_id(&ctx.config) {
                Some(id) => id,
                None => return plugin_err("Missing tweet ID or user ID"),
            };
            if let Err(msg) = twitter_post(
                &ctx.access_token,
                &format!("/users/{user_id}/likes"),
                json!({ "tweet_id": tweet_id }),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok(&format!("Liked tweet {tweet_id}"), None)
        }
        "unlike" => {
            let tweet_id = match extract_tweet_id(&ctx.event) {
                Some(id) => id,
                None => return plugin_err("Missing tweet ID or user ID"),
            };
            let user_id = match extract_twitter_user_id(&ctx.config) {
                Some(id) => id,
                None => return plugin_err("Missing tweet ID or user ID"),
            };
            if let Err(msg) = twitter_delete(&ctx.access_token, &format!("/users/{user_id}/likes/{tweet_id}")).await {
                return plugin_err(&msg);
            }
            plugin_ok(&format!("Unliked tweet {tweet_id}"), None)
        }
        "retweet" => {
            let tweet_id = match extract_tweet_id(&ctx.event) {
                Some(id) => id,
                None => return plugin_err("Missing tweet ID or user ID"),
            };
            let user_id = match extract_twitter_user_id(&ctx.config) {
                Some(id) => id,
                None => return plugin_err("Missing tweet ID or user ID"),
            };
            if let Err(msg) = twitter_post(
                &ctx.access_token,
                &format!("/users/{user_id}/retweets"),
                json!({ "tweet_id": tweet_id }),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok(&format!("Retweeted tweet {tweet_id}"), None)
        }
        "unretweet" => {
            let tweet_id = match extract_tweet_id(&ctx.event) {
                Some(id) => id,
                None => return plugin_err("Missing tweet ID or user ID"),
            };
            let user_id = match extract_twitter_user_id(&ctx.config) {
                Some(id) => id,
                None => return plugin_err("Missing tweet ID or user ID"),
            };
            if let Err(msg) = twitter_delete(&ctx.access_token, &format!("/users/{user_id}/retweets/{tweet_id}")).await {
                return plugin_err(&msg);
            }
            plugin_ok(&format!("Undid retweet of {tweet_id}"), None)
        }
        "bookmark" => {
            let tweet_id = match extract_tweet_id(&ctx.event) {
                Some(id) => id,
                None => return plugin_err("Missing tweet ID or user ID"),
            };
            let user_id = match extract_twitter_user_id(&ctx.config) {
                Some(id) => id,
                None => return plugin_err("Missing tweet ID or user ID"),
            };
            if let Err(msg) = twitter_post(
                &ctx.access_token,
                &format!("/users/{user_id}/bookmarks"),
                json!({ "tweet_id": tweet_id }),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok(&format!("Bookmarked tweet {tweet_id}"), None)
        }
        "remove_bookmark" => {
            let tweet_id = match extract_tweet_id(&ctx.event) {
                Some(id) => id,
                None => return plugin_err("Missing tweet ID or user ID"),
            };
            let user_id = match extract_twitter_user_id(&ctx.config) {
                Some(id) => id,
                None => return plugin_err("Missing tweet ID or user ID"),
            };
            if let Err(msg) = twitter_delete(&ctx.access_token, &format!("/users/{user_id}/bookmarks/{tweet_id}")).await {
                return plugin_err(&msg);
            }
            plugin_ok(&format!("Removed bookmark from {tweet_id}"), None)
        }
        "mute_author" => {
            let author_id = match extract_twitter_author_id(&ctx.event) {
                Some(id) => id,
                None => return plugin_err("Missing author ID or user ID"),
            };
            let user_id = match extract_twitter_user_id(&ctx.config) {
                Some(id) => id,
                None => return plugin_err("Missing author ID or user ID"),
            };
            if let Err(msg) = twitter_post(
                &ctx.access_token,
                &format!("/users/{user_id}/muting"),
                json!({ "target_user_id": author_id }),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok(&format!("Muted user {author_id}"), None)
        }
        "block_author" => {
            let author_id = match extract_twitter_author_id(&ctx.event) {
                Some(id) => id,
                None => return plugin_err("Missing author ID or user ID"),
            };
            let user_id = match extract_twitter_user_id(&ctx.config) {
                Some(id) => id,
                None => return plugin_err("Missing author ID or user ID"),
            };
            if let Err(msg) = twitter_post(
                &ctx.access_token,
                &format!("/users/{user_id}/blocking"),
                json!({ "target_user_id": author_id }),
            )
            .await
            {
                return plugin_err(&msg);
            }
            plugin_ok(&format!("Blocked user {author_id}"), None)
        }
        _ => plugin_err(&format!("Command \"{command_id}\" not supported")),
    }
}

async fn execute_action(action: &ActionInput, ctx: &PluginContext) -> PluginResult {
    let plugin_id = action
        .plugin_id
        .clone()
        .unwrap_or_else(|| resolve_plugin_id(&ctx.event.source));
    let mut command_id = action
        .command_id
        .clone()
        .or_else(|| action.id.clone())
        .unwrap_or_default();

    if !plugin_id.is_empty() {
        let prefix = format!("{plugin_id}:");
        if command_id.starts_with(&prefix) {
            command_id = command_id[prefix.len()..].to_string();
        }
    }

    emit_progress(
        &ctx.on_progress,
        json!({
            "phase": "executing",
            "actionId": action.id,
            "actionName": action.name,
        }),
    );

    let result = match plugin_id.as_str() {
        "gmail" => execute_gmail_action(&command_id, ctx).await,
        "twitter" => execute_twitter_action(&command_id, ctx).await,
        _ => plugin_err(&format!("Plugin \"{plugin_id}\" not found. Is it registered?")),
    };

    if result.success {
        emit_progress(
            &ctx.on_progress,
            json!({
                "phase": "completed",
                "actionId": action.id,
                "actionName": action.name,
                "result": result,
            }),
        );
    } else {
        emit_progress(
            &ctx.on_progress,
            json!({
                "phase": "failed",
                "actionId": action.id,
                "actionName": action.name,
                "error": result.message.clone().unwrap_or_else(|| "Unknown error".to_string()),
            }),
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
            json!({
                "phase": "action_start",
                "actionId": action.id,
                "actionName": action.name,
                "pluginId": action.plugin_id,
                "commandId": action.command_id,
            }),
        );

        let result = execute_action(action, &ctx).await;
        if !result.success {
            all_success = false;
        }

        let action_result = ActionResult {
            action_id: action.id.clone(),
            action_name: action.name.clone(),
            plugin_id: action
                .plugin_id
                .clone()
                .or_else(|| Some(resolve_plugin_id(&ctx.event.source))),
            command_id: action.command_id.clone(),
            success: result.success,
            message: result.message.clone(),
            data: result.data.clone(),
        };
        results.push(action_result.clone());

        emit_progress(
            &on_progress,
            json!({
                "phase": "action_complete",
                "actionId": action.id,
                "actionName": action.name,
                "result": result,
            }),
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
            json!({
                "phase": "batch_event_start",
                "eventIndex": i,
                "totalEvents": events.len(),
                "event": event,
            }),
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
            json!({
                "phase": "batch_event_complete",
                "eventIndex": i,
                "totalEvents": events.len(),
                "event": event,
                "result": result,
            }),
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
