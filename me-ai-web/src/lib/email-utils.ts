/**
 * Email utilities — browser-only helpers that require Intl/DOM APIs.
 * Pure functions delegate to me-ai-core; only formatDate stays in TS.
 */
import { getCore } from "./store/core-store.js";
import type { MessageLike } from "./core.js";

/** Format a date string/number for display (browser locale). */
export function formatDate(dateStr: string | number | null | undefined): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr as string | number).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return String(dateStr);
  }
}

/** Extract display name from a "Name <email>" string. */
export function extractName(fromStr: string | null | undefined): string {
  return getCore().extractName(fromStr ?? "");
}

/** Get the first letter of a sender's name. */
export function initial(fromStr: string | null | undefined): string {
  return getCore().initial(fromStr ?? "");
}

/**
 * Generate a safe export filename from an email message.
 */
export function exportFilename(message: MessageLike, ext: string): string {
  const dateMs =
    message.date == null
      ? 0
      : typeof message.date === "number"
        ? message.date
        : new Date(message.date).getTime();
  return getCore().exportFilename(message.subject ?? "", dateMs, ext);
}
