/**
 * me-ai-core (Rust WASM) — stateful MeAiCore (meta-secret WasmRepo pattern).
 * Rexie is built once at init; all operations use the same instance via coreStore.
 * Uses vite-plugin-wasm (nervo-labs pattern) so bundling preserves wasm-bindgen imports.
 */

import initDefault, { MeAiCore, SettingValue } from "me-ai-core";
import type {
  EventInput, RuleSavePayload, ClassificationDoc, CreateRulePayload, RuleUpdateInput,
  ClassificationsByCategory, ClassificationCounts, ActionOverrideInput,
  StoredItemRow,
} from "me-ai-core";
import { coreStore, getCore } from "./store/core-store.js";

export { AiBackend, SettingValue, GoogleToken, TwitterToken, GmailProfile, TwitterProfile, ScanHistory, ApiModel } from "me-ai-core";
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
} from "me-ai-core";

/** Options for listing Gmail messages. */
export interface ListMessagesOptions {
  maxResults?: number;
  pageToken?: string;
  q?: string;
}

/** Options for listing Gmail history. */
export interface ListHistoryOptions {
  startHistoryId: string;
  pageToken?: string;
  maxResults?: number;
}

/**
 * Initialize the core: load WASM, create MeAiCore (builds Rexie once), run schema/migrations.
 * Call once at app startup. State is kept in coreStore; all operations reuse the same instance.
 */
export async function initCore(): Promise<void> {
  try {
    const base = typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/";
    const wasmUrl = `${base}wasm/me_ai_core_bg.wasm`;
    await initDefault({ module_or_path: wasmUrl });
    const core = new MeAiCore();
    await core.createSchemaAndMigrations();
    coreStore.set({ core, initFailed: false });
  } catch (e) {
    coreStore.set({ core: null, initFailed: true });
    throw e;
  }
}

function requireCore(): InstanceType<typeof MeAiCore> {
  return getCore();
}

export async function getEventTypes() {
  return requireCore().getEventTypes();
}
export async function getEventCategories() {
  return requireCore().getEventCategories();
}
export async function getActions() {
  return requireCore().getActions();
}
export async function getItemsCountGmail() {
  return requireCore().getItemsCountGmail();
}
export async function getContactsCount() {
  return requireCore().getContactsCount();
}
export async function getEmailClassificationsCount() {
  return requireCore().getEmailClassificationsCount();
}
export async function loadSettings(): Promise<SettingValue> {
  return requireCore().loadSettings();
}
export async function saveSettings(sv: SettingValue): Promise<void> {
  return requireCore().saveSettings(sv);
}
export async function removeSetting(key: string) {
  return requireCore().removeSetting(key);
}
function getTableCount(table: string) {
  return requireCore().getTableCount(table);
}
export async function clearAllData() {
  return requireCore().clearAllData();
}
export async function getAuditLog(limit: number, offset: number, failures_only: boolean) {
  return requireCore().getAuditLog(limit, offset, failures_only);
}
export async function getAuditStats() {
  return requireCore().getAuditStats();
}
export async function clearAuditLog() {
  return requireCore().clearAuditLog();
}
export async function logAuditExecution(
  id: string,
  email_id: string,
  subject: string,
  from: string,
  event_type: string,
  executed_at: number,
  success: boolean,
  error: string,
  steps_json: string
) {
  return requireCore().logAuditExecution(id, email_id, subject, from, event_type, executed_at, success, error, steps_json);
}
export async function syncAfterAuditExecution(email_id: string, delete_item: boolean) {
  return requireCore().syncAfterAuditExecution(email_id, delete_item);
}
export async function getCategoryPipelineActions(category_name: string) {
  return requireCore().getCategoryPipelineActions(category_name);
}
export async function getTypePipelineActions(type_name: string) {
  return requireCore().getTypePipelineActions(type_name);
}
export async function getEventTypeCategory(type_name: string) {
  return requireCore().getEventTypeCategory(type_name);
}
export async function getEventCategoryPolicy(category_name: string) {
  return requireCore().getEventCategoryPolicy(category_name);
}
export async function updateCategoryPipeline(category_name: string, actions: Array<{ pluginId: string; commandId: string }>) {
  return requireCore().updateCategoryPipeline(category_name, actions);
}
export async function updateCategoryPolicy(category_name: string, policy: string) {
  return requireCore().updateCategoryPolicy(category_name, policy);
}
export async function updateEventTypeCategory(type_name: string, category_name: string) {
  return requireCore().updateEventTypeCategory(type_name, category_name);
}
export async function clearEventTypeCategory(type_name: string) {
  return requireCore().clearEventTypeCategory(type_name);
}
export async function deleteEventType(type_name: string) {
  return requireCore().deleteEventType(type_name);
}
export async function setPluginEnabled(name: string, enabled: boolean) {
  return requireCore().setPluginEnabled(name, enabled);
}
export async function upsertEventType(name: string, label: string, category_name: string, auto_created: boolean) {
  return requireCore().upsertEventType(name, label, category_name, auto_created);
}
export async function deleteSyncState(source_type: string) {
  return requireCore().deleteSyncState(source_type);
}
export async function deleteItemsBySource(source_type: string) {
  return requireCore().deleteItemsBySource(source_type);
}
export async function clearContacts() {
  return requireCore().clearContacts();
}
export async function getItemsCountBySource(source_type: string) {
  return requireCore().getItemsCountBySource(source_type);
}
export async function getSyncState(source_type: string) {
  return requireCore().getSyncState(source_type);
}
export async function upsertSyncState(
  source_type: string,
  history_id: string,
  last_sync_at: number,
  total_items: number,
  oldest_page_token: string
) {
  return requireCore().upsertSyncState(source_type, history_id, last_sync_at, total_items, oldest_page_token);
}
export async function insertItemsBatch(rows: StoredItemRow[]) {
  return requireCore().insertItemsBatch(rows);
}
export async function deleteItemsByIds(ids: string[]) {
  return requireCore().deleteItemsByIds(ids);
}
export async function getContactByEmail(email: string) {
  return requireCore().getContactByEmail(email);
}
export async function upsertContact(email: string, name: string, first_seen: number, last_seen: number) {
  return requireCore().upsertContact(email, name, first_seen, last_seen);
}
export async function getNewestSourceId(source_type: string) {
  return requireCore().getNewestSourceId(source_type);
}
export async function getPlugins() {
  return requireCore().getPlugins();
}
export function getPluginRegistry() {
  return requireCore().getPluginRegistry();
}
export function getAvailableActions(source: string) {
  return requireCore().getAvailableActions(source);
}
export function getPluginsForPrompt() {
  return requireCore().getPluginsForPrompt();
}
export async function executePipeline(
  actions: Array<{ id?: string; pluginId?: string; commandId?: string; name?: string }>,
  event: EventInput,
  accessToken: string,
  onProgress?: (progress: unknown) => void,
  config?: unknown
) {
  return requireCore().executePipeline(actions, event, accessToken, onProgress, config);
}
export async function getRules() {
  return requireCore().getRules();
}
export async function getRule(id: string) {
  return requireCore().getRule(id);
}
export async function saveRule(payload: RuleSavePayload) {
  return requireCore().saveRule(payload);
}
export async function deleteRule(id: string) {
  return requireCore().deleteRule(id);
}
export async function createRule(payload: CreateRulePayload) {
  return requireCore().createRule(payload);
}
export async function updateRule(id: string, updates: RuleUpdateInput) {
  return requireCore().updateRule(id, updates);
}
export async function setRuleEnabled(id: string, enabled: boolean) {
  return requireCore().setRuleEnabled(id, enabled);
}
export async function getEventStats() {
  return requireCore().getEventStats() as Promise<import("me-ai-core").EventStats>;
}
export async function getPendingApprovals(limit: number = 100) {
  return requireCore().getPendingApprovals(limit) as Promise<Record<string, unknown>[]>;
}
export async function getPendingCountByCategory(categoryName: string) {
  return requireCore().getPendingCountByCategory(categoryName);
}
export async function getPendingItemsByCategory(categoryName: string, limit: number = 500) {
  return requireCore().getPendingItemsByCategory(categoryName, limit) as Promise<import("me-ai-core").PendingItemByCategory[]>;
}
export async function getCategoryPipelines() {
  return requireCore().getCategoryPipelines() as Promise<import("me-ai-core").CategoryPipelineDisplay[]>;
}
export async function getItemById(id: string) {
  return requireCore().getItemById(id);
}
export async function getItemsGmailByDateDesc(limit: number) {
  return requireCore().getItemsGmailByDateDesc(limit);
}
export async function getItemsBySource(source_type: string, limit: number, offset: number) {
  return requireCore().getItemsBySource(source_type, limit, offset);
}
export async function getEmailClassifications(action_filter?: string, limit?: number) {
  return requireCore().getEmailClassifications(action_filter, limit);
}
export async function updateEmailClassificationStatus(email_id: string, status: string) {
  return requireCore().updateEmailClassificationStatus(email_id, status);
}
export async function clearEmailClassifications() {
  return requireCore().clearEmailClassifications();
}
export async function deleteEmailClassification(email_id: string) {
  return requireCore().deleteEmailClassification(email_id);
}
export async function deleteEmailClassificationsByAction(action: string) {
  return requireCore().deleteEmailClassificationsByAction(action);
}
export async function putEmailClassification(doc: ClassificationDoc) {
  return requireCore().putEmailClassification(doc);
}
export async function getClassificationsByCategory(pendingOnly: boolean): Promise<ClassificationsByCategory> {
  return requireCore().getClassificationsByCategory(pendingOnly);
}
export async function getClassificationCounts(): Promise<ClassificationCounts> {
  return requireCore().getClassificationCounts();
}

export async function getStorageStats(): Promise<{
  supported: boolean;
  usageBytes: number;
  tables: Record<string, number>;
}> {
  const tables: Record<string, number> = {};
  for (const tbl of [
    "sm_rules",
    "sm_rule_triggers",
    "sm_rule_commands",
    "sm_events",
    "items",
    "emailClassifications",
    "contacts",
    "settings",
  ]) {
    try {
      tables[tbl] = Number(await getTableCount(tbl)) || 0;
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
  await clearAllData();
}

export function getApiModelInfo(modelId: string): import("me-ai-core").ApiModel | null {
  try {
    return requireCore().getApiModelInfo(modelId) as import("me-ai-core").ApiModel | null;
  } catch {
    return null;
  }
}
export async function testApiConnection(provider: string, apiKey: string): Promise<boolean> {
  return requireCore().testApiConnection(provider, apiKey);
}
export async function streamChat(
  provider: string,
  modelName: string,
  messages: Array<{ role: string; content: string }>,
  options: { temperature?: number; maxTokens?: number; reasoningEffort?: string },
  onToken: (payload: { content: string; done: boolean; inputTokens: number; outputTokens: number }) => void
): Promise<void> {
  return requireCore().streamChat(provider, modelName, messages, options, onToken);
}

// ── Gmail API ────────────────────────────────────────────────────────────────

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

export function getProfile(token: string): Promise<Record<string, unknown>> {
  return requireCore().getGmailProfile(token) as unknown as Promise<Record<string, unknown>>;
}

export function listMessages(
  token: string,
  { maxResults = 20, pageToken, q }: ListMessagesOptions = {}
): Promise<Record<string, unknown>> {
  return requireCore().listGmailMessages(token, maxResults, pageToken ?? null, q ?? null) as unknown as Promise<Record<string, unknown>>;
}

export function getMessage(
  token: string,
  messageId: string,
  format: string = "full"
): Promise<Record<string, unknown>> {
  return requireCore().getGmailMessage(token, messageId, format) as unknown as Promise<Record<string, unknown>>;
}

export function listHistory(
  token: string,
  { startHistoryId, pageToken, maxResults = 500 }: ListHistoryOptions
): Promise<Record<string, unknown>> {
  return requireCore().listGmailHistory(token, startHistoryId, pageToken ?? null, maxResults) as unknown as Promise<Record<string, unknown>>;
}

export function getHeader(
  message: Record<string, unknown>,
  name: string
): string {
  return requireCore().getGmailHeader(JSON.stringify(message), name);
}

export function getBody(message: Record<string, unknown>): string {
  return requireCore().parseGmailBody(JSON.stringify(message));
}

export function getHtmlBody(message: Record<string, unknown>): string | null {
  return requireCore().parseGmailHtmlBody(JSON.stringify(message)) ?? null;
}

// ── ONNX model catalog ──────────────────────────────────────────────────────

export function getOnnxModels() {
  return requireCore().getOnnxModels();
}
export function getOnnxModelGroups() {
  return requireCore().getOnnxModelGroups();
}
export function getOnnxModelInfo(id: string) {
  return requireCore().getOnnxModelInfo(id);
}

// ── Ollama model catalog ────────────────────────────────────────────────────

export function getOllamaModels() {
  return requireCore().getOllamaModels();
}
export function getOllamaModelInfo(name: string) {
  return requireCore().getOllamaModelInfo(name);
}
export function getRecommendedOllamaModels() {
  return requireCore().getRecommendedOllamaModels();
}
export async function testOllamaConnection(url: string): Promise<import("me-ai-core").OllamaConnectionResult> {
  return requireCore().testOllamaConnection(url);
}
export async function listOllamaModels(url: string): Promise<import("me-ai-core").OllamaModelTag[]> {
  return requireCore().listOllamaModels(url);
}

// ── Formatting utilities ────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  return requireCore().formatBytes(BigInt(bytes));
}
export function formatBytesPrecise(bytes: number): string {
  return requireCore().formatBytesPrecise(BigInt(bytes));
}
export function progressPct(loaded: number, total: number): number {
  return requireCore().progressPct(BigInt(loaded), BigInt(total));
}
export function stringToHue(s: string): number {
  return requireCore().stringToHue(s);
}

// ── Email utilities ─────────────────────────────────────────────────────────

export function extractName(fromStr: string): string {
  return requireCore().extractName(fromStr);
}
export function initial(fromStr: string): string {
  return requireCore().initial(fromStr);
}
export function exportFilename(subject: string, dateMs: number, ext: string): string {
  return requireCore().exportFilename(subject, dateMs, ext);
}

// ── Triage utilities ────────────────────────────────────────────────────────

export function buildSystemPrompt(pluginNames: string): string {
  return requireCore().buildSystemPrompt(pluginNames);
}
export function parseClassification(response: string): import("me-ai-core").TriageClassification | undefined {
  return requireCore().parseClassification(response);
}
export function formatEmailPrompt(
  subject: string,
  from: string,
  to: string,
  dateMs: number,
  labels: string,
  body: string
): string {
  return requireCore().formatEmailPrompt(subject, from, to, dateMs, labels, body);
}
export function actionColor(action: string): string {
  return requireCore().actionColor(action);
}
export function tagColor(tag: string): string {
  return requireCore().tagColor(tag);
}
export function categoryTierToName(tier: string): string {
  return requireCore().categoryTierToName(tier);
}

// ── LLM context ─────────────────────────────────────────────────────────────

export async function buildLlmContext(): Promise<string> {
  return requireCore().buildLlmContext();
}
export async function buildEmailContext(userQuery: string = ""): Promise<string> {
  return requireCore().buildEmailContext(userQuery);
}

// ── Token management (core) ──────────────────────────────────────────────────

export async function getGoogleToken() { return requireCore().getGoogleToken(); }
export async function saveGoogleToken(accessToken: string, expiresIn: number) { return requireCore().saveGoogleToken(accessToken, expiresIn); }
export async function clearGoogleToken() { return requireCore().clearGoogleToken(); }
export async function isGoogleTokenValid(): Promise<boolean> { return requireCore().isGoogleTokenValid(); }
export async function getGoogleTokenTTL(): Promise<number> { return requireCore().getGoogleTokenTTL(); }
export async function getTwitterToken() { return requireCore().getTwitterToken(); }
export async function getTwitterTokenRaw() { return requireCore().getTwitterTokenRaw(); }
export async function saveTwitterToken(accessToken: string, refreshToken: string | undefined, expiresIn: number) { return requireCore().saveTwitterToken(accessToken, refreshToken, expiresIn); }
export async function clearTwitterToken() { return requireCore().clearTwitterToken(); }

// ── Pipeline resolution & execution (core) ──────────────────────────────────

export async function findMatchingRules(eventType: string, eventCategory: string) {
  return requireCore().findMatchingRules(eventType, eventCategory);
}

export async function getPipelineForEventResolved(eventType: string) {
  return requireCore().getPipelineForEventResolved(eventType);
}

export async function resolveAndExecutePipeline(
  event: EventInput,
  approved: boolean,
  actionsOverride: ActionOverrideInput[] | null,
  onProgress?: (p: unknown) => void
) {
  return requireCore().resolveAndExecutePipeline(event, approved, actionsOverride, onProgress);
}

export async function resolveAndExecuteBatch(
  eventType: string,
  events: EventInput[],
  approved: boolean,
  onProgress?: (p: unknown) => void
) {
  return requireCore().resolveAndExecuteBatch(eventType, events, approved, onProgress);
}
