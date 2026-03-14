//! Crate error type. Convert to JsValue at the WASM boundary.

use std::error::Error;
use thiserror::Error;
use wasm_bindgen::JsValue;

#[derive(Error, Debug)]
pub enum CoreError {
    #[error("rexie/IndexedDB: {0}")]
    Rexie(String),

    #[error("deserialize: {0}")]
    Deserialize(String),

    #[error("serialize: {0}")]
    Serialize(String),
}

/// Convert rexie::Error to CoreError, preserving the underlying idb/browser error message.
/// When the message is generic (e.g. "idb error"), append a hint so the user knows what to try.
pub fn rexie_to_core(e: rexie::Error) -> CoreError {
    let inner = e.source().map(|s| s.to_string()).unwrap_or_default();
    let msg = if inner.is_empty() {
        e.to_string()
    } else {
        format!("{}: {}", e.to_string(), inner)
    };
    let hint = " (IndexedDB may be blocked, in private/incognito mode, or storage full)";
    let msg = if msg.trim() == "idb error" || msg.len() < 20 {
        format!("idb error{hint}")
    } else if msg.contains("DataError") || msg.contains("valid key") {
        format!("{msg} (Check for null, undefined, boolean, or NaN keys)")
    } else if msg.contains("idb error") && !msg.contains("private") && !msg.contains("blocked") {
        format!("{msg}{hint}")
    } else {
        msg
    };
    CoreError::Rexie(msg)
}

/// Convert crate errors to JsValue for wasm_bindgen return. Use at the boundary only.
pub fn to_js(e: &CoreError) -> JsValue {
    JsValue::from_str(&e.to_string())
}
