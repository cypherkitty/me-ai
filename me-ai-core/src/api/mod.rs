//! HTTP API clients. Success bodies use [`ApiJson`] (`serde_json::Value`) until
//! per-endpoint structs are worth maintaining.

pub mod gmail;
pub mod twitter;

/// Gmail / Twitter REST response body (opaque JSON at the type level).
pub type ApiJson = serde_json::Value;
