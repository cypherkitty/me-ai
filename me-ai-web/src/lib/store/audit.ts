/**
 * Audit Log Service
 *
 * Records every pipeline execution and its effects on local data.
 * Used for the audit log UI and to keep the local DB in sync after actions run.
 * All SQL runs in me-ai-core (Rust); this module calls the core.
 */

import {
  logAuditExecution as coreLogAuditExecution,
  syncAfterAuditExecution as coreSyncAfterAuditExecution,
  getAuditLog as coreGetAuditLog,
  clearAuditLog as coreClearAuditLog,
} from "../core.js";
import { toJson, fromJson } from "./db.js";
import type { PipelineAction, ActionExecutionResult, AuditStep, AuditLogEntry } from "$lib/types";

const DESTRUCTIVE_COMMAND_IDS = new Set(["trash", "delete", "mark_spam"]);
const ARCHIVING_COMMAND_IDS = new Set(["archive"]);

export interface LogExecutionParams {
  emailId: string;
  subject?: string;
  from?: string;
  eventType: string;
  actions?: PipelineAction[];
  results?: ActionExecutionResult[];
  success: boolean;
  error?: string;
}

/**
 * Write one audit log entry after a pipeline execution completes.
 */
export async function logExecution({
  emailId,
  subject,
  from,
  eventType,
  actions,
  results,
  success,
  error,
}: LogExecutionParams): Promise<void> {
  const steps: AuditStep[] = (results ?? []).map((r, i) => ({
    actionId: (r.actionId ?? actions?.[i]?.id ?? "") as string,
    actionName: (r.actionName ?? actions?.[i]?.name ?? r.actionId ?? "") as string,
    commandId: (r.commandId ?? actions?.[i]?.commandId ?? "") as string,
    pluginId: (r.pluginId ?? actions?.[i]?.pluginId ?? "") as string,
    success: r.success ?? false,
    message: (r.message ?? "") as string,
  }));

  await coreLogAuditExecution(
    crypto.randomUUID(),
    emailId,
    subject ?? "(no subject)",
    from ?? "",
    eventType,
    Date.now(),
    !!success,
    error ?? "",
    toJson(steps)
  );
}

/**
 * Sync the local DB after a successful (or partially successful) pipeline run.
 */
export async function syncAfterExecution(
  emailId: string,
  results: ActionExecutionResult[] | null | undefined
): Promise<void> {
  if (!emailId) return;

  const successfulCommandIds = (results ?? [])
    .filter((r) => r.success)
    .map((r) => r.commandId)
    .filter(Boolean) as string[];

  const isDestructive = successfulCommandIds.some((id) => DESTRUCTIVE_COMMAND_IDS.has(id));
  const isArchiving = successfulCommandIds.some((id) => ARCHIVING_COMMAND_IDS.has(id));
  const deleteItem = isDestructive || isArchiving;

  await coreSyncAfterAuditExecution(emailId, deleteItem);
}

export interface GetAuditLogOptions {
  limit?: number;
  offset?: number;
  failuresOnly?: boolean;
}

export interface GetAuditLogResult {
  entries: AuditLogEntry[];
  total: number;
}

/**
 * Fetch audit log entries, newest first.
 */
export async function getAuditLog({
  limit = 50,
  offset = 0,
  failuresOnly = false,
}: GetAuditLogOptions = {}): Promise<GetAuditLogResult> {
  const result = (await coreGetAuditLog(limit, offset, failuresOnly) as unknown) as { entries: Record<string, unknown>[]; total: number };
  const entries = (result.entries ?? []).map((r) => ({
    ...r,
    steps: fromJson<AuditStep[]>(r.steps as string, []),
    success: Boolean(r.success),
  })) as unknown as AuditLogEntry[];
  return { entries, total: result.total ?? 0 };
}

/**
 * Delete all audit log entries.
 */
export async function clearAuditLog(): Promise<void> {
  await coreClearAuditLog();
}
