//! Crate error type. Convert to JsValue at the WASM boundary.

use thiserror::Error;
use wasm_bindgen::JsValue;

#[derive(Error, Debug)]
pub enum CoreError {
    #[error("me-ai-core: init() was not called or adapter is missing")]
    AdapterNotSet,

    #[error("adapter.query is not a function")]
    AdapterQueryMissing,

    #[error("adapter.query did not return a Promise")]
    AdapterQueryNotPromise,

    #[allow(dead_code)]
    #[error("adapter.exec is not a function")]
    AdapterExecMissing,

    #[allow(dead_code)]
    #[error("adapter.exec did not return a Promise")]
    AdapterExecNotPromise,

    #[error("adapter.query failed: {0}")]
    QueryCall(String),

    #[error("query await failed: {0}")]
    QueryAwait(String),

    #[allow(dead_code)]
    #[error("adapter.exec failed: {0}")]
    ExecCall(String),

    #[allow(dead_code)]
    #[error("exec await failed: {0}")]
    ExecAwait(String),

    #[error("deserialize rows: {0}")]
    Deserialize(String),

    #[error("serialize: {0}")]
    Serialize(String),
}

/// Convert crate errors to JsValue for wasm_bindgen return. Use at the boundary only.
pub fn to_js(e: &CoreError) -> JsValue {
    JsValue::from_str(&e.to_string())
}
