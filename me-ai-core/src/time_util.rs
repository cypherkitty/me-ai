//! Wall-clock time and HTTP date parsing without `js_sys`.
//!
//! In the browser, [`now_ms`] uses [`Performance`](web_sys::Performance) (`time_origin + now`).
//! Offline / tests fall back to [`std::time::SystemTime`].

use chrono::{DateTime, Datelike, Utc};

/// Current wall time as Unix milliseconds.
pub fn now_ms() -> i64 {
    if let Some(w) = web_sys::window() {
        if let Some(p) = w.performance() {
            return (p.time_origin() + p.now()) as i64;
        }
    }
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis() as i64)
        .unwrap_or(0)
}

/// Parse HTTP / mail style date strings (RFC 3339, RFC 2822, Twitter `created_at`) to epoch ms.
pub fn parse_http_date_to_ms(s: &str) -> Option<i64> {
    let s = s.trim();
    if s.is_empty() {
        return None;
    }
    if let Ok(dt) = DateTime::parse_from_rfc3339(s) {
        return Some(dt.timestamp_millis());
    }
    if let Ok(dt) = DateTime::parse_from_rfc2822(s) {
        return Some(dt.timestamp_millis());
    }
    if let Ok(dt) = DateTime::parse_from_str(s, "%a %b %d %H:%M:%S %z %Y") {
        return Some(dt.timestamp_millis());
    }
    None
}

/// UTC calendar date as `YYYY-MM-DD` from epoch ms.
pub fn format_utc_ymd_from_ms(date_ms: i64) -> Option<String> {
    if date_ms <= 0 {
        return None;
    }
    let d = DateTime::<Utc>::from_timestamp_millis(date_ms)?.date_naive();
    Some(format!("{:04}-{:02}-{:02}", d.year(), d.month(), d.day()))
}

/// US-style M/D/YYYY in UTC (replaces `Date#toLocaleDateString('en-US')` for prompts).
pub fn format_utc_mdy_from_ms(date_ms: i64) -> Option<String> {
    if date_ms <= 0 {
        return None;
    }
    let d = DateTime::<Utc>::from_timestamp_millis(date_ms)?.date_naive();
    Some(format!("{}/{}/{}", d.month(), d.day(), d.year()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_rfc3339() {
        let ms = parse_http_date_to_ms("2024-03-15T12:30:00Z").unwrap();
        assert_eq!(ms, 1_710_505_800_000);
    }

    #[test]
    fn parse_rfc2822() {
        let ms = parse_http_date_to_ms("Fri, 15 Mar 2024 12:30:00 GMT").unwrap();
        assert_eq!(ms, 1_710_505_800_000);
    }

    #[test]
    fn parse_twitter_created_at() {
        let ms = parse_http_date_to_ms("Sun Sep 04 00:00:59 +0000 2011").unwrap();
        assert_eq!(ms, 1_315_094_459_000);
    }

    #[test]
    fn format_utc_ymd() {
        assert_eq!(format_utc_ymd_from_ms(0), None);
        assert_eq!(format_utc_ymd_from_ms(1_710_505_800_000), Some("2024-03-15".to_string()));
    }

    #[test]
    fn format_utc_mdy() {
        assert_eq!(format_utc_mdy_from_ms(1_710_505_800_000), Some("3/15/2024".to_string()));
    }
}
