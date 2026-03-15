/**
 * Execution Service
 *
 * High-level service for executing action pipelines.
 * Handles authentication, progress tracking, result formatting,
 * and category-based execution policies (NOISE / INFO / CRITICAL).
 * Splits pipelines: core (gmail, twitter) runs in WASM; filesystem runs in web.
 */

import {
  getAvailableActions as coreGetAvailableActions,
  getRequiredScopes as coreGetRequiredScopes,
  executePipeline as coreExecutePipeline,
} from "../core.js";
import { findMatchingRules, getPipelineForEvent } from "../rules.js";
import { EVENT_CATEGORY_TIERS } from "../events.js";
import { getSavedToken } from "../google-auth.js";
import { logExecution, syncAfterExecution } from "../store/audit.js";
import { getDefaultDirectory } from "./filesystem-store.js";
import { executeFilesystemAction } from "./filesystem-executor.js";
import type { EmailEvent, ExecutionProgress, ActionExecutionResult } from "$lib/types";
import type { Rule, Action } from "$lib/types";

type NormalisedAction = { id: string; pluginId: string; commandId: string; name: string };

function isFilesystemAction(a: { pluginId?: string }): boolean {
  return (a.pluginId ?? "").toLowerCase().trim() === "filesystem";
}

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

/** Run a pipeline with split: core actions → WASM, filesystem actions → web executor. */
async function runPipelineWithSplit(
  actions: NormalisedAction[],
  event: EmailEvent,
  onProgress?: (p: ExecutionProgress) => void
): Promise<{ success: boolean; results: ActionExecutionResult[]; message: string }> {
  const coreActions = actions.filter((a) => !isFilesystemAction(a));
  const fsActions = actions.filter((a) => isFilesystemAction(a));

  if (coreActions.length > 0) {
    const tokenData = await getSavedToken();
    if (!tokenData?.access_token) {
      throw new Error("Not authenticated. Please sign in to Gmail first.");
    }
  }

  if (fsActions.length > 0) {
    const handle = await getDefaultDirectory();
    if (!handle) {
      throw new Error("Add a directory in Sources → Local Filesystem.");
    }
  }

  const coreResults: ActionExecutionResult[] = [];
  const fsResultsByIndex: Map<number, ActionExecutionResult> = new Map();

  if (coreActions.length > 0) {
    const tokenData = await getSavedToken();
    const token = tokenData!.access_token as string;
    const coreResult = await coreExecutePipeline(
      coreActions,
      event,
      token,
      onProgress as (p: unknown) => void
    );
    coreResults.push(...((coreResult.results ?? []) as ActionExecutionResult[]));
  }

  if (fsActions.length > 0) {
    const handle = await getDefaultDirectory();
    if (handle) {
      for (let i = 0; i < actions.length; i++) {
        const a = actions[i]!;
        if (!isFilesystemAction(a)) continue;
        const r = await executeFilesystemAction(a.commandId, event, handle);
        fsResultsByIndex.set(i, {
          actionId: a.id,
          actionName: a.name,
          commandId: a.commandId,
          pluginId: a.pluginId,
          success: r.success,
          message: r.message,
        });
      }
    }
  }

  const merged: ActionExecutionResult[] = [];
  let coreIdx = 0;
  let fsIdx = 0;
  for (let i = 0; i < actions.length; i++) {
    if (isFilesystemAction(actions[i]!)) {
      const r = fsResultsByIndex.get(i);
      if (r) merged.push(r);
      else merged.push({ success: false, message: "Filesystem action failed" });
      fsIdx++;
    } else {
      if (coreIdx < coreResults.length) {
        merged.push(coreResults[coreIdx]!);
        coreIdx++;
      }
    }
  }

  const allSuccess = merged.every((r) => r.success);
  const successMsgs = merged.filter((r) => r.success).map((r) => r.commandId ?? "").join(", ");
  const failMsgs = merged.filter((r) => !r.success).map((r) => `${r.commandId}: ${r.message ?? ""}`).join("; ");
  const message = allSuccess
    ? `Successfully executed: ${successMsgs}`
    : `Pipeline failed: ${failMsgs}`;

  return { success: allSuccess, results: merged, message };
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

    onProgress?.({ phase: "pipeline_loaded", actions, actionCount: actions.length } as ExecutionProgress);

    const result = await runPipelineWithSplit(actions, event, onProgress);

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

    const hasCoreActions = actions.some((a) => !isFilesystemAction(a));
    if (hasCoreActions) {
      const tokenData = await getSavedToken();
      if (!tokenData?.access_token) {
        throw new Error("Not authenticated. Please sign in to Gmail first.");
      }
    }

    const hasFsActions = actions.some(isFilesystemAction);
    if (hasFsActions) {
      const handle = await getDefaultDirectory();
      if (!handle) {
        throw new Error("Add a directory in Sources → Local Filesystem.");
      }
    }

    onProgress?.({ phase: "pipeline_loaded", actions, actionCount: actions.length } as ExecutionProgress);

    const normalisedActions: NormalisedAction[] = actions.map((a, i) => ({
      id: (a.commandId ?? a.id) + "_" + i,
      pluginId: a.pluginId ?? "gmail",
      commandId: a.commandId ?? a.id ?? "",
      name: (a.name ?? a.commandId ?? "").replace(/_/g, " ") || "",
    }));

    const resultsList: Array<{
      event?: EmailEvent;
      results?: ActionExecutionResult[];
      success?: boolean;
      message?: string;
    }> = [];

    for (let i = 0; i < events.length; i++) {
      const email = events[i] as Record<string, unknown>;
      const eventObj: EmailEvent = {
        type: eventType,
        source: "gmail",
        data: email,
      };
      onProgress?.({
        phase: "batch_event",
        eventIndex: i,
        totalEvents: events.length,
        event: eventObj,
      } as ExecutionProgress);
      const r = await runPipelineWithSplit(normalisedActions, eventObj, onProgress);
      resultsList.push({
        event: eventObj,
        results: r.results,
        success: r.success,
        message: r.message,
      });
    }

    await Promise.all(
      resultsList.map(async (r) => {
        const eventData = r.event?.data as Record<string, unknown>;
        const emailId = (eventData?.emailId ?? eventData?.id) as string | undefined;
        await Promise.all([
          logExecution({
            emailId: emailId ?? "",
            subject: eventData?.subject as string | undefined,
            from: eventData?.from as string | undefined,
            eventType,
            actions,
            results: r.results ?? [],
            success: r.success ?? false,
          }),
          syncAfterExecution(emailId ?? "", r.results ?? []),
        ]);
      })
    );

    const successful = resultsList.filter((r) => r.success).length;
    const failed = resultsList.length - successful;
    const result = {
      success: failed === 0,
      results: resultsList,
      total: resultsList.length,
      successful,
      failed,
      message: `Processed ${resultsList.length} event(s): ${successful} successful, ${failed} failed`,
    };
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
  const arr = coreGetAvailableActions(source);
  return Array.isArray(arr) ? arr : [];
}

export async function isAuthenticated(): Promise<boolean> {
  const tokenData = await getSavedToken();
  return !!tokenData?.access_token;
}

export function getRequiredScopes(actionId: string, source: string): string[] {
  const arr = coreGetRequiredScopes(actionId, source);
  return Array.isArray(arr) ? (arr as string[]) : [];
}

export { EVENT_CATEGORY_TIERS };
