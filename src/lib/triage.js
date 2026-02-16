/**
 * Email triage module.
 *
 * Classifies emails one-by-one through the LLM. Instead of a fixed set
 * of action types, the LLM freely determines the action, tags, and summary
 * for each email. Action groups emerge dynamically from the data.
 */

import { db } from "./store/db.js";
import Dexie from "dexie";
import { truncate, stringToHue } from "./format.js";
import { groupByAction } from "./email-utils.js";

const DEFAULT_COUNT = 20;

/** Generation settings used for email classification (exported for transparency UI) */
export const CLASSIFICATION_CONFIG = {
  maxTokens: 512,
  enableThinking: false,
  doSample: false,
};

// ── System prompt ────────────────────────────────────────────────────

export const SYSTEM_PROMPT = `You are an email classifier. Analyze this email and produce a classification.

Output ONLY a valid JSON object — no markdown, no explanation, no extra text.

Format:
{
  "action": "SHORT_ACTION_NAME",
  "reason": "One sentence explaining why",
  "summary": "2-3 sentence summary of the email content",
  "tags": ["tag1", "tag2", "tag3"]
}

Guidelines for "action":
- Use a short UPPER_SNAKE_CASE label that describes what the user should do
- Examples: DELETE, REPLY, REVIEW, READ_LATER, ARCHIVE, PAY_BILL, TRACK_DELIVERY, SCHEDULE_MEETING, UNSUBSCRIBE, SAVE_RECEIPT, FOLLOW_UP, ACKNOWLEDGE, IGNORE
- Be specific: prefer "TRACK_DELIVERY" over "NOTIFY", prefer "PAY_BILL" over "REVIEW"
- If genuinely nothing to do, use "NO_ACTION"

Guidelines for "tags":
- 2-5 short lowercase tags describing the email's nature
- Examples: ad, promotion, newsletter, delivery, billing, personal, work, social, receipt, shipping, subscription, security, update, notification, newsletter, finance, travel
- Be descriptive and specific

Guidelines for "summary":
- 2-3 sentences capturing the key information
- Include specific details: amounts, dates, names, tracking numbers, deadlines
- Write from the perspective of what matters to the recipient

Rules:
- Output ONLY the JSON object, nothing else
- "action" must be UPPER_SNAKE_CASE
- "tags" must be an array of lowercase strings
- "summary" must be a string`;

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
 * @returns {Promise<{scanned: number, classified: number, skipped: number, errors: number}>}
 */
export async function scanEmails(
  engine,
  { count = DEFAULT_COUNT, force = false, onProgress = () => {} } = {}
) {
  if (!engine.isReady) {
    throw new Error("Model not loaded. Please load a model first.");
  }

  onProgress({ phase: "loading", message: "Loading recent emails..." });

  let toProcess;
  let skipped = 0;

  if (force) {
    // Rescan: take the N most recent emails regardless of classification status
    toProcess = await db.items
      .where("[sourceType+date]")
      .between(["gmail", Dexie.minKey], ["gmail", Dexie.maxKey])
      .reverse()
      .limit(count)
      .toArray();
  } else {
    // Scan new: find unclassified emails without loading all data.
    // Only fetch primary keys from classifications (lightweight) and
    // iterate emails with early termination once we have enough.
    const classifiedIds = new Set(
      await db.emailClassifications.toCollection().primaryKeys()
    );

    skipped = 0;
    toProcess = [];
    await db.items
      .where("[sourceType+date]")
      .between(["gmail", Dexie.minKey], ["gmail", Dexie.maxKey])
      .reverse()
      .until(() => toProcess.length >= count)
      .each((email) => {
        if (classifiedIds.has(email.id)) {
          skipped++;
        } else {
          toProcess.push(email);
        }
      });
  }

  if (toProcess.length === 0) {
    const msg = force
      ? "No emails to scan."
      : `All emails already classified (${skipped} total). Use "Rescan All" to reclassify.`;
    onProgress({ phase: "done", message: msg, classified: 0 });
    return { scanned: 0, classified: 0, skipped, errors: 0 };
  }

  const scannedAt = Date.now();
  let classified = 0;
  let errors = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const email = toProcess[i];

    onProgress({
      phase: "scanning",
      message: `Classifying email ${i + 1} of ${toProcess.length}${skipped ? ` (${skipped} skipped)` : ""}...`,
      current: i + 1,
      total: toProcess.length,
      classified,
    });

    try {
      const prompt = formatEmailPrompt(email);
      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ];

      const response = await engine.generateFull(messages, {
        maxTokens: 512,
        enableThinking: false,
      });
      const classification = parseClassification(response);

      if (classification) {
        await db.emailClassifications.put({
          emailId: email.id,
          action: classification.action,
          reason: classification.reason,
          summary: classification.summary,
          tags: classification.tags,
          subject: email.subject || "(no subject)",
          from: email.from || "",
          date: email.date,
          scannedAt,
          status: "pending",
        });
        classified++;
      }
    } catch (e) {
      console.error(`Triage email ${i + 1} failed:`, e);
      errors++;
    }
  }

  onProgress({
    phase: "done",
    message: `Classified ${classified} of ${toProcess.length} emails${skipped ? `, ${skipped} already done` : ""}.`,
    classified,
  });

  return { scanned: toProcess.length, classified, skipped, errors };
}

/**
 * Get all classifications, optionally filtered by action type.
 */
export async function getClassifications({ action } = {}) {
  if (action) {
    return db.emailClassifications.where("action").equals(action).reverse().sortBy("date");
  }
  return db.emailClassifications.reverse().sortBy("date");
}

/**
 * Get classifications grouped by action type (dynamic — groups emerge from data).
 * Returns an object: action -> array of classifications, sorted by date desc.
 * Also returns the group order sorted by count descending.
 */
export async function getClassificationsGrouped() {
  const all = await db.emailClassifications.toArray();
  return groupByAction(all);
}

/**
 * Get count per action type (dynamic).
 */
export async function getClassificationCounts() {
  const all = await db.emailClassifications.toArray();
  const counts = { total: all.length };
  for (const item of all) {
    const key = item.action || "UNKNOWN";
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

/**
 * Get all unique tags with their counts.
 */
export async function getTagCounts() {
  const all = await db.emailClassifications.toArray();
  const tagMap = {};
  for (const item of all) {
    if (Array.isArray(item.tags)) {
      for (const tag of item.tags) {
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
  await db.emailClassifications.update(emailId, { status: newStatus });
}

/**
 * Clear all classifications.
 */
export async function clearClassifications() {
  await db.emailClassifications.clear();
}

/**
 * Clear classifications for a specific action group.
 */
export async function clearClassificationsByAction(action) {
  await db.emailClassifications.where("action").equals(action).delete();
}

/**
 * Delete a single classification by emailId.
 */
export async function deleteClassification(emailId) {
  await db.emailClassifications.delete(emailId);
}

/**
 * Get scan stats: total emails in storage, how many classified, how many unclassified.
 */
export async function getScanStats() {
  const totalEmails = await db.items.where("sourceType").equals("gmail").count();
  const classified = await db.emailClassifications.count();
  return {
    totalEmails,
    classified,
    unclassified: Math.max(0, totalEmails - classified),
  };
}

// ── Prompt formatting ────────────────────────────────────────────────

export function formatEmailPrompt(email) {
  const date = email.date
    ? new Date(email.date).toLocaleDateString("en-US", {
        weekday: "short", year: "numeric", month: "short", day: "numeric",
      })
    : "Unknown date";
  const body = truncate(email.body || email.snippet || "", 500);

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
 * Parse the LLM's JSON response for a single email classification.
 * Expects: {"action": "...", "reason": "...", "summary": "...", "tags": [...]}
 *
 * Action types are freeform — any UPPER_SNAKE_CASE string is accepted.
 *
 * @param {string} response - Raw LLM output
 * @returns {object|null} Parsed classification or null
 */
export function parseClassification(response) {
  if (!response || !response.trim()) return null;

  let text = response.trim();

  // Strip markdown code blocks
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
  text = text.trim();

  // Try to find a JSON object (not inside an array)
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    console.warn("Triage: no JSON object found in response");
    return null;
  }

  const firstBracket = text.indexOf("[");
  if (firstBracket !== -1 && firstBracket < firstBrace) {
    console.warn("Triage: expected JSON object, got array");
    return null;
  }

  const jsonStr = text.slice(firstBrace, lastBrace + 1);

  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    // Action is required
    const action = normalizeAction(parsed.action);
    if (!action) {
      console.warn("Triage: missing or invalid action field");
      return null;
    }

    // Tags: normalize to array of lowercase strings
    let tags = [];
    if (Array.isArray(parsed.tags)) {
      tags = parsed.tags
        .filter((t) => typeof t === "string" && t.trim())
        .map((t) => t.trim().toLowerCase())
        .slice(0, 10);
    }

    return {
      action,
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
