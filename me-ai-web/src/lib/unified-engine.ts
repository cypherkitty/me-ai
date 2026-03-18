/**
 * Unified LLM engine that supports WebGPU, Ollama, and cloud API backends.
 */

import { getEngine as getWebGPUEngine } from "./llm-engine.js";
import { getOllamaEngine } from "./ollama-engine.js";
import { getApiEngine } from "./api-engine.js";
import { getCore } from "./store/core-store.js";
import type { Backend, ChatMessage, GenerateFullResult, EngineMessage } from "./core.js";

type GenerateOptions = { maxTokens?: number; enableThinking?: boolean; temperature?: number; [key: string]: unknown };

type TokenUpdate = Omit<GenerateFullResult, 'inputTokens'>;

type Engine = {
  loadModel: (modelId: string, options?: Record<string, unknown>) => void;
  check: () => void;
  generate: (messages: ChatMessage[], options?: GenerateOptions) => void;
  generateFull: (messages: ChatMessage[], options: GenerateOptions, onToken?: (x: TokenUpdate) => void) => Promise<GenerateFullResult>;
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
          _currentEngine = getOllamaEngine() as Engine;
        } else {
          _currentEngine = getApiEngine(backend) as Engine;
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
