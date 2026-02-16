/**
 * LLM context building for the Chat page.
 *
 * Builds system prompts, greeting messages, and follow-up suggestions
 * from stored data. Separated from query-layer.js to keep data access
 * and AI formatting concerns distinct.
 */

import {
  getDataSummary,
  getDetailedSummary,
  getRecentEmails,
  searchData,
  getPendingActions,
} from "./store/query-layer.js";

// ── LLM context building ────────────────────────────────────────────

/**
 * Build a compact context string for the LLM system prompt.
 * Returns null if no data is available.
 *
 * Designed to be small enough to always include without
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

  if (suggestions.length === 0) {
    suggestions.push("Show me the most important emails");
  }
  suggestions.push("Help me prioritize these items");

  return suggestions.slice(0, 5);
}

// ── Internal helpers ────────────────────────────────────────────────

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
