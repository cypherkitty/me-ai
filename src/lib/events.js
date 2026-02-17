/**
 * Event Stream + Command Map
 *
 * Core architecture: HashMap<EventType, List<Command>>
 *
 * Events are classified data items (emails, messages, etc.).
 * Commands are actions that can be taken on an event of a given type.
 */

/**
 * @typedef {Object} Command
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
 * Command registry: maps event types to their available commands.
 * This is the HashMap<EventType, List<Command>> at the heart of the system.
 */
const COMMAND_MAP = {
  // Email action types (from LLM classification)
  REPLY: [
    { id: "draft_reply", name: "Draft Reply", description: "Generate a reply draft using LLM", icon: "✏️" },
    { id: "mark_done", name: "Mark Done", description: "Mark as handled", icon: "✅" },
    { id: "snooze", name: "Snooze", description: "Remind me later", icon: "⏰" },
    { id: "dismiss", name: "Dismiss", description: "Remove from queue", icon: "🗑️" },
  ],
  FOLLOW_UP: [
    { id: "draft_follow_up", name: "Draft Follow-up", description: "Generate a follow-up message", icon: "✏️" },
    { id: "set_reminder", name: "Set Reminder", description: "Remind me to follow up", icon: "⏰" },
    { id: "mark_done", name: "Mark Done", description: "Mark as handled", icon: "✅" },
    { id: "dismiss", name: "Dismiss", description: "Remove from queue", icon: "🗑️" },
  ],
  DELETE: [
    { id: "confirm_delete", name: "Delete", description: "Confirm deletion", icon: "🗑️" },
    { id: "archive", name: "Archive Instead", description: "Archive instead of deleting", icon: "📦" },
    { id: "dismiss", name: "Keep", description: "Keep in inbox", icon: "↩️" },
  ],
  ARCHIVE: [
    { id: "confirm_archive", name: "Archive", description: "Move to archive", icon: "📦" },
    { id: "dismiss", name: "Keep", description: "Keep in inbox", icon: "↩️" },
  ],
  READ_LATER: [
    { id: "snooze", name: "Snooze", description: "Remind me later", icon: "⏰" },
    { id: "summarize", name: "Summarize", description: "Get a quick LLM summary", icon: "📝" },
    { id: "mark_done", name: "Mark Done", description: "Mark as read", icon: "✅" },
    { id: "dismiss", name: "Dismiss", description: "Remove from queue", icon: "🗑️" },
  ],
  REVIEW: [
    { id: "summarize", name: "Summarize", description: "Get a quick LLM summary", icon: "📝" },
    { id: "mark_done", name: "Mark Done", description: "Mark as reviewed", icon: "✅" },
    { id: "dismiss", name: "Dismiss", description: "Remove from queue", icon: "🗑️" },
  ],
  PAY_BILL: [
    { id: "extract_amount", name: "Extract Details", description: "Extract payment amount and due date", icon: "💰" },
    { id: "set_reminder", name: "Set Reminder", description: "Remind me before due date", icon: "⏰" },
    { id: "mark_done", name: "Mark Paid", description: "Mark as paid", icon: "✅" },
    { id: "dismiss", name: "Dismiss", description: "Remove from queue", icon: "🗑️" },
  ],
  TRACK_DELIVERY: [
    { id: "extract_tracking", name: "Extract Tracking", description: "Find tracking number and carrier", icon: "📦" },
    { id: "set_reminder", name: "Set Reminder", description: "Remind me to check delivery", icon: "⏰" },
    { id: "mark_done", name: "Mark Delivered", description: "Mark as delivered", icon: "✅" },
    { id: "dismiss", name: "Dismiss", description: "Remove from queue", icon: "🗑️" },
  ],
  SCHEDULE_MEETING: [
    { id: "extract_details", name: "Extract Details", description: "Extract meeting time, location, attendees", icon: "📅" },
    { id: "draft_reply", name: "Confirm/Decline", description: "Draft a response", icon: "✏️" },
    { id: "mark_done", name: "Mark Done", description: "Mark as handled", icon: "✅" },
    { id: "dismiss", name: "Dismiss", description: "Remove from queue", icon: "🗑️" },
  ],
  UNSUBSCRIBE: [
    { id: "find_unsubscribe", name: "Find Unsubscribe Link", description: "Locate unsubscribe URL in email", icon: "🔗" },
    { id: "confirm_delete", name: "Delete", description: "Delete this email", icon: "🗑️" },
    { id: "dismiss", name: "Keep", description: "Keep subscription", icon: "↩️" },
  ],
  SAVE_RECEIPT: [
    { id: "extract_amount", name: "Extract Details", description: "Extract amount, vendor, date", icon: "🧾" },
    { id: "archive", name: "Archive", description: "Move to archive", icon: "📦" },
    { id: "dismiss", name: "Dismiss", description: "Remove from queue", icon: "🗑️" },
  ],
  ACKNOWLEDGE: [
    { id: "mark_done", name: "Acknowledge", description: "Mark as acknowledged", icon: "✅" },
    { id: "dismiss", name: "Dismiss", description: "Remove from queue", icon: "🗑️" },
  ],
  NO_ACTION: [
    { id: "archive", name: "Archive", description: "Move to archive", icon: "📦" },
    { id: "dismiss", name: "Dismiss", description: "Remove from queue", icon: "🗑️" },
  ],
  IGNORE: [
    { id: "confirm_delete", name: "Delete", description: "Delete this email", icon: "🗑️" },
    { id: "dismiss", name: "Dismiss", description: "Remove from queue", icon: "🗑️" },
  ],
};

/**
 * Default commands for any event type not in the map.
 */
const DEFAULT_COMMANDS = [
  { id: "summarize", name: "Summarize", description: "Get a quick LLM summary", icon: "📝" },
  { id: "mark_done", name: "Mark Done", description: "Mark as handled", icon: "✅" },
  { id: "dismiss", name: "Dismiss", description: "Remove from queue", icon: "🗑️" },
];

/**
 * Get commands for an event type.
 * @param {string} eventType
 * @returns {Command[]}
 */
export function getCommandsForEvent(eventType) {
  const normalized = eventType?.toUpperCase?.() || "";
  return COMMAND_MAP[normalized] || DEFAULT_COMMANDS;
}

/**
 * Get all registered event types.
 * @returns {string[]}
 */
export function getRegisteredEventTypes() {
  return Object.keys(COMMAND_MAP);
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
