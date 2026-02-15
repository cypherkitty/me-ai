/**
 * Query layer for LLM and AI agent access to stored data.
 *
 * All functions return plain text / markdown strings ready for injection
 * into LLM system prompts or tool responses. This keeps the LLM integration
 * decoupled from the storage implementation.
 *
 * Design: source-agnostic where possible — when we add messengers,
 * social networks, etc., most queries work across all sources automatically.
 */

import { db } from "./db.js";

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

  // Date range
  const oldest = await db.items
    .where("[sourceType+date]")
    .between(["gmail", Dexie.minKey], ["gmail", Dexie.maxKey])
    .first();
  const newest = await db.items
    .where("[sourceType+date]")
    .between(["gmail", Dexie.minKey], ["gmail", Dexie.maxKey])
    .last();

  if (oldest && newest) {
    const from = new Date(oldest.date).toLocaleDateString();
    const to = new Date(newest.date).toLocaleDateString();
    lines.push(`Date range: ${from} to ${to}.`);
  }

  // Top 5 senders (quick distribution)
  const senderCounts = await getTopSenders(5);
  if (senderCounts.length > 0) {
    lines.push(
      "Top senders: " +
        senderCounts.map(([s, n]) => `${extractShortName(s)} (${n})`).join(", ") +
        "."
    );
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

  const topSenders = await getTopSenders(10);
  const labelDist = await getLabelDistribution(10);

  const parts = [
    `## Data Summary`,
    `- **Emails:** ${totalEmails}`,
    `- **Contacts:** ${totalContacts}`,
  ];

  // Date range
  const allItems = await db.items
    .where("sourceType")
    .equals("gmail")
    .sortBy("date");
  if (allItems.length > 0) {
    const oldest = new Date(allItems[0].date).toLocaleDateString();
    const newest = new Date(
      allItems[allItems.length - 1].date
    ).toLocaleDateString();
    parts.push(`- **Date range:** ${oldest} — ${newest}`);
  }

  if (topSenders.length > 0) {
    parts.push("", "### Top Senders");
    for (const [sender, count] of topSenders) {
      parts.push(`- ${sender}: ${count}`);
    }
  }

  if (labelDist.length > 0) {
    parts.push("", "### Labels");
    for (const [label, count] of labelDist) {
      parts.push(`- ${label}: ${count}`);
    }
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
  const allItems = await db.items.toArray();

  const scored = allItems
    .map((item) => {
      let score = 0;
      if (item.subject?.toLowerCase().includes(q)) score += 3;
      if (item.from?.toLowerCase().includes(q)) score += 2;
      if (item.to?.toLowerCase().includes(q)) score += 2;
      if (item.snippet?.toLowerCase().includes(q)) score += 1;
      // Body search — expensive but thorough
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

// ── LLM context building ────────────────────────────────────────────

/**
 * Build a compact context string for the LLM system prompt.
 * Returns null if no data is available.
 *
 * This is designed to be small enough to always include without
 * blowing up the context window on small models (< 200 tokens).
 */
export async function buildLLMContext() {
  const summary = await getDataSummary();
  if (!summary) return null;

  return [
    "You have access to the user's locally stored data.",
    summary,
    'The user can ask you about their emails. If they do, you can see recent emails and search results that will be provided.',
  ].join(" ");
}

/**
 * Build a richer context when the user is asking about emails.
 * Includes recent emails in addition to summary.
 * @param {string} [userQuery] - Optional user query to search for relevant emails
 */
export async function buildEmailContext(userQuery) {
  const parts = [];

  const summary = await getDetailedSummary();
  parts.push(summary);

  if (userQuery) {
    const results = await searchData(userQuery, 5);
    parts.push("", "## Relevant Emails", results);
  } else {
    const recent = await getRecentEmails(5);
    parts.push("", "## Recent Emails", recent);
  }

  return parts.join("\n");
}

// ── Internal helpers ────────────────────────────────────────────────

async function getTopSenders(limit) {
  const allItems = await db.items
    .where("sourceType")
    .equals("gmail")
    .toArray();

  const counts = {};
  for (const item of allItems) {
    const from = item.from || "Unknown";
    counts[from] = (counts[from] || 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

async function getLabelDistribution(limit) {
  const allItems = await db.items
    .where("sourceType")
    .equals("gmail")
    .toArray();

  const counts = {};
  for (const item of allItems) {
    for (const label of item.labels || []) {
      counts[label] = (counts[label] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
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

function truncate(str, maxLen) {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "...";
}

function extractShortName(fromStr) {
  if (!fromStr) return "Unknown";
  const match = fromStr.match(/^"?([^"<]+)"?\s*</);
  return match ? match[1].trim() : fromStr.split("@")[0];
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
  let collection;

  if (query) {
    const q = query.toLowerCase();
    // Filter all gmail items by text match
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

    // Sort by date descending
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

// Re-export Dexie for use in queries that need min/max keys
import Dexie from "dexie";
