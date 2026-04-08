//! Ollama local LLM HTTP client (browser via reqwest → fetch).

use futures_util::StreamExt;
use js_sys::Function;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::error::CoreError;

#[wasm_bindgen(typescript_custom_section)]
const OLLAMA_STREAMING_TYPES: &'static str = r#"
export interface OllamaChatMessage {
    role: string;
    content?: string;
}

export interface StreamOllamaOptions {
    temperature?: number;
    maxTokens?: number;
    keepAlive?: string;
}

export interface OllamaTokenData {
    content: string;
    done: boolean;
    total_duration?: number;
    eval_count?: number;
    eval_duration?: number;
}
"#;

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OllamaConnectionResult {
    pub connected: bool,
    pub version: String,    // empty when not connected
    pub error: String,      // empty when connected
    #[wasm_bindgen(js_name = "corsError")]
    pub cors_error: bool,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OllamaModelTag {
    pub name: String,
    pub size: u64,           // 0 when unknown
    #[wasm_bindgen(js_name = "modifiedAt")]
    pub modified_at: String, // empty when unknown
}

const DEFAULT_LOCAL: &str = "http://localhost:11434";
const DEFAULT_REMOTE: &str = "https://me-ai.metaelon.space";

/// Hostname-based default (no persisted settings). Used when `ollamaUrl` is unset.
pub fn default_ollama_base_url_for_hostname(hostname: &str) -> String {
    let is_local =
        hostname == "localhost" || hostname == "127.0.0.1" || hostname == "0.0.0.0";
    if is_local {
        DEFAULT_LOCAL.to_string()
    } else {
        DEFAULT_REMOTE.to_string()
    }
}

/// Default Ollama base URL from `window.location.hostname` (WASM); localhost URL for native tests.
pub fn default_ollama_base_url() -> String {
    #[cfg(target_arch = "wasm32")]
    {
        web_sys::window()
            .and_then(|w| w.location().hostname().ok())
            .map(|h| default_ollama_base_url_for_hostname(&h))
            .unwrap_or_else(|| DEFAULT_LOCAL.to_string())
    }
    #[cfg(not(target_arch = "wasm32"))]
    {
        default_ollama_base_url_for_hostname("localhost")
    }
}

#[derive(Debug, Deserialize)]
pub struct OllamaChatMessageInput {
    pub role: String,
    #[serde(default)]
    pub content: Option<String>,
}

#[derive(Debug, Deserialize, Default)]
#[serde(default)]
#[serde(rename_all = "camelCase")]
struct StreamOllamaOptionsInput {
    temperature: Option<f64>,
    max_tokens: Option<u32>,
    keep_alive: Option<String>,
}

#[derive(Serialize)]
struct OllamaChatMessageSer {
    role: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    content: Option<String>,
}

#[derive(Serialize)]
struct OllamaRunOptions {
    temperature: f64,
    #[serde(rename = "num_predict")]
    num_predict: u32,
}

#[derive(Serialize)]
struct OllamaChatRequest<'a> {
    model: &'a str,
    messages: Vec<OllamaChatMessageSer>,
    stream: bool,
    options: OllamaRunOptions,
    #[serde(rename = "keep_alive")]
    keep_alive: &'a str,
}

#[derive(Debug, Deserialize)]
struct OllamaStreamLine {
    message: Option<OllamaStreamMessage>,
    #[serde(default)]
    done: bool,
    total_duration: Option<f64>,
    eval_count: Option<u32>,
    eval_duration: Option<f64>,
}

#[derive(Debug, Deserialize)]
struct OllamaStreamMessage {
    #[serde(default)]
    content: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct OllamaTokenEmit {
    content: String,
    done: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    total_duration: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    eval_count: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    eval_duration: Option<f64>,
}

fn emit_ollama_token(on_token: &Function, payload: &OllamaTokenEmit) {
    if let Ok(val) = serde_wasm_bindgen::to_value(payload) {
        let _ = on_token.call1(&JsValue::NULL, &val);
    }
}

/// Stream `/api/chat` (NDJSON). Invokes `on_token` for each chunk; returns full concatenated text.
pub async fn stream_ollama_chat(
    url: &str,
    model: &str,
    messages_js: JsValue,
    options_js: JsValue,
    on_token: &Function,
) -> Result<String, CoreError> {
    let messages_in: Vec<OllamaChatMessageInput> =
        serde_wasm_bindgen::from_value(messages_js).map_err(|e| CoreError::Llm(e.to_string()))?;
    let opts: StreamOllamaOptionsInput = if options_js.is_null() || options_js.is_undefined() {
        StreamOllamaOptionsInput::default()
    } else {
        serde_wasm_bindgen::from_value(options_js).map_err(|e| CoreError::Llm(e.to_string()))?
    };

    let temperature = opts.temperature.unwrap_or(0.7);
    let num_predict = opts.max_tokens.unwrap_or(4096);
    let keep_alive = opts.keep_alive.as_deref().unwrap_or("10m");

    let messages: Vec<OllamaChatMessageSer> = messages_in
        .into_iter()
        .map(|m| OllamaChatMessageSer { role: m.role, content: m.content })
        .collect();

    let body = OllamaChatRequest {
        model,
        messages,
        stream: true,
        options: OllamaRunOptions { temperature, num_predict },
        keep_alive,
    };

    let endpoint = format!("{}/api/chat", url.trim_end_matches('/'));
    let client = reqwest::Client::new();

    let resp = client
        .post(&endpoint)
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| CoreError::Llm(e.to_string()))?;

    if !resp.status().is_success() {
        let err = resp.text().await.unwrap_or_default();
        return Err(CoreError::Llm(format!("Ollama API error: {err}")));
    }

    let mut stream = resp.bytes_stream();
    let mut buf = Vec::<u8>::new();
    let mut full_text = String::new();
    let mut finished = false;

    while let Some(item) = stream.next().await {
        let chunk = item.map_err(|e| CoreError::Llm(e.to_string()))?;
        buf.extend_from_slice(&chunk);
        let mut start = 0usize;
        while let Some(rel) = buf[start..].iter().position(|&b| b == b'\n') {
            let line_end = start + rel;
            let line = std::str::from_utf8(&buf[start..line_end])
                .map_err(|e| CoreError::Llm(format!("invalid UTF-8 in Ollama stream: {e}")))?;
            start = line_end + 1;
            let line = line.trim();
            if line.is_empty() {
                continue;
            }
            let data: OllamaStreamLine = match serde_json::from_str(line) {
                Ok(v) => v,
                Err(_) => continue,
            };

            if let Some(ref msg) = data.message {
                if let Some(ref c) = msg.content {
                    if !c.is_empty() {
                        full_text.push_str(c);
                        emit_ollama_token(
                            on_token,
                            &OllamaTokenEmit {
                                content: c.clone(),
                                done: false,
                                total_duration: data.total_duration,
                                eval_count: data.eval_count,
                                eval_duration: data.eval_duration,
                            },
                        );
                    }
                }
            }

            if data.done {
                emit_ollama_token(
                    on_token,
                    &OllamaTokenEmit {
                        content: String::new(),
                        done: true,
                        total_duration: data.total_duration,
                        eval_count: data.eval_count,
                        eval_duration: data.eval_duration,
                    },
                );
                finished = true;
                break;
            }
        }
        buf.drain(..start);
        if finished {
            break;
        }
    }

    Ok(full_text)
}

pub async fn test_ollama_connection(url: &str) -> Result<OllamaConnectionResult, CoreError> {
    let endpoint = format!("{}/api/version", url.trim_end_matches('/'));
    let client = reqwest::Client::new();
    match client.get(&endpoint).send().await {
        Ok(resp) if resp.status().is_success() => {
            let version = resp
                .json::<serde_json::Value>()
                .await
                .ok()
                .and_then(|v| v.get("version").and_then(|v| v.as_str()).map(|s| s.to_string()))
                .unwrap_or_default();
            Ok(OllamaConnectionResult { connected: true, version, error: String::new(), cors_error: false })
        }
        Ok(resp) => Ok(OllamaConnectionResult {
            connected: false,
            version: String::new(),
            error: format!("HTTP {}", resp.status()),
            cors_error: false,
        }),
        Err(e) => {
            let msg = e.to_string();
            let cors_error = msg.contains("CORS") || msg.contains("Failed to fetch") || msg.contains("TypeError");
            Ok(OllamaConnectionResult {
                connected: false,
                version: String::new(),
                error: if cors_error {
                    "CORS error: Server must allow requests from this origin. Configure Access-Control-Allow-Origin header.".to_string()
                } else {
                    msg
                },
                cors_error,
            })
        }
    }
}

#[derive(Debug, Deserialize)]
struct OllamaTagsResponse {
    models: Option<Vec<OllamaTagEntry>>,
}

#[derive(Debug, Deserialize)]
struct OllamaTagEntry {
    name: Option<String>,
    size: Option<u64>,
    modified_at: Option<String>,
}

pub async fn list_ollama_models(url: &str) -> Result<Vec<OllamaModelTag>, CoreError> {
    let endpoint = format!("{}/api/tags", url.trim_end_matches('/'));
    let client = reqwest::Client::new();
    let resp = client
        .get(&endpoint)
        .send()
        .await
        .map_err(|e| CoreError::Llm(e.to_string()))?;
    if !resp.status().is_success() {
        return Err(CoreError::Llm(format!("Failed to list models: HTTP {}", resp.status())));
    }
    let data: OllamaTagsResponse = resp.json().await.map_err(|e| CoreError::Llm(e.to_string()))?;
    Ok(data.models.unwrap_or_default().into_iter().map(|m| OllamaModelTag {
        name: m.name.unwrap_or_default(),
        size: m.size.unwrap_or(0),
        modified_at: m.modified_at.unwrap_or_default(),
    }).collect())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_url_localhost_hostnames() {
        assert_eq!(default_ollama_base_url_for_hostname("localhost"), DEFAULT_LOCAL);
        assert_eq!(default_ollama_base_url_for_hostname("127.0.0.1"), DEFAULT_LOCAL);
        assert_eq!(default_ollama_base_url_for_hostname("0.0.0.0"), DEFAULT_LOCAL);
    }

    #[test]
    fn default_url_remote_hostnames() {
        assert_eq!(
            default_ollama_base_url_for_hostname("me-ai.metaelon.space"),
            DEFAULT_REMOTE
        );
    }
}
