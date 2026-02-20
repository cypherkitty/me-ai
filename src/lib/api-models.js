export const API_MODELS = [
  // OpenAI
  {
    id: "gpt-4.5-preview",
    name: "gpt-4.5-preview",
    displayName: "GPT-4.5 Preview",
    provider: "openai",
    description: "OpenAI's latest frontier model",
    contextWindow: 128000,
    maxEmailTokens: 16384,
    recommendedForEmailProcessing: true,
  },
  {
    id: "o3-mini",
    name: "o3-mini",
    displayName: "o3-mini",
    provider: "openai",
    description: "Fast reasoning model",
    contextWindow: 200000,
    maxEmailTokens: 32000,
    recommendedForEmailProcessing: true,
  },

  // Anthropic
  {
    id: "claude-3-7-sonnet-latest",
    name: "claude-3-7-sonnet-latest",
    displayName: "Claude 3.7 Sonnet",
    provider: "anthropic",
    description: "Anthropic's most intelligent model",
    contextWindow: 200000,
    maxEmailTokens: 32000,
    recommendedForEmailProcessing: true,
  },
  {
    id: "claude-3-5-haiku-latest",
    name: "claude-3-5-haiku-latest",
    displayName: "Claude 3.5 Haiku",
    provider: "anthropic",
    description: "Fastest and most compact model",
    contextWindow: 200000,
    maxEmailTokens: 32000,
    recommendedForEmailProcessing: true,
  },
  
  // Google
  {
    id: "gemini-3.1-pro-preview",
    name: "gemini-3.1-pro-preview",
    displayName: "Gemini 3.1 Pro",
    provider: "google",
    description: "Google's latest flagship model",
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
    id: "grok-3-latest",
    name: "grok-3-latest",
    displayName: "Grok 3",
    provider: "xai",
    description: "xAI's latest frontier model",
    contextWindow: 128000,
    maxEmailTokens: 16384,
    recommendedForEmailProcessing: true,
  },
  {
    id: "grok-2-latest",
    name: "grok-2-latest",
    displayName: "Grok 2",
    provider: "xai",
    description: "xAI's previous model",
    contextWindow: 128000,
    maxEmailTokens: 16384,
    recommendedForEmailProcessing: true,
  },
];

export function getApiModelInfo(modelId) {
  return API_MODELS.find((m) => m.id === modelId) || null;
}
