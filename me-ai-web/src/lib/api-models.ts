import { get } from "svelte/store";
import { coreStore } from "./store/core-store.js";
export type { ApiModel } from "./core.js";
import type { ApiModel } from "./core.js";

export function getApiModelInfo(modelId: string): ApiModel | null {
  const { core } = get(coreStore);
  if (!core) return null;
  try {
    return core.getApiModelInfo(modelId) as ApiModel | null;
  } catch {
    return null;
  }
}
