/**
 * Event Stream + Action Pipeline
 *
 * Core architecture: HashMap<EventType, ActionPipeline>
 *
 * Events are classified data items (emails, messages, etc.).
 * Each event type has a sequential pipeline of actions that execute in order.
 * Actions in a pipeline are not individually executable — the entire pipeline
 * runs as a single workflow.
 */

/**
 * @typedef {Object} Action
 * @property {string} id       — unique identifier
 * @property {string} name     — display name
 * @property {string} description — what it does
 * @property {string} [icon]   — optional icon/emoji
 * @property {string} [body]   — optional rich content (LLM draft, parsed data, etc.)
 */

/**
 * @typedef {Object} Event
 * @property {string} type     — event type (e.g. "REPLY", "DELETE")
 * @property {string} source   — origin (e.g. "gmail")
 * @property {Object} data     — raw payload
 * @property {Object} metadata — classification result, timestamps, etc.
 */

/**
 * Action Pipeline registry: maps event types to their sequential action pipelines.
 * This is the HashMap<EventType, ActionPipeline> at the heart of the system.
 *
 * Built-in defaults serve as a starting point. Users can customize
 * action pipelines per event type via the Action Editor; overrides are
 * persisted in localStorage under STORAGE_KEY.
 */

const STORAGE_KEY = "me-ai-action-pipelines";

const BUILTIN_PIPELINES = {
  REPLY: [
    { id: "star", name: "Star", description: "Mark as important for follow-up", icon: "⭐" },
    { id: "mark_read", name: "Mark as Read", description: "Mark email as read", icon: "✅" },
  ],
  FOLLOW_UP: [
    { id: "star", name: "Star", description: "Mark for follow-up", icon: "⭐" },
    { id: "mark_important", name: "Mark Important", description: "Flag as important", icon: "🔴" },
  ],
  DELETE: [
    { id: "trash", name: "Move to Trash", description: "Move email to trash", icon: "🗑️" },
  ],
  ARCHIVE: [
    { id: "archive", name: "Archive", description: "Remove from inbox", icon: "📦" },
    { id: "mark_read", name: "Mark as Read", description: "Mark email as read", icon: "✅" },
  ],
  READ_LATER: [
    { id: "star", name: "Star", description: "Mark for reading later", icon: "⭐" },
    { id: "mark_unread", name: "Keep Unread", description: "Keep as unread reminder", icon: "📧" },
  ],
  REVIEW: [
    { id: "mark_read", name: "Mark as Read", description: "Mark as reviewed", icon: "✅" },
    { id: "archive", name: "Archive", description: "Remove from inbox", icon: "📦" },
  ],
  PAY_BILL: [
    { id: "star", name: "Star", description: "Mark for payment", icon: "⭐" },
    { id: "mark_important", name: "Mark Important", description: "Flag as important", icon: "🔴" },
  ],
  TRACK_DELIVERY: [
    { id: "star", name: "Star", description: "Track delivery", icon: "⭐" },
    { id: "mark_read", name: "Mark as Read", description: "Mark email as read", icon: "✅" },
  ],
  SCHEDULE_MEETING: [
    { id: "star", name: "Star", description: "Mark for scheduling", icon: "⭐" },
    { id: "mark_important", name: "Mark Important", description: "Flag as important", icon: "🔴" },
  ],
  UNSUBSCRIBE: [
    { id: "mark_spam", name: "Mark as Spam", description: "Move to spam folder", icon: "🚫" },
  ],
  SAVE_RECEIPT: [
    { id: "star", name: "Star", description: "Star for records", icon: "⭐" },
    { id: "archive", name: "Archive", description: "Move to archive", icon: "📦" },
    { id: "mark_read", name: "Mark as Read", description: "Mark email as read", icon: "✅" },
  ],
  ACKNOWLEDGE: [
    { id: "mark_read", name: "Mark as Read", description: "Mark as acknowledged", icon: "✅" },
    { id: "archive", name: "Archive", description: "Remove from inbox", icon: "📦" },
  ],
  NO_ACTION: [
    { id: "archive", name: "Archive", description: "Archive without action", icon: "📦" },
    { id: "mark_read", name: "Mark as Read", description: "Mark email as read", icon: "✅" },
  ],
  IGNORE: [
    { id: "mark_spam", name: "Mark as Spam", description: "Mark as spam and remove", icon: "🚫" },
  ],
};

/**
 * Default action pipeline for any event type not in the map.
 */
const DEFAULT_PIPELINE = [
  { id: "mark_read", name: "Mark as Read", description: "Mark email as read", icon: "✅" },
  { id: "archive", name: "Archive", description: "Remove from inbox", icon: "📦" },
];

// ── Persistence helpers ─────────────────────────────────────────────

async function loadUserMap() {
  const { getSetting } = await import("./store/settings.js");
  return (await getSetting(STORAGE_KEY)) || {};
}

async function saveUserMap(map) {
  const { setSetting } = await import("./store/settings.js");
  await setSetting(STORAGE_KEY, map);
}

/**
 * Get the effective action pipeline map (builtins merged with user overrides).
 * @returns {Promise<Record<string, Action[]>>}
 */
export async function getActionPipelineMap() {
  const userMap = await loadUserMap();
  return { ...BUILTIN_PIPELINES, ...userMap };
}

/**
 * Get action pipeline for an event type.
 * Checks user overrides first, then builtins, then defaults.
 * @param {string} eventType
 * @returns {Promise<Action[]>}
 */
export async function getActionsForEvent(eventType) {
  const normalized = eventType?.toUpperCase?.() || "";
  const userMap = await loadUserMap();
  if (userMap[normalized]) return userMap[normalized];
  return BUILTIN_PIPELINES[normalized] || DEFAULT_PIPELINE;
}

// Alias for backwards compatibility
export const getCommandsForEvent = getActionsForEvent;

/**
 * Get all registered event types (builtins + user-defined).
 * @returns {Promise<string[]>}
 */
export async function getRegisteredEventTypes() {
  const userMap = await loadUserMap();
  const all = new Set([...Object.keys(BUILTIN_PIPELINES), ...Object.keys(userMap)]);
  return [...all];
}

/**
 * Get event types from classified emails in the database.
 * @returns {Promise<string[]>}
 */
export async function getEventTypesFromDB() {
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
 * Get active event types: only types seen in scanned emails + user-customized ones.
 * Builtin types that have never appeared in a scan are excluded to keep the editor clean.
 * @returns {Promise<string[]>}
 */
export async function getAllEventTypes() {
  const userMap = await loadUserMap();
  const fromDB = await getEventTypesFromDB();
  // Show: types from actual scans + types the user has explicitly overridden/created
  const all = new Set([...fromDB, ...Object.keys(userMap)]);
  return [...all].sort();
}

// ── Action Pipeline CRUD ────────────────────────────────────────────

/**
 * Save the full action pipeline for an event type (user override).
 * @param {string} eventType
 * @param {Action[]} actions
 */
export async function saveActionsForEvent(eventType, actions) {
  const normalized = eventType.toUpperCase();
  const userMap = await loadUserMap();
  userMap[normalized] = actions;
  await saveUserMap(userMap);
}

// Alias for backwards compatibility
export const saveCommandsForEvent = saveActionsForEvent;

/**
 * Add a single action to an event type's pipeline.
 * @param {string} eventType
 * @param {Action} action
 */
export async function addActionToEvent(eventType, action) {
  const current = await getActionsForEvent(eventType);
  await saveActionsForEvent(eventType, [...current, action]);
}

// Alias for backwards compatibility
export const addCommandToEvent = addActionToEvent;

/**
 * Remove an action from an event type's pipeline by id.
 * @param {string} eventType
 * @param {string} actionId
 */
export async function removeActionFromEvent(eventType, actionId) {
  const current = await getActionsForEvent(eventType);
  await saveActionsForEvent(eventType, current.filter(c => c.id !== actionId));
}

// Alias for backwards compatibility
export const removeCommandFromEvent = removeActionFromEvent;

/**
 * Update an action within an event type's pipeline.
 * @param {string} eventType
 * @param {string} actionId
 * @param {Partial<Action>} updates
 */
export async function updateActionInEvent(eventType, actionId, updates) {
  const current = await getActionsForEvent(eventType);
  await saveActionsForEvent(
    eventType,
    current.map(c => c.id === actionId ? { ...c, ...updates } : c),
  );
}

// Alias for backwards compatibility
export const updateCommandInEvent = updateActionInEvent;

/**
 * Add a new event type with optional initial action pipeline.
 * @param {string} eventType
 * @param {Action[]} [actions]
 */
export async function addEventType(eventType, actions) {
  const normalized = eventType.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
  if (!normalized) return;
  await saveActionsForEvent(normalized, actions || [...DEFAULT_PIPELINE]);
}

/**
 * Remove a user-defined event type override (reverts to builtin if exists).
 * @param {string} eventType
 */
export async function removeEventTypeOverride(eventType) {
  const normalized = eventType.toUpperCase();
  const userMap = await loadUserMap();
  delete userMap[normalized];
  await saveUserMap(userMap);
}

/**
 * Check if an event type has user overrides.
 * @param {string} eventType
 * @returns {Promise<boolean>}
 */
export async function hasUserOverride(eventType) {
  const normalized = eventType?.toUpperCase?.() || "";
  const userMap = await loadUserMap();
  return normalized in userMap;
}

/**
 * Reset an event type back to its builtin commands (removes override).
 * @param {string} eventType
 */
export async function resetEventType(eventType) {
  await removeEventTypeOverride(eventType);
}

/**
 * Build a typed event from an email classification result.
 * @param {Object} classification — { action, reason, summary, tags }
 * @param {Object} email — { subject, from, date, body, ... }
 * @returns {{ event: Event, commands: Command[] }}
 */
export async function buildEmailEvent(classification, email) {
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
      classifiedAt: Date.now(),
    },
  };

  const commands = await getCommandsForEvent(classification.action);

  return { event, commands };
}

/**
 * Build a typed chat message from an event + commands.
 * This is what gets pushed into the messages array.
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
 * Build a batch event message from multiple classifications.
 * Used after a scan to show all results in one message.
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
 * Build a grouped events message from DB classifications.
 * Groups emails by event type (action), each group has its emails + commands.
 *
 * @param {Object} grouped — { groups: { ACTION: [...items] }, order: ["ACTION", ...] }
 * @returns {Promise<Object>} chat message of type "events-grouped"
 */
export async function buildGroupedEventsMessage(grouped) {
  const groups = await Promise.all(grouped.order.map(async action => {
    const items = grouped.groups[action] || [];
    const commands = await getCommandsForEvent(action);
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
    return { eventType: action, emails, commands };
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
