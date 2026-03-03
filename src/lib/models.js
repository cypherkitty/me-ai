/** Available ONNX models for browser inference with Transformers.js v4 */
export const MODELS = [
  // ── Qwen3.5 (released 2026-03-02) ─────────────────────────────────────────
  {
    id: "onnx-community/Qwen3.5-0.8B-ONNX",
    name: "Qwen3.5 0.8B",
    size: "~647 MB",
    contextWindow: 262144, // 256k
    maxEmailTokens: 4000,
    description: "Newest Qwen, 256k context, fastest, hybrid attention",
    isNew: true,
  },
  {
    id: "onnx-community/Qwen3.5-2B-ONNX",
    name: "Qwen3.5 2B",
    size: "~1.6 GB",
    contextWindow: 262144, // 256k
    maxEmailTokens: 6000,
    description: "Newest Qwen, 256k context, balanced speed and quality",
    isNew: true,
    recommendedForEmailProcessing: true,
  },
  {
    id: "onnx-community/Qwen3.5-4B-ONNX",
    name: "Qwen3.5 4B",
    size: "~3 GB",
    contextWindow: 262144, // 256k
    maxEmailTokens: 12000,
    description: "Newest Qwen, 256k context, best reasoning",
    isNew: true,
    recommendedForEmailProcessing: true,
    gpuWarning: "Requires good GPU (8GB+ VRAM recommended)",
  },

  // ── Qwen3 ──────────────────────────────────────────────────────────────────
  {
    id: "onnx-community/Qwen3-0.6B-ONNX",
    name: "Qwen3 0.6B",
    size: "~400 MB",
    contextWindow: 32768, // 32k
    maxEmailTokens: 4000,
    description: "Fast, 32k context, best for quick answers",
  },
  {
    id: "onnx-community/Qwen3-1.7B-ONNX",
    name: "Qwen3 1.7B",
    size: "~1.1 GB",
    contextWindow: 32768, // 32k
    maxEmailTokens: 6000,
    description: "Balanced speed and quality, 32k context",
  },
  {
    id: "onnx-community/Qwen3-4B-ONNX",
    name: "Qwen3 4B",
    size: "~2.6 GB",
    contextWindow: 32768, // 32k
    maxEmailTokens: 12000,
    description: "Best reasoning, 32k context, recommended for email",
    recommendedForEmailProcessing: true,
  },

  // ── Other models ───────────────────────────────────────────────────────────
  {
    id: "onnx-community/gpt-oss-20b-ONNX",
    name: "GPT-OSS 20B",
    size: "~12 GB",
    contextWindow: 131072, // 128k
    maxEmailTokens: 16000,
    description: "OpenAI open-source 20B, 128k context, built-in reasoning",
    gpuWarning: "Requires powerful GPU (12GB+ VRAM). ~12 GB download.",
    isExperimental: true,
    recommendedForEmailProcessing: true,
  },
  {
    id: "onnx-community/Phi-3.5-mini-instruct-onnx-web",
    name: "Phi-3.5 Mini",
    size: "~2.5 GB",
    contextWindow: 131072, // 128k
    maxEmailTokens: 16000,
    description: "128k context, WebGPU-optimized, best for very long emails",
    recommendedForEmailProcessing: true,
  },
  {
    id: "onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX",
    name: "DeepSeek R1 1.5B",
    size: "~1 GB",
    contextWindow: 32768, // 32k
    maxEmailTokens: 5000,
    description: "Strong reasoning, CoT focused, 32k context",
  },
  {
    id: "onnx-community/Phi-4-mini-instruct-ONNX",
    name: "Phi-4 Mini",
    size: "~2.5 GB",
    contextWindow: 16384, // 16k
    maxEmailTokens: 8000,
    description: "Microsoft, good at reasoning, 16k context",
    gpuWarning: "Requires good GPU (8GB+ VRAM recommended)",
  },
  {
    id: "onnx-community/Phi-4-mini-instruct-ONNX-GQA",
    name: "Phi-4 Mini GQA",
    size: "~2.5 GB",
    contextWindow: 16384, // 16k
    maxEmailTokens: 8000,
    description: "Phi-4 with Grouped Query Attention, faster inference",
    gpuWarning: "Requires good GPU (8GB+ VRAM recommended)",
    isExperimental: true,
  },
  {
    id: "onnx-community/gemma-3-270m-it-ONNX",
    name: "Gemma 3 270M",
    size: "~190 MB",
    contextWindow: 8192, // 8k
    maxEmailTokens: 2000,
    description: "Smallest, ultra fast, 8k context, not for long emails",
  },
];

/**
 * Get model metadata by ID
 */
export function getModelInfo(modelId) {
  return MODELS.find(m => m.id === modelId);
}

/**
 * Get recommendation message for email processing based on model
 */
export function getEmailProcessingRecommendation(modelId) {
  const model = getModelInfo(modelId);
  if (!model) return null;
  
  if (model.recommendedForEmailProcessing) {
    return { 
      type: "ok", 
      message: `${model.name} (${(model.contextWindow / 1024).toFixed(0)}k context) is recommended for email processing` 
    };
  }
  
  const recommended = MODELS
    .filter(m => m.recommendedForEmailProcessing)
    .map(m => `${m.name} (${(m.contextWindow / 1024).toFixed(0)}k)`);
  
  return {
    type: "warning",
    message: `${model.name} (${(model.contextWindow / 1024).toFixed(0)}k context) may struggle with very long emails. For best results, use: ${recommended.join(" or ")}`
  };
}
