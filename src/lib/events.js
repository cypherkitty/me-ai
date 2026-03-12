/**
 * Event Stream + Action Pipeline
 *
 * Single urgency model: NOISE / INFO / CRITICAL (3 tiers).
 * Category names in DB and rules use lowercase: noise, info, critical.
 *
 *   EventType     — what kind of content (ad, newsletter, invoice, …)
 *   Event category — NOISE | INFO | CRITICAL (execution policy tier)
 *   category_name — noise | info | critical (stored in DB, used by rules)
 */

/**
 * @typedef {Object} Action
 * @property {string} id          — unique step identifier within the pipeline (usually same as commandId)
 * @property {string} pluginId    — plugin that handles this step (e.g. "gmail")
 * @property {string} commandId   — handler ID on that plugin (e.g. "trash")
 * @property {string} name        — display name
 * @property {string} description — what it does
 * @property {string} [icon]      — optional emoji
 */

/**
 * @typedef {Object} EmailEvent
 * @property {string} type     — event type (e.g. "REVIEW", "DELETE")
 * @property {string} source   — origin (e.g. "gmail")
 * @property {Object} data     — email payload
 * @property {Object} metadata — scan metadata (category, summary, reason, tags, etc.)
 */

/**
 * @typedef {"NOISE"|"INFO"|"CRITICAL"} EventGroup
 * Event category (execution policy tier). Stored in DB as category_name: noise | info | critical.
 */

/**
 * Event categories (3 tiers). Stored in DB as category_name: noise | info | critical.
 * NOISE    — auto-execute pipeline
 * INFO     — supervised (execute then notify)
 * CRITICAL — require explicit user approval
 */
export const EVENT_GROUPS = {
  NOISE: {
    id: "NOISE",
    label: "Noise",
    description: "Unimportant messages that can be safely deleted automatically.",
    autoExecute: true,
    requiresApproval: false,
    color: "#6b7280",  // gray
  },
  INFO: {
    id: "INFO",
    label: "Info",
    description: "Useful but not urgent — will be silently archived.",
    autoExecute: true,
    requiresApproval: false,
    color: "#3b82f6",  // blue
  },
  CRITICAL: {
    id: "CRITICAL",
    label: "Critical",
    description: "Requires attention. User must review before any action runs.",
    autoExecute: false,
    requiresApproval: true,
    color: "#ef4444",  // red
  },
};

export const DEFAULT_GROUP = "CRITICAL";

/**
 * Category names used in DB (sm_event_types.category_name, sm_event_categories).
 * One-to-one with tiers: noise ↔ NOISE, info ↔ INFO, critical ↔ CRITICAL.
 */
export const EVENT_CATEGORIES = {
  noise: { name: "noise", label: "Noise", priority: 1, color: "#6b7280", policy: "auto" },
  info: { name: "info", label: "Info", priority: 2, color: "#3b82f6", policy: "supervised" },
  critical: { name: "critical", label: "Critical", priority: 3, color: "#ef4444", policy: "manual" },
};

/**
 * Map category name → ExecutionPolicy name.
 * @param {string} category — noise | info | critical
 * @returns {string} policy name
 */
export function categoryToPolicy(category) {
  return EVENT_CATEGORIES[category]?.policy || "manual";
}

/**
 * Map event category (tier) → ExecutionPolicy name.
 * @param {string} group — NOISE | INFO | CRITICAL
 * @returns {string} policy name
 */
export function groupToPolicy(group) {
  if (group === "NOISE") return "auto";
  if (group === "INFO") return "supervised";
  return "manual";
}

/**
 * Map ExecutionPolicy → event category (tier).
 * @param {string} policy — auto | supervised | manual
 * @returns {string} NOISE | INFO | CRITICAL
 */
export function policyToGroup(policy) {
  if (policy === "auto") return "NOISE";
  if (policy === "supervised") return "INFO";
  return "CRITICAL";
}

/**
 * Map event category tier → category name (for DB and rules).
 * @param {string} group — NOISE | INFO | CRITICAL
 * @returns {string} noise | info | critical
 */
export function groupToCategory(group) {
  const g = (group || "").toUpperCase();
  if (g === "NOISE") return "noise";
  if (g === "INFO") return "info";
  if (g === "CRITICAL") return "critical";
  return "critical";
}

const STORAGE_KEY = "me-ai-events";
const GROUPS_KEY = "me-ai-event-groups";

// ── Persistence ─────────────────────────────────────────────────────

async function loadUserMap() {
  const { getSetting } = await import("./store/settings.js");
  return (await getSetting(STORAGE_KEY)) || {};
}

async function saveUserMap(map) {
  const { setSetting } = await import("./store/settings.js");
  await setSetting(STORAGE_KEY, map);
}

async function loadGroupsMap() {
  const { getSetting } = await import("./store/settings.js");
  return (await getSetting(GROUPS_KEY)) || {};
}

async function saveGroupsMap(map) {
  const { setSetting } = await import("./store/settings.js");
  await setSetting(GROUPS_KEY, map);
}

// ── Event type queries ──────────────────────────────────────────────

/**
 * Get event types from classified emails in the database.
 * @returns {Promise<string[]>}
 */
async function getEventTypesFromDB() {
  try {
    const { query } = await import("./store/db.js");
    const rows = await query(`SELECT DISTINCT action FROM emailClassifications WHERE action IS NOT NULL`);
    return rows.map(r => r.action).filter(Boolean).sort();
  } catch {
    return [];
  }
}

/**
 * Get all event types: user-defined + discovered from scanned emails.
 * No hardcoded defaults — only real data.
 * @returns {Promise<string[]>}
 */
export async function getAllEventTypes() {
  const map = await loadUserMap();
  const fromDB = await getEventTypesFromDB();
  const all = new Set([...Object.keys(map), ...fromDB]);
  return [...all].sort();
}

// ── Event category (tier) management ─────────────────────────────────

/**
 * Normalize stored category tier to 3-tier (NOISE | INFO | CRITICAL).
 * @param {string} [stored]
 * @returns {EventGroup}
 */
function normalizeGroup(stored) {
  const g = (stored || "").toUpperCase();
  if (g === "NOISE") return "NOISE";
  if (g === "INFO" || g === "INFORMATIONAL") return "INFO";
  if (g === "CRITICAL" || g === "IMPORTANT" || g === "URGENT") return "CRITICAL";
  return DEFAULT_GROUP;
}

/**
 * Get the event category (tier) for an event type.
 * @param {string} eventType
 * @returns {Promise<EventGroup>}
 */
export async function getGroupForEventType(eventType) {
  const normalized = eventType?.toUpperCase?.() || "";
  const map = await loadGroupsMap();
  return normalizeGroup(map[normalized]);
}

/**
 * Set the event category (tier) for an event type.
 * @param {string} eventType
 * @param {EventGroup} group
 */
export async function setGroupForEventType(eventType, group) {
  const normalized = eventType.toUpperCase();
  if (!EVENT_GROUPS[group]) throw new Error(`Unknown category: ${group}`);
  const map = await loadGroupsMap();
  map[normalized] = group;
  await saveGroupsMap(map);
}

/**
 * Get event categories (tiers) for all known event types.
 * @returns {Promise<Record<string, EventGroup>>}
 */
export async function getAllEventTypeGroups() {
  return loadGroupsMap();
}

/**
 * Get the execution policy for an event type based on its category (tier).
 * @param {string} eventType
 * @returns {Promise<{ autoExecute: boolean, requiresApproval: boolean }>}
 */
export async function getExecutionPolicy(eventType) {
  const group = await getGroupForEventType(eventType);
  const def = EVENT_GROUPS[group] || EVENT_GROUPS[DEFAULT_GROUP];
  return { autoExecute: def.autoExecute, requiresApproval: def.requiresApproval, group };
}

/**
 * Get the action pipeline for an event type.
 * Uses user overrides (per-type pipeline) when present; otherwise falls back
 * to the category-based pipeline (e.g. NOISE → trash) so chat and Event Stream
 * show and run the same pipeline.
 * @param {string} eventType
 * @returns {Promise<Action[]>}
 */
export async function getActionsForEvent(eventType) {
  const normalized = eventType?.toUpperCase?.().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "") || "";
  if (!normalized) return [];

  const map = await loadUserMap();
  const userActions = map[normalized];
  // User has explicit pipeline (non-empty array) — use it
  if (Array.isArray(userActions) && userActions.length > 0) return userActions;

  // No override or empty (e.g. LLM-seeded type): use category pipeline for display + execution
  const { getPipelineForEvent } = await import("./rules.js");
  const pipeline = await getPipelineForEvent(eventType);
  if (!pipeline?.actions?.length) return [];

  return pipeline.actions.map((a, i) => ({
    id: (a.commandId || "cmd") + "_" + i,
    pluginId: a.pluginId ?? "",
    commandId: a.commandId ?? "",
    name: (a.commandId ?? "").replace(/_/g, " "),
    description: "",
  }));
}

// Alias for backward compatibility
export const getCommandsForEvent = getActionsForEvent;

/**
 * Check if a user-defined event exists.
 * @param {string} eventType
 * @returns {Promise<boolean>}
 */
export async function hasEvent(eventType) {
  const normalized = eventType?.toUpperCase?.() || "";
  const map = await loadUserMap();
  return normalized in map;
}

// Alias for backward compatibility
export const hasUserOverride = hasEvent;

// ── Event CRUD ──────────────────────────────────────────────────────

/**
 * Create a new user-defined event with an empty pipeline.
 * Does not overwrite an existing event.
 * @param {string} eventType
 */
export async function addEventType(eventType) {
  const normalized = eventType.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
  if (!normalized) return;
  const map = await loadUserMap();
  if (!(normalized in map)) {
    map[normalized] = [];
    await saveUserMap(map);
  }
}

/**
 * Seed an event type from LLM classification.
 * Category must be noise | info | critical (3-tier). Legacy 4-tier values are mapped to 3-tier.
 *
 * @param {string} eventType
 * @param {string} category — noise | info | critical (or legacy: informational→info, important/urgent→critical)
 * @param {string[]} [suggestedActionIds] — Ignored (kept for API compat)
 */
export async function seedEventTypeFromLLM(eventType, category, suggestedActionIds) {
  const normalized = eventType.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
  if (!normalized) return;

  const validCategories = ["noise", "info", "critical"];
  let cat = (category || "").toLowerCase().trim();
  if (!validCategories.includes(cat)) {
    // Legacy compat: map old 4-tier or group names to 3-tier
    if (cat === "noise" || category === "NOISE") cat = "noise";
    else if (cat === "informational") cat = "info";
    else if (cat === "important" || cat === "urgent" || category === "CRITICAL" || category === "IMPORTANT" || category === "URGENT") cat = "critical";
    else cat = "critical";
  }

  const group = cat === "noise" ? "NOISE" : cat === "info" ? "INFO" : "CRITICAL";
  const groupsMap = await loadGroupsMap();

  if (!(normalized in groupsMap)) {
    groupsMap[normalized] = group;
    await saveGroupsMap(groupsMap);
  }

  try {
    const { query } = await import("./store/db.js");
    const label = normalized.replace(/_/g, " ");
    await query(
      `INSERT INTO sm_event_types (name, label, category_name, auto_created)
       VALUES (?, ?, ?, true)
       ON CONFLICT (name) DO NOTHING`,
      [normalized, label, cat]
    );
  } catch (e) {
    console.warn("[events] Failed to persist event type in DB:", normalized, e?.message ?? e);
  }

  const map = await loadUserMap();
  if (!(normalized in map)) {
    map[normalized] = [];
    await saveUserMap(map);
  }
}

/**
 * Permanently delete a user-defined event and its pipeline.
 * @param {string} eventType
 */
export async function deleteEventType(eventType) {
  const normalized = eventType.toUpperCase();
  const map = await loadUserMap();
  delete map[normalized];
  await saveUserMap(map);
}

// Aliases for backward compatibility
export const removeEventTypeOverride = deleteEventType;
export const resetEventType = deleteEventType;

// ── Action pipeline CRUD ────────────────────────────────────────────

/**
 * Replace the full action pipeline for an event.
 * @param {string} eventType
 * @param {Action[]} actions
 */
export async function saveActionsForEvent(eventType, actions) {
  const normalized = eventType.toUpperCase();
  const map = await loadUserMap();
  map[normalized] = actions;
  await saveUserMap(map);
}

export const saveCommandsForEvent = saveActionsForEvent;

/**
 * Append a single action to an event's pipeline.
 * @param {string} eventType
 * @param {Action} action
 */
export async function addActionToEvent(eventType, action) {
  const current = await getActionsForEvent(eventType);
  await saveActionsForEvent(eventType, [...current, action]);
}

export const addCommandToEvent = addActionToEvent;

/**
 * Remove an action from an event's pipeline by id.
 * @param {string} eventType
 * @param {string} actionId
 */
export async function removeActionFromEvent(eventType, actionId) {
  const current = await getActionsForEvent(eventType);
  await saveActionsForEvent(eventType, current.filter(a => a.id !== actionId));
}

export const removeCommandFromEvent = removeActionFromEvent;

/**
 * Update a single action within an event's pipeline.
 * @param {string} eventType
 * @param {string} actionId
 * @param {Partial<Action>} updates
 */
export async function updateActionInEvent(eventType, actionId, updates) {
  const current = await getActionsForEvent(eventType);
  await saveActionsForEvent(
    eventType,
    current.map(a => a.id === actionId ? { ...a, ...updates } : a),
  );
}

export const updateCommandInEvent = updateActionInEvent;

// ── Chat message builders ───────────────────────────────────────────

/**
 * Build an email event object from an LLM classification result.
 * The event.metadata.tag holds the LLM tag; event.type is left empty
 * since the user picks which event pipeline to run at execution time.
 * @param {Object} classification — { action, reason, summary, tags }
 * @param {Object} email          — { subject, from, date, snippet, body }
 * @returns {Promise<{ event: EmailEvent, commands: Action[] }>}
 */
export async function buildEmailEvent(classification, email) {
  const group = classification.group || (await getGroupForEventType(classification.action));
  const event = {
    type: classification.action,
    source: "gmail",
    data: {
      subject: email.subject,
      from: email.from,
      date: email.date,
      snippet: email.snippet || email.body?.slice(0, 200) || "",
    },
    metadata: {
      reason: classification.reason,
      summary: classification.summary,
      tags: classification.tags || [],
      group,
      classifiedAt: Date.now(),
    },
  };

  const commands = await getActionsForEvent(classification.action);
  return { event, commands };
}

/**
 * Build a chat message representing a typed event.
 */
export function buildEventMessage(event, commands) {
  return {
    role: "assistant",
    type: "event",
    event,
    commands,
    content: "",
  };
}

/**
 * Build a batch event message from multiple scan results.
 */
export async function buildBatchEventMessage(results) {
  const items = await Promise.all(
    results
      .filter(r => r.success && r.classification)
      .map(async r => {
        const { event, commands } = await buildEmailEvent(r.classification, r.email);
        return { event, commands };
      })
  );

  return {
    role: "assistant",
    type: "event-batch",
    items,
    content: "",
  };
}

/**
 * Build a grouped events message for the /events chat command.
 * Groups emails by event type; each group includes the user-defined
 * action pipeline for that event type (empty array if none defined yet).
 *
 * @param {Object} grouped — { groups: { EVENT_TYPE: [...items] }, order: ["EVENT_TYPE", ...] }
 * @returns {Promise<Object>} chat message of type "events-grouped"
 */
export async function buildGroupedEventsMessage(grouped) {
  const groups = await Promise.all(grouped.order.map(async eventType => {
    const items = grouped.groups[eventType] || [];
    const commands = await getActionsForEvent(eventType);
    const group = await getGroupForEventType(eventType);
    const emails = items.map(item => ({
      emailId: item.emailId,
      subject: item.subject || "(no subject)",
      from: item.from || "",
      date: item.date,
      summary: item.summary || "",
      reason: item.reason || "",
      tags: item.tags || [],
      status: item.status || "pending",
    }));
    return { eventType, group, emails, commands };
  }));

  const total = groups.reduce((sum, g) => sum + g.emails.length, 0);

  return {
    role: "assistant",
    type: "events-grouped",
    groups,
    total,
    content: "",
  };
}
