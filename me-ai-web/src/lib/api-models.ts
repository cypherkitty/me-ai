import { get } from "svelte/store";
import { coreStore } from "./store/core-store.js";

export interface ApiModel {
  id: string;
  name: string;
  displayName: string;
  provider: string;
  description: string;
  contextWindow: number;
  maxEmailTokens: number;
  recommendedForEmailProcessing?: boolean;
  reasoningEffort?: "low" | "medium" | "high";
}

export function getApiModelInfo(modelId: string): ApiModel | null {
  const { core } = get(coreStore);
  if (!core) return null;
  try {
    return core.getApiModelInfo(modelId) as ApiModel | null;
  } catch {
    return null;
  }
}
