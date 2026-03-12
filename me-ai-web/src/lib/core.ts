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
} | null = null;

async function getWasm() {
  if (wasm) return wasm;
  await getDb();
  const adapter = createDbAdapter();
  const base = typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/";
  const mod = await import(/* @vite-ignore */ `${base}wasm/me_ai_core.js`);
  await mod.default();
  mod.init(adapter);
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
