/**
 * Rule CRUD and event-stat wrappers.
 *
 * All business logic (ID generation, merging, filtering, aggregation) lives in
 * Rust (me-ai-core). This module is a thin pass-through to core.ts.
 */

import {
  getRules as coreGetRules,
  createRule as coreCreateRule,
  updateRule as coreUpdateRule,
  setRuleEnabled as coreSetRuleEnabled,
  getEventStats as coreGetEventStats,
  getPendingApprovals as coreGetPendingApprovals,
  getPendingCountByCategory as coreGetPendingCountByCategory,
  getPendingItemsByCategory as coreGetPendingItemsByCategory,
  getCategoryPipelines as coreGetCategoryPipelines,
} from "./core.js";
import type { Rule } from "$lib/types";

export type { PendingItemByCategory, CategoryPipelineDisplay } from "./core.js";

// ── Rule queries ───────────────────────────────────────────────────────

export async function getRules(): Promise<Rule[]> {
  return (await coreGetRules()) as unknown as Rule[];
}

export async function createRule(input: unknown): Promise<string> {
  return coreCreateRule(input);
}

export async function updateRule(id: string, updates: unknown): Promise<void> {
  return coreUpdateRule(id, updates);
}

export async function setRuleEnabled(id: string, enabled: boolean): Promise<void> {
  return coreSetRuleEnabled(id, enabled);
}

// ── Event stats ──────────────────────────────────────────────────────

export async function getEventStats() {
  return coreGetEventStats();
}

// ── Approvals & Manual Execution ───────────────────────────────────────

export async function getPendingApprovals({
  limit,
}: { limit?: number } = {}): Promise<Record<string, unknown>[]> {
  return coreGetPendingApprovals(limit);
}

export async function getPendingCountByCategory(categoryName: string): Promise<number> {
  return coreGetPendingCountByCategory(categoryName);
}

export async function getPendingItemsByCategory(
  categoryName: string,
  { limit }: { limit?: number } = {}
) {
  return coreGetPendingItemsByCategory(categoryName, limit);
}

// ── Category-based pipeline aggregation ─────────────────────────────────

export async function getCategoryPipelines() {
  return coreGetCategoryPipelines();
}
