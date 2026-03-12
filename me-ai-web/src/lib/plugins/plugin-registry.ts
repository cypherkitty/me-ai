/**
 * Plugin Registry
 *
 * Central registry for all plugins. Routes action execution to the
 * appropriate plugin based on the event source (gmail, slack, etc.)
 */

import { BasePlugin } from "./base-plugin.js";
import { gmailPlugin } from "./gmail-plugin.js";
import { twitterPlugin } from "./twitter-plugin.js";
import type { PluginContext, PluginResult } from "$lib/types";
import type { Action } from "$lib/types";

interface ActionLike {
  id: string;
  pluginId?: string;
  commandId?: string;
  name?: string;
}

class PluginRegistry {
  private plugins = new Map<string, BasePlugin>();

  constructor() {
    this.registerDefaultPlugins();
  }

  private registerDefaultPlugins(): void {
    this.registerPlugin(gmailPlugin);
    this.registerPlugin(twitterPlugin);
  }

  registerPlugin(plugin: BasePlugin): void {
    this.plugins.set(plugin.pluginId, plugin);
  }

  getPlugin(pluginId: string): BasePlugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAllPlugins(): BasePlugin[] {
    return Array.from(this.plugins.values());
  }

  async executeAction(
    action: string | ActionLike,
    context: PluginContext
  ): Promise<PluginResult> {
    const actionObj: ActionLike =
      typeof action === "string"
        ? { id: action, commandId: action, pluginId: undefined }
        : action;

    const pluginId =
      actionObj.pluginId || this.resolvePluginId(context.event.source);
    let commandId = (actionObj.commandId || actionObj.id) as string;

    if (pluginId && commandId.startsWith(`${pluginId}:`)) {
      commandId = commandId.slice(pluginId.length + 1);
    }

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
        message:
          `Command "${commandId}" not found in plugin "${plugin.serviceName}". ` +
          `Available: ${plugin.getHandlers().map((h) => h.actionId).join(", ")}`,
        error: new Error(`Command not supported: ${commandId}`),
      };
    }

    return plugin.execute(commandId, context);
  }

  async executePipeline(
    actions: ActionLike[],
    context: PluginContext
  ): Promise<{
    success: boolean;
    results: unknown[];
    message: string;
  }> {
    const results: unknown[] = [];
    let allSuccess = true;

    for (const action of actions) {
      context.onProgress?.({
        phase: "action_start",
        actionId: action.id,
        actionName: action.name,
        pluginId: action.pluginId,
        commandId: action.commandId,
      });

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

    const failedResults = results.filter(
      (r) => !(r as { success?: boolean }).success
    );
    const failureMessages = failedResults
      .map(
        (r) =>
          `${(r as Record<string, unknown>).pluginId}·${(r as Record<string, unknown>).commandId}: ${(r as Record<string, unknown>).message || (r as { error?: Error }).error?.message || "Unknown error"}`
      )
      .join("; ");
    const successMessages = results
      .filter((r) => (r as { success?: boolean }).success)
      .map((r) => `${(r as Record<string, unknown>).pluginId}·${(r as Record<string, unknown>).commandId}`)
      .join(", ");

    return {
      success: allSuccess,
      results,
      message: allSuccess
        ? `Successfully executed: ${successMessages}`
        : `Pipeline failed: ${failureMessages}`,
    };
  }

  async executePipelineBatch(
    actions: Action[],
    events: { type: string; source: string; data: Record<string, unknown> }[],
    baseContext: Omit<PluginContext, "event">
  ): Promise<{
    success: boolean;
    results: unknown[];
    total: number;
    successful: number;
    failed: number;
    message: string;
  }> {
    const results: unknown[] = [];

    for (let i = 0; i < events.length; i++) {
      const event = events[i];

      baseContext.onProgress?.({
        phase: "batch_event_start",
        eventIndex: i,
        totalEvents: events.length,
        event: event as PluginContext["event"],
      });

      const context = { ...baseContext, event };
      const result = await this.executePipeline(
        actions.map((a) => ({
          id: a.id,
          pluginId: a.pluginId,
          commandId: a.commandId,
          name: a.name,
        })),
        context
      );
      results.push({ event, ...result });

      baseContext.onProgress?.({
        phase: "batch_event_complete",
        eventIndex: i,
        totalEvents: events.length,
        event: event as PluginContext["event"],
        result,
      });
    }

    const successful = results.filter(
      (r) => (r as { success?: boolean }).success
    ).length;
    const failed = results.length - successful;

    return {
      success: failed === 0,
      results,
      total: events.length,
      successful,
      failed,
      message: `Processed ${events.length} event(s): ${successful} successful, ${failed} failed`,
    };
  }

  resolvePluginId(source: string): string {
    const mapping: Record<string, string> = {
      gmail: "gmail",
      twitter: "twitter",
    };
    return mapping[source] || source;
  }

  getAvailableActions(source: string): import("$lib/types").ActionHandler[] {
    const pluginId = this.resolvePluginId(source);
    const plugin = this.getPlugin(pluginId);
    return plugin ? plugin.getHandlers() : [];
  }

  getRequiredScopes(actionId: string, source: string): string[] {
    const pluginId = this.resolvePluginId(source);
    const plugin = this.getPlugin(pluginId);
    return plugin ? plugin.getRequiredScopes(actionId) : [];
  }
}

export const pluginRegistry = new PluginRegistry();
