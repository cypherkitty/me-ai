/**
 * Event Stream + Action Pipeline
 *
 * Event types — classification labels assigned by the LLM (e.g. "REVIEW", "DELETE"),
 *               plus any custom types the user creates.
 *               Each event type has a user-defined sequential action pipeline.
 *               No hardcoded defaults — all pipelines are user-managed.
 *
 * Tags — secondary metadata on emails (also output by the LLM). Present but not
 *        structurally important; used only for display purposes.
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
 * @property {string} type     — event type (e.g. "REVIEW", "DELETE")
 * @property {string} source   — origin (e.g. "gmail")
 * @property {Object} data     — email payload
 * @property {Object} metadata — scan metadata (summary, reason, tags, etc.)
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
    return { eventType, emails, commands };
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
