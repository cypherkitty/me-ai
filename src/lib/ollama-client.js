/**
 * Ollama API client for local LLM inference.
 * 
 * Supports streaming chat completions via the Ollama REST API.
 * Ollama runs locally and provides access to models like Llama, Mistral, Qwen, etc.
 * 
 * @see https://github.com/ollama/ollama/blob/main/docs/api.md
 */

const DEFAULT_OLLAMA_URL = "http://localhost:11434";

/**
 * Get Ollama base URL from settings or use default
 */
export function getOllamaUrl() {
  try {
    return localStorage.getItem("ollamaUrl") || DEFAULT_OLLAMA_URL;
  } catch {
    return DEFAULT_OLLAMA_URL;
  }
}

/**
 * Set Ollama base URL
 */
export function setOllamaUrl(url) {
  try {
    localStorage.setItem("ollamaUrl", url);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Test Ollama server connectivity
 * @returns {Promise<{connected: boolean, version?: string, error?: string}>}
 */
export async function testOllamaConnection(url = getOllamaUrl()) {
  try {
    const response = await fetch(`${url}/api/version`, {
      method: "GET",
      signal: AbortSignal.timeout(5000), // 5s timeout
    });

    if (!response.ok) {
      return { connected: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { connected: true, version: data.version };
  } catch (error) {
    return { 
      connected: false, 
      error: error.name === "TimeoutError" ? "Connection timeout" : error.message 
    };
  }
}

/**
 * List available models from Ollama
 * @returns {Promise<Array<{name: string, size: number, modified_at: string}>>}
 */
export async function listOllamaModels(url = getOllamaUrl()) {
  const response = await fetch(`${url}/api/tags`, {
    method: "GET",
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Failed to list models: HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.models || [];
}

/**
 * Pull/download an Ollama model
 * @param {string} modelName - Model to pull (e.g., "llama3.2:3b")
 * @param {function} onProgress - Progress callback (receives {status, completed, total})
 * @returns {Promise<void>}
 */
export async function pullOllamaModel(modelName, onProgress = () => {}, url = getOllamaUrl()) {
  const response = await fetch(`${url}/api/pull`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: modelName }),
  });

  if (!response.ok) {
    throw new Error(`Failed to pull model: HTTP ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split("\n").filter(Boolean);

      for (const line of lines) {
        try {
          const progress = JSON.parse(line);
          onProgress(progress);
        } catch {
          // Ignore invalid JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Stream chat completion from Ollama
 * @param {string} modelName - Model to use (e.g., "qwen2.5:7b")
 * @param {Array<{role: string, content: string}>} messages - Chat messages
 * @param {Object} options - Generation options
 * @param {function} onToken - Callback for each token: ({content, done})
 * @returns {Promise<void>}
 */
export async function streamOllamaChat(
  modelName,
  messages,
  { temperature = 0.7, maxTokens = 4096 } = {},
  onToken = () => {},
  url = getOllamaUrl()
) {
  const response = await fetch(`${url}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: modelName,
      messages,
      stream: true,
      options: {
        temperature,
        num_predict: maxTokens,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ollama API error: ${error}`);
  }

  const reader = response.body.getReader();
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
          const data = JSON.parse(line);
          
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
            // Send final completion message with stats
            onToken({
              content: "",
              done: true,
              total_duration: data.total_duration,
              eval_count: data.eval_count,
              eval_duration: data.eval_duration,
            });
            break;
          }
        } catch {
          // Ignore invalid JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullText;
}

/**
 * Generate completion from Ollama (non-streaming)
 * @param {string} modelName - Model to use
 * @param {Array<{role: string, content: string}>} messages - Chat messages
 * @param {Object} options - Generation options
 * @returns {Promise<{text: string, eval_count: number, eval_duration: number}>}
 */
export async function generateOllamaChat(
  modelName,
  messages,
  options = {},
  url = getOllamaUrl()
) {
  let fullText = "";
  let evalCount = 0;
  let evalDuration = 0;

  await streamOllamaChat(
    modelName,
    messages,
    options,
    (data) => {
      fullText += data.content;
      if (data.eval_count) evalCount = data.eval_count;
      if (data.eval_duration) evalDuration = data.eval_duration;
    },
    url
  );

  return {
    text: fullText,
    eval_count: evalCount,
    eval_duration: evalDuration,
  };
}
