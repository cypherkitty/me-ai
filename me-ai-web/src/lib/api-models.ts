import { getApiModels as coreGetApiModels, getApiModelInfo as coreGetApiModelInfo } from "./core.js";

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

let _cache: ApiModel[] | null = null;

/** Lazily fetched from WASM core on first access (core must be initialized). */
export const API_MODELS: ApiModel[] = new Proxy([] as ApiModel[], {
  get(_target, prop, receiver) {
    if (_cache === null) {
      _cache = coreGetApiModels() as ApiModel[];
    }
    return Reflect.get(_cache, prop, receiver);
  },
});

export function getApiModelInfo(modelId: string): ApiModel | null {
  return coreGetApiModelInfo(modelId) as ApiModel | null;
}
