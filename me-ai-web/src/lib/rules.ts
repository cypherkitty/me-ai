/**
 * Rule CRUD and event-stat wrappers.
 *
 * All business logic (ID generation, merging, filtering, aggregation) lives in
 * Rust (me-ai-core). This module is a thin pass-through to core.ts.
 */

import { getCore } from "./store/core-store.js";
import type { CreateRulePayload, RuleUpdateInput } from "./core.js";
import type { Rule } from "$lib/types";

export type { PendingItemByCategory, CategoryPipelineDisplay } from "./core.js";

// ── Rule queries ───────────────────────────────────────────────────────

export async function getRules(): Promise<Rule[]> {
  return getCore().getRules() as unknown as Promise<Rule[]>;
}

export async function createRule(input: CreateRulePayload): Promise<string> {
  return getCore().createRule(input);
}

export async function updateRule(id: string, updates: RuleUpdateInput): Promise<void> {
  return getCore().updateRule(id, updates);
}

export async function setRuleEnabled(id: string, enabled: boolean): Promise<void> {
  return getCore().setRuleEnabled(id, enabled);
}

// ── Event stats ──────────────────────────────────────────────────────

export async function getEventStats() {
  return getCore().getEventStats();
}

// ── Approvals & Manual Execution ───────────────────────────────────────

export async function getPendingApprovals({ limit = 100 }: { limit?: number } = {}) {
  return getCore().getPendingApprovals(limit);
}

export async function getPendingCountByCategory(categoryName: string): Promise<number> {
  return getCore().getPendingCountByCategory(categoryName);
}

export async function getPendingItemsByCategory(
  categoryName: string,
  { limit = 500 }: { limit?: number } = {}
) {
  return getCore().getPendingItemsByCategory(categoryName, limit);
}

// ── Category-based pipeline aggregation ─────────────────────────────────

export async function getCategoryPipelines() {
  return getCore().getCategoryPipelines();
}
