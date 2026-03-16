/**
 * me-ai-core (Rust WASM) — stateful MeAiCore (meta-secret WasmRepo pattern).
 * Rexie is built once at init; all operations use the same instance via coreStore.
 * Uses vite-plugin-wasm (nervo-labs pattern) so bundling preserves wasm-bindgen imports.
 */

import initDefault, { MeAiCore, SettingValue } from "me-ai-core";
import { coreStore, getCore } from "./store/core-store.js";

export { AiBackend, SettingValue, GoogleToken, TwitterToken, GmailProfile, TwitterProfile, ScanHistory } from "me-ai-core";
export type { OnnxModel, OnnxModelGroup, OllamaModel, OllamaConnectionResult, OllamaModelTag, TriageClassification } from "me-ai-core";

/**
 * Initialize the core: load WASM, create MeAiCore (builds Rexie once), run schema/migrations.
 * Call once at app startup. State is kept in coreStore; all operations reuse the same instance.
 */
export async function initCore(): Promise<void> {
  try {
    const base = typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/";
    const wasmUrl = `${base}wasm/me_ai_core_bg.wasm`;
    await initDefault({ module_or_path: wasmUrl });
    const core = await new MeAiCore();
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
export async function getSources() {
  return requireCore().getSources();
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
export async function getItemsDateMin() {
  return requireCore().getItemsDateMin();
}
export async function getItemsDateMax() {
  return requireCore().getItemsDateMax();
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
export async function getTableCount(table: string) {
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
export async function updateCategoryPipeline(category_name: string, actions_js: unknown) {
  return requireCore().updateCategoryPipeline(category_name, actions_js);
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
export async function setSourceEnabled(name: string, enabled: boolean) {
  return requireCore().setSourceEnabled(name, enabled);
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
export async function clearItemsSyncContacts() {
  return requireCore().clearItemsSyncContacts();
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
export async function insertItemsBatch(rows: unknown) {
  return requireCore().insertItemsBatch(rows);
}
export async function insertSyncStateBatch(rows: unknown) {
  return requireCore().insertSyncStateBatch(rows);
}
export async function insertContactsBatch(rows: unknown) {
  return requireCore().insertContactsBatch(rows);
}
export async function deleteItemsByIds(ids: unknown) {
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
export function getRequiredScopes(actionId: string, source: string) {
  return requireCore().getRequiredScopes(actionId, source);
}
export function resolvePluginId(source: string) {
  return requireCore().resolvePluginId(source);
}
export function getPluginsForPrompt() {
  return requireCore().getPluginsForPrompt();
}
export async function executePipeline(
  actions: unknown[],
  event: unknown,
  accessToken: string,
  onProgress?: (progress: unknown) => void,
  config?: unknown
) {
  return requireCore().executePipeline(actions, event, accessToken, onProgress, config);
}
export async function executePipelineBatch(
  actions: unknown[],
  events: unknown[],
  accessToken: string,
  onProgress?: (progress: unknown) => void,
  config?: unknown
) {
  return requireCore().executePipelineBatch(actions, events, accessToken, onProgress, config);
}
export async function getRules() {
  return requireCore().getRules();
}
export async function getRule(id: string) {
  return requireCore().getRule(id);
}
export async function saveRule(payload: unknown) {
  return requireCore().saveRule(payload);
}
export async function deleteRule(id: string) {
  return requireCore().deleteRule(id);
}
export async function getEvents(limit: number, offset: number) {
  return requireCore().getEvents(limit, offset);
}
export async function updateEventStatus(id: string, status: string) {
  return requireCore().updateEventStatus(id, status);
}
export async function clearEvents() {
  return requireCore().clearEvents();
}
export async function insertEvent(
  id: string,
  content?: string | null,
  subject?: string | null,
  sender?: string | null,
  timestamp?: number,
  status?: string | null,
  event_type?: string | null,
  event_category?: string | null,
  source_name?: string | null,
  rule_id?: string | null,
  actions_taken?: string | null,
  output?: string | null
) {
  return requireCore().insertEvent(
    id,
    content ?? undefined,
    subject ?? undefined,
    sender ?? undefined,
    timestamp ?? 0,
    status ?? undefined,
    event_type ?? undefined,
    event_category ?? undefined,
    source_name ?? undefined,
    rule_id ?? undefined,
    actions_taken ?? undefined,
    output ?? undefined
  );
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
export async function getEmailClassifications(action_filter?: string | null, limit?: number | null) {
  return requireCore().getEmailClassifications(action_filter ?? undefined, limit ?? undefined);
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
export async function putEmailClassification(
  email_id: string,
  action?: string | null,
  category?: string | null,
  reason?: string | null,
  summary?: string | null,
  tags?: string | null,
  subject?: string | null,
  from?: string | null,
  date?: number | null,
  scanned_at?: number | null,
  status?: string | null
) {
  return requireCore().putEmailClassification(
    email_id,
    action ?? undefined,
    category ?? undefined,
    reason ?? undefined,
    summary ?? undefined,
    tags ?? undefined,
    subject ?? undefined,
    from ?? undefined,
    date ?? undefined,
    scanned_at ?? undefined,
    status ?? undefined
  );
}

/**
 * True if core init has already failed (e.g. IndexedDB unavailable). For UI/guards only.
 */
export { isCoreInitFailed } from "./store/core-store.js";

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

export function getApiModels() {
  return requireCore().getApiModels();
}
export function getApiModelInfo(modelId: string) {
  return requireCore().getApiModelInfo(modelId);
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
export function truncate(s: string, maxLen: number): string {
  return requireCore().truncate(s, maxLen);
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
export function slugify(subject: string): string {
  return requireCore().slugify(subject);
}
export function shortDate(dateMs: number): string {
  return requireCore().shortDate(dateMs);
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

// ── Gmail API ───────────────────────────────────────────────────────────────

export async function getGmailProfile(token: string) {
  return requireCore().getGmailProfile(token);
}
export async function listGmailMessages(token: string, maxResults: number, pageToken?: string, q?: string) {
  return requireCore().listGmailMessages(token, maxResults, pageToken ?? null, q ?? null);
}
export async function getGmailMessage(token: string, messageId: string, format: string = "full") {
  return requireCore().getGmailMessage(token, messageId, format);
}
export async function getGmailMessagesBatch(token: string, messageIds: string[], batchSize: number = 8) {
  return requireCore().getGmailMessagesBatch(token, messageIds, batchSize);
}
export async function listGmailHistory(token: string, startHistoryId: string, pageToken?: string, maxResults: number = 500) {
  return requireCore().listGmailHistory(token, startHistoryId, pageToken ?? null, maxResults);
}
export function parseGmailBody(messageJson: string): string {
  return requireCore().parseGmailBody(messageJson);
}
export function parseGmailHtmlBody(messageJson: string): string | undefined {
  return requireCore().parseGmailHtmlBody(messageJson) ?? undefined;
}
export function getGmailHeader(messageJson: string, headerName: string): string {
  return requireCore().getGmailHeader(messageJson, headerName);
}

// ── Twitter API ──────────────────────────────────────────────────────────────

export async function getTwitterMe(token: string) {
  return requireCore().getTwitterMe(token);
}
export async function getTwitterUserTimeline(token: string, userId: string, maxResults: number = 10, paginationToken?: string) {
  return requireCore().getTwitterTimeline(token, userId, maxResults, paginationToken ?? null);
}
export async function getTwitterUserMentions(token: string, userId: string, maxResults: number = 10, paginationToken?: string) {
  return requireCore().getTwitterMentions(token, userId, maxResults, paginationToken ?? null);
}
export async function searchRecentTweets(token: string, query: string, maxResults: number = 10) {
  return requireCore().searchTwitterRecentTweets(token, query, maxResults);
}
export async function getTwitterTweet(token: string, tweetId: string) {
  return requireCore().getTwitterTweet(token, tweetId);
}
export async function likeTweet(token: string, userId: string, tweetId: string) {
  return requireCore().twitterLike(token, userId, tweetId);
}
export async function unlikeTweet(token: string, userId: string, tweetId: string) {
  return requireCore().twitterUnlike(token, userId, tweetId);
}
export async function retweetTweet(token: string, userId: string, tweetId: string) {
  return requireCore().twitterRetweet(token, userId, tweetId);
}
export async function unretweetTweet(token: string, userId: string, tweetId: string) {
  return requireCore().twitterUnretweet(token, userId, tweetId);
}
export async function bookmarkTweet(token: string, userId: string, tweetId: string) {
  return requireCore().twitterBookmark(token, userId, tweetId);
}
export async function removeBookmark(token: string, userId: string, tweetId: string) {
  return requireCore().twitterRemoveBookmark(token, userId, tweetId);
}
export async function muteUser(token: string, sourceUserId: string, targetUserId: string) {
  return requireCore().twitterMuteUser(token, sourceUserId, targetUserId);
}
export async function blockUser(token: string, sourceUserId: string, targetUserId: string) {
  return requireCore().twitterBlockUser(token, sourceUserId, targetUserId);
}

// ── Error parsing ────────────────────────────────────────────────────────────

export interface ParsedApiError {
  title: string;
  description: string;
  fix: string;
  action: string;
  link_url: string;
  link_label: string;
}
export function parseApiError(message: string, status: number): ParsedApiError {
  return requireCore().parseApiError(message, status) as unknown as ParsedApiError;
}

// ── LLM context ─────────────────────────────────────────────────────────────

export async function getDataSummary(): Promise<string> {
  return requireCore().getDataSummary();
}
export async function getDetailedSummary(): Promise<string> {
  return requireCore().getDetailedSummary();
}
export async function getRecentEmailsContext(limit: number): Promise<string> {
  return requireCore().getRecentEmailsContext(limit);
}
export async function buildLlmContext(): Promise<string> {
  return requireCore().buildLlmContext();
}
export async function buildEmailContext(userQuery?: string): Promise<string> {
  return requireCore().buildEmailContext(userQuery ?? null);
}
