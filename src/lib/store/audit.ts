/**
 * Audit Log Service
 *
 * Records every pipeline execution and its effects on local data.
 * Used for the audit log UI and to keep the local DB in sync after actions run.
 */

import { query, exec, toJson, fromJson } from "./db.js";
import type { PipelineAction, ActionExecutionResult, AuditStep } from "$lib/types";

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

  await exec(
    `INSERT INTO auditLog (id, emailId, subject, "from", eventType, executedAt, success, error, steps)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      crypto.randomUUID(),
      emailId,
      subject ?? "(no subject)",
      from ?? "",
      eventType,
      Date.now(),
      !!success,
      error ?? "",
      toJson(steps),
    ]
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

  await exec(
    `UPDATE emailClassifications SET status = 'executed' WHERE emailId = ?`,
    [emailId]
  );

  const isDestructive = successfulCommandIds.some((id) => DESTRUCTIVE_COMMAND_IDS.has(id));
  const isArchiving = successfulCommandIds.some((id) => ARCHIVING_COMMAND_IDS.has(id));

  if (isDestructive || isArchiving) {
    await exec(`DELETE FROM items WHERE id = ?`, [emailId]);
  }
}

export interface GetAuditLogOptions {
  limit?: number;
  offset?: number;
  failuresOnly?: boolean;
}

export interface GetAuditLogResult {
  entries: Array<Record<string, unknown> & { steps: AuditStep[]; success: boolean }>;
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
  const whereClause = failuresOnly ? "WHERE success = false" : "";

  const [countRow] = await query(
    `SELECT COUNT(*) AS cnt FROM auditLog ${whereClause}`
  );
  const total = Number(countRow?.cnt ?? 0);

  const rows = await query(
    `SELECT * FROM auditLog ${whereClause}
     ORDER BY executedAt DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const entries = rows.map((r) => ({
    ...r,
    steps: fromJson<AuditStep[]>(r.steps as string, []),
    success: Boolean(r.success),
  }));

  return { entries, total };
}

/**
 * Delete all audit log entries.
 */
export async function clearAuditLog(): Promise<void> {
  await exec(`DELETE FROM auditLog`);
}
