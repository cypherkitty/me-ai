export interface OllamaModel {
  name: string;
  displayName: string;
  params: string;
  contextWindow: number;
  maxEmailTokens: number;
  description: string;
  tags: string[];
  recommended?: boolean;
  recommendedForEmailProcessing?: boolean;
}

export const OLLAMA_MODELS: OllamaModel[] = [
  {
    name: "qwen3:4b",
    displayName: "Qwen3 4B",
    params: "4B",
    contextWindow: 131072,
    maxEmailTokens: 100000,
    description: "Latest Qwen, 128k context, enhanced reasoning",
    tags: ["multilingual", "reasoning", "general"],
    recommended: true,
    recommendedForEmailProcessing: true,
  },
  {
    name: "qwen3:8b",
    displayName: "Qwen3 8B",
    params: "8B",
    contextWindow: 131072,
    maxEmailTokens: 100000,
    description: "Powerful reasoning, 128k context, 100+ languages",
    tags: ["multilingual", "reasoning", "advanced"],
    recommended: true,
    recommendedForEmailProcessing: true,
  },
  {
    name: "qwen3:14b",
    displayName: "Qwen3 14B",
    params: "14B",
    contextWindow: 131072,
    maxEmailTokens: 100000,
    description: "Most capable Qwen3, best for complex tasks",
    tags: ["multilingual", "reasoning", "advanced"],
    recommended: true,
    recommendedForEmailProcessing: true,
  },
  {
    name: "ministral-3:3b",
    displayName: "Ministral 3 3B",
    params: "3B",
    contextWindow: 262144,
    maxEmailTokens: 200000,
    description: "Mistral's smallest, 256k context, Apache 2.0",
    tags: ["fast", "long-context", "efficient"],
    recommended: true,
    recommendedForEmailProcessing: true,
  },
  {
    name: "ministral-3:8b",
    displayName: "Ministral 3 8B",
    params: "8B",
    contextWindow: 262144,
    maxEmailTokens: 200000,
    description: "Balanced performance, 256k context, vision capable",
    tags: ["general", "long-context", "vision"],
    recommended: true,
    recommendedForEmailProcessing: true,
  },
  {
    name: "ministral-3:14b",
    displayName: "Ministral 3 14B",
    params: "14B",
    contextWindow: 262144,
    maxEmailTokens: 200000,
    description: "Most capable Ministral, 256k context, function calling",
    tags: ["advanced", "long-context", "vision"],
    recommended: true,
    recommendedForEmailProcessing: true,
  },
  {
    name: "gpt-oss:20b",
    displayName: "GPT-OSS 20B",
    params: "20B",
    contextWindow: 131072,
    maxEmailTokens: 100000,
    description: "OpenAI's open model, strong reasoning, Apache 2.0",
    tags: ["reasoning", "cot", "openai"],
    recommended: true,
    recommendedForEmailProcessing: true,
  },
  {
    name: "gemma3:4b",
    displayName: "Gemma3 4B",
    params: "4B",
    contextWindow: 131072,
    maxEmailTokens: 100000,
    description: "Google, 128k context, multimodal (text + images)",
    tags: ["multimodal", "vision", "multilingual"],
    recommended: true,
    recommendedForEmailProcessing: true,
  },
  {
    name: "gemma3:12b",
    displayName: "Gemma3 12B",
    params: "12B",
    contextWindow: 131072,
    maxEmailTokens: 100000,
    description: "Powerful multimodal, 128k context, 140+ languages",
    tags: ["multimodal", "vision", "multilingual", "advanced"],
    recommended: true,
    recommendedForEmailProcessing: true,
  },
  {
    name: "gemma3n:e2b",
    displayName: "Gemma3N E2B",
    params: "2B effective",
    contextWindow: 32768,
    maxEmailTokens: 25000,
    description: "Efficient 2B, multimodal, MatFormer architecture",
    tags: ["efficient", "multimodal", "fast"],
    recommendedForEmailProcessing: false,
  },
  {
    name: "gemma3n:e4b",
    displayName: "Gemma3N E4B",
    params: "4B effective",
    contextWindow: 32768,
    maxEmailTokens: 25000,
    description: "Efficient 4B, multimodal, selective parameter activation",
    tags: ["efficient", "multimodal", "balanced"],
    recommendedForEmailProcessing: false,
  },
  {
    name: "deepseek-r1:7b",
    displayName: "DeepSeek R1 7B",
    params: "7B",
    contextWindow: 65536,
    maxEmailTokens: 50000,
    description: "Strong chain-of-thought reasoning, research-focused",
    tags: ["reasoning", "cot"],
    recommended: true,
    recommendedForEmailProcessing: true,
  },
  {
    name: "deepseek-r1:14b",
    displayName: "DeepSeek R1 14B",
    params: "14B",
    contextWindow: 65536,
    maxEmailTokens: 50000,
    description: "Advanced CoT reasoning, slower but thorough",
    tags: ["reasoning", "cot", "advanced"],
    recommended: true,
    recommendedForEmailProcessing: true,
  },
];

export function getRecommendedOllamaModels(): OllamaModel[] {
  return OLLAMA_MODELS.filter((m) => m.recommended);
}

export function getOllamaModelInfo(modelName: string): OllamaModel | undefined {
  return OLLAMA_MODELS.find(
    (m) => m.name === modelName || m.name.startsWith(modelName + ":")
  );
}
