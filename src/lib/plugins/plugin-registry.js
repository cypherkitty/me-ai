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
   * Execute a single action step.
   *
   * The action object must carry explicit plugin/command references:
   *   { pluginId: "gmail", commandId: "trash", ... }
   *
   * Legacy fallback: if pluginId is absent, the plugin is resolved from
   * context.event.source so that old stored pipelines still execute.
   *
   * @param {import('./base-plugin.js').Action|string} action
   *   Full action object (preferred) or bare action ID string (legacy).
   * @param {PluginContext} context
   * @returns {Promise<PluginResult>}
   */
  async executeAction(action, context) {
    // Normalise: accept both a plain string (legacy) and a full Action object
    const actionObj = typeof action === "string"
      ? { id: action, commandId: action, pluginId: null }
      : action;

    const pluginId = actionObj.pluginId || this.resolvePluginId(context.event.source);
    const commandId = actionObj.commandId || actionObj.id;
    const plugin = this.getPlugin(pluginId);

    if (!plugin) {
      return {
        success: false,
        message: `Plugin "${pluginId}" not found. Is it registered?`,
        error: new Error(`Plugin not found: ${pluginId}`),
      };
    }

    if (!plugin.canExecute(commandId)) {
      return {
        success: false,
        message: `Command "${commandId}" not found in plugin "${plugin.serviceName}". ` +
          `Available: ${plugin.getHandlers().map(h => h.actionId).join(", ")}`,
        error: new Error(`Command not supported: ${commandId}`),
      };
    }

    return plugin.execute(commandId, context);
  }

  /**
   * Execute an action pipeline (sequence of actions) for a single event.
   *
   * @param {Object[]} actions - Array of Action objects from the pipeline
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
        pluginId: action.pluginId,
        commandId: action.commandId,
      });

      // Pass the full action object so executeAction can use pluginId/commandId
      const result = await this.executeAction(action, context);
      results.push({
        actionId: action.id,
        actionName: action.name,
        pluginId: action.pluginId,
        commandId: action.commandId,
        ...result,
      });

      if (!result.success) allSuccess = false;

      context.onProgress?.({
        phase: "action_complete",
        actionId: action.id,
        actionName: action.name,
        result,
      });
    }

    const failedResults = results.filter(r => !r.success);
    const failureMessages = failedResults.map(r => `${r.pluginId}·${r.commandId}: ${r.message || r.error?.message || "Unknown error"}`).join('; ');
    const successMessages = results.filter(r => r.success).map(r => `${r.pluginId}·${r.commandId}`).join(', ');

    return {
      success: allSuccess,
      results,
      message: allSuccess
        ? `Successfully executed: ${successMessages}`
        : `Pipeline failed: ${failureMessages}`,
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
