/**
 * Shared LLM engine singleton.
 *
 * Creates a single Web Worker for model inference, shared across
 * Chat, Actions, and any future consumer. The worker is created
 * lazily on first call to getEngine().
 *
 * Usage:
 *   import { getEngine } from "./lib/llm-engine.js";
 *   const engine = getEngine();
 *   engine.loadModel("onnx-community/Qwen3-0.6B-ONNX");
 *   engine.onMessage(handler);
 *   engine.generate(messages);
 *   const response = await engine.generateFull(messages);
 */

let _worker = null;
let _status = "idle"; // "idle" | "loading" | "ready" | "generating"
let _modelId = null;
let _listeners = new Set();

function ensureWorker() {
  if (!_worker) {
    _worker = new Worker(new URL("../worker.js", import.meta.url), {
      type: "module",
    });
    _worker.addEventListener("message", (e) => {
      const msg = e.data;

      // Track engine-level status
      if (msg.status === "loading") _status = "loading";
      if (msg.status === "ready") _status = "ready";
      if (msg.status === "start") _status = "generating";
      if (msg.status === "complete" || msg.status === "error") {
        _status = _modelId ? "ready" : "idle";
      }

      // Forward to all registered listeners
      for (const fn of _listeners) {
        try { fn(msg); } catch { /* listener error */ }
      }
    });
  }
  return _worker;
}

/**
 * Get the shared LLM engine.
 *
 * @returns {object} Engine API
 */
export function getEngine() {
  return {
    /** Check WebGPU availability. Response arrives via onMessage. */
    check() {
      ensureWorker().postMessage({ type: "check" });
    },

    /** Load a model by ID. Progress arrives via onMessage. */
    loadModel(modelId) {
      _modelId = modelId;
      _status = "loading";
      ensureWorker().postMessage({ type: "load", modelId });
    },

    /** Start streaming generation. Tokens arrive via onMessage. */
    generate(messages) {
      ensureWorker().postMessage({ type: "generate", data: messages });
    },

    /**
     * Run generation and collect the full response as a string.
     * Returns a Promise that resolves when generation completes.
     * Does NOT fire onMessage callbacks for token events.
     *
     * @param {Array<{role: string, content: string}>} messages
     * @returns {Promise<string>} The complete generated text
     */
    generateFull(messages) {
      return new Promise((resolve, reject) => {
        let output = "";
        let thinkingDone = false;

        const handler = (msg) => {
          switch (msg.status) {
            case "thinking":
              // Accumulate thinking but don't include in output
              break;
            case "thinking-done":
              thinkingDone = true;
              break;
            case "update":
              output += msg.output;
              break;
            case "complete":
              cleanup();
              resolve(output);
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

        // Temporarily add our own listener
        _listeners.add(handler);
        ensureWorker().postMessage({ type: "generate", data: messages });
      });
    },

    /** Interrupt current generation. */
    interrupt() {
      _worker?.postMessage({ type: "interrupt" });
    },

    /** Reset stopping criteria. */
    reset() {
      _worker?.postMessage({ type: "reset" });
    },

    /** Register a message listener. Returns unsubscribe function. */
    onMessage(fn) {
      _listeners.add(fn);
      return () => _listeners.delete(fn);
    },

    /** Remove a message listener. */
    offMessage(fn) {
      _listeners.delete(fn);
    },

    /** Current engine status. */
    get status() { return _status; },

    /** Whether a model is loaded and ready. */
    get isReady() { return _status === "ready"; },

    /** Whether generation is in progress. */
    get isGenerating() { return _status === "generating"; },

    /** Currently loaded model ID. */
    get modelId() { return _modelId; },

    /** Terminate the worker (cleanup). */
    terminate() {
      _worker?.terminate();
      _worker = null;
      _status = "idle";
      _modelId = null;
      _listeners.clear();
    },
  };
}
