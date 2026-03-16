//! Email classification logic: system prompt building, LLM response parsing,
//! email prompt formatting. Pure functions — no DB access.

use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

use crate::formatting::string_to_hue;

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TriageClassification {
    pub action: String,
    pub category: String,           // "noise" | "info" | "critical"
    #[wasm_bindgen(js_name = "categoryTier")]
    pub category_tier: String,      // "NOISE" | "INFO" | "CRITICAL"
    pub reason: String,
    pub summary: String,
    pub tags: String,               // JSON-encoded string array e.g. `["tag1","tag2"]`
}

/// Build the LLM system prompt from a comma-separated list of active plugin names.
pub fn build_system_prompt(plugin_names: &str) -> String {
    format!(
        r#"You are a message classifier. Analyze this message and produce a classification.

Output ONLY a valid JSON object — no markdown, no explanation, no extra text.

Format:
{{
  "action": "EVENT_TYPE_NAME",
  "category": "noise",
  "reason": "One sentence explaining why",
  "summary": "2-3 sentence summary of the message content",
  "tags": ["tag1", "tag2", "tag3"]
}}

Guidelines for "action" (Event Type):
- Condense the message's core purpose into a distinct, high-level event type.
- This MUST be a flexible, dynamically generated string categorizing the *nature* of the message.
- Examples: RECEIPT, SHIPPING_UPDATE, NEWSLETTER, SECURITY_ALERT, ACCOUNT_NOTICE, PROMOTION, BILLING_REMINDER, JOB_ALERT, SOCIAL_MENTION
- Do not use verbs. Use noun phrases that describe the event type.
- Reuse existing event types when the message fits — avoid creating very similar types.

Guidelines for "category" (Event Category — exactly three tiers):
- "noise"    — Pure spam, mass marketing, social media digests, promotional blasts. Will be automatically deleted. Use ONLY when you are certain.
- "info"     — Useful but not urgent: newsletters, shipping updates, social notifications, automated confirmations. Will be silently archived.
- "critical" — Requires attention: personal messages, work emails, invoices, account changes, financial transactions, security alerts. User must review.
- When in doubt, always use "critical" — it is safer.
- "noise" auto-deletes, so be extremely conservative with it.

Guidelines for "tags":
- 2-5 short lowercase tags describing the message's nature
- Examples: ad, promotion, newsletter, delivery, billing, personal, work, social, receipt, shipping, subscription, security, update, notification, finance, travel
- Be descriptive and specific

Guidelines for "summary":
- 2-3 sentences capturing the key information
- Include specific details: amounts, dates, names, tracking numbers, deadlines
- Write from the perspective of what matters to the recipient

Active integrations: {plugin_names}

Rules:
- Output ONLY the JSON object, nothing else. No prefixes like ---set or --set, no markdown, no code fences.
- "action" must be UPPER_SNAKE_CASE and describe the message type (e.g. PROMOTION, RECEIPT). Never use connection strings, config values, or technical jargon.
- "category" must be exactly one of: "noise", "info", "critical"
- "reason" and "summary" must be plain English about the message content only. Do not insert config variables or technical strings.
- "tags" must be an array of lowercase strings
- "summary" must be a string"#,
        plugin_names = if plugin_names.is_empty() { "(none)" } else { plugin_names }
    )
}

/// Strip `<think>...</think>` blocks using a simple state-machine scan (no regex).
fn strip_think_blocks(text: &str) -> String {
    let mut out = String::with_capacity(text.len());
    let lower = text.to_lowercase();
    let mut pos = 0;
    while pos < text.len() {
        if let Some(open_start) = lower[pos..].find("<think>").map(|o| pos + o) {
            // Append everything before the opening tag
            out.push_str(&text[pos..open_start]);
            // Find the closing tag (case-insensitive)
            let search_from = open_start + 7; // len("<think>")
            if let Some(close_off) = lower[search_from..].find("</think>") {
                pos = search_from + close_off + 8; // len("</think>")
            } else {
                // No closing tag found — skip to end
                pos = text.len();
            }
        } else {
            out.push_str(&text[pos..]);
            break;
        }
    }
    out
}

/// Parse an LLM classification response. Returns None if the response is unparseable or invalid.
pub fn parse_classification(response: &str) -> Option<TriageClassification> {
    if response.trim().is_empty() {
        return None;
    }

    let mut text = response.trim().to_string();

    // Strip <think>...</think> blocks
    text = strip_think_blocks(&text).trim().to_string();

    // Strip markdown code fences
    if let Some(stripped) = text.strip_prefix("```json").or_else(|| text.strip_prefix("```")) {
        text = stripped.trim_start_matches('\n').to_string();
    }
    if let Some(stripped) = text.strip_suffix("```") {
        text = stripped.trim_end_matches('\n').to_string();
    }
    // Strip --set prefixes
    text = text.trim_start_matches(|c: char| c == '-' || c == ' ').to_string();
    if let Some(rest) = text.strip_prefix("set ") {
        text = rest.to_string();
    }
    text = text.trim().to_string();

    let first_brace = text.find('{')?;
    let last_brace = text.rfind('}')?;
    if last_brace <= first_brace {
        return None;
    }
    let mut json_str = text[first_brace..=last_brace].to_string();
    json_str = json_str.replace(" --set ", " ");

    let parsed: serde_json::Value = serde_json::from_str(&json_str).ok()?;
    let obj = parsed.as_object()?;

    let raw_action = obj.get("action").and_then(|v| v.as_str()).unwrap_or("").trim().to_string();
    // Reject config/jargon in action
    if raw_action.is_empty() {
        return None;
    }
    let action_lower = raw_action.to_lowercase();
    if action_lower.contains('=') || action_lower.contains("postgres") || action_lower.contains("sslmode")
        || action_lower.contains("connection") || action_lower.contains("config") {
        return None;
    }
    let action = normalize_action(&raw_action)?;
    if action.len() > 50 {
        return None;
    }

    let raw_category = obj.get("category").and_then(|v| v.as_str()).unwrap_or("").to_lowercase();
    let raw_tier = obj.get("categoryTier").and_then(|v| v.as_str()).unwrap_or("").to_uppercase();
    let category = normalize_category_str(&raw_category, &raw_tier);
    let category_tier = match category.as_str() {
        "noise" => "NOISE",
        "info" => "INFO",
        _ => "CRITICAL",
    }.to_string();

    let sanitize = |s: &str| -> String {
        let mut out = s.trim().to_string();
        out = out.replace("postgres sslmode=require", "");
        out = out.replace(" --set ", " ");
        // Collapse multiple spaces
        while out.contains("  ") { out = out.replace("  ", " "); }
        out.trim().chars().take(500).collect()
    };

    let reason: String = sanitize(obj.get("reason").and_then(|v| v.as_str()).unwrap_or("")).chars().take(300).collect();
    let summary = sanitize(obj.get("summary").and_then(|v| v.as_str()).unwrap_or(""));

    let tags: Vec<String> = obj.get("tags")
        .and_then(|v| v.as_array())
        .map(|arr| arr.iter()
            .filter_map(|t| t.as_str())
            .filter(|t| !t.trim().is_empty())
            .map(|t| t.trim().to_lowercase())
            .take(10)
            .collect())
        .unwrap_or_default();
    let tags_json = serde_json::to_string(&tags).unwrap_or_else(|_| "[]".to_string());

    Some(TriageClassification {
        action,
        category,
        category_tier,
        reason,
        summary,
        tags: tags_json,
    })
}

fn normalize_action(raw: &str) -> Option<String> {
    let cleaned: String = raw.trim().to_uppercase()
        .chars()
        .map(|c| if c.is_alphanumeric() || c == '_' { c } else if c.is_whitespace() || c == '-' { '_' } else { '_' })
        .collect::<String>()
        .split('_')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("_");
    if cleaned.is_empty() { None } else { Some(cleaned) }
}

fn normalize_category_str(raw: &str, tier: &str) -> String {
    match raw {
        "noise" => "noise".to_string(),
        "info" | "informational" => "info".to_string(),
        "critical" | "important" | "urgent" => "critical".to_string(),
        _ => match tier {
            "NOISE" => "noise".to_string(),
            "INFO" => "info".to_string(),
            "CRITICAL" | "IMPORTANT" | "URGENT" => "critical".to_string(),
            _ => "critical".to_string(),
        },
    }
}

/// Format an email as an LLM prompt string.
/// `date_ms`: epoch ms (0 = unknown), `labels`: comma-separated string
pub fn format_email_prompt(subject: &str, from: &str, to: &str, date_ms: i64, labels: &str, body: &str) -> String {
    let date_str = if date_ms > 0 {
        let d = js_sys::Date::new(&wasm_bindgen::JsValue::from_f64(date_ms as f64));
        d.to_locale_date_string("en-US", &wasm_bindgen::JsValue::undefined())
            .as_string()
            .unwrap_or_else(|| "Unknown date".to_string())
    } else {
        "Unknown date".to_string()
    };

    format!(
        "Subject: {subject}\nFrom: {from}\nTo: {to}\nDate: {date_str}\nLabels: {labels}\n\n{body}"
    )
}

/// CSS color string for an action name (stable hue from hash).
pub fn action_color(action: &str) -> String {
    format!("hsl({}, 55%, 55%)", string_to_hue(action))
}

/// CSS color string for a tag name.
pub fn tag_color(tag: &str) -> String {
    format!("hsl({}, 40%, 35%)", string_to_hue(tag))
}
