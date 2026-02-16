/**
 * LLM context building for the Chat page.
 *
 * Builds system prompts and pending-actions context for LLM injection.
 * Separated from query-layer.js to keep data access and AI formatting
 * concerns distinct.
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

