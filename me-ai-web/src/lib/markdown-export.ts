/**
 * Markdown export — browser-only helpers.
 * HTML-to-Markdown conversion lives in Rust (formatting/markdown.rs).
 * Only downloadText (Blob API) stays in TS.
 */

import { getCore } from "./store/core-store.js";

export interface MessageForMarkdown {
  subject: string;
  from: string;
  to: string;
  /** Passed through to core (`string | number | bigint` at the WASM boundary). */
  date: string | number | bigint;
  body: string | null;
  htmlBody?: string | null;
}

/**
 * Convert a parsed email message to Markdown format.
 * Delegates HTML conversion to Rust.
 */
export function emailToMarkdown(message: MessageForMarkdown): string {
  const dateMs = getCore().emailDateToEpochMs(message.date);
  const bodyRaw = message.body;
  const body = bodyRaw != null && bodyRaw.trim().length > 0 ? bodyRaw : undefined;
  const htmlRaw = message.htmlBody;
  const htmlBody = htmlRaw != null && htmlRaw.trim().length > 0 ? htmlRaw : undefined;
  return getCore().emailToMarkdown(
    message.subject || "",
    message.from || "",
    message.to || "",
    dateMs,
    body,
    htmlBody
  );
}

/**
 * Generate a safe filename from an email subject.
 */
export function emailFilename(message: {
  subject: string;
  date: string | number | bigint;
}): string {
  return getCore().exportEmailFilename(message.subject, message.date, "md");
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
