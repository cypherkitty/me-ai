/**
 * Plugin Registry
 *
 * Central registry for all plugins. Routes action execution to the
 * appropriate plugin based on the event source (gmail, slack, etc.)
 */

import { gmailPlugin } from "./gmail-plugin.js";

/**
 * @typedef {import('./base-plugin.js').PluginContext} PluginContext
 * @typedef {import('./base-plugin.js').PluginResult} PluginResult
 * @typedef {import('./base-plugin.js').ActionHandler} ActionHandler
 */

/**
 * Plugin Registry manages all registered plugins and routes actions.
 */
class PluginRegistry {
  constructor() {
    /** @type {Map<string, import('./base-plugin.js').BasePlugin>} */
    this.plugins = new Map();
    this.registerDefaultPlugins();
  }

  /**
   * Register default built-in plugins.
   */
  registerDefaultPlugins() {
    this.registerPlugin(gmailPlugin);
  }

  /**
   * Register a plugin.
   * @param {import('./base-plugin.js').BasePlugin} plugin
   */
  registerPlugin(plugin) {
    this.plugins.set(plugin.pluginId, plugin);
  }

  /**
   * Get a plugin by ID.
   * @param {string} pluginId
   * @returns {import('./base-plugin.js').BasePlugin|undefined}
   */
  getPlugin(pluginId) {
    return this.plugins.get(pluginId);
  }

  /**
   * Get all registered plugins.
   * @returns {import('./base-plugin.js').BasePlugin[]}
   */
  getAllPlugins() {
    return Array.from(this.plugins.values());
  }

  /**
   * Execute a single action.
   * Routes to the appropriate plugin based on event source.
   *
   * @param {string} actionId - The action to execute (e.g., "mark_read")
   * @param {PluginContext} context - Execution context with event, token, etc.
   * @returns {Promise<PluginResult>}
   */
  async executeAction(actionId, context) {
    const pluginId = this.resolvePluginId(context.event.source);
    const plugin = this.getPlugin(pluginId);

    if (!plugin) {
      return {
        success: false,
        message: `No plugin found for source: ${context.event.source}`,
        error: new Error(`Plugin not found: ${pluginId}`),
      };
    }

    if (!plugin.canExecute(actionId)) {
      return {
        success: false,
        message: `Action "${actionId}" not supported by ${plugin.serviceName}`,
        error: new Error(`Action not supported: ${actionId}`),
      };
    }

    return plugin.execute(actionId, context);
  }

  /**
   * Execute an action pipeline (sequence of actions) for a single event.
   *
   * @param {Object[]} actions - Array of actions from the pipeline
   * @param {PluginContext} context - Execution context
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
      results.push({ actionId: action.id, actionName: action.name, ...result });

      if (!result.success) allSuccess = false;

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
      results.push({ event, ...result });

      baseContext.onProgress?.({
        phase: "batch_event_complete",
        eventIndex: i,
        totalEvents: events.length,
        event,
        result,
      });
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return {
      success: failed === 0,
      results,
      total: events.length,
      successful,
      failed,
      message: `Processed ${events.length} event(s): ${successful} successful, ${failed} failed`,
    };
  }

  /**
   * Resolve plugin ID from event source.
   * Maps event sources (gmail, slack, etc.) to plugin IDs.
   *
   * @param {string} source - Event source (e.g., "gmail")
   * @returns {string} - Plugin ID
   */
  resolvePluginId(source) {
    const mapping = {
      gmail: "gmail",
      // Add more as plugins are added:
      // slack: "slack",
      // telegram: "telegram",
    };
    return mapping[source] || source;
  }

  /**
   * Get all available actions for a given event source.
   *
   * @param {string} source - Event source (e.g., "gmail")
   * @returns {ActionHandler[]}
   */
  getAvailableActions(source) {
    const pluginId = this.resolvePluginId(source);
    const plugin = this.getPlugin(pluginId);
    return plugin ? plugin.getHandlers() : [];
  }

  /**
   * Get required OAuth scopes for an action.
   *
   * @param {string} actionId - Action ID
   * @param {string} source - Event source
   * @returns {string[]}
   */
  getRequiredScopes(actionId, source) {
    const pluginId = this.resolvePluginId(source);
    const plugin = this.getPlugin(pluginId);
    return plugin ? plugin.getRequiredScopes(actionId) : [];
  }
}

// Export singleton instance
export const pluginRegistry = new PluginRegistry();
