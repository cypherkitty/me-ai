use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApiModel {
    pub id: String,
    pub name: String,
    #[wasm_bindgen(js_name = "displayName")]
    pub display_name: String,
    pub provider: String,
    pub description: String,
    #[wasm_bindgen(js_name = "contextWindow")]
    pub context_window: u32,
    #[wasm_bindgen(js_name = "maxEmailTokens")]
    pub max_email_tokens: u32,
    #[wasm_bindgen(js_name = "recommendedForEmailProcessing")]
    pub recommended_for_email_processing: bool,
    #[wasm_bindgen(js_name = "reasoningEffort")]
    pub reasoning_effort: Option<String>,
}

impl ApiModel {
    fn new(
        id: &str,
        name: &str,
        display_name: &str,
        provider: &str,
        description: &str,
        context_window: u32,
        max_email_tokens: u32,
        recommended: bool,
        reasoning_effort: Option<&str>,
    ) -> Self {
        Self {
            id: id.to_string(),
            name: name.to_string(),
            display_name: display_name.to_string(),
            provider: provider.to_string(),
            description: description.to_string(),
            context_window,
            max_email_tokens,
            recommended_for_email_processing: recommended,
            reasoning_effort: reasoning_effort.map(|s| s.to_string()),
        }
    }
}

pub fn get_api_models() -> Vec<ApiModel> {
    vec![
        // OpenAI — GPT-5.4 reasoning levels
        ApiModel::new(
            "gpt-5.4-low",
            "gpt-5.4",
            "GPT-5.4 (Low reasoning)",
            "openai",
            "GPT-5.4 frontier model with low reasoning effort (best latency/cost)",
            1_000_000,
            64_000,
            true,
            Some("low"),
        ),
        ApiModel::new(
            "gpt-5.4-medium",
            "gpt-5.4",
            "GPT-5.4 (Medium reasoning)",
            "openai",
            "GPT-5.4 with medium reasoning effort (balanced)",
            1_000_000,
            64_000,
            true,
            Some("medium"),
        ),
        ApiModel::new(
            "gpt-5.4-high",
            "gpt-5.4",
            "GPT-5.4 (High reasoning)",
            "openai",
            "GPT-5.4 with high reasoning effort for harder problems",
            1_000_000,
            64_000,
            true,
            Some("high"),
        ),
        ApiModel::new(
            "gpt-5.4-xhigh",
            "gpt-5.4",
            "GPT-5.4 (XHigh reasoning)",
            "openai",
            "GPT-5.4 with extra-high reasoning effort; slowest and most thorough",
            1_000_000,
            64_000,
            true,
            Some("high"),
        ),
        // OpenAI — GPT-5 Mini
        ApiModel::new(
            "gpt-5-mini",
            "gpt-5-mini",
            "GPT-5 Mini",
            "openai",
            "Near-frontier, lower-latency model for cost-sensitive workloads",
            400_000,
            32_000,
            true,
            None,
        ),
        // Anthropic
        ApiModel::new(
            "claude-opus-4-6",
            "claude-opus-4-6",
            "Claude Opus 4.6",
            "anthropic",
            "Anthropic's most intelligent model",
            200_000,
            32_000,
            true,
            None,
        ),
        ApiModel::new(
            "claude-sonnet-4-6",
            "claude-sonnet-4-6",
            "Claude Sonnet 4.6",
            "anthropic",
            "Anthropic's balanced speed and intelligence model",
            200_000,
            32_000,
            true,
            None,
        ),
        ApiModel::new(
            "claude-haiku-4-5",
            "claude-haiku-4-5",
            "Claude Haiku 4.5",
            "anthropic",
            "Anthropic's fastest model",
            200_000,
            32_000,
            true,
            None,
        ),
        // Google
        ApiModel::new(
            "gemini-3-pro-preview",
            "gemini-3-pro-preview",
            "Gemini 3 Pro",
            "google",
            "Google's most capable model with 1M context",
            1_048_576,
            65_536,
            true,
            None,
        ),
        ApiModel::new(
            "gemini-3-flash-preview",
            "gemini-3-flash-preview",
            "Gemini 3 Flash",
            "google",
            "Fast and lightweight model",
            1_048_576,
            65_536,
            true,
            None,
        ),
        // xAI
        ApiModel::new(
            "grok-4",
            "grok-4",
            "Grok 4",
            "xai",
            "xAI's flagship reasoning model",
            256_000,
            32_000,
            true,
            None,
        ),
        ApiModel::new(
            "grok-3",
            "grok-3",
            "Grok 3",
            "xai",
            "xAI's capable chat model",
            131_072,
            16_384,
            true,
            None,
        ),
        ApiModel::new(
            "grok-3-mini",
            "grok-3-mini",
            "Grok 3 Mini",
            "xai",
            "xAI's fast and affordable model",
            131_072,
            16_384,
            true,
            None,
        ),
    ]
}

pub fn get_api_model_info(model_id: &str) -> Option<ApiModel> {
    get_api_models().into_iter().find(|m| m.id == model_id)
}
