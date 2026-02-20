/**
 * Cloud API LLM engine adapter.
 * 
 * Provides the same interface as llm-engine.js and ollama-engine.js
 * but uses external cloud APIs (OpenAI, Anthropic, xAI).
 */

import { streamApiChat, testApiConnection } from "./api-client.js";
import { getApiModelInfo } from "./api-models.js";

let _status = "idle"; // "idle" | "loading" | "ready" | "generating"
let _modelName = null;
let _provider = null;
let _listeners = new Set();
let _abortController = null;

function broadcast(msg) {
  for (const fn of _listeners) {
    try { fn(msg); } catch { /* listener error */ }
  }
}

export function getApiEngine(provider) {
  return {
    async check() {
      _status = "loading";
      _provider = provider;
      broadcast({ status: "loading", data: `Checking ${provider} connection...` });

      const { getApiKey } = await import("./api-client.js");
      const apiKey = await getApiKey(provider);

      if (!apiKey) {
        _status = "idle";
        broadcast({ 
          status: "error", 
          data: `${provider} API key not found. Please configure it in settings.` 
        });
        return;
      }

      const result = await testApiConnection(provider, apiKey);
      
      if (result.connected) {
        _status = "idle";
        broadcast({ 
          status: "ready", 
          data: { type: "api", provider } 
        });
      } else {
        _status = "idle";
        broadcast({ 
          status: "error", 
          data: `${provider} connection failed: ${result.error}` 
        });
      }
    },

    async loadModel(modelName) {
      _modelName = modelName;
      _provider = provider;
      _status = "loading";
      broadcast({ status: "loading", data: `Connecting to ${provider} model: ${modelName}...` });

      const { getApiKey } = await import("./api-client.js");
      const apiKey = await getApiKey(provider);

      if (!apiKey) {
        _status = "idle";
        _modelName = null;
        broadcast({ 
          status: "error", 
          data: `${provider} API key not configured.` 
        });
        return;
      }

      _status = "ready";
      broadcast({ status: "ready" });
    },

    async generate(messages, options = {}) {
      if (!_modelName || !_provider) {
        broadcast({ status: "error", data: "No model or provider selected" });
        return;
      }

      _status = "generating";
      broadcast({ status: "start", inputTokens: 0 });

      let tokenCount = 0;
      let startTime = performance.now();
      
      _abortController = new AbortController();

      try {
        await streamApiChat(
          _provider,
          _modelName,
          messages,
          { ...options, signal: _abortController.signal },
          (data) => {
            if (_abortController.signal.aborted) return;

            if (!data.done) {
              tokenCount++;
              const elapsed = performance.now() - startTime;
              const tps = elapsed > 0 ? (tokenCount / elapsed) * 1000 : 0;

              broadcast({
                status: "update",
                output: data.content,
                tps: Math.round(tps * 10) / 10,
                numTokens: tokenCount,
              });
            } else {
              _status = "ready";
              const elapsedSeconds = (performance.now() - startTime) / 1000;
              const finalTps = elapsedSeconds > 0 ? tokenCount / elapsedSeconds : null;
              
              broadcast({
                status: "complete",
                tps: finalTps !== null ? Math.round(finalTps * 10) / 10 : null,
                numTokens: data.outputTokens || tokenCount,
                inputTokens: data.inputTokens || 0,
              });
            }
          }
        );
      } catch (error) {
        if (_abortController.signal.aborted) {
          _status = "ready";
          broadcast({ status: "complete", tps: null, numTokens: tokenCount });
        } else {
          _status = "ready";
          broadcast({ status: "error", data: error.message });
        }
      } finally {
        _abortController = null;
      }
    },

    generateFull(messages, options, onToken) {
      return new Promise((resolve, reject) => {
        let output = "";
        let lastTps = null;
        let lastNumTokens = 0;
        let inputTokens = 0;

        const handler = (msg) => {
          switch (msg.status) {
            case "start":
              inputTokens = msg.inputTokens || 0;
              break;
            case "update":
              output += msg.output;
              lastTps = msg.tps ?? lastTps;
              lastNumTokens = msg.numTokens ?? lastNumTokens;
              if (onToken) {
                try { onToken({ tps: lastTps, numTokens: lastNumTokens, text: output }); } catch {}
              }
              break;
            case "complete":
              cleanup();
              resolve({ text: output, tps: lastTps, numTokens: lastNumTokens, inputTokens });
              break;
            case "error":
              cleanup();
              reject(new Error(msg.data));
              break;
          }
        };

        const cleanup = () => {
          _listeners.delete(handler);
        };

        _listeners.add(handler);
        this.generate(messages, options);
      });
    },

    interrupt() {
      if (_abortController) {
        _abortController.abort();
      }
    },

    reset() {
      if (_abortController) {
        _abortController.abort();
      }
    },

    onMessage(fn) {
      _listeners.add(fn);
      return () => _listeners.delete(fn);
    },

    offMessage(fn) {
      _listeners.delete(fn);
    },

    get status() { return _status; },
    get isReady() { return _status === "ready"; },
    get isGenerating() { return _status === "generating"; },
    get modelId() { return _modelName; },
    get backend() { return _provider; },

    terminate() {
      _status = "idle";
      _modelName = null;
      if (_abortController) _abortController.abort();
      _listeners.clear();
    },
  };
}
