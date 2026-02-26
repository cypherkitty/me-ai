/**
 * Audit Log Service
 *
 * Records every pipeline execution and its effects on local data.
 * Used for the audit log UI and to keep the local DB in sync after actions run.
 */

import { db } from "./db.js";

/**
 * Actions that remove an email from the mailbox (Gmail side) and should
 * therefore be removed from our local `items` table too.
 */
const DESTRUCTIVE_COMMAND_IDS = new Set([
  "trash",
  "delete",
  "mark_spam",
]);

/**
 * Actions that move an email out of the inbox — we keep the local item
 * but remove it from pending classifications.
 */
const ARCHIVING_COMMAND_IDS = new Set([
  "archive",
]);

/**
 * Write one audit log entry after a pipeline execution completes.
 *
 * @param {Object} params
 * @param {string}   params.emailId    - Universal item ID (e.g. "gmail:18e…")
 * @param {string}   params.subject    - Email subject line
 * @param {string}   params.from       - Sender
 * @param {string}   params.eventType  - UPPER_SNAKE_CASE event type
 * @param {Object[]} params.actions    - Pipeline action definitions
 * @param {Object[]} params.results    - Per-action execution results
 * @param {boolean}  params.success    - Overall pipeline success
 * @param {string}   [params.error]    - Top-level error message if any
 */
export async function logExecution({ emailId, subject, from, eventType, actions, results, success, error }) {
  await db.auditLog.add({
    id:         crypto.randomUUID(),
    emailId,
    subject:    subject ?? "(no subject)",
    from:       from ?? "",
    eventType,
    executedAt: Date.now(),
    success:    !!success,
    error:      error ?? "",
    steps: (results ?? []).map((r, i) => ({
      actionId:   r.actionId   ?? actions?.[i]?.id ?? "",
      actionName: r.actionName ?? actions?.[i]?.name ?? r.actionId ?? "",
      commandId:  r.commandId  ?? actions?.[i]?.commandId ?? "",
      pluginId:   r.pluginId   ?? actions?.[i]?.pluginId ?? "",
      success:    r.success    ?? false,
      message:    r.message    ?? "",
    })),
  });
}

/**
 * Sync the local DB after a successful (or partially successful) pipeline run.
 *
 * - Marks the emailClassification as "executed" so it leaves the pending queue.
 * - Deletes the item from `items` if all executed actions were destructive.
 *
 * @param {string}   emailId   - Universal item ID
 * @param {Object[]} results   - Per-action execution results from plugin-registry
 */
export async function syncAfterExecution(emailId, results) {
  if (!emailId) return;

  const successfulCommandIds = (results ?? [])
    .filter(r => r.success)
    .map(r => r.commandId)
    .filter(Boolean);

  await db.emailClassifications.update(emailId, { status: "executed" });

  const isDestructive = successfulCommandIds.some(id => DESTRUCTIVE_COMMAND_IDS.has(id));
  const isArchiving   = successfulCommandIds.some(id => ARCHIVING_COMMAND_IDS.has(id));

  if (isDestructive || isArchiving) {
    await db.items.delete(emailId);
  }
}

/**
 * Fetch audit log entries, newest first.
 *
 * @param {Object}  [opts]
 * @param {number}  [opts.limit=50]
 * @param {number}  [opts.offset=0]
 * @param {boolean} [opts.failuresOnly=false]
 * @returns {Promise<{entries: Object[], total: number}>}
 */
export async function getAuditLog({ limit = 50, offset = 0, failuresOnly = false } = {}) {
  const all = await db.auditLog.orderBy("executedAt").reverse().toArray();
  const filtered = failuresOnly ? all.filter(e => !e.success) : all;
  return {
    entries: filtered.slice(offset, offset + limit),
    total:   filtered.length,
  };
}

/**
 * Delete all audit log entries.
 */
export async function clearAuditLog() {
  await db.auditLog.clear();
}
