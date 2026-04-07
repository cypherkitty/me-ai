/**
 * Query layer for accessing stored data.
 *
 * SQL lives in Rust (me-ai-core). This layer is thin: it calls core and formats
 * results. Rust builds queries and passes them to the JS adapter for execution.
 */

import { getCore } from "./core-store.js";
import { fromJson } from "./db.js";
import type {
  StoredItem,
  GetStoredEmailsOptions,
  GetStoredEmailsResult,
  PendingActionsResult,
} from "$lib/types";

// ── Pending actions ─────────────────────────────────────────────────

/**
 * Get pending email classifications grouped by action type.
 * Returns null if there are no pending items.
 */
export async function getPendingActions(): Promise<PendingActionsResult | null> {
  const result = await getCore().getClassificationsByCategory(true);
  if (result.total === 0) return null;
  return { categories: result.categories, order: result.order, total: result.total };
}

// ── Raw data queries (for UI, not LLM) ─────────────────────────────

/**
 * Get stored emails as raw objects for UI display.
 */
export async function getStoredEmails({
  query: searchQuery,
  limit = 50,
  offset = 0,
}: GetStoredEmailsOptions = {}): Promise<GetStoredEmailsResult> {
  const fetchSize = searchQuery ? 2000 : limit + offset;
  const rows = (await getCore().getItemsGmailByDateDesc(fetchSize)) as unknown as Record<
    string,
    unknown
  >[];

  let items = rows ?? [];
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    items = items.filter((r) => {
      const subj = String(r.subject ?? "").toLowerCase();
      const from = String(r.from ?? "").toLowerCase();
      const to = String(r.to ?? "").toLowerCase();
      const snippet = String(r.snippet ?? "").toLowerCase();
      return subj.includes(q) || from.includes(q) || to.includes(q) || snippet.includes(q);
    });
  }

  const total = searchQuery ? items.length : Number((await getCore().getItemsCountGmail()) ?? 0);
  const page = items.slice(offset, offset + limit);
  return { items: page.map((r) => normaliseRow(r)), total };
}

// ── Internal helpers ────────────────────────────────────────────────────────

function normaliseRow(row: Record<string, unknown>): StoredItem {
  return {
    ...row,
    id: row.id as string,
    sourceType: row.sourceType as string,
    sourceId: row.sourceId as string,
    threadKey: row.threadKey as string,
    type: row.type as string,
    from: row.from as string,
    to: row.to as string,
    cc: row.cc as string,
    subject: row.subject as string,
    snippet: row.snippet as string,
    body: row.body as string,
    htmlBody: row.htmlBody as string | null,
    date: row.date != null ? Number(row.date) : null,
    syncedAt: row.syncedAt != null ? Number(row.syncedAt) : null,
    labels: fromJson<string[]>(row.labels as string, []),
    raw: fromJson(row.raw as string, null),
    messageId: (row.messageId as string) ?? "",
    inReplyTo: (row.inReplyTo as string) ?? "",
    references: (row.references as string) ?? "",
  } as StoredItem;
}
