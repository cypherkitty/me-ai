//! Crate error type. Convert to JsValue at the WASM boundary.

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

/// Convert crate errors to JsValue for wasm_bindgen return. Use at the boundary only.
pub fn to_js(e: &CoreError) -> JsValue {
    JsValue::from_str(&e.to_string())
}
