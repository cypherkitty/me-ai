use js_sys::{Function, Promise};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;

use crate::error::CoreError;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

fn js_error_string(e: &JsValue) -> String {
    e.as_string()
        .or_else(|| {
            js_sys::Reflect::get(e, &JsValue::from_str("message"))
                .ok()
                .and_then(|v| v.as_string())
        })
        .unwrap_or_else(|| format!("{e:?}"))
}

/// HTTP request via the browser's native `fetch` API (no reqwest body reading).
/// Returns `(status_code, body_text)` on success, or `CoreError` on network failure.
async fn js_fetch(
    method: &str,
    url: &str,
    headers: &[(&str, &str)],
    body: Option<String>,
) -> Result<(u16, String), CoreError> {
    let url_s = serde_json::to_string(url).unwrap();
    let method_s = serde_json::to_string(method).unwrap();

    let headers_pairs: Vec<String> = headers
        .iter()
        .map(|(k, v)| {
            format!(
                "{}: {}",
                serde_json::to_string(k).unwrap(),
                serde_json::to_string(v).unwrap()
            )
        })
        .collect();
    let headers_obj = format!("{{{}}}", headers_pairs.join(", "));

    // body must be a JSON-encoded string so that `body: <value>` is a JS string literal
    let body_part = match body {
        Some(b) => format!(", body: {}", serde_json::to_string(&b).unwrap()),
        None => String::new(),
    };

    // Build an IIFE that calls fetch and returns { s: status, b: bodyText } as JSON
    let js = format!(
        "return fetch({url_s}, {{ method: {method_s}, headers: {headers_obj}{body_part} }})\
         .then(async function(r) {{ \
             var t = await r.text(); \
             return JSON.stringify({{ s: r.status, b: t }}); \
         }})"
    );

    let func = Function::new_no_args(&js);
    let promise = Promise::from(
        func.call0(&JsValue::NULL)
            .map_err(|e| CoreError::Llm(js_error_string(&e)))?,
    );

    let val = JsFuture::from(promise)
        .await
        .map_err(|e| CoreError::Llm(js_error_string(&e)))?;

    let json_str = val
        .as_string()
        .ok_or_else(|| CoreError::Llm("fetch returned non-string".to_string()))?;

    let parsed: Value =
        serde_json::from_str(&json_str).map_err(|e| CoreError::Llm(e.to_string()))?;

    let status = parsed["s"].as_u64().unwrap_or(0) as u16;
    let body_text = parsed["b"].as_str().unwrap_or("").to_string();
    Ok((status, body_text))
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
    let auth = format!("Bearer {api_key}");
    let headers: &[(&str, &str)] = &[("authorization", &auth), ("content-type", "application/json")];

    let input: Vec<Value> = messages
        .iter()
        .map(|m| serde_json::json!({ "role": m.role, "content": m.content }))
        .collect();

    let mut body = serde_json::json!({
        "model": model_name,
        "input": input,
        "stream": true,
    });
    if let Some(max) = options.max_tokens {
        body["max_output_tokens"] = serde_json::json!(max);
    }
    if let Some(ref effort) = options.reasoning_effort {
        body["reasoning"] = serde_json::json!({ "effort": effort });
    } else if let Some(temp) = options.temperature {
        body["temperature"] = serde_json::json!(temp);
    }

    let body_str = serde_json::to_string(&body).map_err(|e| CoreError::Llm(e.to_string()))?;
    let (status, text) =
        js_fetch("POST", "https://api.openai.com/v1/responses", headers, Some(body_str)).await?;

    if status < 200 || status >= 300 {
        return Err(CoreError::Llm(format!("openai API error ({status}): {text}")));
    }

    let mut input_tokens: u32 = 0;
    let mut output_tokens: u32 = 0;

    for data_str in parse_sse_text(&text) {
        if let Ok(parsed) = serde_json::from_str::<Value>(&data_str) {
            let event_type = parsed.get("type").and_then(|v| v.as_str()).unwrap_or("");
            match event_type {
                "response.output_text.delta" => {
                    if let Some(delta) = parsed.get("delta").and_then(|v| v.as_str()) {
                        emit_token(
                            on_token,
                            &TokenPayload {
                                content: delta.to_string(),
                                done: false,
                                input_tokens,
                                output_tokens,
                            },
                        );
                    }
                }
                "response.completed" => {
                    if let Some(usage) = parsed.pointer("/response/usage") {
                        input_tokens = usage
                            .get("input_tokens")
                            .and_then(|v| v.as_u64())
                            .unwrap_or(0) as u32;
                        output_tokens = usage
                            .get("output_tokens")
                            .and_then(|v| v.as_u64())
                            .unwrap_or(0) as u32;
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
        js_fetch("POST", "https://api.anthropic.com/v1/messages", headers, Some(body_str)).await?;

    if status < 200 || status >= 300 {
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
    let (status, text) = js_fetch("POST", &url, headers, Some(body_str)).await?;

    if status < 200 || status >= 300 {
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
        js_fetch("POST", "https://api.x.ai/v1/chat/completions", headers, Some(body_str)).await?;

    if status < 200 || status >= 300 {
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
    match provider {
        "openai" => call_openai(model_name, api_key, messages, &options, on_token).await,
        "anthropic" => call_anthropic(model_name, api_key, messages, &options, on_token).await,
        "google" => call_google(model_name, api_key, messages, &options, on_token).await,
        "xai" => call_xai(model_name, api_key, messages, &options, on_token).await,
        _ => Err(CoreError::Llm(format!("unknown provider: {provider}"))),
    }
}

pub async fn test_api_connection(provider: &str, api_key: &str) -> Result<bool, CoreError> {
    let auth = format!("Bearer {api_key}");
    match provider {
        "openai" => {
            let headers: &[(&str, &str)] = &[("authorization", &auth)];
            let (status, _) =
                js_fetch("GET", "https://api.openai.com/v1/models", headers, None).await?;
            Ok(status >= 200 && status < 300)
        }
        "anthropic" => {
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
                js_fetch("POST", "https://api.anthropic.com/v1/messages", headers, Some(body_str))
                    .await?;
            Ok(status >= 200 && status < 300)
        }
        "google" => {
            let url = format!(
                "https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
            );
            let (status, _) = js_fetch("GET", &url, &[], None).await?;
            Ok(status >= 200 && status < 300)
        }
        "xai" => {
            let headers: &[(&str, &str)] = &[("authorization", &auth)];
            let (status, _) =
                js_fetch("GET", "https://api.x.ai/v1/models", headers, None).await?;
            Ok(status >= 200 && status < 300)
        }
        _ => Err(CoreError::Llm(format!("unknown provider: {provider}"))),
    }
}
