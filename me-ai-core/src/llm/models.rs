use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use js_sys::Array;

#[wasm_bindgen(typescript_custom_section)]
const LLM_RESULT_TYPES: &'static str = r#"
export interface GenerateFullResult {
    text: string;
    tps: number | null;
    numTokens: number;
    inputTokens: number;
}
"#;

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
    #[allow(clippy::too_many_arguments)]
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

// ── ONNX models ─────────────────────────────────────────────────────────────

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OnnxModel {
    pub id: String,
    pub name: String,
    pub size: String,
    #[wasm_bindgen(js_name = "contextWindow")]
    pub context_window: u32,
    #[wasm_bindgen(js_name = "maxEmailTokens")]
    pub max_email_tokens: u32,
    pub description: String,
    #[wasm_bindgen(js_name = "gpuWarning")]
    pub gpu_warning: String,       // empty string when no warning
    #[wasm_bindgen(js_name = "isExperimental")]
    pub is_experimental: bool,
    #[wasm_bindgen(js_name = "recommendedForEmailProcessing")]
    pub recommended_for_email_processing: bool,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OnnxModelGroup {
    pub label: String,
    pub models: Vec<OnnxModel>,
}

pub fn get_onnx_model_groups() -> Vec<OnnxModelGroup> {
    vec![
        OnnxModelGroup {
            label: "GPT-OSS".to_string(),
            models: vec![OnnxModel {
                id: "onnx-community/gpt-oss-20b-ONNX".to_string(),
                name: "20B".to_string(),
                size: "~12 GB".to_string(),
                context_window: 131_072,
                max_email_tokens: 16_000,
                description: "OpenAI open-source, 128k context, built-in reasoning".to_string(),
                gpu_warning: "Requires powerful GPU (12 GB+ VRAM). ~12 GB download.".to_string(),
                is_experimental: true,
                recommended_for_email_processing: true,
            }],
        },
        OnnxModelGroup {
            label: "Gemma 4".to_string(),
            models: vec![
                OnnxModel {
                    id: "onnx-community/gemma-4-E2B-it-ONNX".to_string(),
                    name: "E2B".to_string(),
                    size: "~3.4 GB".to_string(),
                    context_window: 131_072,
                    max_email_tokens: 6_000,
                    description: "Most browser-friendly Gemma 4. 128k context with text, image, and audio support.".to_string(),
                    gpu_warning: "Large download (~3.4 GB at q4f16). 8 GB+ shared or dedicated GPU memory recommended.".to_string(),
                    is_experimental: true,
                    recommended_for_email_processing: true,
                },
                OnnxModel {
                    id: "onnx-community/gemma-4-E4B-it-ONNX".to_string(),
                    name: "E4B".to_string(),
                    size: "~4.6 GB".to_string(),
                    context_window: 131_072,
                    max_email_tokens: 10_000,
                    description: "Higher-quality Gemma 4 for strong browser-side reasoning on high-end GPUs.".to_string(),
                    gpu_warning: "Very large browser model. High-end GPU or ample shared memory strongly recommended.".to_string(),
                    is_experimental: true,
                    recommended_for_email_processing: true,
                },
            ],
        },
        OnnxModelGroup {
            label: "Qwen 3.5".to_string(),
            models: vec![
                OnnxModel {
                    id: "onnx-community/Qwen3.5-0.8B-ONNX".to_string(),
                    name: "0.8B".to_string(),
                    size: "~647 MB".to_string(),
                    context_window: 262_144,
                    max_email_tokens: 4_000,
                    description: "Fastest, 256k context, hybrid attention".to_string(),
                    gpu_warning: String::new(),
                    is_experimental: false,
                    recommended_for_email_processing: false,
                },
                OnnxModel {
                    id: "onnx-community/Qwen3.5-2B-ONNX".to_string(),
                    name: "2B".to_string(),
                    size: "~1.6 GB".to_string(),
                    context_window: 262_144,
                    max_email_tokens: 6_000,
                    description: "Balanced speed and quality, 256k context".to_string(),
                    gpu_warning: String::new(),
                    is_experimental: false,
                    recommended_for_email_processing: true,
                },
                OnnxModel {
                    id: "onnx-community/Qwen3.5-4B-ONNX".to_string(),
                    name: "4B".to_string(),
                    size: "~3 GB".to_string(),
                    context_window: 262_144,
                    max_email_tokens: 12_000,
                    description: "Best reasoning, 256k context".to_string(),
                    gpu_warning: "Requires good GPU (8 GB+ VRAM recommended)".to_string(),
                    is_experimental: false,
                    recommended_for_email_processing: true,
                },
            ],
        },
    ]
}

pub fn get_onnx_models() -> Vec<OnnxModel> {
    get_onnx_model_groups().into_iter().flat_map(|g| g.models).collect()
}

pub fn get_onnx_model_info(model_id: &str) -> Option<OnnxModel> {
    get_onnx_models().into_iter().find(|m| m.id == model_id)
}

// ── Ollama models ────────────────────────────────────────────────────────────

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OllamaModel {
    pub name: String,
    #[wasm_bindgen(js_name = "displayName")]
    pub display_name: String,
    pub params: String,
    #[wasm_bindgen(js_name = "contextWindow")]
    pub context_window: u32,
    #[wasm_bindgen(js_name = "maxEmailTokens")]
    pub max_email_tokens: u32,
    pub description: String,
    #[wasm_bindgen(skip)]
    pub tags: Vec<String>,
    pub recommended: bool,
    #[wasm_bindgen(js_name = "recommendedForEmailProcessing")]
    pub recommended_for_email_processing: bool,
}

#[wasm_bindgen]
impl OllamaModel {
    #[wasm_bindgen(getter)]
    pub fn tags(&self) -> Array {
        self.tags.iter().map(|t| JsValue::from_str(t)).collect()
    }
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OllamaModelGroup {
    pub label: String,
    pub models: Vec<OllamaModel>,
}

pub fn get_ollama_model_groups() -> Vec<OllamaModelGroup> {
    vec![
        OllamaModelGroup {
            label: "GPT-OSS".to_string(),
            models: vec![
                OllamaModel { name: "gpt-oss:20b".to_string(), display_name: "GPT-OSS 20B".to_string(), params: "20B".to_string(), context_window: 131_072, max_email_tokens: 100_000, description: "OpenAI's open model, strong reasoning, Apache 2.0".to_string(), tags: vec!["reasoning".to_string(), "cot".to_string(), "openai".to_string()], recommended: true, recommended_for_email_processing: true },
            ],
        },
        OllamaModelGroup {
            label: "Gemma 4".to_string(),
            models: vec![
                OllamaModel { name: "gemma4:e2b".to_string(), display_name: "Gemma 4 E2B".to_string(), params: "2B effective".to_string(), context_window: 131_072, max_email_tokens: 100_000, description: "Google Gemma 4 E2B, 128k context, MatFormer edge model".to_string(), tags: vec!["google".to_string(), "multimodal".to_string(), "fast".to_string()], recommended: true, recommended_for_email_processing: true },
                OllamaModel { name: "gemma4:e4b".to_string(), display_name: "Gemma 4 E4B".to_string(), params: "4B effective".to_string(), context_window: 131_072, max_email_tokens: 100_000, description: "Google Gemma 4 E4B, 128k context, MatFormer edge model".to_string(), tags: vec!["google".to_string(), "multimodal".to_string(), "balanced".to_string()], recommended: true, recommended_for_email_processing: true },
                OllamaModel { name: "gemma4:26b".to_string(), display_name: "Gemma 4 26B".to_string(), params: "26B MoE".to_string(), context_window: 131_072, max_email_tokens: 100_000, description: "Google Gemma 4 26B MoE, 128k context, 4B active params".to_string(), tags: vec!["google".to_string(), "multimodal".to_string(), "advanced".to_string()], recommended: true, recommended_for_email_processing: true },
                OllamaModel { name: "gemma4:31b".to_string(), display_name: "Gemma 4 31B".to_string(), params: "31B".to_string(), context_window: 131_072, max_email_tokens: 100_000, description: "Google Gemma 4 31B dense, 128k context, best quality".to_string(), tags: vec!["google".to_string(), "multimodal".to_string(), "advanced".to_string()], recommended: true, recommended_for_email_processing: true },
            ],
        },
    ]
}

pub fn get_ollama_models() -> Vec<OllamaModel> {
    get_ollama_model_groups().into_iter().flat_map(|g| g.models).collect()
}

pub fn get_ollama_model_info(model_name: &str) -> Option<OllamaModel> {
    get_ollama_models().into_iter().find(|m| {
        m.name == model_name || model_name.starts_with(&format!("{}:", m.name.split(':').next().unwrap_or("")))
    })
}

pub fn get_recommended_ollama_models() -> Vec<OllamaModel> {
    get_ollama_models().into_iter().filter(|m| m.recommended).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_api_models_returns_non_empty() {
        assert!(!get_api_models().is_empty());
    }

    #[test]
    fn all_models_have_required_fields() {
        for m in get_api_models() {
            assert!(!m.id.is_empty(), "empty id");
            assert!(!m.name.is_empty(), "empty name for {}", m.id);
            assert!(!m.provider.is_empty(), "empty provider for {}", m.id);
            assert!(!m.display_name.is_empty(), "empty display_name for {}", m.id);
        }
    }

    #[test]
    fn all_providers_are_known() {
        let known = ["openai", "anthropic", "google", "xai"];
        for m in get_api_models() {
            assert!(
                known.contains(&m.provider.as_str()),
                "unknown provider '{}' for model '{}'",
                m.provider,
                m.id
            );
        }
    }

    #[test]
    fn get_api_model_info_claude_opus_4_6() {
        let model = get_api_model_info("claude-opus-4-6").expect("claude-opus-4-6 must exist");
        assert_eq!(model.provider, "anthropic");
    }

    #[test]
    fn get_api_model_info_nonexistent_returns_none() {
        assert!(get_api_model_info("nonexistent-model-id").is_none());
    }

    #[test]
    fn get_onnx_model_info_gemma4_e2b() {
        let model = get_onnx_model_info("onnx-community/gemma-4-E2B-it-ONNX")
            .expect("Gemma 4 E2B must exist");
        assert_eq!(model.context_window, 131_072);
    }

    #[test]
    fn reasoning_effort_only_on_openai_models() {
        for m in get_api_models() {
            if m.reasoning_effort.is_some() {
                assert_eq!(
                    m.provider, "openai",
                    "reasoning_effort should only be set on openai models, found on '{}'",
                    m.id
                );
            }
        }
    }
}
