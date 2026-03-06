/**
 * Execution Service
 *
 * High-level service for executing action pipelines.
 * Handles authentication, progress tracking, result formatting,
 * and group-based execution policies (NOISE / INFO / CRITICAL).
 */

import { pluginRegistry } from "./plugin-registry.js";
import { findMatchingRules, getPipelineForEvent } from "../rules.js";
import { EVENT_GROUPS } from "../events.js";
import { getSavedToken } from "../google-auth.js";
import { logExecution, syncAfterExecution } from "../store/audit.js";

/**
 * @typedef {Object} ExecutionProgress
 * @property {string} phase - "starting" | "policy_check" | "approval_required" | "pipeline_loaded" | "action_start" | "action_complete" | "done" | "error"
 * @property {string} [actionId] - Current action ID
 * @property {string} [actionName] - Current action name
 * @property {Object} [result] - Action result
 * @property {string} [error] - Error message if failed
 * @property {string} [group] - Event group (NOISE/INFO/CRITICAL)
 * @property {number} [eventIndex] - Current event index (for batch)
 * @property {number} [totalEvents] - Total events (for batch)
 */

/**
 * Execute an action pipeline for a single event.
 * Respects the event type's group execution policy:
 *   NOISE    — executes without any prompt
 *   INFO     — executes on user request (caller decides when to call)
 *   CRITICAL — returns { requiresApproval: true } until caller passes approved=true
 *
 * @param {Object} event - The event to process (must have type, source, data)
 * @param {Function} [onProgress] - Progress callback
 * @param {boolean} [approved=false] - Set true to bypass CRITICAL approval check
 * @returns {Promise<Object>} - Execution result
 */
export async function executePipeline(event, onProgress, approved = false) {
  try {
    onProgress?.({ phase: "starting", event });

    const category = event.metadata?.category || event.data?.category || "";
    const rules = await findMatchingRules(event.type, category);
    const rule = rules[0];

    let group = "INFO";
    let requiresApproval = false;
    let actions = [];
    let policy = "";

    if (rule) {
      policy = rule.policy ?? "";
      if (policy === "manual") { requiresApproval = true; group = "CRITICAL"; }
      else if (policy === "auto") { group = "NOISE"; }
      actions = rule.actions || [];
    } else {
      // Fallback: use category-based pipeline (e.g. NOISE → trash) when no sm_rules row matches
      const pipeline = await getPipelineForEvent(event.type);
      if (pipeline?.actions?.length) {
        policy = pipeline.policy ?? "manual";
        if (policy === "manual") { requiresApproval = true; group = "CRITICAL"; }
        else if (policy === "auto") { group = "NOISE"; }
        actions = pipeline.actions.map((a, i) => ({
          id: a.commandId + "_" + i,
          pluginId: a.pluginId,
          commandId: a.commandId,
          name: a.commandId?.replace(/_/g, " ") ?? "",
        }));
      }
    }

    if (!actions?.length) {
      return { success: true, message: rule
        ? `No actions defined for rule: ${rule.name}`
        : `No enabled pipeline rule or category pipeline matches event type: ${event.type}`, results: [] };
    }

    onProgress?.({ phase: "policy_check", group, policy });

    if (requiresApproval && !approved) {
      return {
        success: false,
        requiresApproval: true,
        group,
        actions,
        message: `This event type is CRITICAL — review the actions below and confirm before executing.`,
      };
    }

    const tokenData = await getSavedToken();
    if (!tokenData?.access_token) {
      throw new Error("Not authenticated. Please sign in to Gmail first.");
    }
    const accessToken = tokenData.access_token;

    onProgress?.({ phase: "pipeline_loaded", actions, actionCount: actions.length });

    const context = { accessToken, event, onProgress };
    const result = await pluginRegistry.executePipeline(actions, context);

    // ── Post-execution: sync local DB and write audit log ──────────────
    const emailId = event.data?.emailId ?? event.data?.id;
    await Promise.all([
      logExecution({
        emailId,
        subject: event.data?.subject,
        from: event.data?.from,
        eventType: event.type,
        actions,
        results: result.results ?? [],
        success: result.success,
      }),
      syncAfterExecution(emailId, result.results ?? []),
    ]);

    onProgress?.({ phase: "done", result });
    return result;
  } catch (error) {
    onProgress?.({ phase: "error", error: error.message });
    return { success: false, error, message: error.message || "Unknown error" };
  }
}

/**
 * Execute an action pipeline for multiple events (batch).
 *
 * @param {string} eventType - Event type (e.g., "PAY_BILL")
 * @param {Object[]} events - Array of events to process
 * @param {Function} [onProgress] - Progress callback
 * @param {boolean} [approved=false] - Set true to bypass CRITICAL approval check
 * @returns {Promise<Object>} - Batch execution result
 */
export async function executePipelineBatch(eventType, events, onProgress, approved = false) {
  try {
    onProgress?.({ phase: "starting", eventType, eventCount: events.length });

    // In batch mode, we assume events generally share the same rule logic.
    // We'll use the first event's category to find the matching rule for the batch.
    const sampleCategory = events[0]?.metadata?.category || events[0]?.data?.category || "";
    const rules = await findMatchingRules(eventType, sampleCategory);
    const rule = rules[0];

    let group = "INFO";
    let requiresApproval = false;
    let actions = [];

    if (rule) {
      if (rule.policy === "manual") { requiresApproval = true; group = "CRITICAL"; }
      else if (rule.policy === "auto") { group = "NOISE"; }
      actions = rule.actions || [];
    } else {
      return { success: true, message: `No enabled pipeline rule matches event type: ${eventType}`, results: [], total: 0, successful: 0, failed: 0 };
    }

    if (requiresApproval && !approved) {
      return {
        success: false,
        requiresApproval: true,
        group,
        actions,
        total: events.length,
        successful: 0,
        failed: 0,
        message: `This event type is CRITICAL — review the actions below and confirm before executing.`,
      };
    }

    const tokenData = await getSavedToken();
    if (!tokenData?.access_token) {
      throw new Error("Not authenticated. Please sign in to Gmail first.");
    }
    const accessToken = tokenData.access_token;

    if (!actions || actions.length === 0) {
      return { success: true, message: `No actions defined for rule: ${rule.name}`, results: [], total: 0, successful: 0, failed: 0 };
    }

    onProgress?.({ phase: "pipeline_loaded", actions, actionCount: actions.length });

    const eventObjects = events.map((email) => ({ type: eventType, source: "gmail", data: email }));
    const baseContext = { accessToken, onProgress };

    const result = await pluginRegistry.executePipelineBatch(actions, eventObjects, baseContext);

    // ── Post-execution: audit log + DB sync per email ──────────────────
    await Promise.all((result.results ?? []).map(async (r) => {
      const emailId = r.event?.data?.emailId ?? r.event?.data?.id;
      await Promise.all([
        logExecution({
          emailId,
          subject: r.event?.data?.subject,
          from: r.event?.data?.from,
          eventType,
          actions,
          results: r.results ?? [],
          success: r.success,
        }),
        syncAfterExecution(emailId, r.results ?? []),
      ]);
    }));

    onProgress?.({ phase: "done", result });
    return result;
  } catch (error) {
    onProgress?.({ phase: "error", error: error.message });
    return { success: false, error, message: error.message || "Unknown error", total: events.length, successful: 0, failed: events.length };
  }
}

/**
 * Get available actions for a given event source.
 *
 * @param {string} source - Event source (e.g., "gmail")
 * @returns {Object[]} - Array of available action handlers
 */
export function getAvailableActions(source) {
  return pluginRegistry.getAvailableActions(source);
}

/**
 * Check if user is authenticated (has a valid access token).
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  const tokenData = await getSavedToken();
  return !!tokenData?.access_token;
}

/**
 * Get required OAuth scopes for an action.
 * @param {string} actionId
 * @param {string} source
 * @returns {string[]}
 */
export function getRequiredScopes(actionId, source) {
  return pluginRegistry.getRequiredScopes(actionId, source);
}

// Re-export for UI convenience
export { EVENT_GROUPS };
