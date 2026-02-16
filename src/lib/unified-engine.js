/**
 * Unified LLM engine that supports both WebGPU and Ollama backends.
 * 
 * Automatically switches between engines based on model ID:
 * - Models starting with "onnx-community/" or "microsoft/" use WebGPU
 * - Other models use Ollama
 * 
 * Provides a consistent interface regardless of backend.
 */

import { getEngine as getWebGPUEngine } from "./llm-engine.js";
import { getOllamaEngine } from "./ollama-engine.js";
import { getModelInfo } from "./models.js";
import { getOllamaModelInfo } from "./ollama-models.js";

let _currentBackend = null; // "webgpu" | "ollama"
let _currentEngine = null;
let _unifiedListeners = new Set(); // Listeners that should work across backends

/**
 * Determine backend from model ID
 */
function detectBackend(modelId) {
  if (modelId.startsWith("onnx-community/") || modelId.startsWith("microsoft/")) {
    return "webgpu";
  }
  return "ollama";
}

/**
 * Get the unified engine instance
 */
export function getUnifiedEngine() {
  return {
    /**
     * Load a model and automatically switch backend if needed
     */
    loadModel(modelId) {
      const backend = detectBackend(modelId);
      
      // Switch backend if needed
      if (_currentBackend !== backend) {
        // Cleanup old engine
        if (_currentEngine) {
          _currentEngine.terminate();
        }
        
        // Create new engine
        _currentBackend = backend;
        _currentEngine = backend === "webgpu" ? getWebGPUEngine() : getOllamaEngine();
        
        // Re-attach all unified listeners to the new engine
        for (const fn of _unifiedListeners) {
          _currentEngine.onMessage(fn);
        }
      }
      
      // Load model on current engine
      _currentEngine.loadModel(modelId);
    },

    /**
     * Check backend availability
     */
    check() {
      if (!_currentEngine) {
        // No engine loaded yet, check WebGPU by default
        _currentEngine = getWebGPUEngine();
        _currentBackend = "webgpu";
      }
      _currentEngine.check();
    },

    /**
     * Stream generation
     */
    generate(messages, options) {
      if (!_currentEngine) {
        throw new Error("No engine loaded. Call loadModel() first.");
      }
      return _currentEngine.generate(messages, options);
    },

    /**
     * Generate and return full response with stats
     */
    generateFull(messages, options, onToken) {
      if (!_currentEngine) {
        return Promise.reject(new Error("No engine loaded. Call loadModel() first."));
      }
      return _currentEngine.generateFull(messages, options, onToken);
    },

    /** Interrupt generation */
    interrupt() {
      _currentEngine?.interrupt();
    },

    /** Reset */
    reset() {
      _currentEngine?.reset();
    },

    /** Register message listener */
    onMessage(fn) {
      if (!_currentEngine) {
        _currentEngine = getWebGPUEngine();
        _currentBackend = "webgpu";
      }
      // Add to unified listeners so it persists across backend switches
      _unifiedListeners.add(fn);
      return _currentEngine.onMessage(fn);
    },

    /** Remove message listener */
    offMessage(fn) {
      _unifiedListeners.delete(fn);
      _currentEngine?.offMessage(fn);
    },

    /** Current status */
    get status() { return _currentEngine?.status || "idle"; },

    /** Is ready */
    get isReady() { return _currentEngine?.isReady || false; },

    /** Is generating */
    get isGenerating() { return _currentEngine?.isGenerating || false; },

    /** Current model ID */
    get modelId() { return _currentEngine?.modelId || null; },

    /** Current backend */
    get backend() { return _currentBackend; },

    /** Get model info (works for both backends) */
    getModelInfo() {
      const modelId = this.modelId;
      if (!modelId) return null;
      
      if (_currentBackend === "webgpu") {
        return getModelInfo(modelId);
      } else {
        return getOllamaModelInfo(modelId);
      }
    },

    /** Terminate */
    terminate() {
      _currentEngine?.terminate();
      _currentEngine = null;
      _currentBackend = null;
    },
  };
}
