/**
 * Email triage — scan loop.
 *
 * All helper functions (classification CRUD, parsing, formatting, stats) are
 * in core.ts. This file exists only because the scan loop calls the browser's
 * LLM engine which cannot run in WASM.
 */

import { getCore } from "./store/core-store.js";
import { toJson } from "./store/db.js";
import {
  seedEventTypeFromLLM,
  getSystemPrompt,
  CLASSIFICATION_CONFIG,
  itemDateMs,
  parseClassification,
} from "./core.js";
import type { StoredItem } from "$lib/types";
import type {
  ClassificationResult,
  ScanResult,
  ScanOptions,
  TriageEngine,
  ItemRow,
} from "./core.js";

// Re-export for callers that still import from triage
export { scanEmails };
export type { ScanStats } from "./core.js";

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

async function scanEmails(engine: TriageEngine, options: ScanOptions = {}): Promise<ScanResult> {
  const { count = DEFAULT_COUNT, force = false, onProgress = () => {}, signal } = options;

  if (!engine.isReady) {
    throw new Error("Model not loaded. Please load a model first.");
  }

  onProgress({ phase: "loading", message: "Loading recent emails..." });

  let toProcess: StoredItem[];
  let skipped = 0;

  const core = getCore();
  if (force) {
    const rows = await core.getItemsGmailByDateDesc(count);
    toProcess = rows.map((r: ItemRow) => r.toStoredItem());
  } else {
    const [allItems, allClassifications] = await Promise.all([
      core.getItemsGmailByDateDesc(5000),
      core.getEmailClassifications(undefined, 5000),
    ]);
    const classifiedIds = new Set((allClassifications ?? []).map((c) => c.emailId).filter(Boolean));
    toProcess = (allItems ?? [])
      .filter((r) => !classifiedIds.has(r.id))
      .slice(0, count)
      .map((r) => r.toStoredItem());
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

  const systemPrompt = getSystemPrompt();

  const currentModel = engine.modelId;
  const modelInfo =
    core.getOnnxModelInfo(currentModel ?? "") ??
    core.getOllamaModelInfo(currentModel ?? "") ??
    core.getApiModelInfo(currentModel ?? "");
  if (!modelInfo) throw new Error(`Unknown model: ${currentModel}`);

  for (let i = 0; i < toProcess.length; i++) {
    if (signal?.aborted) break;

    const email = toProcess[i];
    const emailPrompt = core.formatEmailPrompt(
      email.subject || "",
      email.from || "",
      email.to || "",
      itemDateMs(email.date),
      (email.labels ?? []).join(", "),
      email.body ?? email.snippet ?? ""
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
        date: email.date != null ? String(itemDateMs(email.date)) : undefined,
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
              date: email.date != null ? String(itemDateMs(email.date)) : undefined,
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

      const classification = parseClassification(response);
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
          date: email.date != null ? itemDateMs(email.date) : undefined,
          scannedAt,
          status: "pending",
        });

        await seedEventTypeFromLLM(classification.action, classification.category);

        classified++;

        results.push({
          success: true,
          email: { subject: email.subject, from: email.from, date: itemDateMs(email.date) },
          classification,
          rawResponse: response,
          stats: { tps, numTokens, inputTokens, elapsed: emailElapsed },
          promptSize: emailPrompt.length,
        });

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
            date: email.date != null ? String(itemDateMs(email.date)) : undefined,
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
      results.push({
        success: false,
        email: { subject: email.subject, from: email.from, date: itemDateMs(email.date) },
        error: errMsg.length > 200 ? errMsg.slice(0, 200) + "..." : errMsg,
        promptSize: emailPrompt.length,
      });
    }
  }

  const totalElapsed = performance.now() - scanStart;
  const successResults = results.filter((r) => r.success && r.stats?.tps != null);
  const avgPromptSize =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + (r.promptSize ?? 0), 0) / results.length)
      : 0;
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
