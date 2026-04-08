//! Pure formatting utilities: byte sizes, truncation, string hashing, email utils.

pub mod markdown;

fn scale_bytes(bytes: u64) -> (f64, &'static str, usize) {
    const SIZES: [&str; 4] = ["B", "KB", "MB", "GB"];
    const K: u64 = 1024;
    let i = ((bytes as f64).log(K as f64).floor() as usize).min(SIZES.len() - 1);
    let val = bytes as f64 / (K.pow(i as u32) as f64);
    let decimals = if i >= 2 { 2 } else if i >= 1 { 1 } else { 0 };
    (val, SIZES[i], decimals)
}

/// Format bytes with 1 decimal (e.g. "1.1 GB").
pub fn format_bytes(bytes: u64) -> String {
    if bytes == 0 { return "0 B".to_string(); }
    let (val, unit, _) = scale_bytes(bytes);
    format!("{:.1} {}", val, unit)
}

/// Format bytes with 2 decimals for MB/GB (e.g. "1.07 GB").
pub fn format_bytes_precise(bytes: u64) -> String {
    if bytes == 0 { return "0 B".to_string(); }
    let (val, unit, decimals) = scale_bytes(bytes);
    format!("{:.prec$} {}", val, unit, prec = decimals)
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

/// Format date_ms (epoch ms) as UTC `YYYY-MM-DD`. Returns `None` for non-positive values.
pub fn short_date(date_ms: i64) -> Option<String> {
    crate::time_util::format_utc_ymd_from_ms(date_ms)
}

/// Generate a safe export filename: "{YYYY-MM-DD}_{slug}.{ext}".
/// Uses "unknown-date" when `date_ms` is non-positive.
pub fn export_filename(subject: &str, date_ms: i64, ext: &str) -> String {
    let date = short_date(date_ms).unwrap_or_else(|| "unknown-date".to_string());
    format!("{}_{}.{}", date, slugify(subject), ext)
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

#[cfg(test)]
mod tests {
    use super::*;

    // ── format_bytes ─────────────────────────────────────────────────

    #[test]
    fn format_bytes_zero() {
        assert_eq!(format_bytes(0), "0 B");
    }

    #[test]
    fn format_bytes_bytes() {
        assert_eq!(format_bytes(512), "512.0 B");
    }

    #[test]
    fn format_bytes_kilobytes() {
        assert_eq!(format_bytes(1024), "1.0 KB");
        assert_eq!(format_bytes(2048), "2.0 KB");
    }

    #[test]
    fn format_bytes_megabytes() {
        assert_eq!(format_bytes(1024 * 1024), "1.0 MB");
    }

    #[test]
    fn format_bytes_gigabytes() {
        assert_eq!(format_bytes(1024 * 1024 * 1024), "1.0 GB");
    }

    // ── format_bytes_precise ─────────────────────────────────────────

    #[test]
    fn format_bytes_precise_zero() {
        assert_eq!(format_bytes_precise(0), "0 B");
    }

    #[test]
    fn format_bytes_precise_bytes_no_decimals() {
        assert_eq!(format_bytes_precise(512), "512 B");
    }

    #[test]
    fn format_bytes_precise_kilobytes_one_decimal() {
        assert_eq!(format_bytes_precise(1024), "1.0 KB");
        assert_eq!(format_bytes_precise(1536), "1.5 KB");
    }

    #[test]
    fn format_bytes_precise_megabytes_two_decimals() {
        assert_eq!(format_bytes_precise(1024 * 1024), "1.00 MB");
        assert_eq!(format_bytes_precise(1024 * 1024 + 1024 * 512), "1.50 MB");
    }

    #[test]
    fn format_bytes_precise_gigabytes_two_decimals() {
        assert_eq!(format_bytes_precise(1024 * 1024 * 1024), "1.00 GB");
    }

    // ── progress_pct ─────────────────────────────────────────────────

    #[test]
    fn progress_pct_zero_total_returns_negative() {
        assert_eq!(progress_pct(0, 0), -1.0);
        assert_eq!(progress_pct(50, 0), -1.0);
    }

    #[test]
    fn progress_pct_half() {
        assert_eq!(progress_pct(50, 100), 50.0);
    }

    #[test]
    fn progress_pct_complete() {
        assert_eq!(progress_pct(100, 100), 100.0);
    }

    #[test]
    fn progress_pct_caps_at_100() {
        assert_eq!(progress_pct(200, 100), 100.0);
    }

    // ── truncate ─────────────────────────────────────────────────────

    #[test]
    fn truncate_short_string_unchanged() {
        assert_eq!(truncate("hello", 10), "hello");
    }

    #[test]
    fn truncate_exact_length_unchanged() {
        assert_eq!(truncate("hello", 5), "hello");
    }

    #[test]
    fn truncate_appends_ellipsis() {
        assert_eq!(truncate("hello world", 5), "hello...");
    }

    #[test]
    fn truncate_empty_string() {
        assert_eq!(truncate("", 10), "");
    }

    #[test]
    fn truncate_respects_char_boundary() {
        // "café" is 5 bytes; truncating at 4 bytes must not split the 'é' (2 bytes)
        assert_eq!(truncate("café", 4), "caf...");
    }

    // ── string_to_hue ─────────────────────────────────────────────────

    #[test]
    fn string_to_hue_range() {
        for word in &["hello", "world", "PROMOTION", "RECEIPT", "NEWSLETTER"] {
            let hue = string_to_hue(word);
            assert!(hue < 360, "hue {hue} out of range for '{word}'");
        }
    }

    #[test]
    fn string_to_hue_stable() {
        assert_eq!(string_to_hue("PROMOTION"), string_to_hue("PROMOTION"));
    }

    #[test]
    fn string_to_hue_different_strings() {
        assert_ne!(string_to_hue("PROMOTION"), string_to_hue("RECEIPT"));
    }

    #[test]
    fn string_to_hue_empty() {
        let hue = string_to_hue("");
        assert!(hue < 360);
    }

    // ── extract_name ─────────────────────────────────────────────────

    #[test]
    fn extract_name_display_name_and_email() {
        assert_eq!(extract_name("Alice Smith <alice@example.com>"), "Alice Smith");
    }

    #[test]
    fn extract_name_quoted_display_name() {
        assert_eq!(extract_name("\"Bob Jones\" <bob@example.com>"), "Bob Jones");
    }

    #[test]
    fn extract_name_bare_email_uses_local_part() {
        assert_eq!(extract_name("alice@example.com"), "alice");
    }

    #[test]
    fn extract_name_empty_angle_brackets_falls_back_to_local_part() {
        // No name before `<`, so falls back to the part before `@`
        assert_eq!(extract_name("<alice@example.com>"), "<alice");
    }

    #[test]
    fn extract_name_empty_string() {
        assert_eq!(extract_name(""), "Unknown");
    }

    // ── initial ──────────────────────────────────────────────────────

    #[test]
    fn initial_first_letter_uppercase() {
        assert_eq!(initial("alice@example.com"), "A");
    }

    #[test]
    fn initial_display_name() {
        assert_eq!(initial("Bob Jones <bob@example.com>"), "B");
    }

    #[test]
    fn initial_empty_string_returns_unknown_initial() {
        // extract_name("") returns "Unknown", so initial is "U"
        assert_eq!(initial(""), "U");
    }

    // ── slugify ──────────────────────────────────────────────────────

    #[test]
    fn slugify_normal_subject() {
        assert_eq!(slugify("Hello World"), "Hello-World");
    }

    #[test]
    fn slugify_special_chars_removed() {
        assert_eq!(slugify("Invoice #123 (Q4)"), "Invoice-123-Q4");
    }

    #[test]
    fn slugify_empty_subject_returns_email() {
        assert_eq!(slugify(""), "email");
    }

    #[test]
    fn slugify_only_special_chars_returns_email() {
        assert_eq!(slugify("!!!"), "email");
    }

    #[test]
    fn slugify_trims_trailing_dash() {
        assert_eq!(slugify("Hello "), "Hello");
    }

    #[test]
    fn slugify_max_60_chars() {
        let long = "a".repeat(100);
        assert_eq!(slugify(&long).len(), 60);
    }

    // ── short_date (UTC; non-positive → None) ──

    #[test]
    fn short_date_zero_returns_none() {
        assert_eq!(short_date(0), None);
    }

    #[test]
    fn short_date_negative_returns_none() {
        assert_eq!(short_date(-1), None);
        assert_eq!(short_date(-1_000_000), None);
    }

    #[test]
    fn short_date_known_epoch() {
        assert_eq!(short_date(1_710_505_800_000), Some("2024-03-15".to_string()));
    }

    // ── parse_api_error ──────────────────────────────────────────────

    #[test]
    fn parse_api_error_gmail_not_enabled() {
        let e = parse_api_error("has not been used in project 123", 403);
        assert_eq!(e.title, "Gmail API not enabled");
        assert!(e.link_url.contains("123"), "link should include project id");
    }

    #[test]
    fn parse_api_error_gmail_disabled() {
        let e = parse_api_error("Gmail API is disabled for project 456", 403);
        assert_eq!(e.title, "Gmail API not enabled");
    }

    #[test]
    fn parse_api_error_401_expired() {
        let e = parse_api_error("Token expired", 401);
        assert_eq!(e.title, "Session expired");
        assert_eq!(e.action, "signout");
    }

    #[test]
    fn parse_api_error_invalid_credentials() {
        let e = parse_api_error("Invalid Credentials", 200);
        assert_eq!(e.title, "Session expired");
    }

    #[test]
    fn parse_api_error_403_insufficient_scope() {
        let e = parse_api_error("insufficient permission scope", 403);
        assert_eq!(e.title, "Insufficient permissions");
        assert_eq!(e.action, "signout");
    }

    #[test]
    fn parse_api_error_access_denied() {
        let e = parse_api_error("access_denied by user", 0);
        assert_eq!(e.title, "Access denied");
    }

    #[test]
    fn parse_api_error_popup_blocked() {
        let e = parse_api_error("popup was blocked", 0);
        assert_eq!(e.title, "Popup blocked");
    }

    #[test]
    fn parse_api_error_rate_limit() {
        let e = parse_api_error("Rate Limit exceeded", 429);
        assert_eq!(e.title, "Rate limit exceeded");
    }

    #[test]
    fn parse_api_error_network() {
        let e = parse_api_error("Failed to fetch resource", 0);
        assert_eq!(e.title, "Network error");
    }

    #[test]
    fn parse_api_error_generic_fallback() {
        let e = parse_api_error("Something totally unknown", 500);
        assert_eq!(e.title, "Something went wrong");
        assert!(e.description.contains("Something totally unknown"));
    }

    #[test]
    fn parse_api_error_gmail_no_project_id_uses_fallback_url() {
        let e = parse_api_error("has not been used in project xyz", 403);
        assert_eq!(e.title, "Gmail API not enabled");
        // "xyz" is not a valid u64, so the fallback URL should be used
        assert!(e.link_url.contains("cloud.google.com"), "expected fallback url, got: {}", e.link_url);
    }
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
