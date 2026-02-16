import { exportFilename } from "./email-utils.js";

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
  return exportFilename(message, "json");
}
