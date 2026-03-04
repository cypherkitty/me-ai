/**
 * Event Stream + Action Pipeline
 *
 * This module bridges the legacy email scan/triage flow with the new routing
 * architecture. It retains backward-compatible exports while integrating:
 *
 *   EventType       — what kind of content (ad, newsletter, invoice, …)
 *   EventCategory   — urgency tier (noise / informational / important / urgent)
 *   Rule            — the central pipeline unit connecting trigger → actions → policy
 *   ExecutionPolicy — auto / supervised / manual
 *
 * Legacy event groups (NOISE/INFO/CRITICAL) are preserved for the existing
 * triage/execution pipeline until that pipeline is fully migrated.
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
 * @property {Object} metadata — scan metadata (group, summary, reason, tags, etc.)
 */

/**
 * @typedef {"NOISE"|"INFO"|"CRITICAL"} EventGroup
 */

/**
 * Event group definitions with their execution policies.
 * NOISE         — auto-execute pipeline without user interaction
 * INFORMATIONAL — execute then notify (supervised)
 * IMPORTANT     — require explicit user approval
 * URGENT        — require explicit user approval (highest priority)
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
  INFORMATIONAL: {
    id: "INFORMATIONAL",
    label: "Informational",
    description: "Useful but not urgent — will be silently archived.",
    autoExecute: true,
    requiresApproval: false,
    color: "#3b82f6",  // blue
  },
  IMPORTANT: {
    id: "IMPORTANT",
    label: "Important",
    description: "Requires attention. User must review before any action runs.",
    autoExecute: false,
    requiresApproval: true,
    color: "#d97706",  // amber
  },
  URGENT: {
    id: "URGENT",
    label: "Urgent",
    description: "Needs immediate action. Highest priority.",
    autoExecute: false,
    requiresApproval: true,
    color: "#ef4444",  // red
  },
};

export const DEFAULT_GROUP = "IMPORTANT";

// ── EventCategory ─────────────────────────────────────────────────────

/**
 * Event categories (urgency tiers).
 * Maps to the sm_event_categories table.
 */
export const EVENT_CATEGORIES = {
  noise: { name: "noise", label: "Noise", priority: 1, color: "#4b5563", policy: "auto" },
  informational: { name: "informational", label: "Informational", priority: 2, color: "#3b82f6", policy: "supervised" },
  important: { name: "important", label: "Important", priority: 3, color: "#d97706", policy: "manual" },
  urgent: { name: "urgent", label: "Urgent", priority: 4, color: "#ef4444", policy: "manual" },
};

/**
 * Execution policies.
 */
export const EXECUTION_POLICIES = {
  auto: { name: "auto", label: "Auto", description: "Executes without user input", color: "#10b981" },
  supervised: { name: "supervised", label: "Supervised", description: "Executes then notifies user", color: "#f59e0b" },
  manual: { name: "manual", label: "Manual", description: "Waits for user approval", color: "#6366f1" },
};

/**
 * Map category name → ExecutionPolicy name.
 * @param {string} category — noise | informational | important | urgent
 * @returns {string} policy name
 */
export function categoryToPolicy(category) {
  return EVENT_CATEGORIES[category]?.policy || "manual";
}

/**
 * Map legacy event group → ExecutionPolicy name.
 * @param {string} group — NOISE | INFORMATIONAL | IMPORTANT | URGENT
 * @returns {string} policy name
 */
export function groupToPolicy(group) {
  if (group === "NOISE") return "auto";
  if (group === "INFORMATIONAL") return "supervised";
  return "manual";
}

/**
 * Map ExecutionPolicy → legacy event group.
 * @param {string} policy — auto | supervised | manual
 * @returns {string} group
 */
export function policyToGroup(policy) {
  if (policy === "auto") return "NOISE";
  if (policy === "supervised") return "INFORMATIONAL";
  return "IMPORTANT";
}

/**
 * Map legacy event group → EventCategory name.
 * @param {string} group
 * @returns {string} category name
 */
export function groupToCategory(group) {
  const g = (group || "").toUpperCase();
  if (g === "NOISE") return "noise";
  if (g === "INFORMATIONAL") return "informational";
  if (g === "URGENT") return "urgent";
  return "important";
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

// ── Event group management ──────────────────────────────────────────

/**
 * Get the group for an event type.
 * @param {string} eventType
 * @returns {Promise<EventGroup>}
 */
export async function getGroupForEventType(eventType) {
  const normalized = eventType?.toUpperCase?.() || "";
  const map = await loadGroupsMap();
  return map[normalized] || DEFAULT_GROUP;
}

/**
 * Set the group for an event type.
 * @param {string} eventType
 * @param {EventGroup} group
 */
export async function setGroupForEventType(eventType, group) {
  const normalized = eventType.toUpperCase();
  if (!EVENT_GROUPS[group]) throw new Error(`Unknown group: ${group}`);
  const map = await loadGroupsMap();
  map[normalized] = group;
  await saveGroupsMap(map);
}

/**
 * Get groups for all known event types.
 * @returns {Promise<Record<string, EventGroup>>}
 */
export async function getAllEventTypeGroups() {
  return loadGroupsMap();
}

/**
 * Get the execution policy for an event type based on its group.
 * @param {string} eventType
 * @returns {Promise<{ autoExecute: boolean, requiresApproval: boolean }>}
 */
export async function getExecutionPolicy(eventType) {
  const group = await getGroupForEventType(eventType);
  const def = EVENT_GROUPS[group] || EVENT_GROUPS[DEFAULT_GROUP];
  return { autoExecute: def.autoExecute, requiresApproval: def.requiresApproval, group };
}

/**
 * Get the action pipeline for a user-defined event.
 * Returns [] if the event doesn't exist — no hardcoded fallbacks.
 * @param {string} eventType
 * @returns {Promise<Action[]>}
 */
export async function getActionsForEvent(eventType) {
  const normalized = eventType?.toUpperCase?.() || "";
  const map = await loadUserMap();
  return map[normalized] || [];
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
 * Under the new category-based model, the LLM assigns a category to the event
 * type, and the category's default pipeline applies automatically.
 * No per-type pipeline is created — override pipelines are user-defined only.
 *
 * @param {string} eventType
 * @param {string} category — noise | informational | important | urgent
 * @param {string[]} [suggestedActionIds] — Ignored (kept for API compat)
 */
export async function seedEventTypeFromLLM(eventType, category, suggestedActionIds) {
  const normalized = eventType.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
  if (!normalized) return;

  // Map legacy group values to category
  const validCategories = ["noise", "informational", "important", "urgent"];
  let cat = (category || "").toLowerCase();
  if (!validCategories.includes(cat)) {
    // Legacy compat: map old group names
    if (cat === "noise" || category === "NOISE") cat = "noise";
    else if (cat === "critical" || category === "CRITICAL" || category === "IMPORTANT") cat = "important";
    else cat = "important";
  }

  const groupsMap = await loadGroupsMap();

  // Only set group if not already user-defined (backward compat with legacy localStorage)
  if (!(normalized in groupsMap)) {
    const validGroup = EVENT_GROUPS[cat.toUpperCase()] ? cat.toUpperCase() : DEFAULT_GROUP;
    groupsMap[normalized] = validGroup;
    await saveGroupsMap(groupsMap);
  }

  // Persist event type in DB with category assignment
  try {
    const { query } = await import("./store/db.js");
    // Use INSERT OR IGNORE — don't overwrite existing types (user may have changed category)
    await query(`
      INSERT INTO sm_event_types (name, label, category_name, auto_created)
      VALUES ('${normalized}', '${normalized.replace(/_/g, " ")}', '${cat}', true)
      ON CONFLICT (name) DO NOTHING
    `);
  } catch (e) {
    console.warn("[events] Failed to persist event type in DB:", normalized, e?.message ?? e);
  }

  // Also maintain the legacy localStorage map for backward compat
  const map = await loadUserMap();
  if (!(normalized in map)) {
    map[normalized] = []; // empty pipeline — category carries the actual pipeline
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
  const event = {
    type: classification.action,  // event type from LLM classification
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
      tags: classification.tags || [],  // secondary metadata, not structurally important
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
