/**
 * Ollama model catalog — delegates to me-ai-core.
 */
import {
  getOllamaModels as coreGetOllamaModels,
  getOllamaModelInfo as coreGetOllamaModelInfo,
  getRecommendedOllamaModels as coreGetRecommendedOllamaModels,
} from "./core.js";
export type { OllamaModel } from "./core.js";
import type { OllamaModel } from "./core.js";

/** All Ollama models as a flat array. Evaluated lazily after core is ready. */
export function getOllamaModels(): OllamaModel[] {
  return coreGetOllamaModels();
}

export function getRecommendedOllamaModels(): OllamaModel[] {
  return coreGetRecommendedOllamaModels();
}

export function getOllamaModelInfo(modelName: string): OllamaModel | undefined {
  return coreGetOllamaModelInfo(modelName) ?? undefined;
}
