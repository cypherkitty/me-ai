/** Formatting utilities — pure functions delegate to me-ai-core. */
export { formatBytes, formatBytesPrecise, progressPct, truncate, stringToHue } from "./core.js";

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

/** Format a date as YYYY-MM-DD for filenames. */
export function shortDate(dateStr: string | number | null | undefined): string {
  if (!dateStr) return "email";
  try {
    const d = new Date(dateStr as string | number);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return "email";
  }
}
