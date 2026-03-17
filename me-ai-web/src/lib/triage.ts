/**
 * Email triage module.
 *
 * Classifies emails one-by-one through the LLM. Instead of a fixed set
 * of action types, the LLM freely determines the action, tags, and summary
 * for each email. Action categories emerge dynamically from the data.
 */

import {
  getItemsCountGmail,
  getEmailClassificationsCount,
  getItemsGmailByDateDesc,
  getEmailClassifications as coreGetEmailClassifications,
  putEmailClassification as corePutEmailClassification,
  updateEmailClassificationStatus as coreUpdateEmailClassificationStatus,
  clearEmailClassifications as coreClearEmailClassifications,
  deleteEmailClassificationsByAction as coreDeleteEmailClassificationsByAction,
  deleteEmailClassification as coreDeleteEmailClassification,
  buildSystemPrompt as coreBuildSystemPrompt,
  parseClassification as coreParseClassification,
  formatEmailPrompt as coreFormatEmailPrompt,
  actionColor as coreActionColor,
  tagColor as coreTagColor,
  getOnnxModelInfo as getModelInfo,
  getOllamaModelInfo,
  getApiModelInfo,
  getPluginsForPrompt as coreGetPluginsForPrompt,
} from "./core.js";
import { toJson, fromJson } from "./store/db.js";
import { groupByAction } from "./email-utils.js";
import { seedEventTypeFromLLM } from "./events.js";
import type { StoredItem } from "$lib/types";
import type { ClassificationResult, ScanResult, ScanOptions, ClassificationRow, GetClassificationsByCategoryOptions, TriageEngine } from "./core.js";
export type { ClassificationResult, ScanProgress, ScanResult } from "./core.js";

const DEFAULT_COUNT = 20;

/** Generation settings used for email classification (exported for transparency UI) */
export const CLASSIFICATION_CONFIG = {
  maxTokens: 2048,
  enableThinking: false,
  doSample: false,
};

/** System prompt for classification. Built from core using registered plugin names. */
export function getSystemPrompt(): string {
  const plugins = coreGetPluginsForPrompt();
  const pluginNames = plugins.filter((p) => p.actions.length).map((p) => p.pluginName).join(", ");
  return coreBuildSystemPrompt(pluginNames);
}


export async function scanEmails(
  engine: TriageEngine,
  options: ScanOptions = {}
): Promise<ScanResult> {
  const { count = DEFAULT_COUNT, force = false, onProgress = () => {}, signal } = options;

  if (!engine.isReady) {
    throw new Error("Model not loaded. Please load a model first.");
  }

  onProgress({ phase: "loading", message: "Loading recent emails..." });

  let toProcess: StoredItem[];
  let skipped = 0;

  if (force) {
    const rows = ((await getItemsGmailByDateDesc(count)) as unknown) as Record<string, unknown>[];
    toProcess = rows.map((r) => normaliseItemRow(r));
  } else {
    const [allItems, allClassifications] = await Promise.all([
      (getItemsGmailByDateDesc(5000) as unknown) as Promise<Record<string, unknown>[]>,
      (coreGetEmailClassifications(null, 5000) as unknown) as Promise<{ emailId?: string }[]>,
    ]);
    const classifiedIds = new Set((allClassifications ?? []).map((c) => c.emailId).filter(Boolean));
    toProcess = (allItems ?? [])
      .filter((r) => !classifiedIds.has(r.id as string))
      .slice(0, count)
      .map((r) => normaliseItemRow(r));
    skipped = Number((await getEmailClassificationsCount()) ?? 0);
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

  const plugins = coreGetPluginsForPrompt();
  const pluginNames = plugins.filter((p) => p.actions.length).map((p) => p.pluginName).join(", ");
  const systemPrompt = coreBuildSystemPrompt(pluginNames);

  const currentModel = engine.modelId;
  const modelInfo = getModelInfo(currentModel ?? "") ?? getOllamaModelInfo(currentModel ?? "") ?? getApiModelInfo(currentModel ?? "");
  if (!modelInfo) {
    throw new Error(`Unknown model: ${currentModel}`);
  }

  const modelDisplayName = (modelInfo as { displayName?: string; name?: string }).displayName ?? (modelInfo as { name?: string }).name;
  if (!(modelInfo as { recommendedForEmailProcessing?: boolean }).recommendedForEmailProcessing && toProcess.length > 0) {
    const { getOnnxModels: getModels } = await import("./core.js");
    const { getOllamaModels } = await import("./core.js");
    const recommendedModels = [
      ...getModels().filter((m: { recommendedForEmailProcessing?: boolean }) => m.recommendedForEmailProcessing).map((m: { name: string }) => m.name),
      ...getOllamaModels().filter((m: { recommendedForEmailProcessing?: boolean }) => m.recommendedForEmailProcessing).map((m: { displayName: string }) => m.displayName),
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
    const emailPrompt = coreFormatEmailPrompt(
      email.subject || "",
      email.from || "",
      (email as { to?: string }).to || "",
      email.date ?? 0,
      ((email as { labels?: string[] }).labels ?? []).join(", "),
      (email as { body?: string }).body ?? (email as { snippet?: string }).snippet ?? ""
    );
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
      prompt: { system: systemPrompt, user: emailPrompt },
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

      const coreResult = coreParseClassification(response);
      const classification: ClassificationResult | null = coreResult
        ? {
            action: coreResult.action,
            category: coreResult.category as "noise" | "info" | "critical",
            categoryTier: coreResult.categoryTier as "NOISE" | "INFO" | "CRITICAL",
            suggestedActions: [],
            reason: coreResult.reason,
            summary: coreResult.summary,
            tags: (() => {
              try {
                const parsed = JSON.parse(coreResult.tags) as unknown;
                return Array.isArray(parsed) ? (parsed as string[]) : [];
              } catch { return []; }
            })(),
          }
        : null;
      const emailElapsed = performance.now() - emailStart;

      if (classification) {
        await corePutEmailClassification(
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

export async function getClassificationsByCategory(
  opts: GetClassificationsByCategoryOptions = {}
): Promise<{ categories: Record<string, ClassificationRow[]>; order: string[] }> {
  const rows = ((await coreGetEmailClassifications(null, 5000)) as unknown) as Record<string, unknown>[];
  let list = (rows ?? []).map((r) => normaliseClassificationRow(r));
  if (opts.pendingOnly === true) {
    list = list.filter((r) => r.status === "pending" || r.status === "escalated");
  }
  return groupByAction(list);
}

export async function getClassificationCounts(): Promise<Record<string, number>> {
  const rows = (await coreGetEmailClassifications(null, 50000)) as { action?: string }[];
  const total = (rows ?? []).length;
  const counts: Record<string, number> = { total };
  for (const r of rows ?? []) {
    const k = r.action ?? "UNKNOWN";
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

export async function updateClassificationStatus(emailId: string, newStatus: string): Promise<void> {
  await coreUpdateEmailClassificationStatus(emailId, newStatus);
}

export async function clearClassifications(): Promise<void> {
  await coreClearEmailClassifications();
}

export async function clearClassificationsByAction(action: string): Promise<void> {
  await coreDeleteEmailClassificationsByAction(action);
}

export async function deleteClassification(emailId: string): Promise<void> {
  await coreDeleteEmailClassification(emailId);
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

/** Format an email as a prompt string for the LLM classifier. */
export function formatEmailPrompt(email: StoredItem | { subject?: string; from?: string; to?: string; date?: number | null; body?: string; snippet?: string; labels?: string[] }): string {
  return coreFormatEmailPrompt(
    (email as { subject?: string }).subject || "",
    (email as { from?: string }).from || "",
    (email as { to?: string }).to || "",
    email.date ?? 0,
    ((email as { labels?: string[] }).labels ?? []).join(", "),
    (email as { body?: string }).body ?? (email as { snippet?: string }).snippet ?? ""
  );
}

/**
 * Parse the LLM's JSON response for a single message classification.
 * Delegates to me-ai-core.
 */
export function parseClassification(
  response: string | null | undefined,
  _knownActionIds?: Set<string>
): ClassificationResult | null {
  if (response == null || typeof response !== "string" || !response.trim()) return null;
  const result = coreParseClassification(response);
  if (!result) return null;
  let tags: string[] = [];
  try {
    const parsed = JSON.parse(result.tags) as unknown;
    if (Array.isArray(parsed)) tags = parsed as string[];
  } catch { /* keep empty */ }
  return {
    action: result.action,
    category: result.category as "noise" | "info" | "critical",
    categoryTier: result.categoryTier as "NOISE" | "INFO" | "CRITICAL",
    suggestedActions: [],
    reason: result.reason,
    summary: result.summary,
    tags,
  };
}

export function actionColor(action: string): string {
  return coreActionColor(action);
}

export function tagColor(tag: string): string {
  return coreTagColor(tag);
}
