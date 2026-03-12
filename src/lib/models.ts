/** Available ONNX models for browser inference with Transformers.js v4 */

import type { Model, ModelGroup } from "$lib/types";

export const MODEL_GROUPS: ModelGroup[] = [
  {
    label: "GPT-OSS",
    models: [
      {
        id: "onnx-community/gpt-oss-20b-ONNX",
        name: "20B",
        size: "~12 GB",
        contextWindow: 131072,
        maxEmailTokens: 16000,
        description: "OpenAI open-source, 128k context, built-in reasoning",
        gpuWarning: "Requires powerful GPU (12 GB+ VRAM). ~12 GB download.",
        isExperimental: true,
        recommendedForEmailProcessing: true,
      },
    ],
  },
  {
    label: "Qwen 3.5",
    models: [
      {
        id: "onnx-community/Qwen3.5-0.8B-ONNX",
        name: "0.8B",
        size: "~647 MB",
        contextWindow: 262144,
        maxEmailTokens: 4000,
        description: "Fastest, 256k context, hybrid attention",
      },
      {
        id: "onnx-community/Qwen3.5-2B-ONNX",
        name: "2B",
        size: "~1.6 GB",
        contextWindow: 262144,
        maxEmailTokens: 6000,
        description: "Balanced speed and quality, 256k context",
        recommendedForEmailProcessing: true,
      },
      {
        id: "onnx-community/Qwen3.5-4B-ONNX",
        name: "4B",
        size: "~3 GB",
        contextWindow: 262144,
        maxEmailTokens: 12000,
        description: "Best reasoning, 256k context",
        recommendedForEmailProcessing: true,
        gpuWarning: "Requires good GPU (8 GB+ VRAM recommended)",
      },
    ],
  },
];

export const MODELS: Model[] = MODEL_GROUPS.flatMap((g) => g.models);

export function getModelInfo(modelId: string): Model | undefined {
  return MODELS.find((m) => m.id === modelId);
}
