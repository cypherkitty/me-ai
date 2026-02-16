/** Available ONNX models for browser inference */
export const MODELS = [
  { 
    id: "onnx-community/Qwen3-0.6B-ONNX", 
    name: "Qwen3 0.6B", 
    size: "~400 MB", 
    contextWindow: 32768, // 32k
    maxEmailTokens: 4000, // WebGPU memory limit for this model size
    description: "Fastest, 32k context, best for quick answers"
  },
  { 
    id: "onnx-community/Qwen3-1.7B-ONNX", 
    name: "Qwen3 1.7B", 
    size: "~1.1 GB", 
    contextWindow: 32768, // 32k
    maxEmailTokens: 6000, // WebGPU memory limit
    description: "Balanced speed and quality, 32k context"
  },
  { 
    id: "onnx-community/Qwen3-4B-ONNX", 
    name: "Qwen3 4B", 
    size: "~2.6 GB", 
    contextWindow: 32768, // 32k
    maxEmailTokens: 12000, // WebGPU can handle longer inputs with 4B
    description: "Best reasoning, 32k context, recommended for email",
    recommendedForEmailProcessing: true
  },
  { 
    id: "onnx-community/Phi-3.5-mini-instruct-onnx-web", 
    name: "Phi-3.5 Mini", 
    size: "~2.5 GB", 
    contextWindow: 131072, // 128k - largest context available for WebGPU!
    maxEmailTokens: 16000, // Can process very long emails
    description: "128k context, WebGPU-optimized, best for very long emails",
    recommendedForEmailProcessing: true
  },
  { 
    id: "onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX", 
    name: "DeepSeek R1 1.5B", 
    size: "~1 GB", 
    contextWindow: 32768, // 32k
    maxEmailTokens: 5000, // WebGPU memory limit
    description: "Strong reasoning, CoT focused, 32k context"
  },
  { 
    id: "onnx-community/Phi-4-mini-instruct-ONNX", 
    name: "Phi-4 Mini", 
    size: "~2.5 GB", 
    contextWindow: 16384, // 16k
    maxEmailTokens: 8000, // WebGPU memory limit
    description: "Microsoft, good at reasoning, 16k context"
  },
  { 
    id: "onnx-community/gemma-3-270m-it-ONNX", 
    name: "Gemma 3 270M", 
    size: "~190 MB", 
    contextWindow: 8192, // 8k
    maxEmailTokens: 2000, // Small model, limited WebGPU memory
    description: "Smallest, ultra fast, 8k context, not for long emails"
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
