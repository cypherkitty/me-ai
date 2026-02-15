import { formatDate } from "./email-utils.js";

/**
 * Convert a stored email message to a clean JSON-exportable object.
 *
 * This is the canonical intermediate format for all messages.
 * Pipeline: source (Gmail, etc.) → JSON → markdown / HTML / web page.
 *
 * Internal/sync fields (raw, syncedAt, sourceType, sourceId) are stripped.
 * The date is included both as a Unix timestamp and a human-readable string.
 *
 * @param {object} message - Stored message from IndexedDB
 * @returns {object} Clean JSON-exportable object
 */
export function emailToJson(message) {
  return {
    id: message.id,
    type: message.type || "email",
    threadKey: message.threadKey || null,
    subject: message.subject || "(no subject)",
    from: message.from || null,
    to: message.to || null,
    cc: message.cc || null,
    date: message.date || null,
    dateFormatted: message.date ? formatDate(message.date) : null,
    labels: message.labels || [],
    snippet: message.snippet || "",
    body: message.body || null,
    htmlBody: message.htmlBody || null,
    messageId: message.messageId || null,
    inReplyTo: message.inReplyTo || null,
    references: message.references || null,
  };
}

/**
 * Serialize an email message to a pretty-printed JSON string.
 *
 * @param {object} message - Stored message from IndexedDB
 * @returns {string} Pretty-printed JSON
 */
export function emailToJsonString(message) {
  return JSON.stringify(emailToJson(message), null, 2);
}

/**
 * Generate a safe filename for JSON export.
 *
 * @param {object} message - { subject, date }
 * @returns {string} filename ending in .json
 */
export function emailJsonFilename(message) {
  const datePrefix = shortDate(message.date);
  const slug = (message.subject || "email")
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60)
    .replace(/-+$/, "");

  return `${datePrefix}_${slug}.json`;
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
