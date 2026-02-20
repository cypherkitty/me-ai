/**
 * Event Stream + Action Pipeline
 *
 * Event types — classification labels assigned by the LLM (e.g. "REVIEW", "DELETE"),
 *               plus any custom types the user creates.
 *               Each event type belongs to a group and has a user-defined sequential
 *               action pipeline. No hardcoded pipelines — all actions are user-managed
 *               (seeded from LLM suggestions on first encounter).
 *
 * Event groups — three tiers controlling how events are handled:
 *   NOISE    — unimportant emails (promos, newsletters). Actions run automatically.
 *   INFO     — informational emails to review. Actions run on user request.
 *   CRITICAL — high-stakes emails that change state (transactions, approvals).
 *              User must explicitly review and confirm before any action runs.
 *
 * Actions — each step in a pipeline maps to a worker method (e.g. gmail.trash).
 *           Worker resolution happens at execution time via the worker registry.
 *
 * Tags — secondary metadata on emails (LLM output). Display only.
 */

/**
 * @typedef {Object} Action
 * @property {string} id          — unique identifier matching a worker handler (e.g. "trash")
 * @property {string} name        — display name
 * @property {string} description — what it does
 * @property {string} [icon]      — optional emoji
 * @property {string} [workerId]  — explicit worker override (default: resolved from event source)
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
 * NOISE    — auto-execute pipeline without user interaction
 * INFO     — show to user; execute on demand
 * CRITICAL — require explicit user approval before any action runs
 */
export const EVENT_GROUPS = {
  NOISE: {
    id: "NOISE",
    label: "Noise",
    description: "Unimportant emails that can be safely deleted or archived automatically.",
    autoExecute: true,
    requiresApproval: false,
    color: "#6b7280",  // gray
  },
  INFO: {
    id: "INFO",
    label: "Info",
    description: "Informational emails to review. Actions run on user request.",
    autoExecute: false,
    requiresApproval: false,
    color: "#3b82f6",  // blue
  },
  CRITICAL: {
    id: "CRITICAL",
    label: "Critical",
    description: "High-stakes emails that change state. User must approve before any action runs.",
    autoExecute: false,
    requiresApproval: true,
    color: "#f59e0b",  // amber
  },
};

export const DEFAULT_GROUP = "INFO";

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
    const { db } = await import("./store/db.js");
    const classifications = await db.emailClassifications.toArray();
    const types = new Set(classifications.map(c => c.action).filter(Boolean));
    return [...types].sort();
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
 * Seed an event type from LLM suggestions if no pipeline is defined yet.
 * Called automatically when the LLM classifies an email for a new event type.
 * Does not overwrite user-defined pipelines.
 *
 * @param {string} eventType
 * @param {EventGroup} group        — LLM-suggested group
 * @param {string[]} suggestedActionIds — LLM-suggested action IDs (e.g. ["trash", "mark_read"])
 */
export async function seedEventTypeFromLLM(eventType, group, suggestedActionIds) {
  const normalized = eventType.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
  if (!normalized) return;

  const map = await loadUserMap();
  const groupsMap = await loadGroupsMap();

  // Only set group if not already user-defined
  if (!(normalized in groupsMap)) {
    const validGroup = EVENT_GROUPS[group] ? group : DEFAULT_GROUP;
    groupsMap[normalized] = validGroup;
    await saveGroupsMap(groupsMap);
  }

  // Only seed pipeline if not already user-defined
  if (!(normalized in map)) {
    // Map action IDs to Action objects using the worker registry metadata
    const { pluginRegistry } = await import("./plugins/plugin-registry.js");
    const available = pluginRegistry.getAvailableActions("gmail");
    const actionMap = Object.fromEntries(available.map(a => [a.actionId, a]));

    const pipeline = (suggestedActionIds || [])
      .filter(id => actionMap[id])
      .map(id => ({
        id,
        name: actionMap[id].name,
        description: actionMap[id].description,
      }));

    map[normalized] = pipeline;
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
