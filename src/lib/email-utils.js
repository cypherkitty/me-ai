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
