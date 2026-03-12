/**
 * Base Plugin Interface
 *
 * Plugins are modules that execute actions on external services.
 * Each plugin implements specific operations for a service (Gmail, Slack, etc.)
 * and registers those operations with action IDs.
 */

import type { PluginContext, PluginResult, ActionHandler } from "$lib/types";

export class BasePlugin {
  pluginId: string;
  serviceName: string;
  handlers: Map<string, ActionHandler>;

  constructor(pluginId: string, serviceName: string) {
    this.pluginId = pluginId;
    this.serviceName = serviceName;
    this.handlers = new Map();
  }

  registerHandler(handler: ActionHandler): void {
    this.handlers.set(handler.actionId, handler);
  }

  getHandlers(): ActionHandler[] {
    return Array.from(this.handlers.values());
  }

  async execute(
    actionId: string,
    context: PluginContext
  ): Promise<PluginResult> {
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
      const err = error as Error;
      const result: PluginResult = {
        success: false,
        error: err,
        message: err.message || "Unknown error",
      };

      context.onProgress?.({
        phase: "failed",
        actionId,
        actionName: handler.name,
        error: err.message,
      });

      return result;
    }
  }

  canExecute(actionId: string): boolean {
    return this.handlers.has(actionId);
  }

  getRequiredScopes(actionId: string): string[] {
    const handler = this.handlers.get(actionId);
    return handler?.requiredScopes ?? [];
  }
}
