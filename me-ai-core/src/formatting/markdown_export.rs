//! Email object → Markdown body and export filename (single JS value).
//! Replaces the former me-ai-web `markdown-export.ts` orchestration; browser download stays in TS.

use wasm_bindgen::JsValue;

#[cfg(target_arch = "wasm32")]
use js_sys::Reflect;

#[cfg(target_arch = "wasm32")]
use super::email_date_to_epoch_ms;
#[cfg(target_arch = "wasm32")]
use super::email_js_input::js_to_string;
#[cfg(target_arch = "wasm32")]
use super::export_email_filename_from_js;
#[cfg(target_arch = "wasm32")]
use super::markdown::email_to_markdown;

#[cfg(not(target_arch = "wasm32"))]
use super::export_filename;

#[cfg(target_arch = "wasm32")]
fn js_field_string(msg: &JsValue, key: &str) -> String {
    Reflect::get(msg, &JsValue::from_str(key))
        .ok()
        .and_then(|v| {
            if v.is_null() || v.is_undefined() {
                None
            } else {
                v.as_string().or_else(|| js_to_string(&v))
            }
        })
        .unwrap_or_default()
}

#[cfg(target_arch = "wasm32")]
fn optional_nonempty_field(msg: &JsValue, key: &str) -> Option<String> {
    let v = Reflect::get(msg, &JsValue::from_str(key)).ok()?;
    if v.is_null() || v.is_undefined() {
        return None;
    }
    let s = v.as_string().or_else(|| js_to_string(&v))?;
    let t = s.trim();
    if t.is_empty() {
        None
    } else {
        Some(t.to_string())
    }
}

/// `MessageForMarkdown`-shaped JS object → full markdown document (metadata table + body).
#[cfg(target_arch = "wasm32")]
pub fn email_message_to_markdown(msg: &JsValue) -> String {
    if !msg.is_object() {
        return String::new();
    }
    let subject = js_field_string(msg, "subject");
    let from = js_field_string(msg, "from");
    let to = js_field_string(msg, "to");
    let date_val = Reflect::get(msg, &JsValue::from_str("date")).unwrap_or(JsValue::NULL);
    let date_ms = email_date_to_epoch_ms(&date_val) as i64;
    let body = optional_nonempty_field(msg, "body");
    let html_body = optional_nonempty_field(msg, "htmlBody");
    email_to_markdown(
        subject.as_str(),
        from.as_str(),
        to.as_str(),
        date_ms,
        body.as_deref(),
        html_body.as_deref(),
    )
}

#[cfg(not(target_arch = "wasm32"))]
pub fn email_message_to_markdown(_msg: &JsValue) -> String {
    String::new()
}

/// Safe filename from `subject` + `date` on a message-like JS object.
#[cfg(target_arch = "wasm32")]
pub fn export_email_filename_from_message(msg: &JsValue, ext: &str) -> String {
    if !msg.is_object() {
        return export_email_filename_from_js("", &JsValue::NULL, ext);
    }
    let subject = js_field_string(msg, "subject");
    let date_val = Reflect::get(msg, &JsValue::from_str("date")).unwrap_or(JsValue::NULL);
    export_email_filename_from_js(&subject, &date_val, ext)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn export_email_filename_from_message(_msg: &JsValue, ext: &str) -> String {
    export_filename("", 0, ext)
}
