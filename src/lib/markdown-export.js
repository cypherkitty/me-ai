import { formatDate } from "./email-utils.js";

/**
 * Convert a parsed email message to Markdown format.
 *
 * @param {{ subject: string, from: string, to: string, date: string, body: string | null }} message
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
  lines.push(message.body || "*(no body)*");
  lines.push("");

  return lines.join("\n");
}

/** Escape pipe characters inside a Markdown table cell */
function escapeCell(text) {
  return (text || "").replace(/\|/g, "\\|");
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
