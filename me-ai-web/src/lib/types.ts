/**
 * Shared types for the store layer and app.
 * Used by db, idb, query-layer, gmail-sync, twitter-sync, audit, settings.
 */

/** Universal item row (email, tweet, etc.) — normalised shape after fromJson/labels. */
export interface StoredItem {
  id: string;
  sourceType: string;
  sourceId: string;
  threadKey: string;
  type: string;
  from: string;
  to: string;
  cc: string;
  subject: string;
  snippet: string;
  body: string;
  htmlBody: string | null;
  date: number | null;
  labels: string[];
  messageId: string;
  inReplyTo: string;
  references: string;
  raw: unknown;
  syncedAt: number | null;
}

/** Raw row from IndexedDB (labels/raw are JSON strings). */
export interface StoredItemRow extends Omit<StoredItem, 'labels' | 'raw'> {
  labels: string;
  raw: string;
}

/** Sync state for a source (Gmail, Twitter, etc.). */
export interface SyncState {
  sourceType: string;
  historyId: string;
  lastSyncAt: number | null;
  totalItems: number;
  oldestPageToken: string;
}

/** Progress callback payload during sync. */
export interface SyncProgress {
  phase: string;
  message: string;
  current?: number;
  total?: number;
}

/** Audit log step (one action result). */
export interface AuditStep {
  actionId: string;
  actionName: string;
  commandId: string;
  pluginId: string;
  success: boolean;
  message: string;
}

/** Audit log entry (DB row + parsed steps). */
export interface AuditLogEntry {
  id: string;
  emailId: string;
  subject: string;
  from: string;
  eventType: string;
  executedAt: number;
  success: boolean;
  error: string;
  steps: AuditStep[];
}

/** Options for getStoredEmails. */
export interface GetStoredEmailsOptions {
  query?: string;
  limit?: number;
  offset?: number;
}

/** Result of getStoredEmails. */
export interface GetStoredEmailsResult {
  items: StoredItem[];
  total: number;
}

/** Pending actions result from query-layer. */
export interface PendingActionsResult {
  categories: Record<string, unknown[]>;
  order: string[];
  total: number;
}

/** Pipeline action definition (for audit). */
export interface PipelineAction {
  id?: string;
  name?: string;
  commandId?: string;
  pluginId?: string;
}

/** Per-action execution result (from core). */
export interface ActionExecutionResult {
  actionId?: string;
  actionName?: string;
  commandId?: string;
  pluginId?: string;
  success: boolean;
  message: string;
}

// ── Events / Rules / Pipelines ────────────────────────────────────────

/** Event category tier (execution policy). Stored in DB as category_name: noise | info | critical. */
export type EventCategory = "NOISE" | "INFO" | "CRITICAL";

/** Pipeline action (rule step). */
export interface Action {
  id: string;
  pluginId: string;
  commandId: string;
  name: string;
  description: string;
  icon?: string;
}

/** Rule trigger (event_type or event_category). */
export interface Trigger {
  type: "event_type" | "event_category";
  name: string;
}

/** Rule (pipeline unit). */
export interface Rule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  created_at: number;
  triggers: Trigger[];
  actions: Action[];
  policy?: string;
}

/** Email event (from classification or chat). */
export interface EmailEvent {
  type: string;
  source: string;
  data: { subject?: string; from?: string; date?: string; snippet?: string; [k: string]: unknown };
  metadata?: { reason?: string; summary?: string; tags?: string[]; category?: EventCategory; [k: string]: unknown };
}

/** Execution progress callback payload. */
export interface ExecutionProgress {
  phase: string;
  actionId?: string;
  actionName?: string;
  pluginId?: string;
  commandId?: string;
  result?: unknown;
  error?: string;
  category?: EventCategory;
  eventIndex?: number;
  totalEvents?: number;
  event?: EmailEvent;
  eventType?: string;
  eventCount?: number;
  actions?: unknown[];
  actionCount?: number;
}


