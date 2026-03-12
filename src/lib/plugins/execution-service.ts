/**
 * Execution Service
 *
 * High-level service for executing action pipelines.
 * Handles authentication, progress tracking, result formatting,
 * and category-based execution policies (NOISE / INFO / CRITICAL).
 */

import { pluginRegistry } from "./plugin-registry.js";
import { findMatchingRules, getPipelineForEvent } from "../rules.js";
import { EVENT_CATEGORY_TIERS } from "../events.js";
import { getSavedToken } from "../google-auth.js";
import { logExecution, syncAfterExecution } from "../store/audit.js";
import type { EmailEvent, ExecutionProgress, ActionExecutionResult } from "$lib/types";
import type { Rule, Action } from "$lib/types";

interface RawAction {
  id?: string;
  pluginId?: string;
  commandId?: string;
  name?: string;
}

function normaliseActions(
  rawActions: RawAction[] | undefined
): Array<{ id: string; pluginId: string; commandId: string; name: string }> {
  if (!rawActions?.length) return [];
  return rawActions.map((a, i) => ({
    id: (a.commandId || a.id) + "_" + i,
    pluginId: a.pluginId ?? "gmail",
    commandId: a.commandId ?? (a.id ?? ""),
    name: (a.name ?? a.commandId ?? "").replace(/_/g, " ") || "",
  }));
}

export interface ExecutePipelineOptions {
  actionsOverride?: Array<{ pluginId: string; commandId: string }>;
}

export async function executePipeline(
  event: EmailEvent,
  onProgress?: (p: ExecutionProgress) => void,
  approved: boolean = false,
  options: ExecutePipelineOptions = {}
): Promise<{
  success: boolean;
  message?: string;
  requiresApproval?: boolean;
  category?: string;
  actions?: unknown[];
  results?: unknown[];
  error?: unknown;
}> {
  try {
    onProgress?.({ phase: "starting", event });

    const { actionsOverride } = options;
    let category: string = "INFO";
    let requiresApproval = false;
    let actions: Array<{ id: string; pluginId: string; commandId: string; name: string }> = [];
    let policy = "";
    let rule: Rule | undefined;

    if (actionsOverride?.length) {
      actions = normaliseActions(actionsOverride);
      policy = "manual";
      requiresApproval = true;
      category = "CRITICAL";
    } else {
      const rawCategory =
        (event.metadata as Record<string, unknown>)?.category ||
        (event.data as Record<string, unknown>)?.category ||
        "";
      const categoryName = (rawCategory || "").toString().toLowerCase().trim();
      const rules = await findMatchingRules(event.type, categoryName);
      rule = rules[0];

      if (rule) {
        policy = rule.policy ?? "";
        if (policy === "manual") {
          requiresApproval = true;
          category = "CRITICAL";
        } else if (policy === "auto") {
          category = "NOISE";
        } else {
          category = "INFO";
        }
        actions = (rule.actions || []).map((a, i) => ({
          id: (a.commandId || a.id) + "_" + i,
          pluginId: a.pluginId ?? "gmail",
          commandId: a.commandId ?? a.id,
          name: (a.name ?? a.commandId ?? "").replace(/_/g, " ") || "",
        }));
      }

      if (!actions?.length) {
        const pipeline = await getPipelineForEvent(event.type);
        if (pipeline?.actions?.length) {
          policy = pipeline.policy ?? "manual";
          if (policy === "manual") {
            requiresApproval = true;
            category = "CRITICAL";
          } else if (policy === "auto") {
            category = "NOISE";
          } else {
            category = "INFO";
          }
          actions = normaliseActions(pipeline.actions);
        }
      }
    }

    if (!actions?.length) {
      return {
        success: true,
        message: rule
          ? `No actions defined for rule: ${rule.name}`
          : `No enabled pipeline rule or category pipeline matches event type: ${event.type}`,
        results: [],
      };
    }

    onProgress?.({ phase: "policy_check", category, policy } as ExecutionProgress);

    if (requiresApproval && !approved) {
      return {
        success: false,
        requiresApproval: true,
        category,
        actions,
        message: `This event type is CRITICAL — review the actions below and confirm before executing.`,
      };
    }

    const tokenData = await getSavedToken();
    if (!tokenData?.access_token) {
      throw new Error("Not authenticated. Please sign in to Gmail first.");
    }
    const accessToken = tokenData.access_token as string;

    onProgress?.({ phase: "pipeline_loaded", actions, actionCount: actions.length } as ExecutionProgress);

    const context = { accessToken, event, onProgress };
    const result = await pluginRegistry.executePipeline(actions, context);

    const eventData = event.data as Record<string, unknown>;
    const emailId = (eventData?.emailId ?? eventData?.id) as string | undefined;
    await Promise.all([
      logExecution({
        emailId: emailId ?? "",
        subject: eventData?.subject as string | undefined,
        from: eventData?.from as string | undefined,
        eventType: event.type,
        actions,
        results: (result.results ?? []) as ActionExecutionResult[],
        success: result.success,
      }),
      syncAfterExecution(emailId ?? "", (result.results ?? []) as ActionExecutionResult[]),
    ]);

    onProgress?.({ phase: "done", result } as ExecutionProgress);
    return result;
  } catch (error) {
    const err = error as Error;
    onProgress?.({ phase: "error", error: err.message } as ExecutionProgress);
    return {
      success: false,
      error,
      message: err.message || "Unknown error",
    };
  }
}

export async function executePipelineBatch(
  eventType: string,
  events: Array<Record<string, unknown>>,
  onProgress?: (p: ExecutionProgress) => void,
  approved: boolean = false
): Promise<{
  success: boolean;
  message?: string;
  requiresApproval?: boolean;
  category?: string;
  actions?: Action[];
  results?: unknown[];
  total?: number;
  successful?: number;
  failed?: number;
  error?: unknown;
}> {
  try {
    onProgress?.({ phase: "starting", eventType, eventCount: events.length } as ExecutionProgress);

    const rawCategory =
      (events[0] as Record<string, unknown>)?.metadata ||
      (events[0] as Record<string, unknown>)?.category ||
      "";
    const sampleCategory = (rawCategory || "").toString().toLowerCase().trim();
    const rules = await findMatchingRules(eventType, sampleCategory);
    const rule = rules[0];

    let category: string = "INFO";
    let requiresApproval = false;
    let actions: Action[] = [];

    if (rule) {
      if (rule.policy === "manual") {
        requiresApproval = true;
        category = "CRITICAL";
      } else if (rule.policy === "auto") {
        category = "NOISE";
      } else {
        category = "INFO";
      }
      actions = rule.actions || [];
    } else {
      return {
        success: true,
        message: `No enabled pipeline rule matches event type: ${eventType}`,
        results: [],
        total: 0,
        successful: 0,
        failed: 0,
      };
    }

    if (requiresApproval && !approved) {
      return {
        success: false,
        requiresApproval: true,
        category,
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
    const accessToken = tokenData.access_token as string;

    if (!actions?.length) {
      return {
        success: true,
        message: `No actions defined for rule: ${rule.name}`,
        results: [],
        total: 0,
        successful: 0,
        failed: 0,
      };
    }

    onProgress?.({ phase: "pipeline_loaded", actions, actionCount: actions.length } as ExecutionProgress);

    const eventObjects = events.map((email) => ({
      type: eventType,
      source: "gmail",
      data: email,
    })) as EmailEvent[];
    const baseContext = { accessToken, onProgress };

    const result = await pluginRegistry.executePipelineBatch(
      actions,
      eventObjects,
      baseContext
    );

    const resultsList = (result.results ?? []) as Array<{
      event?: EmailEvent;
      results?: unknown[];
      success?: boolean;
    }>;
    await Promise.all(
      resultsList.map(        async (r) => {
        const eventData = r.event?.data as Record<string, unknown>;
        const emailId = (eventData?.emailId ?? eventData?.id) as string | undefined;
        await Promise.all([
          logExecution({
            emailId: emailId ?? "",
            subject: eventData?.subject as string | undefined,
            from: eventData?.from as string | undefined,
            eventType,
            actions,
            results: (r.results ?? []) as ActionExecutionResult[],
            success: r.success ?? false,
          }),
          syncAfterExecution(emailId ?? "", (r.results ?? []) as ActionExecutionResult[]),
        ]);
      })
    );

    onProgress?.({ phase: "done", result } as ExecutionProgress);
    return result;
  } catch (error) {
    const err = error as Error;
    onProgress?.({ phase: "error", error: err.message } as ExecutionProgress);
    return {
      success: false,
      error,
      message: err.message || "Unknown error",
      total: events.length,
      successful: 0,
      failed: events.length,
    };
  }
}

export function getAvailableActions(source: string): unknown[] {
  return pluginRegistry.getAvailableActions(source);
}

export async function isAuthenticated(): Promise<boolean> {
  const tokenData = await getSavedToken();
  return !!tokenData?.access_token;
}

export function getRequiredScopes(actionId: string, source: string): string[] {
  return pluginRegistry.getRequiredScopes(actionId, source);
}

export { EVENT_CATEGORY_TIERS };
