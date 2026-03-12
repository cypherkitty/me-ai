/**
 * Load and initialize me-ai-core (Rust WASM). Call after getDb() is ready.
 */

import { getDb } from "./store/db.js";
import { createDbAdapter } from "./db-adapter.js";

let coreModule: Awaited<ReturnType<typeof loadCore>> | null = null;

export type CoreModule = {
  init: (adapter: { query: (sql: string, params: unknown[]) => Promise<unknown>; exec: (sql: string, params: unknown[]) => Promise<void> }) => void;
  getEventTypes: () => Promise<unknown>;
};

/**
 * Ensure DB is ready, load WASM module, init with adapter. Returns the core module (init, getEventTypes, ...).
 */
export async function loadCore(): Promise<CoreModule> {
  if (coreModule) return coreModule;
  await getDb();
  const adapter = createDbAdapter();
  const base = typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/";
  const mod = await import(/* @vite-ignore */ `${base}wasm/me_ai_core.js`);
  await mod.default();
  mod.init(adapter);
  coreModule = mod as CoreModule;
  return coreModule;
}
