/**
 * Event Stream + Action Pipeline
 *
 * Tags  — LLM classification labels assigned to emails (e.g. "REVIEW", "DELETE").
 *         Read-only output of the scan process. Stored in emailClassifications.action.
 *
 * Events — User-defined named workflows, each with a sequential action pipeline.
 *          Fully managed by the user; never auto-generated from tags.
 *          Stored in IndexedDB settings under STORAGE_KEY.
 *
 * Actions are for events, not for tags.
 */

/**
 * @typedef {Object} Action
 * @property {string} id          — unique identifier (e.g. "mark_read")
 * @property {string} name        — display name
 * @property {string} description — what it does
 * @property {string} [icon]      — optional emoji
 */

/**
 * @typedef {Object} EmailEvent
 * @property {string} type     — user-defined event name (e.g. "morning_cleanup")
 * @property {string} source   — origin (e.g. "gmail")
 * @property {Object} data     — email payload
 * @property {Object} metadata — scan metadata (tag, summary, reason, etc.)
 */

const STORAGE_KEY = "me-ai-events";

// ── Persistence ─────────────────────────────────────────────────────

async function loadUserMap() {
  const { getSetting } = await import("./store/settings.js");
  return (await getSetting(STORAGE_KEY)) || {};
}

async function saveUserMap(map) {
  const { setSetting } = await import("./store/settings.js");
  await setSetting(STORAGE_KEY, map);
}

// ── Event type queries ──────────────────────────────────────────────

/**
 * Get all user-defined event names.
 * @returns {Promise<string[]>}
 */
export async function getAllEventTypes() {
  const map = await loadUserMap();
  return Object.keys(map).sort();
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
    type: "",  // not set — user selects an event at execution time
    source: "gmail",
    data: {
      subject: email.subject,
      from: email.from,
      date: email.date,
      snippet: email.snippet || email.body?.slice(0, 200) || "",
    },
    metadata: {
      tag: classification.action,   // LLM-assigned tag
      reason: classification.reason,
      summary: classification.summary,
      tags: classification.tags || [],
      classifiedAt: Date.now(),
    },
  };

  return { event, commands: [] };
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
 * Groups emails by their LLM tag. No pipeline is auto-assigned —
 * the user picks an event to execute at interaction time.
 *
 * @param {Object} grouped — { groups: { TAG: [...items] }, order: ["TAG", ...] }
 * @returns {Promise<Object>} chat message of type "events-grouped"
 */
export async function buildGroupedEventsMessage(grouped) {
  const groups = grouped.order.map(tag => {
    const items = grouped.groups[tag] || [];
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
    return { tag, emails };
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
