---
description: Project overview, architecture, conventions, and gotchas
alwaysApply: true
---

# me-ai

**Browser-only AI chat + Gmail dashboard.** No backend server. The LLM runs entirely in the browser via WebGPU, and Gmail uses client-side OAuth.

## Stack

- **Svelte 5** (`$state` runes, not stores) + **Vite 6**
- **@huggingface/transformers** v3.8 — ONNX model inference via WebGPU
- **Google Identity Services (GIS)** — implicit OAuth token flow
- **Gmail REST API** — direct `fetch()` with Bearer token
- **No** backend, router library, or state management library

## File Structure

```
src/
  main.js              — mount(App, { target: #app })
  App.svelte           — Shell: top nav + hash routing (#chat / #dashboard)
                         Global CSS reset, dark theme base, page show/hide
  Chat.svelte          — AI chat: model selector, loading progress, messages,
                         generation status, thinking toggle, GPU info panel
  Dashboard.svelte     — Gmail: OAuth setup guide, sign-in, profile card,
                         message list with search/pagination, detail modal,
                         smart error cards with parseError()
  worker.js            — Web Worker: model loading, WebGPU check, streaming
                         generation, <think> block detection
  lib/
    google-auth.js     — GIS wrapper: initGoogleAuth, requestAccessToken, revokeToken
    gmail-api.js       — Gmail REST: getProfile, listMessages, getMessage,
                         getMessagesBatch, getHeader, getBody, base64url decode
index.html             — Entry HTML (no external scripts — GIS loads dynamically)
.env.example           — VITE_GOOGLE_CLIENT_ID template
```

## Routing

Hash-based in `App.svelte`. No router library.
- `#chat` (default) → `Chat.svelte`
- `#dashboard` → `Dashboard.svelte`

**Both components are always mounted** (toggled with `style:display` flex/none).
This prevents Chat's Web Worker from being destroyed when switching to Dashboard.

## State Management

Svelte 5 `$state` runes everywhere. No stores, no writable/readable.

```js
let messages = $state([]);        // reactive array
let status = $state(null);        // reactive primitive
let needsSetup = $derived(!clientId);  // computed value
```

**Critical:** `$state` creates Proxy objects that **cannot be cloned** by `postMessage`.
Always convert to plain objects before sending to worker:
```js
const plain = messages.map(m => ({ role: m.role, content: m.content }));
worker.postMessage({ type: "generate", data: plain });
```
Forgetting this causes `DataCloneError`.

## Web Worker Protocol

All AI inference runs in `worker.js`. Main thread **never** imports `@huggingface/transformers`.

### Main → Worker messages
| type | payload | purpose |
|------|---------|---------|
| `check` | — | Check WebGPU, report adapter info |
| `load` | `{ modelId }` | Download model + compile shaders |
| `generate` | `{ data: messages[] }` | Start streaming generation |
| `interrupt` | — | Stop generation mid-stream |
| `reset` | — | Reset stopping criteria |

### Worker → Main messages
| status | key fields | purpose |
|--------|-----------|---------|
| `webgpu-info` | `data: { vendor, architecture, features, limits }` | GPU adapter details |
| `loading` | `data: string` | Status text ("Loading model...", "Compiling shaders...") |
| `initiate` | `file, total` | New file download started |
| `progress` | `file, loaded, total, progress` | Download progress update |
| `done` | `file` | File download complete |
| `ready` | — | Model loaded and warmed up |
| `start` | `phase: "preparing"` | Generation began (tokenizing) |
| `phase` | `phase: "thinking" \| "generating"` | Phase transition |
| `thinking` | `content, tps, numTokens` | Incremental thinking text |
| `thinking-done` | `content, tps, numTokens` | Final thinking text |
| `update` | `output, tps, numTokens` | Incremental response text |
| `complete` | — | Generation finished |
| `error` | `data: string` | Error message |

## Model Management

Seven models available (Qwen3, DeepSeek, Phi-4, Phi-3, Gemma). Default: Qwen3 0.6B.

- **Selection** persisted in `localStorage("selectedModel")`
- **Singleton** pattern: `TextGenerationPipeline` class with `??=` lazy init
- **Switching** models: call `this.model.dispose()` to free GPU VRAM, then load new one
- **Caching**: Transformers.js auto-caches model files in IndexedDB. **Never** clear browser cache on model switch — only dispose GPU resources
- **Warm-up**: After loading, one dummy generation pass compiles WebGPU shaders
- **Quantization**: All models use `q4f16` (4-bit weights, 16-bit activations)

## Thinking Mode (Qwen3)

Qwen3 models emit `<think>…</think>` blocks for chain-of-thought reasoning.
The worker detects these in `callback_function`:

1. Accumulates all tokens into `fullOutput`
2. When `<think>` is found → sends `phase: "thinking"`, streams thinking content
3. When `</think>` is found → sends `thinking-done` with full thinking text, switches to `phase: "generating"`
4. If model never emits `<think>` after 3 tokens → assumes direct response
5. Safety net: if `</think>` never appears, sends accumulated thinking when generation completes

In the UI, thinking is shown as a collapsible `<details>` element with word count.

## Google Auth & Gmail

### Auth flow
1. GIS script loaded **dynamically** (not in index.html) by `google-auth.js`
2. `initGoogleAuth(clientId)` creates token client with `gmail.readonly` scope
3. `requestAccessToken()` opens Google OAuth popup → returns `{ access_token, expires_in }`
4. Token lives in **memory only** — not persisted (security)

### Client ID sources (checked in order)
1. `import.meta.env.VITE_GOOGLE_CLIENT_ID` (from `.env` file)
2. `localStorage.getItem("googleClientId")` (entered in-app)
3. If neither → Dashboard shows setup guide with step-by-step instructions

### Gmail API
- Direct `fetch()` to `https://gmail.googleapis.com/gmail/v1/users/me/*`
- `Authorization: Bearer {token}` header
- Message list returns IDs only → batch-fetch details with `getMessagesBatch()` (8 parallel)
- Body parsing: finds `text/plain` part, falls back to `text/html` (stripped), handles nested multipart
- Base64url decoding: replaces `-`→`+`, `_`→`/`, then `atob()` + `TextDecoder`

### Error handling
`Dashboard.svelte` has a `parseError()` function that detects common Google API errors and returns structured guidance:

| Error pattern | User sees |
|--------------|-----------|
| "has not been used in project" | "Gmail API not enabled" + direct enable link with project ID |
| "Invalid Credentials" / 401 | "Session expired" + Sign Out & Retry button |
| "insufficient scope" | "Insufficient permissions" + re-auth instructions |
| "access_denied" | "Access denied" + retry prompt |
| "popup" / "blocked" | "Popup blocked" + browser settings hint |
| "Rate Limit" / 429 | "Rate limit exceeded" + wait message |
| "Failed to fetch" | "Network error" + connection check |

## Styling

- **Dark theme**: background `#0f0f0f`, text `#e8e8e8`, accents `#3b82f6` (blue), `#4ade80` (green)
- **Global resets** in `App.svelte`: box-sizing, body font/color/height, `#app` flex layout
- **Component-scoped** styles in each `.svelte` file (Svelte auto-scopes)
- **No shared CSS file** — button/card styles are duplicated where needed (acceptable for small project)
- Font stack: system fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...`)
- Animations: `@keyframes` for spinners, dot pulses, blinking cursor, progress bar shimmer

## Key Conventions

- **Keep dependencies minimal.** No router, no state lib, no CSS framework.
- **Everything in the browser.** No backend, no API keys on server, no proxies.
- **Progressive disclosure.** Landing → model selection → loading → chat. Dashboard: setup → auth → inbox.
- **WebGPU is required.** Show fallback screen if `navigator.gpu` is undefined.
- **Model files are large** (190 MB to 2.6 GB). Progress UI must handle unknown `Content-Length` (indeterminate bars) and show precise bytes.
- **Accessibility warnings** from Svelte are suppressed on the modal overlay with `<!-- svelte-ignore -->` comments (non-interactive `<div>` with click handler).
