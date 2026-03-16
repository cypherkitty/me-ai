/**
 * Ollama model catalog — delegates to me-ai-core.
 *
 * The WASM OllamaModel.tags field is a JSON string; this module exposes a
 * JS-friendly OllamaModel type with tags as string[] by parsing on the way out.
 */
import {
  getOllamaModels as coreGetOllamaModels,
  getOllamaModelInfo as coreGetOllamaModelInfo,
  getRecommendedOllamaModels as coreGetRecommendedOllamaModels,
} from "./core.js";

/** JS-friendly Ollama model descriptor (tags parsed to string[]). */
interface OllamaModel {
  name: string;
  displayName: string;
  params: string;
  contextWindow: number;
  maxEmailTokens: number;
  description: string;
  tags: string[];
  recommended: boolean;
  recommendedForEmailProcessing: boolean;
}

function mapModel(m: import("./core.js").OllamaModel): OllamaModel {
  let tags: string[] = [];
  try {
    const parsed = JSON.parse(m.tags) as unknown;
    if (Array.isArray(parsed)) tags = parsed as string[];
  } catch { /* keep empty */ }
  return {
    name: m.name,
    displayName: m.displayName,
    params: m.params,
    contextWindow: m.contextWindow,
    maxEmailTokens: m.maxEmailTokens,
    description: m.description,
    tags,
    recommended: m.recommended,
    recommendedForEmailProcessing: m.recommendedForEmailProcessing,
  };
}

/** All Ollama models as a flat array. Evaluated lazily after core is ready. */
export function getOllamaModels(): OllamaModel[] {
  return coreGetOllamaModels().map(mapModel);
}

export function getRecommendedOllamaModels(): OllamaModel[] {
  return coreGetRecommendedOllamaModels().map(mapModel);
}

export function getOllamaModelInfo(modelName: string): OllamaModel | undefined {
  const m = coreGetOllamaModelInfo(modelName);
  return m ? mapModel(m) : undefined;
}
