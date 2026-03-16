/**
 * Core store — holds MeAiCore instance (meta-secret WasmApplicationManager pattern).
 * Rexie is built once at init; all operations use the same instance via this store.
 */

import { get, writable } from "svelte/store";
import type { MeAiCore } from "me-ai-core";

type CoreState = {
  core: InstanceType<typeof MeAiCore> | null;
  initFailed: boolean;
};

export const coreStore = writable<CoreState>({ core: null, initFailed: false });

export function getCore(): InstanceType<typeof MeAiCore> {
  const state = get(coreStore);
  if (!state.core) {
    if (state.initFailed) throw new Error("Core init failed previously.");
    throw new Error("Core not initialized. Call initCore() first.");
  }
  return state.core;
}

