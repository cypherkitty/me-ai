/**
 * Core store — holds MeAiCore instance (meta-secret WasmApplicationManager pattern).
 * Rexie is built once at init; all operations use the same instance via this store.
 */

import { get, writable } from "svelte/store";
import initDefault, { MeAiCore } from "me-ai-core";
import type { MeAiCore as MeAiCoreType } from "me-ai-core";

type CoreState = {
  core: InstanceType<typeof MeAiCoreType> | null;
  initFailed: boolean;
};

export const coreStore = writable<CoreState>({ core: null, initFailed: false });

export function getCore(): InstanceType<typeof MeAiCoreType> {
  const state = get(coreStore);
  if (!state.core) {
    if (state.initFailed) throw new Error("Core init failed previously.");
    throw new Error("Core not initialized. Call initCore() first.");
  }
  return state.core;
}

/**
 * Initialize the core: load WASM, create MeAiCore (builds Rexie once), run schema/migrations.
 * Call once at app startup. State is kept in coreStore; all operations reuse the same instance.
 */
export async function initCore(): Promise<void> {
  try {
    const base = typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/";
    const wasmUrl = `${base}wasm/me_ai_core_bg.wasm`;
    await initDefault({ module_or_path: wasmUrl });
    const core = new MeAiCore();
    await core.createSchemaAndMigrations();
    coreStore.set({ core, initFailed: false });
  } catch (e) {
    coreStore.set({ core: null, initFailed: true });
    throw e;
  }
}
