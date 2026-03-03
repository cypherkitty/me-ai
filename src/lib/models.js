/** Available ONNX models for browser inference with Transformers.js v4 */

/**
 * @typedef {Object} Model
 * @property {string} id - HuggingFace model ID
 * @property {string} name - Short display name (shown in dropdown)
 * @property {string} size - Approximate download size
 * @property {number} contextWindow - Max context tokens
 * @property {number} maxEmailTokens - Safe limit for email processing
 * @property {string} description - One-line description
 * @property {boolean} [recommendedForEmailProcessing]
 * @property {string} [gpuWarning]
 * @property {boolean} [isExperimental]
 */

/**
 * @typedef {Object} ModelGroup
 * @property {string} label - Group header in dropdown
 * @property {Model[]} models
 */

/** @type {ModelGroup[]} */
export const MODEL_GROUPS = [
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
];

/** Flat list of all models (for backwards compat) */
export const MODELS = MODEL_GROUPS.flatMap((g) => g.models);

/** Get model metadata by ID */
export function getModelInfo(modelId) {
  return MODELS.find((m) => m.id === modelId);
}

/** Get the group label for a model ID */
export function getModelGroup(modelId) {
  return MODEL_GROUPS.find((g) => g.models.some((m) => m.id === modelId));
}

/** Get recommendation message for email processing based on model */
export function getEmailProcessingRecommendation(modelId) {
  const model = getModelInfo(modelId);
  if (!model) return null;

  if (model.recommendedForEmailProcessing) {
    return {
      type: "ok",
      message: `${model.name} (${(model.contextWindow / 1024).toFixed(0)}k context) is recommended for email processing`,
    };
  }

  const recommended = MODELS.filter((m) => m.recommendedForEmailProcessing).map(
    (m) => `${m.name} (${(m.contextWindow / 1024).toFixed(0)}k)`,
  );

  return {
    type: "warning",
    message: `${model.name} (${(model.contextWindow / 1024).toFixed(0)}k context) may struggle with very long emails. For best results, use: ${recommended.join(" or ")}`,
  };
}
