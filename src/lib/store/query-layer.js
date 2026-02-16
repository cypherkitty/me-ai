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

// ── Pending actions for chat ─────────────────────────────────────────

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

  const groups = {};
  for (const item of all) {
    const key = item.action || "UNKNOWN";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }

  // Sort each group by date descending
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => (b.date || 0) - (a.date || 0));
  }

  // Group order: largest groups first
  const order = Object.keys(groups).sort(
    (a, b) => groups[b].length - groups[a].length
  );

  return { groups, order, total: all.length };
}

/**
 * Build an LLM context string that includes pending action items.
 * This gives the LLM full awareness of what needs the user's attention.
 *
 * @returns {Promise<string|null>}
 */
export async function buildPendingActionsContext() {
  const pending = await getPendingActions();
  if (!pending) return null;

  const parts = [
    "## Pending Action Items",
    `You have ${pending.total} pending email action items that need attention:`,
    "",
  ];

  for (const action of pending.order) {
    const items = pending.groups[action];
    const label = action.replace(/_/g, " ");
    parts.push(`### ${label} (${items.length})`);
    for (const item of items.slice(0, 5)) {
      const date = item.date
        ? new Date(item.date).toLocaleDateString()
        : "unknown date";
      parts.push(`- **${item.subject}** from ${item.from} (${date})`);
      if (item.summary) parts.push(`  ${item.summary}`);
    }
    if (items.length > 5) {
      parts.push(`  ...and ${items.length - 5} more`);
    }
    parts.push("");
  }

  parts.push(
    "The user is seeing these pending items in their chat. Help them decide what to do with these items. You can suggest specific actions like archiving, replying, following up, etc."
  );

  return parts.join("\n");
}

// ── Chat greeting & suggestions ─────────────────────────────────────

/**
 * Build a brief greeting message from pending actions data.
 * This is injected as a pre-generated assistant message (no LLM needed).
 *
 * @param {{groups: Object, order: string[], total: number}} pendingData
 * @returns {string}
 */
export function buildGreetingMessage(pendingData) {
  const lines = [`You have ${pendingData.total} pending email action${pendingData.total !== 1 ? "s" : ""}:`];

  for (const action of pendingData.order) {
    const count = pendingData.groups[action].length;
    const label = formatActionLabel(action);
    lines.push(`- ${count} ${label}`);
  }

  lines.push("", "What would you like to focus on?");
  return lines.join("\n");
}

/**
 * Build initial follow-up suggestions based on pending actions.
 * Returns an array of suggestion strings.
 *
 * @param {{groups: Object, order: string[], total: number}} pendingData
 * @returns {string[]}
 */
export function buildInitialSuggestions(pendingData) {
  const suggestions = [];

  // Contextual suggestions based on what action groups exist
  const actions = new Set(pendingData.order);

  if (actions.has("REPLY") || actions.has("FOLLOW_UP")) {
    suggestions.push("Which emails need an urgent reply?");
  }
  if (actions.has("TRACK_DELIVERY")) {
    suggestions.push("What deliveries am I waiting for?");
  }
  if (actions.has("PAY_BILL") || actions.has("SAVE_RECEIPT")) {
    suggestions.push("Show me bills or receipts that need attention");
  }
  if (actions.has("DELETE") || actions.has("ARCHIVE") || actions.has("UNSUBSCRIBE")) {
    suggestions.push("What can I safely archive or delete?");
  }

  // Always-available suggestions
  if (suggestions.length === 0) {
    suggestions.push("Show me the most important emails");
  }
  suggestions.push("Help me prioritize these items");

  // Cap at 5 suggestions
  return suggestions.slice(0, 5);
}

/**
 * Format an UPPER_SNAKE_CASE action into a readable label.
 * @param {string} action
 * @returns {string}
 */
function formatActionLabel(action) {
  return action
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
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
