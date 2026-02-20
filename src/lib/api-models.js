export const API_MODELS = [
  // OpenAI
  {
    id: "gpt-5.3-codex",
    name: "gpt-5.3-codex",
    displayName: "GPT-5.3 Codex",
    provider: "openai",
    description: "OpenAI's latest coding and reasoning model",
    contextWindow: 128000,
    maxEmailTokens: 16384,
    recommendedForEmailProcessing: true,
  },
  {
    id: "gpt-5.2",
    name: "gpt-5.2",
    displayName: "GPT-5.2",
    provider: "openai",
    description: "OpenAI's flagship general purpose model",
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
    id: "claude-4.6-opus-latest",
    name: "claude-4.6-opus-latest",
    displayName: "Claude 4.6 Opus",
    provider: "anthropic",
    description: "Anthropic's most intelligent model",
    contextWindow: 1000000,
    maxEmailTokens: 128000,
    recommendedForEmailProcessing: true,
  },
  {
    id: "claude-4.6-sonnet-latest",
    name: "claude-4.6-sonnet-latest",
    displayName: "Claude 4.6 Sonnet",
    provider: "anthropic",
    description: "Anthropic's balanced frontier model",
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
    id: "grok-4.1-fast",
    name: "grok-4.1-fast",
    displayName: "Grok 4.1 Fast",
    provider: "xai",
    description: "xAI's fast reasoning model",
    contextWindow: 2000000,
    maxEmailTokens: 128000,
    recommendedForEmailProcessing: true,
  },
  {
    id: "grok-4-latest",
    name: "grok-4-latest",
    displayName: "Grok 4",
    provider: "xai",
    description: "xAI's flagship model",
    contextWindow: 128000,
    maxEmailTokens: 16384,
    recommendedForEmailProcessing: true,
  },
];

export function getApiModelInfo(modelId) {
  return API_MODELS.find((m) => m.id === modelId) || null;
}
