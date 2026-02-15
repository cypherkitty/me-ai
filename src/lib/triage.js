/**
 * Email triage module.
 *
 * Scans recent emails through the LLM in batches, extracts actionable items
 * (todos, calendar events, notes), and stores them in IndexedDB.
 */

import { db } from "./store/db.js";
import Dexie from "dexie";

const DEFAULT_COUNT = 20;
const DEFAULT_BATCH_SIZE = 5;

// ── System prompt ────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an email triage assistant. Analyze the emails below and identify which ones require action from the recipient.

For each email, output a JSON object. If it needs action, include the extracted items.
Output ONLY a valid JSON array — no markdown, no explanation, no extra text.

Format:
[
  {
    "emailIndex": 0,
    "actions": [
      {
        "type": "todo",
        "title": "Short action title",
        "description": "Brief description of what needs to be done",
        "dueDate": "YYYY-MM-DD or null",
        "priority": "high"
      }
    ]
  }
]

Rules:
- "type" must be one of: "todo", "calendar", "note"
- "priority" must be one of: "high", "medium", "low"
- "dueDate" should be a date string if mentioned, otherwise null
- If an email needs NO action, use: {"emailIndex": N, "actions": []}
- Use "todo" for tasks requiring a response or action
- Use "calendar" for meetings, events, deadlines with specific dates/times
- Use "note" for important information to remember (shipping updates, policy changes, etc.)
- Output ONLY the JSON array, nothing else`;

// ── Public API ───────────────────────────────────────────────────────

/**
 * Scan recent emails through the LLM to extract action items.
 *
 * @param {object} engine - Shared LLM engine from llm-engine.js
 * @param {object} options
 * @param {number} [options.count=20] - Number of recent emails to scan
 * @param {number} [options.batchSize=5] - Emails per LLM prompt
 * @param {function} [options.onProgress] - Progress callback
 * @returns {Promise<{scanned: number, actionsFound: number, errors: number}>}
 */
export async function scanEmails(
  engine,
  { count = DEFAULT_COUNT, batchSize = DEFAULT_BATCH_SIZE, onProgress = () => {} } = {}
) {
  if (!engine.isReady) {
    throw new Error("Model not loaded. Please load a model first.");
  }

  // Step 1: Get recent emails from IndexedDB
  onProgress({ phase: "loading", message: "Loading recent emails..." });

  const emails = await db.items
    .where("[sourceType+date]")
    .between(["gmail", Dexie.minKey], ["gmail", Dexie.maxKey])
    .reverse()
    .limit(count)
    .toArray();

  if (emails.length === 0) {
    onProgress({ phase: "done", message: "No emails to scan." });
    return { scanned: 0, actionsFound: 0, errors: 0 };
  }

  // Step 2: Split into batches
  const batches = [];
  for (let i = 0; i < emails.length; i += batchSize) {
    batches.push(emails.slice(i, i + batchSize));
  }

  const scannedAt = Date.now();
  let totalActions = 0;
  let totalErrors = 0;

  // Step 3: Process each batch
  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx];

    onProgress({
      phase: "scanning",
      message: `Scanning batch ${batchIdx + 1} of ${batches.length}...`,
      batch: batchIdx + 1,
      totalBatches: batches.length,
      actionsFound: totalActions,
    });

    try {
      const prompt = formatBatchPrompt(batch);
      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ];

      const response = await engine.generateFull(messages);
      const parsed = parseTriageResponse(response);

      // Store action items
      const items = extractActionItems(parsed, batch, scannedAt);
      if (items.length > 0) {
        await db.actionItems.bulkAdd(items);
        totalActions += items.length;
      }
    } catch (e) {
      console.error(`Triage batch ${batchIdx + 1} failed:`, e);
      totalErrors++;
    }
  }

  onProgress({
    phase: "done",
    message: `Scanned ${emails.length} emails, found ${totalActions} actions.`,
    actionsFound: totalActions,
  });

  return { scanned: emails.length, actionsFound: totalActions, errors: totalErrors };
}

/**
 * Get all action items, optionally filtered by type and/or status.
 */
export async function getActionItems({ type, status } = {}) {
  let collection;

  if (type && status) {
    collection = db.actionItems.where("[type+status]").equals([type, status]);
  } else if (type) {
    collection = db.actionItems.where("type").equals(type);
  } else if (status) {
    collection = db.actionItems.where("status").equals(status);
  } else {
    collection = db.actionItems.toCollection();
  }

  return collection.reverse().sortBy("createdAt");
}

/**
 * Update an action item's status.
 */
export async function updateActionStatus(id, newStatus) {
  await db.actionItems.update(id, { status: newStatus });
}

/**
 * Clear all action items.
 */
export async function clearActionItems() {
  await db.actionItems.clear();
}

/**
 * Get counts by type.
 */
export async function getActionCounts() {
  const all = await db.actionItems.toArray();
  const counts = { total: all.length, todo: 0, calendar: 0, note: 0, new: 0, done: 0, dismissed: 0 };
  for (const item of all) {
    if (item.type in counts) counts[item.type]++;
    if (item.status in counts) counts[item.status]++;
  }
  return counts;
}

// ── Prompt formatting ────────────────────────────────────────────────

function formatBatchPrompt(emails) {
  return emails
    .map((email, idx) => {
      const date = email.date
        ? new Date(email.date).toLocaleDateString("en-US", {
            weekday: "short", year: "numeric", month: "short", day: "numeric",
          })
        : "Unknown date";
      const body = truncate(email.body || email.snippet || "", 400);

      return [
        `--- Email ${idx} ---`,
        `Subject: ${email.subject}`,
        `From: ${email.from}`,
        `To: ${email.to || "me"}`,
        `Date: ${date}`,
        `Labels: ${(email.labels || []).join(", ")}`,
        "",
        body,
      ].join("\n");
    })
    .join("\n\n");
}

function truncate(str, maxLen) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "...";
}

// ── Response parsing ─────────────────────────────────────────────────

/**
 * Parse the LLM's JSON response. Handles:
 * - Clean JSON arrays
 * - JSON wrapped in markdown code blocks
 * - Partial/malformed responses
 *
 * @param {string} response - Raw LLM output
 * @returns {Array} Parsed array of triage results
 */
export function parseTriageResponse(response) {
  if (!response || !response.trim()) return [];

  let text = response.trim();

  // Strip markdown code blocks
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
  text = text.trim();

  // Find the JSON array boundaries
  const firstBracket = text.indexOf("[");
  const lastBracket = text.lastIndexOf("]");

  if (firstBracket === -1 || lastBracket === -1 || lastBracket <= firstBracket) {
    console.warn("Triage: no JSON array found in response");
    return [];
  }

  const jsonStr = text.slice(firstBracket, lastBracket + 1);

  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.warn("Triage: failed to parse JSON response:", e.message);
    return [];
  }
}

// ── Action item extraction ───────────────────────────────────────────

function extractActionItems(parsed, emails, scannedAt) {
  const items = [];

  for (const entry of parsed) {
    const emailIdx = entry.emailIndex;
    const email = emails[emailIdx];
    if (!email || !entry.actions || !Array.isArray(entry.actions)) continue;

    for (const action of entry.actions) {
      if (!action.type || !action.title) continue;

      const type = ["todo", "calendar", "note"].includes(action.type) ? action.type : "note";
      const priority = ["high", "medium", "low"].includes(action.priority) ? action.priority : "medium";

      let dueDate = null;
      if (action.dueDate && action.dueDate !== "null") {
        try {
          dueDate = new Date(action.dueDate).getTime();
          if (isNaN(dueDate)) dueDate = null;
        } catch {
          dueDate = null;
        }
      }

      items.push({
        type,
        status: "new",
        title: String(action.title).slice(0, 200),
        description: String(action.description || "").slice(0, 500),
        sourceItemId: email.id,
        sourceSubject: email.subject || "(no subject)",
        priority,
        dueDate,
        createdAt: scannedAt,
        scannedAt,
      });
    }
  }

  return items;
}
