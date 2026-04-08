//! Email classification logic: system prompt building, LLM response parsing,
//! email prompt formatting. Pure functions — no DB access.

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::formatting::string_to_hue;

#[wasm_bindgen(typescript_custom_section)]
const TRIAGE_TYPES: &'static str = r#"
export interface ClassificationResult {
    action: string;
    category: "noise" | "info" | "critical";
    categoryTier: "NOISE" | "INFO" | "CRITICAL";
    suggestedActions: string[];
    reason: string;
    summary: string;
    tags: string[];
}

export interface ScanProgress {
    phase: string;
    message?: string;
    current?: number;
    total?: number;
    classified?: number;
    errors?: number;
    results?: unknown[];
    email?: { subject?: string; from?: string; date?: string };
    prompt?: { system?: string; user?: string };
    systemPromptLength?: number;
    live?: { tps?: number | null; numTokens?: number } | null;
    lastResult?: unknown;
    totals?: { outputTokens?: number; inputTokens?: number; elapsed?: number };
    streamingText?: string;
    result?: ClassificationResult;
    rawResponse?: string;
    emailStats?: { tps: number | null; numTokens: number; inputTokens: number; elapsed: number };
    summary?: {
        avgPromptSize?: number;
        avgTps?: number | null;
        systemPromptSize?: number;
        processed?: number;
        skipped?: number;
        modelName?: string;
        modelContextWindow?: number;
        modelMaxEmailTokens?: number;
    };
}

export interface ScanResult {
    scanned: number;
    classified: number;
    skipped: number;
    errors: number;
}

export interface ScanOptions {
    count?: number;
    force?: boolean;
    onProgress?: (p: ScanProgress) => void;
    signal?: AbortSignal;
}

export interface ClassificationRow {
    emailId: string;
    action: string;
    category: string;
    reason: string;
    summary: string;
    tags: string[];
    subject: string;
    from: string;
    date: number | null;
    scannedAt: number | null;
    status?: string;
    [key: string]: unknown;
}

export interface GetClassificationsByCategoryOptions {
    pendingOnly?: boolean;
}
"#;

#[wasm_bindgen(typescript_custom_section)]
const TRIAGE_ENGINE_TYPES: &'static str = r#"
export interface TriageEngine {
    readonly isReady: boolean;
    readonly modelId: string | null;
    generateFull(
        messages: Array<{ role: string; content: string }>,
        options: { maxTokens?: number; enableThinking?: boolean; temperature?: number },
        onToken?: (info: { tps: number | null; numTokens: number; text: string }) => void
    ): Promise<{ text: string; tps: number | null; numTokens: number; inputTokens: number }>;
}

export interface PluginForPrompt {
    pluginId: string;
    pluginName: string;
    actions: Array<{ actionId: string }>;
}
"#;

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TriageClassification {
    pub action: String,
    pub category: String, // "noise" | "info" | "critical"
    #[wasm_bindgen(js_name = "categoryTier")]
    pub category_tier: String, // "NOISE" | "INFO" | "CRITICAL"
    pub reason: String,
    pub summary: String,
    pub tags: String, // JSON-encoded string array e.g. `["tag1","tag2"]`
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
        plugin_names = if plugin_names.is_empty() {
            "(none)"
        } else {
            plugin_names
        }
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
    if let Some(stripped) = text
        .strip_prefix("```json")
        .or_else(|| text.strip_prefix("```"))
    {
        text = stripped.trim_start_matches('\n').to_string();
    }
    if let Some(stripped) = text.strip_suffix("```") {
        text = stripped.trim_end_matches('\n').to_string();
    }
    // Strip --set prefixes
    text = text.trim_start_matches(['-', ' ']).to_string();
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

    let raw_action = obj
        .get("action")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .trim()
        .to_string();
    // Reject config/jargon in action
    if raw_action.is_empty() {
        return None;
    }
    let action_lower = raw_action.to_lowercase();
    if action_lower.contains('=')
        || action_lower.contains("postgres")
        || action_lower.contains("sslmode")
        || action_lower.contains("connection")
        || action_lower.contains("config")
    {
        return None;
    }
    let action = normalize_action(&raw_action)?;
    if action.len() > 50 {
        return None;
    }

    let raw_category = obj
        .get("category")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_lowercase();
    let raw_tier = obj
        .get("categoryTier")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_uppercase();
    let category = normalize_category_str(&raw_category, &raw_tier);
    let category_tier = match category.as_str() {
        "noise" => "NOISE",
        "info" => "INFO",
        _ => "CRITICAL",
    }
    .to_string();

    let sanitize = |s: &str| -> String {
        let mut out = s.trim().to_string();
        out = out.replace("postgres sslmode=require", "");
        out = out.replace(" --set ", " ");
        // Collapse multiple spaces
        while out.contains("  ") {
            out = out.replace("  ", " ");
        }
        out.trim().chars().take(500).collect()
    };

    let reason: String = sanitize(obj.get("reason").and_then(|v| v.as_str()).unwrap_or(""))
        .chars()
        .take(300)
        .collect();
    let summary = sanitize(obj.get("summary").and_then(|v| v.as_str()).unwrap_or(""));

    let tags: Vec<String> = obj
        .get("tags")
        .and_then(|v| v.as_array())
        .map(|arr| {
            arr.iter()
                .filter_map(|t| t.as_str())
                .filter(|t| !t.trim().is_empty())
                .map(|t| t.trim().to_lowercase())
                .take(10)
                .collect()
        })
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
    let cleaned: String = raw
        .trim()
        .to_uppercase()
        .chars()
        .map(|c| {
            if c.is_alphanumeric() || c == '_' {
                c
            } else {
                '_'
            }
        })
        .collect::<String>()
        .split('_')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("_");
    if cleaned.is_empty() {
        None
    } else {
        Some(cleaned)
    }
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
pub fn format_email_prompt(
    subject: &str,
    from: &str,
    to: &str,
    date_ms: i64,
    labels: &str,
    body: &str,
) -> String {
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

/// Convert a category tier (e.g. "NOISE") to its lowercase category name (e.g. "noise").
/// Defaults to "critical" for unknown tiers.
pub fn category_tier_to_name(tier: &str) -> String {
    match tier.to_uppercase().as_str() {
        "NOISE" => "noise",
        "INFO" => "info",
        "CRITICAL" => "critical",
        _ => "critical",
    }
    .to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    // ── category_tier_to_name ─────────────────────────────────────────

    #[test]
    fn tier_noise() {
        assert_eq!(category_tier_to_name("NOISE"), "noise");
    }

    #[test]
    fn tier_noise_lowercase_input() {
        assert_eq!(category_tier_to_name("noise"), "noise");
    }

    #[test]
    fn tier_info() {
        assert_eq!(category_tier_to_name("INFO"), "info");
    }

    #[test]
    fn tier_critical() {
        assert_eq!(category_tier_to_name("CRITICAL"), "critical");
    }

    #[test]
    fn tier_unknown_defaults_to_critical() {
        assert_eq!(category_tier_to_name("UNKNOWN"), "critical");
        assert_eq!(category_tier_to_name(""), "critical");
    }

    // ── action_color / tag_color ──────────────────────────────────────

    #[test]
    fn action_color_is_hsl_string() {
        let c = action_color("PROMOTION");
        assert!(c.starts_with("hsl("), "expected hsl(...), got: {c}");
        assert!(c.contains("55%"), "expected 55% saturation in: {c}");
    }

    #[test]
    fn tag_color_is_hsl_string() {
        let c = tag_color("finance");
        assert!(c.starts_with("hsl("), "expected hsl(...), got: {c}");
        assert!(c.contains("40%"), "expected 40% saturation in: {c}");
    }

    #[test]
    fn action_color_stable_across_calls() {
        assert_eq!(action_color("RECEIPT"), action_color("RECEIPT"));
    }

    // ── build_system_prompt ───────────────────────────────────────────

    #[test]
    fn system_prompt_contains_plugin_names() {
        let p = build_system_prompt("Gmail, Twitter");
        assert!(p.contains("Gmail, Twitter"), "plugin names not found in prompt");
    }

    #[test]
    fn system_prompt_empty_plugins_uses_none_sentinel() {
        let p = build_system_prompt("");
        assert!(p.contains("(none)"), "empty plugin list should show '(none)'");
    }

    #[test]
    fn system_prompt_contains_required_keys() {
        let p = build_system_prompt("Gmail");
        assert!(p.contains("\"action\""), "prompt must include action field");
        assert!(p.contains("\"category\""), "prompt must include category field");
        assert!(p.contains("\"tags\""), "prompt must include tags field");
        assert!(p.contains("UPPER_SNAKE_CASE"), "prompt must describe action format");
    }

    // ── strip_think_blocks (via parse_classification) ─────────────────

    #[test]
    fn parse_strips_think_blocks_before_json() {
        let response = r#"<think>Let me reason...</think>
{"action": "RECEIPT", "category": "info", "reason": "Order confirmation", "summary": "Your order was received.", "tags": ["receipt"]}"#;
        let c = parse_classification(response).expect("should parse");
        assert_eq!(c.action, "RECEIPT");
        assert_eq!(c.category, "info");
    }

    #[test]
    fn parse_strips_think_blocks_case_insensitive() {
        let response = r#"<THINK>reasoning here</THINK>{"action":"NEWSLETTER","category":"noise","reason":"Mass mail","summary":"Weekly digest.","tags":["newsletter"]}"#;
        let c = parse_classification(response).expect("should parse");
        assert_eq!(c.action, "NEWSLETTER");
    }

    #[test]
    fn parse_strips_think_block_without_closing_tag() {
        // No closing </think> — everything from <think> onward is discarded
        let response = r#"<think>no closing tag here"#;
        assert!(parse_classification(response).is_none());
    }

    // ── parse_classification — valid inputs ───────────────────────────

    #[test]
    fn parse_valid_json_all_fields() {
        let response = r#"{"action":"SHIPPING_UPDATE","category":"info","reason":"Package shipped.","summary":"Your order is on its way.","tags":["shipping","delivery"]}"#;
        let c = parse_classification(response).expect("should parse");
        assert_eq!(c.action, "SHIPPING_UPDATE");
        assert_eq!(c.category, "info");
        assert_eq!(c.category_tier, "INFO");
        assert!(c.reason.contains("shipped"));
        assert!(c.tags.contains("shipping"));
    }

    #[test]
    fn parse_strips_markdown_json_fence() {
        let response = "```json\n{\"action\":\"PROMOTION\",\"category\":\"noise\",\"reason\":\"Ad\",\"summary\":\"Sale ad.\",\"tags\":[\"ad\"]}\n```";
        let c = parse_classification(response).expect("should parse");
        assert_eq!(c.action, "PROMOTION");
        assert_eq!(c.category, "noise");
        assert_eq!(c.category_tier, "NOISE");
    }

    #[test]
    fn parse_strips_bare_code_fence() {
        let response = "```\n{\"action\":\"BILLING_REMINDER\",\"category\":\"critical\",\"reason\":\"Invoice due\",\"summary\":\"Payment due.\",\"tags\":[\"billing\"]}\n```";
        let c = parse_classification(response).expect("should parse");
        assert_eq!(c.action, "BILLING_REMINDER");
        assert_eq!(c.category, "critical");
        assert_eq!(c.category_tier, "CRITICAL");
    }

    #[test]
    fn parse_action_normalized_to_upper_snake_case() {
        let response = r#"{"action":"shipping update","category":"info","reason":"r","summary":"s","tags":[]}"#;
        let c = parse_classification(response).expect("should parse");
        assert_eq!(c.action, "SHIPPING_UPDATE");
    }

    #[test]
    fn parse_action_with_hyphens_becomes_underscores() {
        let response = r#"{"action":"SOCIAL-MENTION","category":"info","reason":"r","summary":"s","tags":[]}"#;
        let c = parse_classification(response).expect("should parse");
        assert_eq!(c.action, "SOCIAL_MENTION");
    }

    #[test]
    fn parse_category_informational_maps_to_info() {
        let response = r#"{"action":"UPDATE","category":"informational","reason":"r","summary":"s","tags":[]}"#;
        let c = parse_classification(response).expect("should parse");
        assert_eq!(c.category, "info");
        assert_eq!(c.category_tier, "INFO");
    }

    #[test]
    fn parse_category_important_maps_to_critical() {
        let response = r#"{"action":"ALERT","category":"important","reason":"r","summary":"s","tags":[]}"#;
        let c = parse_classification(response).expect("should parse");
        assert_eq!(c.category, "critical");
        assert_eq!(c.category_tier, "CRITICAL");
    }

    #[test]
    fn parse_unknown_category_falls_back_to_critical() {
        let response = r#"{"action":"ALERT","category":"weird","reason":"r","summary":"s","tags":[]}"#;
        let c = parse_classification(response).expect("should parse");
        assert_eq!(c.category, "critical");
    }

    #[test]
    fn parse_tags_lowercased_and_limited_to_10() {
        let many_tags: Vec<String> = (0..15).map(|i| format!("\"TAG{i}\"")).collect();
        let response = format!(
            r#"{{"action":"UPDATE","category":"info","reason":"r","summary":"s","tags":[{}]}}"#,
            many_tags.join(",")
        );
        let c = parse_classification(&response).expect("should parse");
        let tags: Vec<String> = serde_json::from_str(&c.tags).unwrap();
        assert!(tags.len() <= 10, "tags should be capped at 10");
        // All tags are lowercase
        for tag in &tags {
            assert_eq!(*tag, tag.to_lowercase(), "tag '{tag}' should be lowercase");
        }
    }

    #[test]
    fn parse_json_with_surrounding_text() {
        let response = r#"Here is my classification:
{"action":"RECEIPT","category":"info","reason":"Order placed.","summary":"Your receipt.","tags":["receipt"]}
That's it."#;
        let c = parse_classification(response).expect("should parse");
        assert_eq!(c.action, "RECEIPT");
    }

    // ── parse_classification — invalid / rejected inputs ──────────────

    #[test]
    fn parse_empty_response_returns_none() {
        assert!(parse_classification("").is_none());
        assert!(parse_classification("   ").is_none());
    }

    #[test]
    fn parse_invalid_json_returns_none() {
        assert!(parse_classification("not json at all").is_none());
        assert!(parse_classification("{broken json}").is_none());
    }

    #[test]
    fn parse_missing_action_field_returns_none() {
        let response = r#"{"category":"info","reason":"r","summary":"s","tags":[]}"#;
        assert!(parse_classification(response).is_none());
    }

    #[test]
    fn parse_jargon_action_rejected() {
        let cases = [
            r#"{"action":"postgres sslmode=require","category":"info","reason":"r","summary":"s","tags":[]}"#,
            r#"{"action":"connection_string=value","category":"info","reason":"r","summary":"s","tags":[]}"#,
            r#"{"action":"sslmode=disable","category":"info","reason":"r","summary":"s","tags":[]}"#,
        ];
        for case in &cases {
            assert!(parse_classification(case).is_none(), "expected None for: {case}");
        }
    }

    #[test]
    fn parse_action_too_long_rejected() {
        let long_action = "A".repeat(51);
        let response = format!(
            r#"{{"action":"{long_action}","category":"info","reason":"r","summary":"s","tags":[]}}"#
        );
        assert!(parse_classification(&response).is_none());
    }

    #[test]
    fn parse_action_exactly_50_chars_accepted() {
        let action = "A".repeat(50);
        let response = format!(
            r#"{{"action":"{action}","category":"info","reason":"r","summary":"s","tags":[]}}"#
        );
        let c = parse_classification(&response).expect("50-char action should be accepted");
        assert_eq!(c.action.len(), 50);
    }

    #[test]
    fn parse_reason_truncated_to_300_chars() {
        let long_reason = "x".repeat(500);
        let response = format!(
            r#"{{"action":"UPDATE","category":"info","reason":"{long_reason}","summary":"s","tags":[]}}"#
        );
        let c = parse_classification(&response).expect("should parse");
        assert!(c.reason.len() <= 300, "reason should be truncated to 300 chars");
    }
}
