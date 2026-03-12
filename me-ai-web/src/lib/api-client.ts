import { getSetting } from "./store/settings.js";

export type ApiProvider = "openai" | "anthropic" | "google" | "xai";

export interface ChatMessage {
  role: string;
  content?: string;
}

export interface TokenCallbackPayload {
  content: string;
  done: boolean;
  inputTokens?: number;
  outputTokens?: number;
}

export interface StreamOptions {
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

/**
 * Get the API key for a specific provider from settings
 */
export async function getApiKey(provider: ApiProvider): Promise<string | null> {
  return await getSetting<string>(`${provider}ApiKey`);
}

/**
 * Test API connection by making a minimal request
 */
export async function testApiConnection(
  provider: ApiProvider,
  apiKey: string | null
): Promise<{ connected: boolean; error?: string }> {
  if (!apiKey) return { connected: false, error: "API key is required" };

  try {
    let url: string;
    let headers: Record<string, string>;
    let body: string | undefined;

    if (provider === "openai" || provider === "xai") {
      url =
        provider === "openai"
          ? "https://api.openai.com/v1/models"
          : "https://api.x.ai/v1/models";
      headers = { Authorization: `Bearer ${apiKey}` };

      const res = await fetch(url, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) {
        const errorText = await res.text();
        return { connected: false, error: `HTTP ${res.status}: ${errorText}` };
      }
      return { connected: true };
    } else if (provider === "anthropic") {
      url = "https://api.anthropic.com/v1/messages";
      headers = {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerously-allow-browser": "true",
        "content-type": "application/json",
      };
      body = JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 1,
        messages: [{ role: "user", content: "test" }],
      });

      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) {
        const errorText = await res.text();
        if (res.status === 401 || res.status === 403) {
          return { connected: false, error: `HTTP ${res.status}: ${errorText}` };
        }
      }
      return { connected: true };
    } else if (provider === "google") {
      url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const res = await fetch(url, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) {
        const errorText = await res.text();
        return { connected: false, error: `HTTP ${res.status}: ${errorText}` };
      }
      return { connected: true };
    }

    return { connected: false, error: "Unknown provider" };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Stream chat completion from cloud APIs
 */
export async function streamApiChat(
  provider: ApiProvider,
  modelName: string,
  messages: ChatMessage[],
  options: StreamOptions = {},
  onToken: (data: TokenCallbackPayload) => void = () => {}
): Promise<void> {
  const { temperature = 0.7, maxTokens = 4096, signal } = options;
  const apiKey = await getApiKey(provider);
  if (!apiKey) {
    throw new Error(
      `No API key configured for ${provider}. Please check your settings.`
    );
  }

  let url: string;
  let headers: Record<string, string>;
  let body: string;

  if (provider === "openai" || provider === "xai") {
    url =
      provider === "openai"
        ? "https://api.openai.com/v1/chat/completions"
        : "https://api.x.ai/v1/chat/completions";
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    const systemMsg = messages.find((m) => m.role === "system");
    const otherMsgs = messages.filter((m) => m.role !== "system");
    const o1Family = /^o\d/.test(modelName);
    const bodyObj: Record<string, unknown> = {
      model: modelName,
      messages: systemMsg ? [systemMsg, ...otherMsgs] : otherMsgs,
      stream: true,
    };
    if (o1Family) {
      bodyObj.temperature = 1;
      bodyObj.max_completion_tokens = maxTokens;
    } else {
      bodyObj.temperature = temperature;
      bodyObj.max_tokens = maxTokens;
    }
    body = JSON.stringify(bodyObj);
  } else if (provider === "anthropic") {
    url = "https://api.anthropic.com/v1/messages";
    headers = {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerously-allow-browser": "true",
      "content-type": "application/json",
    };
    const systemMsg = messages.find((m) => m.role === "system");
    const otherMsgs = messages.filter((m) => m.role !== "system");
    body = JSON.stringify({
      model: modelName,
      system: systemMsg?.content,
      messages: otherMsgs,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });
  } else if (provider === "google") {
    url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?key=${apiKey}`;
    headers = { "Content-Type": "application/json" };
    const systemMsg = messages.find((m) => m.role === "system");
    const otherMsgs = messages.filter((m) => m.role !== "system");
    const contents = otherMsgs.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content ?? "" }],
    }));
    const bodyObj: Record<string, unknown> = {
      contents,
      generationConfig: { temperature, maxOutputTokens: maxTokens },
    };
    if (systemMsg) {
      bodyObj.systemInstruction = {
        parts: [{ text: systemMsg.content ?? "" }],
      };
    }
    body = JSON.stringify(bodyObj);
  } else {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  const response = await fetch(url, { method: "POST", headers, body, signal });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${provider} API error: ${error}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder("utf-8");
  let inputTokens = 0;
  let outputTokens = 0;
  let pendingBuffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      pendingBuffer += chunk;
      const lines = pendingBuffer.split("\n");
      pendingBuffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;
        const dataStr = trimmed.slice(5).trim();
        if (dataStr === "[DONE]") break;
        try {
          const data = JSON.parse(dataStr) as Record<string, unknown>;
          if (provider === "openai" || provider === "xai") {
            const content = (data.choices as { delta?: { content?: string } }[])?.[0]?.delta?.content;
            if (content) {
              outputTokens++;
              onToken({ content, done: false });
            }
            const usage = data.usage as { prompt_tokens?: number; completion_tokens?: number } | undefined;
            if (usage) {
              inputTokens = usage.prompt_tokens ?? 0;
              outputTokens = usage.completion_tokens ?? outputTokens;
            }
          } else if (provider === "anthropic") {
            if (data.type === "message_start") {
              const msg = data.message as { usage?: { input_tokens?: number } } | undefined;
              inputTokens = msg?.usage?.input_tokens ?? 0;
            } else if (data.type === "content_block_delta" && (data.delta as { text?: string })?.text) {
              outputTokens++;
              onToken({ content: (data.delta as { text: string }).text, done: false });
            } else if (data.type === "message_delta" && (data.usage as { output_tokens?: number })) {
              outputTokens = (data.usage as { output_tokens: number }).output_tokens ?? outputTokens;
            }
          } else if (provider === "google") {
            const candidates = data.candidates as { content?: { parts?: { text?: string }[] } }[] | undefined;
            const text = candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              outputTokens++;
              onToken({ content: text, done: false });
            }
            const meta = data.usageMetadata as { promptTokenCount?: number; candidatesTokenCount?: number } | undefined;
            if (meta) {
              inputTokens = meta.promptTokenCount ?? inputTokens;
              outputTokens = meta.candidatesTokenCount ?? outputTokens;
            }
          }
        } catch {
          // ignore incomplete JSON
        }
      }
    }
    onToken({
      content: "",
      done: true,
      inputTokens,
      outputTokens,
    });
  } finally {
    reader.releaseLock();
  }
}
