/**
 * Event Stream + Action Pipeline
 *
 * Single urgency model: NOISE / INFO / CRITICAL (3 tiers).
 * Category names in DB and rules use lowercase: noise, info, critical.
 */

import type { Action, EventCategory } from "$lib/types";

const STORAGE_KEY = "me-ai-events";
const CATEGORIES_KEY = "me-ai-event-categories";

// ── Tier definitions ─────────────────────────────────────────────────

export const EVENT_CATEGORY_TIERS: Record<
  EventCategory,
  { id: EventCategory; label: string; description: string; autoExecute: boolean; requiresApproval: boolean; color: string }
> = {
  NOISE: {
    id: "NOISE",
    label: "Noise",
    description: "Unimportant messages that can be safely deleted automatically.",
    autoExecute: true,
    requiresApproval: false,
    color: "#6b7280",
  },
  INFO: {
    id: "INFO",
    label: "Info",
    description: "Useful but not urgent — will be silently archived.",
    autoExecute: true,
    requiresApproval: false,
    color: "#3b82f6",
  },
  CRITICAL: {
    id: "CRITICAL",
    label: "Critical",
    description: "Requires attention. User must review before any action runs.",
    autoExecute: false,
    requiresApproval: true,
    color: "#ef4444",
  },
};

export const DEFAULT_CATEGORY: EventCategory = "CRITICAL";

export const EVENT_CATEGORIES: Record<
  string,
  { name: string; label: string; priority: number; color: string; policy: string }
> = {
  noise: { name: "noise", label: "Noise", priority: 1, color: "#6b7280", policy: "auto" },
  info: { name: "info", label: "Info", priority: 2, color: "#3b82f6", policy: "auto" },
  critical: { name: "critical", label: "Critical", priority: 3, color: "#ef4444", policy: "manual" },
};

export function categoryToPolicy(category: string): string {
  return EVENT_CATEGORIES[category]?.policy || "manual";
}

export function categoryTierToPolicy(category: EventCategory): string {
  if (category === "NOISE") return "auto";
  if (category === "INFO") return "auto";
  return "manual";
}

export function policyToCategoryTier(policy: string): EventCategory {
  if (policy === "auto") return "NOISE";
  return "CRITICAL";
}

export function categoryTierToName(category: EventCategory): string {
  const c = (category || "").toUpperCase();
  if (c === "NOISE") return "noise";
  if (c === "INFO") return "info";
  if (c === "CRITICAL") return "critical";
  return "critical";
}

// ── Persistence ─────────────────────────────────────────────────────

async function loadUserMap(): Promise<Record<string, Action[]>> {
  const { getSetting } = await import("./store/settings.js");
  return (await getSetting(STORAGE_KEY)) || {};
}

async function saveUserMap(map: Record<string, Action[]>): Promise<void> {
  const { setSetting } = await import("./store/settings.js");
  await setSetting(STORAGE_KEY, map);
}

async function loadCategoriesMap(): Promise<Record<string, EventCategory>> {
  const { getSetting } = await import("./store/settings.js");
  return (await getSetting(CATEGORIES_KEY)) || {};
}

async function saveCategoriesMap(map: Record<string, EventCategory>): Promise<void> {
  const { setSetting } = await import("./store/settings.js");
  await setSetting(CATEGORIES_KEY, map);
}

// ── Event type queries ──────────────────────────────────────────────

async function getEventTypesFromDB(): Promise<string[]> {
  try {
    const { getEmailClassifications } = await import("./core.js");
    const rows = (await getEmailClassifications()) as Array<{ action?: string | null }>;
    const actions = new Set((rows ?? []).map((r) => r.action).filter(Boolean) as string[]);
    return [...actions].sort();
  } catch {
    return [];
  }
}

export async function getAllEventTypes(): Promise<string[]> {
  const map = await loadUserMap();
  const fromDB = await getEventTypesFromDB();
  const all = new Set([...Object.keys(map), ...fromDB]);
  return [...all].sort();
}

function normalizeCategory(stored: string | undefined): EventCategory {
  const c = (stored || "").toUpperCase();
  if (c === "NOISE") return "NOISE";
  if (c === "INFO" || c === "INFORMATIONAL") return "INFO";
  if (c === "CRITICAL" || c === "IMPORTANT" || c === "URGENT") return "CRITICAL";
  return DEFAULT_CATEGORY;
}

export async function getCategoryForEventType(eventType: string): Promise<EventCategory> {
  const normalized = eventType?.toUpperCase?.() || "";
  const map = await loadCategoriesMap();
  return normalizeCategory(map[normalized]);
}

export async function setCategoryForEventType(eventType: string, category: EventCategory): Promise<void> {
  const normalized = eventType.toUpperCase();
  if (!EVENT_CATEGORY_TIERS[category]) throw new Error(`Unknown category: ${category}`);
  const map = await loadCategoriesMap();
  map[normalized] = category;
  await saveCategoriesMap(map);
}

export async function getAllEventTypeCategories(): Promise<Record<string, EventCategory>> {
  return loadCategoriesMap();
}

export async function getExecutionPolicy(eventType: string): Promise<{
  autoExecute: boolean;
  requiresApproval: boolean;
  category: EventCategory;
}> {
  const category = await getCategoryForEventType(eventType);
  const def = EVENT_CATEGORY_TIERS[category] || EVENT_CATEGORY_TIERS[DEFAULT_CATEGORY];
  return { autoExecute: def.autoExecute, requiresApproval: def.requiresApproval, category };
}

export async function getActionsForEvent(eventType: string): Promise<Action[]> {
  const normalized = eventType?.toUpperCase?.().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "") || "";
  if (!normalized) return [];

  const map = await loadUserMap();
  const userActions = map[normalized];
  if (Array.isArray(userActions) && userActions.length > 0) return userActions;

  const { getPipelineForEvent } = await import("./rules.js");
  const pipeline = await getPipelineForEvent(eventType);
  if (!pipeline?.actions?.length) return [];

  return pipeline.actions.map((a, i) => ({
    id: (a.commandId || "cmd") + "_" + i,
    pluginId: a.pluginId ?? "",
    commandId: a.commandId ?? "",
    name: (a.commandId ?? "").replace(/_/g, " "),
    description: "",
  }));
}

export async function hasEvent(eventType: string): Promise<boolean> {
  const normalized = eventType?.toUpperCase?.() || "";
  const map = await loadUserMap();
  return normalized in map;
}

// ── Event CRUD ──────────────────────────────────────────────────────

export async function addEventType(eventType: string): Promise<void> {
  const normalized = eventType.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
  if (!normalized) return;
  const map = await loadUserMap();
  if (!(normalized in map)) {
    map[normalized] = [];
    await saveUserMap(map);
  }
}

export async function seedEventTypeFromLLM(
  eventType: string,
  category: string,
  _suggestedActionIds?: string[]
): Promise<void> {
  const normalized = eventType.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
  if (!normalized) return;

  const validCategories = ["noise", "info", "critical"];
  let cat = (category || "").toLowerCase().trim();
  if (!validCategories.includes(cat)) {
    if (cat === "noise" || category === "NOISE") cat = "noise";
    else if (cat === "informational") cat = "info";
    else if (cat === "important" || cat === "urgent" || category === "CRITICAL" || category === "IMPORTANT" || category === "URGENT") cat = "critical";
    else cat = "critical";
  }

  const categoryTier: EventCategory = cat === "noise" ? "NOISE" : cat === "info" ? "INFO" : "CRITICAL";
  const categoriesMap = await loadCategoriesMap();

  if (!(normalized in categoriesMap)) {
    categoriesMap[normalized] = categoryTier;
    await saveCategoriesMap(categoriesMap);
  }

  try {
    const { upsertEventType } = await import("./core.js");
    const label = normalized.replace(/_/g, " ");
    await upsertEventType(normalized, label, cat, true);
  } catch (e) {
    console.warn("[events] Failed to persist event type in DB:", normalized, (e as Error)?.message ?? e);
  }

  const map = await loadUserMap();
  if (!(normalized in map)) {
    map[normalized] = [];
    await saveUserMap(map);
  }
}

export async function deleteEventType(eventType: string): Promise<void> {
  const normalized = eventType.toUpperCase();
  const map = await loadUserMap();
  delete map[normalized];
  await saveUserMap(map);
}

// ── Action pipeline CRUD ────────────────────────────────────────────

export async function saveActionsForEvent(eventType: string, actions: Action[]): Promise<void> {
  const normalized = eventType.toUpperCase();
  const map = await loadUserMap();
  map[normalized] = actions;
  await saveUserMap(map);
}

export async function addActionToEvent(eventType: string, action: Action): Promise<void> {
  const current = await getActionsForEvent(eventType);
  await saveActionsForEvent(eventType, [...current, action]);
}

export async function removeActionFromEvent(eventType: string, actionId: string): Promise<void> {
  const current = await getActionsForEvent(eventType);
  await saveActionsForEvent(eventType, current.filter((a) => a.id !== actionId));
}

export async function updateActionInEvent(eventType: string, actionId: string, updates: Partial<Action>): Promise<void> {
  const current = await getActionsForEvent(eventType);
  await saveActionsForEvent(
    eventType,
    current.map((a) => (a.id === actionId ? { ...a, ...updates } : a))
  );
}

// ── Chat message builders ───────────────────────────────────────────

import type { EmailEvent } from "$lib/types";

export interface ClassificationLike {
  action: string;
  reason?: string;
  summary?: string;
  tags?: string[];
  categoryTier?: EventCategory;
}

export interface EmailLike {
  subject?: string;
  from?: string;
  date?: string | number;
  snippet?: string;
  body?: string;
}

export async function buildEmailEvent(
  classification: ClassificationLike,
  email: EmailLike
): Promise<{ event: EmailEvent; commands: Action[] }> {
  const category = classification.categoryTier ?? (await getCategoryForEventType(classification.action));
  const event: EmailEvent = {
    type: classification.action,
    source: "gmail",
    data: {
      subject: email.subject,
      from: email.from != null ? String(email.from) : undefined,
      date: email.date != null ? String(email.date) : undefined,
      snippet: email.snippet || (typeof email.body === "string" ? email.body.slice(0, 200) : "") || "",
    },
    metadata: {
      reason: classification.reason,
      summary: classification.summary,
      tags: classification.tags || [],
      category,
      classifiedAt: Date.now(),
    },
  };

  const commands = await getActionsForEvent(classification.action);
  return { event, commands };
}

export function buildEventMessage(
  event: EmailEvent,
  commands: Action[]
): { role: string; type: string; event: EmailEvent; commands: Action[]; content: string } {
  return {
    role: "assistant",
    type: "event",
    event,
    commands,
    content: "",
  };
}

export async function buildBatchEventMessage(
  results: Array<{ success: boolean; classification?: ClassificationLike; email?: EmailLike }>
): Promise<{ role: string; type: string; items: Array<{ event: EmailEvent; commands: Action[] }>; content: string }> {
  const items = await Promise.all(
    results
      .filter((r) => r.success && r.classification && r.email)
      .map(async (r) => {
        const { event, commands } = await buildEmailEvent(r.classification!, r.email!);
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

export interface ByCategory {
  categories: Record<string, Array<{ emailId?: string; subject?: string; from?: string; date?: number; summary?: string; reason?: string; tags?: string[]; status?: string }>>;
  order: string[];
}

export async function buildEventsByCategoryMessage(byCategory: ByCategory): Promise<{
  role: string;
  type: string;
  categories: Array<{ eventType: string; category: EventCategory; emails: unknown[]; commands: Action[] }>;
  total: number;
  content: string;
}> {
  const categories = await Promise.all(
    byCategory.order.map(async (eventType) => {
      const items = byCategory.categories[eventType] || [];
      const commands = await getActionsForEvent(eventType);
      const category = await getCategoryForEventType(eventType);
      const emails = items.map((item) => ({
        emailId: item.emailId,
        subject: item.subject || "(no subject)",
        from: item.from || "",
        date: item.date,
        summary: item.summary || "",
        reason: item.reason || "",
        tags: item.tags || [],
        status: item.status || "pending",
      }));
      return { eventType, category, emails, commands };
    })
  );

  const total = categories.reduce((sum, c) => sum + c.emails.length, 0);

  return {
    role: "assistant",
    type: "events-by-category",
    categories,
    total,
    content: "",
  };
}
