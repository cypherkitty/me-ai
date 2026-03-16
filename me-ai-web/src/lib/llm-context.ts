/**
 * LLM context building for the Chat page — delegates to me-ai-core.
 *
 * The Rust core builds compact/rich context strings including pending-action
 * control tags ([EXECUTE:CATEGORY:EVENT_TYPE], [SHOW:DASHBOARD]).
 */
import {
  buildLlmContext as coreBuildLlmContext,
  buildEmailContext as coreBuildEmailContext,
} from "./core.js";

/**
 * Build a compact context string for the LLM system prompt.
 * Returns null if no data is available.
 */
export async function buildLLMContext(): Promise<string | null> {
  const result = await coreBuildLlmContext();
  return result || null;
}

/**
 * Build a richer context when the user is asking about emails.
 * Includes recent emails in addition to summary.
 */
export async function buildEmailContext(userQuery?: string): Promise<string> {
  return coreBuildEmailContext(userQuery);
}
