/**
 * Execution Service
 *
 * Thin wrapper over core WASM pipeline resolution and execution.
 * Handles browser-only concerns: OAuth token retrieval and filesystem actions.
 */

import { getCore } from "../store/core-store.js";
import { getSavedToken } from "../google-auth.js";
import { getDefaultDirectory } from "./filesystem-store.js";
import { executeFilesystemAction } from "./filesystem-executor.js";
import { EVENT_CATEGORY_TIERS } from "../events.js";
import type { EmailEvent, ExecutionProgress, ActionExecutionResult } from "$lib/types";
import { ActionMetadata } from "../core.js";
import type { ResolveExecuteResult, ResolveBatchResult, EventInput } from "../core.js";

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
): Promise<ResolveExecuteResult | { success: false; error: unknown; message: string }> {
  try {
    const result = (await getCore().resolveAndExecutePipeline(
      event as EventInput,
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
): Promise<ResolveBatchResult | { success: false; error: unknown; message: string; total: number; successful: number; failed: number }> {
  try {
    const result = (await getCore().resolveAndExecuteBatch(
      eventType,
      events as unknown as EventInput[],
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

export function getAvailableActions(source: string): ActionMetadata[] {
  const arr = getCore().getAvailableActions(source);
  return Array.isArray(arr) ? (arr as ActionMetadata[]) : [];
}

export async function isAuthenticated(): Promise<boolean> {
  const tokenData = await getSavedToken();
  return !!tokenData?.access_token;
}

export { EVENT_CATEGORY_TIERS };
