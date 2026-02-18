/**
 * Execution Service
 * 
 * High-level service for executing action pipelines.
 * Handles authentication, progress tracking, and result formatting.
 */

import { workerRegistry } from "./worker-registry.js";
import { getActionsForEvent } from "../events.js";

/**
 * @typedef {Object} ExecutionProgress
 * @property {string} phase - Current phase (e.g., "starting", "action_start", "action_complete", "done", "error")
 * @property {string} [actionId] - Current action ID
 * @property {string} [actionName] - Current action name
 * @property {Object} [result] - Action result
 * @property {string} [error] - Error message if failed
 * @property {number} [eventIndex] - Current event index (for batch)
 * @property {number} [totalEvents] - Total events (for batch)
 */

/**
 * Execute an action pipeline for a single event.
 * 
 * @param {Object} event - The event to process (must have type, source, data)
 * @param {Function} [onProgress] - Progress callback
 * @returns {Promise<Object>} - Execution result
 */
export async function executePipeline(event, onProgress) {
  try {
    onProgress?.({ phase: "starting", event });

    // Get access token from sessionStorage (set during Google OAuth)
    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("Not authenticated. Please sign in to Gmail first.");
    }

    // Get the action pipeline for this event type
    const actions = getActionsForEvent(event.type);
    if (!actions || actions.length === 0) {
      return {
        success: true,
        message: `No actions defined for event type: ${event.type}`,
        results: [],
      };
    }

    onProgress?.({
      phase: "pipeline_loaded",
      actions,
      actionCount: actions.length,
    });

    // Execute the pipeline
    const context = {
      accessToken,
      event,
      onProgress,
    };

    const result = await workerRegistry.executePipeline(actions, context);

    onProgress?.({ phase: "done", result });

    return result;
  } catch (error) {
    const errorResult = {
      success: false,
      error,
      message: error.message || "Unknown error",
    };

    onProgress?.({ phase: "error", error: error.message });

    return errorResult;
  }
}

/**
 * Execute an action pipeline for multiple events (batch).
 * 
 * @param {string} eventType - Event type (e.g., "PAY_BILL")
 * @param {Object[]} events - Array of events to process
 * @param {Function} [onProgress] - Progress callback
 * @returns {Promise<Object>} - Batch execution result
 */
export async function executePipelineBatch(eventType, events, onProgress) {
  try {
    onProgress?.({
      phase: "starting",
      eventType,
      eventCount: events.length,
    });

    // Get access token
    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("Not authenticated. Please sign in to Gmail first.");
    }

    // Get the action pipeline for this event type
    const actions = getActionsForEvent(eventType);
    if (!actions || actions.length === 0) {
      return {
        success: true,
        message: `No actions defined for event type: ${eventType}`,
        results: [],
        total: 0,
        successful: 0,
        failed: 0,
      };
    }

    onProgress?.({
      phase: "pipeline_loaded",
      actions,
      actionCount: actions.length,
    });

    // Convert emails to events format
    const eventObjects = events.map((email) => ({
      type: eventType,
      source: "gmail",
      data: email,
    }));

    // Execute batch
    const baseContext = {
      accessToken,
      onProgress,
    };

    const result = await workerRegistry.executePipelineBatch(
      actions,
      eventObjects,
      baseContext
    );

    onProgress?.({ phase: "done", result });

    return result;
  } catch (error) {
    const errorResult = {
      success: false,
      error,
      message: error.message || "Unknown error",
      total: events.length,
      successful: 0,
      failed: events.length,
    };

    onProgress?.({ phase: "error", error: error.message });

    return errorResult;
  }
}

/**
 * Get available actions for a given event source.
 * Useful for showing users what actions their worker can perform.
 * 
 * @param {string} source - Event source (e.g., "gmail")
 * @returns {Object[]} - Array of available action handlers
 */
export function getAvailableActions(source) {
  return workerRegistry.getAvailableActions(source);
}

/**
 * Check if user is authenticated (has access token).
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!sessionStorage.getItem("access_token");
}

/**
 * Get required OAuth scopes for an action.
 * @param {string} actionId
 * @param {string} source
 * @returns {string[]}
 */
export function getRequiredScopes(actionId, source) {
  return workerRegistry.getRequiredScopes(actionId, source);
}
