//! Typed settings structs. All app settings in one place; no JSON at the API surface.

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::db::{store, DbRef};
use crate::error::CoreError;
use crate::storage::schema::{set_setting, SettingRow};

// ── AiBackend enum ─────────────────────────────────────────────────────────

/// AI backend selection.
#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq)]
pub enum AiBackend {
    WebGpu = 0,
    Ollama = 1,
    Cloud = 2,
}

impl AiBackend {
    fn as_str(self) -> &'static str {
        match self {
            AiBackend::WebGpu => "webgpu",
            AiBackend::Ollama => "ollama",
            AiBackend::Cloud => "cloud",
        }
    }

    fn from_str(s: &str) -> Option<Self> {
        match s {
            "webgpu" => Some(AiBackend::WebGpu),
            "ollama" => Some(AiBackend::Ollama),
            "cloud" => Some(AiBackend::Cloud),
            _ => None,
        }
    }
}

// ── Sub-structs ────────────────────────────────────────────────────────────

/// Google OAuth 2.0 access token.
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone)]
pub struct GoogleToken {
    access_token: String,
    expires_at: f64,
}

#[wasm_bindgen]
impl GoogleToken {
    #[wasm_bindgen(constructor)]
    pub fn new(access_token: &str, expires_at: f64) -> GoogleToken {
        GoogleToken { access_token: access_token.to_string(), expires_at }
    }
    #[wasm_bindgen(getter, js_name = accessToken)]
    pub fn access_token(&self) -> String { self.access_token.clone() }
    #[wasm_bindgen(setter, js_name = accessToken)]
    pub fn set_access_token(&mut self, v: String) { self.access_token = v; }
    #[wasm_bindgen(getter, js_name = expiresAt)]
    pub fn expires_at(&self) -> f64 { self.expires_at }
    #[wasm_bindgen(setter, js_name = expiresAt)]
    pub fn set_expires_at(&mut self, v: f64) { self.expires_at = v; }
}

/// Twitter/X OAuth 2.0 PKCE token.
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone)]
pub struct TwitterToken {
    access_token: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    refresh_token: Option<String>,
    expires_at: f64,
}

#[wasm_bindgen]
impl TwitterToken {
    #[wasm_bindgen(constructor)]
    pub fn new(access_token: &str, expires_at: f64) -> TwitterToken {
        TwitterToken { access_token: access_token.to_string(), refresh_token: None, expires_at }
    }
    #[wasm_bindgen(getter, js_name = accessToken)]
    pub fn access_token(&self) -> String { self.access_token.clone() }
    #[wasm_bindgen(setter, js_name = accessToken)]
    pub fn set_access_token(&mut self, v: String) { self.access_token = v; }
    #[wasm_bindgen(getter, js_name = refreshToken)]
    pub fn refresh_token(&self) -> Option<String> { self.refresh_token.clone() }
    #[wasm_bindgen(setter, js_name = refreshToken)]
    pub fn set_refresh_token(&mut self, v: String) { self.refresh_token = Some(v); }
    #[wasm_bindgen(getter, js_name = expiresAt)]
    pub fn expires_at(&self) -> f64 { self.expires_at }
    #[wasm_bindgen(setter, js_name = expiresAt)]
    pub fn set_expires_at(&mut self, v: f64) { self.expires_at = v; }
}

/// Gmail profile (from Google People API).
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Default)]
pub struct GmailProfile {
    #[serde(rename = "emailAddress", skip_serializing_if = "Option::is_none")]
    email_address: Option<String>,
}

#[wasm_bindgen]
impl GmailProfile {
    #[wasm_bindgen(constructor)]
    pub fn new() -> GmailProfile { GmailProfile::default() }
    #[wasm_bindgen(getter, js_name = emailAddress)]
    pub fn email_address(&self) -> Option<String> { self.email_address.clone() }
    #[wasm_bindgen(setter, js_name = emailAddress)]
    pub fn set_email_address(&mut self, v: String) { self.email_address = Some(v); }
}

/// Twitter/X user profile (common fields from Twitter API v2).
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Default)]
pub struct TwitterProfile {
    #[serde(skip_serializing_if = "Option::is_none")]
    id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    username: Option<String>,
}

#[wasm_bindgen]
impl TwitterProfile {
    #[wasm_bindgen(constructor)]
    pub fn new() -> TwitterProfile { TwitterProfile::default() }
    #[wasm_bindgen(getter)]
    pub fn id(&self) -> Option<String> { self.id.clone() }
    #[wasm_bindgen(setter)]
    pub fn set_id(&mut self, v: String) { self.id = Some(v); }
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> Option<String> { self.name.clone() }
    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, v: String) { self.name = Some(v); }
    #[wasm_bindgen(getter)]
    pub fn username(&self) -> Option<String> { self.username.clone() }
    #[wasm_bindgen(setter)]
    pub fn set_username(&mut self, v: String) { self.username = Some(v); }
}

/// Scan history summary stats.
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Default)]
pub struct ScanHistory {
    pub timestamp: f64,
    pub classified: f64,
    pub errors: f64,
    pub total: f64,
}

#[wasm_bindgen]
impl ScanHistory {
    #[wasm_bindgen(constructor)]
    pub fn new(timestamp: f64, classified: f64, errors: f64, total: f64) -> ScanHistory {
        ScanHistory { timestamp, classified, errors, total }
    }
}

// ── Main settings struct ───────────────────────────────────────────────────

/// All app settings in one typed struct.
/// Load with `core.loadSettings()`, save with `core.saveSettings(sv)`.
/// Only non-None fields are written to IndexedDB on save.
#[wasm_bindgen]
#[derive(Default)]
pub struct SettingValue {
    // Cloud API keys
    openai_api_key: Option<String>,
    anthropic_api_key: Option<String>,
    google_api_key: Option<String>,
    xai_api_key: Option<String>,

    // Ollama
    ollama_url: Option<String>,

    // Model config
    ai_backend: Option<AiBackend>,
    selected_model: Option<String>,
    load_dtype: Option<String>,
    load_device: Option<String>,

    // Model options
    enable_thinking: Option<bool>,
    max_tokens: Option<f64>,
    do_sample: Option<bool>,
    temperature: Option<f64>,
    repetition_penalty: Option<f64>,

    // Auth config
    google_client_id: Option<String>,
    twitter_client_id: Option<String>,

    // Auth tokens
    google_token: Option<GoogleToken>,
    twitter_token: Option<TwitterToken>,

    // Profiles
    gmail_profile: Option<GmailProfile>,
    twitter_profile: Option<TwitterProfile>,

    // Scan history
    scan_history: Option<ScanHistory>,
}

#[wasm_bindgen]
impl SettingValue {
    #[wasm_bindgen(constructor)]
    pub fn new() -> SettingValue { SettingValue::default() }

    // ── API keys ────────────────────────────────────────────────────────
    #[wasm_bindgen(getter, js_name = openaiApiKey)]
    pub fn openai_api_key(&self) -> Option<String> { self.openai_api_key.clone() }
    #[wasm_bindgen(setter, js_name = openaiApiKey)]
    pub fn set_openai_api_key(&mut self, v: String) { self.openai_api_key = Some(v); }

    #[wasm_bindgen(getter, js_name = anthropicApiKey)]
    pub fn anthropic_api_key(&self) -> Option<String> { self.anthropic_api_key.clone() }
    #[wasm_bindgen(setter, js_name = anthropicApiKey)]
    pub fn set_anthropic_api_key(&mut self, v: String) { self.anthropic_api_key = Some(v); }

    #[wasm_bindgen(getter, js_name = googleApiKey)]
    pub fn google_api_key(&self) -> Option<String> { self.google_api_key.clone() }
    #[wasm_bindgen(setter, js_name = googleApiKey)]
    pub fn set_google_api_key(&mut self, v: String) { self.google_api_key = Some(v); }

    #[wasm_bindgen(getter, js_name = xaiApiKey)]
    pub fn xai_api_key(&self) -> Option<String> { self.xai_api_key.clone() }
    #[wasm_bindgen(setter, js_name = xaiApiKey)]
    pub fn set_xai_api_key(&mut self, v: String) { self.xai_api_key = Some(v); }

    // ── Ollama ──────────────────────────────────────────────────────────
    #[wasm_bindgen(getter, js_name = ollamaUrl)]
    pub fn ollama_url(&self) -> Option<String> { self.ollama_url.clone() }
    #[wasm_bindgen(setter, js_name = ollamaUrl)]
    pub fn set_ollama_url(&mut self, v: String) { self.ollama_url = Some(v); }

    // ── Model config ────────────────────────────────────────────────────
    #[wasm_bindgen(getter, js_name = aiBackend)]
    pub fn ai_backend(&self) -> Option<AiBackend> { self.ai_backend }
    #[wasm_bindgen(setter, js_name = aiBackend)]
    pub fn set_ai_backend(&mut self, v: AiBackend) { self.ai_backend = Some(v); }

    #[wasm_bindgen(getter, js_name = selectedModel)]
    pub fn selected_model(&self) -> Option<String> { self.selected_model.clone() }
    #[wasm_bindgen(setter, js_name = selectedModel)]
    pub fn set_selected_model(&mut self, v: String) { self.selected_model = Some(v); }

    #[wasm_bindgen(getter, js_name = loadDtype)]
    pub fn load_dtype(&self) -> Option<String> { self.load_dtype.clone() }
    #[wasm_bindgen(setter, js_name = loadDtype)]
    pub fn set_load_dtype(&mut self, v: String) { self.load_dtype = Some(v); }

    #[wasm_bindgen(getter, js_name = loadDevice)]
    pub fn load_device(&self) -> Option<String> { self.load_device.clone() }
    #[wasm_bindgen(setter, js_name = loadDevice)]
    pub fn set_load_device(&mut self, v: String) { self.load_device = Some(v); }

    // ── Model options ───────────────────────────────────────────────────
    #[wasm_bindgen(getter, js_name = enableThinking)]
    pub fn enable_thinking(&self) -> Option<bool> { self.enable_thinking }
    #[wasm_bindgen(setter, js_name = enableThinking)]
    pub fn set_enable_thinking(&mut self, v: bool) { self.enable_thinking = Some(v); }

    #[wasm_bindgen(getter, js_name = maxTokens)]
    pub fn max_tokens(&self) -> Option<f64> { self.max_tokens }
    #[wasm_bindgen(setter, js_name = maxTokens)]
    pub fn set_max_tokens(&mut self, v: f64) { self.max_tokens = Some(v); }

    #[wasm_bindgen(getter, js_name = doSample)]
    pub fn do_sample(&self) -> Option<bool> { self.do_sample }
    #[wasm_bindgen(setter, js_name = doSample)]
    pub fn set_do_sample(&mut self, v: bool) { self.do_sample = Some(v); }

    #[wasm_bindgen(getter, js_name = temperature)]
    pub fn temperature(&self) -> Option<f64> { self.temperature }
    #[wasm_bindgen(setter, js_name = temperature)]
    pub fn set_temperature(&mut self, v: f64) { self.temperature = Some(v); }

    #[wasm_bindgen(getter, js_name = repetitionPenalty)]
    pub fn repetition_penalty(&self) -> Option<f64> { self.repetition_penalty }
    #[wasm_bindgen(setter, js_name = repetitionPenalty)]
    pub fn set_repetition_penalty(&mut self, v: f64) { self.repetition_penalty = Some(v); }

    // ── Auth config ─────────────────────────────────────────────────────
    #[wasm_bindgen(getter, js_name = googleClientId)]
    pub fn google_client_id(&self) -> Option<String> { self.google_client_id.clone() }
    #[wasm_bindgen(setter, js_name = googleClientId)]
    pub fn set_google_client_id(&mut self, v: String) { self.google_client_id = Some(v); }

    #[wasm_bindgen(getter, js_name = twitterClientId)]
    pub fn twitter_client_id(&self) -> Option<String> { self.twitter_client_id.clone() }
    #[wasm_bindgen(setter, js_name = twitterClientId)]
    pub fn set_twitter_client_id(&mut self, v: String) { self.twitter_client_id = Some(v); }

    // ── Auth tokens ─────────────────────────────────────────────────────
    #[wasm_bindgen(getter, js_name = googleToken)]
    pub fn google_token(&self) -> Option<GoogleToken> { self.google_token.clone() }
    #[wasm_bindgen(setter, js_name = googleToken)]
    pub fn set_google_token(&mut self, t: GoogleToken) { self.google_token = Some(t); }

    #[wasm_bindgen(getter, js_name = twitterToken)]
    pub fn twitter_token(&self) -> Option<TwitterToken> { self.twitter_token.clone() }
    #[wasm_bindgen(setter, js_name = twitterToken)]
    pub fn set_twitter_token(&mut self, t: TwitterToken) { self.twitter_token = Some(t); }

    // ── Profiles ────────────────────────────────────────────────────────
    #[wasm_bindgen(getter, js_name = gmailProfile)]
    pub fn gmail_profile(&self) -> Option<GmailProfile> { self.gmail_profile.clone() }
    #[wasm_bindgen(setter, js_name = gmailProfile)]
    pub fn set_gmail_profile(&mut self, p: GmailProfile) { self.gmail_profile = Some(p); }

    #[wasm_bindgen(getter, js_name = twitterProfile)]
    pub fn twitter_profile(&self) -> Option<TwitterProfile> { self.twitter_profile.clone() }
    #[wasm_bindgen(setter, js_name = twitterProfile)]
    pub fn set_twitter_profile(&mut self, p: TwitterProfile) { self.twitter_profile = Some(p); }

    // ── Scan history ────────────────────────────────────────────────────
    #[wasm_bindgen(getter, js_name = scanHistory)]
    pub fn scan_history(&self) -> Option<ScanHistory> { self.scan_history.clone() }
    #[wasm_bindgen(setter, js_name = scanHistory)]
    pub fn set_scan_history(&mut self, h: ScanHistory) { self.scan_history = Some(h); }
}

// ── Storage key mapping ────────────────────────────────────────────────────

const KEY_OPENAI_API_KEY: &str = "openaiApiKey";
const KEY_ANTHROPIC_API_KEY: &str = "anthropicApiKey";
const KEY_GOOGLE_API_KEY: &str = "googleApiKey";
const KEY_XAI_API_KEY: &str = "xaiApiKey";
const KEY_OLLAMA_URL: &str = "ollamaUrl";
const KEY_AI_BACKEND: &str = "aiBackend";
const KEY_SELECTED_MODEL: &str = "selectedModel";
const KEY_LOAD_DTYPE: &str = "loadDtype";
const KEY_LOAD_DEVICE: &str = "loadDevice";
const KEY_ENABLE_THINKING: &str = "enableThinking";
const KEY_MAX_TOKENS: &str = "maxTokens";
const KEY_DO_SAMPLE: &str = "doSample";
const KEY_TEMPERATURE: &str = "temperature";
const KEY_REPETITION_PENALTY: &str = "repetitionPenalty";
const KEY_GOOGLE_CLIENT_ID: &str = "googleClientId";
const KEY_TWITTER_CLIENT_ID: &str = "twitterClientId";
const KEY_GOOGLE_TOKEN: &str = "me-ai:oauth-token";
const KEY_TWITTER_TOKEN: &str = "me-ai:twitter-token";
const KEY_GMAIL_PROFILE: &str = "gmail-profile";
const KEY_TWITTER_PROFILE: &str = "twitter-profile";
const KEY_SCAN_HISTORY: &str = "me-ai-scan-history";

// ── Load / Save ─────────────────────────────────────────────────────────────

/// Load all settings from IndexedDB in a single read. Missing keys leave fields as `None`.
pub async fn load_settings(db: DbRef<'_>) -> Result<SettingValue, CoreError> {
    let all: Vec<SettingRow> = db.store_get_all(store::SETTINGS, None, None).await?;
    let map: std::collections::HashMap<String, String> =
        all.into_iter().map(|r| (r.key, r.value)).collect();

    let mut sv = SettingValue::default();

    // Helper: parse a JSON-encoded string value
    macro_rules! load_str {
        ($field:ident, $key:expr) => {
            if let Some(raw) = map.get($key) {
                sv.$field = serde_json::from_str::<String>(raw).ok();
            }
        };
    }
    macro_rules! load_bool {
        ($field:ident, $key:expr) => {
            if let Some(raw) = map.get($key) {
                sv.$field = serde_json::from_str::<bool>(raw).ok();
            }
        };
    }
    macro_rules! load_f64 {
        ($field:ident, $key:expr) => {
            if let Some(raw) = map.get($key) {
                sv.$field = serde_json::from_str::<f64>(raw).ok();
            }
        };
    }
    macro_rules! load_obj {
        ($field:ident, $key:expr, $T:ty) => {
            if let Some(raw) = map.get($key) {
                sv.$field = serde_json::from_str::<$T>(raw).ok();
            }
        };
    }

    load_str!(openai_api_key, KEY_OPENAI_API_KEY);
    load_str!(anthropic_api_key, KEY_ANTHROPIC_API_KEY);
    load_str!(google_api_key, KEY_GOOGLE_API_KEY);
    load_str!(xai_api_key, KEY_XAI_API_KEY);
    load_str!(ollama_url, KEY_OLLAMA_URL);
    if let Some(raw) = map.get(KEY_AI_BACKEND) {
        // stored as a JSON string e.g. `"webgpu"` — strip quotes then parse
        let s = serde_json::from_str::<String>(raw).unwrap_or_default();
        sv.ai_backend = AiBackend::from_str(&s);
    }
    load_str!(selected_model, KEY_SELECTED_MODEL);
    // Migrate legacy bare model IDs that predate reasoning-effort variants.
    if sv.selected_model.as_deref() == Some("gpt-5.4") {
        sv.selected_model = Some("gpt-5.4-medium".to_string());
    }
    load_str!(load_dtype, KEY_LOAD_DTYPE);
    load_str!(load_device, KEY_LOAD_DEVICE);
    load_str!(google_client_id, KEY_GOOGLE_CLIENT_ID);
    load_str!(twitter_client_id, KEY_TWITTER_CLIENT_ID);
    load_bool!(enable_thinking, KEY_ENABLE_THINKING);
    load_bool!(do_sample, KEY_DO_SAMPLE);
    load_f64!(max_tokens, KEY_MAX_TOKENS);
    load_f64!(temperature, KEY_TEMPERATURE);
    load_f64!(repetition_penalty, KEY_REPETITION_PENALTY);
    load_obj!(google_token, KEY_GOOGLE_TOKEN, GoogleToken);
    load_obj!(twitter_token, KEY_TWITTER_TOKEN, TwitterToken);
    load_obj!(gmail_profile, KEY_GMAIL_PROFILE, GmailProfile);
    load_obj!(twitter_profile, KEY_TWITTER_PROFILE, TwitterProfile);
    load_obj!(scan_history, KEY_SCAN_HISTORY, ScanHistory);

    Ok(sv)
}

/// Save non-None fields to IndexedDB. Fields that are `None` are left unchanged.
pub async fn save_settings(db: DbRef<'_>, sv: &SettingValue) -> Result<(), CoreError> {
    macro_rules! save_str {
        ($field:expr, $key:expr) => {
            if let Some(v) = &$field {
                let json = serde_json::to_string(v).map_err(|e| CoreError::Serialize(e.to_string()))?;
                set_setting(db, $key, &json).await?;
            }
        };
    }
    macro_rules! save_prim {
        ($field:expr, $key:expr) => {
            if let Some(v) = $field {
                let json = serde_json::to_string(&v).map_err(|e| CoreError::Serialize(e.to_string()))?;
                set_setting(db, $key, &json).await?;
            }
        };
    }
    macro_rules! save_obj {
        ($field:expr, $key:expr) => {
            if let Some(v) = &$field {
                let json = serde_json::to_string(v).map_err(|e| CoreError::Serialize(e.to_string()))?;
                set_setting(db, $key, &json).await?;
            }
        };
    }

    save_str!(sv.openai_api_key, KEY_OPENAI_API_KEY);
    save_str!(sv.anthropic_api_key, KEY_ANTHROPIC_API_KEY);
    save_str!(sv.google_api_key, KEY_GOOGLE_API_KEY);
    save_str!(sv.xai_api_key, KEY_XAI_API_KEY);
    save_str!(sv.ollama_url, KEY_OLLAMA_URL);
    if let Some(v) = sv.ai_backend {
        let json = serde_json::to_string(v.as_str()).map_err(|e| CoreError::Serialize(e.to_string()))?;
        set_setting(db, KEY_AI_BACKEND, &json).await?;
    }
    save_str!(sv.selected_model, KEY_SELECTED_MODEL);
    save_str!(sv.load_dtype, KEY_LOAD_DTYPE);
    save_str!(sv.load_device, KEY_LOAD_DEVICE);
    save_str!(sv.google_client_id, KEY_GOOGLE_CLIENT_ID);
    save_str!(sv.twitter_client_id, KEY_TWITTER_CLIENT_ID);
    save_prim!(sv.enable_thinking, KEY_ENABLE_THINKING);
    save_prim!(sv.do_sample, KEY_DO_SAMPLE);
    save_prim!(sv.max_tokens, KEY_MAX_TOKENS);
    save_prim!(sv.temperature, KEY_TEMPERATURE);
    save_prim!(sv.repetition_penalty, KEY_REPETITION_PENALTY);
    save_obj!(sv.google_token, KEY_GOOGLE_TOKEN);
    save_obj!(sv.twitter_token, KEY_TWITTER_TOKEN);
    save_obj!(sv.gmail_profile, KEY_GMAIL_PROFILE);
    save_obj!(sv.twitter_profile, KEY_TWITTER_PROFILE);
    save_obj!(sv.scan_history, KEY_SCAN_HISTORY);

    Ok(())
}
