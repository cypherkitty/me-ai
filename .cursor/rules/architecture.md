---
description: Project structure, components, patterns, and known gotchas
alwaysApply: true
---

# me-ai — Architecture

**Browser-only AI chat + Gmail dashboard.** No backend server. The LLM runs entirely in the browser via WebGPU, and Gmail uses client-side OAuth.

## Stack

- **Svelte 5** (`$state` runes, not stores) + **Vite 6**
- **@huggingface/transformers** v3.8 — ONNX model inference via WebGPU
- **Google Identity Services (GIS)** — implicit OAuth token flow
- **Gmail REST API** — direct `fetch()` with Bearer token
- **Vitest** — unit testing
- **No** backend, router library, or state management library

## File Structure

```
src/
  main.js              — mount(App, { target: #app })
  App.svelte           — Shell: top nav + hash routing (#chat / #dashboard)
  Chat.svelte          — Orchestrator: state + worker logic, delegates UI to children
  Dashboard.svelte     — Orchestrator: state + auth logic, delegates UI to children
  worker.js            — Web Worker: model loading, WebGPU check, streaming
                         generation, <think> block detection
  components/
    chat/
      ModelSelector.svelte   — Landing: model dropdown, GPU card, Load button
      LoadingProgress.svelte — Download progress bars with bytes & percentages
      ChatView.svelte        — Active chat: header, messages area, input row
      MessageBubble.svelte   — Single message: role, thinking toggle, content, cursor
      GpuPanel.svelte        — Expandable GPU details grid
    dashboard/
      SetupGuide.svelte      — 5-step OAuth setup with deep links + copy-to-clipboard
      AuthCard.svelte        — Sign-in button, Google icon, client ID display
      DashboardView.svelte   — Authenticated: profile + search + message list + modal
      ProfileCard.svelte     — Avatar, email, stats, sign out button
      MessageList.svelte     — Rows of messages with sender/subject/date/snippet
      MessageModal.svelte    — Full message detail modal + Markdown export button
    shared/
      ErrorCard.svelte       — Reusable error display with parseError() integration
  lib/
    google-auth.js     — GIS wrapper: initGoogleAuth, requestAccessToken, revokeToken
    gmail-api.js       — Gmail REST: getProfile, listMessages, getMessage,
                         getMessagesBatch, getHeader, getBody, base64url decode
    markdown-export.js — emailToMarkdown, emailFilename, downloadText
    models.js          — MODELS array constant (shared between components)
    format.js          — formatBytes, formatBytesPrecise, progressPct
    error-parser.js    — parseError() — structured error guidance for API errors
    email-utils.js     — parseMessage, formatDate, extractName, initial
    debug.js           — Optional debug logger controlled by localStorage("debug")
    __tests__/
      markdown-export.test.js — Unit tests for markdown export
index.html             — Entry HTML (no external scripts — GIS loads dynamically)
.env.example           — VITE_GOOGLE_CLIENT_ID template
```

## Component Architecture

**Chat.svelte** (~130 lines) keeps all `$state` declarations, worker setup, and worker message handling. It delegates rendering to `ModelSelector`, `LoadingProgress`, or `ChatView` based on `status`.

**Dashboard.svelte** (~170 lines) keeps all `$state` declarations, auth `$effect`, and async actions (sign in/out, fetch). It delegates rendering to `SetupGuide`, `AuthCard`, or `DashboardView` based on `needsSetup`/`isSignedIn`.

**Prop passing**: Svelte 5 `$props()` in children. Callbacks passed as `onsend`, `onreset`, etc. Two-way binding via `bind:` for simple values (`selectedModel`, `searchQuery`, `clientIdInput`). No stores or context API — the tree is max 2 levels deep.

## Routing

Hash-based in `App.svelte`. No router library.
- `#chat` (default) → `Chat.svelte`
- `#dashboard` → `Dashboard.svelte`

**Both components are always mounted** (toggled with `style:display` flex/none).
This prevents Chat's Web Worker from being destroyed when switching to Dashboard.

## State Management

Svelte 5 `$state` runes everywhere. No stores, no writable/readable.

```js
let messages = $state([]);             // reactive array
let status = $state(null);             // reactive primitive
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
| `loading` | `data: string` | Status text |
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

### Google Cloud setup (one-time, required)
Users must create a Google Cloud project, enable Gmail API, and create an OAuth 2.0 Client ID.
The Dashboard has a built-in step-by-step setup guide with direct deep links to each Google Cloud Console page and copy-to-clipboard URL chips.
- **Authorized JS origins** (no path): `http://localhost:5173`, `https://cypherkitty.github.io`
- **Authorized redirect URIs** (all three): `http://localhost:5173`, `https://cypherkitty.github.io`, `https://cypherkitty.github.io/me-ai/`
- The `/me-ai/` subpath redirect URI is **required** because the app is deployed at a subpath on GitHub Pages
- "Google hasn't verified this app" warning is expected — click Advanced → "Go to app (unsafe)"

### Gmail API
- Direct `fetch()` to `https://gmail.googleapis.com/gmail/v1/users/me/*`
- `Authorization: Bearer {token}` header
- Message list returns IDs only → batch-fetch details with `getMessagesBatch()` (8 parallel)
- Body parsing: finds `text/plain` part, falls back to `text/html` (stripped), handles nested multipart
- HTML stripping uses **`DOMParser`** for correct decoding of all HTML entities (named like `&quot;` and numeric like `&#x27;`), with regex fallback for non-browser contexts
- Base64url decoding: replaces `-`→`+`, `_`→`/`, **restores `=` padding** (Gmail sends unpadded), then `atob()` + `TextDecoder`

### Markdown export
- `lib/markdown-export.js` converts email messages to `.md` format
- Output: H1 subject heading, metadata table (From, To, Date), horizontal rule, body text
- Filenames auto-generated: `YYYY-MM-DD_subject-slug.md`
- Download triggered via Blob URL + invisible anchor click
- Export button (`.md`) appears in `MessageModal` header when body is loaded

### Stale request guard pattern
All async Gmail functions check `if (!accessToken) return` after every `await`. This prevents in-flight API responses from writing stale data into state if the user signs out while a request is pending.

### Error handling
`lib/error-parser.js` exports `parseError()` which detects common Google API errors and returns structured error cards:

| Error pattern | User sees |
|--------------|-----------|
| "has not been used in project" | "Gmail API not enabled" + direct enable link |
| "Invalid Credentials" / 401 | "Session expired" + Sign Out & Retry button |
| "insufficient scope" | "Insufficient permissions" + re-auth instructions |
| "access_denied" | "Access denied" + retry prompt |
| "popup" / "blocked" | "Popup blocked" + browser settings hint |
| "Rate Limit" / 429 | "Rate limit exceeded" + wait message |
| "Failed to fetch" | "Network error" + connection check |

## Debug Logging

`lib/debug.js` provides optional logging controlled by `localStorage`:

```js
// Enable:  localStorage.setItem("debug", "true")  then reload
// Disable: localStorage.removeItem("debug")        then reload
import { mountLog } from "./lib/debug.js";
onMount(() => mountLog("ComponentName"));  // logs mount + returns destroy callback
```

All UI components use `mountLog()` to log lifecycle events. This is useful for verifying component count, spotting unwanted re-mounts, and debugging.

## Styling

- **Dark theme**: background `#0f0f0f`, text `#e8e8e8`, accents `#3b82f6` (blue), `#4ade80` (green), `#f87171` (red errors)
- **Global resets** in `App.svelte`: box-sizing, body font/color/height, `#app` flex layout
- **Component-scoped** styles in each `.svelte` file (Svelte auto-scopes)
- **No shared CSS file** — button/card styles are duplicated where needed (acceptable for small project)
- Font stack: system fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...`)
- Animations: `@keyframes` for spinners, dot pulses, blinking cursor, progress bar shimmer

## Key Conventions

- **Keep dependencies minimal.** No router, no state lib, no CSS framework.
- **Everything in the browser.** No backend, no API keys on server, no proxies.
- **Progressive disclosure.** Landing → model selection → loading → chat. Dashboard: setup → auth → inbox.
- **WebGPU is required.** Show fallback screen if `navigator.gpu` is undefined. Supported: Chrome 113+, Edge 113+.
- **Model files are large** (190 MB to 2.6 GB). Progress UI must handle unknown `Content-Length` (indeterminate bars) and show precise bytes.
- **User-friendly errors.** Never show raw API errors. Always parse through `parseError()` and show actionable guidance.
- **Accessibility.** Svelte a11y warnings on the modal overlay are suppressed with `<!-- svelte-ignore -->` comments. Escape key closes the modal via a window-level keydown listener.

## Known Gotchas

1. **`DataCloneError`**: Svelte 5 `$state` proxies cannot be passed to `postMessage`. Always map to plain objects first.
2. **OAuth popups don't work in Cursor's embedded browser.** GIS needs real popup windows. Test auth flow in regular Chrome at `http://localhost:5173/#dashboard`.
3. **Model downloads can lack `Content-Length` header.** The progress UI handles this with indeterminate progress bars and showing only downloaded bytes.
4. **Gmail base64url payloads are unpadded.** The `decodeBase64Url` function must add `=` padding before `atob()` or decoding will throw.
5. **`svelte.config.js` linter error** (`Cannot find package @sveltejs/vite-plugin-svelte`) is a pre-existing IDE issue. The app runs fine — Vite handles the plugin directly.
6. **Model switching doesn't re-download.** Transformers.js caches in IndexedDB. Only GPU resources (`model.dispose()`) are released.
7. **Async state after signout.** Every Gmail async function must guard state writes with `if (!accessToken) return` after each `await`.
8. **GitHub Pages OAuth needs `/me-ai/` subpath.** The redirect URI must include the full deployment path, not just the origin.
9. **Google Cloud Console propagation delay.** After updating OAuth client settings, changes can take a few minutes to take effect.
