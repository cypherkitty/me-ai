/**
 * Shared LLM engine singleton — WebGPU via a dedicated Web Worker.
 *
 * Inference runs in a Worker (not a Service Worker) because the transformers
 * library uses dynamic import(), which is disallowed in ServiceWorkerGlobalScope.
 * The worker is created lazily on first call to getEngine().
 *
 * Usage:
 *   import { getEngine } from "./lib/llm-engine.js";
 *   const engine = getEngine();
 *   engine.loadModel("onnx-community/Qwen3-0.6B-ONNX");
 *   engine.onMessage(handler);
 *   engine.generate(messages);
 *   const { text, tps, numTokens, inputTokens } = await engine.generateFull(messages);
 */

interface WorkerMessage {
  status: string;
  data?: string;
  modelId?: string | null;
  loaded?: boolean;
  phase?: string;
  output?: string;
  content?: string;
  tps?: number | null;
  numTokens?: number;
  inputTokens?: number;
  file?: string;
  progress?: number;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface WorkerHandle {
  postMessage: (msg: object, transfer?: Transferable[]) => void;
  terminate: () => void;
}

type Listener = (msg: WorkerMessage) => void;

let _workerPromise: Promise<WorkerHandle> | null = null;
let _status: "idle" | "loading" | "ready" | "generating" = "idle";
let _modelId: string | null = null;
let _listeners = new Set<Listener>();

/**
 * Ensures the dedicated Worker is created and returns an interface to talk to it.
 */
function ensureWorker(): Promise<WorkerHandle> {
  if (typeof Worker === "undefined") {
    return Promise.reject(new Error("Web Workers are not supported in this environment"));
  }

  if (!_workerPromise) {
    _workerPromise = (async () => {
      const worker = new Worker(
        new URL("../llm-worker.js", import.meta.url),
        { type: "module" },
      );

      worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        const msg = e.data;

        if (msg.status === "loading") _status = "loading";
        if (msg.status === "ready") _status = "ready";
        if (msg.status === "start") _status = "generating";
        if (msg.status === "complete" || msg.status === "error") {
          _status = _modelId ? "ready" : "idle";
        }

        if (msg.status === "status-report") {
          if (msg.loaded && msg.modelId) {
            _modelId = msg.modelId;
            _status = "ready";
            for (const fn of _listeners) {
              try { fn({ status: "ready", _recovered: true }); } catch { /* listener error */ }
            }
          }
          return;
        }

        for (const fn of _listeners) {
          try { fn(msg); } catch { /* listener error */ }
        }
      };

      const handle: WorkerHandle = {
        postMessage: (msg: object, transfer: Transferable[] = []) => {
          worker.postMessage(msg, transfer);
        },
        terminate: () => {
          worker.terminate();
        },
      };

      handle.postMessage({ type: "getStatus" });
      return handle;
    })();
  }

  return _workerPromise;
}

export interface GenerateFullResult {
  text: string;
  tps: number | null;
  numTokens: number;
  inputTokens: number;
}

/**
 * Get the shared LLM engine.
 */
export function getEngine() {
  return {
    async check() {
      try {
        const w = await ensureWorker();
        w.postMessage({ type: "check" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        for (const fn of _listeners) fn({ status: "error", data: `Worker init failed: ${msg}` });
      }
    },

    async loadModel(modelId: string, options: { dtype?: string; device?: string } = {}) {
      _status = "loading";
      try {
        // When switching to a different model, terminate the current worker so the browser
        // reclaims all WebGPU/WASM memory. Otherwise the old model's resources often stay
        // allocated (dispose() doesn't free everything), causing a memory leak.
        if (_workerPromise && _modelId != null && _modelId !== modelId) {
          try {
            const w = await _workerPromise;
            w.terminate();
          } catch { /* ignore */ }
          _workerPromise = null;
          _modelId = null;
        }
        _modelId = modelId;
        const w = await ensureWorker();
        w.postMessage({ type: "load", modelId, options });
      } catch (err) {
        _status = "idle";
        _modelId = null;
        const msg = err instanceof Error ? err.message : String(err);
        for (const fn of _listeners) fn({ status: "error", data: `Worker init failed: ${msg}` });
      }
    },

    async generate(
      messages: Array<{ role: string; content: string }>,
      options?: {
        maxTokens?: number;
        enableThinking?: boolean;
        do_sample?: boolean;
        temperature?: number;
        top_p?: number;
        top_k?: number;
        repetition_penalty?: number;
      },
    ) {
      try {
        const w = await ensureWorker();
        w.postMessage({ type: "generate", data: messages, options });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        for (const fn of _listeners) fn({ status: "error", data: `Worker init failed: ${msg}` });
      }
    },

    generateFull(
      messages: Array<{ role: string; content: string }>,
      options?: {
        maxTokens?: number;
        enableThinking?: boolean;
        do_sample?: boolean;
        temperature?: number;
        top_p?: number;
        top_k?: number;
        repetition_penalty?: number;
      },
      onToken?: (info: { tps: number | null; numTokens: number; text: string }) => void,
    ): Promise<GenerateFullResult> {
      return new Promise((resolve, reject) => {
        let output = "";
        let lastTps: number | null = null;
        let lastNumTokens = 0;
        let inputTokens = 0;

        const handler: Listener = (msg) => {
          switch (msg.status) {
            case "start":
              inputTokens = msg.inputTokens || 0;
              break;
            case "thinking":
            case "thinking-done":
              break;
            case "update":
              output += msg.output ?? "";
              lastTps = msg.tps ?? lastTps;
              lastNumTokens = msg.numTokens ?? lastNumTokens;
              if (onToken) {
                try { onToken({ tps: lastTps, numTokens: lastNumTokens, text: output }); } catch { }
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

        const cleanup = () => _listeners.delete(handler);
        _listeners.add(handler);

        ensureWorker().then((w) => {
          w.postMessage({ type: "generate", data: messages, options });
        }).catch((err) => {
          cleanup();
          reject(err);
        });
      });
    },

    clearCache(modelId: string | null): Promise<void> {
      return new Promise((resolve, reject) => {
        const handler: Listener = (msg) => {
          if (msg.status === "cacheCleared") {
            _listeners.delete(handler);
            resolve();
          }
        };
        _listeners.add(handler);

        ensureWorker().then((w) => {
          w.postMessage({ type: "clearCache", modelId });
        }).catch(reject);
      });
    },

    async interrupt() {
      if (!_workerPromise) return;
      const w = await _workerPromise;
      w.postMessage({ type: "interrupt" });
    },

    async reset() {
      if (!_workerPromise) return;
      const w = await _workerPromise;
      w.postMessage({ type: "reset" });
    },

    onMessage(fn: Listener): () => void {
      _listeners.add(fn);
      return () => _listeners.delete(fn);
    },

    offMessage(fn: Listener) {
      _listeners.delete(fn);
    },

    get status() { return _status; },
    get isReady() { return _status === "ready"; },
    get isGenerating() { return _status === "generating"; },
    get modelId() { return _modelId; },

    async terminate() {
      if (_workerPromise) {
        try {
          const w = await _workerPromise;
          w.terminate();
        } catch { /* ignore */ }
      }
      _workerPromise = null;
      _status = "idle";
      _modelId = null;
      _listeners.clear();
    },
  };
}
