/**
 * Rule CRUD
 *
 * Rules are the central pipeline unit of the routing architecture.
 * Each rule connects a trigger condition (EventType and/or EventCategory)
 * to an ordered list of Actions and an ExecutionPolicy.
 */

import { query, exec, toJson, fromJson } from "./store/db.js";
import type { Rule, Action, Trigger } from "$lib/types";

// ── Seed / static data queries ─────────────────────────────────────────

async function getEventTypesFromDb(): Promise<Record<string, unknown>[]> {
  await import("./store/db.js").then((m) => m.getDb());
  return query(`SELECT name, label FROM sm_event_types ORDER BY name`);
}

/** Event types from DB; uses me-ai-core (WASM) when available, else TS query. */
export async function getEventTypes(): Promise<Record<string, unknown>[]> {
  try {
    const core = await import("./core.js").then((m) => m.loadCore());
    const rows = await core.getEventTypes();
    return Array.isArray(rows) ? (rows as Record<string, unknown>[]) : await getEventTypesFromDb();
  } catch {
    return getEventTypesFromDb();
  }
}

export async function getEventCategories(): Promise<Record<string, unknown>[]> {
  await import("./store/db.js").then((m) => m.getDb());
  return query(`SELECT name, label, priority FROM sm_event_categories ORDER BY priority`);
}

export async function getSources(): Promise<Record<string, unknown>[]> {
  await import("./store/db.js").then((m) => m.getDb());
  return query(`SELECT name, label, platform, api, enabled FROM sm_sources ORDER BY name`);
}

export async function getExecutionPolicies(): Promise<unknown[]> {
  await import("./store/db.js").then((m) => m.getDb());
  return [];
}

export async function getActions(): Promise<Record<string, unknown>[]> {
  await import("./store/db.js").then((m) => m.getDb());
  return query(`SELECT name, label FROM sm_actions ORDER BY name`);
}

export async function getPlugins(): Promise<Record<string, unknown>[]> {
  await import("./store/db.js").then((m) => m.getDb());
  const plugins = await query(`SELECT name, label, version, enabled FROM sm_plugins ORDER BY name`);
  return Promise.all(
    plugins.map(async (p) => {
      const name = p.name as string;
      return {
        ...p,
        actions: await query(
          `SELECT a.name, a.label FROM sm_plugin_actions pa
           JOIN sm_actions a ON a.name = pa.action_name
           WHERE pa.plugin_name = ?`,
          [name]
        ),
        sources: await query(
          `SELECT s.name, s.label FROM sm_plugin_sources ps
           JOIN sm_sources s ON s.name = ps.source_name
           WHERE ps.plugin_name = ?`,
          [name]
        ),
      };
    })
  );
}

// ── Rule queries ───────────────────────────────────────────────────────

export async function getRules(): Promise<Rule[]> {
  const { getDb } = await import("./store/db.js");
  await getDb();

  const rules = await query(
    `SELECT id, name, description, enabled, priority, created_at
     FROM sm_rules ORDER BY priority DESC`
  );

  return Promise.all(
    rules.map(async (r) => {
      const id = r.id as string;
      const triggers = await query(
        `SELECT trigger_type as type, trigger_name as name
         FROM sm_rule_triggers WHERE rule_id = ?`,
        [id]
      );
      const actions = await query(
        `SELECT command_id as id, plugin_id as pluginId, action_id as commandId, 
                name, description, icon 
         FROM sm_rule_commands
         WHERE rule_id = ? ORDER BY order_idx`,
        [id]
      );
      return {
        ...r,
        enabled: Boolean(r.enabled),
        triggers: triggers as unknown as Trigger[],
        actions: actions as unknown as Action[],
      } as Rule;
    })
  );
}

export async function getRule(id: string): Promise<Rule | null> {
  const { getDb } = await import("./store/db.js");
  await getDb();

  const rows = await query(
    `SELECT id, name, description, enabled, priority, created_at
     FROM sm_rules WHERE id = ?`,
    [id]
  );
  if (!rows.length) return null;
  const r = rows[0];

  const triggers = await query(
    `SELECT trigger_type as type, trigger_name as name
     FROM sm_rule_triggers WHERE rule_id = ?`,
    [id]
  );
  const actions = await query(
    `SELECT command_id as id, plugin_id as pluginId, action_id as commandId, 
            name, description, icon 
     FROM sm_rule_commands
     WHERE rule_id = ? ORDER BY order_idx`,
    [id]
  );
  return {
    ...r,
    enabled: Boolean(r.enabled),
    triggers: triggers as unknown as Trigger[],
    actions: actions as unknown as Action[],
  } as Rule;
}

export interface CreateRuleInput {
  name: string;
  description?: string;
  enabled?: boolean;
  priority?: number;
  triggers?: Trigger[];
  actions?: Action[];
}

export async function createRule({
  name,
  description,
  enabled = true,
  priority = 5,
  triggers = [],
  actions = [],
}: CreateRuleInput): Promise<string> {
  const id = `rule_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = Date.now();

  await exec(`INSERT INTO sm_rules VALUES (?, ?, ?, ?, ?, ?)`, [
    id,
    name,
    description ?? "",
    enabled,
    priority,
    now,
  ]);

  for (const t of triggers) {
    await exec(`INSERT INTO sm_rule_triggers VALUES (?, ?, ?)`, [id, t.type, t.name]);
  }

  for (let i = 0; i < actions.length; i++) {
    const a = actions[i];
    await exec(`INSERT INTO sm_rule_commands VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
      id,
      a.id,
      a.pluginId,
      a.commandId,
      a.name,
      a.description,
      a.icon ?? null,
      i + 1,
    ]);
  }

  return id;
}

export async function updateRule(id: string, updates: Partial<Rule>): Promise<void> {
  const fields: string[] = [];
  const params: unknown[] = [];

  if (updates.name !== undefined) {
    fields.push("name = ?");
    params.push(updates.name);
  }
  if (updates.description !== undefined) {
    fields.push("description = ?");
    params.push(updates.description);
  }
  if (updates.enabled !== undefined) {
    fields.push("enabled = ?");
    params.push(updates.enabled);
  }
  if (updates.priority !== undefined) {
    fields.push("priority = ?");
    params.push(updates.priority);
  }

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
      await exec(`INSERT INTO sm_rule_commands VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
        id,
        a.id,
        a.pluginId,
        a.commandId,
        a.name,
        a.description,
        a.icon ?? null,
        i + 1,
      ]);
    }
  }
}

export async function setRuleEnabled(id: string, enabled: boolean): Promise<void> {
  await exec(`UPDATE sm_rules SET enabled = ? WHERE id = ?`, [enabled, id]);
}

export async function deleteRule(id: string): Promise<void> {
  await exec(`DELETE FROM sm_rules WHERE id = ?`, [id]);
  await exec(`DELETE FROM sm_rule_triggers WHERE rule_id = ?`, [id]);
  await exec(`DELETE FROM sm_rule_commands WHERE rule_id = ?`, [id]);
}

// ── Event queries ──────────────────────────────────────────────────────

export interface GetEventsOptions {
  status?: string;
  eventType?: string;
  source?: string;
  limit?: number;
}

export async function getEvents({
  status,
  eventType,
  source,
  limit = 100,
}: GetEventsOptions = {}): Promise<Record<string, unknown>[]> {
  const { getDb } = await import("./store/db.js");
  await getDb();

  const conditions: string[] = [];
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

  return rows.map((r) => ({
    ...r,
    actions_taken: fromJson(r.actions_taken as string, []),
    output: fromJson(r.output as string, null),
  }));
}

export interface InsertEventInput {
  id?: string;
  content?: string;
  subject?: string;
  sender?: string;
  timestamp?: number;
  status?: string;
  event_type?: string;
  event_category?: string;
  source_name?: string;
  rule_id?: string | null;
  actions_taken?: unknown[];
  output?: unknown;
}

export async function insertEvent(evt: InsertEventInput): Promise<void> {
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

export async function updateEventStatus(id: string, status: string): Promise<void> {
  await exec(`UPDATE sm_events SET status = ? WHERE id = ?`, [status, id]);
}

export async function clearAllEvents(): Promise<void> {
  await exec(`DELETE FROM sm_events`);
}

export interface EventStats {
  awaiting_user: number;
  escalated: number;
  completed: number;
  failed: number;
  total: number;
}

export async function getEventStats(): Promise<EventStats> {
  const { getDb } = await import("./store/db.js");
  await getDb();

  const [pendingStats] = await query(`
    SELECT 
      COUNT(*) FILTER (WHERE status = 'pending' AND LOWER(category) IN (SELECT LOWER(name) FROM sm_event_categories WHERE policy = 'manual')) as awaiting_user,
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
    awaiting_user: Number((pendingStats as Record<string, unknown>)?.awaiting_user || 0),
    escalated: Number((pendingStats as Record<string, unknown>)?.escalated || 0),
    completed: Number((auditStats as Record<string, unknown>)?.completed || 0),
    failed: Number((auditStats as Record<string, unknown>)?.failed || 0),
  };
  (stats as EventStats).total =
    stats.awaiting_user + stats.escalated + stats.completed + stats.failed;

  return stats as EventStats;
}

// ── Approvals & Manual Execution ───────────────────────────────────────

export async function getPendingApprovals({
  limit = 100,
}: { limit?: number } = {}): Promise<Record<string, unknown>[]> {
  const { getDb } = await import("./store/db.js");
  await getDb();

  const rows = await query(
    `
    SELECT 
      c.emailId as id,
      COALESCE(i.subject, c.subject) as subject,
      COALESCE(i."from", c."from") as source_name,
      i.body as content,
      COALESCE(i.date, c.date) as timestamp,
      c.category as event_category,
      c.action as event_type,
      c.reason,
      c.summary,
      c.status
    FROM emailClassifications c
    LEFT JOIN items i ON c.emailId = i.id
    WHERE c.status = 'pending'
      AND LOWER(c.category) IN (
        SELECT LOWER(name) FROM sm_event_categories WHERE policy = 'manual'
      )
    ORDER BY COALESCE(i.date, c.date) DESC
    LIMIT ?
  `,
    [limit]
  );

  return rows.map((r) => ({
    ...r,
    sender: (r as Record<string, unknown>).source_name,
    from: (r as Record<string, unknown>).source_name,
    actions_taken: [],
    rule_name: `Manual Review: ${(r as Record<string, unknown>).event_category}`,
  }));
}

export async function getPendingCountByCategory(categoryName: string): Promise<number> {
  const { getDb } = await import("./store/db.js");
  await getDb();
  const rows = await query(
    `SELECT COUNT(*) as n FROM emailClassifications
     WHERE LOWER(TRIM(category)) = LOWER(TRIM(?)) AND status IN ('pending', 'escalated')`,
    [categoryName]
  );
  return Number((rows[0] as Record<string, unknown>)?.n ?? 0);
}

export interface PendingItemByCategory {
  id: string;
  emailId: string;
  subject: string;
  from: string;
  eventType: string;
  event_category: string;
  sourceType: string;
  status: string;
}

export async function getPendingItemsByCategory(
  categoryName: string,
  { limit = 500 }: { limit?: number } = {}
): Promise<PendingItemByCategory[]> {
  const { getDb } = await import("./store/db.js");
  await getDb();

  const rows = await query(
    `SELECT
       c.emailId as id,
       COALESCE(i.subject, c.subject) as subject,
       COALESCE(i."from", c."from") as "from",
       c.action as eventType,
       c.category as event_category,
       c.status,
       i.sourceType as sourceType
     FROM emailClassifications c
     LEFT JOIN items i ON c.emailId = i.id
     WHERE LOWER(TRIM(c.category)) = LOWER(TRIM(?))
       AND c.status IN ('pending', 'escalated')
     ORDER BY COALESCE(i.date, c.date) DESC
     LIMIT ?`,
    [categoryName, limit]
  );

  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: row.id as string,
      emailId: row.id as string,
      subject: (row.subject ?? "") as string,
      from: (row.from ?? "") as string,
      eventType: (row.eventType ?? "UNKNOWN") as string,
      event_category: (row.event_category ?? categoryName) as string,
      sourceType: (row.sourceType ?? "gmail") as string,
      status: (row.status ?? "pending") as string,
    };
  });
}

export async function approveClassification(id: string): Promise<void> {
  const { getDb } = await import("./store/db.js");
  await getDb();
  await exec(`UPDATE emailClassifications SET status = 'approved' WHERE emailId = ?`, [id]);
}

export async function rejectClassification(id: string): Promise<void> {
  const { getDb } = await import("./store/db.js");
  await getDb();
  await exec(`UPDATE emailClassifications SET status = 'escalated' WHERE emailId = ?`, [id]);
}

// ── Matching ──────────────────────────────────────────────────────────

export async function findMatchingRules(
  eventType: string,
  eventCategory: string
): Promise<Rule[]> {
  const allRules = await getRules();
  const enabled = allRules.filter((r) => r.enabled);

  return enabled
    .filter((rule) => {
      const typeTriggers = rule.triggers.filter((t) => t.type === "event_type");
      const catTriggers = rule.triggers.filter((t) => t.type === "event_category");
      const typeMatch =
        typeTriggers.length === 0 || typeTriggers.some((t) => t.name === eventType);
      const catMatch =
        catTriggers.length === 0 || catTriggers.some((t) => t.name === eventCategory);
      return typeMatch && catMatch;
    })
    .sort((a, b) => b.priority - a.priority);
}

// ── Category-based pipeline resolution ─────────────────────────────────

export interface PipelineForEvent {
  actions: Array<{ pluginId: string; commandId: string; order: number }>;
  policy: string;
  category: string;
  isOverride?: boolean;
}

export async function getPipelineForEvent(eventType: string): Promise<PipelineForEvent | null> {
  const normalized =
    eventType?.toUpperCase?.().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "") || "";

  const typeOverride = await query(
    `SELECT plugin_id, command_id, action_idx
    FROM sm_type_pipeline
    WHERE type_name = ?
    ORDER BY action_idx`,
    [normalized]
  );

  const typeRow = await query(
    `SELECT category_name FROM sm_event_types WHERE UPPER(name) = ?`,
    [normalized]
  );
  const category = ((typeRow?.[0] as Record<string, unknown>)?.category_name as string) || "critical";

  const catRow = await query(
    `SELECT policy FROM sm_event_categories WHERE name = ?`,
    [category]
  );
  const policy = ((catRow?.[0] as Record<string, unknown>)?.policy as string) || "manual";

  if (typeOverride?.length > 0) {
    return {
      actions: typeOverride.map((r) => ({
        pluginId: (r as Record<string, unknown>).plugin_id as string,
        commandId: (r as Record<string, unknown>).command_id as string,
        order: (r as Record<string, unknown>).action_idx as number,
      })),
      policy,
      category,
      isOverride: true,
    };
  }

  const catPipeline = await query(
    `SELECT plugin_id, command_id, action_idx
    FROM sm_category_pipeline
    WHERE category_name = ?
    ORDER BY action_idx`,
    [category]
  );

  return {
    actions: (catPipeline || []).map((r) => ({
      pluginId: (r as Record<string, unknown>).plugin_id as string,
      commandId: (r as Record<string, unknown>).command_id as string,
      order: (r as Record<string, unknown>).action_idx as number,
    })),
    policy,
    category,
    isOverride: false,
  };
}

export interface CategoryPipelineDisplay {
  category: string;
  label: string;
  priority: number;
  policy: string;
  actions: Array<{ pluginId: string; commandId: string; order: number }>;
  eventTypes: Array<{ name: string; label: string; autoCreated: boolean }>;
}

export async function getCategoryPipelines(): Promise<CategoryPipelineDisplay[]> {
  const categories = await query(
    `SELECT name, label, priority, policy FROM sm_event_categories ORDER BY priority`
  );

  const pipelines = await query(
    `SELECT category_name, plugin_id, command_id, action_idx
    FROM sm_category_pipeline
    ORDER BY category_name, action_idx`
  );

  const types = await query(
    `SELECT name, label, category_name, auto_created FROM sm_event_types ORDER BY name`
  );

  return (categories || []).map((cat) => {
    const c = cat as Record<string, unknown>;
    const name = c.name as string;
    return {
      category: name,
      label: c.label as string,
      priority: c.priority as number,
      policy: c.policy as string,
      actions: (pipelines || [])
        .filter((p) => (p as Record<string, unknown>).category_name === name)
        .map((p) => ({
          pluginId: (p as Record<string, unknown>).plugin_id as string,
          commandId: (p as Record<string, unknown>).command_id as string,
          order: (p as Record<string, unknown>).action_idx as number,
        })),
      eventTypes: (types || [])
        .filter((t) => (t as Record<string, unknown>).category_name === name)
        .map((t) => ({
          name: (t as Record<string, unknown>).name as string,
          label: (t as Record<string, unknown>).label as string,
          autoCreated: (t as Record<string, unknown>).auto_created as boolean,
        })),
    };
  });
}

export async function updateCategoryPipeline(
  categoryName: string,
  actions: Array<{ pluginId: string; commandId: string }>
): Promise<void> {
  await query(`DELETE FROM sm_category_pipeline WHERE category_name = ?`, [categoryName]);
  for (let i = 0; i < actions.length; i++) {
    await query(
      `INSERT INTO sm_category_pipeline (category_name, action_idx, plugin_id, command_id)
      VALUES (?, ?, ?, ?)`,
      [categoryName, i, actions[i].pluginId, actions[i].commandId]
    );
  }
}

export async function updateCategoryPolicy(
  categoryName: string,
  policy: string
): Promise<void> {
  await query(`UPDATE sm_event_categories SET policy = ? WHERE name = ?`, [
    policy,
    categoryName,
  ]);
}

export async function moveEventTypeToCategory(
  eventTypeName: string,
  newCategory: string
): Promise<void> {
  await query(`UPDATE sm_event_types SET category_name = ? WHERE name = ?`, [
    newCategory,
    eventTypeName,
  ]);
}

export async function unassignEventTypeFromCategory(eventTypeName: string): Promise<void> {
  await query(`UPDATE sm_event_types SET category_name = NULL WHERE name = ?`, [
    eventTypeName,
  ]);
}

export async function deleteEventType(eventTypeName: string): Promise<void> {
  await query(`DELETE FROM sm_type_pipeline WHERE type_name = ?`, [eventTypeName]);
  await query(`DELETE FROM sm_event_types WHERE name = ?`, [eventTypeName]);
}

export async function setSourceEnabled(name: string, enabled: boolean): Promise<void> {
  await exec(`UPDATE sm_sources SET enabled = ? WHERE name = ?`, [enabled, name]);
}

export async function setPluginEnabled(name: string, enabled: boolean): Promise<void> {
  await exec(`UPDATE sm_plugins SET enabled = ? WHERE name = ?`, [enabled, name]);
}

export async function seedRuleForEventType(
  eventType: string,
  _policy: string,
  actions: Action[]
): Promise<void> {
  if (!eventType || !actions?.length) return;

  const existing = await findMatchingRules(eventType, "");
  const alreadyHasRule = existing.some((r) =>
    r.triggers.some((t) => t.type === "event_type" && t.name === eventType)
  );
  if (alreadyHasRule) return;

  const label = eventType
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
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
    })),
  });
}
