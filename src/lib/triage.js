/**
 * Email triage module.
 *
 * Classifies emails one-by-one through the LLM, assigning each email
 * an action type (DELETE, NOTIFY, READ_SUMMARIZE, REPLY_NEEDED, REVIEW,
 * NO_ACTION) and stores the classification locally in IndexedDB.
 *
 * The UI groups emails by their action type so users can act in bulk.
 */

import { db } from "./store/db.js";
import Dexie from "dexie";

const DEFAULT_COUNT = 20;

// ── Action types ─────────────────────────────────────────────────────

export const ACTION_TYPES = {
  DELETE:         { id: "DELETE",         label: "Delete",          color: "#f87171", icon: "trash",     description: "Ad, spam, or useless notification — safe to delete" },
  NOTIFY:         { id: "NOTIFY",         label: "Notify Me",      color: "#fbbf24", icon: "bell",      description: "Important event happened — delivery, payment, etc." },
  READ_SUMMARIZE: { id: "READ_SUMMARIZE", label: "Read & Summarize", color: "#3b82f6", icon: "book",   description: "Newsletter or digest — LLM should read and highlight key info" },
  REPLY_NEEDED:   { id: "REPLY_NEEDED",   label: "Reply Needed",   color: "#a78bfa", icon: "reply",     description: "Requires a response from you" },
  REVIEW:         { id: "REVIEW",         label: "Review",         color: "#f59e0b", icon: "eye",       description: "Needs your attention — billing, account changes, decisions" },
  NO_ACTION:      { id: "NO_ACTION",      label: "No Action",      color: "#666",    icon: "check",     description: "Informational only, no action needed" },
};

export const VALID_ACTIONS = Object.keys(ACTION_TYPES);

// ── System prompt ────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an email classifier. Classify this email into exactly ONE action type.

Output ONLY a valid JSON object — no markdown, no explanation, no extra text.

Format:
{
  "action": "DELETE",
  "reason": "Promotional email from a store"
}

Action types:
- "DELETE" — Ads, promotions, spam, useless status notifications (e.g. "shipped" without tracking info). Safe to delete.
- "NOTIFY" — Something important happened that the user should know about: package delivered, payment confirmed, account alert. User needs a short notification.
- "READ_SUMMARIZE" — Newsletter, digest, or content-heavy email (e.g. Rust Weekly, tech news). Worth reading — summarize the key points.
- "REPLY_NEEDED" — Someone is asking a question, requesting a meeting, or waiting for a response. The user needs to reply.
- "REVIEW" — Needs human attention: billing issues, subscription changes, legal notices, account security. Not urgent enough to notify, but should be reviewed.
- "NO_ACTION" — Purely informational, already handled, or auto-generated confirmation. No action needed.

Rules:
- Pick exactly ONE action type
- "reason" should be a brief (1 sentence) explanation of why
- Output ONLY the JSON object, nothing else`;

// ── Public API ───────────────────────────────────────────────────────

/**
 * Scan recent emails through the LLM to classify them by action type.
 * Each email is processed individually.
 *
 * @param {object} engine - Shared LLM engine from llm-engine.js
 * @param {object} options
 * @param {number} [options.count=20] - Number of recent emails to scan
 * @param {function} [options.onProgress] - Progress callback
 * @returns {Promise<{scanned: number, classified: number, errors: number}>}
 */
export async function scanEmails(
  engine,
  { count = DEFAULT_COUNT, onProgress = () => {} } = {}
) {
  if (!engine.isReady) {
    throw new Error("Model not loaded. Please load a model first.");
  }

  onProgress({ phase: "loading", message: "Loading recent emails..." });

  const emails = await db.items
    .where("[sourceType+date]")
    .between(["gmail", Dexie.minKey], ["gmail", Dexie.maxKey])
    .reverse()
    .limit(count)
    .toArray();

  if (emails.length === 0) {
    onProgress({ phase: "done", message: "No emails to scan." });
    return { scanned: 0, classified: 0, errors: 0 };
  }

  const scannedAt = Date.now();
  let classified = 0;
  let errors = 0;

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];

    onProgress({
      phase: "scanning",
      message: `Classifying email ${i + 1} of ${emails.length}...`,
      current: i + 1,
      total: emails.length,
      classified,
    });

    try {
      const prompt = formatEmailPrompt(email);
      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ];

      const response = await engine.generateFull(messages);
      const classification = parseClassification(response);

      if (classification) {
        await db.emailClassifications.put({
          emailId: email.id,
          action: classification.action,
          reason: String(classification.reason || "").slice(0, 300),
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
    message: `Classified ${classified} of ${emails.length} emails.`,
    classified,
  });

  return { scanned: emails.length, classified, errors };
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
 * Get classifications grouped by action type.
 * Returns a Map: action -> array of classifications.
 */
export async function getClassificationsGrouped() {
  const all = await db.emailClassifications.toArray();
  const groups = {};
  for (const actionId of VALID_ACTIONS) {
    groups[actionId] = [];
  }
  for (const item of all) {
    const key = VALID_ACTIONS.includes(item.action) ? item.action : "NO_ACTION";
    groups[key].push(item);
  }
  // Sort each group by date descending
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => (b.date || 0) - (a.date || 0));
  }
  return groups;
}

/**
 * Get count per action type.
 */
export async function getClassificationCounts() {
  const all = await db.emailClassifications.toArray();
  const counts = { total: all.length };
  for (const actionId of VALID_ACTIONS) {
    counts[actionId] = 0;
  }
  for (const item of all) {
    const key = VALID_ACTIONS.includes(item.action) ? item.action : "NO_ACTION";
    counts[key]++;
  }
  return counts;
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

// ── Prompt formatting ────────────────────────────────────────────────

function formatEmailPrompt(email) {
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

function truncate(str, maxLen) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "...";
}

// ── Response parsing ─────────────────────────────────────────────────

/**
 * Parse the LLM's JSON response for a single email classification.
 * Expects: {"action": "DELETE", "reason": "..."}
 *
 * Handles:
 * - Clean JSON objects
 * - JSON wrapped in markdown code blocks
 * - JSON with surrounding text
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

  // Reject if the outermost structure is an array
  const firstBracket = text.indexOf("[");
  if (firstBracket !== -1 && firstBracket < firstBrace) {
    console.warn("Triage: expected JSON object, got array");
    return null;
  }

  const jsonStr = text.slice(firstBrace, lastBrace + 1);

  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const action = String(parsed.action || "").toUpperCase();
    if (!VALID_ACTIONS.includes(action)) {
      console.warn("Triage: unknown action type:", parsed.action);
      return null;
    }

    return {
      action,
      reason: parsed.reason || "",
    };
  } catch (e) {
    console.warn("Triage: failed to parse JSON response:", e.message);
    return null;
  }
}
