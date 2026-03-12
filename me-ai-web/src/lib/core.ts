/**
 * me-ai-core (Rust WASM). Persistence is IndexedDB via Rexie; no JS DB adapter.
 *
 * - initCore(): load WASM, init(), create schema + seed. Call once at app bootstrap.
 * - getCore(): returns the core module (lazy-inits if needed). Use core.getEventTypes(), etc.
 * - Convenience wrappers (getEventTypes, getStorageStats, …) call getCore() internally.
 */

import type { CoreModule } from "./core-types.js";

export type { CoreModule };

let core: CoreModule | null = null;
/** Single init promise so concurrent getCore()/initCore() callers all await the same init. */
let initPromise: Promise<CoreModule> | null = null;
/** True after init has failed (e.g. IndexedDB unavailable). Callers should fail explicitly; no fallbacks. */
let coreInitFailed = false;

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
 * Initialize the core: load WASM, init(), create schema + seed. No adapter; Rexie uses IndexedDB.
 * Call once at app startup. Returns the core module for direct use.
 */
export async function initCore(): Promise<CoreModule> {
  if (core) return core;
  if (initPromise) return initPromise;

  initPromise = (async (): Promise<CoreModule> => {
    try {
      const mod = await loadCoreModule();
      await mod.default();
      mod.init();
      await mod.createSchemaAndMigrations();
      core = mod;
      return mod;
    } catch (e) {
      coreInitFailed = true;
      throw e;
    }
  })();

  return initPromise;
}

/**
 * True if core init has already failed (e.g. IndexedDB unavailable). For UI/guards only; do not use for fallback paths.
 */
export function isCoreInitFailed(): boolean {
  return coreInitFailed;
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

export async function getStorageStats(): Promise<{
  supported: boolean;
  usageBytes: number;
  tables: Record<string, number>;
}> {
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
  let usageBytes = 0;
  const supported = typeof navigator !== "undefined" && "storage" in navigator && "estimate" in navigator.storage;
  if (supported) {
    try {
      const est = await navigator.storage.estimate();
      usageBytes = est.usage ?? 0;
    } catch {
      /* ignore */
    }
  }
  return { supported, usageBytes, tables };
}

/** @deprecated Use getStorageStats. */
export async function getOpfsStats(): Promise<{
  supported: boolean;
  fileBytes: number;
  tables: Record<string, number>;
}> {
  const s = await getStorageStats();
  return { supported: s.supported, fileBytes: s.usageBytes, tables: s.tables };
}

export async function clearAllDataAndCheckpoint(): Promise<void> {
  const w = await getCore();
  await w.clearAllData();
}
