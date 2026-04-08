//! Chat sessions: IDs, titles, normalization, and persistence via IndexedDB (`settings` store).

use getrandom::getrandom;
use serde::{Deserialize, Deserializer, Serialize};
use serde_json::{json, Value};
use tsify_next::Tsify;
use wasm_bindgen::prelude::*;

use crate::db::RexieDb;
use crate::error::CoreError;

fn deserialize_string_or_empty<'de, D>(deserializer: D) -> Result<String, D::Error>
where
    D: Deserializer<'de>,
{
    Ok(Option::<String>::deserialize(deserializer)?.unwrap_or_default())
}

fn deserialize_f64_or_zero<'de, D>(deserializer: D) -> Result<f64, D::Error>
where
    D: Deserializer<'de>,
{
    Ok(Option::<f64>::deserialize(deserializer)?.unwrap_or(0.0))
}

/// Typed view of a minimal saved message (full payloads use [`serde_json::Value`] in [`ChatSessionRecord::messages`]).
#[derive(Clone, Debug, Default, Serialize, Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct PersistedChatMessage {
    #[serde(default, deserialize_with = "deserialize_string_or_empty")]
    pub id: String,
    #[serde(default, deserialize_with = "deserialize_string_or_empty")]
    pub role: String,
    #[serde(rename = "type", default, deserialize_with = "deserialize_string_or_empty")]
    pub message_type: String,
    #[serde(default, deserialize_with = "deserialize_string_or_empty")]
    pub content: String,
    #[serde(default, deserialize_with = "deserialize_f64_or_zero")]
    pub created_at: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize, Tsify, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ChatTitleStatus {
    Idle,
    Pending,
    Ready,
}

#[derive(Clone, Debug, Default, Serialize, Deserialize, Tsify, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ChatTitleSource {
    #[default]
    Unset,
    Model,
    Manual,
}

fn deserialize_title_source<'de, D>(deserializer: D) -> Result<ChatTitleSource, D::Error>
where
    D: Deserializer<'de>,
{
    Ok(Option::<ChatTitleSource>::deserialize(deserializer)?.unwrap_or_default())
}

/// One chat thread persisted under [`CHAT_SESSIONS_SETTING_KEY`] (JSON in `settings`). `messages` are arbitrary JSON objects to preserve UI fields (`thinking`, `pendingData`, …).
#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct ChatSessionRecord {
    pub id: String,
    #[serde(default, deserialize_with = "deserialize_string_or_empty")]
    pub title: String,
    pub title_status: ChatTitleStatus,
    #[serde(default, deserialize_with = "deserialize_title_source")]
    pub title_source: ChatTitleSource,
    pub created_at: f64,
    pub updated_at: f64,
    #[tsify(type = "unknown[]")]
    pub messages: Vec<Value>,
}

/// Root object stored as JSON in [`CHAT_SESSIONS_SETTING_KEY`].
#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct ChatSessionsSnapshot {
    #[serde(default = "default_snapshot_version")]
    pub version: u32,
    #[serde(default, deserialize_with = "deserialize_string_or_empty")]
    pub active_chat_id: String,
    pub sessions: Vec<ChatSessionRecord>,
}

fn default_snapshot_version() -> u32 {
    1
}

/// Result of [`load_chat_sessions`].
#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[serde(rename_all = "camelCase")]
#[tsify(into_wasm_abi)]
pub struct ChatSessionsLoadResult {
    pub active_chat_id: String,
    pub sessions: Vec<ChatSessionRecord>,
}

/// IndexedDB `settings` key for the chat snapshot JSON.
pub const CHAT_SESSIONS_SETTING_KEY: &str = "me_ai_chat_sessions_v1";

const MAX_TITLE_LENGTH: usize = 72;
const MAX_SUBTITLE_LEN: usize = 82;

fn safe_hex_uuid() -> Result<String, CoreError> {
    let mut b = [0u8; 16];
    getrandom(&mut b).map_err(|e| CoreError::Plugin(format!("chat id: {e}")))?;
    Ok(b.iter().map(|x| format!("{x:02x}")).collect())
}

fn make_entity_id_core(prefix: &str) -> Result<String, CoreError> {
    let hex = safe_hex_uuid()?;
    Ok(format!("{prefix}_{hex}"))
}

#[wasm_bindgen(js_name = makeChatEntityId)]
pub fn make_chat_entity_id(prefix: &str) -> Result<String, JsValue> {
    make_entity_id_core(prefix).map_err(|e| JsValue::from_str(&e.to_string()))
}

pub(crate) fn create_chat_session(now: f64) -> Result<ChatSessionRecord, CoreError> {
    let id = make_entity_id_core("chat")?;
    Ok(ChatSessionRecord {
        id,
        title: String::new(),
        title_status: ChatTitleStatus::Idle,
        title_source: ChatTitleSource::Unset,
        created_at: now,
        updated_at: now,
        messages: vec![],
    })
}

/// Merge id / `createdAt` defaults; preserve all other JSON keys on the message.
pub(crate) fn normalize_message_value(msg: Value, fallback_time: f64) -> Value {
    let mut obj = match msg {
        Value::Object(m) => m,
        _ => serde_json::Map::new(),
    };
    let created_at = obj
        .get("createdAt")
        .and_then(|v| v.as_f64())
        .filter(|f| f.is_finite())
        .unwrap_or(fallback_time);
    let id = obj
        .get("id")
        .and_then(|v| v.as_str())
        .filter(|s| !s.is_empty())
        .map(|s| s.to_string())
        .unwrap_or_else(|| {
            make_entity_id_core("msg").unwrap_or_else(|_| format!("msg_{}", created_at as i64))
        });
    obj.insert("createdAt".into(), json!(created_at));
    obj.insert("id".into(), json!(id));
    Value::Object(obj)
}

pub(crate) fn normalize_session_value(raw: Value, fallback_time: f64) -> ChatSessionRecord {
    let obj = raw.as_object().cloned().unwrap_or_default();
    let created_at = obj
        .get("createdAt")
        .and_then(|v| v.as_f64())
        .filter(|f| f.is_finite())
        .unwrap_or(fallback_time);
    let messages_arr: Vec<Value> = obj
        .get("messages")
        .and_then(|v| v.as_array())
        .cloned()
        .unwrap_or_default();
    let messages: Vec<Value> = messages_arr
        .into_iter()
        .enumerate()
        .map(|(i, m)| normalize_message_value(m, created_at + i as f64))
        .collect();
    let updated_at = obj
        .get("updatedAt")
        .and_then(|v| v.as_f64())
        .filter(|f| f.is_finite())
        .or_else(|| {
            messages
                .last()
                .and_then(|m| m.get("createdAt"))
                .and_then(|v| v.as_f64())
        })
        .unwrap_or(created_at);
    let title_status = match obj.get("titleStatus").and_then(|v| v.as_str()) {
        Some("pending") => ChatTitleStatus::Pending,
        Some("ready") => ChatTitleStatus::Ready,
        Some("idle") => ChatTitleStatus::Idle,
        _ => {
            if obj
                .get("title")
                .and_then(|v| v.as_str())
                .is_some_and(|s| !s.trim().is_empty())
            {
                ChatTitleStatus::Ready
            } else if messages.iter().any(|m| {
                m.get("role").and_then(|v| v.as_str()) == Some("user")
            }) {
                ChatTitleStatus::Pending
            } else {
                ChatTitleStatus::Idle
            }
        }
    };
    let id = obj
        .get("id")
        .and_then(|v| v.as_str())
        .filter(|s| !s.is_empty())
        .map(|s| s.to_string())
        .unwrap_or_else(|| {
            make_entity_id_core("chat").unwrap_or_else(|_| format!("chat_{}", created_at as i64))
        });
    let title = obj
        .get("title")
        .and_then(|v| v.as_str())
        .map(|s| s.trim().to_string())
        .unwrap_or_default();
    let title_source = match obj.get("titleSource").and_then(|v| v.as_str()) {
        Some("manual") => ChatTitleSource::Manual,
        Some("model") => ChatTitleSource::Model,
        _ => ChatTitleSource::Unset,
    };
    ChatSessionRecord {
        id,
        title,
        title_status,
        title_source,
        created_at,
        updated_at,
        messages,
    }
}

pub async fn load_chat_sessions(db: &RexieDb) -> Result<ChatSessionsLoadResult, CoreError> {
    let now = js_sys::Date::now();
    let raw = crate::storage::schema::get_setting(db, CHAT_SESSIONS_SETTING_KEY).await?;
    let Some(json) = raw else {
        let session = create_chat_session(now)?;
        let id = session.id.clone();
        return Ok(ChatSessionsLoadResult {
            active_chat_id: id,
            sessions: vec![session],
        });
    };
    let v: Value = match serde_json::from_str(&json) {
        Ok(x) => x,
        Err(_) => return finalize_empty_or_invalid(now),
    };
    let sessions_val = v
        .get("sessions")
        .and_then(|x| x.as_array())
        .cloned()
        .unwrap_or_default();
    let sessions: Vec<ChatSessionRecord> = sessions_val
        .into_iter()
        .enumerate()
        .map(|(i, s)| normalize_session_value(s, now + i as f64))
        .collect();
    if sessions.is_empty() {
        return finalize_empty_or_invalid(now);
    }
    let active_chat_id = v
        .get("activeChatId")
        .and_then(|x| x.as_str())
        .map(String::from)
        .filter(|aid| sessions.iter().any(|s| s.id == *aid))
        .unwrap_or_else(|| sessions[0].id.clone());
    Ok(ChatSessionsLoadResult {
        active_chat_id,
        sessions,
    })
}

fn finalize_empty_or_invalid(now: f64) -> Result<ChatSessionsLoadResult, CoreError> {
    let session = create_chat_session(now)?;
    let id = session.id.clone();
    Ok(ChatSessionsLoadResult {
        active_chat_id: id,
        sessions: vec![session],
    })
}

pub async fn save_chat_sessions(
    db: &RexieDb,
    active_chat_id: Option<String>,
    sessions: &[ChatSessionRecord],
) -> Result<(), CoreError> {
    let active_chat_id = active_chat_id
        .filter(|s| !s.is_empty())
        .or_else(|| sessions.first().map(|s| s.id.clone()))
        .unwrap_or_default();
    let snapshot = ChatSessionsSnapshot {
        version: 1,
        active_chat_id,
        sessions: sessions.to_vec(),
    };
    let json = serde_json::to_string(&snapshot).map_err(|e| CoreError::Serialize(e.to_string()))?;
    crate::storage::schema::set_setting(db, CHAT_SESSIONS_SETTING_KEY, &json).await
}

pub async fn clear_chat_sessions(db: &RexieDb) -> Result<(), CoreError> {
    crate::storage::schema::remove_setting(db, CHAT_SESSIONS_SETTING_KEY).await
}

/// Import a chat sessions JSON snapshot and persist it to IndexedDB.
pub async fn import_chat_sessions_from_json(db: &RexieDb, json: &str) -> Result<(), CoreError> {
    let json = json.trim();
    if json.is_empty() {
        return Ok(());
    }
    let v: Value = serde_json::from_str(json).map_err(|e| CoreError::Deserialize(e.to_string()))?;
    let now = js_sys::Date::now();
    let sessions_val = v
        .get("sessions")
        .and_then(|x| x.as_array())
        .cloned()
        .unwrap_or_default();
    let sessions: Vec<ChatSessionRecord> = sessions_val
        .into_iter()
        .enumerate()
        .map(|(i, s)| normalize_session_value(s, now + i as f64))
        .collect();
    if sessions.is_empty() {
        return Ok(());
    }
    let active_chat_id = v.get("activeChatId").and_then(|x| x.as_str()).map(String::from);
    save_chat_sessions(db, active_chat_id, &sessions).await
}

#[wasm_bindgen(js_name = normalizeChatMessage)]
pub fn normalize_chat_message(msg: JsValue, fallback_time: f64) -> Result<JsValue, JsValue> {
    let v: Value =
        serde_wasm_bindgen::from_value(msg).map_err(|e| JsValue::from_str(&e.to_string()))?;
    let out = normalize_message_value(v, fallback_time);
    serde_wasm_bindgen::to_value(&out).map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen(js_name = fallbackChatTitleFromMessagesJson)]
pub fn fallback_chat_title_from_messages_json(messages_json: &str) -> Option<String> {
    first_user_message_content_for_title(messages_json)
        .and_then(|s| fallback_chat_title_from_user_content(&s))
}

#[wasm_bindgen(js_name = fallbackChatTitleFromUserContent)]
pub fn fallback_chat_title_from_user_content(content: &str) -> Option<String> {
    let compact: String = content.split_whitespace().collect::<Vec<_>>().join(" ");
    let compact = compact.trim();
    if compact.is_empty() {
        return None;
    }
    Some(if compact.chars().count() > MAX_TITLE_LENGTH {
        let truncated: String = compact.chars().take(MAX_TITLE_LENGTH - 1).collect();
        format!("{}…", truncated.trim_end())
    } else {
        compact.to_string()
    })
}

#[wasm_bindgen(js_name = firstUserMessageContentForTitle)]
pub fn first_user_message_content_for_title(messages_json: &str) -> Option<String> {
    let Ok(arr) = serde_json::from_str::<Vec<serde_json::Value>>(messages_json) else {
        return None;
    };
    for msg in arr {
        let role = msg.get("role").and_then(|v| v.as_str()).unwrap_or("");
        if role != "user" {
            continue;
        }
        let content = msg.get("content").and_then(|v| v.as_str()).unwrap_or("");
        if !content.is_empty() {
            return Some(content.to_string());
        }
    }
    None
}

#[wasm_bindgen(js_name = normalizeGeneratedChatTitle)]
pub fn normalize_generated_chat_title(raw: &str, messages_json: &str) -> String {
    let fallback = first_user_message_content_for_title(messages_json).and_then(|s| {
        fallback_chat_title_from_user_content(&s)
    });

    let mut cleaned = raw.trim().to_string();
    cleaned = cleaned.trim_start_matches(&['\'', '"', '`'][..]).to_string();
    cleaned = cleaned.trim_end_matches(&['\'', '"', '`'][..]).to_string();
    if cleaned.to_lowercase().starts_with("title:") {
        cleaned = cleaned[6..].trim().to_string();
    }
    cleaned = cleaned.lines().next().unwrap_or("").to_string();
    cleaned = cleaned
        .chars()
        .filter(|c| !matches!(c, '*' | '_' | '#'))
        .collect::<String>();
    cleaned = cleaned.split_whitespace().collect::<Vec<_>>().join(" ");
    cleaned = cleaned.trim().to_string();

    if !cleaned.is_empty() {
        return if cleaned.chars().count() > MAX_TITLE_LENGTH {
            let t: String = cleaned.chars().take(MAX_TITLE_LENGTH - 1).collect();
            format!("{}…", t.trim_end())
        } else {
            cleaned
        };
    }

    fallback.unwrap_or_else(|| "Untitled chat".to_string())
}

#[wasm_bindgen(js_name = sessionSubtitleFromMessagesJson)]
pub fn session_subtitle_from_messages_json(messages_json: &str) -> String {
    let Ok(arr) = serde_json::from_str::<Vec<serde_json::Value>>(messages_json) else {
        return "No messages yet".to_string();
    };
    let mut last_text: Option<&str> = None;
    for msg in arr.iter().rev() {
        if let Some(s) = msg.get("content").and_then(|v| v.as_str()) {
            if !s.trim().is_empty() {
                last_text = Some(s);
                break;
            }
        }
    }
    let Some(text) = last_text else {
        return "No messages yet".to_string();
    };
    let compact: String = text.split_whitespace().collect::<Vec<_>>().join(" ");
    let compact = compact.trim();
    if compact.is_empty() {
        return "No messages yet".to_string();
    }
    if compact.chars().count() > MAX_SUBTITLE_LEN {
        let t: String = compact.chars().take(MAX_SUBTITLE_LEN - 1).collect();
        format!("{}…", t.trim_end())
    } else {
        compact.to_string()
    }
}

#[wasm_bindgen(js_name = parseChatSessionsSnapshotJson)]
pub fn parse_chat_sessions_snapshot_json(json: &str) -> Result<ChatSessionsSnapshot, JsValue> {
    serde_json::from_str(json).map_err(|e| JsValue::from_str(&e.to_string()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn subtitle_empty_array() {
        assert_eq!(session_subtitle_from_messages_json("[]"), "No messages yet");
    }

    #[test]
    fn normalize_title_strips_markdown() {
        let raw = r"**Hello** title";
        let out = normalize_generated_chat_title(raw, "[]");
        assert_eq!(out, "Hello title");
    }

    #[test]
    fn chat_sessions_snapshot_json_round_trip() {
        let msg = json!({
            "id": "msg_1",
            "role": "user",
            "type": "text",
            "content": "yo",
            "createdAt": 15.0
        });
        let snap = ChatSessionsSnapshot {
            version: 1,
            active_chat_id: "chat_abcd".into(),
            sessions: vec![ChatSessionRecord {
                id: "chat_abcd".into(),
                title: " Hello ".into(),
                title_status: ChatTitleStatus::Pending,
                title_source: ChatTitleSource::Model,
                created_at: 10.0,
                updated_at: 20.0,
                messages: vec![msg],
            }],
        };
        let json = serde_json::to_string(&snap).unwrap();
        let back: ChatSessionsSnapshot = serde_json::from_str(&json).unwrap();
        assert_eq!(back.version, 1);
        assert_eq!(back.sessions.len(), 1);
        assert_eq!(back.sessions[0].title_status, ChatTitleStatus::Pending);
        assert_eq!(
            back.sessions[0].messages[0].get("type").and_then(|v| v.as_str()),
            Some("text")
        );
    }

    #[test]
    fn persisted_message_deserializes_type_field() {
        let j = r#"{"role":"user","content":"x","type":"tool"}"#;
        let m: PersistedChatMessage = serde_json::from_str(j).unwrap();
        assert_eq!(m.message_type, "tool");
    }

    #[test]
    fn normalize_message_keeps_extra_keys() {
        let v = json!({"role":"assistant","content":"a","thinking":"t"});
        let out = normalize_message_value(v, 100.0);
        assert_eq!(out.get("thinking").and_then(|x| x.as_str()), Some("t"));
        assert!(out.get("id").is_some());
        assert_eq!(out.get("createdAt").and_then(|x| x.as_f64()), Some(100.0));
    }
}
