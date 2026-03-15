export interface ApiModel {
  /** Local unique id used in settings/UI */
  id: string;
  /** Actual provider model name sent to the API (no date or version suffixes beyond the official id) */
  name: string;
  displayName: string;
  provider: string;
  description: string;
  contextWindow: number;
  maxEmailTokens: number;
  recommendedForEmailProcessing?: boolean;
  /** For OpenAI reasoning models: the reasoning effort level to pass in the request */
  reasoningEffort?: "low" | "medium" | "high";
}

export const API_MODELS: ApiModel[] = [
  // OpenAI (based on official catalog: https://developers.openai.com/api/docs/models)
  // GPT‑5.4 reasoning levels
  {
    id: "gpt-5.4-low",
    name: "gpt-5.4",
    displayName: "GPT-5.4 (Low reasoning)",
    provider: "openai",
    description: "GPT-5.4 frontier model with low reasoning effort (best latency/cost)",
    contextWindow: 1_000_000,
    maxEmailTokens: 64_000,
    recommendedForEmailProcessing: true,
    reasoningEffort: "low",
  },
  {
    id: "gpt-5.4-medium",
    name: "gpt-5.4",
    displayName: "GPT-5.4 (Medium reasoning)",
    provider: "openai",
    description: "GPT-5.4 with medium reasoning effort (balanced)",
    contextWindow: 1_000_000,
    maxEmailTokens: 64_000,
    recommendedForEmailProcessing: true,
    reasoningEffort: "medium",
  },
  {
    id: "gpt-5.4-high",
    name: "gpt-5.4",
    displayName: "GPT-5.4 (High reasoning)",
    provider: "openai",
    description: "GPT-5.4 with high reasoning effort for harder problems",
    contextWindow: 1_000_000,
    maxEmailTokens: 64_000,
    recommendedForEmailProcessing: true,
    reasoningEffort: "high",
  },
  {
    id: "gpt-5.4-xhigh",
    name: "gpt-5.4",
    displayName: "GPT-5.4 (XHigh reasoning)",
    provider: "openai",
    description: "GPT-5.4 with extra-high reasoning effort; slowest and most thorough",
    contextWindow: 1_000_000,
    maxEmailTokens: 64_000,
    recommendedForEmailProcessing: true,
    reasoningEffort: "high",
  },
  // GPT‑5 Mini (no date suffix in name)
  {
    id: "gpt-5-mini",
    name: "gpt-5-mini",
    displayName: "GPT-5 Mini",
    provider: "openai",
    description: "Near-frontier, lower-latency model for cost-sensitive workloads",
    contextWindow: 400_000,
    maxEmailTokens: 32_000,
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

export function getApiModelInfo(modelId: string): ApiModel | null {
  return API_MODELS.find((m) => m.id === modelId) ?? null;
}
