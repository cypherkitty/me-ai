//! Ollama LLM engine in WASM: connection check, load model, stream chat with TPS and [`EngineMessage`]-shaped events.

use std::cell::RefCell;

use serde_json::json;
use wasm_bindgen::prelude::*;

use crate::error::to_js as error_to_js;
use crate::llm::ollama::{
    self, ollama_chat_messages_from_js, ollama_stream_options_from_js, stream_ollama_chat_with_emit,
    OllamaStreamChatParams, OllamaTokenEmit,
};
use crate::MeAiCore;

#[derive(Clone, Copy, PartialEq, Eq)]
enum OllamaEngineStatus {
    Idle,
    Loading,
    Ready,
    Generating,
}

struct OllamaLlmEngineInner {
    model_name: Option<String>,
    status: OllamaEngineStatus,
    /// Single JS callback; fan-out to multiple UI listeners stays in TypeScript.
    on_message: Option<JsValue>,
}

/// Browser-side Ollama adapter: owns model/status and emits the same events the old TS engine did.
#[wasm_bindgen(js_name = OllamaLlmEngine)]
pub struct OllamaLlmEngine {
    inner: RefCell<OllamaLlmEngineInner>,
}

impl OllamaLlmEngine {
    fn emit(&self, v: &serde_json::Value) {
        let cb = self.inner.borrow().on_message.clone();
        if let Some(f) = cb {
            if f.is_function() {
                if let Ok(jsv) = serde_wasm_bindgen::to_value(v) {
                    if let Ok(func) = f.dyn_into::<js_sys::Function>() {
                        let _ = func.call1(&JsValue::NULL, &jsv);
                    }
                }
            }
        }
    }

    fn status_str(s: OllamaEngineStatus) -> &'static str {
        match s {
            OllamaEngineStatus::Idle => "idle",
            OllamaEngineStatus::Loading => "loading",
            OllamaEngineStatus::Ready => "ready",
            OllamaEngineStatus::Generating => "generating",
        }
    }
}

impl Default for OllamaLlmEngine {
    fn default() -> Self {
        Self::new()
    }
}

#[wasm_bindgen(js_class = OllamaLlmEngine)]
impl OllamaLlmEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> OllamaLlmEngine {
        OllamaLlmEngine {
            inner: RefCell::new(OllamaLlmEngineInner {
                model_name: None,
                status: OllamaEngineStatus::Idle,
                on_message: None,
            }),
        }
    }

    /// Receives [`EngineMessage`]-shaped plain objects (same as legacy `ollama-engine.ts`).
    #[wasm_bindgen(js_name = setOnMessage)]
    pub fn set_on_message(&self, cb: &JsValue) {
        self.inner.borrow_mut().on_message = if cb.is_function() {
            Some(cb.clone())
        } else {
            None
        };
    }

    #[wasm_bindgen(getter)]
    pub fn status(&self) -> String {
        Self::status_str(self.inner.borrow().status).to_string()
    }

    #[wasm_bindgen(getter, js_name = isReady)]
    pub fn is_ready(&self) -> bool {
        self.inner.borrow().status == OllamaEngineStatus::Ready
    }

    #[wasm_bindgen(getter, js_name = isGenerating)]
    pub fn is_generating(&self) -> bool {
        self.inner.borrow().status == OllamaEngineStatus::Generating
    }

    #[wasm_bindgen(getter, js_name = modelId)]
    pub fn model_id(&self) -> Option<String> {
        self.inner.borrow().model_name.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn backend(&self) -> String {
        "ollama".to_string()
    }

    #[wasm_bindgen(js_name = terminate)]
    pub fn terminate(&self) {
        let mut inner = self.inner.borrow_mut();
        inner.model_name = None;
        inner.status = OllamaEngineStatus::Idle;
    }

    pub fn interrupt(&self) {
        #[cfg(target_arch = "wasm32")]
        web_sys::console::warn_1(&JsValue::from_str(
            "Ollama doesn't support generation interruption",
        ));
    }

    pub fn reset(&self) {}

    /// Test Ollama using settings-derived URL from `core`.
    pub async fn check(&self, core: &MeAiCore) -> Result<(), JsValue> {
        {
            let mut inner = self.inner.borrow_mut();
            inner.status = OllamaEngineStatus::Loading;
        }
        self.emit(&json!({
            "status": "loading",
            "data": "Testing Ollama connection...",
        }));

        let url = match ollama::resolved_ollama_url(core.rexie_db()).await {
            Ok(u) => u,
            Err(e) => {
                {
                    let mut inner = self.inner.borrow_mut();
                    inner.status = OllamaEngineStatus::Idle;
                }
                self.emit(&json!({ "status": "error", "data": e.to_string() }));
                return Ok(());
            }
        };
        let result = ollama::test_ollama_connection(&url)
            .await
            .map_err(|e| error_to_js(&e))?;

        if result.connected {
            {
                let mut inner = self.inner.borrow_mut();
                inner.status = OllamaEngineStatus::Idle;
            }
            self.emit(&json!({
                "status": "ready",
                "data": {
                    "type": "ollama",
                    "version": result.version,
                    "url": url,
                },
            }));
        } else {
            {
                let mut inner = self.inner.borrow_mut();
                inner.status = OllamaEngineStatus::Idle;
            }
            self.emit(&json!({
                "status": "error",
                "data": format!(
                    "Ollama not available: {}. Make sure Ollama is running.",
                    result.error
                ),
            }));
        }
        Ok(())
    }

    #[wasm_bindgen(js_name = loadModel)]
    pub async fn load_model(&self, core: &MeAiCore, model_name: &str) -> Result<(), JsValue> {
        {
            let mut inner = self.inner.borrow_mut();
            inner.model_name = Some(model_name.to_string());
            inner.status = OllamaEngineStatus::Loading;
        }
        self.emit(&json!({
            "status": "loading",
            "data": format!("Connecting to Ollama model: {model_name}..."),
        }));

        let url = match ollama::resolved_ollama_url(core.rexie_db()).await {
            Ok(u) => u,
            Err(e) => {
                {
                    let mut inner = self.inner.borrow_mut();
                    inner.model_name = None;
                    inner.status = OllamaEngineStatus::Idle;
                }
                self.emit(&json!({ "status": "error", "data": e.to_string() }));
                return Ok(());
            }
        };
        let result = ollama::test_ollama_connection(&url)
            .await
            .map_err(|e| error_to_js(&e))?;

        if !result.connected {
            {
                let mut inner = self.inner.borrow_mut();
                inner.model_name = None;
                inner.status = OllamaEngineStatus::Idle;
            }
            self.emit(&json!({
                "status": "error",
                "data": format!("Ollama not available: {}", result.error),
            }));
            return Ok(());
        }

        {
            let mut inner = self.inner.borrow_mut();
            inner.status = OllamaEngineStatus::Ready;
        }
        self.emit(&json!({ "status": "ready" }));
        Ok(())
    }

    pub async fn generate(
        &self,
        core: &MeAiCore,
        messages: JsValue,
        options: JsValue,
    ) -> Result<(), JsValue> {
        let model_name = match self.inner.borrow().model_name.clone() {
            Some(m) => m,
            None => {
                self.emit(&json!({
                    "status": "error",
                    "data": "No Ollama model selected",
                }));
                return Ok(());
            }
        };

        let url = match ollama::resolved_ollama_url(core.rexie_db()).await {
            Ok(u) => u,
            Err(e) => {
                self.emit(&json!({ "status": "error", "data": e.to_string() }));
                return Ok(());
            }
        };

        let messages_in = match ollama_chat_messages_from_js(&messages) {
            Ok(v) => v,
            Err(e) => {
                self.emit(&json!({ "status": "error", "data": e.to_string() }));
                return Ok(());
            }
        };
        let stream_options = match ollama_stream_options_from_js(&options) {
            Ok(v) => v,
            Err(e) => {
                self.emit(&json!({ "status": "error", "data": e.to_string() }));
                return Ok(());
            }
        };
        let params = OllamaStreamChatParams::from_inputs(messages_in, stream_options);

        {
            let mut inner = self.inner.borrow_mut();
            inner.status = OllamaEngineStatus::Generating;
        }
        self.emit(&json!({
            "status": "start",
            "inputTokens": 0,
        }));

        let started = performance_now_ms();
        let mut token_count = 0u32;

        let gen_result = stream_ollama_chat_with_emit(
            &url,
            &model_name,
            params,
            |em: &OllamaTokenEmit| {
                if em.done {
                    let tps: Option<f64> = match (em.eval_count, em.eval_duration) {
                        (_, Some(d)) if d > 0.0 => {
                            let c = em.eval_count.unwrap_or(0) as f64;
                            Some(((c / (d / 1e9)) * 10.).round() / 10.)
                        }
                        _ => None,
                    };
                    let n = em.eval_count.unwrap_or(token_count);
                    self.emit(&json!({
                        "status": "complete",
                        "tps": tps,
                        "numTokens": n,
                    }));
                } else if !em.content.is_empty() {
                    token_count += 1;
                    let elapsed = performance_now_ms() - started;
                    let tps = if elapsed > 0.0 {
                        ((token_count as f64 / elapsed) * 1000.0 * 10.).round() / 10.
                    } else {
                        0.0
                    };
                    self.emit(&json!({
                        "status": "update",
                        "output": em.content,
                        "tps": tps,
                        "numTokens": token_count,
                    }));
                }
            },
        )
        .await;

        {
            let mut inner = self.inner.borrow_mut();
            inner.status = OllamaEngineStatus::Ready;
        }

        match gen_result {
            Ok(_) => Ok(()),
            Err(e) => {
                self.emit(&json!({
                    "status": "error",
                    "data": e.to_string(),
                }));
                Ok(())
            }
        }
    }
}

fn performance_now_ms() -> f64 {
    #[cfg(target_arch = "wasm32")]
    {
        web_sys::window()
            .and_then(|w| w.performance())
            .map(|p| p.now())
            .unwrap_or(0.0)
    }
    #[cfg(not(target_arch = "wasm32"))]
    {
        0.0
    }
}
