/**
 * Ollama LLM engine adapter. Same interface as llm-engine but uses Ollama HTTP API.
 */

import {
  streamOllamaChat,
  testOllamaConnection,
  getOllamaUrl,
} from "./ollama-client.js";
import type { EngineStatus, EngineMessage } from "./core.js";

let _status: EngineStatus = "idle";
let _modelName: string | null = null;
const _listeners = new Set<(msg: EngineMessage) => void>();

function broadcast(msg: EngineMessage): void {
  for (const fn of _listeners) {
    try {
      fn(msg);
    } catch { /* no-op */ }
  }
}

export function getOllamaEngine() {
  return {
    async check(): Promise<void> {
      _status = "loading";
      broadcast({ status: "loading", data: "Testing Ollama connection..." });
      const result = await testOllamaConnection();
      if (result.connected) {
        _status = "idle";
        broadcast({
          status: "ready",
          data: { type: "ollama", version: result.version, url: getOllamaUrl() },
        });
      } else {
        _status = "idle";
        broadcast({
          status: "error",
          data: `Ollama not available: ${result.error}. Make sure Ollama is running.`,
        });
      }
    },

    async loadModel(modelName: string): Promise<void> {
      _modelName = modelName;
      _status = "loading";
      broadcast({
        status: "loading",
        data: `Connecting to Ollama model: ${modelName}...`,
      });
      const result = await testOllamaConnection();
      if (!result.connected) {
        _status = "idle";
        _modelName = null;
        broadcast({
          status: "error",
          data: `Ollama not available: ${result.error}`,
        });
        return;
      }
      _status = "ready";
      broadcast({ status: "ready" });
    },

    async generate(
      messages: { role: string; content?: string }[],
      options: Record<string, unknown> = {}
    ): Promise<void> {
      if (!_modelName) {
        broadcast({ status: "error", data: "No Ollama model selected" });
        return;
      }
      _status = "generating";
      broadcast({ status: "start", inputTokens: 0 });
      let tokenCount = 0;
      const startTime = performance.now();
      try {
        await streamOllamaChat(
          _modelName,
          messages,
          {
            temperature: (options.temperature as number) ?? 0.7,
            maxTokens: (options.maxTokens as number) ?? 4096,
          },
          (data) => {
            if (data.content) {
              tokenCount++;
              const elapsed = performance.now() - startTime;
              const tps =
                elapsed > 0 ? (tokenCount / elapsed) * 1000 : 0;
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
                tps:
                  data.eval_duration != null
                    ? Math.round(
                        (data.eval_count ?? 0) / (data.eval_duration / 1e9) * 10
                      ) / 10
                    : null,
                numTokens: data.eval_count ?? tokenCount,
              });
            }
          }
        );
      } catch (error) {
        _status = "ready";
        broadcast({
          status: "error",
          data: error instanceof Error ? error.message : String(error),
        });
      }
    },

    generateFull(
      messages: { role: string; content?: string }[],
      options: Record<string, unknown>,
      onToken?: (x: {
        tps: number | null;
        numTokens: number;
        text: string;
      }) => void
    ): Promise<{
      text: string;
      tps: number | null;
      numTokens: number;
      inputTokens: number;
    }> {
      return new Promise((resolve, reject) => {
        let output = "";
        let lastTps: number | null = null;
        let lastNumTokens = 0;
        let inputTokens = 0;
        const handler = (msg: EngineMessage) => {
          switch (msg.status) {
            case "start":
              inputTokens = (msg.inputTokens as number) ?? 0;
              break;
            case "update":
              output += (msg.output as string) ?? "";
              lastTps = (msg.tps as number) ?? lastTps;
              lastNumTokens = (msg.numTokens as number) ?? lastNumTokens;
              if (onToken) {
                try {
                  onToken({
                    tps: lastTps,
                    numTokens: lastNumTokens,
                    text: output,
                  });
                } catch { /* no-op */ }
              }
              break;
            case "complete":
              _listeners.delete(handler);
              resolve({
                text: output,
                tps: lastTps,
                numTokens: lastNumTokens,
                inputTokens,
              });
              break;
            case "error":
              _listeners.delete(handler);
              reject(new Error((msg.data as string) ?? "Unknown error"));
              break;
          }
        };
        _listeners.add(handler);
        this.generate(messages, options);
      });
    },

    interrupt(): void {
      console.warn("Ollama doesn't support generation interruption");
    },

    reset(): void {},

    onMessage(fn: (msg: EngineMessage) => void): () => void {
      _listeners.add(fn);
      return () => _listeners.delete(fn);
    },

    offMessage(fn: (msg: EngineMessage) => void): void {
      _listeners.delete(fn);
    },

    get status(): EngineStatus {
      return _status;
    },
    get isReady(): boolean {
      return _status === "ready";
    },
    get isGenerating(): boolean {
      return _status === "generating";
    },
    get modelId(): string | null {
      return _modelName;
    },
    get backend(): "ollama" {
      return "ollama";
    },
    terminate(): void {
      _status = "idle";
      _modelName = null;
      _listeners.clear();
    },
  };
}
