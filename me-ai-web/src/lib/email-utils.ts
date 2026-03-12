/** Format a date string for display */
export function formatDate(dateStr: string | number | null | undefined): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr as string | number);
    return d.toLocaleDateString("en-US", {
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

/** Extract display name from a "Name <email>" string */
export function extractName(fromStr: string | null | undefined): string {
  if (!fromStr) return "Unknown";
  const match = fromStr.match(/^"?([^"<]+)"?\s*</);
  return match ? match[1].trim() : fromStr.split("@")[0];
}

/** Get the first letter of a sender's name */
export function initial(fromStr: string | null | undefined): string {
  const name = extractName(fromStr);
  return name.charAt(0).toUpperCase();
}

/** Format a date as YYYY-MM-DD for filenames */
export function shortDate(dateStr: string | number | null | undefined): string {
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

/** Generate a safe filename slug from a subject string (max 60 chars) */
export function slugify(subject: string | null | undefined): string {
  return (subject || "email")
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60)
    .replace(/-+$/, "");
}

/** Message-like shape for export filename */
export interface MessageLike {
  subject?: string;
  date?: string | number;
}

/**
 * Generate a safe export filename from an email message.
 */
export function exportFilename(message: MessageLike, ext: string): string {
  return `${shortDate(message.date)}_${slugify(message.subject)}.${ext}`;
}

/** Item with optional action and date for grouping */
export interface ItemWithAction {
  action?: string;
  date?: number | null;
  [k: string]: unknown;
}

export interface GroupByActionResult<T extends ItemWithAction> {
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
