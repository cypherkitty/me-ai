/**
 * Audit Log Service
 *
 * Records every pipeline execution and its effects on local data.
 * Used for the audit log UI and to keep the local DB in sync after actions run.
 * All SQL runs in me-ai-core (Rust); this module calls the core.
 */

import { getCore } from "./core-store.js";
import { fromJson } from "./db.js";
import type { AuditStep, AuditLogEntry, GetAuditLogOptions } from "../core.js";

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
