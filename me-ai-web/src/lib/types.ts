/**
 * Shared types for the store layer and app.
 * Type definitions live in me-ai-core (Rust); re-exported here for backwards compatibility.
 */
export type {
  StoredItem,
  StoredItemRow,
  SyncState,
  SyncProgress,
  GetStoredEmailsOptions,
  GetStoredEmailsResult,
  PendingActionsResult,
  PipelineAction,
  ActionExecutionResult,
  EventCategory,
  Action,
  Trigger,
  Rule,
  EmailEvent,
  ExecutionProgress,
  AuditStep,
  AuditLogEntry,
} from "./core.js";
