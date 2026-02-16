import { getHeader } from "./gmail-api.js";

/** Parse a Gmail API message into a flat display object */
export function parseMessage(msg) {
  return {
    id: msg.id,
    threadId: msg.threadId,
    from: getHeader(msg, "From"),
    to: getHeader(msg, "To"),
    subject: getHeader(msg, "Subject") || "(no subject)",
    date: getHeader(msg, "Date"),
    snippet: msg.snippet || "",
    body: null, // lazy-loaded on click
  };
}

/** Format a date string for display */
export function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

/** Extract display name from a "Name <email>" string */
export function extractName(fromStr) {
  if (!fromStr) return "Unknown";
  const match = fromStr.match(/^"?([^"<]+)"?\s*</);
  return match ? match[1].trim() : fromStr.split("@")[0];
}

/** Get the first letter of a sender's name */
export function initial(fromStr) {
  const name = extractName(fromStr);
  return name.charAt(0).toUpperCase();
}

/** Format a date as YYYY-MM-DD for filenames */
export function shortDate(dateStr) {
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

/** Generate a safe filename slug from a subject string (max 60 chars) */
export function slugify(subject) {
  return (subject || "email")
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60)
    .replace(/-+$/, "");
}

/**
 * Generate a safe export filename from an email message.
 * @param {{ subject: string, date: string }} message
 * @param {string} ext - File extension without dot (e.g. "md", "json")
 * @returns {string}
 */
export function exportFilename(message, ext) {
  return `${shortDate(message.date)}_${slugify(message.subject)}.${ext}`;
}

/**
 * Group an array of items by their action field.
 * Returns { groups, order } where groups is { action: items[] }
 * and order is action keys sorted by count descending.
 *
 * @param {object[]} items - Items with an `action` field
 * @returns {{ groups: Object<string, object[]>, order: string[] }}
 */
export function groupByAction(items) {
  const groups = {};
  for (const item of items) {
    const key = item.action || "UNKNOWN";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }

  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => (b.date || 0) - (a.date || 0));
  }

  const order = Object.keys(groups).sort(
    (a, b) => groups[b].length - groups[a].length
  );

  return { groups, order };
}
