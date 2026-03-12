/**
 * Query layer for accessing stored data.
 *
 * Provides both LLM-formatted queries (returning markdown strings) and
 * raw data queries (returning objects for UI display). Source-agnostic
 * where possible — when we add messengers, social networks, etc., most
 * queries work across all sources automatically.
 */

import { query, fromJson } from "./db.js";
import { truncate } from "../format.js";
import { groupByAction } from "../email-utils.js";
import type { StoredItem, GetStoredEmailsOptions, GetStoredEmailsResult, PendingActionsResult } from "$lib/types";

// ── Data summary ────────────────────────────────────────────────────

/**
 * Get a high-level summary of all stored data.
 * Suitable for always-on system prompt context (small token footprint).
 */
export async function getDataSummary(): Promise<string | null> {
  const [countRow] = await query(
    `SELECT COUNT(*) AS cnt FROM items WHERE sourceType = 'gmail'`
  );
  const totalEmails = Number(countRow?.cnt ?? 0);

  const [contactRow] = await query(`SELECT COUNT(*) AS cnt FROM contacts`);
  const totalContacts = Number(contactRow?.cnt ?? 0);

  if (totalEmails === 0) return null;

  const lines = [`Stored data: ${totalEmails} emails, ${totalContacts} contacts.`];

  const { oldest, newest } = await getDateRange();
  if (oldest && newest) {
    const from = new Date(oldest.date).toLocaleDateString();
    const to = new Date(newest.date).toLocaleDateString();
    lines.push(`Date range: ${from} to ${to}.`);
  }

  return lines.join(" ");
}

/**
 * Get a detailed summary with label distribution, top senders, etc.
 */
export async function getDetailedSummary(): Promise<string> {
  const [countRow] = await query(
    `SELECT COUNT(*) AS cnt FROM items WHERE sourceType = 'gmail'`
  );
  const totalEmails = Number(countRow?.cnt ?? 0);

  const [contactRow] = await query(`SELECT COUNT(*) AS cnt FROM contacts`);
  const totalContacts = Number(contactRow?.cnt ?? 0);

  if (totalEmails === 0) return "No emails stored locally.";

  const parts = [
    `## Data Summary`,
    `- **Emails:** ${totalEmails}`,
    `- **Contacts:** ${totalContacts}`,
  ];

  const { oldest, newest } = await getDateRange();
  if (oldest && newest) {
    const from = new Date(oldest.date).toLocaleDateString();
    const to = new Date(newest.date).toLocaleDateString();
    parts.push(`- **Date range:** ${from} — ${to}`);
  }

  return parts.join("\n");
}

// ── Email queries ───────────────────────────────────────────────────

/**
 * Get recent emails formatted for LLM context.
 */
export async function getRecentEmails(limit = 10): Promise<string> {
  const items = await query(
    `SELECT * FROM items WHERE sourceType = 'gmail'
     ORDER BY date DESC
     LIMIT ?`,
    [limit]
  );

  if (items.length === 0) return "No emails stored locally.";
  return items
    .map((r) => formatItemForLLM(normaliseRow(r as Record<string, unknown>)))
    .join("\n\n---\n\n");
}

/**
 * Search stored data by text query across subject, from, snippet, body.
 */
export async function searchData(searchQuery: string, limit = 10): Promise<string> {
  if (!searchQuery) return "No search query provided.";

  const q = `%${searchQuery}%`;
  const rows = await query(
    `SELECT *,
       (CASE WHEN subject ILIKE ? THEN 3 ELSE 0 END +
        CASE WHEN "from"  ILIKE ? THEN 2 ELSE 0 END +
        CASE WHEN "to"    ILIKE ? THEN 2 ELSE 0 END +
        CASE WHEN snippet ILIKE ? THEN 1 ELSE 0 END +
        CASE WHEN body    ILIKE ? THEN 1 ELSE 0 END) AS score
     FROM items
     WHERE sourceType = 'gmail'
       AND (subject ILIKE ? OR "from" ILIKE ? OR "to" ILIKE ?
            OR snippet ILIKE ? OR body ILIKE ?)
     ORDER BY score DESC, date DESC
     LIMIT ?`,
    [q, q, q, q, q, q, q, q, q, q, limit]
  );

  if (rows.length === 0) return `No results found for "${searchQuery}".`;
  return rows
    .map((r) => formatItemForLLM(normaliseRow(r as Record<string, unknown>)))
    .join("\n\n---\n\n");
}

// ── Pending actions ─────────────────────────────────────────────────

/**
 * Get pending email classifications grouped by action type.
 * Returns null if there are no pending items.
 */
export async function getPendingActions(): Promise<PendingActionsResult | null> {
  const rows = await query(
    `SELECT * FROM emailClassifications WHERE status = 'pending'`
  );
  if (rows.length === 0) return null;

  const all = rows.map((r) => ({ ...r, tags: fromJson<unknown[]>(r.tags as string, []) }));
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
  if (searchQuery) {
    const q = `%${searchQuery}%`;
    const [countRow] = await query(
      `SELECT COUNT(*) AS cnt FROM items
       WHERE sourceType = 'gmail'
         AND (subject ILIKE ? OR "from" ILIKE ? OR "to" ILIKE ? OR snippet ILIKE ?)`,
      [q, q, q, q]
    );
    const total = Number(countRow?.cnt ?? 0);

    const rows = await query(
      `SELECT * FROM items
       WHERE sourceType = 'gmail'
         AND (subject ILIKE ? OR "from" ILIKE ? OR "to" ILIKE ? OR snippet ILIKE ?)
       ORDER BY date DESC
       LIMIT ? OFFSET ?`,
      [q, q, q, q, limit, offset]
    );

    return { items: rows.map((r) => normaliseRow(r as Record<string, unknown>)), total };
  }

  const [countRow] = await query(
    `SELECT COUNT(*) AS cnt FROM items WHERE sourceType = 'gmail'`
  );
  const total = Number(countRow?.cnt ?? 0);

  const rows = await query(
    `SELECT * FROM items WHERE sourceType = 'gmail'
     ORDER BY date DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  return { items: rows.map((r) => normaliseRow(r as Record<string, unknown>)), total };
}

// ── Internal helpers ────────────────────────────────────────────────

async function getDateRange(): Promise<{
  oldest: { date: number } | null;
  newest: { date: number } | null;
}> {
  const [oldest] = await query(
    `SELECT date FROM items WHERE sourceType = 'gmail' ORDER BY date ASC  LIMIT 1`
  );
  const [newest] = await query(
    `SELECT date FROM items WHERE sourceType = 'gmail' ORDER BY date DESC LIMIT 1`
  );
  return {
    oldest: oldest ? { date: Number(oldest.date) } : null,
    newest: newest ? { date: Number(newest.date) } : null,
  };
}

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
