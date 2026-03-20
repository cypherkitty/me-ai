/**
 * me-ai-core public surface.
 *
 * Re-exports types and values from the WASM package so the rest of the app
 * imports from one place. Business logic lives in me-ai-core (Rust); call
 * methods directly via getCore() from core-store.
 */

export { AiBackend, SettingValue, GoogleToken, TwitterToken, GmailProfile, TwitterProfile, ScanHistory, ApiModel, ActionMetadata } from "me-ai-core";
export type {
  OnnxModel, OllamaModel, OllamaConnectionResult, OllamaModelTag,
  OllamaChatMessage, StreamOllamaOptions, OllamaTokenData,
  GenerateFullResult,
  StoredItem, StoredItemRow, SyncState, SyncProgress, GetStoredEmailsOptions, GetStoredEmailsResult, PendingActionsResult,
  PipelineAction, ActionExecutionResult, AuditStep, AuditLogEntry, LogExecutionParams, GetAuditLogOptions,
  Action, Trigger, Rule, CreateRuleInput, CreateRulePayload, RuleUpdateInput, EventStats, PendingItemByCategory, PipelineForEvent, CategoryPipelineDisplay,
  EventCategory, EmailEvent, ExecutionProgress, ByCategory, ClassificationLike, EmailLike,
  ClassificationResult, ScanProgress, ScanResult, ScanOptions, ClassificationRow, GetClassificationsByCategoryOptions,
  GoogleTokenResponse,
  TwitterUser, Tweet, ApiResponse, TimelineOptions, TwitterUserInfo,
  TwitterTokenData,
  ParsedError,
  MessageLike,
  WorkerMessage, WorkerHandle, Listener,
  TriageEngine, PluginForPrompt,
  ApiProvider, ChatMessage, TokenPayload, ApiStreamOptions, EngineStatus, EngineMessage, Backend,
  NormalisedAction, ActionOverrideInput, ResolveExecuteResult, BatchEventResult, ResolveBatchResult,
  EventInput, RuleSavePayload,
  ClassificationDoc,
  ClassificationView, ClassificationsByCategory, ClassificationCounts,
  TriageClassification,
} from "me-ai-core";

// Re-export initCore and getCore so existing callers don't need to change paths
export { initCore, getCore, coreStore } from "./store/core-store.js";


export class GmailApiError extends Error {
  status: number;
  code: string | null;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "GmailApiError";
    this.status = status;
    this.code = code ?? null;
  }
}

// ── Browser-only helpers (cannot live in Rust) ───────────────────────────────

export async function getStorageStats(): Promise<{
  supported: boolean;
  usageBytes: number;
  tables: Record<string, number>;
}> {
  const { getCore } = await import("./store/core-store.js");
  const core = getCore();
  const tableNames = [
    "sm_rules", "sm_rule_triggers", "sm_rule_commands",
    "sm_events", "items", "emailClassifications", "contacts", "settings",
  ];
  const tables: Record<string, number> = {};
  for (const tbl of tableNames) {
    try {
      tables[tbl] = Number(await core.getTableCount(tbl)) || 0;
    } catch {
      tables[tbl] = 0;
    }
  }
  let usageBytes = 0;
  const supported =
    typeof navigator !== "undefined" &&
    "storage" in navigator &&
    "estimate" in navigator.storage;
  if (supported) {
    try {
      const est = await navigator.storage.estimate();
      usageBytes = est.usage ?? 0;
    } catch {
      /* ignore */
    }
  }
  return { supported, usageBytes, tables };
}

export async function clearAllDataAndCheckpoint(): Promise<void> {
  const { getCore } = await import("./store/core-store.js");
  await getCore().clearAllData();
}
