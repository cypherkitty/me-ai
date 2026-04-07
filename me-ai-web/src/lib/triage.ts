/**
 * Email triage module.
 *
 * Classifies emails one-by-one through the LLM. Instead of a fixed set
 * of action types, the LLM freely determines the action, tags, and summary
 * for each email. Action categories emerge dynamically from the data.
 */

import { getCore } from "./store/core-store.js";
import { toJson, fromJson } from "./store/db.js";
import { seedEventTypeFromLLM } from "./events.js";
import type { StoredItem } from "$lib/types";
import type {
  ClassificationResult,
  ScanResult,
  ScanOptions,
  ClassificationView,
  GetClassificationsByCategoryOptions,
  TriageEngine,
  StoredItemRow,
} from "./core.js";
export type { ClassificationResult, ScanProgress, ScanResult } from "./core.js";

interface ScanEmailResult {
  success: boolean;
  email: { subject?: string; from?: string; date?: number | null };
  classification?: ClassificationResult;
  rawResponse?: string;
  stats?: { tps: number | null; numTokens: number; inputTokens: number; elapsed: number };
  promptSize: number;
  error?: string;
}

const DEFAULT_COUNT = 20;

/** Generation settings used for email classification (exported for transparency UI) */
export const CLASSIFICATION_CONFIG = {
  maxTokens: 2048,
  enableThinking: false,
  doSample: false,
};

/** System prompt for classification. Built from core using registered plugin names. */
export function getSystemPrompt(): string {
  const c = getCore();
  const plugins = c.getPluginsForPrompt();
  const pluginNames = plugins
    .filter((p) => p.actions.length)
    .map((p) => p.pluginName)
    .join(", ");
  return c.buildSystemPrompt(pluginNames);
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

  const core = getCore();
  if (force) {
    const rows = (await core.getItemsGmailByDateDesc(count)) as unknown as StoredItemRow[];
    toProcess = rows.map((r) => normaliseItemRow(r as unknown as Record<string, unknown>));
  } else {
    const [allItems, allClassifications] = await Promise.all([
      core.getItemsGmailByDateDesc(5000) as unknown as Promise<StoredItemRow[]>,
      core.getEmailClassifications(undefined, 5000) as unknown as Promise<{ emailId?: string }[]>,
    ]);
    const classifiedIds = new Set((allClassifications ?? []).map((c) => c.emailId).filter(Boolean));
    toProcess = (allItems ?? [])
      .filter((r) => !classifiedIds.has((r as unknown as Record<string, unknown>).id as string))
      .slice(0, count)
      .map((r) => normaliseItemRow(r as unknown as Record<string, unknown>));
    skipped = Number((await core.getEmailClassificationsCount()) ?? 0);
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
  const results: ScanEmailResult[] = [];

  const plugins = core.getPluginsForPrompt();
  const pluginNames = plugins
    .filter((p) => p.actions.length)
    .map((p) => p.pluginName)
    .join(", ");
  const systemPrompt = core.buildSystemPrompt(pluginNames);

  const currentModel = engine.modelId;
  const modelInfo =
    core.getOnnxModelInfo(currentModel ?? "") ??
    core.getOllamaModelInfo(currentModel ?? "") ??
    core.getApiModelInfo(currentModel ?? "");
  if (!modelInfo) {
    throw new Error(`Unknown model: ${currentModel}`);
  }

  const modelDisplayName =
    (modelInfo as { displayName?: string; name?: string }).displayName ??
    (modelInfo as { name?: string }).name;
  if (
    !(modelInfo as { recommendedForEmailProcessing?: boolean }).recommendedForEmailProcessing &&
    toProcess.length > 0
  ) {
    const recommendedModels = [
      ...core
        .getOnnxModels()
        .filter((m) => m.recommendedForEmailProcessing)
        .map((m) => m.name),
      ...core
        .getOllamaModels()
        .filter((m) => m.recommendedForEmailProcessing)
        .map((m) => m.displayName),
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
    const emailPrompt = core.formatEmailPrompt(
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
      email: {
        subject: email.subject,
        from: email.from,
        date: email.date != null ? String(email.date) : undefined,
      },
      prompt: { system: systemPrompt, user: emailPrompt },
      systemPromptLength: systemPrompt.length,
      live: null,
      lastResult: null,
      totals: {
        outputTokens: totalOutputTokens,
        inputTokens: totalInputTokens,
        elapsed: performance.now() - scanStart,
      },
    });

    const emailStart = performance.now();

    try {
      const {
        text: response,
        tps,
        numTokens,
        inputTokens,
      } = await engine.generateFull(
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
            email: {
              subject: email.subject,
              from: email.from,
              date: email.date != null ? String(email.date) : undefined,
            },
            live: { tps: tokenInfo.tps, numTokens: tokenInfo.numTokens },
            streamingText: tokenInfo.text || "",
            totals: {
              outputTokens: totalOutputTokens,
              inputTokens: totalInputTokens,
              elapsed: performance.now() - scanStart,
            },
          });
        }
      );

      totalOutputTokens += numTokens;
      totalInputTokens += inputTokens;

      const coreResult = core.parseClassification(response);
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
                const parsed: unknown = JSON.parse(coreResult.tags);
                return Array.isArray(parsed) ? (parsed as string[]) : [];
              } catch {
                return [];
              }
            })(),
          }
        : null;
      const emailElapsed = performance.now() - emailStart;

      if (classification) {
        await core.putEmailClassification({
          emailId: email.id,
          action: classification.action,
          category: classification.categoryTier,
          reason: classification.reason,
          summary: classification.summary,
          tags: toJson(classification.tags),
          subject: email.subject || "(no subject)",
          from: email.from || "",
          date: email.date ?? undefined,
          scannedAt,
          status: "pending",
        });

        await seedEventTypeFromLLM(
          classification.action,
          classification.category,
          classification.suggestedActions
        );

        classified++;

        const emailResult: ScanEmailResult = {
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
          email: {
            subject: email.subject,
            from: email.from,
            date: email.date != null ? String(email.date) : undefined,
          },
          result: classification,
          rawResponse: response,
          emailStats: { tps, numTokens, inputTokens, elapsed: emailElapsed },
          totals: {
            outputTokens: totalOutputTokens,
            inputTokens: totalInputTokens,
            elapsed: performance.now() - scanStart,
          },
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
      } satisfies ScanEmailResult);
    }
  }

  const totalElapsed = performance.now() - scanStart;
  const avgPromptSize =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + (r.promptSize ?? 0), 0) / results.length)
      : 0;
  const successResults = results.filter((r) => r.success && r.stats?.tps != null);
  const avgTps =
    successResults.length > 0
      ? Math.round(
          successResults.reduce((sum, r) => sum + (r.stats?.tps ?? 0), 0) / successResults.length
        )
      : null;

  const modelInfoAny = modelInfo as {
    displayName?: string;
    name?: string;
    contextWindow?: number;
    maxEmailTokens?: number;
  };
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
    totals: {
      outputTokens: totalOutputTokens,
      inputTokens: totalInputTokens,
      elapsed: totalElapsed,
    },
  });

  return { scanned: toProcess.length, classified, skipped, errors };
}

export async function getClassificationsByCategory(
  opts: GetClassificationsByCategoryOptions = {}
): Promise<{ categories: Record<string, ClassificationView[]>; order: string[] }> {
  return getCore().getClassificationsByCategory(opts.pendingOnly === true);
}

export async function getClassificationCounts(): Promise<Record<string, number>> {
  const result = await getCore().getClassificationCounts();
  // Flatten { counts, total } to a single Record for backward compat
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

export async function getScanStats(): Promise<{
  totalEmails: number;
  classified: number;
  unclassified: number;
}> {
  const c = getCore();
  const [totalEmails, classified] = await Promise.all([
    c.getItemsCountGmail().then((n) => Number(n ?? 0)),
    c.getEmailClassificationsCount().then((n) => Number(n ?? 0)),
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

// normaliseClassificationRow — removed: normalisation now happens in Rust
// (tags JSON parsing + field defaulting is done by ClassificationView in me-ai-core)

/** Format an email as a prompt string for the LLM classifier. */
export function formatEmailPrompt(
  email:
    | StoredItem
    | {
        subject?: string;
        from?: string;
        to?: string;
        date?: number | null;
        body?: string;
        snippet?: string;
        labels?: string[];
      }
): string {
  return getCore().formatEmailPrompt(
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
  const result = getCore().parseClassification(response);
  if (!result) return null;
  let tags: string[] = [];
  try {
    const parsed: unknown = JSON.parse(result.tags);
    if (Array.isArray(parsed)) tags = parsed as string[];
  } catch {
    /* keep empty */
  }
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
  return getCore().actionColor(action);
}

export function tagColor(tag: string): string {
  return getCore().tagColor(tag);
}
