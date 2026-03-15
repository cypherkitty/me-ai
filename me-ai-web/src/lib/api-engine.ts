/**
 * Cloud API LLM engine adapter.
 * Provides the same interface as llm-engine and ollama-engine but uses external cloud APIs.
 */

import type { ApiProvider } from "./api-client.js";
import { streamApiChat, testApiConnection, getApiKey } from "./api-client.js";
import { getApiModelInfo } from "./api-models.js";

type Status = "idle" | "loading" | "ready" | "generating";
type EngineMessage = Record<string, unknown>;

let _status: Status = "idle";
let _modelId: string | null = null;
let _modelName: string | null = null;
let _provider: ApiProvider | null = null;
let _listeners = new Set<(msg: EngineMessage) => void>();
let _abortController: AbortController | null = null;

function broadcast(msg: EngineMessage): void {
  for (const fn of _listeners) {
    try {
      fn(msg);
    } catch {
      /* listener error */
    }
  }
}

export function getApiEngine(provider: ApiProvider) {
  return {
    async check(): Promise<void> {
      _status = "loading";
      _provider = provider;
      broadcast({ status: "loading", data: `Checking ${provider} connection...` });
      const apiKey = await getApiKey(provider);
      if (!apiKey) {
        _status = "idle";
        broadcast({
          status: "error",
          data: `${provider} API key not found. Please configure it in settings.`,
        });
        return;
      }
      const result = await testApiConnection(provider, apiKey);
      if (result.connected) {
        _status = "idle";
        broadcast({ status: "ready", data: { type: "api", provider } });
      } else {
        _status = "idle";
        broadcast({
          status: "error",
          data: `${provider} connection failed: ${result.error}`,
        });
      }
    },

    async loadModel(modelId: string): Promise<void> {
      // Map UI model id -> provider model name (e.g. "gpt-5.4-low" -> "gpt-5.4")
      const info = getApiModelInfo(modelId);
      const providerModelName = (info?.name as string | undefined) ?? modelId;
      _modelId = modelId;
      _modelName = providerModelName;
      _provider = provider;
      _status = "loading";
      broadcast({
        status: "loading",
        data: `Connecting to ${provider} model: ${providerModelName}...`,
      });
      const apiKey = await getApiKey(provider);
      if (!apiKey) {
        _status = "idle";
        _modelId = null;
        _modelName = null;
        broadcast({
          status: "error",
          data: `${provider} API key not configured.`,
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
      if (!_modelName || !_provider) {
        broadcast({ status: "error", data: "No model or provider selected" });
        return;
      }
      _status = "generating";
      broadcast({ status: "start", inputTokens: 0 });
      let tokenCount = 0;
      const startTime = performance.now();
      _abortController = new AbortController();
      try {
        const modelInfo = _modelId ? getApiModelInfo(_modelId) : null;
        await streamApiChat(
          _provider,
          _modelName,
          messages,
          { ...options, reasoningEffort: modelInfo?.reasoningEffort, signal: _abortController.signal },
          (data) => {
            if (_abortController!.signal.aborted) return;
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
              const finalTps =
                elapsedSeconds > 0 ? tokenCount / elapsedSeconds : null;
              broadcast({
                status: "complete",
                tps:
                  finalTps !== null ? Math.round(finalTps * 10) / 10 : null,
                numTokens: data.outputTokens ?? tokenCount,
                inputTokens: data.inputTokens ?? 0,
              });
            }
          }
        );
      } catch (error) {
        if (_abortController?.signal.aborted) {
          _status = "ready";
          broadcast({ status: "complete", tps: null, numTokens: tokenCount });
        } else {
          _status = "ready";
          broadcast({
            status: "error",
            data: error instanceof Error ? error.message : String(error),
          });
        }
      } finally {
        _abortController = null;
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
                } catch {}
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
      if (_abortController) _abortController.abort();
    },

    reset(): void {
      if (_abortController) _abortController.abort();
    },

    onMessage(fn: (msg: EngineMessage) => void): () => void {
      _listeners.add(fn);
      return () => _listeners.delete(fn);
    },

    offMessage(fn: (msg: EngineMessage) => void): void {
      _listeners.delete(fn);
    },

    get status(): Status {
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
    get backend(): ApiProvider | null {
      return _provider;
    },

    terminate(): void {
      _status = "idle";
      _modelId = null;
      _modelName = null;
      if (_abortController) _abortController.abort();
      _listeners.clear();
    },
  };
}
