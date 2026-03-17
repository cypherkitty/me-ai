/**
 * Execution Service
 *
 * Thin wrapper over core WASM pipeline resolution and execution.
 * Handles browser-only concerns: OAuth token retrieval and filesystem actions.
 */

import {
  resolveAndExecutePipeline as coreResolveAndExecute,
  resolveAndExecuteBatch as coreResolveAndExecuteBatch,
  getAvailableActions as coreGetAvailableActions,
} from "../core.js";
import { getSavedToken } from "../google-auth.js";
import { getDefaultDirectory } from "./filesystem-store.js";
import { executeFilesystemAction } from "./filesystem-executor.js";
import { EVENT_CATEGORY_TIERS } from "../events.js";
import type { EmailEvent, ExecutionProgress, ActionExecutionResult } from "$lib/types";
import type { ResolveExecuteResult, ResolveBatchResult } from "../core.js";

interface ExecutePipelineOptions {
  actionsOverride?: Array<{ pluginId: string; commandId: string }>;
}

async function handleFilesystemActions(
  fsActions: Array<{ id: string; pluginId: string; commandId: string; name: string }>,
  event: EmailEvent,
  results: ActionExecutionResult[]
): Promise<void> {
  if (!fsActions.length) return;
  const handle = await getDefaultDirectory();
  if (!handle) throw new Error("Add a directory in Sources → Local Filesystem.");
  for (const a of fsActions) {
    const r = await executeFilesystemAction(a.commandId, event, handle);
    results.push({
      actionId: a.id,
      actionName: a.name,
      commandId: a.commandId,
      pluginId: "filesystem",
      success: r.success,
      message: r.message ?? "",
    });
  }
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
    const result = (await coreResolveAndExecute(
      event,
      approved,
      options.actionsOverride ?? null,
      onProgress as ((p: unknown) => void) | undefined
    )) as ResolveExecuteResult;

    if (result.requiresApproval) return result;

    const results = [...(result.results ?? [])] as ActionExecutionResult[];
    await handleFilesystemActions(
      result.filesystemActions ?? [],
      event,
      results
    );

    return { ...result, results };
  } catch (error) {
    const err = error as Error;
    onProgress?.({ phase: "error", error: err.message } as ExecutionProgress);
    return { success: false, error, message: err.message || "Unknown error" };
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
  actions?: unknown[];
  results?: unknown[];
  total?: number;
  successful?: number;
  failed?: number;
  error?: unknown;
}> {
  try {
    const result = (await coreResolveAndExecuteBatch(
      eventType,
      events,
      approved,
      onProgress as ((p: unknown) => void) | undefined
    )) as ResolveBatchResult;

    if (result.requiresApproval) return result;

    // TODO: handle filesystem actions per-event if needed
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

export { EVENT_CATEGORY_TIERS };
