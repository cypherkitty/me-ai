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

// ── Data summary ────────────────────────────────────────────────────

/**
 * Get a high-level summary of all stored data.
 * Suitable for always-on system prompt context (small token footprint).
 */
export async function getDataSummary() {
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
    const to   = new Date(newest.date).toLocaleDateString();
    lines.push(`Date range: ${from} to ${to}.`);
  }

  return lines.join(" ");
}

/**
 * Get a detailed summary with label distribution, top senders, etc.
 */
export async function getDetailedSummary() {
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
    const to   = new Date(newest.date).toLocaleDateString();
    parts.push(`- **Date range:** ${from} — ${to}`);
  }

  return parts.join("\n");
}

// ── Email queries ───────────────────────────────────────────────────

/**
 * Get recent emails formatted for LLM context.
 * @param {number} limit
 * @returns {Promise<string>}
 */
export async function getRecentEmails(limit = 10) {
  const items = await query(
    `SELECT * FROM items WHERE sourceType = 'gmail'
     ORDER BY date DESC
     LIMIT ?`,
    [limit]
  );

  if (items.length === 0) return "No emails stored locally.";
  return items.map(r => formatItemForLLM(normaliseRow(r))).join("\n\n---\n\n");
}

/**
 * Search stored data by text query across subject, from, snippet, body.
 * DuckDB's ILIKE gives us fast case-insensitive matching.
 *
 * @param {string} query
 * @param {number} limit
 * @returns {Promise<string>}
 */
export async function searchData(searchQuery, limit = 10) {
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
  return rows.map(r => formatItemForLLM(normaliseRow(r))).join("\n\n---\n\n");
}

/**
 * Get emails from a specific sender.
 */
export async function getEmailsFrom(sender, limit = 10) {
  const rows = await query(
    `SELECT * FROM items
     WHERE sourceType = 'gmail' AND "from" ILIKE ?
     ORDER BY date DESC
     LIMIT ?`,
    [`%${sender}%`, limit]
  );

  if (rows.length === 0) return `No emails found from "${sender}".`;
  return rows.map(r => formatItemForLLM(normaliseRow(r))).join("\n\n---\n\n");
}

/**
 * Get emails by label.
 * Labels are stored as a JSON array string, so we use a LIKE check.
 */
export async function getEmailsByLabel(label, limit = 10) {
  const rows = await query(
    `SELECT * FROM items
     WHERE sourceType = 'gmail' AND labels LIKE ?
     ORDER BY date DESC
     LIMIT ?`,
    [`%${label}%`, limit]
  );

  if (rows.length === 0) return `No emails found with label "${label}".`;
  return rows.map(r => formatItemForLLM(normaliseRow(r))).join("\n\n---\n\n");
}

/**
 * Get a full email thread by threadKey.
 */
export async function getThread(threadKey) {
  const rows = await query(
    `SELECT * FROM items WHERE threadKey = ? ORDER BY date ASC`,
    [threadKey]
  );

  if (rows.length === 0) return "Thread not found.";
  return rows.map(r => formatItemForLLM(normaliseRow(r))).join("\n\n---\n\n");
}

/**
 * Get all known contacts.
 */
export async function getContacts(limit = 50) {
  const rows = await query(
    `SELECT * FROM contacts ORDER BY lastSeen DESC LIMIT ?`,
    [limit]
  );

  if (rows.length === 0) return "No contacts found.";

  return rows
    .map(c => `- ${c.name || "(no name)"} <${c.email}> — last seen ${new Date(Number(c.lastSeen)).toLocaleDateString()}`)
    .join("\n");
}

// ── Pending actions ─────────────────────────────────────────────────

/**
 * Get pending email classifications grouped by action type.
 * Returns null if there are no pending items.
 *
 * @returns {Promise<{groups: Object, order: string[], total: number}|null>}
 */
export async function getPendingActions() {
  const rows = await query(
    `SELECT * FROM emailClassifications WHERE status = 'pending'`
  );
  if (rows.length === 0) return null;

  const all = rows.map(r => ({ ...r, tags: fromJson(r.tags, []) }));
  const { groups, order } = groupByAction(all);
  return { groups, order, total: all.length };
}

// ── Raw data queries (for UI, not LLM) ─────────────────────────────

/**
 * Get stored emails as raw objects for UI display.
 * Sorted by date descending. Supports local text search and pagination.
 *
 * @param {object} options
 * @param {string} [options.query] - Text search (subject, from, snippet)
 * @param {number} [options.limit=50] - Max results
 * @param {number} [options.offset=0] - Skip first N results
 * @returns {Promise<{items: object[], total: number}>}
 */
export async function getStoredEmails({ query: searchQuery, limit = 50, offset = 0 } = {}) {
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

    return { items: rows.map(normaliseRow), total };
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

  return { items: rows.map(normaliseRow), total };
}

// ── Internal helpers ────────────────────────────────────────────────

/** Get oldest and newest gmail items by date */
async function getDateRange() {
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

/**
 * Convert a raw DuckDB row (all values are strings/numbers) back to the
 * shape the rest of the app expects (arrays decoded from JSON, etc.).
 */
function normaliseRow(row) {
  return {
    ...row,
    date:     row.date     != null ? Number(row.date)     : null,
    syncedAt: row.syncedAt != null ? Number(row.syncedAt) : null,
    labels:   fromJson(row.labels, []),
    raw:      fromJson(row.raw, null),
  };
}

function formatItemForLLM(item) {
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
      return [
        `**From:** ${item.from}`,
        `**Date:** ${date}`,
        "",
        body,
      ].join("\n");
  }
}
