/**
 * Curated list of Ollama models optimized for local inference.
 * All models are under 20B parameters.
 * 
 * Model naming: {name}:{tag} where tag is typically size (e.g., "3b", "8b")
 * Common quantization tags: q4_0, q4_K_M, q8_0, fp16
 * 
 * @see https://ollama.com/library for full model catalog
 */

export const OLLAMA_MODELS = [
  // ── Qwen3 Family (Latest, best multilingual & reasoning) ───────────
  {
    name: "qwen3:4b",
    displayName: "Qwen3 4B",
    params: "4B",
    contextWindow: 131072, // 128k
    description: "Latest Qwen, 128k context, enhanced reasoning",
    tags: ["multilingual", "reasoning", "general"],
    recommended: true,
  },
  {
    name: "qwen3:8b",
    displayName: "Qwen3 8B",
    params: "8B",
    contextWindow: 131072, // 128k
    description: "Powerful reasoning, 128k context, 100+ languages",
    tags: ["multilingual", "reasoning", "advanced"],
    recommended: true,
  },
  {
    name: "qwen3:14b",
    displayName: "Qwen3 14B",
    params: "14B",
    contextWindow: 131072, // 128k
    description: "Most capable Qwen3, best for complex tasks",
    tags: ["multilingual", "reasoning", "advanced"],
    recommended: true,
  },

  // ── Ministral 3 Family (256k context, edge-optimized) ──────────────
  {
    name: "ministral-3:3b",
    displayName: "Ministral 3 3B",
    params: "3B",
    contextWindow: 262144, // 256k
    description: "Mistral's smallest, 256k context, Apache 2.0",
    tags: ["fast", "long-context", "efficient"],
    recommended: true,
  },
  {
    name: "ministral-3:8b",
    displayName: "Ministral 3 8B",
    params: "8B",
    contextWindow: 262144, // 256k
    description: "Balanced performance, 256k context, vision capable",
    tags: ["general", "long-context", "vision"],
    recommended: true,
  },
  {
    name: "ministral-3:14b",
    displayName: "Ministral 3 14B",
    params: "14B",
    contextWindow: 262144, // 256k
    description: "Most capable Ministral, 256k context, function calling",
    tags: ["advanced", "long-context", "vision"],
    recommended: true,
  },

  // ── GPT-OSS (OpenAI's open-weight reasoning model) ─────────────────
  {
    name: "gpt-oss:20b",
    displayName: "GPT-OSS 20B",
    params: "20B",
    contextWindow: 131072, // 128k
    description: "OpenAI's open model, strong reasoning, Apache 2.0",
    tags: ["reasoning", "cot", "openai"],
    recommended: true,
  },

  // ── Gemma3 Family (Google, multimodal) ─────────────────────────────
  {
    name: "gemma3:4b",
    displayName: "Gemma3 4B",
    params: "4B",
    contextWindow: 131072, // 128k
    description: "Google, 128k context, multimodal (text + images)",
    tags: ["multimodal", "vision", "multilingual"],
    recommended: true,
  },
  {
    name: "gemma3:12b",
    displayName: "Gemma3 12B",
    params: "12B",
    contextWindow: 131072, // 128k
    description: "Powerful multimodal, 128k context, 140+ languages",
    tags: ["multimodal", "vision", "multilingual", "advanced"],
    recommended: true,
  },

  // ── Gemma3N (Efficient with selective activation) ──────────────────
  {
    name: "gemma3n:e2b",
    displayName: "Gemma3N E2B",
    params: "2B effective",
    contextWindow: 32768,
    description: "Efficient 2B, multimodal, MatFormer architecture",
    tags: ["efficient", "multimodal", "fast"],
  },
  {
    name: "gemma3n:e4b",
    displayName: "Gemma3N E4B",
    params: "4B effective",
    contextWindow: 32768,
    description: "Efficient 4B, multimodal, selective parameter activation",
    tags: ["efficient", "multimodal", "balanced"],
  },

  // ── DeepSeek R1 (Strong reasoning, CoT) ────────────────────────────
  {
    name: "deepseek-r1:7b",
    displayName: "DeepSeek R1 7B",
    params: "7B",
    contextWindow: 65536, // 64k
    description: "Strong chain-of-thought reasoning, research-focused",
    tags: ["reasoning", "cot"],
    recommended: true,
  },
  {
    name: "deepseek-r1:14b",
    displayName: "DeepSeek R1 14B",
    params: "14B",
    contextWindow: 65536, // 64k
    description: "Advanced CoT reasoning, slower but thorough",
    tags: ["reasoning", "cot", "advanced"],
    recommended: true,
  },
];

/**
 * Get recommended models for email processing
 */
export function getRecommendedOllamaModels() {
  return OLLAMA_MODELS.filter(m => m.recommended);
}

/**
 * Get model by name
 */
export function getOllamaModelInfo(modelName) {
  // Match with or without tag (e.g., "qwen3" matches "qwen3:8b")
  return OLLAMA_MODELS.find(m => 
    m.name === modelName || 
    m.name.startsWith(modelName + ":")
  );
}

/**
 * Group models by context window size
 */
export function groupOllamaModelsByContext() {
  const groups = {
    "256k": [],
    "128k": [],
    "32-64k": [],
  };

  for (const model of OLLAMA_MODELS) {
    if (model.contextWindow >= 200000) {
      groups["256k"].push(model);
    } else if (model.contextWindow >= 100000) {
      groups["128k"].push(model);
    } else {
      groups["32-64k"].push(model);
    }
  }

  return groups;
}
