/**
 * Email triage module.
 *
 * Classifies emails one-by-one through the LLM. Instead of a fixed set
 * of action types, the LLM freely determines the action, tags, and summary
 * for each email. Action groups emerge dynamically from the data.
 */

import { query, exec, toJson, fromJson } from "./store/db.js";
import { stringToHue } from "./format.js";
import { groupByAction } from "./email-utils.js";
import { getModelInfo } from "./models.js";
import { getOllamaModelInfo } from "./ollama-models.js";
import { seedEventTypeFromLLM } from "./events.js";
import { pluginRegistry } from "./plugins/plugin-registry.js";

const DEFAULT_COUNT = 20;

/** Generation settings used for email classification (exported for transparency UI) */
export const CLASSIFICATION_CONFIG = {
  maxTokens: 2048, // reasoning models need room for <think> blocks before the JSON
  enableThinking: false,
  doSample: false,
};

// ── System prompt ────────────────────────────────────────────────────

/**
 * Build the system prompt dynamically from the currently registered plugins.
 * The LLM's job is to classify messages into an event_type and a category.
 * Categories carry their own default pipelines — the LLM does NOT suggest actions.
 *
 * @param {{ pluginId: string, pluginName: string, actions: import('./plugins/base-plugin.js').ActionHandler[] }[]} plugins
 * @returns {string}
 */
export function buildSystemPrompt(plugins) {
  // We still list plugins so the LLM knows the platform context,
  // but it no longer needs to suggest specific action IDs.
  const pluginNames = plugins
    .filter(p => p.actions.length)
    .map(p => p.pluginName)
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

Guidelines for "category" (Event Category):
- Classify the message into one of four tiers:
  - "noise"         — Pure spam, mass marketing, social media digests, promotional blasts. Will be automatically deleted. Use ONLY when you are certain.
  - "informational" — Useful but not urgent: newsletters, shipping updates, social notifications, automated confirmations. Will be silently archived.
  - "important"     — Requires attention: personal messages, work emails, invoices, account changes, financial transactions. User must review.
  - "urgent"        — Needs immediate action: security alerts, payment failures, time-sensitive deadlines. User must act now.
- When in doubt, always use "important" — it is safer.
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
- Output ONLY the JSON object, nothing else
- "action" must be UPPER_SNAKE_CASE
- "category" must be exactly one of: "noise", "informational", "important", "urgent"
- "tags" must be an array of lowercase strings
- "summary" must be a string`;
}

/**
 * Collect plugin metadata for the prompt from the global registry.
 * Returns an array ready to pass to buildSystemPrompt().
 */
function getPluginsForPrompt() {
  return pluginRegistry.getAllPlugins().map(plugin => ({
    pluginId: plugin.pluginId,
    pluginName: plugin.serviceName,
    actions: plugin.getHandlers(),
  }));
}

/**
 * SYSTEM_PROMPT — snapshot built at module load time.
 * Used only for display (e.g. "View Prompt" button in ScanLiveView).
 * The actual scan uses a freshly-built prompt via buildSystemPrompt().
 */
export const SYSTEM_PROMPT = buildSystemPrompt(getPluginsForPrompt());

// ── Public API ───────────────────────────────────────────────────────

/**
 * Scan recent emails through the LLM to classify them.
 * Each email is processed individually.
 *
 * @param {object} engine - Shared LLM engine from llm-engine.js
 * @param {object} options
 * @param {number} [options.count=20] - Number of recent emails to scan
 * @param {boolean} [options.force=false] - If true, rescan already-classified emails
 * @param {function} [options.onProgress] - Progress callback
 * @param {AbortSignal} [options.signal] - Abort signal for cancellation
 * @returns {Promise<{scanned: number, classified: number, skipped: number, errors: number}>}
 */
export async function scanEmails(
  engine,
  { count = DEFAULT_COUNT, force = false, onProgress = () => { }, signal } = {}
) {
  if (!engine.isReady) {
    throw new Error("Model not loaded. Please load a model first.");
  }

  onProgress({ phase: "loading", message: "Loading recent emails..." });

  let toProcess;
  let skipped = 0;

  if (force) {
    const rows = await query(
      `SELECT * FROM items WHERE sourceType = 'gmail' ORDER BY date DESC LIMIT ?`,
      [count]
    );
    toProcess = rows.map(normaliseItemRow);
  } else {
    const rows = await query(
      `SELECT i.* FROM items i
       LEFT JOIN emailClassifications ec ON ec.emailId = i.id
       WHERE i.sourceType = 'gmail' AND ec.emailId IS NULL
       ORDER BY i.date DESC
       LIMIT ?`,
      [count]
    );
    toProcess = rows.map(normaliseItemRow);

    const [skipRow] = await query(
      `SELECT COUNT(*) AS cnt FROM emailClassifications`
    );
    skipped = Number(skipRow?.cnt ?? 0);
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
  const results = [];

  const plugins = getPluginsForPrompt();
  const systemPrompt = buildSystemPrompt(plugins);
  const validActionIds = new Set(plugins.flatMap(p => p.actions.map(a => a.actionId)));

  const currentModel = engine.modelId;
  const modelInfo = getModelInfo(currentModel) || getOllamaModelInfo(currentModel);
  if (!modelInfo) {
    throw new Error(`Unknown model: ${currentModel}`);
  }

  if (!modelInfo.recommendedForEmailProcessing && toProcess.length > 0) {
    const { MODELS } = await import("./models.js");
    const { OLLAMA_MODELS } = await import("./ollama-models.js");
    const recommendedModels = [
      ...MODELS.filter(m => m.recommendedForEmailProcessing).map(m => m.name),
      ...OLLAMA_MODELS.filter(m => m.recommendedForEmailProcessing).map(m => m.displayName),
    ];
    const displayName = modelInfo.displayName || modelInfo.name;
    console.warn(
      `⚠️ Current model (${displayName}) is not optimized for email processing. ` +
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
      email: { subject: email.subject, from: email.from, date: email.date },
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
            email: { subject: email.subject, from: email.from, date: email.date },
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
        await exec(
          `INSERT INTO emailClassifications
             (emailId, action, "group", reason, summary, tags, subject, "from", date, scannedAt, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
           ON CONFLICT (emailId) DO UPDATE SET
             action    = excluded.action,
             "group"   = excluded."group",
             reason    = excluded.reason,
             summary   = excluded.summary,
             tags      = excluded.tags,
             subject   = excluded.subject,
             "from"    = excluded."from",
             date      = excluded.date,
             scannedAt = excluded.scannedAt,
             status    = 'pending'`,
          [
            email.id,
            classification.action,
            classification.group,
            classification.reason,
            classification.summary,
            toJson(classification.tags),
            email.subject || "(no subject)",
            email.from || "",
            email.date,
            scannedAt,
          ]
        );

        // Auto-seed event type with its category (category pipeline applies automatically)
        await seedEventTypeFromLLM(
          classification.action,
          classification.category,
          classification.suggestedActions,
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
          email: { subject: email.subject, from: email.from, date: email.date },
          result: classification,
          rawResponse: response,
          emailStats: { tps, numTokens, inputTokens, elapsed: emailElapsed },
          totals: { outputTokens: totalOutputTokens, inputTokens: totalInputTokens, elapsed: performance.now() - scanStart },
        });
      }
    } catch (e) {
      console.error(`Triage email ${i + 1} failed:`, e);
      errors++;
      const errMsg = e.message || String(e);
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
  const avgPromptSize = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.promptSize, 0) / results.length)
    : 0;
  const avgTps = results.filter(r => r.success && r.stats?.tps).length > 0
    ? Math.round(results.filter(r => r.success).reduce((sum, r) => sum + (r.stats?.tps || 0), 0) / results.filter(r => r.success && r.stats?.tps).length)
    : null;

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
      modelName: modelInfo.displayName || modelInfo.name,
      modelContextWindow: modelInfo.contextWindow,
      modelMaxEmailTokens: modelInfo.maxEmailTokens,
    },
    totals: { outputTokens: totalOutputTokens, inputTokens: totalInputTokens, elapsed: totalElapsed },
  });

  return { scanned: toProcess.length, classified, skipped, errors };
}

/**
 * Get all classifications, optionally filtered by action type.
 */
export async function getClassifications({ action } = {}) {
  const rows = action
    ? await query(`SELECT * FROM emailClassifications WHERE action = ? ORDER BY date DESC`, [action])
    : await query(`SELECT * FROM emailClassifications ORDER BY date DESC`);
  return rows.map(normaliseClassificationRow);
}

/**
 * Get classifications grouped by action type (dynamic — groups emerge from data).
 * Returns an object: action -> array of classifications, sorted by date desc.
 * Also returns the group order sorted by count descending.
 *
 * @param {{ pendingOnly?: boolean }} [opts] - If pendingOnly: true, only include
 *   status IN ('pending', 'escalated'); exclude already executed/handled.
 */
export async function getClassificationsGrouped(opts = {}) {
  const sql =
    opts.pendingOnly === true
      ? `SELECT * FROM emailClassifications WHERE status IN ('pending', 'escalated')`
      : `SELECT * FROM emailClassifications`;
  const rows = await query(sql);
  return groupByAction(rows.map(normaliseClassificationRow));
}

/**
 * Get count per action type (dynamic).
 */
export async function getClassificationCounts() {
  const rows = await query(
    `SELECT action, COUNT(*) AS cnt FROM emailClassifications GROUP BY action`
  );
  const [totalRow] = await query(`SELECT COUNT(*) AS cnt FROM emailClassifications`);
  const counts = { total: Number(totalRow?.cnt ?? 0) };
  for (const r of rows) {
    counts[r.action || "UNKNOWN"] = Number(r.cnt);
  }
  return counts;
}

/**
 * Get all unique tags with their counts.
 */
export async function getTagCounts() {
  const rows = await query(`SELECT tags FROM emailClassifications`);
  const tagMap = {};
  for (const r of rows) {
    const tags = fromJson(r.tags, []);
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      }
    }
  }
  return tagMap;
}

/**
 * Update a classification's status.
 */
export async function updateClassificationStatus(emailId, newStatus) {
  await exec(
    `UPDATE emailClassifications SET status = ? WHERE emailId = ?`,
    [newStatus, emailId]
  );
}

/**
 * Clear all classifications.
 */
export async function clearClassifications() {
  await exec(`DELETE FROM emailClassifications`);
}

/**
 * Clear classifications for a specific action group.
 */
export async function clearClassificationsByAction(action) {
  await exec(`DELETE FROM emailClassifications WHERE action = ?`, [action]);
}

/**
 * Delete a single classification by emailId.
 */
export async function deleteClassification(emailId) {
  await exec(`DELETE FROM emailClassifications WHERE emailId = ?`, [emailId]);
}

/**
 * Get scan stats: total emails in storage, how many classified, how many unclassified.
 */
export async function getScanStats() {
  const [emailRow] = await query(
    `SELECT COUNT(*) AS cnt FROM items WHERE sourceType = 'gmail'`
  );
  const [classRow] = await query(`SELECT COUNT(*) AS cnt FROM emailClassifications`);
  const totalEmails = Number(emailRow?.cnt ?? 0);
  const classified = Number(classRow?.cnt ?? 0);
  return {
    totalEmails,
    classified,
    unclassified: Math.max(0, totalEmails - classified),
  };
}

// ── Row normalisers ──────────────────────────────────────────────────

function normaliseItemRow(row) {
  return {
    ...row,
    date: row.date != null ? Number(row.date) : null,
    syncedAt: row.syncedAt != null ? Number(row.syncedAt) : null,
    labels: fromJson(row.labels, []),
    raw: fromJson(row.raw, null),
  };
}

function normaliseClassificationRow(row) {
  return {
    ...row,
    date: row.date != null ? Number(row.date) : null,
    scannedAt: row.scannedAt != null ? Number(row.scannedAt) : null,
    tags: fromJson(row.tags, []),
  };
}

// ── Prompt formatting ────────────────────────────────────────────────

export function formatEmailPrompt(email) {
  const date = email.date
    ? new Date(email.date).toLocaleDateString("en-US", {
      weekday: "short", year: "numeric", month: "short", day: "numeric",
    })
    : "Unknown date";
  const body = email.body || email.snippet || "";

  return [
    `Subject: ${email.subject}`,
    `From: ${email.from}`,
    `To: ${email.to || "me"}`,
    `Date: ${date}`,
    `Labels: ${(email.labels || []).join(", ")}`,
    "",
    body,
  ].join("\n");
}


// ── Response parsing ─────────────────────────────────────────────────

/**
 * Parse the LLM's JSON response for a single message classification.
 * Expects: {"action": "...", "category": "...", "reason": "...", "summary": "...", "tags": [...]}
 *
 * Action types are freeform — any UPPER_SNAKE_CASE string is accepted.
 * Category must be one of: noise, informational, important, urgent.
 *
 * @param {string} response - Raw LLM output
 * @param {Set<string>} [knownActionIds] - Unused (kept for API compat)
 * @returns {object|null} Parsed classification or null
 */
export function parseClassification(response, knownActionIds) {
  if (!response || !response.trim()) return null;

  let text = response.trim();

  // Strip <think>...</think> blocks produced by reasoning models (GPT-OSS, Qwen3, etc.)
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // Strip markdown code blocks
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
  text = text.trim();

  const firstBracket = text.indexOf("[");
  const firstBrace = text.indexOf("{");
  const lastBracket = text.lastIndexOf("]");
  const lastBrace = text.lastIndexOf("}");

  // If top-level is an array, reject (we expect a single classification object).
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    const arrayStr = text.slice(firstBracket, lastBracket + 1);
    try {
      const parsed = JSON.parse(arrayStr);
      if (Array.isArray(parsed)) return null;
    } catch { /* not valid JSON array, fall through */ }
  }

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    console.warn("Triage: no JSON object found in response");
    return null;
  }

  const jsonStr = text.slice(firstBrace, lastBrace + 1);

  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const action = normalizeAction(parsed.action);
    if (!action) {
      console.warn("Triage: missing or invalid action field");
      return null;
    }

    // Parse category (new 4-tier model) — also accept legacy "group" field
    const VALID_CATEGORIES = ["noise", "informational", "important", "urgent"];
    const rawCategory = (parsed.category || parsed.group || "").toLowerCase().trim();
    // Map legacy 2-tier values to new 4-tier
    let category;
    if (VALID_CATEGORIES.includes(rawCategory)) {
      category = rawCategory;
    } else if (rawCategory === "noise" || parsed.group === "NOISE") {
      category = "noise";
    } else {
      category = "important"; // safe default
    }

    // Backward compat: derive legacy group from category
    const group = category === "noise" ? "NOISE" : "IMPORTANT";

    // suggestedActions removed — categories carry their own pipelines
    const suggestedActions = [];

    let tags = [];
    if (Array.isArray(parsed.tags)) {
      tags = parsed.tags
        .filter((t) => typeof t === "string" && t.trim())
        .map((t) => t.trim().toLowerCase())
        .slice(0, 10);
    }

    return {
      action,
      category,
      group,           // backward compat
      suggestedActions, // always empty, kept for API compat
      reason: String(parsed.reason || "").slice(0, 300),
      summary: String(parsed.summary || "").slice(0, 500),
      tags,
    };
  } catch (e) {
    console.warn("Triage: failed to parse JSON response:", e.message);
    return null;
  }
}

/**
 * Normalize an action string to UPPER_SNAKE_CASE.
 */
function normalizeAction(raw) {
  if (!raw || typeof raw !== "string") return null;
  const cleaned = raw.trim().toUpperCase().replace(/[\s-]+/g, "_").replace(/[^A-Z0-9_]/g, "");
  return cleaned || null;
}

// ── Color generation ─────────────────────────────────────────────────

/**
 * Generate a stable HSL color from a string (for dynamic action groups).
 * Same string always produces the same color.
 */
export function actionColor(action) {
  return `hsl(${stringToHue(action)}, 55%, 55%)`;
}

/**
 * Generate a stable HSL color for tags (softer palette).
 */
export function tagColor(tag) {
  return `hsl(${stringToHue(tag)}, 40%, 35%)`;
}
