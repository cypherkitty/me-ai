//! Sync orchestration: Gmail and Twitter/X.
//!
//! Each adapter mirrors the TS sync logic:
//! - `sync_*`       — full or incremental sync
//! - `sync_*_more`  — fetch older items beyond the initial sync
//! - `clear_*_data` — wipe all local data for a source
//! - `get_*_sync_status` — return current sync status
//!
//! Progress is reported via `js_sys::Function` callbacks.
//! AbortSignal support uses `js_sys::Reflect::get` to check `signal.aborted`.

pub mod gmail;
pub mod twitter;

use js_sys::Function;
use serde::Serialize;
use wasm_bindgen::JsValue;

use crate::error::CoreError;

// ── Shared constants ───────────────────────────────────────────────────

/// Default number of items to sync per operation.
pub const DEFAULT_SYNC_LIMIT: u32 = 50;

// ── SyncProgress ───────────────────────────────────────────────────────

/// Progress payload sent to the JS callback.
#[derive(Clone, Debug, Serialize)]
pub struct SyncProgress {
    pub phase: String,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub current: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub total: Option<u32>,
}

impl SyncProgress {
    pub fn new(phase: &str, message: &str) -> Self {
        Self { phase: phase.to_string(), message: message.to_string(), current: None, total: None }
    }

    pub fn with_counts(phase: &str, message: &str, current: u32, total: u32) -> Self {
        Self { phase: phase.to_string(), message: message.to_string(), current: Some(current), total: Some(total) }
    }

    pub fn with_current(phase: &str, message: &str, current: u32) -> Self {
        Self { phase: phase.to_string(), message: message.to_string(), current: Some(current), total: None }
    }

    pub fn done(message: &str) -> Self {
        Self::new("done", message)
    }

    pub fn done_with_counts(message: &str, current: u32, total: u32) -> Self {
        Self::with_counts("done", message, current, total)
    }
}

// ── SyncResult ─────────────────────────────────────────────────────────

/// Result of a sync operation, returned to JS as JsValue.
#[derive(Clone, Debug, Serialize)]
pub struct SyncResult {
    pub added: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub deleted: Option<u32>,
    pub errors: u32,
}

// ── SyncStatus ─────────────────────────────────────────────────────────

/// Status of a sync source, returned to JS as JsValue.
#[derive(Clone, Debug, Serialize)]
pub struct SyncStatus {
    pub synced: bool,
    #[serde(rename = "totalItems")]
    pub total_items: i64,
    #[serde(rename = "lastSyncAt")]
    pub last_sync_at: Option<i64>,
    #[serde(rename = "hasMore")]
    pub has_more: bool,
    #[serde(rename = "historyId", skip_serializing_if = "Option::is_none")]
    pub history_id: Option<String>,
}

// ── Shared helpers ─────────────────────────────────────────────────────

/// Emit a serializable progress event to the optional JS callback.
pub fn emit_progress(on_progress: &Option<Function>, payload: &SyncProgress) {
    if let Some(f) = on_progress {
        if let Ok(js_val) = serde_wasm_bindgen::to_value(payload) {
            let _ = f.call1(&JsValue::NULL, &js_val);
        }
    }
}

/// Check if the AbortSignal has been aborted. Returns `Err(CoreError::Aborted)` if so.
pub fn check_aborted(signal: &Option<JsValue>) -> Result<(), CoreError> {
    if let Some(s) = signal {
        let aborted = js_sys::Reflect::get(s, &"aborted".into())
            .map(|v| v.as_bool().unwrap_or(false))
            .unwrap_or(false);
        if aborted {
            return Err(CoreError::Aborted("Sync was cancelled".into()));
        }
    }
    Ok(())
}

/// Get the current time in milliseconds (WASM-safe via js_sys).
pub fn now_ms() -> i64 {
    js_sys::Date::now() as i64
}
