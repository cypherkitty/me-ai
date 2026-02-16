/** Available ONNX models for browser inference */
export const MODELS = [
  { 
    id: "onnx-community/Qwen3-0.6B-ONNX", 
    name: "Qwen3 0.6B", 
    size: "~400 MB", 
    contextWindow: 32768,
    maxEmailTokens: 4000, // Conservative for WebGPU memory
    description: "Fastest, best for quick answers"
  },
  { 
    id: "onnx-community/Qwen3-1.7B-ONNX", 
    name: "Qwen3 1.7B", 
    size: "~1.1 GB", 
    contextWindow: 32768,
    maxEmailTokens: 6000,
    description: "Balanced speed and quality"
  },
  { 
    id: "onnx-community/Qwen3-4B-ONNX", 
    name: "Qwen3 4B", 
    size: "~2.6 GB", 
    contextWindow: 32768,
    maxEmailTokens: 12000, // Can handle much longer emails
    description: "Better reasoning, slower, best for email classification",
    recommendedForEmailProcessing: true
  },
  { 
    id: "onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX", 
    name: "DeepSeek R1 1.5B", 
    size: "~1 GB", 
    contextWindow: 32768,
    maxEmailTokens: 5000,
    description: "Strong reasoning, CoT focused"
  },
  { 
    id: "onnx-community/Phi-4-mini-instruct-ONNX", 
    name: "Phi-4 Mini", 
    size: "~2.5 GB", 
    contextWindow: 16384,
    maxEmailTokens: 8000,
    description: "Microsoft, good at reasoning"
  },
  { 
    id: "microsoft/Phi-3-mini-4k-instruct-onnx-web", 
    name: "Phi-3 Mini 4k", 
    size: "~2.6 GB", 
    contextWindow: 4096,
    maxEmailTokens: 2000, // Limited 4k context
    description: "WebGPU-optimized, Microsoft, 4k context"
  },
  { 
    id: "onnx-community/gemma-3-270m-it-ONNX", 
    name: "Gemma 3 270M", 
    size: "~190 MB", 
    contextWindow: 8192,
    maxEmailTokens: 2000, // Smallest context
    description: "Smallest, ultra fast, not for long emails"
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
    return { type: "ok", message: `${model.name} is well-suited for email processing` };
  }
  
  const recommended = MODELS
    .filter(m => m.recommendedForEmailProcessing)
    .map(m => m.name);
  
  return {
    type: "warning",
    message: `${model.name} may fail on long emails. For best results, use: ${recommended.join(" or ")}`
  };
}
