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

    #[error("plugin: {0}")]
    Plugin(String),

    #[error("llm: {0}")]
    Llm(String),
}

/// Format rexie/idb error message with user-friendly hints. Extracted for testability.
pub fn format_rexie_error_message(msg: &str, inner: &str) -> String {
    let full = if inner.is_empty() {
        msg.to_string()
    } else {
        format!("{msg}: {inner}")
    };
    let hint = " (IndexedDB may be blocked, in private/incognito mode, or storage full)";
    if full.trim() == "idb error" || full.len() < 20 {
        format!("idb error{hint}")
    } else if full.contains("DataError") || full.contains("valid key") {
        format!("{full} (Check for null, undefined, boolean, or NaN keys)")
    } else if full.contains("idb error") && !full.contains("private") && !full.contains("blocked") {
        format!("{full}{hint}")
    } else {
        full
    }
}

/// Convert rexie::Error to CoreError, preserving the underlying idb/browser error message.
/// When the message is generic (e.g. "idb error"), append a hint so the user knows what to try.
pub fn rexie_to_core(e: rexie::Error) -> CoreError {
    let inner = e.source().map(|s| s.to_string()).unwrap_or_default();
    let msg = format_rexie_error_message(&e.to_string(), &inner);
    CoreError::Rexie(msg)
}

/// Convert crate errors to JsValue for wasm_bindgen return. Use at the boundary only.
pub fn to_js(e: &CoreError) -> JsValue {
    JsValue::from_str(&e.to_string())
}

impl From<CoreError> for JsValue {
    fn from(e: CoreError) -> Self {
        JsValue::from_str(&e.to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn format_rexie_error_branches() {
        assert!(format_rexie_error_message("idb error", "").contains("IndexedDB may be blocked"));
        assert!(format_rexie_error_message("DataError: Invalid key path", "").contains("Check for null"));
        assert_eq!(
            format_rexie_error_message("VersionError: requested 1 < existing 20", ""),
            "VersionError: requested 1 < existing 20"
        );
    }
}
