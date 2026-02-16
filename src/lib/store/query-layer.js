/**
 * Query layer for accessing stored data.
 *
 * Provides both LLM-formatted queries (returning markdown strings) and
 * raw data queries (returning objects for UI display). Source-agnostic
 * where possible — when we add messengers, social networks, etc., most
 * queries work across all sources automatically.
 */

import Dexie from "dexie";
import { db } from "./db.js";
import { truncate } from "../format.js";
import { groupByAction } from "../email-utils.js";

// ── Data summary ────────────────────────────────────────────────────

/**
 * Get a high-level summary of all stored data.
 * Suitable for always-on system prompt context (small token footprint).
 */
export async function getDataSummary() {
  const totalEmails = await db.items
    .where("sourceType")
    .equals("gmail")
    .count();
  const totalContacts = await db.contacts.count();

  if (totalEmails === 0) {
    return null; // No data — don't inject anything
  }

  const lines = [`Stored data: ${totalEmails} emails, ${totalContacts} contacts.`];

  // Date range — use compound index for efficiency (no full table scan)
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
export async function getDetailedSummary() {
  const totalEmails = await db.items
    .where("sourceType")
    .equals("gmail")
    .count();
  const totalContacts = await db.contacts.count();

  if (totalEmails === 0) return "No emails stored locally.";

  const parts = [
    `## Data Summary`,
    `- **Emails:** ${totalEmails}`,
    `- **Contacts:** ${totalContacts}`,
  ];

  // Date range — use compound index (no full table scan)
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
 * @param {number} limit
 * @returns {Promise<string>}
 */
export async function getRecentEmails(limit = 10) {
  const items = await db.items
    .where("[sourceType+date]")
    .between(["gmail", Dexie.minKey], ["gmail", Dexie.maxKey])
    .reverse()
    .limit(limit)
    .toArray();

  if (items.length === 0) return "No emails stored locally.";
  return items.map(formatItemForLLM).join("\n\n---\n\n");
}

/**
 * Search stored data by text query across subject, from, snippet, body.
 * @param {string} query
 * @param {number} limit
 * @returns {Promise<string>}
 */
export async function searchData(query, limit = 10) {
  if (!query) return "No search query provided.";

  const q = query.toLowerCase();

  // Filter by sourceType index first, then scan in memory
  const allItems = await db.items
    .where("sourceType")
    .equals("gmail")
    .toArray();

  const scored = allItems
    .map((item) => {
      let score = 0;
      if (item.subject?.toLowerCase().includes(q)) score += 3;
      if (item.from?.toLowerCase().includes(q)) score += 2;
      if (item.to?.toLowerCase().includes(q)) score += 2;
      if (item.snippet?.toLowerCase().includes(q)) score += 1;
      if (item.body?.toLowerCase().includes(q)) score += 1;
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (scored.length === 0) return `No results found for "${query}".`;
  return scored.map(({ item }) => formatItemForLLM(item)).join("\n\n---\n\n");
}

/**
 * Get emails from a specific sender.
 */
export async function getEmailsFrom(sender, limit = 10) {
  const q = sender.toLowerCase();
  const items = await db.items
    .where("sourceType")
    .equals("gmail")
    .filter((item) => item.from?.toLowerCase().includes(q))
    .limit(limit)
    .toArray();

  items.sort((a, b) => (b.date || 0) - (a.date || 0));

  if (items.length === 0) return `No emails found from "${sender}".`;
  return items.map(formatItemForLLM).join("\n\n---\n\n");
}

/**
 * Get emails by label.
 */
export async function getEmailsByLabel(label, limit = 10) {
  const items = await db.items
    .where("labels")
    .equals(label)
    .limit(limit)
    .toArray();

  items.sort((a, b) => (b.date || 0) - (a.date || 0));

  if (items.length === 0) return `No emails found with label "${label}".`;
  return items.map(formatItemForLLM).join("\n\n---\n\n");
}

/**
 * Get a full email thread by threadKey.
 */
export async function getThread(threadKey) {
  const items = await db.items
    .where("threadKey")
    .equals(threadKey)
    .sortBy("date");

  if (items.length === 0) return "Thread not found.";
  return items.map(formatItemForLLM).join("\n\n---\n\n");
}

/**
 * Get all known contacts.
 */
export async function getContacts(limit = 50) {
  const contacts = await db.contacts
    .orderBy("lastSeen")
    .reverse()
    .limit(limit)
    .toArray();

  if (contacts.length === 0) return "No contacts found.";

  return contacts
    .map(
      (c) =>
        `- ${c.name || "(no name)"} <${c.email}> — last seen ${new Date(c.lastSeen).toLocaleDateString()}`
    )
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
  const all = await db.emailClassifications
    .where("status")
    .equals("pending")
    .toArray();

  if (all.length === 0) return null;

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
export async function getStoredEmails({ query, limit = 50, offset = 0 } = {}) {
  if (query) {
    const q = query.toLowerCase();
    const allMatching = await db.items
      .where("sourceType")
      .equals("gmail")
      .filter(
        (item) =>
          item.subject?.toLowerCase().includes(q) ||
          item.from?.toLowerCase().includes(q) ||
          item.to?.toLowerCase().includes(q) ||
          item.snippet?.toLowerCase().includes(q)
      )
      .toArray();

    allMatching.sort((a, b) => (b.date || 0) - (a.date || 0));

    return {
      items: allMatching.slice(offset, offset + limit),
      total: allMatching.length,
    };
  }

  // No query — get all, sorted by date descending
  const total = await db.items
    .where("sourceType")
    .equals("gmail")
    .count();

  const items = await db.items
    .where("[sourceType+date]")
    .between(["gmail", Dexie.minKey], ["gmail", Dexie.maxKey])
    .reverse()
    .offset(offset)
    .limit(limit)
    .toArray();

  return { items, total };
}

// ── Internal helpers ────────────────────────────────────────────────

/** Get oldest and newest gmail items by date using compound index */
async function getDateRange() {
  const oldest = await db.items
    .where("[sourceType+date]")
    .between(["gmail", Dexie.minKey], ["gmail", Dexie.maxKey])
    .first();
  const newest = await db.items
    .where("[sourceType+date]")
    .between(["gmail", Dexie.minKey], ["gmail", Dexie.maxKey])
    .last();
  return { oldest, newest };
}

function formatItemForLLM(item) {
  const date = item.date
    ? new Date(item.date).toLocaleString()
    : "Unknown date";
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
