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

  const parts = [
    "You have access to the user's locally stored data.",
    summary,
    "The user can ask you about their emails. If they do, you can see recent emails and search results that will be provided."
  ];

  const pending = await getPendingActions();
  if (pending && pending.total > 0) {
    const groupLines = Object.keys(pending.groups).map(g => `${g} (${pending.groups[g].length})`).join(", ");
    parts.push(
      `Pending emails awaiting manual execution: ${groupLines}.`,
      "If the user asks you to execute or handle a pending group, append [EXECUTE:GROUP:EVENT_TYPE] to the end of your response.",
      "If the user asks to SEE or MANAGE their events/emails/noise, append [SHOW:DASHBOARD] to the end of your response to spawn a visual dashboard for them."
    );
  }

  return parts.join(" ");
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

  const pending = await getPendingActions();
  if (pending && pending.total > 0) {
    const groupLines = Object.keys(pending.groups).map(g => `- ${g}: ${pending.groups[g].length} emails`);
    parts.push(
      "",
      "## Pending Actions (Triage)",
      "The user has the following emails awaiting manual execution:",
      ...groupLines,
      "",
      "## AI Control Actions",
      "If the user asks you to execute, process, or handle a group of pending emails, you MUST output a special command tag at the very end of your response: [EXECUTE:GROUP:EVENT_TYPE]",
      "If the user asks to SEE, MANAGE, or REVIEW their events/noise/emails visually, output this tag at the very end of your response: [SHOW:DASHBOARD]",
      "Only output these tags if the user explicitly requests or confirms the action."
    );
  }

  if (userQuery) {
    const results = await searchData(userQuery, 5);
    parts.push("", "## Relevant Emails", results);
  } else {
    const recent = await getRecentEmails(5);
    parts.push("", "## Recent Emails", recent);
  }

  return parts.join("\n");
}


