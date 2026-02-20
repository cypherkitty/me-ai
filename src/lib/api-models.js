export const API_MODELS = [
  // OpenAI
  {
    id: "gpt-4.1",
    name: "gpt-4.1",
    displayName: "GPT-4.1",
    provider: "openai",
    description: "OpenAI's latest flagship model",
    contextWindow: 1047576,
    maxEmailTokens: 32000,
    recommendedForEmailProcessing: true,
  },
  {
    id: "gpt-4o",
    name: "gpt-4o",
    displayName: "GPT-4o",
    provider: "openai",
    description: "OpenAI's multimodal model, fast and capable",
    contextWindow: 128000,
    maxEmailTokens: 16384,
    recommendedForEmailProcessing: true,
  },
  {
    id: "o3-mini",
    name: "o3-mini",
    displayName: "o3-mini",
    provider: "openai",
    description: "Fast compact reasoning model",
    contextWindow: 200000,
    maxEmailTokens: 32000,
    recommendedForEmailProcessing: true,
  },

  // Anthropic
  {
    id: "claude-opus-4-6",
    name: "claude-opus-4-6",
    displayName: "Claude Opus 4.6",
    provider: "anthropic",
    description: "Anthropic's most intelligent model",
    contextWindow: 200000,
    maxEmailTokens: 32000,
    recommendedForEmailProcessing: true,
  },
  {
    id: "claude-sonnet-4-6",
    name: "claude-sonnet-4-6",
    displayName: "Claude Sonnet 4.6",
    provider: "anthropic",
    description: "Anthropic's balanced speed and intelligence model",
    contextWindow: 200000,
    maxEmailTokens: 32000,
    recommendedForEmailProcessing: true,
  },
  {
    id: "claude-haiku-4-5",
    name: "claude-haiku-4-5",
    displayName: "Claude Haiku 4.5",
    provider: "anthropic",
    description: "Anthropic's fastest model",
    contextWindow: 200000,
    maxEmailTokens: 32000,
    recommendedForEmailProcessing: true,
  },

  // Google
  {
    id: "gemini-3-pro-preview",
    name: "gemini-3-pro-preview",
    displayName: "Gemini 3 Pro",
    provider: "google",
    description: "Google's most capable model with 1M context",
    contextWindow: 1048576,
    maxEmailTokens: 65536,
    recommendedForEmailProcessing: true,
  },
  {
    id: "gemini-3-flash-preview",
    name: "gemini-3-flash-preview",
    displayName: "Gemini 3 Flash",
    provider: "google",
    description: "Fast and lightweight model",
    contextWindow: 1048576,
    maxEmailTokens: 65536,
    recommendedForEmailProcessing: true,
  },

  // xAI
  {
    id: "grok-4",
    name: "grok-4",
    displayName: "Grok 4",
    provider: "xai",
    description: "xAI's flagship reasoning model",
    contextWindow: 256000,
    maxEmailTokens: 32000,
    recommendedForEmailProcessing: true,
  },
  {
    id: "grok-3",
    name: "grok-3",
    displayName: "Grok 3",
    provider: "xai",
    description: "xAI's capable chat model",
    contextWindow: 131072,
    maxEmailTokens: 16384,
    recommendedForEmailProcessing: true,
  },
  {
    id: "grok-3-mini",
    name: "grok-3-mini",
    displayName: "Grok 3 Mini",
    provider: "xai",
    description: "xAI's fast and affordable model",
    contextWindow: 131072,
    maxEmailTokens: 16384,
    recommendedForEmailProcessing: true,
  },
];

export function getApiModelInfo(modelId) {
  return API_MODELS.find((m) => m.id === modelId) || null;
}
