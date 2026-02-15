/**
 * Extract the raw Gmail API JSON from a stored message.
 *
 * Returns the exact response from GET /gmail/v1/users/me/messages/{id},
 * as received from the Gmail API. This is the unmodified source-of-truth.
 *
 * @param {object} message - Stored message from IndexedDB
 * @returns {object|null} Raw Gmail API response, or null if not available
 */
export function emailToJson(message) {
  return message.raw || null;
}

/**
 * Serialize the raw Gmail API JSON to a pretty-printed string.
 *
 * @param {object} message - Stored message from IndexedDB
 * @returns {string} Pretty-printed JSON of the raw Gmail API response
 */
export function emailToJsonString(message) {
  const raw = emailToJson(message);
  if (!raw) return "null";
  return JSON.stringify(raw, null, 2);
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
