import { exportFilename } from "./email-utils.js";

/** Message-like shape for export (subject, date, raw). */
interface MessageLike {
  subject?: string;
  date?: number | string | null;
  raw?: unknown;
}

/**
 * Extract the raw Gmail API JSON from a stored message.
 */
export function emailToJson(message: MessageLike): unknown {
  return message.raw ?? null;
}

/**
 * Serialize the raw Gmail API JSON to a pretty-printed string.
 */
export function emailToJsonString(message: MessageLike): string {
  const raw = emailToJson(message);
  if (!raw) return "null";
  return JSON.stringify(raw, null, 2);
}

/**
 * Generate a safe filename for JSON export.
 */
export function emailJsonFilename(message: { subject?: string; date?: number | string | null }): string {
  return exportFilename(message, "json");
}
