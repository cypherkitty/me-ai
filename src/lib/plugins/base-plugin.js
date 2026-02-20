/**
 * Base Plugin Interface
 *
 * Plugins are modules that execute actions on external services.
 * Each plugin implements specific operations for a service (Gmail, Slack, etc.)
 * and registers those operations with action IDs.
 *
 * Not to be confused with browser Web Workers — these run synchronously in the
 * main thread and call external APIs directly.
 */

/**
 * @typedef {Object} PluginContext
 * @property {string} accessToken - OAuth access token for the service
 * @property {Object} event - The event that triggered this action
 * @property {Object} event.data - The event's data (e.g., email object)
 * @property {string} event.type - The event type (e.g., "PAY_BILL")
 * @property {string} event.source - The event source (e.g., "gmail")
 * @property {Function} [onProgress] - Optional callback for progress updates
 * @property {Object} [config] - Additional plugin-specific configuration
 */

/**
 * @typedef {Object} PluginResult
 * @property {boolean} success - Whether the operation succeeded
 * @property {string} [message] - Human-readable result message
 * @property {Object} [data] - Operation result data
 * @property {Error} [error] - Error object if operation failed
 */

/**
 * @typedef {Object} ActionHandler
 * @property {string} actionId - Unique identifier for this action
 * @property {string} name - Human-readable name
 * @property {string} description - What this action does
 * @property {Function} execute - Function that executes the action
 * @property {string[]} [requiredScopes] - OAuth scopes required
 * @property {string[]} [requiredPermissions] - Permissions required
 */

/**
 * Base Plugin class.
 * All plugins should extend this class.
 */
export class BasePlugin {
  /**
   * @param {string} pluginId - Unique identifier for this plugin (e.g. "gmail")
   * @param {string} serviceName - Human-readable service name (e.g., "Gmail")
   */
  constructor(pluginId, serviceName) {
    this.pluginId = pluginId;
    this.serviceName = serviceName;
    /** @type {Map<string, ActionHandler>} */
    this.handlers = new Map();
  }

  /**
   * Register an action handler.
   * @param {ActionHandler} handler
   */
  registerHandler(handler) {
    this.handlers.set(handler.actionId, handler);
  }

  /**
   * Get all registered action handlers.
   * @returns {ActionHandler[]}
   */
  getHandlers() {
    return Array.from(this.handlers.values());
  }

  /**
   * Execute an action by ID.
   * @param {string} actionId
   * @param {PluginContext} context
   * @returns {Promise<PluginResult>}
   */
  async execute(actionId, context) {
    const handler = this.handlers.get(actionId);
    if (!handler) {
      return {
        success: false,
        error: new Error(`Unknown action: ${actionId}`),
        message: `Action "${actionId}" not found in ${this.serviceName} plugin`,
      };
    }

    try {
      context.onProgress?.({
        phase: "executing",
        actionId,
        actionName: handler.name,
      });

      const result = await handler.execute(context);

      context.onProgress?.({
        phase: "completed",
        actionId,
        actionName: handler.name,
        result,
      });

      return result;
    } catch (error) {
      const result = {
        success: false,
        error,
        message: error.message || "Unknown error",
      };

      context.onProgress?.({
        phase: "failed",
        actionId,
        actionName: handler.name,
        error: error.message,
      });

      return result;
    }
  }

  /**
   * Check if this plugin can execute a given action.
   * @param {string} actionId
   * @returns {boolean}
   */
  canExecute(actionId) {
    return this.handlers.has(actionId);
  }

  /**
   * Get required OAuth scopes for an action.
   * @param {string} actionId
   * @returns {string[]}
   */
  getRequiredScopes(actionId) {
    const handler = this.handlers.get(actionId);
    return handler?.requiredScopes || [];
  }
}
