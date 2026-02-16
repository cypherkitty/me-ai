/**
 * Curated list of Ollama models optimized for local inference.
 * All models are under 20B parameters.
 * 
 * Model naming: {name}:{tag} where tag is typically size (e.g., "3b", "7b")
 * Common quantization tags: q4_0, q4_K_M, q8_0, fp16
 * 
 * @see https://ollama.com/library for full model catalog
 */

export const OLLAMA_MODELS = [
  // ── Qwen Family (Best multilingual, strong reasoning) ──────────────
  {
    name: "qwen2.5:7b",
    displayName: "Qwen 2.5 7B",
    params: "7B",
    contextWindow: 32768,
    description: "Best multilingual (29+ languages), excellent reasoning",
    tags: ["multilingual", "reasoning", "general"],
    recommended: true,
  },
  {
    name: "qwen2.5:14b",
    displayName: "Qwen 2.5 14B",
    params: "14B",
    contextWindow: 32768,
    description: "More capable Qwen, better reasoning, slower",
    tags: ["multilingual", "reasoning", "advanced"],
    recommended: true,
  },
  {
    name: "qwen2.5-coder:7b",
    displayName: "Qwen 2.5 Coder 7B",
    params: "7B",
    contextWindow: 32768,
    description: "Code specialist, 92% HumanEval, multi-language",
    tags: ["code", "reasoning"],
    recommended: true,
  },

  // ── Llama Family (Strong general purpose) ──────────────────────────
  {
    name: "llama3.2:3b",
    displayName: "Llama 3.2 3B",
    params: "3B",
    contextWindow: 131072, // 128k
    description: "Fast, 128k context, good for long documents",
    tags: ["general", "long-context"],
    recommended: true,
  },
  {
    name: "llama3.1:8b",
    displayName: "Llama 3.1 8B",
    params: "8B",
    contextWindow: 131072, // 128k
    description: "Strong reasoning, 128k context, excellent for RAG",
    tags: ["reasoning", "long-context", "rag"],
    recommended: true,
  },

  // ── Phi Family (Microsoft, ultra-efficient) ────────────────────────
  {
    name: "phi4:14b",
    displayName: "Phi-4 14B",
    params: "14B",
    contextWindow: 16384,
    description: "Microsoft, punches above its weight, efficient",
    tags: ["reasoning", "efficient"],
    recommended: true,
  },

  // ── Mistral Family (Balanced, instruction-following) ───────────────
  {
    name: "mistral:7b",
    displayName: "Mistral 7B",
    params: "7B",
    contextWindow: 32768,
    description: "Balanced performance, good instruction following",
    tags: ["general", "balanced"],
  },
  {
    name: "mistral-nemo:12b",
    displayName: "Mistral Nemo 12B",
    params: "12B",
    contextWindow: 131072, // 128k
    description: "128k context, strong reasoning, Apache 2.0",
    tags: ["reasoning", "long-context"],
    recommended: true,
  },

  // ── DeepSeek (Strong reasoning, CoT) ───────────────────────────────
  {
    name: "deepseek-r1:7b",
    displayName: "DeepSeek R1 7B",
    params: "7B",
    contextWindow: 65536, // 64k
    description: "Strong chain-of-thought reasoning, research-focused",
    tags: ["reasoning", "cot"],
  },
  {
    name: "deepseek-r1:14b",
    displayName: "DeepSeek R1 14B",
    params: "14B",
    contextWindow: 65536, // 64k
    description: "Advanced CoT reasoning, slower but thorough",
    tags: ["reasoning", "cot", "advanced"],
  },

  // ── Smaller/Faster Options ─────────────────────────────────────────
  {
    name: "gemma2:9b",
    displayName: "Gemma 2 9B",
    params: "9B",
    contextWindow: 8192,
    description: "Google, fast, efficient, limited context",
    tags: ["fast", "efficient"],
  },
  {
    name: "qwen2.5:3b",
    displayName: "Qwen 2.5 3B",
    params: "3B",
    contextWindow: 32768,
    description: "Ultra fast, 32k context, multilingual",
    tags: ["fast", "multilingual"],
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
  // Match with or without tag (e.g., "qwen2.5" matches "qwen2.5:7b")
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
    "128k+": [],
    "32-64k": [],
    "8-16k": [],
  };

  for (const model of OLLAMA_MODELS) {
    if (model.contextWindow >= 100000) {
      groups["128k+"].push(model);
    } else if (model.contextWindow >= 32000) {
      groups["32-64k"].push(model);
    } else {
      groups["8-16k"].push(model);
    }
  }

  return groups;
}
