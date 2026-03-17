//! Pure formatting utilities: byte sizes, truncation, string hashing, email utils.

/// Format bytes with 1 decimal (e.g. "1.1 GB").
pub fn format_bytes(bytes: u64) -> String {
    if bytes == 0 { return "0 B".to_string(); }
    let k = 1024u64;
    let sizes = ["B", "KB", "MB", "GB"];
    let i = (bytes as f64).log(k as f64).floor() as usize;
    let i = i.min(sizes.len() - 1);
    let val = bytes as f64 / (k.pow(i as u32) as f64);
    format!("{:.1} {}", val, sizes[i])
}

/// Format bytes with 2 decimals for MB/GB (e.g. "1.07 GB").
pub fn format_bytes_precise(bytes: u64) -> String {
    if bytes == 0 { return "0 B".to_string(); }
    let k = 1024u64;
    let sizes = ["B", "KB", "MB", "GB"];
    let i = (bytes as f64).log(k as f64).floor() as usize;
    let i = i.min(sizes.len() - 1);
    let val = bytes as f64 / (k.pow(i as u32) as f64);
    let decimals = if i >= 2 { 2 } else if i >= 1 { 1 } else { 0 };
    format!("{:.prec$} {}", val, sizes[i], prec = decimals)
}

/// Progress percentage (0.0-100.0). Returns -1.0 if total is unknown/zero.
pub fn progress_pct(loaded: u64, total: u64) -> f64 {
    if total == 0 { return -1.0; }
    ((loaded as f64 / total as f64) * 100.0).min(100.0)
}

/// Truncate to maxLen chars, appending "..." if truncated.
pub fn truncate(s: &str, max_len: usize) -> String {
    if s.len() <= max_len { return s.to_string(); }
    let mut end = max_len;
    while !s.is_char_boundary(end) { end -= 1; }
    format!("{}...", &s[..end])
}

/// Stable hue (0-360) from a string via djb2-style hash.
pub fn string_to_hue(s: &str) -> u32 {
    let mut hash: i64 = 0;
    for c in s.chars() {
        hash = (c as i64).wrapping_add(hash.wrapping_shl(5).wrapping_sub(hash));
    }
    (hash.unsigned_abs() % 360) as u32
}

/// Extract display name from "Name <email>" or "email@domain" string.
pub fn extract_name(from_str: &str) -> String {
    if from_str.is_empty() { return "Unknown".to_string(); }
    if let Some(end) = from_str.find('<') {
        let name = from_str[..end].trim().trim_matches('"').trim().to_string();
        if !name.is_empty() { return name; }
    }
    // Fallback: use part before @
    from_str.split('@').next().unwrap_or(from_str).to_string()
}

/// First letter of the sender's name, uppercased.
pub fn initial(from_str: &str) -> String {
    extract_name(from_str)
        .chars()
        .next()
        .map(|c| c.to_uppercase().to_string())
        .unwrap_or_default()
}

/// Generate a safe filename slug from a subject string (max 60 chars).
pub fn slugify(subject: &str) -> String {
    let src = if subject.is_empty() { "email" } else { subject };
    let slug: String = src.chars()
        .map(|c| if c.is_alphanumeric() || c == '_' || c == '-' { c } else if c == ' ' { '-' } else { '\0' })
        .filter(|&c| c != '\0')
        .take(60)
        .collect();
    let slug = slug.trim_end_matches('-').to_string();
    if slug.is_empty() { "email".to_string() } else { slug }
}

/// Format date_ms (epoch ms) as "YYYY-MM-DD" for use in filenames.
pub fn short_date(date_ms: i64) -> String {
    if date_ms <= 0 { return "email".to_string(); }
    let d = js_sys::Date::new(&wasm_bindgen::JsValue::from_f64(date_ms as f64));
    let y = d.get_full_year();
    let m = d.get_month() + 1;  // 0-indexed
    let day = d.get_date();
    format!("{:04}-{:02}-{:02}", y, m, day)
}

/// Generate a safe export filename: "{YYYY-MM-DD}_{slug}.{ext}".
pub fn export_filename(subject: &str, date_ms: i64, ext: &str) -> String {
    format!("{}_{}.{}", short_date(date_ms), slugify(subject), ext)
}

// ── API error parsing ─────────────────────────────────────────────────────

use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[wasm_bindgen(typescript_custom_section)]
const ERROR_TYPES: &'static str = r#"
export interface ParsedError {
    title: string;
    description: string;
    fix?: string | null;
    link?: { url: string; label: string };
    action?: string;
}
"#;

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParsedApiError {
    pub title: String,
    pub description: String,
    pub fix: String,        // empty when no fix suggestion
    pub action: String,     // "signout" or empty
    pub link_url: String,   // empty when no link
    pub link_label: String, // empty when no link
}

/// Parse a raw error message + HTTP status into user-friendly structured guidance.
pub fn parse_api_error(message: &str, status: u32) -> ParsedApiError {
    let msg = message;

    if msg.contains("has not been used in project") || msg.contains("is disabled") {
        let project_id = msg
            .split("project ")
            .nth(1)
            .and_then(|s| s.split_whitespace().next())
            .and_then(|s| s.parse::<u64>().ok())
            .map(|id| id.to_string());
        let url = project_id
            .map(|id| {
                format!(
                    "https://console.developers.google.com/apis/api/gmail.googleapis.com/overview?project={id}"
                )
            })
            .unwrap_or_else(|| {
                "https://console.cloud.google.com/apis/library/gmail.googleapis.com".to_string()
            });
        return ParsedApiError {
            title: "Gmail API not enabled".to_string(),
            description: "The Gmail API needs to be enabled in your Google Cloud project before it can be used.".to_string(),
            fix: "Click the link below to enable it, then wait ~30 seconds and retry.".to_string(),
            action: String::new(),
            link_url: url,
            link_label: "Enable Gmail API".to_string(),
        };
    }

    if status == 401 || msg.contains("Invalid Credentials") || msg.contains("invalid_token") {
        return ParsedApiError {
            title: "Session expired".to_string(),
            description: "Your access token has expired or is invalid.".to_string(),
            fix: "Sign out and sign in again to get a fresh token.".to_string(),
            action: "signout".to_string(),
            link_url: String::new(),
            link_label: String::new(),
        };
    }

    if status == 403 || (msg.contains("insufficient") && msg.contains("scope")) {
        return ParsedApiError {
            title: "Insufficient permissions".to_string(),
            description: "The app doesn't have the required permissions to access Gmail.".to_string(),
            fix: "Sign out, sign in again, and make sure to grant the Gmail read permission in the consent screen.".to_string(),
            action: "signout".to_string(),
            link_url: String::new(),
            link_label: String::new(),
        };
    }

    if msg.contains("access_denied") || msg.contains("user_denied") {
        return ParsedApiError {
            title: "Access denied".to_string(),
            description: "You declined the Gmail permission request.".to_string(),
            fix: "Click 'Sign in with Google' again and grant the Gmail read-only permission when prompted.".to_string(),
            action: String::new(),
            link_url: String::new(),
            link_label: String::new(),
        };
    }

    if msg.contains("popup") || msg.contains("blocked") {
        return ParsedApiError {
            title: "Popup blocked".to_string(),
            description: "The sign-in popup was blocked by your browser.".to_string(),
            fix: "Allow popups for this site in your browser settings, then try again.".to_string(),
            action: String::new(),
            link_url: String::new(),
            link_label: String::new(),
        };
    }

    if status == 429 || msg.contains("Rate Limit") || msg.contains("quota") {
        return ParsedApiError {
            title: "Rate limit exceeded".to_string(),
            description: "Too many requests to the API.".to_string(),
            fix: "Wait a minute and try again.".to_string(),
            action: String::new(),
            link_url: String::new(),
            link_label: String::new(),
        };
    }

    if msg.contains("Failed to fetch") || msg.contains("NetworkError") || msg.contains("network") {
        return ParsedApiError {
            title: "Network error".to_string(),
            description: "Could not reach the API.".to_string(),
            fix: "Check your internet connection and try again.".to_string(),
            action: String::new(),
            link_url: String::new(),
            link_label: String::new(),
        };
    }

    ParsedApiError {
        title: "Something went wrong".to_string(),
        description: msg.to_string(),
        fix: String::new(),
        action: String::new(),
        link_url: String::new(),
        link_label: String::new(),
    }
}
