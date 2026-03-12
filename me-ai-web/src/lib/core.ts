/**
 * me-ai-core (Rust WASM via wasm-bindgen). Load once, init with DB adapter, re-export bindings.
 */

import { getDb } from "./store/db.js";
import { createDbAdapter } from "./db-adapter.js";

let wasm: {
  getEventTypes: () => Promise<unknown>;
  getEventCategories: () => Promise<unknown>;
  getSources: () => Promise<unknown>;
  getActions: () => Promise<unknown>;
  getItemsCountGmail: () => Promise<unknown>;
  getContactsCount: () => Promise<unknown>;
  getItemsDateMin: () => Promise<unknown>;
  getItemsDateMax: () => Promise<unknown>;
  getEmailClassificationsCount: () => Promise<unknown>;
  createSchemaAndMigrations: () => Promise<void>;
  getItemsCount: () => Promise<number>;
  getTableCount: (table: string) => Promise<number>;
  clearAllData: () => Promise<void>;
  getSetting: (key: string) => Promise<string | null | undefined>;
  setSetting: (key: string, value: string) => Promise<void>;
  removeSetting: (key: string) => Promise<void>;
} | null = null;

/** Used by store modules (settings, etc.) that call core SQL APIs. */
export async function getWasm() {
  if (wasm) return wasm;
  await getDb();
  const adapter = createDbAdapter();
  const base = typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/";
  const mod = await import(/* @vite-ignore */ `${base}wasm/me_ai_core.js`);
  await mod.default();
  mod.init(adapter);
  await mod.createSchemaAndMigrations();
  const itemsCount = Number(await mod.getItemsCount() ?? 0);
  const { postSchemaInit } = await import("./store/db.js");
  await postSchemaInit(itemsCount);
  wasm = mod;
  return wasm;
}

export async function getEventTypes(): Promise<unknown> {
  const w = await getWasm();
  return w.getEventTypes();
}

export async function getEventCategories(): Promise<unknown> {
  const w = await getWasm();
  return w.getEventCategories();
}

export async function getSources(): Promise<unknown> {
  const w = await getWasm();
  return w.getSources();
}

export async function getActions(): Promise<unknown> {
  const w = await getWasm();
  return w.getActions();
}

export async function getItemsCountGmail(): Promise<unknown> {
  const w = await getWasm();
  return w.getItemsCountGmail();
}

export async function getContactsCount(): Promise<unknown> {
  const w = await getWasm();
  return w.getContactsCount();
}

export async function getItemsDateMin(): Promise<unknown> {
  const w = await getWasm();
  return w.getItemsDateMin();
}

export async function getItemsDateMax(): Promise<unknown> {
  const w = await getWasm();
  return w.getItemsDateMax();
}

export async function getEmailClassificationsCount(): Promise<unknown> {
  const w = await getWasm();
  return w.getEmailClassificationsCount();
}

/** OPFS stats (table counts from core; file size from db helper). */
export async function getOpfsStats(): Promise<{
  supported: boolean;
  fileBytes: number;
  tables: Record<string, number>;
}> {
  const { getOpfsFileBytes } = await import("./store/db.js");
  const w = await getWasm();
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

/** Clear all user-data tables (in core) then checkpoint (in db). */
export async function clearAllDataAndCheckpoint(): Promise<void> {
  const w = await getWasm();
  await w.clearAllData();
  const { checkpoint } = await import("./store/db.js");
  await checkpoint();
}
