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

export function categoryTierToName(category: EventCategory): string {
  const c = (category || "").toUpperCase();
  if (c === "NOISE") return "noise";
  if (c === "INFO") return "info";
  if (c === "CRITICAL") return "critical";
  return "critical";
}

// ── Persistence ─────────────────────────────────────────────────────
// These dynamic maps are not fields in SettingValue; persist via localStorage.

async function loadUserMap(): Promise<Record<string, Action[]>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Action[]>) : {};
  } catch {
    return {};
  }
}

async function saveUserMap(map: Record<string, Action[]>): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

async function loadCategoriesMap(): Promise<Record<string, EventCategory>> {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, EventCategory>) : {};
  } catch {
    return {};
  }
}

async function saveCategoriesMap(map: Record<string, EventCategory>): Promise<void> {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
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

// ── Chat message builders ───────────────────────────────────────────

import type { EmailEvent } from "$lib/types";

interface ClassificationLike {
  action: string;
  reason?: string;
  summary?: string;
  tags?: string[];
  categoryTier?: EventCategory;
}

interface EmailLike {
  subject?: string;
  from?: string;
  date?: string | number;
  snippet?: string;
  body?: string;
}

async function buildEmailEvent(
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
