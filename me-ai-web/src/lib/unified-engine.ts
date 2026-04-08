/**
 * Unified LLM engine that supports WebGPU, Ollama, and cloud API backends.
 */

import { getEngine as getWebGPUEngine } from "./llm-engine.js";
import { getCore } from "./store/core-store.js";
import type {
  ApiProvider,
  Backend,
  ChatMessage,
  EngineMessage,
  EngineStatus,
  GenerateFullResult,
} from "./core.js";
import { OllamaLlmEngine } from "./core.js";

type GenerateOptions = {
  maxTokens?: number;
  enableThinking?: boolean;
  temperature?: number;
  [key: string]: unknown;
};

type TokenUpdate = Omit<GenerateFullResult, "inputTokens">;

type Engine = {
  loadModel: (modelId: string, options?: Record<string, unknown>) => void;
  check: () => void;
  generate: (messages: ChatMessage[], options?: GenerateOptions) => void;
  generateFull: (
    messages: ChatMessage[],
    options: GenerateOptions,
    onToken?: (x: TokenUpdate) => void
  ) => Promise<GenerateFullResult>;
  clearCache?: (modelId: string | null) => Promise<void>;
  interrupt: () => void;
  reset: () => void;
  onMessage: (fn: (msg: EngineMessage) => void) => () => void;
  offMessage: (fn: (msg: EngineMessage) => void) => void;
  status: string;
  isReady: boolean;
  isGenerating: boolean;
  modelId: string | null;
  backend: string;
  terminate: () => void;
};

let _currentBackend: Backend | null = null;
let _currentEngine: Engine | null = null;
const _unifiedListeners = new Set<(msg: EngineMessage) => void>();

function detectBackend(modelId: string): Backend {
  if (modelId.startsWith("onnx-community/") || modelId.startsWith("microsoft/")) {
    return "webgpu";
  }
  const apiModel = getCore().getApiModelInfo(modelId);
  if (apiModel) return apiModel.provider as Backend;
  return "ollama";
}

/**
 * Cloud API engine: listener/abort/TPS in the browser; HTTP and keys in me-ai-core (`streamChat` loads keys from Rexie).
 */
function createCloudApiEngine(provider: ApiProvider) {
  let _status: EngineStatus = "idle";
  let _modelId: string | null = null;
  let _modelName: string | null = null;
  let _prov: ApiProvider | null = null;
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

  return {
    async check(): Promise<void> {
      _status = "loading";
      _prov = provider;
      broadcast({ status: "loading", data: `Checking ${provider} connection...` });
      const apiKey = (await getCore().getApiKeyForProvider(provider)) ?? null;
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
      _prov = provider;
      _status = "loading";
      broadcast({
        status: "loading",
        data: `Connecting to ${provider} model: ${providerModelName}...`,
      });
      const apiKey = (await getCore().getApiKeyForProvider(provider)) ?? null;
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
      if (!_modelName || !_prov) {
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
          _prov,
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
        void this.generate(messages, options);
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
      return _modelId;
    },
    get backend(): ApiProvider | null {
      return _prov;
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

/**
 * Thin adapter: WASM [`OllamaLlmEngine`] fans out `EngineMessage` to multiple TS listeners.
 */
function createOllamaEngine() {
  const wasm = new OllamaLlmEngine();
  const listeners = new Set<(msg: EngineMessage) => void>();
  wasm.setOnMessage((msg: EngineMessage) => {
    for (const fn of listeners) {
      try {
        fn(msg);
      } catch {
        /* no-op */
      }
    }
  });
  const core = getCore();

  return {
    check(): void {
      void wasm.check(core);
    },

    loadModel(modelId: string): void {
      void wasm.loadModel(core, modelId);
    },

    generate(messages: ChatMessage[], options: GenerateOptions = {}): void {
      void wasm.generate(core, messages, options);
    },

    generateFull(
      messages: ChatMessage[],
      options: GenerateOptions,
      onToken?: (x: { tps: number | null; numTokens: number; text: string }) => void
    ): Promise<GenerateFullResult> {
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
              listeners.delete(handler);
              resolve({
                text: output,
                tps: lastTps,
                numTokens: lastNumTokens,
                inputTokens,
              });
              break;
            case "error":
              listeners.delete(handler);
              reject(new Error((msg.data as string) ?? "Unknown error"));
              break;
          }
        };
        listeners.add(handler);
        void wasm.generate(core, messages, options);
      });
    },

    interrupt(): void {
      wasm.interrupt();
    },

    reset(): void {
      wasm.reset();
    },

    onMessage(fn: (msg: EngineMessage) => void): () => void {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    offMessage(fn: (msg: EngineMessage) => void): void {
      listeners.delete(fn);
    },

    get status(): EngineStatus {
      return wasm.status as EngineStatus;
    },
    get isReady(): boolean {
      return wasm.isReady;
    },
    get isGenerating(): boolean {
      return wasm.isGenerating;
    },
    get modelId(): string | null {
      return wasm.modelId ?? null;
    },
    get backend(): "ollama" {
      return "ollama";
    },

    terminate(): void {
      wasm.terminate();
      listeners.clear();
    },
  };
}

export function getUnifiedEngine() {
  return {
    loadModel(modelId: string, options: Record<string, unknown> = {}): void {
      const backend = detectBackend(modelId);
      if (_currentBackend !== backend) {
        if (_currentEngine) _currentEngine.terminate();
        _currentBackend = backend;
        if (backend === "webgpu") {
          _currentEngine = getWebGPUEngine() as unknown as Engine;
        } else if (backend === "ollama") {
          _currentEngine = createOllamaEngine() as Engine;
        } else {
          _currentEngine = createCloudApiEngine(backend as ApiProvider) as Engine;
        }
        for (const fn of _unifiedListeners) {
          _currentEngine.onMessage(fn);
        }
      }
      _currentEngine!.loadModel(modelId, options);
    },

    check(): void {
      if (!_currentEngine) {
        _currentEngine = getWebGPUEngine() as unknown as Engine;
        _currentBackend = "webgpu";
      }
      _currentEngine.check();
    },

    generate(messages: ChatMessage[], options?: GenerateOptions): void {
      if (!_currentEngine) throw new Error("No engine loaded. Call loadModel() first.");
      _currentEngine.generate(messages, options);
    },

    generateFull(
      messages: ChatMessage[],
      options: GenerateOptions,
      onToken?: (x: TokenUpdate) => void
    ): Promise<GenerateFullResult> {
      if (!_currentEngine)
        return Promise.reject(new Error("No engine loaded. Call loadModel() first."));
      return _currentEngine.generateFull(messages, options, onToken);
    },

    clearCache(modelId: string | null): Promise<void> {
      if (_currentBackend === "webgpu" && _currentEngine?.clearCache) {
        return _currentEngine.clearCache(modelId);
      }
      return Promise.resolve();
    },

    interrupt(): void {
      _currentEngine?.interrupt();
    },

    reset(): void {
      _currentEngine?.reset();
    },

    onMessage(fn: (msg: EngineMessage) => void): () => void {
      if (!_currentEngine) {
        _currentEngine = getWebGPUEngine() as unknown as Engine;
        _currentBackend = "webgpu";
      }
      _unifiedListeners.add(fn);
      return _currentEngine.onMessage(fn);
    },

    offMessage(fn: (msg: EngineMessage) => void): void {
      _unifiedListeners.delete(fn);
      _currentEngine?.offMessage(fn);
    },

    get status(): string {
      return _currentEngine?.status ?? "idle";
    },
    get isReady(): boolean {
      return _currentEngine?.isReady ?? false;
    },
    get isGenerating(): boolean {
      return _currentEngine?.isGenerating ?? false;
    },
    get modelId(): string | null {
      return _currentEngine?.modelId ?? null;
    },
    get backend(): Backend | null {
      return _currentBackend;
    },

    getModelInfo() {
      const modelId = this.modelId;
      if (!modelId) return null;
      const c = getCore();
      if (_currentBackend === "webgpu") return c.getOnnxModelInfo(modelId);
      if (_currentBackend === "ollama") return c.getOllamaModelInfo(modelId);
      return c.getApiModelInfo(modelId);
    },

    terminate(): void {
      _currentEngine?.terminate();
      _currentEngine = null;
      _currentBackend = null;
    },
  };
}
