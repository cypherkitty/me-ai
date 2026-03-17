use async_openai::{
    config::OpenAIConfig,
    types::responses::{
        CreateResponseArgs, EasyInputContent, EasyInputMessage, InputItem, InputParam, OutputItem,
        OutputMessageContent, Reasoning, ReasoningEffort, Role,
    },
};
use js_sys::Function;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::str::FromStr;
use wasm_bindgen::prelude::*;

use crate::error::CoreError;

#[wasm_bindgen(typescript_custom_section)]
const CLIENT_TYPES: &'static str = r#"
export type ApiProvider = "openai" | "anthropic" | "google" | "xai";

export interface ChatMessage {
    role: string;
    content: string;
}

export interface TokenPayload {
    content: string;
    done: boolean;
    inputTokens: number;
    outputTokens: number;
}

export interface ApiStreamOptions {
    temperature?: number;
    maxTokens?: number;
    reasoningEffort?: string;
}
"#;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Provider {
    OpenAi,
    Anthropic,
    Google,
    Xai,
}

impl FromStr for Provider {
    type Err = CoreError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "openai" => Ok(Provider::OpenAi),
            "anthropic" => Ok(Provider::Anthropic),
            "google" => Ok(Provider::Google),
            "xai" => Ok(Provider::Xai),
            _ => Err(CoreError::Llm(format!("unknown provider: {s}"))),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenPayload {
    pub content: String,
    pub done: bool,
    pub input_tokens: u32,
    pub output_tokens: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamOptions {
    pub temperature: Option<f64>,
    pub max_tokens: Option<u32>,
    pub reasoning_effort: Option<String>,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn emit_token(on_token: &Function, payload: &TokenPayload) {
    if let Ok(val) = serde_wasm_bindgen::to_value(payload) {
        let _ = on_token.call1(&JsValue::NULL, &val);
    }
}

async fn http_fetch(
    method: &str,
    url: &str,
    headers: &[(&str, &str)],
    body: Option<String>,
) -> Result<(u16, String), CoreError> {
    let client = Client::new();
    let mut builder = match method {
        "POST" => client.post(url),
        _ => client.get(url),
    };
    for (k, v) in headers {
        builder = builder.header(*k, *v);
    }
    if let Some(b) = body {
        builder = builder.body(b);
    }
    let response = builder.send().await.map_err(|e| CoreError::Llm(e.to_string()))?;
    let status = response.status().as_u16();
    let text = response.text().await.map_err(|e| CoreError::Llm(e.to_string()))?;
    Ok((status, text))
}

/// Parse all `data:` lines from a complete SSE response body.
fn parse_sse_text(text: &str) -> Vec<String> {
    let mut results = Vec::new();
    for line in text.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() || !trimmed.starts_with("data:") {
            continue;
        }
        let data_str = trimmed[5..].trim();
        if data_str == "[DONE]" {
            break;
        }
        results.push(data_str.to_string());
    }
    results
}

// ---------------------------------------------------------------------------
// Per-provider implementations
// ---------------------------------------------------------------------------

async fn call_openai(
    model_name: &str,
    api_key: &str,
    messages: Vec<ChatMessage>,
    options: &StreamOptions,
    on_token: &Function,
) -> Result<(), CoreError> {
    let openai_client = async_openai::Client::with_config(
        OpenAIConfig::new().with_api_key(api_key),
    );

    // Separate system messages (→ instructions) from the rest (→ input items).
    let system_text: String = messages
        .iter()
        .filter(|m| m.role == "system")
        .map(|m| m.content.as_str())
        .collect::<Vec<_>>()
        .join("\n");

    let input_items: Vec<InputItem> = messages
        .iter()
        .filter(|m| m.role != "system")
        .map(|m| {
            let role = match m.role.as_str() {
                "assistant" => Role::Assistant,
                _ => Role::User,
            };
            InputItem::EasyMessage(EasyInputMessage {
                role,
                content: EasyInputContent::Text(m.content.clone()),
                r#type: Default::default(),
            })
        })
        .collect();

    let mut req_builder = CreateResponseArgs::default();
    req_builder.model(model_name.to_string());
    req_builder.input(InputParam::Items(input_items));
    req_builder.stream(false);

    if !system_text.is_empty() {
        req_builder.instructions(system_text);
    }
    if let Some(max) = options.max_tokens {
        req_builder.max_output_tokens(max);
    }
    if let Some(ref effort_str) = options.reasoning_effort {
        let effort = match effort_str.as_str() {
            "low" => ReasoningEffort::Low,
            "high" => ReasoningEffort::High,
            _ => ReasoningEffort::Medium,
        };
        req_builder.reasoning(Reasoning { effort: Some(effort), summary: None });
    }

    let request = req_builder.build().map_err(|e| CoreError::Llm(e.to_string()))?;

    let response = openai_client
        .responses()
        .create(request)
        .await
        .map_err(|e| CoreError::Llm(e.to_string()))?;

    // Collect all output text from the response.
    let mut full_text = String::new();
    for item in &response.output {
        if let OutputItem::Message(msg) = item {
            for content_part in &msg.content {
                if let OutputMessageContent::OutputText(t) = content_part {
                    full_text.push_str(&t.text);
                }
            }
        }
    }

    let (input_tokens, output_tokens) = response
        .usage
        .map(|u| (u.input_tokens, u.output_tokens))
        .unwrap_or((0, 0));

    // Emit the full text as a single token chunk, then the done sentinel.
    if !full_text.is_empty() {
        emit_token(
            on_token,
            &TokenPayload {
                content: full_text,
                done: false,
                input_tokens,
                output_tokens,
            },
        );
    }

    emit_token(
        on_token,
        &TokenPayload { content: String::new(), done: true, input_tokens, output_tokens },
    );
    Ok(())
}

async fn call_anthropic(
    model_name: &str,
    api_key: &str,
    messages: Vec<ChatMessage>,
    options: &StreamOptions,
    on_token: &Function,
) -> Result<(), CoreError> {
    let headers: &[(&str, &str)] = &[
        ("x-api-key", api_key),
        ("anthropic-version", "2023-06-01"),
        ("anthropic-dangerous-direct-browser-access", "true"),
        ("content-type", "application/json"),
    ];

    let system_content: String = messages
        .iter()
        .filter(|m| m.role == "system")
        .map(|m| m.content.clone())
        .collect::<Vec<_>>()
        .join("\n");

    let non_system: Vec<Value> = messages
        .iter()
        .filter(|m| m.role != "system")
        .map(|m| serde_json::json!({ "role": m.role, "content": m.content }))
        .collect();

    let mut body = serde_json::json!({
        "model": model_name,
        "messages": non_system,
        "max_tokens": options.max_tokens.unwrap_or(4096),
        "stream": true,
    });
    if !system_content.is_empty() {
        body["system"] = serde_json::json!(system_content);
    }
    if let Some(temp) = options.temperature {
        body["temperature"] = serde_json::json!(temp);
    }

    let body_str = serde_json::to_string(&body).map_err(|e| CoreError::Llm(e.to_string()))?;
    let (status, text) =
        http_fetch("POST", "https://api.anthropic.com/v1/messages", headers, Some(body_str)).await?;

    if !(200..300).contains(&status) {
        return Err(CoreError::Llm(format!("anthropic API error ({status}): {text}")));
    }

    let mut input_tokens: u32 = 0;
    let mut output_tokens: u32 = 0;

    for data_str in parse_sse_text(&text) {
        if let Ok(parsed) = serde_json::from_str::<Value>(&data_str) {
            let event_type = parsed.get("type").and_then(|v| v.as_str()).unwrap_or("");
            match event_type {
                "message_start" => {
                    if let Some(it) = parsed
                        .pointer("/message/usage/input_tokens")
                        .and_then(|v| v.as_u64())
                    {
                        input_tokens = it as u32;
                    }
                }
                "content_block_delta" => {
                    if let Some(delta_text) =
                        parsed.pointer("/delta/text").and_then(|v| v.as_str())
                    {
                        emit_token(
                            on_token,
                            &TokenPayload {
                                content: delta_text.to_string(),
                                done: false,
                                input_tokens,
                                output_tokens,
                            },
                        );
                    }
                }
                "message_delta" => {
                    if let Some(ot) =
                        parsed.pointer("/usage/output_tokens").and_then(|v| v.as_u64())
                    {
                        output_tokens = ot as u32;
                    }
                }
                _ => {}
            }
        }
    }

    emit_token(
        on_token,
        &TokenPayload { content: String::new(), done: true, input_tokens, output_tokens },
    );
    Ok(())
}

async fn call_google(
    model_name: &str,
    api_key: &str,
    messages: Vec<ChatMessage>,
    options: &StreamOptions,
    on_token: &Function,
) -> Result<(), CoreError> {
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/{model_name}:streamGenerateContent?key={api_key}&alt=sse"
    );
    let headers: &[(&str, &str)] = &[("content-type", "application/json")];

    let system_content: String = messages
        .iter()
        .filter(|m| m.role == "system")
        .map(|m| m.content.clone())
        .collect::<Vec<_>>()
        .join("\n");

    let contents: Vec<Value> = messages
        .iter()
        .filter(|m| m.role != "system")
        .map(|m| {
            let role = if m.role == "assistant" { "model" } else { "user" };
            serde_json::json!({ "role": role, "parts": [{ "text": m.content }] })
        })
        .collect();

    let mut body = serde_json::json!({ "contents": contents });
    let mut gen_config = serde_json::json!({});
    if let Some(temp) = options.temperature {
        gen_config["temperature"] = serde_json::json!(temp);
    }
    if let Some(max) = options.max_tokens {
        gen_config["maxOutputTokens"] = serde_json::json!(max);
    }
    body["generationConfig"] = gen_config;
    if !system_content.is_empty() {
        body["systemInstruction"] =
            serde_json::json!({ "parts": [{ "text": system_content }] });
    }

    let body_str = serde_json::to_string(&body).map_err(|e| CoreError::Llm(e.to_string()))?;
    let (status, text) = http_fetch("POST", &url, headers, Some(body_str)).await?;

    if !(200..300).contains(&status) {
        return Err(CoreError::Llm(format!("google API error ({status}): {text}")));
    }

    for data_str in parse_sse_text(&text) {
        if let Ok(parsed) = serde_json::from_str::<Value>(&data_str) {
            if let Some(part_text) = parsed
                .pointer("/candidates/0/content/parts/0/text")
                .and_then(|v| v.as_str())
            {
                emit_token(
                    on_token,
                    &TokenPayload {
                        content: part_text.to_string(),
                        done: false,
                        input_tokens: 0,
                        output_tokens: 0,
                    },
                );
            }
        }
    }

    emit_token(
        on_token,
        &TokenPayload {
            content: String::new(),
            done: true,
            input_tokens: 0,
            output_tokens: 0,
        },
    );
    Ok(())
}

async fn call_xai(
    model_name: &str,
    api_key: &str,
    messages: Vec<ChatMessage>,
    options: &StreamOptions,
    on_token: &Function,
) -> Result<(), CoreError> {
    let auth = format!("Bearer {api_key}");
    let headers: &[(&str, &str)] = &[("authorization", &auth), ("content-type", "application/json")];

    let msgs: Vec<Value> = messages
        .iter()
        .map(|m| serde_json::json!({ "role": m.role, "content": m.content }))
        .collect();

    let mut body = serde_json::json!({
        "model": model_name,
        "messages": msgs,
        "stream": true,
    });
    if let Some(temp) = options.temperature {
        body["temperature"] = serde_json::json!(temp);
    }
    if let Some(max) = options.max_tokens {
        body["max_tokens"] = serde_json::json!(max);
    }

    let body_str = serde_json::to_string(&body).map_err(|e| CoreError::Llm(e.to_string()))?;
    let (status, text) =
        http_fetch("POST", "https://api.x.ai/v1/chat/completions", headers, Some(body_str)).await?;

    if !(200..300).contains(&status) {
        return Err(CoreError::Llm(format!("xai API error ({status}): {text}")));
    }

    let mut input_tokens: u32 = 0;
    let mut output_tokens: u32 = 0;

    for data_str in parse_sse_text(&text) {
        if let Ok(parsed) = serde_json::from_str::<Value>(&data_str) {
            if let Some(content) =
                parsed.pointer("/choices/0/delta/content").and_then(|v| v.as_str())
            {
                emit_token(
                    on_token,
                    &TokenPayload {
                        content: content.to_string(),
                        done: false,
                        input_tokens,
                        output_tokens,
                    },
                );
            }
            if let Some(usage) = parsed.get("usage") {
                input_tokens = usage
                    .get("prompt_tokens")
                    .and_then(|v| v.as_u64())
                    .unwrap_or(input_tokens as u64) as u32;
                output_tokens = usage
                    .get("completion_tokens")
                    .and_then(|v| v.as_u64())
                    .unwrap_or(output_tokens as u64) as u32;
            }
        }
    }

    emit_token(
        on_token,
        &TokenPayload { content: String::new(), done: true, input_tokens, output_tokens },
    );
    Ok(())
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

pub async fn stream_api_chat(
    provider: &str,
    model_name: &str,
    api_key: &str,
    messages: Vec<ChatMessage>,
    options: StreamOptions,
    on_token: &Function,
) -> Result<(), CoreError> {
    let provider = provider.parse::<Provider>()?;
    match provider {
        Provider::OpenAi => call_openai(model_name, api_key, messages, &options, on_token).await,
        Provider::Anthropic => {
            call_anthropic(model_name, api_key, messages, &options, on_token).await
        }
        Provider::Google => call_google(model_name, api_key, messages, &options, on_token).await,
        Provider::Xai => call_xai(model_name, api_key, messages, &options, on_token).await,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_sse_text_empty() {
        assert_eq!(parse_sse_text(""), Vec::<String>::new());
    }

    #[test]
    fn parse_sse_text_ignores_non_data_lines() {
        let input = "event: message\nid: 1\n: comment\n";
        assert_eq!(parse_sse_text(input), Vec::<String>::new());
    }

    #[test]
    fn parse_sse_text_done_sentinel_breaks_loop() {
        let input = "data: first\ndata: [DONE]\ndata: never_seen\n";
        assert_eq!(parse_sse_text(input), vec!["first"]);
    }

    #[test]
    fn parse_sse_text_extracts_and_trims_data_lines() {
        let input = "data:  hello \ndata: world\n";
        assert_eq!(parse_sse_text(input), vec!["hello", "world"]);
    }

    #[test]
    fn parse_sse_text_mixed_input() {
        let input = "\ndata: alpha\n: comment\nevent: ping\ndata: beta\ndata: [DONE]\ndata: ignored\n";
        assert_eq!(parse_sse_text(input), vec!["alpha", "beta"]);
    }
}

pub async fn test_api_connection(provider: &str, api_key: &str) -> Result<bool, CoreError> {
    let provider = provider.parse::<Provider>()?;
    let auth = format!("Bearer {api_key}");
    match provider {
        Provider::OpenAi => {
            let headers: &[(&str, &str)] = &[("authorization", &auth)];
            let (status, _) =
                http_fetch("GET", "https://api.openai.com/v1/models", headers, None).await?;
            Ok((200..300).contains(&status))
        }
        Provider::Anthropic => {
            let body = serde_json::json!({
                "model": "claude-haiku-4-5-20251001",
                "max_tokens": 1,
                "messages": [{ "role": "user", "content": "hi" }],
            });
            let body_str =
                serde_json::to_string(&body).map_err(|e| CoreError::Llm(e.to_string()))?;
            let headers: &[(&str, &str)] = &[
                ("x-api-key", api_key),
                ("anthropic-version", "2023-06-01"),
                ("anthropic-dangerous-direct-browser-access", "true"),
                ("content-type", "application/json"),
            ];
            let (status, _) =
                http_fetch("POST", "https://api.anthropic.com/v1/messages", headers, Some(body_str))
                    .await?;
            Ok((200..300).contains(&status))
        }
        Provider::Google => {
            let url = format!(
                "https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
            );
            let (status, _) = http_fetch("GET", &url, &[], None).await?;
            Ok((200..300).contains(&status))
        }
        Provider::Xai => {
            let headers: &[(&str, &str)] = &[("authorization", &auth)];
            let (status, _) =
                http_fetch("GET", "https://api.x.ai/v1/models", headers, None).await?;
            Ok((200..300).contains(&status))
        }
    }
}
