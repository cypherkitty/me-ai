/**
 * LLM context building for the Chat page.
 *
 * Builds system prompts and pending-actions context for LLM injection.
 * Separated from query-layer to keep data access and AI formatting
 * concerns distinct.
 */

import {
  getDataSummary,
  getDetailedSummary,
  getRecentEmails,
  searchData,
  getPendingActions,
} from "./store/query-layer.js";

/**
 * Build a compact context string for the LLM system prompt.
 * Returns null if no data is available.
 */
export async function buildLLMContext(): Promise<string | null> {
  const summary = await getDataSummary();
  if (!summary) return null;

  const parts = [
    "You have access to the user's locally stored data.",
    summary,
    "The user can ask you about their emails. If they do, you can see recent emails and search results that will be provided.",
  ];

  const pending = await getPendingActions();
  if (pending && pending.total > 0) {
    const categoryLines = Object.keys(pending.categories)
      .map((c) => `${c} (${pending.categories[c].length})`)
      .join(", ");
    parts.push(
      `Pending emails awaiting manual execution: ${categoryLines}.`,
      "If the user asks you to execute or handle a pending category, append [EXECUTE:CATEGORY:EVENT_TYPE] to the end of your response.",
      "If the user asks to SEE or MANAGE their events/emails/noise, append [SHOW:DASHBOARD] to the end of your response to spawn a visual dashboard for them."
    );
  }

  return parts.join(" ");
}

/**
 * Build a richer context when the user is asking about emails.
 * Includes recent emails in addition to summary.
 */
export async function buildEmailContext(userQuery?: string): Promise<string> {
  const parts: string[] = [];

  const summary = await getDetailedSummary();
  parts.push(summary);

  const pending = await getPendingActions();
  if (pending && pending.total > 0) {
    const categoryLines = Object.keys(pending.categories).map(
      (c) => `- ${c}: ${pending.categories[c].length} emails`
    );
    parts.push(
      "",
      "## Pending Actions (Triage)",
      "The user has the following emails awaiting manual execution:",
      ...categoryLines,
      "",
      "## AI Control Actions",
      "If the user asks you to execute, process, or handle pending emails by category, you MUST output a special command tag at the very end of your response: [EXECUTE:CATEGORY:EVENT_TYPE]",
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
