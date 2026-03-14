/**
 * Rule CRUD
 *
 * SQL for seed data (event types, categories, sources, actions) lives in Rust.
 * This layer is thin: it calls core; Rust builds queries and passes them to the JS adapter.
 */

import {
  getEventTypes as coreGetEventTypes,
  getEventCategories as coreGetEventCategories,
  getSources as coreGetSources,
  getActions as coreGetActions,
  getPlugins as coreGetPlugins,
  getRules as coreGetRules,
  getRule as coreGetRule,
  saveRule as coreSaveRule,
  deleteRule as coreDeleteRule,
  getEvents as coreGetEvents,
  insertEvent as coreInsertEvent,
  updateEventStatus as coreUpdateEventStatus,
  clearEvents as coreClearEvents,
  getEmailClassifications as coreGetEmailClassifications,
  getAuditStats as coreGetAuditStats,
  getItemById as coreGetItemById,
  updateEmailClassificationStatus as coreUpdateEmailClassificationStatus,
  getTypePipelineActions as coreGetTypePipelineActions,
  getEventTypeCategory as coreGetEventTypeCategory,
  getEventCategoryPolicy as coreGetEventCategoryPolicy,
  getCategoryPipelineActions as coreGetCategoryPipelineActions,
  updateCategoryPipeline as coreUpdateCategoryPipeline,
  updateCategoryPolicy as coreUpdateCategoryPolicy,
  updateEventTypeCategory as coreUpdateEventTypeCategory,
  clearEventTypeCategory as coreClearEventTypeCategory,
  deleteEventType as coreDeleteEventType,
  setSourceEnabled as coreSetSourceEnabled,
  setPluginEnabled as coreSetPluginEnabled,
} from "./core.js";
import { toJson, fromJson } from "./store/db.js";
import type { Rule, Action, Trigger } from "$lib/types";

// ── Seed / static data (WASM core builds SQL and passes to adapter) ────────

export async function getEventTypes(): Promise<Record<string, unknown>[]> {
  const rows = await coreGetEventTypes();
  return Array.isArray(rows) ? (rows as Record<string, unknown>[]) : [];
}

export async function getEventCategories(): Promise<Record<string, unknown>[]> {
  const rows = await coreGetEventCategories();
  return Array.isArray(rows) ? (rows as Record<string, unknown>[]) : [];
}

export async function getSources(): Promise<Record<string, unknown>[]> {
  const rows = await coreGetSources();
  return Array.isArray(rows) ? (rows as Record<string, unknown>[]) : [];
}

export async function getExecutionPolicies(): Promise<unknown[]> {
  return [];
}

export async function getActions(): Promise<Record<string, unknown>[]> {
  const rows = await coreGetActions();
  return Array.isArray(rows) ? (rows as Record<string, unknown>[]) : [];
}

export async function getPlugins(): Promise<Record<string, unknown>[]> {
  const plugins = (await coreGetPlugins()) as Record<string, unknown>[];
  return Array.isArray(plugins) ? plugins : [];
}

// ── Rule queries ───────────────────────────────────────────────────────

export async function getRules(): Promise<Rule[]> {
  const rules = (await coreGetRules()) as Record<string, unknown>[];
  return (rules ?? []).map((r) => ({
    ...r,
    enabled: Boolean(r.enabled),
    triggers: (r.triggers as Trigger[]) ?? [],
    actions: (r.actions as Action[]) ?? [],
  })) as Rule[];
}

export async function getRule(id: string): Promise<Rule | null> {
  const r = await coreGetRule(id);
  if (r == null || r === undefined) return null;
  const row = r as Record<string, unknown>;
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    enabled: Boolean(row.enabled),
    priority: (row.priority as number) ?? 5,
    created_at: row.created_at as number | undefined,
    triggers: (row.triggers as Trigger[]) ?? [],
    actions: (row.actions as Action[]) ?? [],
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
  const payload = {
    id,
    name,
    description: description ?? "",
    enabled,
    priority,
    created_at: now,
    triggers: triggers.map((t) => ({ type: t.type, name: t.name })),
    actions: actions.map((a) => ({
      id: a.id,
      pluginId: a.pluginId,
      commandId: a.commandId,
      name: a.name,
      description: a.description,
      icon: a.icon ?? null,
    })),
  };
  await coreSaveRule(payload);
  return id;
}

export async function updateRule(id: string, updates: Partial<Rule>): Promise<void> {
  const existing = await getRule(id);
  if (!existing) return;
  const merged: Rule = {
    ...existing,
    ...updates,
    triggers: updates.triggers ?? existing.triggers,
    actions: updates.actions ?? existing.actions,
  };
  const payload = {
    id,
    name: merged.name,
    description: merged.description ?? "",
    enabled: merged.enabled,
    priority: merged.priority ?? 5,
    created_at: merged.created_at,
    triggers: merged.triggers.map((t) => ({ type: t.type, name: t.name })),
    actions: merged.actions.map((a) => ({
      id: a.id,
      pluginId: a.pluginId,
      commandId: a.commandId,
      name: a.name,
      description: a.description,
      icon: a.icon ?? null,
    })),
  };
  await coreSaveRule(payload);
}

export async function setRuleEnabled(id: string, enabled: boolean): Promise<void> {
  await updateRule(id, { enabled });
}

export async function deleteRule(id: string): Promise<void> {
  await coreDeleteRule(id);
}

// ── Event queries ──────────────────────────────────────────────────────

export interface GetEventsOptions {
  status?: string;
  eventType?: string;
  source?: string;
  limit?: number;
}

export async function getEvents({
  limit = 100,
}: GetEventsOptions = {}): Promise<Record<string, unknown>[]> {
  const rows = (await coreGetEvents(limit, 0)) as Record<string, unknown>[];
  return (rows ?? []).map((r) => ({
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
  const id = evt.id ?? `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  await coreInsertEvent(
    id,
    evt.content ?? null,
    evt.subject ?? null,
    evt.sender ?? null,
    evt.timestamp ?? Date.now(),
    evt.status ?? "completed",
    evt.event_type ?? null,
    evt.event_category ?? null,
    evt.source_name ?? null,
    evt.rule_id ?? null,
    toJson(evt.actions_taken ?? []),
    evt.output != null ? toJson(evt.output) : null
  );
}

export async function updateEventStatus(id: string, status: string): Promise<void> {
  await coreUpdateEventStatus(id, status);
}

export async function clearAllEvents(): Promise<void> {
  await coreClearEvents();
}

export interface EventStats {
  awaiting_user: number;
  escalated: number;
  completed: number;
  failed: number;
  total: number;
}

export async function getEventStats(): Promise<EventStats> {
  const [classifications, categories, auditStats] = await Promise.all([
    coreGetEmailClassifications(),
    coreGetEventCategories(),
    coreGetAuditStats(),
  ]);
  const rows = (classifications ?? []) as Record<string, unknown>[];
  const cats = (categories ?? []) as Record<string, unknown>[];
  const manualSet = new Set(
    cats.filter((c) => String(c.policy ?? "").toLowerCase() === "manual").map((c) => String(c.name ?? "").toLowerCase())
  );
  let awaiting_user = 0;
  let escalated = 0;
  for (const r of rows) {
    const status = String(r.status ?? "");
    const cat = String(r.category ?? "").toLowerCase();
    if (status === "pending" && manualSet.has(cat)) awaiting_user += 1;
    else if (status === "escalated") escalated += 1;
  }
  const completed = Number((auditStats as { completed?: number })?.completed ?? 0);
  const failed = Number((auditStats as { failed?: number })?.failed ?? 0);
  return {
    awaiting_user,
    escalated,
    completed,
    failed,
    total: awaiting_user + escalated + completed + failed,
  };
}

// ── Approvals & Manual Execution ───────────────────────────────────────

export async function getPendingApprovals({
  limit = 100,
}: { limit?: number } = {}): Promise<Record<string, unknown>[]> {
  const [classifications, categories] = await Promise.all([
    coreGetEmailClassifications(),
    coreGetEventCategories(),
  ]);
  const cats = (categories ?? []) as Record<string, unknown>[];
  const manualSet = new Set(
    cats.filter((c) => String(c.policy ?? "").toLowerCase() === "manual").map((c) => String(c.name ?? "").toLowerCase())
  );
  const rows = (classifications ?? []) as Record<string, unknown>[];
  const pending = rows
    .filter(
      (r) =>
        r.status === "pending" &&
        manualSet.has(String(r.category ?? "").toLowerCase())
    )
    .sort((a, b) => Number(b.date ?? 0) - Number(a.date ?? 0))
    .slice(0, limit);
  const out: Record<string, unknown>[] = [];
  for (const r of pending) {
    const emailId = (r.emailId ?? r.id) as string | undefined;
    let item: Record<string, unknown> | null = null;
    if (emailId && typeof emailId === "string" && emailId.trim().length > 0 && emailId !== "null" && emailId !== "undefined") {
      item = await coreGetItemById(emailId) as Record<string, unknown> | null;
    }
    const subject = (item?.subject ?? r.subject) as string;
    const from = (item?.from ?? r.from) as string;
    out.push({
      id: emailId,
      subject,
      source_name: from,
      content: (item as Record<string, unknown>)?.body ?? "",
      timestamp: r.date ?? (item as Record<string, unknown>)?.date ?? 0,
      event_category: r.category,
      event_type: r.action,
      reason: r.reason,
      summary: r.summary,
      status: r.status,
      sender: from,
      from,
      actions_taken: [],
      rule_name: `Manual Review: ${r.category}`,
    });
  }
  return out;
}

export async function getPendingCountByCategory(categoryName: string): Promise<number> {
  const rows = (await coreGetEmailClassifications()) as Record<string, unknown>[];
  const want = categoryName.trim().toLowerCase();
  return (rows ?? []).filter((r) => {
    const cat = String(r.category ?? "").trim().toLowerCase();
    const status = String(r.status ?? "");
    return cat === want && (status === "pending" || status === "escalated");
  }).length;
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
  const rows = (await coreGetEmailClassifications()) as Record<string, unknown>[];
  const want = categoryName.trim().toLowerCase();
  const filtered = (rows ?? [])
    .filter((r) => {
      const cat = String(r.category ?? "").trim().toLowerCase();
      const status = String(r.status ?? "");
      return cat === want && (status === "pending" || status === "escalated");
    })
    .sort((a, b) => Number(b.date ?? 0) - Number(a.date ?? 0))
    .slice(0, limit);
  const out: PendingItemByCategory[] = [];
  for (const r of filtered) {
    const emailId = (r.emailId ?? r.id) as string | undefined;
    let item: Record<string, unknown> | null = null;
    if (emailId && typeof emailId === "string" && emailId.trim().length > 0 && emailId !== "null" && emailId !== "undefined") {
      item = await coreGetItemById(emailId) as Record<string, unknown> | null;
    }
    out.push({
      id: emailId ?? "",
      emailId: emailId ?? "",
      subject: (r.subject ?? (item as Record<string, unknown>)?.subject ?? "") as string,
      from: (r.from ?? (item as Record<string, unknown>)?.from ?? "") as string,
      eventType: (r.action ?? "UNKNOWN") as string,
      event_category: (r.category ?? categoryName) as string,
      sourceType: ((item as Record<string, unknown>)?.sourceType ?? "gmail") as string,
      status: (r.status ?? "pending") as string,
    });
  }
  return out;
}

export async function approveClassification(id: string): Promise<void> {
  await coreUpdateEmailClassificationStatus(id, "approved");
}

export async function rejectClassification(id: string): Promise<void> {
  await coreUpdateEmailClassificationStatus(id, "escalated");
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
  const [typeActions, categoryName] = await Promise.all([
    coreGetTypePipelineActions(normalized),
    coreGetEventTypeCategory(normalized),
  ]);
  const category = categoryName ?? "critical";
  const policy = await coreGetEventCategoryPolicy(category);
  const pol = policy ?? "manual";
  if (typeActions?.length > 0) {
    return {
      actions: (typeActions as Array<{ plugin_id: string; command_id: string; action_idx: number }>).map((r) => ({
        pluginId: r.plugin_id,
        commandId: r.command_id,
        order: r.action_idx,
      })),
      policy: pol,
      category,
      isOverride: true,
    };
  }
  const catActions = (await coreGetCategoryPipelineActions(category)) as Array<{
    plugin_id: string;
    command_id: string;
    action_idx: number;
  }>;
  return {
    actions: (catActions ?? []).map((r) => ({
      pluginId: r.plugin_id,
      commandId: r.command_id,
      order: r.action_idx,
    })),
    policy: pol,
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
  const [categories, types] = await Promise.all([
    coreGetEventCategories(),
    coreGetEventTypes(),
  ]);
  const cats = (categories ?? []) as Record<string, unknown>[];
  const typeRows = (types ?? []) as Record<string, unknown>[];
  const result: CategoryPipelineDisplay[] = [];
  for (const c of cats) {
    const name = c.name as string;
    const actions = (await coreGetCategoryPipelineActions(name)) as Array<{
      plugin_id: string;
      command_id: string;
      action_idx: number;
    }>;
    result.push({
      category: name,
      label: (c.label ?? name) as string,
      priority: (c.priority ?? 0) as number,
      policy: (c.policy ?? "manual") as string,
      actions: (actions ?? []).map((r) => ({
        pluginId: r.plugin_id,
        commandId: r.command_id,
        order: r.action_idx,
      })),
      eventTypes: typeRows
        .filter((t) => String(t.category_name ?? "") === name)
        .map((t) => ({
          name: t.name as string,
          label: (t.label ?? t.name) as string,
          autoCreated: (t.auto_created ?? false) as boolean,
        })),
    });
  }
  return result;
}

export async function updateCategoryPipeline(
  categoryName: string,
  actions: Array<{ pluginId: string; commandId: string }>
): Promise<void> {
  await coreUpdateCategoryPipeline(categoryName, actions);
}

export async function updateCategoryPolicy(
  categoryName: string,
  policy: string
): Promise<void> {
  await coreUpdateCategoryPolicy(categoryName, policy);
}

export async function moveEventTypeToCategory(
  eventTypeName: string,
  newCategory: string
): Promise<void> {
  await coreUpdateEventTypeCategory(eventTypeName, newCategory);
}

export async function unassignEventTypeFromCategory(eventTypeName: string): Promise<void> {
  await coreClearEventTypeCategory(eventTypeName);
}

export async function deleteEventType(eventTypeName: string): Promise<void> {
  await coreDeleteEventType(eventTypeName);
}

export async function setSourceEnabled(name: string, enabled: boolean): Promise<void> {
  await coreSetSourceEnabled(name, enabled);
}

export async function setPluginEnabled(name: string, enabled: boolean): Promise<void> {
  await coreSetPluginEnabled(name, enabled);
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
