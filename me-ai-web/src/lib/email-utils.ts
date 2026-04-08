/**
 * Email utilities — display formatting defers to me-ai-core where epoch ms is known.
 * Non-numeric date strings use `Date.parse` in TS, then Rust formatting via `getCore()`.
 */
import { getCore } from "./store/core-store.js";
import type { MessageLike } from "./core.js";

/** Format a date string/number/bigint (WASM i64) for list/detail (en-US style, UTC in core). */
export function formatDate(dateStr: string | number | bigint | null | undefined): string {
  if (dateStr === "" || dateStr == null) return "";
  const c = getCore();
  if (typeof dateStr === "bigint" || typeof dateStr === "number") {
    const ms = typeof dateStr === "bigint" ? Number(dateStr) : dateStr;
    return Number.isFinite(ms) ? c.formatDisplayDateEnUs(ms) : String(dateStr);
  }
  const trimmed = dateStr.trim();
  if (/^\d+$/.test(trimmed)) {
    const n = Number(trimmed);
    return Number.isFinite(n) ? c.formatDisplayDateEnUs(n) : trimmed;
  }
  const parsed = Date.parse(trimmed);
  if (Number.isFinite(parsed)) return c.formatDisplayDateEnUs(parsed);
  return dateStr;
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
      : typeof message.date === "bigint"
        ? Number(message.date)
        : typeof message.date === "number"
          ? message.date
          : new Date(message.date).getTime();
  return getCore().exportFilename(message.subject ?? "", dateMs, ext);
}
