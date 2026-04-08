/**
 * me-ai-core public surface.
 *
 * Re-exports types and values from the WASM package so the rest of the app
 * imports from one place. Business logic lives in me-ai-core (Rust); call
 * methods directly via getCore() from core-store.
 */

export {
  AiBackend,
  SettingValue,
  GoogleToken,
  TwitterOAuthLoginStart,
  TwitterOAuthTokens,
  TwitterToken,
  GmailProfile,
  TwitterProfile,
  ScanHistory,
  ApiModel,
  ActionMetadata,
} from "me-ai-core";
export type {
  OnnxModel,
  OllamaModel,
  OllamaConnectionResult,
  OllamaModelTag,
  OllamaChatMessage,
  StreamOllamaOptions,
  OllamaTokenData,
  GenerateFullResult,
  StoredItem,
  ItemRow,
  SyncState,
  SyncResult,
  SyncStatus,
  SyncProgress,
  GetStoredEmailsOptions,
  GetStoredEmailsResult,
  PendingActionsResult,
  PipelineAction,
  ActionExecutionResult,
  AuditStep,
  AuditLogEntry,
  AuditLogStep,
  AuditLogEntryParsed,
  GetAuditLogParsedResult,
  LogExecutionParams,
  GetAuditLogOptions,
  Action,
  Trigger,
  Rule,
  CreateRuleInput,
  CreateRulePayload,
  RuleUpdateInput,
  EventStats,
  PendingItemByCategory,
  PipelineForEvent,
  CategoryPipelineDisplay,
  EventCategory,
  EmailEvent,
  ExecutionProgress,
  ByCategory,
  ClassificationLike,
  EmailLike,
  ClassificationResult,
  ScanProgress,
  ScanResult,
  ScanOptions,
  ClassificationRow,
  GetClassificationsByCategoryOptions,
  GoogleTokenResponse,
  TwitterUser,
  Tweet,
  ApiResponse,
  TimelineOptions,
  TwitterUserInfo,
  TwitterTokenData,
  ParsedError,
  MessageLike,
  WorkerMessage,
  WorkerHandle,
  Listener,
  TriageEngine,
  PluginForPrompt,
  ApiProvider,
  ChatMessage,
  TokenPayload,
  ApiStreamOptions,
  EngineStatus,
  EngineMessage,
  Backend,
  NormalisedAction,
  ActionOverrideInput,
  ResolveExecuteResult,
  BatchEventResult,
  ResolveBatchResult,
  EventInput,
  RuleSavePayload,
  ClassificationDoc,
  ClassificationView,
  ClassificationsByCategory,
  ClassificationCounts,
  TriageClassification,
} from "me-ai-core";

// Re-export initCore and getCore so existing callers don't need to change paths
export { initCore, getCore, coreStore } from "./store/core-store.js";
import { getCore } from "./store/core-store.js";
import { clearSavedChatSessions } from "./chat-sessions.js";

// Local imports for types used in this file's function signatures
import type {
  EventCategory,
  Action,
  ClassificationLike,
  EmailLike,
  EmailEvent,
  ByCategory,
  ParsedError,
  MessageLike,
  GetClassificationsByCategoryOptions,
  ClassificationView,
  ClassificationResult,
  PluginForPrompt,
} from "me-ai-core";

// ── Formatting helpers (BigInt conversion at boundary) ─────────────────────

export function formatBytes(bytes: number): string {
  return getCore().formatBytes(BigInt(bytes));
}
export function formatBytesPrecise(bytes: number): string {
  return getCore().formatBytesPrecise(BigInt(bytes));
}
export function progressPct(loaded: number, total: number): number {
  return getCore().progressPct(BigInt(loaded), BigInt(total));
}
export function stringToHue(s: string): number {
  return getCore().stringToHue(s);
}

// ── Error parsing ──────────────────────────────────────────────────────────

export function parseError(rawError: Error | string | null | undefined): ParsedError {
  const err = typeof rawError === "object" && rawError !== null ? rawError : null;
  const msg = (err as Error)?.message || String(rawError || "");
  const status = err instanceof GmailApiError ? err.status : 0;
  const result = getCore().parseApiError(msg, status);
  return {
    title: result.title,
    description: result.description,
    fix: result.fix || null,
    link: result.link_url ? { url: result.link_url, label: result.link_label } : undefined,
    action: result.action || undefined,
  };
}

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

// ── Shared constants ──────────────────────────────────────────────────────────

/** Cache storage key for downloaded transformers.js model weights. */
export const TRANSFORMERS_CACHE_NAME = "transformers-cache";

// ── Browser-only helpers (cannot live in Rust) ───────────────────────────────

export async function getStorageStats(): Promise<{
  supported: boolean;
  usageBytes: number;
  tables: Record<string, number>;
}> {
  const { getCore } = await import("./store/core-store.js");
  const core = getCore();
  const tableNames = [
    "sm_rules",
    "sm_rule_triggers",
    "sm_rule_commands",
    "sm_events",
    "items",
    "emailClassifications",
    "contacts",
    "settings",
  ];
  const tables: Record<string, number> = {};
  for (const tbl of tableNames) {
    tables[tbl] = Number(await core.getTableCount(tbl));
  }
  let usageBytes = 0;
  const supported =
    typeof navigator !== "undefined" && "storage" in navigator && "estimate" in navigator.storage;
  if (supported) {
    const est = await navigator.storage.estimate();
    usageBytes = est.usage ?? 0;
  }
  return { supported, usageBytes, tables };
}

// ── Event system (moved from events.ts) ─────────────────────────────────────

export type EventCategoryTierDef = {
  id: EventCategory;
  label: string;
  description: string;
  autoExecute: boolean;
  requiresApproval: boolean;
  color: string;
};

export type EventCategoryRowDef = {
  name: string;
  label: string;
  priority: number;
  color: string;
  policy: string;
};

let eventCategoryTiersCache: Record<EventCategory, EventCategoryTierDef> | null = null;
function getEventCategoryTiersRecord(): Record<EventCategory, EventCategoryTierDef> {
  if (!eventCategoryTiersCache) {
    eventCategoryTiersCache = getCore().getEventCategoryTierDefinitions() as Record<
      EventCategory,
      EventCategoryTierDef
    >;
  }
  return eventCategoryTiersCache;
}

/** Tier metadata from Rust (`event_ui`). Resolves lazily after `initCore`. */
export const EVENT_CATEGORY_TIERS = new Proxy({} as Record<EventCategory, EventCategoryTierDef>, {
  get(_, prop: string | symbol) {
    if (typeof prop !== "string") return undefined;
    return getEventCategoryTiersRecord()[prop as EventCategory];
  },
  ownKeys() {
    return Reflect.ownKeys(getEventCategoryTiersRecord());
  },
  getOwnPropertyDescriptor(_, prop) {
    const t = getEventCategoryTiersRecord();
    if (typeof prop === "string" && prop in t) {
      return { configurable: true, enumerable: true, value: t[prop as keyof typeof t] };
    }
    return undefined;
  },
  has(_, prop) {
    return typeof prop === "string" && prop in getEventCategoryTiersRecord();
  },
});

export const DEFAULT_CATEGORY: EventCategory = "CRITICAL";

let eventCategoriesCache: Record<string, EventCategoryRowDef> | null = null;
function getEventCategoriesRecord(): Record<string, EventCategoryRowDef> {
  if (!eventCategoriesCache) {
    eventCategoriesCache = getCore().getEventCategoriesStatic() as Record<
      string,
      EventCategoryRowDef
    >;
  }
  return eventCategoriesCache;
}

/** Lowercase category rows from Rust (`event_ui`). */
export const EVENT_CATEGORIES = new Proxy({} as Record<string, EventCategoryRowDef>, {
  get(_, prop: string | symbol) {
    if (typeof prop !== "string") return undefined;
    return getEventCategoriesRecord()[prop];
  },
  ownKeys() {
    return Reflect.ownKeys(getEventCategoriesRecord());
  },
  getOwnPropertyDescriptor(_, prop) {
    const c = getEventCategoriesRecord();
    if (typeof prop === "string" && prop in c) {
      return { configurable: true, enumerable: true, value: c[prop] };
    }
    return undefined;
  },
  has(_, prop) {
    return typeof prop === "string" && prop in getEventCategoriesRecord();
  },
});

export function categoryTierToName(category: EventCategory): string {
  return getCore().categoryTierToName(category || "");
}

export async function getAllEventTypes(): Promise<string[]> {
  return getCore().getAllEventTypes();
}

export async function getCategoryForEventType(eventType: string): Promise<EventCategory> {
  return (await getCore().getCategoryForEventType(eventType)) as EventCategory;
}

export async function seedEventTypeFromLLM(
  eventType: string,
  category: string,
  _suggestedActionIds?: string[]
): Promise<void> {
  await getCore().seedEventTypeFromLLM(eventType, category);
}

export async function getActionsForEvent(eventType: string): Promise<Action[]> {
  const rows = await getCore().getActionsForEventDisplay(eventType);
  return rows.map((a) => ({
    id: a.id,
    pluginId: a.pluginId,
    commandId: a.commandId,
    name: a.name,
    description: a.description,
  }));
}

// ── Chat message builders (moved from events.ts) ────────────────────────────

async function buildEmailEvent(
  classification: ClassificationLike,
  email: EmailLike
): Promise<{ event: EmailEvent; commands: Action[] }> {
  const category =
    classification.categoryTier ?? (await getCategoryForEventType(classification.action));
  const event: EmailEvent = {
    type: classification.action,
    source: "gmail",
    data: {
      subject: email.subject,
      from: email.from != null ? String(email.from) : undefined,
      date: email.date != null ? String(email.date) : undefined,
      snippet:
        email.snippet || (typeof email.body === "string" ? email.body.slice(0, 200) : "") || "",
    },
    metadata: {
      reason: classification.reason,
      summary: classification.summary,
      tags: classification.tags || [],
      category,
      classifiedAt: Date.now(),
    },
  };
  const commands = await getActionsForEvent(classification.action);
  return { event, commands };
}

export async function buildBatchEventMessage(
  results: Array<{ success: boolean; classification?: ClassificationLike; email?: EmailLike }>
): Promise<{
  role: string;
  type: string;
  items: Array<{ event: EmailEvent; commands: Action[] }>;
  content: string;
}> {
  const items = await Promise.all(
    results
      .filter((r) => r.success && r.classification && r.email)
      .map(async (r) => buildEmailEvent(r.classification!, r.email!))
  );
  return { role: "assistant", type: "event-batch", items, content: "" };
}

interface CategoryEmail {
  emailId: string;
  subject: string;
  from: string;
  date: number | null | undefined;
  summary: string;
  reason: string;
  tags: string[];
  status: string;
}

export async function buildEventsByCategoryMessage(byCategory: ByCategory): Promise<{
  role: string;
  type: string;
  categories: Array<{
    eventType: string;
    category: EventCategory;
    emails: CategoryEmail[];
    commands: Action[];
  }>;
  total: number;
  content: string;
}> {
  const categories = await Promise.all(
    byCategory.order.map(async (eventType) => {
      const items = byCategory.categories[eventType] || [];
      const commands = await getActionsForEvent(eventType);
      const category = await getCategoryForEventType(eventType);
      const emails: CategoryEmail[] = items.map((item) => ({
        emailId: item.emailId ?? "",
        subject: item.subject || "(no subject)",
        from: item.from || "",
        date: item.date,
        summary: item.summary || "",
        reason: item.reason || "",
        tags: item.tags || [],
        status: item.status || "pending",
      }));
      return { eventType, category, emails, commands };
    })
  );
  const total = categories.reduce((sum, c) => sum + c.emails.length, 0);
  return { role: "assistant", type: "events-by-category", categories, total, content: "" };
}

// ── JSON export helpers ─────────────────────────────────────────────────────

export function emailToJson(message: MessageLike): unknown {
  return message.raw ?? null;
}

export function emailToJsonString(message: MessageLike): string {
  const raw = emailToJson(message);
  if (!raw) return "null";
  return JSON.stringify(raw, null, 2);
}

export function emailJsonFilename(message: {
  subject?: string;
  date?: number | string | bigint | null;
}): string {
  const dateMs =
    message.date == null
      ? 0
      : typeof message.date === "bigint"
        ? Number(message.date)
        : typeof message.date === "number"
          ? message.date
          : new Date(message.date).getTime();
  return getCore().exportFilename(message.subject ?? "", dateMs, "json");
}

// ── Triage pass-throughs (moved from triage.ts) ─────────────────────────────

export interface ScanStats {
  totalEmails: number;
  classified: number;
  unclassified: number;
}

export async function getClassificationsByCategory(
  opts: GetClassificationsByCategoryOptions = {}
): Promise<{ categories: Record<string, ClassificationView[]>; order: string[] }> {
  return getCore().getClassificationsByCategory(opts.pendingOnly === true);
}

export async function getClassificationCounts(): Promise<Record<string, number>> {
  const result = await getCore().getClassificationCounts();
  return { ...result.counts, total: result.total };
}

export async function updateClassificationStatus(
  emailId: string,
  newStatus: string
): Promise<void> {
  await getCore().updateEmailClassificationStatus(emailId, newStatus);
}

export async function clearClassifications(): Promise<void> {
  await getCore().clearEmailClassifications();
}

export async function clearClassificationsByAction(action: string): Promise<void> {
  await getCore().deleteEmailClassificationsByAction(action);
}

export async function deleteClassification(emailId: string): Promise<void> {
  await getCore().deleteEmailClassification(emailId);
}

export async function getScanStats(): Promise<ScanStats> {
  const c = getCore();
  const [totalEmails, classified] = await Promise.all([
    c.getItemsCountGmail().then((n) => Number(n ?? 0)),
    c.getEmailClassificationsCount().then((n) => Number(n ?? 0)),
  ]);
  return { totalEmails, classified, unclassified: Math.max(0, totalEmails - classified) };
}

export function actionColor(action: string): string {
  return getCore().actionColor(action);
}

export function tagColor(tag: string): string {
  return getCore().tagColor(tag);
}

export function parseClassification(
  response: string | null | undefined
): ClassificationResult | null {
  if (response == null || typeof response !== "string" || !response.trim()) return null;
  const result = getCore().parseClassification(response);
  if (!result) return null;
  return {
    action: result.action,
    category: result.category as "noise" | "info" | "critical",
    categoryTier: result.categoryTier as "NOISE" | "INFO" | "CRITICAL",
    suggestedActions: [],
    reason: result.reason,
    summary: result.summary,
    tags: result.tagsArray,
  };
}

export function formatEmailPrompt(email: {
  subject?: string;
  from?: string;
  to?: string;
  date?: number | null;
  body?: string;
  snippet?: string;
  labels?: string[];
}): string {
  return getCore().formatEmailPrompt(
    email.subject || "",
    email.from || "",
    email.to || "",
    email.date ?? 0,
    (email.labels ?? []).join(", "),
    email.body ?? email.snippet ?? ""
  );
}

export function getSystemPrompt(): string {
  const c = getCore();
  const plugins = c.getPluginsForPrompt();
  const pluginNames = plugins
    .filter((p: PluginForPrompt) => p.actions.length)
    .map((p: PluginForPrompt) => p.pluginName)
    .join(", ");
  return c.buildSystemPrompt(pluginNames);
}

export const CLASSIFICATION_CONFIG = {
  maxTokens: 2048,
  enableThinking: false,
  doSample: false,
};

/** Milliseconds for WASM `StoredItem` / `ItemRow` dates (`bigint` in bindings). */
export function itemDateMs(d: bigint | number | null | undefined): number {
  if (d == null) return 0;
  return typeof d === "bigint" ? Number(d) : d;
}

export async function clearAllDataAndCheckpoint(): Promise<void> {
  const { getCore } = await import("./store/core-store.js");
  await getCore().clearAllData();
  clearSavedChatSessions();
}
