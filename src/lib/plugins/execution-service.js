/**
 * Execution Service
 *
 * High-level service for executing action pipelines.
 * Handles authentication, progress tracking, result formatting,
 * and group-based execution policies (NOISE / INFO / CRITICAL).
 */

import { pluginRegistry } from "./plugin-registry.js";
import { getActionsForEvent, getExecutionPolicy, EVENT_GROUPS } from "../events.js";
import { getSavedToken } from "../google-auth.js";

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

    const policy = await getExecutionPolicy(event.type);
    onProgress?.({ phase: "policy_check", group: policy.group, policy });

    if (policy.requiresApproval && !approved) {
      const actions = await getActionsForEvent(event.type);
      return {
        success: false,
        requiresApproval: true,
        group: policy.group,
        actions,
        message: `This event type is CRITICAL — review the actions below and confirm before executing.`,
      };
    }

    const tokenData = await getSavedToken();
    if (!tokenData?.access_token) {
      throw new Error("Not authenticated. Please sign in to Gmail first.");
    }
    const accessToken = tokenData.access_token;

    const actions = await getActionsForEvent(event.type);
    if (!actions || actions.length === 0) {
      return { success: true, message: `No actions defined for event type: ${event.type}`, results: [] };
    }

    onProgress?.({ phase: "pipeline_loaded", actions, actionCount: actions.length });

    const context = { accessToken, event, onProgress };
    const result = await pluginRegistry.executePipeline(actions, context);

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

    const policy = await getExecutionPolicy(eventType);
    if (policy.requiresApproval && !approved) {
      const actions = await getActionsForEvent(eventType);
      return {
        success: false,
        requiresApproval: true,
        group: policy.group,
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

    const actions = await getActionsForEvent(eventType);
    if (!actions || actions.length === 0) {
      return { success: true, message: `No actions defined for event type: ${eventType}`, results: [], total: 0, successful: 0, failed: 0 };
    }

    onProgress?.({ phase: "pipeline_loaded", actions, actionCount: actions.length });

    const eventObjects = events.map((email) => ({ type: eventType, source: "gmail", data: email }));
    const baseContext = { accessToken, onProgress };

    const result = await pluginRegistry.executePipelineBatch(actions, eventObjects, baseContext);

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
