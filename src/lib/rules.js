/**
 * Rule CRUD
 *
 * Rules are the central pipeline unit of the routing architecture.
 * Each rule connects a trigger condition (EventType and/or EventCategory)
 * to an ordered list of Actions and an ExecutionPolicy.
 *
 * Triple notation: event_type : action(s)
 *   e.g. "ad:delete" or "invoice:notify+forward"
 */

import { query, exec, toJson, fromJson } from "./store/db.js";

// ── Types ──────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Action
 * @property {string}  id          — unique command instance ID within this rule
 * @property {string}  pluginId    — plugin that handles this step (e.g. "gmail")
 * @property {string}  commandId   — handler ID on that plugin (e.g. "trash")
 * @property {string}  name        — display name
 * @property {string}  description — what it does
 * @property {string}  [icon]      — optional emoji
 */

/**
 * @typedef {Object} Rule
 * @property {string}   id
 * @property {string}   name
 * @property {string}   description
 * @property {boolean}  enabled
 * @property {number}   priority    — higher = evaluated first
 * @property {number}   created_at  — unix ms
 * @property {Trigger[]} triggers
 * @property {Action[]} actions     — ordered plugin-bound action objects
 */

/**
 * @typedef {Object} Trigger
 * @property {'event_type'|'event_category'} type
 * @property {string} name
 */

// ── Seed / static data queries ─────────────────────────────────────────

export async function getEventTypes() {
  await import("./store/db.js").then(m => m.getDb());
  return query(`SELECT name, label FROM sm_event_types ORDER BY name`);
}

export async function getEventCategories() {
  await import("./store/db.js").then(m => m.getDb());
  return query(`SELECT name, label, priority FROM sm_event_categories ORDER BY priority`);
}

export async function getSources() {
  await import("./store/db.js").then(m => m.getDb());
  return query(`SELECT name, label, platform, api, enabled FROM sm_sources ORDER BY name`);
}

export async function getExecutionPolicies() {
  await import("./store/db.js").then(m => m.getDb());
  /* DEPRECATED: execution policies are hardcoded to NOISE/CRITICAL groups */
  return [];
}

export async function getActions() {
  await import("./store/db.js").then(m => m.getDb());
  return query(`SELECT name, label FROM sm_actions ORDER BY name`);
}

export async function getPlugins() {
  await import("./store/db.js").then(m => m.getDb());
  const plugins = await query(`SELECT name, label, version, enabled FROM sm_plugins ORDER BY name`);
  return Promise.all(plugins.map(async p => ({
    ...p,
    actions: (await query(
      `SELECT a.name, a.label FROM sm_plugin_actions pa
       JOIN sm_actions a ON a.name = pa.action_name
       WHERE pa.plugin_name = '${p.name}'`
    )),
    sources: (await query(
      `SELECT s.name, s.label FROM sm_plugin_sources ps
       JOIN sm_sources s ON s.name = ps.source_name
       WHERE ps.plugin_name = '${p.name}'`
    )),
  })));
}

// ── Rule queries ───────────────────────────────────────────────────────

/**
 * Get all rules with their triggers, actions, and policy.
 * @returns {Promise<Rule[]>}
 */
export async function getRules() {
  const { getDb } = await import("./store/db.js");
  await getDb();

  const rules = await query(
    `SELECT id, name, description, enabled, priority, created_at
     FROM sm_rules ORDER BY priority DESC`
  );

  return Promise.all(rules.map(async r => {
    const triggers = await query(
      `SELECT trigger_type as type, trigger_name as name
       FROM sm_rule_triggers WHERE rule_id = '${r.id}'`
    );
    const actions = await query(
      `SELECT command_id as id, plugin_id as pluginId, action_id as commandId, 
              name, description, icon 
       FROM sm_rule_commands
       WHERE rule_id = '${r.id}' ORDER BY order_idx`
    );
    return {
      ...r,
      enabled: Boolean(r.enabled),
      triggers,
      actions: actions,
    };
  }));
}

/**
 * Get a single rule by ID.
 * @param {string} id
 * @returns {Promise<Rule|null>}
 */
export async function getRule(id) {
  const { getDb } = await import("./store/db.js");
  await getDb();

  const rows = await query(
    `SELECT id, name, description, enabled, priority, created_at
     FROM sm_rules WHERE id = '${id}'`
  );
  if (!rows.length) return null;
  const r = rows[0];

  const triggers = await query(
    `SELECT trigger_type as type, trigger_name as name
     FROM sm_rule_triggers WHERE rule_id = '${id}'`
  );
  const actions = await query(
    `SELECT command_id as id, plugin_id as pluginId, action_id as commandId, 
            name, description, icon 
     FROM sm_rule_commands
     WHERE rule_id = '${id}' ORDER BY order_idx`
  );
  return {
    ...r,
    enabled: Boolean(r.enabled),
    triggers,
    actions: actions,
  };
}

/**
 * Create a new rule.
 * @param {Omit<Rule, 'id'|'created_at'>} rule
 * @returns {Promise<string>} new rule ID
 */
export async function createRule({ name, description, enabled, priority, triggers, actions }) {
  const id = `rule_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = Date.now();

  await exec(
    `INSERT INTO sm_rules VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name, description ?? "", enabled ?? true, priority ?? 5, now]
  );

  for (const t of (triggers ?? [])) {
    await exec(
      `INSERT INTO sm_rule_triggers VALUES (?, ?, ?)`,
      [id, t.type, t.name]
    );
  }

  for (let i = 0; i < (actions ?? []).length; i++) {
    const a = actions[i];
    await exec(
      `INSERT INTO sm_rule_commands VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, a.id, a.pluginId, a.commandId, a.name, a.description, a.icon, i + 1]
    );
  }

  return id;
}

/**
 * Update an existing rule (full replace of triggers/actions/policy).
 * @param {string} id
 * @param {Partial<Rule>} updates
 */
export async function updateRule(id, updates) {
  const fields = [];
  const params = [];

  if (updates.name !== undefined) { fields.push("name = ?"); params.push(updates.name); }
  if (updates.description !== undefined) { fields.push("description = ?"); params.push(updates.description); }
  if (updates.enabled !== undefined) { fields.push("enabled = ?"); params.push(updates.enabled); }
  if (updates.priority !== undefined) { fields.push("priority = ?"); params.push(updates.priority); }

  if (fields.length > 0) {
    await exec(`UPDATE sm_rules SET ${fields.join(", ")} WHERE id = ?`, [...params, id]);
  }

  if (updates.triggers !== undefined) {
    await exec(`DELETE FROM sm_rule_triggers WHERE rule_id = ?`, [id]);
    for (const t of updates.triggers) {
      await exec(`INSERT INTO sm_rule_triggers VALUES (?, ?, ?)`, [id, t.type, t.name]);
    }
  }

  if (updates.actions !== undefined) {
    await exec(`DELETE FROM sm_rule_commands WHERE rule_id = ?`, [id]);
    for (let i = 0; i < updates.actions.length; i++) {
      const a = updates.actions[i];
      await exec(
        `INSERT INTO sm_rule_commands VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, a.id, a.pluginId, a.commandId, a.name, a.description, a.icon, i + 1]
      );
    }
  }
}

/**
 * Toggle a rule enabled/disabled.
 * @param {string} id
 * @param {boolean} enabled
 */
export async function setRuleEnabled(id, enabled) {
  await exec(`UPDATE sm_rules SET enabled = ? WHERE id = ?`, [enabled, id]);
}

/**
 * Delete a rule and all its related rows.
 * @param {string} id
 */
export async function deleteRule(id) {
  await exec(`DELETE FROM sm_rules WHERE id = ?`, [id]);
  await exec(`DELETE FROM sm_rule_triggers WHERE rule_id = ?`, [id]);
  await exec(`DELETE FROM sm_rule_commands WHERE rule_id = ?`, [id]);
}

// ── Event queries ──────────────────────────────────────────────────────

/**
 * Get events (immutable event stream).
 * @param {{ status?: string, eventType?: string, source?: string, limit?: number }} opts
 * @returns {Promise<Object[]>}
 */
export async function getEvents({ status, eventType, source, limit = 100 } = {}) {
  const { getDb } = await import("./store/db.js");
  await getDb();

  const conditions = [];
  if (status) conditions.push(`status = '${status}'`);
  if (eventType) conditions.push(`event_type = '${eventType}'`);
  if (source) conditions.push(`source_name = '${source}'`);

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = await query(
    `SELECT e.*, r.name as rule_name, r.priority as rule_priority
     FROM sm_events e
     LEFT JOIN sm_rules r ON r.id = e.rule_id
     ${where}
     ORDER BY e.timestamp DESC
     LIMIT ${limit}`
  );

  return rows.map(r => ({
    ...r,
    actions_taken: fromJson(r.actions_taken, []),
    output: fromJson(r.output, null),
  }));
}

/**
 * Insert a new event.
 * @param {Object} evt
 */
export async function insertEvent(evt) {
  const { getDb } = await import("./store/db.js");
  await getDb();

  await exec(
    `INSERT INTO sm_events VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      evt.id,
      evt.content ?? "",
      evt.subject ?? "",
      evt.sender ?? "",
      evt.timestamp ?? Date.now(),
      evt.status ?? "completed",
      evt.event_type ?? "",
      evt.event_category ?? "",
      evt.source_name ?? "",
      evt.rule_id ?? null,
      toJson(evt.actions_taken ?? []),
      toJson(evt.output ?? null),
    ]
  );
}

/**
 * Update an event's status.
 * @param {string} id
 * @param {string} status
 */
export async function updateEventStatus(id, status) {
  await exec(`UPDATE sm_events SET status = ? WHERE id = ?`, [status, id]);
}

/**
 * Delete all events from the audit trail (Deprecated, use audit.js methods).
 */
export async function clearAllEvents() {
  await exec(`DELETE FROM sm_events`);
}

/**
 * Get event statistics (counts by status).
 * Reads from emailClassifications (pending) and auditLog (completed/failed).
 * @returns {Promise<Object>}
 */
export async function getEventStats() {
  const { getDb } = await import("./store/db.js");
  await getDb();

  // "awaiting_user" = number of pending items with category pointing to policy 'manual' (important/urgent)
  // "escalated" = number of items where status='escalated'
  // "completed" = number of auditLog success=true
  // "failed" = number of auditLog success=false

  const [pendingStats] = await query(`
    SELECT 
      COUNT(*) FILTER (WHERE status = 'pending' AND LOWER("group") IN (SELECT LOWER(name) FROM sm_event_categories WHERE policy = 'manual')) as awaiting_user,
      COUNT(*) FILTER (WHERE status = 'escalated') as escalated
    FROM emailClassifications
  `);

  const [auditStats] = await query(`
    SELECT
      COUNT(*) FILTER (WHERE success = true) as completed,
      COUNT(*) FILTER (WHERE success = false) as failed,
      COUNT(*) as total_audit
    FROM auditLog
  `);

  const stats = {
    awaiting_user: Number(pendingStats?.awaiting_user || 0),
    escalated: Number(pendingStats?.escalated || 0),
    completed: Number(auditStats?.completed || 0),
    failed: Number(auditStats?.failed || 0),
  };
  stats.total = stats.awaiting_user + stats.escalated + stats.completed + stats.failed;

  return stats;
}

// ── Approvals & Manual Execution (New Architecture) ─────────────────────────

/**
 * Get pending approvals.
 * These are items in emailClassifications with status='pending'
 * where the assigned category maps to a rule policy 'manual' (e.g., 'important' or 'urgent').
 */
export async function getPendingApprovals({ limit = 100 } = {}) {
  const { getDb } = await import("./store/db.js");
  await getDb();

  const rows = await query(`
    SELECT 
      c.emailId as id,
      COALESCE(i.subject, c.subject) as subject,
      COALESCE(i."from", c."from") as source_name,
      i.body as content,
      COALESCE(i.date, c.date) as timestamp,
      c."group" as event_category,
      c.action as event_type,
      c.reason,
      c.summary,
      c.status
    FROM emailClassifications c
    LEFT JOIN items i ON c.emailId = i.id
    WHERE c.status = 'pending'
      AND LOWER(c."group") IN (
        SELECT LOWER(name) FROM sm_event_categories WHERE policy = 'manual'
      )
    ORDER BY COALESCE(i.date, c.date) DESC
    LIMIT ?
  `, [limit]);

  return rows.map(r => ({
    ...r,
    sender: r.source_name, // fallback for UI
    from: r.source_name,
    actions_taken: [],
    // synthesize a rule name based on category if needed
    rule_name: `Manual Review: ${r.event_category}`,
  }));
}

/**
 * Get pending count for a category (for UI badge).
 * @param {string} categoryName
 * @returns {Promise<number>}
 */
export async function getPendingCountByCategory(categoryName) {
  const { getDb } = await import("./store/db.js");
  await getDb();
  const rows = await query(
    `SELECT COUNT(*) as n FROM emailClassifications
     WHERE LOWER(TRIM("group")) = LOWER(TRIM(?)) AND status IN ('pending', 'escalated')`,
    [categoryName],
  );
  return Number(rows[0]?.n ?? 0);
}

/**
 * Get pending items (emailClassifications) for a given category.
 * Used by Pipelines view to run the category pipeline on all pending events of that category.
 *
 * @param {string} categoryName — category name (e.g. "noise", "important")
 * @param {{ limit?: number }} [opts]
 * @returns {Promise<Array<{ id: string, emailId: string, subject: string, from: string, eventType: string, event_category: string, sourceType: string, status: string }>>}
 */
export async function getPendingItemsByCategory(categoryName, { limit = 500 } = {}) {
  const { getDb } = await import("./store/db.js");
  await getDb();

  const rows = await query(
    `SELECT
       c.emailId as id,
       COALESCE(i.subject, c.subject) as subject,
       COALESCE(i."from", c."from") as "from",
       c.action as eventType,
       c."group" as event_category,
       c.status,
       i.sourceType as sourceType
     FROM emailClassifications c
     LEFT JOIN items i ON c.emailId = i.id
     WHERE LOWER(TRIM(c."group")) = LOWER(TRIM(?))
       AND c.status IN ('pending', 'escalated')
     ORDER BY COALESCE(i.date, c.date) DESC
     LIMIT ?`,
    [categoryName, limit],
  );

  return rows.map((r) => ({
    id: r.id,
    emailId: r.id,
    subject: r.subject ?? "",
    from: r.from ?? "",
    eventType: r.eventType ?? "UNKNOWN",
    event_category: r.event_category ?? categoryName,
    sourceType: r.sourceType ?? "gmail",
    status: r.status ?? "pending",
  }));
}

/**
 * Approve a pending classification for execution.
 * Marks it as 'approved'. The actual execution is typically handled 
 * via ChatView / executePipeline with approved=true, but we can update state here.
 */
export async function approveClassification(id) {
  const { getDb } = await import("./store/db.js");
  await getDb();
  await exec(`UPDATE emailClassifications SET status = 'approved' WHERE emailId = ?`, [id]);
}

/**
 * Reject a pending classification (escalate).
 */
export async function rejectClassification(id) {
  const { getDb } = await import("./store/db.js");
  await getDb();
  await exec(`UPDATE emailClassifications SET status = 'escalated' WHERE emailId = ?`, [id]);
}

// ── Matching: find rules for an event ──────────────────────────────────

/**
 * Find all enabled rules that match a given event type + category.
 * Implements AND logic for rules with multiple triggers (all must match).
 *
 * @param {string} eventType
 * @param {string} eventCategory
 * @returns {Promise<Rule[]>} sorted by priority desc
 */
export async function findMatchingRules(eventType, eventCategory) {
  const allRules = await getRules();
  const enabled = allRules.filter(r => r.enabled);

  return enabled
    .filter(rule => {
      const typeTriggers = rule.triggers.filter(t => t.type === "event_type");
      const catTriggers = rule.triggers.filter(t => t.type === "event_category");

      const typeMatch = typeTriggers.length === 0 || typeTriggers.some(t => t.name === eventType);
      const catMatch = catTriggers.length === 0 || catTriggers.some(t => t.name === eventCategory);

      return typeMatch && catMatch;
    })
    .sort((a, b) => b.priority - a.priority);
}

// ── Category-based pipeline resolution ─────────────────────────────────

/**
 * Get the pipeline for an event type using the category-based model.
 *
 * Resolution order:
 * 1. Check sm_type_pipeline for a per-type override
 * 2. Look up the event type's category from sm_event_types
 * 3. Use sm_category_pipeline for the category's default pipeline
 *
 * @param {string} eventType — UPPER_SNAKE_CASE event type name
 * @returns {Promise<{ actions: Array<{pluginId: string, commandId: string, order: number}>, policy: string, category: string }>}
 */
export async function getPipelineForEvent(eventType) {
  const normalized = eventType?.toUpperCase?.().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "") || "";

  // 1. Check for per-type override
  const typeOverride = await query(`
    SELECT plugin_id, command_id, action_idx
    FROM sm_type_pipeline
    WHERE type_name = ?
    ORDER BY action_idx
  `, [normalized]);

  // 2. Look up the event type's category
  const typeRow = await query(`
    SELECT category_name FROM sm_event_types WHERE UPPER(name) = ?
  `, [normalized]);
  const category = typeRow?.[0]?.category_name || "important";

  // 3. Get category policy
  const catRow = await query(`
    SELECT policy FROM sm_event_categories WHERE name = ?
  `, [category]);
  const policy = catRow?.[0]?.policy || "manual";

  if (typeOverride?.length > 0) {
    return {
      actions: typeOverride.map(r => ({
        pluginId: r.plugin_id,
        commandId: r.command_id,
        order: r.action_idx,
      })),
      policy,
      category,
      isOverride: true,
    };
  }

  // 4. Fall back to category default pipeline
  const catPipeline = await query(`
    SELECT plugin_id, command_id, action_idx
    FROM sm_category_pipeline
    WHERE category_name = ?
    ORDER BY action_idx
  `, [category]);

  return {
    actions: (catPipeline || []).map(r => ({
      pluginId: r.plugin_id,
      commandId: r.command_id,
      order: r.action_idx,
    })),
    policy,
    category,
    isOverride: false,
  };
}

/**
 * Get all category pipelines for display in the UI.
 * @returns {Promise<Array<{category: string, label: string, priority: number, policy: string, actions: Array}>>}
 */
export async function getCategoryPipelines() {
  const categories = await query(`
    SELECT name, label, priority, policy FROM sm_event_categories ORDER BY priority
  `);

  const pipelines = await query(`
    SELECT category_name, plugin_id, command_id, action_idx
    FROM sm_category_pipeline
    ORDER BY category_name, action_idx
  `);

  const types = await query(`
    SELECT name, label, category_name, auto_created FROM sm_event_types ORDER BY name
  `);

  return (categories || []).map(cat => ({
    category: cat.name,
    label: cat.label,
    priority: cat.priority,
    policy: cat.policy,
    actions: (pipelines || [])
      .filter(p => p.category_name === cat.name)
      .map(p => ({ pluginId: p.plugin_id, commandId: p.command_id, order: p.action_idx })),
    eventTypes: (types || [])
      .filter(t => t.category_name === cat.name)
      .map(t => ({ name: t.name, label: t.label, autoCreated: t.auto_created })),
  }));
}

/**
 * Update a category's default pipeline (replaces all actions).
 * @param {string} categoryName
 * @param {Array<{pluginId: string, commandId: string}>} actions — ordered
 */
export async function updateCategoryPipeline(categoryName, actions) {
  await query(`DELETE FROM sm_category_pipeline WHERE category_name = ?`, [categoryName]);
  for (let i = 0; i < actions.length; i++) {
    await query(`
      INSERT INTO sm_category_pipeline (category_name, action_idx, plugin_id, command_id)
      VALUES (?, ?, ?, ?)
    `, [categoryName, i, actions[i].pluginId, actions[i].commandId]);
  }
}

/**
 * Update a category's execution policy.
 * @param {string} categoryName
 * @param {string} policy — auto | supervised | manual
 */
export async function updateCategoryPolicy(categoryName, policy) {
  await query(`UPDATE sm_event_categories SET policy = ? WHERE name = ?`, [policy, categoryName]);
}

/**
 * Move an event type to a different category.
 * @param {string} eventTypeName
 * @param {string} newCategory
 */
export async function moveEventTypeToCategory(eventTypeName, newCategory) {
  await query(`UPDATE sm_event_types SET category_name = ? WHERE name = ?`, [newCategory, eventTypeName]);
}

/**
 * Remove an event type's category assignment (set to NULL).
 * @param {string} eventTypeName
 */
export async function unassignEventTypeFromCategory(eventTypeName) {
  await query(`UPDATE sm_event_types SET category_name = NULL WHERE name = ?`, [eventTypeName]);
}

/**
 * Delete an event type completely from the system.
 * @param {string} eventTypeName
 */
export async function deleteEventType(eventTypeName) {
  await query(`DELETE FROM sm_type_pipeline WHERE type_name = ?`, [eventTypeName]);
  await query(`DELETE FROM sm_event_types WHERE name = ?`, [eventTypeName]);
}

// ── Source management ──────────────────────────────────────────────────

/**
 * Toggle a source enabled/disabled.
 * @param {string} name
 * @param {boolean} enabled
 */
export async function setSourceEnabled(name, enabled) {
  await exec(`UPDATE sm_sources SET enabled = ? WHERE name = ?`, [enabled, name]);
}

/**
 * Toggle a plugin enabled/disabled.
 * @param {string} name
 * @param {boolean} enabled
 */
export async function setPluginEnabled(name, enabled) {
  await exec(`UPDATE sm_plugins SET enabled = ? WHERE name = ?`, [enabled, name]);
}

// ── Auto-seeding ────────────────────────────────────────────────────────────

/**
 * Auto-seed a pipeline rule for a newly discovered event type (from LLM triage).
 * Creates a new rule only if no enabled rule already has a matching event_type trigger.
 * Called by `seedEventTypeFromLLM` in events.js each time the LLM classifies
 * a new event type so that `findMatchingRules` / execution-service.js can run it.
 *
 * @param {string}   eventType — normalized event type key (e.g. "TRASH", "AD")
 * @param {string}   policy    — 'auto' | 'supervised' | 'manual'
 * @param {Action[]} actions   — plugin-bound action objects (pluginId + commandId must be set)
 */
export async function seedRuleForEventType(eventType, policy, actions) {
  if (!eventType || !actions?.length) return;

  const existing = await findMatchingRules(eventType, "");
  const alreadyHasRule = existing.some(r =>
    r.triggers.some(t => t.type === "event_type" && t.name === eventType)
  );
  if (alreadyHasRule) return;

  const label = eventType.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const ts = Date.now();

  await createRule({
    name: `${label} Pipeline`,
    description: `Auto-generated pipeline for "${eventType}" events`,
    enabled: true,
    priority: 5,
    triggers: [{ type: "event_type", name: eventType }],
    actions: actions.map((a, i) => ({
      id: `${a.commandId || "cmd"}_${ts}_${i}`,
      pluginId: a.pluginId || "",
      commandId: a.commandId || "",
      name: a.name || a.commandId || "",
      description: a.description || "",
      icon: a.icon,
    }))
  });
}
