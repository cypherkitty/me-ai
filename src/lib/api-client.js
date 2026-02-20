import { getSetting } from "./store/settings.js";

/**
 * Get the API key for a specific provider from settings
 */
export async function getApiKey(provider) {
  return await getSetting(`${provider}ApiKey`);
}

/**
 * Test API connection by making a minimal request
 */
export async function testApiConnection(provider, apiKey) {
  if (!apiKey) return { connected: false, error: "API key is required" };

  try {
    let url, headers;

    if (provider === "openai" || provider === "xai") {
      url = provider === "openai" ? "https://api.openai.com/v1/models" : "https://api.x.ai/v1/models";
      headers = {
        "Authorization": `Bearer ${apiKey}`
      };
      
      const res = await fetch(url, { method: "GET", headers, signal: AbortSignal.timeout(5000) });
      if (!res.ok) {
        const errorText = await res.text();
        return { connected: false, error: `HTTP ${res.status}: ${errorText}` };
      }
      return { connected: true };
    } else if (provider === "anthropic") {
      // Anthropic doesn't have a simple /models endpoint, so we make a minimal invalid request that checks auth
      url = "https://api.anthropic.com/v1/messages";
      headers = {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerously-allow-browser": "true",
        "content-type": "application/json"
      };
      const body = JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 1,
        messages: [{ role: "user", content: "test" }]
      });

      const res = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(5000) });
      if (!res.ok) {
        const errorText = await res.text();
        // If it's a 401/403, it failed auth
        if (res.status === 401 || res.status === 403) {
          return { connected: false, error: `HTTP ${res.status}: ${errorText}` };
        }
        // If it's a 400 about billing, it connected but failed
        if (res.status === 400) {
           // still connected successfully, just a bad request
        }
      }
      return { connected: true };
    }
    
    return { connected: false, error: "Unknown provider" };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

/**
 * Stream chat completion from cloud APIs
 */
export async function streamApiChat(
  provider,
  modelName,
  messages,
  { temperature = 0.7, maxTokens = 4096, signal } = {},
  onToken = () => {}
) {
  const apiKey = await getApiKey(provider);
  if (!apiKey) {
    throw new Error(`No API key configured for ${provider}. Please check your settings.`);
  }

  let url, headers, body;

  if (provider === "openai" || provider === "xai") {
    url = provider === "openai" 
      ? "https://api.openai.com/v1/chat/completions" 
      : "https://api.x.ai/v1/chat/completions";
    
    // xAI and OpenAI share the same API format
    headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };

    // Extract system prompt if present
    const systemMsg = messages.find(m => m.role === "system");
    const otherMsgs = messages.filter(m => m.role !== "system");
    
    const o1Family = modelName.startsWith("o1") || modelName.startsWith("o3");
    
    body = JSON.stringify({
      model: modelName,
      messages: systemMsg ? [systemMsg, ...otherMsgs] : otherMsgs,
      // o1 models don't support temperature
      temperature: o1Family ? 1 : temperature,
      // Use max_completion_tokens for o1/o3, max_tokens for others
      max_completion_tokens: maxTokens,
      stream: true
    });

  } else if (provider === "anthropic") {
    url = "https://api.anthropic.com/v1/messages";
    headers = {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerously-allow-browser": "true",
      "content-type": "application/json"
    };

    const systemMsg = messages.find(m => m.role === "system");
    const otherMsgs = messages.filter(m => m.role !== "system");

    // Anthropic's system prompt must be a string, and messages cannot contain 'system' role
    body = JSON.stringify({
      model: modelName,
      system: systemMsg ? systemMsg.content : undefined,
      messages: otherMsgs,
      temperature,
      max_tokens: maxTokens,
      stream: true
    });
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
    signal
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${provider} API error: ${error}`);
  }

  const reader = response.body.getReader();
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
      pendingBuffer = lines.pop() || ""; // keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;
        
        const dataStr = trimmed.slice(5).trim();
        if (dataStr === "[DONE]") {
           break;
        }

        try {
          const data = JSON.parse(dataStr);
          
          if (provider === "openai" || provider === "xai") {
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              outputTokens++;
              onToken({ content, done: false });
            }
            if (data.usage) {
              inputTokens = data.usage.prompt_tokens || 0;
              outputTokens = data.usage.completion_tokens || outputTokens;
            }
          } else if (provider === "anthropic") {
            if (data.type === "message_start") {
              inputTokens = data.message?.usage?.input_tokens || 0;
            } else if (data.type === "content_block_delta" && data.delta?.text) {
              outputTokens++;
              onToken({ content: data.delta.text, done: false });
            } else if (data.type === "message_delta" && data.usage) {
              outputTokens = data.usage.output_tokens || outputTokens;
            }
          }
        } catch (e) {
          // ignore parsing errors on incomplete JSON chunks
        }
      }
    }
    
    // Final token callback to signal completion and pass stats
    onToken({
      content: "",
      done: true,
      inputTokens,
      outputTokens
    });
  } finally {
    reader.releaseLock();
  }
}
