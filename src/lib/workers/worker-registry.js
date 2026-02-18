/**
 * Worker Registry
 * 
 * Central registry for all workers. Routes action execution to the
 * appropriate worker based on the event source (gmail, slack, etc.)
 */

import { gmailWorker } from "./gmail-worker.js";

/**
 * @typedef {import('./base-worker.js').WorkerContext} WorkerContext
 * @typedef {import('./base-worker.js').WorkerResult} WorkerResult
 * @typedef {import('./base-worker.js').ActionHandler} ActionHandler
 */

/**
 * Worker Registry manages all registered workers and routes actions.
 */
class WorkerRegistry {
  constructor() {
    /** @type {Map<string, import('./base-worker.js').BaseWorker>} */
    this.workers = new Map();
    this.registerDefaultWorkers();
  }

  /**
   * Register default workers.
   */
  registerDefaultWorkers() {
    this.registerWorker(gmailWorker);
  }

  /**
   * Register a worker.
   * @param {import('./base-worker.js').BaseWorker} worker
   */
  registerWorker(worker) {
    this.workers.set(worker.workerId, worker);
  }

  /**
   * Get a worker by ID.
   * @param {string} workerId
   * @returns {import('./base-worker.js').BaseWorker|undefined}
   */
  getWorker(workerId) {
    return this.workers.get(workerId);
  }

  /**
   * Get all registered workers.
   * @returns {import('./base-worker.js').BaseWorker[]}
   */
  getAllWorkers() {
    return Array.from(this.workers.values());
  }

  /**
   * Execute a single action.
   * Routes to the appropriate worker based on event source.
   * 
   * @param {string} actionId - The action to execute (e.g., "mark_read")
   * @param {WorkerContext} context - Execution context with event, token, etc.
   * @returns {Promise<WorkerResult>}
   */
  async executeAction(actionId, context) {
    // Determine worker from event source
    const workerId = this.resolveWorkerId(context.event.source);
    const worker = this.getWorker(workerId);

    if (!worker) {
      return {
        success: false,
        message: `No worker found for source: ${context.event.source}`,
        error: new Error(`Worker not found: ${workerId}`),
      };
    }

    if (!worker.canExecute(actionId)) {
      return {
        success: false,
        message: `Action "${actionId}" not supported by ${worker.serviceName}`,
        error: new Error(`Action not supported: ${actionId}`),
      };
    }

    return worker.execute(actionId, context);
  }

  /**
   * Execute an action pipeline (sequence of actions) for a single event.
   * 
   * @param {Object[]} actions - Array of actions from the pipeline
   * @param {WorkerContext} context - Execution context
   * @returns {Promise<Object>} - Results for all actions
   */
  async executePipeline(actions, context) {
    const results = [];
    let allSuccess = true;

    for (const action of actions) {
      context.onProgress?.({
        phase: "action_start",
        actionId: action.id,
        actionName: action.name,
      });

      const result = await this.executeAction(action.id, context);
      results.push({
        actionId: action.id,
        actionName: action.name,
        ...result,
      });

      if (!result.success) {
        allSuccess = false;
        // Continue executing remaining actions even if one fails
        // (user may want to see all results)
      }

      context.onProgress?.({
        phase: "action_complete",
        actionId: action.id,
        actionName: action.name,
        result,
      });
    }

    return {
      success: allSuccess,
      results,
      message: allSuccess
        ? `All ${results.length} actions completed successfully`
        : `Pipeline completed with ${results.filter(r => !r.success).length} failure(s)`,
    };
  }

  /**
   * Execute a pipeline for multiple events (batch execution).
   * 
   * @param {Object[]} actions - Array of actions from the pipeline
   * @param {Object[]} events - Array of events to process
   * @param {Object} baseContext - Base context (accessToken, onProgress, etc.)
   * @returns {Promise<Object>} - Batch results
   */
  async executePipelineBatch(actions, events, baseContext) {
    const results = [];

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      
      baseContext.onProgress?.({
        phase: "batch_event_start",
        eventIndex: i,
        totalEvents: events.length,
        event,
      });

      const context = { ...baseContext, event };
      const result = await this.executePipeline(actions, context);
      
      results.push({
        event,
        ...result,
      });

      baseContext.onProgress?.({
        phase: "batch_event_complete",
        eventIndex: i,
        totalEvents: events.length,
        event,
        result,
      });
    }

    const allSuccess = results.every(r => r.success);

    return {
      success: allSuccess,
      results,
      total: events.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      message: `Processed ${events.length} event(s): ${results.filter(r => r.success).length} successful, ${results.filter(r => !r.success).length} failed`,
    };
  }

  /**
   * Resolve worker ID from event source.
   * Maps event sources (gmail, slack, etc.) to worker IDs.
   * 
   * @param {string} source - Event source (e.g., "gmail")
   * @returns {string} - Worker ID
   */
  resolveWorkerId(source) {
    // Direct mapping for now. Can be extended for more complex routing.
    const mapping = {
      gmail: "gmail",
      // Add more mappings as we add workers:
      // slack: "slack",
      // telegram: "telegram",
    };

    return mapping[source] || source;
  }

  /**
   * Get all available actions for a given event source.
   * Useful for building UIs that show what actions are available.
   * 
   * @param {string} source - Event source (e.g., "gmail")
   * @returns {ActionHandler[]}
   */
  getAvailableActions(source) {
    const workerId = this.resolveWorkerId(source);
    const worker = this.getWorker(workerId);
    return worker ? worker.getHandlers() : [];
  }

  /**
   * Get required OAuth scopes for an action.
   * 
   * @param {string} actionId - Action ID
   * @param {string} source - Event source
   * @returns {string[]}
   */
  getRequiredScopes(actionId, source) {
    const workerId = this.resolveWorkerId(source);
    const worker = this.getWorker(workerId);
    return worker ? worker.getRequiredScopes(actionId) : [];
  }
}

// Export singleton instance
export const workerRegistry = new WorkerRegistry();
