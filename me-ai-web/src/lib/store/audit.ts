/**
 * Audit Log Service
 *
 * Records every pipeline execution and its effects on local data.
 * Used for the audit log UI and to keep the local DB in sync after actions run.
 * All SQL runs in me-ai-core (Rust); this module calls the core.
 */

import { getCore } from "./core-store.js";
import { toJson, fromJson } from "./db.js";
import type { ActionExecutionResult, AuditStep, AuditLogEntry, LogExecutionParams, GetAuditLogOptions } from "../core.js";

const DESTRUCTIVE_COMMAND_IDS = new Set(["trash", "delete", "mark_spam"]);
const ARCHIVING_COMMAND_IDS = new Set(["archive"]);

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

  await getCore().logAuditExecution(
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

  await getCore().syncAfterAuditExecution(emailId, deleteItem);
}

interface GetAuditLogResult {
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
  const result = await getCore().getAuditLog(limit, offset, failuresOnly) as unknown as { entries: AuditLogEntry[]; total: number };
  const entries: AuditLogEntry[] = (result.entries ?? []).map((r) => ({
    ...r,
    steps: fromJson<AuditStep[]>(r.steps as unknown as string, []),
    success: Boolean(r.success),
  }));
  return { entries, total: result.total ?? 0 };
}

/**
 * Delete all audit log entries.
 */
export async function clearAuditLog(): Promise<void> {
  await getCore().clearAuditLog();
}
