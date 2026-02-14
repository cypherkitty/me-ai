---
description: Project architecture and key conventions
alwaysApply: true
---

# me-ai Architecture

Browser-only AI chat app with Gmail integration. No backend server — the LLM runs entirely in the browser via WebGPU, and Gmail access uses client-side OAuth.

## Stack

- **Svelte 5** (with `$state` runes) + **Vite 6**
- **@huggingface/transformers** (v3.8+) for ONNX model inference
- **WebGPU** for GPU-accelerated generation
- **Google Identity Services (GIS)** for browser-only OAuth
- **Gmail REST API** via direct `fetch()` with Bearer token

## File Structure

```
src/
  main.js              — Svelte mount point
  App.svelte           — Shell: top nav + hash-based routing (#chat / #dashboard)
  Chat.svelte          — AI chat UI (model selector, progress, messages, input)
  Dashboard.svelte     — Gmail dashboard (auth, profile, message list, detail modal)
  worker.js            — Web Worker: model loading, WebGPU check, streaming generation
  lib/
    google-auth.js     — GIS OAuth wrapper (initGoogleAuth, requestAccessToken, revokeToken)
    gmail-api.js       — Gmail REST API wrapper (getProfile, listMessages, getMessage, etc.)
index.html             — Shell HTML, loads src/main.js
.env.example           — Template for VITE_GOOGLE_CLIENT_ID
```

## Routing

Simple hash-based routing in `App.svelte` — no router library:
- `#chat` (default) → `Chat.svelte`
- `#dashboard` → `Dashboard.svelte`

Both components stay mounted (show/hide with `display: flex/none`) so Chat's worker persists across page switches.

## Critical Architecture Rules

1. **All inference runs in a Web Worker** (`src/worker.js`).
   The main thread never imports `@huggingface/transformers`.

2. **Worker ↔ UI communication** uses `postMessage` with a `{ type, data }` protocol.
   Worker message types: `check`, `load`, `generate`, `interrupt`, `reset`.
   Worker response statuses: `webgpu-info`, `loading`, `initiate`, `progress`, `done`, `ready`, `start`, `phase`, `thinking`, `thinking-done`, `update`, `complete`, `error`.

3. **Svelte 5 `$state` proxies are not cloneable.**
   Always convert reactive arrays/objects to plain data before `postMessage`:
   ```js
   const plain = messages.map(m => ({ role: m.role, content: m.content }));
   worker.postMessage({ type: "generate", data: plain });
   ```

4. **Qwen3 emits `<think>…</think>` blocks** for internal reasoning.
   The worker detects and separates thinking content, sending it via `thinking` / `thinking-done` statuses.

5. **Model is a singleton** (`TextGenerationPipeline` class with `??=` lazy init).
   Never create a second model instance — it would double VRAM usage.
   When switching models, `dispose()` the old one first.

6. **WebGPU is required.** The app checks `navigator.gpu` on mount and shows a
   fallback screen if unavailable. Supported browsers: Chrome 113+, Edge 113+.

7. **Gmail auth is browser-only.** Uses GIS implicit token flow — no server.
   Access token lives in memory only (not persisted to localStorage).
   Client ID is stored in localStorage or provided via `VITE_GOOGLE_CLIENT_ID` env var.

8. **No external router or state library.** Keep dependencies minimal.
   Hash routing and `$state` runes handle everything.
