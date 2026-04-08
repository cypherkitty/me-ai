/**
 * Markdown export — browser-only helpers.
 * HTML-to-Markdown conversion lives in Rust (formatting/markdown.rs).
 * Only downloadText (Blob API) stays in TS.
 */

import { getCore } from "./store/core-store.js";
import { formatDate, exportFilename } from "./email-utils.js";

export interface MessageForMarkdown {
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string | null;
  htmlBody?: string | null;
}

/**
 * Convert a parsed email message to Markdown format.
 * Delegates HTML conversion to Rust.
 */
export function emailToMarkdown(message: MessageForMarkdown): string {
  return getCore().emailToMarkdown(
    message.subject || "",
    message.from || "",
    message.to || "",
    formatDate(message.date),
    message.body || "",
    message.htmlBody || ""
  );
}

/**
 * Generate a safe filename from an email subject.
 */
export function emailFilename(message: { subject: string; date: string }): string {
  return exportFilename(message, "md");
}

/**
 * Trigger a browser download of the given text as a file.
 */
export function downloadText(
  content: string,
  filename: string,
  mimeType: string = "text/markdown;charset=utf-8"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
