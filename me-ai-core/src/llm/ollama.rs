//! Ollama local LLM HTTP client — non-streaming operations only.
//! Streaming stays in TypeScript (uses browser ReadableStream).

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::error::CoreError;

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
