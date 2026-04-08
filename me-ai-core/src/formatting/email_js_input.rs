//! Email date values from the JS boundary (`string | number | bigint | null | undefined`).
//! Mirrors the former me-ai-web `email-utils` parsing using `Date.parse` and `Number()`.

use wasm_bindgen::prelude::*;

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::JsCast;

#[cfg(target_arch = "wasm32")]
use js_sys::Date;

#[cfg(target_arch = "wasm32")]
use crate::time_util::format_display_datetime_en_us_utc;

/// `Number(value)` in JS — coerces bigint and boxed values (avoids deprecated `js_sys::Number::new`).
#[cfg(target_arch = "wasm32")]
fn js_number_coerce(v: &JsValue) -> f64 {
    let global = js_sys::global();
    js_sys::Reflect::get(&global, &JsValue::from_str("Number"))
        .ok()
        .and_then(|c| c.dyn_into::<js_sys::Function>().ok())
        .and_then(|f| f.call1(&JsValue::NULL, v).ok())
        .and_then(|x| x.as_f64())
        .unwrap_or(f64::NAN)
}

#[cfg(target_arch = "wasm32")]
fn js_string_constructor(v: &JsValue) -> String {
    let global = js_sys::global();
    js_sys::Reflect::get(&global, &JsValue::from_str("String"))
        .ok()
        .and_then(|c| c.dyn_into::<js_sys::Function>().ok())
        .and_then(|f| f.call1(&JsValue::NULL, v).ok())
        .and_then(|s| s.as_string())
        .unwrap_or_default()
}

/// String coercion for arbitrary JS values (used by markdown export field readers).
#[cfg(target_arch = "wasm32")]
pub(crate) fn js_to_string(v: &JsValue) -> Option<String> {
    if let Some(s) = v.as_string() {
        return Some(s);
    }
    let global = js_sys::global();
    js_sys::Reflect::get(&global, &JsValue::from_str("String"))
        .ok()
        .and_then(|c| c.dyn_into::<js_sys::Function>().ok())
        .and_then(|f| f.call1(&JsValue::NULL, v).ok())
        .and_then(|s| s.as_string())
}

/// Epoch milliseconds for markdown export and filenames; `0` when missing or unparseable.
#[cfg(target_arch = "wasm32")]
pub fn email_date_to_epoch_ms(v: &JsValue) -> f64 {
    if v.is_null() || v.is_undefined() {
        return 0.0;
    }
    if let Some(ms) = v.as_f64() {
        return if ms.is_finite() { ms } else { 0.0 };
    }
    if let Some(s) = js_to_string(v) {
        let t = s.trim();
        if t.is_empty() {
            return 0.0;
        }
        if t.chars().all(|c| c.is_ascii_digit()) {
            if let Ok(n) = t.parse::<f64>() {
                return if n.is_finite() { n } else { 0.0 };
            }
            return 0.0;
        }
        let parsed = Date::parse(t);
        return if parsed.is_finite() { parsed } else { 0.0 };
    }
    let n = js_number_coerce(v);
    if n.is_finite() { n } else { 0.0 }
}

#[cfg(not(target_arch = "wasm32"))]
pub fn email_date_to_epoch_ms(_v: &JsValue) -> f64 {
    0.0
}

/// List/detail display string (en-US UTC via core); same rules as the former TS `formatDate`.
#[cfg(target_arch = "wasm32")]
pub fn format_email_display_date(v: &JsValue) -> String {
    if v.is_null() || v.is_undefined() {
        return String::new();
    }
    if let Some(ms) = v.as_f64() {
        return if ms.is_finite() {
            format_display_datetime_en_us_utc(ms as i64)
        } else {
            js_string_constructor(v)
        };
    }
    if let Some(s) = js_to_string(v) {
        let trimmed = s.trim();
        if trimmed.is_empty() {
            return String::new();
        }
        if trimmed.chars().all(|c| c.is_ascii_digit()) {
            if let Ok(n) = trimmed.parse::<f64>() {
                return if n.is_finite() {
                    format_display_datetime_en_us_utc(n as i64)
                } else {
                    trimmed.to_string()
                };
            }
            return trimmed.to_string();
        }
        let parsed = Date::parse(trimmed);
        if parsed.is_finite() {
            return format_display_datetime_en_us_utc(parsed as i64);
        }
        return s;
    }
    let ms = js_number_coerce(v);
    if ms.is_finite() {
        format_display_datetime_en_us_utc(ms as i64)
    } else {
        js_string_constructor(v)
    }
}

#[cfg(not(target_arch = "wasm32"))]
pub fn format_email_display_date(_v: &JsValue) -> String {
    String::new()
}

/// Safe export filename from subject + JS date value.
pub fn export_email_filename_from_js(subject: &str, date: &JsValue, ext: &str) -> String {
    let ms = email_date_to_epoch_ms(date) as i64;
    super::export_filename(subject, ms, ext)
}
