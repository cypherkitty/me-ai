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
    { id: "draft_reply", name: "Draft Reply", description: "Generate a reply draft using LLM", icon: "✏️" },
    { id: "mark_done", name: "Mark Done", description: "Mark as handled", icon: "✅" },
  ],
  FOLLOW_UP: [
    { id: "draft_follow_up", name: "Draft Follow-up", description: "Generate a follow-up message", icon: "✏️" },
    { id: "set_reminder", name: "Set Reminder", description: "Remind me to follow up", icon: "⏰" },
  ],
  DELETE: [
    { id: "confirm_delete", name: "Delete", description: "Confirm deletion", icon: "🗑️" },
  ],
  ARCHIVE: [
    { id: "confirm_archive", name: "Archive", description: "Move to archive", icon: "📦" },
  ],
  READ_LATER: [
    { id: "snooze", name: "Snooze", description: "Remind me later", icon: "⏰" },
    { id: "summarize", name: "Summarize", description: "Get a quick LLM summary", icon: "📝" },
  ],
  REVIEW: [
    { id: "summarize", name: "Summarize", description: "Get a quick LLM summary", icon: "📝" },
    { id: "mark_done", name: "Mark Done", description: "Mark as reviewed", icon: "✅" },
  ],
  PAY_BILL: [
    { id: "extract_amount", name: "Extract Details", description: "Extract payment amount and due date", icon: "💰" },
    { id: "set_reminder", name: "Set Reminder", description: "Remind me before due date", icon: "⏰" },
    { id: "mark_done", name: "Mark Paid", description: "Mark as paid", icon: "✅" },
  ],
  TRACK_DELIVERY: [
    { id: "extract_tracking", name: "Extract Tracking", description: "Find tracking number and carrier", icon: "📦" },
    { id: "set_reminder", name: "Set Reminder", description: "Remind me to check delivery", icon: "⏰" },
    { id: "mark_done", name: "Mark Delivered", description: "Mark as delivered", icon: "✅" },
  ],
  SCHEDULE_MEETING: [
    { id: "extract_details", name: "Extract Details", description: "Extract meeting time, location, attendees", icon: "📅" },
    { id: "draft_reply", name: "Confirm/Decline", description: "Draft a response", icon: "✏️" },
  ],
  UNSUBSCRIBE: [
    { id: "find_unsubscribe", name: "Find Unsubscribe Link", description: "Locate unsubscribe URL in email", icon: "🔗" },
    { id: "confirm_delete", name: "Delete", description: "Delete this email", icon: "🗑️" },
  ],
  SAVE_RECEIPT: [
    { id: "extract_amount", name: "Extract Details", description: "Extract amount, vendor, date", icon: "🧾" },
    { id: "archive", name: "Archive", description: "Move to archive", icon: "📦" },
  ],
  ACKNOWLEDGE: [
    { id: "mark_done", name: "Acknowledge", description: "Mark as acknowledged", icon: "✅" },
  ],
  NO_ACTION: [
    { id: "archive", name: "Archive", description: "Move to archive", icon: "📦" },
  ],
  IGNORE: [
    { id: "confirm_delete", name: "Delete", description: "Delete this email", icon: "🗑️" },
  ],
};

/**
 * Default action pipeline for any event type not in the map.
 */
const DEFAULT_PIPELINE = [
  { id: "mark_done", name: "Mark Done", description: "Mark as handled", icon: "✅" },
];

// ── Persistence helpers ─────────────────────────────────────────────

function loadUserMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveUserMap(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/**
 * Get the effective action pipeline map (builtins merged with user overrides).
 * User-defined event types are appended. User overrides per event type
 * fully replace the builtin pipeline for that type.
 * @returns {Record<string, Action[]>}
 */
export function getActionPipelineMap() {
  const userMap = loadUserMap();
  return { ...BUILTIN_PIPELINES, ...userMap };
}

/**
 * Get action pipeline for an event type.
 * Checks user overrides first, then builtins, then defaults.
 * @param {string} eventType
 * @returns {Action[]}
 */
export function getActionsForEvent(eventType) {
  const normalized = eventType?.toUpperCase?.() || "";
  const userMap = loadUserMap();
  if (userMap[normalized]) return userMap[normalized];
  return BUILTIN_PIPELINES[normalized] || DEFAULT_PIPELINE;
}

// Alias for backwards compatibility
export const getCommandsForEvent = getActionsForEvent;

/**
 * Get all registered event types (builtins + user-defined).
 * @returns {string[]}
 */
export function getRegisteredEventTypes() {
  const userMap = loadUserMap();
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
 * Get all event types (builtins + user-defined + from database).
 * @returns {Promise<string[]>}
 */
export async function getAllEventTypes() {
  const registered = getRegisteredEventTypes();
  const fromDB = await getEventTypesFromDB();
  const all = new Set([...registered, ...fromDB]);
  return [...all].sort();
}

// ── Action Pipeline CRUD ────────────────────────────────────────────

/**
 * Save the full action pipeline for an event type (user override).
 * @param {string} eventType
 * @param {Action[]} actions
 */
export function saveActionsForEvent(eventType, actions) {
  const normalized = eventType.toUpperCase();
  const userMap = loadUserMap();
  userMap[normalized] = actions;
  saveUserMap(userMap);
}

// Alias for backwards compatibility
export const saveCommandsForEvent = saveActionsForEvent;

/**
 * Add a single action to an event type's pipeline.
 * @param {string} eventType
 * @param {Action} action
 */
export function addActionToEvent(eventType, action) {
  const current = getActionsForEvent(eventType);
  saveActionsForEvent(eventType, [...current, action]);
}

// Alias for backwards compatibility
export const addCommandToEvent = addActionToEvent;

/**
 * Remove an action from an event type's pipeline by id.
 * @param {string} eventType
 * @param {string} actionId
 */
export function removeActionFromEvent(eventType, actionId) {
  const current = getActionsForEvent(eventType);
  saveActionsForEvent(eventType, current.filter(c => c.id !== actionId));
}

// Alias for backwards compatibility
export const removeCommandFromEvent = removeActionFromEvent;

/**
 * Update an action within an event type's pipeline.
 * @param {string} eventType
 * @param {string} actionId
 * @param {Partial<Action>} updates
 */
export function updateActionInEvent(eventType, actionId, updates) {
  const current = getActionsForEvent(eventType);
  saveActionsForEvent(
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
export function addEventType(eventType, actions) {
  const normalized = eventType.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
  if (!normalized) return;
  saveActionsForEvent(normalized, actions || [...DEFAULT_PIPELINE]);
}

/**
 * Remove a user-defined event type override (reverts to builtin if exists).
 * @param {string} eventType
 */
export function removeEventTypeOverride(eventType) {
  const normalized = eventType.toUpperCase();
  const userMap = loadUserMap();
  delete userMap[normalized];
  saveUserMap(userMap);
}

/**
 * Check if an event type has user overrides.
 * @param {string} eventType
 * @returns {boolean}
 */
export function hasUserOverride(eventType) {
  const normalized = eventType?.toUpperCase?.() || "";
  const userMap = loadUserMap();
  return normalized in userMap;
}

/**
 * Reset an event type back to its builtin commands (removes override).
 * @param {string} eventType
 */
export function resetEventType(eventType) {
  removeEventTypeOverride(eventType);
}

/**
 * Build a typed event from an email classification result.
 * @param {Object} classification — { action, reason, summary, tags }
 * @param {Object} email — { subject, from, date, body, ... }
 * @returns {{ event: Event, commands: Command[] }}
 */
export function buildEmailEvent(classification, email) {
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

  const commands = getCommandsForEvent(classification.action);

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
    content: "", // typed messages don't need text content
  };
}

/**
 * Build a batch event message from multiple classifications.
 * Used after a scan to show all results in one message.
 */
export function buildBatchEventMessage(results) {
  const items = results
    .filter(r => r.success && r.classification)
    .map(r => {
      const { event, commands } = buildEmailEvent(r.classification, r.email);
      return { event, commands };
    });

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
 * @returns {Object} chat message of type "events-grouped"
 */
export function buildGroupedEventsMessage(grouped) {
  const groups = grouped.order.map(action => {
    const items = grouped.groups[action] || [];
    const commands = getCommandsForEvent(action);
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
  });

  const total = groups.reduce((sum, g) => sum + g.emails.length, 0);

  return {
    role: "assistant",
    type: "events-grouped",
    groups,
    total,
    content: "",
  };
}
