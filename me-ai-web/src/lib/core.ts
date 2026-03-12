/**
 * me-ai-core (Rust WASM). Blueprint: one init, then use module directly (shell-style).
 *
 * - initCore(): load WASM (default), set adapter (init), run schema + postSchemaInit. Call once at app bootstrap.
 * - getCore(): returns the core module (lazy-inits if needed). Use core.getEventTypes(), etc.
 * - Convenience wrappers (getEventTypes, getOpfsStats, …) call getCore() internally.
 */

import type { CoreModule } from "./core-types.js";

export type { CoreModule };
import { getDb } from "./store/db.js";
import { createDbAdapter } from "./db-adapter.js";

let core: CoreModule | null = null;

/** Base URL for WASM assets (same as Vite middleware and static copy). */
function wasmBase(): string {
  return typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/";
}

/**
 * Load the core WASM module (dynamic import). Does not init; use initCore() for full bootstrap.
 */
export async function loadCoreModule(): Promise<CoreModule> {
  const base = wasmBase();
  const mod = await import(/* @vite-ignore */ `${base}wasm/me_ai_core.js`);
  return mod as CoreModule;
}

/**
 * Initialize the core (shell-style): load WASM, set DB adapter, create schema, rehydrate from IDB.
 * Call once at app startup. Returns the core module for direct use (e.g. core.getEventTypes()).
 */
export async function initCore(): Promise<CoreModule> {
  if (core) return core;

  await getDb();
  const adapter = createDbAdapter();
  const mod = await loadCoreModule();

  await mod.default();
  mod.init(adapter);
  await mod.createSchemaAndMigrations();

  const itemsCount = Number((await mod.getItemsCount()) ?? 0);
  const { postSchemaInit } = await import("./store/db.js");
  await postSchemaInit(itemsCount);

  core = mod;
  return core;
}

/**
 * Get the core module (lazy-inits if needed). Use for direct API calls: getCore().getEventTypes(), etc.
 */
export async function getCore(): Promise<CoreModule> {
  if (core) return core;
  return initCore();
}

// ─── Convenience wrappers (optional; callers can use getCore() and then mod.*) ───

export async function getEventTypes(): Promise<unknown> {
  const w = await getCore();
  return w.getEventTypes();
}

export async function getEventCategories(): Promise<unknown> {
  const w = await getCore();
  return w.getEventCategories();
}

export async function getSources(): Promise<unknown> {
  const w = await getCore();
  return w.getSources();
}

export async function getActions(): Promise<unknown> {
  const w = await getCore();
  return w.getActions();
}

export async function getItemsCountGmail(): Promise<unknown> {
  const w = await getCore();
  return w.getItemsCountGmail();
}

export async function getContactsCount(): Promise<unknown> {
  const w = await getCore();
  return w.getContactsCount();
}

export async function getItemsDateMin(): Promise<unknown> {
  const w = await getCore();
  return w.getItemsDateMin();
}

export async function getItemsDateMax(): Promise<unknown> {
  const w = await getCore();
  return w.getItemsDateMax();
}

export async function getEmailClassificationsCount(): Promise<unknown> {
  const w = await getCore();
  return w.getEmailClassificationsCount();
}

export async function getOpfsStats(): Promise<{
  supported: boolean;
  fileBytes: number;
  tables: Record<string, number>;
}> {
  const { getOpfsFileBytes } = await import("./store/db.js");
  const w = await getCore();
  const tables: Record<string, number> = {};
  for (const tbl of [
    "sm_rules", "sm_rule_triggers", "sm_rule_commands", "sm_events",
    "items", "emailClassifications", "contacts", "settings",
  ]) {
    try {
      tables[tbl] = Number(await w.getTableCount(tbl)) ?? 0;
    } catch {
      tables[tbl] = 0;
    }
  }
  const fileBytes = await getOpfsFileBytes();
  const supported =
    typeof navigator !== "undefined" &&
    typeof navigator.storage?.getDirectory === "function";
  return { supported, fileBytes, tables };
}

export async function clearAllDataAndCheckpoint(): Promise<void> {
  const w = await getCore();
  await w.clearAllData();
  const { checkpoint } = await import("./store/db.js");
  await checkpoint();
}
