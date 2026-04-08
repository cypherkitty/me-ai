//! HTML-to-Markdown conversion for email export.
//!
//! Ported from `me-ai-web/src/lib/markdown-export.ts`.
//! Uses the `scraper` crate instead of the browser DOMParser.

use scraper::{ElementRef, Html, Node};

// ── Public API ───────────────────────────────────────────────────────────────

/// Convert an email message to full Markdown with a metadata header table.
///
/// `date_str` should already be formatted for display (the TS side calls
/// `formatDate` with browser Intl before passing it here).
pub fn email_to_markdown(
    subject: &str,
    from: &str,
    to: &str,
    date_str: &str,
    body: Option<&str>,
    html_body: Option<&str>,
) -> String {
    let mut lines: Vec<String> = Vec::new();

    lines.push(format!("# {}", subject));
    lines.push(String::new());
    lines.push("| | |".to_string());
    lines.push("|---|---|".to_string());
    lines.push(format!("| **From** | {} |", escape_cell(from)));
    lines.push(format!("| **To** | {} |", escape_cell(to)));
    lines.push(format!("| **Date** | {} |", escape_cell(date_str)));
    lines.push(String::new());
    lines.push("---".to_string());
    lines.push(String::new());

    let body_md = html_body.and_then(|h| html_to_markdown_body(h));
    let content = body_md
        .as_deref()
        .or(body)
        .unwrap_or("*(no body)*");
    lines.push(content.to_string());
    lines.push(String::new());

    lines.join("\n")
}

/// Convert an HTML string to Markdown, stripping scripts/styles/head.
///
/// Returns `None` if parsing fails or the result is empty.
pub fn html_to_markdown_body(html: &str) -> Option<String> {
    let doc = Html::parse_document(html);
    let root = doc.root_element();
    let raw = node_to_markdown(root, false);
    let cleaned = collapse_blank_lines(&raw).trim().to_string();
    if cleaned.is_empty() {
        None
    } else {
        Some(cleaned)
    }
}

// ── Internal helpers ─────────────────────────────────────────────────────────

/// Escape pipe characters inside a Markdown table cell.
fn escape_cell(text: &str) -> String {
    text.replace('|', "\\|")
}

/// Collapse 3+ consecutive newlines to exactly 2.
fn collapse_blank_lines(s: &str) -> String {
    let mut result = String::with_capacity(s.len());
    let mut newline_count = 0u32;
    for ch in s.chars() {
        if ch == '\n' {
            newline_count += 1;
            if newline_count <= 2 {
                result.push(ch);
            }
        } else {
            newline_count = 0;
            result.push(ch);
        }
    }
    result
}

/// Check whether an `<img>` element is a tracking pixel, spacer, or beacon
/// that should be skipped in Markdown output.
fn is_skippable_image(el: &ElementRef, src: &str) -> bool {
    if src.is_empty() || src.starts_with("data:") {
        return true;
    }

    // Tiny images: width/height <= 3
    if let Some(w) = el.value().attr("width").and_then(|v| v.parse::<u32>().ok()) {
        if w > 0 && w <= 3 {
            return true;
        }
    }
    if let Some(h) = el.value().attr("height").and_then(|v| v.parse::<u32>().ok()) {
        if h > 0 && h <= 3 {
            return true;
        }
    }

    let lower = src.to_ascii_lowercase();

    // Spacer / transparent GIFs
    if lower.contains("spacer") || lower.contains("transparent") || lower.contains("transp.gif") {
        return true;
    }

    // Tracking pixel paths
    if lower.contains("/track") && lower.contains("pixel") {
        return true;
    }

    // Amazon redirect/tracking
    if lower.contains("amazon.com/gp/r.html?") {
        return true;
    }

    // Query-string tracking params: ?open=, &track=, &beacon=, &pixel=, &img=
    if has_tracking_param(&lower) {
        return true;
    }

    // Google Mail inline images are NOT skippable
    if lower.contains("mail.google.com/mail/u/") && lower.contains("view=fimg") {
        return false;
    }

    // CI tracking domains (ci123.example.com/) or 1x1 GIFs
    if is_ci_tracker(&lower) || (lower.ends_with(".gif") && lower.contains("1x1")) {
        return true;
    }

    false
}

/// Check for tracking query parameters: [?&](open|track|beacon|pixel|img)=
fn has_tracking_param(lower: &str) -> bool {
    for param in &["open=", "track=", "beacon=", "pixel=", "img="] {
        // Look for ?param or &param
        let q = format!("?{}", param);
        let a = format!("&{}", param);
        if lower.contains(&q) || lower.contains(&a) {
            return true;
        }
    }
    false
}

/// Check for CI-style tracker domains like ci123.example.com/
fn is_ci_tracker(lower: &str) -> bool {
    // Match pattern: "ci" followed by digits, then "." then word chars, then ".com/"
    // Simplified: look for "ci" + digit after "//" or start, followed by ".com/"
    let bytes = lower.as_bytes();
    let mut i = 0;
    while i + 2 < bytes.len() {
        if bytes[i] == b'c' && bytes[i + 1] == b'i' && bytes.get(i + 2).map_or(false, |b| b.is_ascii_digit()) {
            // Found "ci" + digit; check if ".com/" appears later
            if lower[i..].contains(".com/") {
                return true;
            }
        }
        i += 1;
    }
    false
}

/// Tags whose content we skip entirely.
fn is_stripped_tag(tag: &str) -> bool {
    matches!(tag, "style" | "script" | "head")
}

/// Recursively convert a node to Markdown.
///
/// `in_list` tracks whether we are inside a `<ul>` or `<ol>` to determine
/// list-item markers.
fn node_to_markdown(node: ElementRef, in_list: bool) -> String {
    let mut result = String::new();
    for child in node.children() {
        match child.value() {
            Node::Text(text) => {
                // Collapse whitespace runs to a single space (matches TS behaviour)
                let collapsed = collapse_whitespace(&text.text);
                result.push_str(&collapsed);
            }
            Node::Element(_) => {
                if let Some(el_ref) = ElementRef::wrap(child) {
                    let tag = el_ref.value().name();

                    if is_stripped_tag(tag) {
                        continue;
                    }

                    let md = convert_element(el_ref, in_list);
                    result.push_str(&md);
                }
            }
            _ => {}
        }
    }
    result
}

/// Collapse runs of spaces/tabs to a single space.
fn collapse_whitespace(s: &str) -> String {
    let mut result = String::with_capacity(s.len());
    let mut in_ws = false;
    for ch in s.chars() {
        if ch == ' ' || ch == '\t' {
            if !in_ws {
                result.push(' ');
                in_ws = true;
            }
        } else {
            in_ws = false;
            result.push(ch);
        }
    }
    result
}

/// Convert a single HTML element to its Markdown representation.
fn convert_element(el: ElementRef, in_list: bool) -> String {
    let tag = el.value().name();

    // Self-closing / void tags
    if tag == "br" {
        return "\n".to_string();
    }
    if tag == "hr" {
        return "\n\n---\n\n".to_string();
    }

    // Images
    if tag == "img" {
        let src = el.value().attr("src").unwrap_or("");
        let alt = el.value().attr("alt").unwrap_or("");
        if is_skippable_image(&el, src) {
            return String::new();
        }
        return format!("![{}]({})", alt, src);
    }

    // Recurse into children
    let inner = node_to_markdown(el, in_list || tag == "ul" || tag == "ol");
    let trimmed = inner.trim();

    // Empty content: pass through (matches TS: `if (!trimmed && ...) return inner;`)
    if trimmed.is_empty() && !matches!(tag, "img" | "br" | "hr") {
        return inner;
    }

    match tag {
        "p" | "div" => format!("\n\n{}\n\n", trimmed),
        "section" | "article" | "span" => inner,
        "blockquote" => {
            let quoted = trimmed.replace('\n', "\n> ");
            format!("\n\n> {}\n\n", quoted)
        }
        "h1" => format!("\n\n# {}\n\n", trimmed),
        "h2" => format!("\n\n## {}\n\n", trimmed),
        "h3" => format!("\n\n### {}\n\n", trimmed),
        "h4" => format!("\n\n#### {}\n\n", trimmed),
        "h5" => format!("\n\n##### {}\n\n", trimmed),
        "h6" => format!("\n\n###### {}\n\n", trimmed),
        "ul" | "ol" => format!("\n\n{}\n\n", inner),
        "li" => {
            // Determine marker: if parent is <ol>, use "1." else "-"
            let marker = if in_list_ordered(el) { "1." } else { "-" };
            format!("{} {}\n", marker, trimmed)
        }
        "a" => {
            let href = el.value().attr("href").unwrap_or("");
            if href.is_empty() || href.starts_with("mailto:") {
                return trimmed.to_string();
            }
            if trimmed == href {
                return href.to_string();
            }
            format!("[{}]({})", trimmed, href)
        }
        "strong" | "b" => format!("**{}**", trimmed),
        "em" | "i" => format!("*{}*", trimmed),
        "code" => format!("`{}`", trimmed),
        "pre" => format!("\n\n```\n{}\n```\n\n", trimmed),
        "table" => format!("\n\n{}\n\n", inner),
        "tr" => {
            let cells: Vec<String> = el.children()
                .filter_map(ElementRef::wrap)
                .map(|td| node_to_markdown(td, false).trim().to_string())
                .collect();
            format!("| {} |\n", cells.join(" | "))
        }
        "td" | "th" => inner,
        "thead" => {
            let header_row = inner.trim().to_string();
            let col_count = header_row.matches('|').count().saturating_sub(1);
            let sep_count = col_count.max(1);
            let sep = format!("| {} |", vec!["---"; sep_count].join(" | "));
            format!("{}{}\n", header_row, sep)
        }
        "tbody" | "tfoot" => inner,
        _ => inner,
    }
}

/// Check if the parent element of an `<li>` is an `<ol>`.
fn in_list_ordered(el: ElementRef) -> bool {
    el.parent()
        .and_then(ElementRef::wrap)
        .map(|p| p.value().name() == "ol")
        .unwrap_or(false)
}

// ── Tests ────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    // ── html_to_markdown_body ────────────────────────────────────────

    #[test]
    fn plain_text_paragraph() {
        let md = html_to_markdown_body("<p>Hello world</p>").unwrap();
        assert_eq!(md, "Hello world");
    }

    #[test]
    fn bold_and_italic() {
        let md = html_to_markdown_body("<p><strong>bold</strong> and <em>italic</em></p>").unwrap();
        assert_eq!(md, "**bold** and *italic*");
    }

    #[test]
    fn headings() {
        let md = html_to_markdown_body("<h1>Title</h1><h2>Sub</h2>").unwrap();
        assert!(md.contains("# Title"));
        assert!(md.contains("## Sub"));
    }

    #[test]
    fn link_with_text() {
        let md = html_to_markdown_body(r#"<a href="https://example.com">Click</a>"#).unwrap();
        assert_eq!(md, "[Click](https://example.com)");
    }

    #[test]
    fn link_text_equals_href() {
        let md =
            html_to_markdown_body(r#"<a href="https://example.com">https://example.com</a>"#)
                .unwrap();
        assert_eq!(md, "https://example.com");
    }

    #[test]
    fn mailto_link_returns_text() {
        let md =
            html_to_markdown_body(r#"<a href="mailto:a@b.com">a@b.com</a>"#).unwrap();
        assert_eq!(md, "a@b.com");
    }

    #[test]
    fn image_preserved() {
        let md =
            html_to_markdown_body(r#"<img src="https://example.com/photo.jpg" alt="Photo">"#)
                .unwrap();
        assert_eq!(md, "![Photo](https://example.com/photo.jpg)");
    }

    #[test]
    fn tracking_pixel_skipped() {
        let md = html_to_markdown_body(
            r#"<img src="https://tracker.com/pixel.gif" width="1" height="1" alt="">"#,
        );
        assert!(md.is_none() || md.unwrap().is_empty());
    }

    #[test]
    fn data_uri_image_skipped() {
        let md = html_to_markdown_body(r#"<img src="data:image/gif;base64,R0lGODlhAQ==">"#);
        assert!(md.is_none() || md.unwrap().is_empty());
    }

    #[test]
    fn unordered_list() {
        let md = html_to_markdown_body("<ul><li>A</li><li>B</li></ul>").unwrap();
        assert!(md.contains("- A"));
        assert!(md.contains("- B"));
    }

    #[test]
    fn ordered_list() {
        let md = html_to_markdown_body("<ol><li>First</li><li>Second</li></ol>").unwrap();
        assert!(md.contains("1. First"));
        assert!(md.contains("1. Second"));
    }

    #[test]
    fn blockquote() {
        let md = html_to_markdown_body("<blockquote>Quoted text</blockquote>").unwrap();
        assert!(md.contains("> Quoted text"));
    }

    #[test]
    fn code_inline() {
        let md = html_to_markdown_body("<code>let x = 1;</code>").unwrap();
        assert_eq!(md, "`let x = 1;`");
    }

    #[test]
    fn pre_block() {
        let md = html_to_markdown_body("<pre>fn main() {}</pre>").unwrap();
        assert!(md.contains("```\nfn main() {}\n```"));
    }

    #[test]
    fn br_becomes_newline() {
        let md = html_to_markdown_body("<p>line1<br>line2</p>").unwrap();
        assert!(md.contains("line1\nline2"));
    }

    #[test]
    fn hr_becomes_separator() {
        let md = html_to_markdown_body("<p>above</p><hr><p>below</p>").unwrap();
        assert!(md.contains("---"));
    }

    #[test]
    fn style_and_script_stripped() {
        let md = html_to_markdown_body(
            "<style>.x{color:red}</style><script>alert(1)</script><p>OK</p>",
        )
        .unwrap();
        assert_eq!(md, "OK");
    }

    #[test]
    fn table_conversion() {
        let html = "<table><thead><tr><th>A</th><th>B</th></tr></thead>\
                     <tbody><tr><td>1</td><td>2</td></tr></tbody></table>";
        let md = html_to_markdown_body(html).unwrap();
        assert!(md.contains("| A | B |"));
        assert!(md.contains("| --- | --- |"));
        assert!(md.contains("| 1 | 2 |"));
    }

    #[test]
    fn empty_html_returns_none() {
        assert!(html_to_markdown_body("").is_none());
    }

    #[test]
    fn whitespace_only_returns_none() {
        assert!(html_to_markdown_body("   \n  ").is_none());
    }

    // ── is_skippable_image ──────────────────────────────────────────

    #[test]
    fn skips_spacer_gif() {
        let doc = Html::parse_fragment(r#"<img src="https://x.com/spacer.gif">"#);
        let el = doc.root_element().children().filter_map(ElementRef::wrap).next().unwrap();
        assert!(is_skippable_image(&el, "https://x.com/spacer.gif"));
    }

    #[test]
    fn skips_amazon_tracker() {
        let doc = Html::parse_fragment(r#"<img src="https://amazon.com/gp/r.html?foo=bar">"#);
        let el = doc.root_element().children().filter_map(ElementRef::wrap).next().unwrap();
        assert!(is_skippable_image(&el, "https://amazon.com/gp/r.html?foo=bar"));
    }

    #[test]
    fn skips_tracking_param() {
        let doc = Html::parse_fragment(r#"<img src="https://x.com/img?beacon=1">"#);
        let el = doc.root_element().children().filter_map(ElementRef::wrap).next().unwrap();
        assert!(is_skippable_image(&el, "https://x.com/img?beacon=1"));
    }

    #[test]
    fn allows_google_mail_inline() {
        let src = "https://mail.google.com/mail/u/0?view=fimg&id=abc";
        let doc = Html::parse_fragment(&format!(r#"<img src="{}">"#, src));
        let el = doc.root_element().children().filter_map(ElementRef::wrap).next().unwrap();
        assert!(!is_skippable_image(&el, src));
    }

    #[test]
    fn allows_normal_image() {
        let src = "https://example.com/photo.jpg";
        let doc = Html::parse_fragment(&format!(r#"<img src="{}">"#, src));
        let el = doc.root_element().children().filter_map(ElementRef::wrap).next().unwrap();
        assert!(!is_skippable_image(&el, src));
    }

    // ── email_to_markdown ───────────────────────────────────────────

    #[test]
    fn email_to_markdown_with_html_body() {
        let md = email_to_markdown(
            "Test Subject",
            "alice@example.com",
            "bob@example.com",
            "Apr 7, 2026",
            Some("plain fallback"),
            Some("<p>Hello <strong>World</strong></p>"),
        );
        assert!(md.contains("# Test Subject"));
        assert!(md.contains("| **From** | alice@example.com |"));
        assert!(md.contains("| **To** | bob@example.com |"));
        assert!(md.contains("| **Date** | Apr 7, 2026 |"));
        assert!(md.contains("Hello **World**"));
        // Plain body should NOT appear when HTML body is present
        assert!(!md.contains("plain fallback"));
    }

    #[test]
    fn email_to_markdown_plain_body_fallback() {
        let md = email_to_markdown(
            "Subject",
            "from@x.com",
            "to@x.com",
            "Jan 1, 2025",
            Some("Plain text body"),
            None,
        );
        assert!(md.contains("Plain text body"));
    }

    #[test]
    fn email_to_markdown_no_body() {
        let md = email_to_markdown(
            "Subject",
            "from@x.com",
            "to@x.com",
            "Jan 1, 2025",
            None,
            None,
        );
        assert!(md.contains("*(no body)*"));
    }

    #[test]
    fn email_to_markdown_escapes_pipe_in_fields() {
        let md = email_to_markdown(
            "Subject",
            "first|last@x.com",
            "to@x.com",
            "Jan 1, 2025",
            Some("body"),
            None,
        );
        assert!(md.contains("first\\|last@x.com"));
    }

    // ── collapse_blank_lines ────────────────────────────────────────

    #[test]
    fn collapse_trims_excessive_newlines() {
        assert_eq!(collapse_blank_lines("a\n\n\n\nb"), "a\n\nb");
    }

    #[test]
    fn collapse_preserves_double_newline() {
        assert_eq!(collapse_blank_lines("a\n\nb"), "a\n\nb");
    }

    // ── has_tracking_param ──────────────────────────────────────────

    #[test]
    fn detects_query_tracking_param() {
        assert!(has_tracking_param("https://x.com/img?open=1"));
        assert!(has_tracking_param("https://x.com/img?foo=bar&track=1"));
        assert!(!has_tracking_param("https://x.com/photo.jpg"));
    }

    // ── is_ci_tracker ───────────────────────────────────────────────

    #[test]
    fn detects_ci_tracker_domain() {
        assert!(is_ci_tracker("https://ci123.example.com/img.gif"));
        assert!(!is_ci_tracker("https://example.com/img.gif"));
    }
}
