/**
 * Email utilities — pure functions delegate to me-ai-core.
 * Local wrappers preserve existing call signatures.
 */
import {
  extractName as coreExtractName,
  initial as coreInitial,
  exportFilename as coreExportFilename,
} from "./core.js";

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
  return coreExtractName(fromStr ?? "");
}

/** Get the first letter of a sender's name. */
export function initial(fromStr: string | null | undefined): string {
  return coreInitial(fromStr ?? "");
}

/** Message-like shape for export filename. */
interface MessageLike {
  subject?: string;
  date?: string | number;
}

/**
 * Generate a safe export filename from an email message.
 * Wraps core exportFilename(subject, dateMs, ext).
 */
export function exportFilename(message: MessageLike, ext: string): string {
  const dateMs =
    message.date == null
      ? 0
      : typeof message.date === "number"
        ? message.date
        : new Date(message.date).getTime();
  return coreExportFilename(message.subject ?? "", dateMs, ext);
}

/** Item with optional action and date for grouping. */
interface ItemWithAction {
  action?: string;
  date?: number | null;
  [k: string]: unknown;
}

interface GroupByActionResult<T extends ItemWithAction> {
  categories: Record<string, T[]>;
  order: string[];
}

/**
 * Group an array of items by their action field.
 * Returns { categories, order } where categories is { action: items[] }
 * and order is action keys sorted by count descending.
 */
export function groupByAction<T extends ItemWithAction>(items: T[]): GroupByActionResult<T> {
  const categories: Record<string, T[]> = {};
  for (const item of items) {
    const key = item.action || "UNKNOWN";
    if (!categories[key]) categories[key] = [];
    categories[key].push(item);
  }

  for (const key of Object.keys(categories)) {
    categories[key].sort((a, b) => (b.date || 0) - (a.date || 0));
  }

  const order = Object.keys(categories).sort(
    (a, b) => categories[b].length - categories[a].length
  );

  return { categories, order };
}
