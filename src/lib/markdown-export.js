import { formatDate } from "./email-utils.js";

/**
 * Convert a parsed email message to Markdown format.
 * If the message has htmlBody, images and links are preserved as markdown syntax.
 *
 * @param {{ subject: string, from: string, to: string, date: string, body: string | null, htmlBody?: string | null }} message
 * @returns {string} Markdown-formatted email
 */
export function emailToMarkdown(message) {
  const lines = [];

  lines.push(`# ${message.subject}`);
  lines.push("");
  lines.push(`| | |`);
  lines.push(`|---|---|`);
  lines.push(`| **From** | ${escapeCell(message.from)} |`);
  lines.push(`| **To** | ${escapeCell(message.to)} |`);
  lines.push(`| **Date** | ${formatDate(message.date)} |`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // Use HTML body (with images/links) when available, fall back to plain text
  const bodyMd = message.htmlBody
    ? htmlToMarkdownBody(message.htmlBody)
    : null;

  lines.push(bodyMd || message.body || "*(no body)*");
  lines.push("");

  return lines.join("\n");
}

/** Escape pipe characters inside a Markdown table cell */
function escapeCell(text) {
  return (text || "").replace(/\|/g, "\\|");
}

/**
 * Convert HTML to Markdown, preserving images, links, bold, and structure.
 * Uses DOMParser for accurate conversion.
 */
function htmlToMarkdownBody(html) {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");

    // Remove style and script elements
    for (const el of doc.querySelectorAll("style, script, head")) el.remove();

    return nodeToMarkdown(doc.body).replace(/\n{3,}/g, "\n\n").trim();
  } catch {
    // Fallback if DOMParser unavailable
    return null;
  }
}

/**
 * Recursively convert a DOM node tree to Markdown text.
 */
function nodeToMarkdown(node) {
  if (node.nodeType === 3) {
    // Text node — collapse whitespace
    return node.textContent.replace(/[ \t]+/g, " ");
  }

  if (node.nodeType !== 1) return "";

  const tag = node.tagName.toLowerCase();

  // Self-closing / leaf elements
  if (tag === "br") return "\n";
  if (tag === "hr") return "\n\n---\n\n";

  if (tag === "img") {
    const src = node.getAttribute("src") || "";
    const alt = node.getAttribute("alt") || "";
    if (!src || src.startsWith("data:")) return ""; // skip inline data URIs / tracking pixels
    return `![${alt}](${src})`;
  }

  // Recurse into children
  const inner = Array.from(node.childNodes).map(nodeToMarkdown).join("");
  const trimmed = inner.trim();

  if (!trimmed && !["img", "br", "hr"].includes(tag)) return inner;

  // Block elements
  if (tag === "p" || tag === "div") return `\n\n${trimmed}\n\n`;
  if (tag === "blockquote") return `\n\n> ${trimmed.replace(/\n/g, "\n> ")}\n\n`;
  if (/^h[1-6]$/.test(tag)) {
    const level = Number(tag[1]);
    return `\n\n${"#".repeat(level)} ${trimmed}\n\n`;
  }
  if (tag === "ul" || tag === "ol") return `\n\n${inner}\n\n`;
  if (tag === "li") {
    const marker = node.parentElement?.tagName.toLowerCase() === "ol" ? "1." : "-";
    return `${marker} ${trimmed}\n`;
  }

  // Inline elements
  if (tag === "a") {
    const href = node.getAttribute("href") || "";
    if (!href || href.startsWith("mailto:")) return trimmed;
    if (trimmed === href) return href; // don't double-wrap bare URLs
    return `[${trimmed}](${href})`;
  }
  if (tag === "strong" || tag === "b") return `**${trimmed}**`;
  if (tag === "em" || tag === "i") return `*${trimmed}*`;
  if (tag === "code") return `\`${trimmed}\``;

  // Table support
  if (tag === "table") return `\n\n${inner}\n\n`;
  if (tag === "tr") {
    const cells = Array.from(node.children)
      .map(td => nodeToMarkdown(td).trim())
      .join(" | ");
    return `| ${cells} |\n`;
  }
  if (tag === "td" || tag === "th") return inner;
  if (tag === "thead") {
    const headerRow = inner.trim();
    const colCount = (headerRow.match(/\|/g) || []).length - 1;
    const sep = "| " + Array(Math.max(colCount, 1)).fill("---").join(" | ") + " |";
    return `${headerRow}${sep}\n`;
  }
  if (tag === "tbody" || tag === "tfoot") return inner;

  // Everything else: just return children
  return inner;
}

/**
 * Generate a safe filename from an email subject.
 * Strips characters that are invalid in filenames.
 *
 * @param {{ subject: string, date: string }} message
 * @returns {string} filename ending in .md
 */
export function emailFilename(message) {
  const datePrefix = shortDate(message.date);
  const slug = (message.subject || "email")
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60)
    .replace(/-+$/, "");

  return `${datePrefix}_${slug}.md`;
}

function shortDate(dateStr) {
  try {
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return "email";
  }
}

/**
 * Trigger a browser download of the given text as a file.
 *
 * @param {string} content  File contents
 * @param {string} filename Suggested filename
 */
export function downloadText(content, filename) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
