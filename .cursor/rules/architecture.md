---
description: Project architecture and key conventions
alwaysApply: true
---

# me-ai Architecture

Browser-only AI chat app. No backend server — the LLM runs entirely in the browser via WebGPU.

## Stack

- **Svelte 5** (with `$state` runes) + **Vite 6**
- **@huggingface/transformers** (v3.8+) for ONNX model inference
- **WebGPU** for GPU-accelerated generation
- Model: `onnx-community/Qwen3-0.6B-ONNX` (q4f16 quantisation)

## File Structure

```
src/
  main.js        — Svelte mount point
  App.svelte     — Single-file UI component (all state, markup, styles)
  worker.js      — Web Worker: model loading, WebGPU check, streaming generation
index.html       — Shell HTML, loads src/main.js
```

## Critical Architecture Rules

1. **All inference runs in a Web Worker** (`src/worker.js`).
   The main thread never imports `@huggingface/transformers`.

2. **Worker ↔ UI communication** uses `postMessage` with a `{ type, data }` protocol.
   Worker message types: `check`, `load`, `generate`, `interrupt`, `reset`.
   Worker response statuses: `webgpu-info`, `loading`, `initiate`, `progress`, `done`, `ready`, `start`, `update`, `complete`, `error`.

3. **Svelte 5 `$state` proxies are not cloneable.**
   Always convert reactive arrays/objects to plain data before `postMessage`:
   ```js
   const plain = messages.map(m => ({ role: m.role, content: m.content }));
   worker.postMessage({ type: "generate", data: plain });
   ```

4. **Qwen3 emits `<think>…</think>` blocks** for internal reasoning.
   The worker filters these out before streaming tokens to the UI.

5. **Model is a singleton** (`TextGenerationPipeline` class with `??=` lazy init).
   Never create a second model instance — it would double VRAM usage.

6. **WebGPU is required.** The app checks `navigator.gpu` on mount and shows a
   fallback screen if unavailable. Supported browsers: Chrome 113+, Edge 113+.
