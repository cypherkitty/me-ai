/**
 * Ollama LLM engine adapter.
 * 
 * Provides the same interface as llm-engine.js but uses Ollama HTTP API
 * instead of WebGPU worker. This allows seamless switching between
 * local browser inference (WebGPU) and local Ollama server.
 */

import { streamOllamaChat, testOllamaConnection, getOllamaUrl } from "./ollama-client.js";
import { getOllamaModelInfo } from "./ollama-models.js";

let _status = "idle"; // "idle" | "loading" | "ready" | "generating"
let _modelName = null;
let _listeners = new Set();

/**
 * Broadcast message to all listeners
 */
function broadcast(msg) {
  for (const fn of _listeners) {
    try { fn(msg); } catch { /* listener error */ }
  }
}

/**
 * Get the Ollama engine instance.
 * 
 * Mimics the WebGPU engine interface for seamless integration.
 */
export function getOllamaEngine() {
  return {
    /** Test Ollama server connection */
    async check() {
      _status = "loading";
      broadcast({ status: "loading", data: "Testing Ollama connection..." });

      const result = await testOllamaConnection();
      
      if (result.connected) {
        _status = "idle";
        broadcast({ 
          status: "ready", 
          data: { 
            type: "ollama", 
            version: result.version,
            url: getOllamaUrl() 
          } 
        });
      } else {
        _status = "idle";
        broadcast({ 
          status: "error", 
          data: `Ollama not available: ${result.error}. Make sure Ollama is running.` 
        });
      }
    },

    /** "Load" a model (for Ollama, this just validates model name) */
    async loadModel(modelName) {
      _modelName = modelName;
      _status = "loading";
      broadcast({ status: "loading", data: `Connecting to Ollama model: ${modelName}...` });

      // Test connection and validate model
      const result = await testOllamaConnection();
      
      if (!result.connected) {
        _status = "idle";
        _modelName = null;
        broadcast({ 
          status: "error", 
          data: `Ollama not available: ${result.error}` 
        });
        return;
      }

      // Model will be pulled on-demand if not available
      _status = "ready";
      broadcast({ status: "ready" });
    },

    /**
     * Start streaming generation via Ollama API
     */
    async generate(messages, options = {}) {
      if (!_modelName) {
        broadcast({ status: "error", data: "No Ollama model selected" });
        return;
      }

      _status = "generating";
      broadcast({ status: "start", inputTokens: 0 }); // Ollama doesn't report input tokens upfront

      let tokenCount = 0;
      let startTime = performance.now();

      try {
        await streamOllamaChat(
          _modelName,
          messages,
          { 
            temperature: options.temperature ?? 0.7, 
            maxTokens: options.maxTokens ?? 4096 
          },
          (data) => {
            if (data.content) {
              tokenCount++;
              const elapsed = performance.now() - startTime;
              const tps = elapsed > 0 ? (tokenCount / elapsed) * 1000 : 0;

              broadcast({
                status: "update",
                output: data.content,
                tps: Math.round(tps * 10) / 10,
                numTokens: tokenCount,
              });
            }

            if (data.done) {
              _status = "ready";
              broadcast({
                status: "complete",
                tps: data.eval_duration 
                  ? Math.round((data.eval_count / (data.eval_duration / 1e9)) * 10) / 10
                  : null,
                numTokens: data.eval_count || tokenCount,
              });
            }
          }
        );
      } catch (error) {
        _status = "ready";
        broadcast({ status: "error", data: error.message });
      }
    },

    /**
     * Run generation and collect the full response with stats
     */
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
                try { onToken({ tps: lastTps, numTokens: lastNumTokens }); } catch {}
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

    /** Interrupt current generation (not supported for Ollama, will cancel on next token) */
    interrupt() {
      // Ollama doesn't support interruption mid-stream
      console.warn("Ollama doesn't support generation interruption");
    },

    /** Reset (no-op for Ollama) */
    reset() {
      // No-op for Ollama
    },

    /** Register a message listener */
    onMessage(fn) {
      _listeners.add(fn);
      return () => _listeners.delete(fn);
    },

    /** Remove a message listener */
    offMessage(fn) {
      _listeners.delete(fn);
    },

    /** Current engine status */
    get status() { return _status; },

    /** Whether a model is loaded and ready */
    get isReady() { return _status === "ready"; },

    /** Whether generation is in progress */
    get isGenerating() { return _status === "generating"; },

    /** Currently loaded model name */
    get modelId() { return _modelName; },

    /** Backend type */
    get backend() { return "ollama"; },

    /** Cleanup (no worker to terminate) */
    terminate() {
      _status = "idle";
      _modelName = null;
      _listeners.clear();
    },
  };
}
