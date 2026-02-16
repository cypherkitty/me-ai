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


