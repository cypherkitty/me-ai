/**
 * Cloud API LLM engine adapter.
 * Delegates streaming to Rust WASM core; keeps engine state & listener pattern in TS.
 */

import { getCore } from "./store/core-store.js";
import type { ApiProvider, EngineStatus, EngineMessage } from "./core.js";

let _status: EngineStatus = "idle";
let _modelId: string | null = null;
let _modelName: string | null = null;
let _provider: ApiProvider | null = null;
const _listeners = new Set<(msg: EngineMessage) => void>();
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
      const _sv1 = await getCore().loadSettings();
      const apiKey =
        (provider === "openai"
          ? _sv1.openaiApiKey
          : provider === "anthropic"
            ? _sv1.anthropicApiKey
            : provider === "google"
              ? _sv1.googleApiKey
              : _sv1.xaiApiKey) ?? null;
      if (!apiKey) {
        _status = "idle";
        broadcast({
          status: "error",
          data: `${provider} API key not found. Please configure it in settings.`,
        });
        return;
      }
      try {
        const ok = await getCore().testApiConnection(provider, apiKey);
        if (ok) {
          _status = "idle";
          broadcast({ status: "ready", data: { type: "api", provider } });
        } else {
          _status = "idle";
          broadcast({
            status: "error",
            data: `${provider} connection failed.`,
          });
        }
      } catch (e) {
        _status = "idle";
        broadcast({
          status: "error",
          data: `${provider} connection failed: ${e instanceof Error ? e.message : String(e)}`,
        });
      }
    },

    async loadModel(modelId: string): Promise<void> {
      const info = getCore().getApiModelInfo(modelId) as { name?: string } | null;
      const providerModelName = info?.name ?? modelId;
      _modelId = modelId;
      _modelName = providerModelName;
      _provider = provider;
      _status = "loading";
      broadcast({
        status: "loading",
        data: `Connecting to ${provider} model: ${providerModelName}...`,
      });
      const _sv2 = await getCore().loadSettings();
      const apiKey =
        (provider === "openai"
          ? _sv2.openaiApiKey
          : provider === "anthropic"
            ? _sv2.anthropicApiKey
            : provider === "google"
              ? _sv2.googleApiKey
              : _sv2.xaiApiKey) ?? null;
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
      messages: { role: string; content: string }[],
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
        const modelInfo = _modelId
          ? (getCore().getApiModelInfo(_modelId) as { reasoningEffort?: string } | null)
          : null;

        const streamOpts = {
          temperature: (options.temperature as number | undefined) ?? 0.7,
          maxTokens: (options.maxTokens as number | undefined) ?? 4096,
          reasoningEffort: modelInfo?.reasoningEffort,
        };

        const chatMessages = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        await getCore().streamChat(
          _provider,
          _modelName,
          chatMessages,
          streamOpts,
          (data: { content: string; done: boolean; inputTokens: number; outputTokens: number }) => {
            if (_abortController?.signal.aborted) return;
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
      messages: { role: string; content: string }[],
      options: Record<string, unknown>,
      onToken?: (x: { tps: number | null; numTokens: number; text: string }) => void
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
                } catch {
                  /* no-op */
                }
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
