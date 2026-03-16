/**
 * Ollama API client for local LLM inference.
 * @see https://github.com/ollama/ollama/blob/main/docs/api.md
 */

const LOCAL_OLLAMA_URL = "http://localhost:11434";
const REMOTE_OLLAMA_URL = "https://me-ai.metaelon.space";

function getDefaultOllamaUrl(): string {
  try {
    const hostname = window.location.hostname;
    const isLocal =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";
    return isLocal ? LOCAL_OLLAMA_URL : REMOTE_OLLAMA_URL;
  } catch {
    return LOCAL_OLLAMA_URL;
  }
}

export function getOllamaUrl(): string {
  return getDefaultOllamaUrl();
}

export async function getOllamaUrlAsync(): Promise<string> {
  const { getSetting } = await import("./store/settings.js");
  return (await getSetting<string>("ollamaUrl")) || getDefaultOllamaUrl();
}

export async function setOllamaUrl(url: string): Promise<void> {
  const { setSetting } = await import("./store/settings.js");
  await setSetting("ollamaUrl", url);
}

export interface OllamaConnectionResult {
  connected: boolean;
  version?: string;
  error?: string;
  corsError?: boolean;
}

export async function testOllamaConnection(
  url: string = getOllamaUrl()
): Promise<OllamaConnectionResult> {
  try {
    const response = await fetch(`${url}/api/version`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      return { connected: false, error: `HTTP ${response.status}` };
    }
    const data = (await response.json()) as { version?: string };
    return { connected: true, version: data.version };
  } catch (error) {
    const err = error as Error & { name?: string };
    const isCorsError =
      err.message?.includes("CORS") ||
      err.message?.includes("Failed to fetch") ||
      err.name === "TypeError";
    if (isCorsError) {
      return {
        connected: false,
        corsError: true,
        error:
          "CORS error: Server must allow requests from this origin. Configure Access-Control-Allow-Origin header.",
      };
    }
    return {
      connected: false,
      error: err.name === "TimeoutError" ? "Connection timeout" : err.message ?? String(error),
    };
  }
}

export interface OllamaModelTag {
  name: string;
  size?: number;
  modified_at?: string;
}

export async function listOllamaModels(
  url: string = getOllamaUrl()
): Promise<OllamaModelTag[]> {
  const response = await fetch(`${url}/api/tags`, {
    method: "GET",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    throw new Error(`Failed to list models: HTTP ${response.status}`);
  }
  const data = (await response.json()) as { models?: OllamaModelTag[] };
  return data.models ?? [];
}

export async function pullOllamaModel(
  modelName: string,
  onProgress: (p: Record<string, unknown>) => void = () => {},
  url: string = getOllamaUrl()
): Promise<void> {
  const response = await fetch(`${url}/api/pull`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: modelName }),
  });
  if (!response.ok) {
    throw new Error(`Failed to pull model: HTTP ${response.status}`);
  }
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      const lines = text.split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          onProgress(JSON.parse(line) as Record<string, unknown>);
        } catch { /* no-op */ }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export interface OllamaChatMessage {
  role: string;
  content?: string;
}

export interface StreamOllamaOptions {
  temperature?: number;
  maxTokens?: number;
  keepAlive?: string;
}

export interface OllamaTokenData {
  content: string;
  done: boolean;
  total_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export async function streamOllamaChat(
  modelName: string,
  messages: OllamaChatMessage[],
  options: StreamOllamaOptions = {},
  onToken: (data: OllamaTokenData) => void = () => {},
  url: string = getOllamaUrl()
): Promise<string> {
  const { temperature = 0.7, maxTokens = 4096, keepAlive } = options;
  const body: Record<string, unknown> = {
    model: modelName,
    messages,
    stream: true,
    options: { temperature, num_predict: maxTokens },
  };
  body.keep_alive = keepAlive !== undefined ? keepAlive : "10m";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000);
  const response = await fetch(`${url}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ollama API error: ${error}`);
  }
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      const lines = text.split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const data = JSON.parse(line) as {
            message?: { content?: string };
            done?: boolean;
            total_duration?: number;
            eval_count?: number;
            eval_duration?: number;
          };
          if (data.message?.content) {
            fullText += data.message.content;
            onToken({
              content: data.message.content,
              done: false,
              total_duration: data.total_duration,
              eval_count: data.eval_count,
              eval_duration: data.eval_duration,
            });
          }
          if (data.done) {
            onToken({
              content: "",
              done: true,
              total_duration: data.total_duration,
              eval_count: data.eval_count,
              eval_duration: data.eval_duration,
            });
            break;
          }
        } catch { /* no-op */ }
      }
    }
  } finally {
    reader.releaseLock();
  }
  return fullText;
}

export async function generateOllamaChat(
  modelName: string,
  messages: OllamaChatMessage[],
  options: StreamOllamaOptions = {},
  url: string = getOllamaUrl()
): Promise<{ text: string; eval_count: number; eval_duration: number }> {
  let fullText = "";
  let evalCount = 0;
  let evalDuration = 0;
  await streamOllamaChat(
    modelName,
    messages,
    options,
    (data) => {
      fullText += data.content;
      if (data.eval_count != null) evalCount = data.eval_count;
      if (data.eval_duration != null) evalDuration = data.eval_duration;
    },
    url
  );
  return { text: fullText, eval_count: evalCount, eval_duration: evalDuration };
}
