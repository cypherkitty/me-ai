/**
 * Email triage module.
 *
 * Classifies emails one-by-one through the LLM. Instead of a fixed set
 * of action types, the LLM freely determines the action, tags, and summary
 * for each email. Action categories emerge dynamically from the data.
 */

import { getCore, getItemsCountGmail, getEmailClassificationsCount } from "./core.js";
import { toJson, fromJson } from "./store/db.js";
import { stringToHue } from "./format.js";
import { groupByAction } from "./email-utils.js";
import { getModelInfo } from "./models.js";
import { getOllamaModelInfo } from "./ollama-models.js";
import { seedEventTypeFromLLM } from "./events.js";
import { pluginRegistry } from "./plugins/plugin-registry.js";
import type { StoredItem } from "$lib/types";

const DEFAULT_COUNT = 20;

/** Generation settings used for email classification (exported for transparency UI) */
export const CLASSIFICATION_CONFIG = {
  maxTokens: 2048,
  enableThinking: false,
  doSample: false,
};

/** Minimal engine interface used for scanning (llm-engine or unified-engine). */
export interface TriageEngine {
  readonly isReady: boolean;
  readonly modelId: string | null;
  generateFull(
    messages: Array<{ role: string; content: string }>,
    options: { maxTokens?: number; enableThinking?: boolean; temperature?: number },
    onToken?: (info: { tps: number | null; numTokens: number; text: string }) => void
  ): Promise<{ text: string; tps: number | null; numTokens: number; inputTokens: number }>;
}

/** Plugin metadata passed to buildSystemPrompt. */
interface PluginForPrompt {
  pluginId: string;
  pluginName: string;
  actions: Array<{ actionId: string }>;
}

/** Progress callback payload during scan (varied shapes by phase). */
export interface ScanProgress {
  phase: string;
  message?: string;
  current?: number;
  total?: number;
  classified?: number;
  errors?: number;
  results?: unknown[];
  email?: { subject?: string; from?: string; date?: string };
  prompt?: { system?: string; user?: string };
  systemPromptLength?: number;
  live?: { tps?: number | null; numTokens?: number } | null;
  lastResult?: unknown;
  totals?: { outputTokens?: number; inputTokens?: number; elapsed?: number };
  streamingText?: string;
  result?: ClassificationResult;
  rawResponse?: string;
  emailStats?: { tps: number | null; numTokens: number; inputTokens: number; elapsed: number };
  summary?: {
    avgPromptSize?: number;
    avgTps?: number | null;
    systemPromptSize?: number;
    processed?: number;
    skipped?: number;
    modelName?: string;
    modelContextWindow?: number;
    modelMaxEmailTokens?: number;
  };
}

/** Parsed classification from LLM response. */
export interface ClassificationResult {
  action: string;
  category: "noise" | "info" | "critical";
  categoryTier: "NOISE" | "INFO" | "CRITICAL";
  suggestedActions: string[];
  reason: string;
  summary: string;
  tags: string[];
}

/** Options for scanEmails. */
export interface ScanOptions {
  count?: number;
  force?: boolean;
  onProgress?: (p: ScanProgress) => void;
  signal?: AbortSignal;
}

/** Result of scanEmails. */
export interface ScanResult {
  scanned: number;
  classified: number;
  skipped: number;
  errors: number;
}

/** Row shape from emailClassifications table (normalised). */
export interface ClassificationRow {
  emailId: string;
  action: string;
  category: string;
  reason: string;
  summary: string;
  tags: string[];
  subject: string;
  from: string;
  date: number | null;
  scannedAt: number | null;
  status?: string;
  [key: string]: unknown;
}

/**
 * Build the system prompt dynamically from the currently registered plugins.
 */
export function buildSystemPrompt(plugins: PluginForPrompt[]): string {
  const pluginNames = plugins
    .filter((p) => p.actions.length)
    .map((p) => p.pluginName)
    .join(", ");

  return `You are a message classifier. Analyze this message and produce a classification.

Output ONLY a valid JSON object — no markdown, no explanation, no extra text.

Format:
{
  "action": "EVENT_TYPE_NAME",
  "category": "noise",
  "reason": "One sentence explaining why",
  "summary": "2-3 sentence summary of the message content",
  "tags": ["tag1", "tag2", "tag3"]
}

Guidelines for "action" (Event Type):
- Condense the message's core purpose into a distinct, high-level event type.
- This MUST be a flexible, dynamically generated string categorizing the *nature* of the message.
- Examples: RECEIPT, SHIPPING_UPDATE, NEWSLETTER, SECURITY_ALERT, ACCOUNT_NOTICE, PROMOTION, BILLING_REMINDER, JOB_ALERT, SOCIAL_MENTION
- Do not use verbs. Use noun phrases that describe the event type.
- Reuse existing event types when the message fits — avoid creating very similar types.

Guidelines for "category" (Event Category — exactly three tiers):
- "noise"    — Pure spam, mass marketing, social media digests, promotional blasts. Will be automatically deleted. Use ONLY when you are certain.
- "info"     — Useful but not urgent: newsletters, shipping updates, social notifications, automated confirmations. Will be silently archived.
- "critical" — Requires attention: personal messages, work emails, invoices, account changes, financial transactions, security alerts. User must review.
- When in doubt, always use "critical" — it is safer.
- "noise" auto-deletes, so be extremely conservative with it.

Guidelines for "tags":
- 2-5 short lowercase tags describing the message's nature
- Examples: ad, promotion, newsletter, delivery, billing, personal, work, social, receipt, shipping, subscription, security, update, notification, finance, travel
- Be descriptive and specific

Guidelines for "summary":
- 2-3 sentences capturing the key information
- Include specific details: amounts, dates, names, tracking numbers, deadlines
- Write from the perspective of what matters to the recipient

Active integrations: ${pluginNames || "(none)"}

Rules:
- Output ONLY the JSON object, nothing else. No prefixes like ---set or --set, no markdown, no code fences.
- "action" must be UPPER_SNAKE_CASE and describe the message type (e.g. PROMOTION, RECEIPT). Never use connection strings, config values, or technical jargon.
- "category" must be exactly one of: "noise", "info", "critical"
- "reason" and "summary" must be plain English about the message content only. Do not insert config variables or technical strings.
- "tags" must be an array of lowercase strings
- "summary" must be a string`;
}

function getPluginsForPrompt(): PluginForPrompt[] {
  return pluginRegistry.getAllPlugins().map((plugin) => ({
    pluginId: plugin.pluginId,
    pluginName: plugin.serviceName,
    actions: plugin.getHandlers().map((h) => ({ actionId: h.actionId })),
  }));
}

export const SYSTEM_PROMPT = buildSystemPrompt(getPluginsForPrompt());

export async function scanEmails(
  engine: TriageEngine,
  options: ScanOptions = {}
): Promise<ScanResult> {
  const { count = DEFAULT_COUNT, force = false, onProgress = () => {}, signal } = options;

  if (!engine.isReady) {
    throw new Error("Model not loaded. Please load a model first.");
  }

  onProgress({ phase: "loading", message: "Loading recent emails..." });

  const w = await getCore();
  let toProcess: StoredItem[];
  let skipped = 0;

  if (force) {
    const rows = (await w.getItemsGmailByDateDesc(count)) as Record<string, unknown>[];
    toProcess = rows.map((r) => normaliseItemRow(r));
  } else {
    const [allItems, allClassifications] = await Promise.all([
      w.getItemsGmailByDateDesc(5000) as Promise<Record<string, unknown>[]>,
      w.getEmailClassifications(null, 5000) as Promise<{ emailId?: string }[]>,
    ]);
    const classifiedIds = new Set((allClassifications ?? []).map((c) => c.emailId).filter(Boolean));
    toProcess = (allItems ?? [])
      .filter((r) => !classifiedIds.has(r.id as string))
      .slice(0, count)
      .map((r) => normaliseItemRow(r));
    skipped = Number((await w.getEmailClassificationsCount()) ?? 0);
  }

  if (toProcess.length === 0) {
    const msg = force
      ? "No emails to scan."
      : `All emails already classified (${skipped} total). Use "Rescan All" to reclassify.`;
    onProgress({ phase: "done", message: msg, classified: 0 });
    return { scanned: 0, classified: 0, skipped, errors: 0 };
  }

  const scannedAt = Date.now();
  const scanStart = performance.now();
  let classified = 0;
  let errors = 0;
  let totalOutputTokens = 0;
  let totalInputTokens = 0;
  const results: unknown[] = [];

  const plugins = getPluginsForPrompt();
  const systemPrompt = buildSystemPrompt(plugins);
  const validActionIds = new Set(plugins.flatMap((p) => p.actions.map((a) => a.actionId)));

  const currentModel = engine.modelId;
  const modelInfo = getModelInfo(currentModel ?? "") ?? getOllamaModelInfo(currentModel ?? "");
  if (!modelInfo) {
    throw new Error(`Unknown model: ${currentModel}`);
  }

  const modelDisplayName = (modelInfo as { displayName?: string; name?: string }).displayName ?? (modelInfo as { name?: string }).name;
  if (!(modelInfo as { recommendedForEmailProcessing?: boolean }).recommendedForEmailProcessing && toProcess.length > 0) {
    const { MODELS } = await import("./models.js");
    const { OLLAMA_MODELS } = await import("./ollama-models.js");
    const recommendedModels = [
      ...MODELS.filter((m: { recommendedForEmailProcessing?: boolean }) => m.recommendedForEmailProcessing).map((m: { name: string }) => m.name),
      ...OLLAMA_MODELS.filter((m: { recommendedForEmailProcessing?: boolean }) => m.recommendedForEmailProcessing).map((m: { displayName: string }) => m.displayName),
    ];
    console.warn(
      `⚠️ Current model (${modelDisplayName}) is not optimized for email processing. ` +
        `For best results with long emails, use: ${recommendedModels.join(", ")}. ` +
        `Some emails may fail due to memory limits.`
    );
  }

  for (let i = 0; i < toProcess.length; i++) {
    if (signal?.aborted) break;

    const email = toProcess[i];
    const emailPrompt = formatEmailPrompt(email);
    const promptMessages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: emailPrompt },
    ];

    onProgress({
      phase: "scanning",
      current: i + 1,
      total: toProcess.length,
      classified,
      errors,
      results,
      email: { subject: email.subject, from: email.from, date: email.date != null ? String(email.date) : undefined },
      prompt: { system: SYSTEM_PROMPT, user: emailPrompt },
      systemPromptLength: systemPrompt.length,
      live: null,
      lastResult: null,
      totals: { outputTokens: totalOutputTokens, inputTokens: totalInputTokens, elapsed: performance.now() - scanStart },
    });

    const emailStart = performance.now();

    try {
      const { text: response, tps, numTokens, inputTokens } = await engine.generateFull(
        promptMessages,
        { maxTokens: CLASSIFICATION_CONFIG.maxTokens, enableThinking: false, temperature: 0 },
        (tokenInfo) => {
          onProgress({
            phase: "generating",
            current: i + 1,
            total: toProcess.length,
            classified,
            errors,
            results,
            email: { subject: email.subject, from: email.from, date: email.date != null ? String(email.date) : undefined },
            live: { tps: tokenInfo.tps, numTokens: tokenInfo.numTokens },
            streamingText: tokenInfo.text || "",
            totals: { outputTokens: totalOutputTokens, inputTokens: totalInputTokens, elapsed: performance.now() - scanStart },
          });
        }
      );

      totalOutputTokens += numTokens;
      totalInputTokens += inputTokens;

      const classification = parseClassification(response, validActionIds);
      const emailElapsed = performance.now() - emailStart;

      if (classification) {
        await w.putEmailClassification(
          email.id,
          classification.action,
          classification.categoryTier,
          classification.reason,
          classification.summary,
          toJson(classification.tags),
          email.subject || "(no subject)",
          email.from || "",
          email.date ?? null,
          scannedAt,
          "pending"
        );

        await seedEventTypeFromLLM(
          classification.action,
          classification.category,
          classification.suggestedActions
        );

        classified++;

        const emailResult = {
          success: true,
          email: { subject: email.subject, from: email.from, date: email.date },
          classification,
          rawResponse: response,
          stats: { tps, numTokens, inputTokens, elapsed: emailElapsed },
          promptSize: emailPrompt.length,
        };
        results.push(emailResult);

        onProgress({
          phase: "classified",
          current: i + 1,
          total: toProcess.length,
          classified,
          errors,
          results,
          email: { subject: email.subject, from: email.from, date: email.date != null ? String(email.date) : undefined },
          result: classification,
          rawResponse: response,
          emailStats: { tps, numTokens, inputTokens, elapsed: emailElapsed },
          totals: { outputTokens: totalOutputTokens, inputTokens: totalInputTokens, elapsed: performance.now() - scanStart },
        });
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      console.error(`Triage email ${i + 1} failed:`, err);
      errors++;
      const errMsg = err.message;
      const truncatedError = errMsg.length > 200 ? errMsg.slice(0, 200) + "..." : errMsg;
      results.push({
        success: false,
        email: { subject: email.subject, from: email.from, date: email.date },
        error: truncatedError,
        promptSize: emailPrompt.length,
      });
    }
  }

  const totalElapsed = performance.now() - scanStart;
  const avgPromptSize =
    results.length > 0
      ? Math.round(
          (results as { promptSize?: number }[]).reduce((sum, r) => sum + (r.promptSize ?? 0), 0) / results.length
        )
      : 0;
  const successResults = (results as { success?: boolean; stats?: { tps?: number } }[]).filter((r) => r.success && r.stats?.tps);
  const avgTps =
    successResults.length > 0
      ? Math.round(successResults.reduce((sum, r) => sum + (r.stats?.tps ?? 0), 0) / successResults.length)
      : null;

  const modelInfoAny = modelInfo as { displayName?: string; name?: string; contextWindow?: number; maxEmailTokens?: number };
  onProgress({
    phase: "done",
    current: toProcess.length,
    total: toProcess.length,
    classified,
    errors,
    results,
    summary: {
      avgPromptSize,
      avgTps,
      systemPromptSize: systemPrompt.length,
      processed: toProcess.length,
      skipped,
      modelName: modelInfoAny.displayName ?? modelInfoAny.name,
      modelContextWindow: modelInfoAny.contextWindow,
      modelMaxEmailTokens: modelInfoAny.maxEmailTokens,
    },
    totals: { outputTokens: totalOutputTokens, inputTokens: totalInputTokens, elapsed: totalElapsed },
  });

  return { scanned: toProcess.length, classified, skipped, errors };
}

export async function getClassifications(options: { action?: string } = {}): Promise<ClassificationRow[]> {
  const w = await getCore();
  const rows = (await w.getEmailClassifications(options.action ?? null, undefined)) as Record<string, unknown>[];
  return (rows ?? []).map((r) => normaliseClassificationRow(r));
}

export interface GetClassificationsByCategoryOptions {
  pendingOnly?: boolean;
}

export async function getClassificationsByCategory(
  opts: GetClassificationsByCategoryOptions = {}
): Promise<{ categories: Record<string, ClassificationRow[]>; order: string[] }> {
  const w = await getCore();
  const rows = (await w.getEmailClassifications(null, 5000)) as Record<string, unknown>[];
  let list = (rows ?? []).map((r) => normaliseClassificationRow(r));
  if (opts.pendingOnly === true) {
    list = list.filter((r) => r.status === "pending" || r.status === "escalated");
  }
  return groupByAction(list);
}

export async function getClassificationCounts(): Promise<Record<string, number>> {
  const w = await getCore();
  const rows = (await w.getEmailClassifications(null, 50000)) as { action?: string }[];
  const total = (rows ?? []).length;
  const counts: Record<string, number> = { total };
  for (const r of rows ?? []) {
    const k = r.action ?? "UNKNOWN";
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

export async function getTagCounts(): Promise<Record<string, number>> {
  const w = await getCore();
  const rows = (await w.getEmailClassifications(null, 50000)) as { tags?: string }[];
  const tagMap: Record<string, number> = {};
  for (const r of rows ?? []) {
    const tags = fromJson(r.tags, []) as string[];
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        tagMap[tag] = (tagMap[tag] ?? 0) + 1;
      }
    }
  }
  return tagMap;
}

export async function updateClassificationStatus(emailId: string, newStatus: string): Promise<void> {
  const w = await getCore();
  await w.updateEmailClassificationStatus(emailId, newStatus);
}

export async function clearClassifications(): Promise<void> {
  const w = await getCore();
  await w.clearEmailClassifications();
}

export async function clearClassificationsByAction(action: string): Promise<void> {
  const w = await getCore();
  await w.deleteEmailClassificationsByAction(action);
}

export async function deleteClassification(emailId: string): Promise<void> {
  const w = await getCore();
  await w.deleteEmailClassification(emailId);
}

export async function getScanStats(): Promise<{
  totalEmails: number;
  classified: number;
  unclassified: number;
}> {
  const [totalEmails, classified] = await Promise.all([
    getItemsCountGmail().then((n) => Number(n ?? 0)),
    getEmailClassificationsCount().then((n) => Number(n ?? 0)),
  ]);
  return {
    totalEmails,
    classified,
    unclassified: Math.max(0, totalEmails - classified),
  };
}

function normaliseItemRow(row: Record<string, unknown>): StoredItem {
  return {
    ...row,
    date: row.date != null ? Number(row.date) : null,
    syncedAt: row.syncedAt != null ? Number(row.syncedAt) : null,
    labels: fromJson(String(row.labels ?? ""), []) as string[],
    raw: fromJson(row.raw != null ? String(row.raw) : null, null),
  } as StoredItem;
}

function normaliseClassificationRow(row: Record<string, unknown>): ClassificationRow {
  return {
    ...row,
    date: row.date != null ? Number(row.date) : null,
    scannedAt: row.scannedAt != null ? Number(row.scannedAt) : null,
    tags: fromJson(row.tags != null ? String(row.tags) : null, []) as string[],
  } as ClassificationRow;
}

export function formatEmailPrompt(email: StoredItem | { subject?: string; from?: string; to?: string; date?: number | null; body?: string; snippet?: string; labels?: string[] }): string {
  const date =
    email.date != null
      ? new Date(email.date).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Unknown date";
  const body = (email as { body?: string }).body ?? (email as { snippet?: string }).snippet ?? "";

  return [
    `Subject: ${(email as { subject?: string }).subject}`,
    `From: ${(email as { from?: string }).from}`,
    `To: ${(email as { to?: string }).to ?? "me"}`,
    `Date: ${date}`,
    `Labels: ${((email as { labels?: string[] }).labels ?? []).join(", ")}`,
    "",
    body,
  ].join("\n");
}

/**
 * Parse the LLM's JSON response for a single message classification.
 */
export function parseClassification(
  response: string | null | undefined,
  _knownActionIds?: Set<string>
): ClassificationResult | null {
  if (response == null || typeof response !== "string" || !response.trim()) return null;

  let text = response.trim();
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
  text = text.replace(/^[\s\-]*set\s+/gi, "").replace(/^---+\s*/, "");
  text = text.trim();

  const firstBracket = text.indexOf("[");
  const firstBrace = text.indexOf("{");
  const lastBracket = text.lastIndexOf("]");
  const lastBrace = text.lastIndexOf("}");

  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    const arrayStr = text.slice(firstBracket, lastBracket + 1);
    try {
      const parsed = JSON.parse(arrayStr);
      if (Array.isArray(parsed)) return null;
    } catch {
      /* fall through */
    }
  }

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    console.warn("Triage: no JSON object found in response");
    return null;
  }

  let jsonStr = text.slice(firstBrace, lastBrace + 1);
  jsonStr = jsonStr.replace(/\s*--set\s+/gi, " ");

  try {
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const rawAction = String(parsed.action ?? "").trim();
    if (/[=]|postgres|sslmode|require|connection|config/i.test(rawAction)) {
      console.warn("Triage: invalid action (looks like config/jargon):", rawAction.slice(0, 60));
      return null;
    }

    const action = normalizeAction(rawAction);
    if (!action) {
      console.warn("Triage: missing or invalid action field");
      return null;
    }
    if (action.length > 50 || /POSTGRES|SSLMODE|REQUIRE|CONNECTION/.test(action)) {
      console.warn("Triage: action rejected as jargon:", action.slice(0, 40));
      return null;
    }

    const VALID_CATEGORIES = ["noise", "info", "critical"];
    const rawCategory = (String(parsed.category ?? "")).toLowerCase().trim();
    const parsedCategoryTier = parsed.categoryTier as string | undefined;
    let category: "noise" | "info" | "critical";
    if (VALID_CATEGORIES.includes(rawCategory)) {
      category = rawCategory as "noise" | "info" | "critical";
    } else if (rawCategory === "noise" || parsedCategoryTier === "NOISE") {
      category = "noise";
    } else if (rawCategory === "informational") {
      category = "info";
    } else if (
      rawCategory === "important" ||
      rawCategory === "urgent" ||
      parsedCategoryTier === "CRITICAL" ||
      parsedCategoryTier === "IMPORTANT" ||
      parsedCategoryTier === "URGENT"
    ) {
      category = "critical";
    } else {
      category = "critical";
    }

    const categoryTier = category === "noise" ? "NOISE" : category === "info" ? "INFO" : "CRITICAL";
    const suggestedActions: string[] = [];

    let tags: string[] = [];
    if (Array.isArray(parsed.tags)) {
      tags = parsed.tags
        .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
        .map((t) => t.trim().toLowerCase())
        .slice(0, 10);
    }

    const sanitize = (s: unknown): string => {
      let out = String(s ?? "").trim();
      out = out.replace(/\bpostgres[-\s]?sslmode\s*=\s*require\b/gi, "");
      out = out.replace(/\s*--set\s+/gi, " ").replace(/\s{2,}/g, " ").trim();
      return out.slice(0, 500);
    };
    const reason = sanitize(parsed.reason).slice(0, 300);
    const summary = sanitize(parsed.summary).slice(0, 500);

    return {
      action,
      category,
      categoryTier,
      suggestedActions,
      reason,
      summary,
      tags,
    };
  } catch (e) {
    console.warn("Triage: failed to parse JSON response:", e instanceof Error ? e.message : e);
    return null;
  }
}

function normalizeAction(raw: unknown): string | null {
  if (!raw || typeof raw !== "string") return null;
  const cleaned = raw.trim().toUpperCase().replace(/[\s-]+/g, "_").replace(/[^A-Z0-9_]/g, "");
  return cleaned || null;
}

export function actionColor(action: string): string {
  return `hsl(${stringToHue(action)}, 55%, 55%)`;
}

export function tagColor(tag: string): string {
  return `hsl(${stringToHue(tag)}, 40%, 35%)`;
}
