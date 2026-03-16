/**
 * Query layer for accessing stored data.
 *
 * SQL lives in Rust (me-ai-core). This layer is thin: it calls core and formats
 * results. Rust builds queries and passes them to the JS adapter for execution.
 */

import {
  getItemsGmailByDateDesc,
  getEmailClassifications,
  getItemsCountGmail,
  getDataSummary as coreGetDataSummary,
  getDetailedSummary as coreGetDetailedSummary,
  getRecentEmailsContext,
} from "../core.js";
import { fromJson } from "./db.js";
import { truncate } from "../format.js";
import { groupByAction } from "../email-utils.js";
import type { StoredItem, GetStoredEmailsOptions, GetStoredEmailsResult, PendingActionsResult } from "$lib/types";

// ── Data summary (WASM core builds SQL and passes to adapter) ───────────────

/**
 * Get a high-level summary of all stored data.
 * Suitable for always-on system prompt context (small token footprint).
 * Delegates to me-ai-core.
 */
export async function getDataSummary(): Promise<string | null> {
  const s = await coreGetDataSummary();
  return s || null;
}

/**
 * Get a detailed summary with label distribution, top senders, etc.
 * Delegates to me-ai-core.
 */
export async function getDetailedSummary(): Promise<string> {
  return coreGetDetailedSummary();
}

// ── Email queries ───────────────────────────────────────────────────

/**
 * Get recent emails formatted for LLM context.
 * Delegates to me-ai-core.
 */
export async function getRecentEmails(limit = 10): Promise<string> {
  return getRecentEmailsContext(limit);
}

/**
 * Search stored data by text query across subject, from, snippet, body.
 */
export async function searchData(searchQuery: string, limit = 10): Promise<string> {
  if (!searchQuery) return "No search query provided.";
  const rows = ((await getItemsGmailByDateDesc(limit * 5)) as unknown) as Record<string, unknown>[];
  const q = searchQuery.toLowerCase();
  const scored = (rows ?? []).filter((r) => {
    const subj = String(r.subject ?? "").toLowerCase();
    const from = String(r.from ?? "").toLowerCase();
    const to = String(r.to ?? "").toLowerCase();
    const snippet = String(r.snippet ?? "").toLowerCase();
    const body = String(r.body ?? "").toLowerCase();
    return subj.includes(q) || from.includes(q) || to.includes(q) || snippet.includes(q) || body.includes(q);
  }).slice(0, limit);
  if (scored.length === 0) return "No matching emails found.";
  return scored
    .map((r) => formatItemForLLM(normaliseRow(r)))
    .join("\n\n---\n\n");
}

// ── Pending actions ─────────────────────────────────────────────────

/**
 * Get pending email classifications grouped by action type.
 * Returns null if there are no pending items.
 */
export async function getPendingActions(): Promise<PendingActionsResult | null> {
  const rows = ((await getEmailClassifications()) as unknown) as Record<string, unknown>[];
  const pending = (rows ?? []).filter((r) => r.status === "pending");
  if (pending.length === 0) return null;
  const all = pending.map((r) => ({ ...r, tags: fromJson<unknown[]>(r.tags as string, []) }));
  const { categories, order } = groupByAction(all);
  return { categories, order, total: all.length };
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
  const rows = ((await getItemsGmailByDateDesc(fetchSize)) as unknown) as Record<string, unknown>[];

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

  const total = searchQuery ? items.length : Number(await getItemsCountGmail() ?? 0);
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

function formatItemForLLM(item: StoredItem): string {
  const date = item.date ? new Date(item.date).toLocaleString() : "Unknown date";
  const body = truncate(item.body || item.snippet || "", 500);

  switch (item.type) {
    case "email":
      return [
        `**Subject:** ${item.subject}`,
        `**From:** ${item.from}`,
        `**To:** ${item.to}`,
        item.cc ? `**CC:** ${item.cc}` : "",
        `**Date:** ${date}`,
        `**Labels:** ${(item.labels || []).join(", ")}`,
        "",
        body,
      ]
        .filter(Boolean)
        .join("\n");

    default:
      return [`**From:** ${item.from}`, `**Date:** ${date}`, "", body].join("\n");
  }
}
