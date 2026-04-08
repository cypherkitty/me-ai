//! Chat session helpers (pure logic). Persistence stays in `localStorage` from TS.

use getrandom::getrandom;
use wasm_bindgen::prelude::*;

use crate::error::CoreError;

const MAX_TITLE_LENGTH: usize = 72;
const MAX_SUBTITLE_LEN: usize = 82;

fn safe_hex_uuid() -> Result<String, CoreError> {
    let mut b = [0u8; 16];
    getrandom(&mut b).map_err(|e| CoreError::Plugin(format!("chat id: {e}")))?;
    Ok(b.iter().map(|x| format!("{x:02x}")).collect())
}

/// `prefix` + `_` + 32-char hex (browser `randomUUID`-like uniqueness).
#[wasm_bindgen(js_name = makeChatEntityId)]
pub fn make_chat_entity_id(prefix: &str) -> Result<String, JsValue> {
    let hex = safe_hex_uuid().map_err(|e| JsValue::from_str(&e.to_string()))?;
    Ok(format!("{prefix}_{hex}"))
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn subtitle_empty_array() {
        assert_eq!(session_subtitle_from_messages_json("[]"), "No messages yet");
    }

    #[test]
    fn normalize_title_strips_markdown() {
        let raw = r#"**Hello** title"#;
        let out = normalize_generated_chat_title(raw, "[]");
        assert_eq!(out, "Hello title");
    }
}
