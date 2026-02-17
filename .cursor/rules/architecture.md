---
description: Project structure, components, patterns, and known gotchas
alwaysApply: true
---

# me-ai — Architecture

**Browser-only AI assistant built on an event-stream model.** No backend server. The LLM runs entirely in the browser via WebGPU or Ollama, and Gmail uses client-side OAuth.

## Core Concept: Event Stream + Command Map

**This is the most important architectural principle — the foundation of the entire system.**

The system is modeled as a **stream of events** with associated **commands**:

```
HashMap<EventType, List<Command>>
```

### Events
An **event** is any discrete piece of data that enters the system. Examples:
- **Email message** — arrives via Gmail sync, classified by the LLM into an event type (e.g. `REPLY`, `DELETE`, `TRACK_DELIVERY`, `PAY_BILL`)
- Future: Telegram message, calendar invite, RSS item, webhook payload, etc.

Each event has:
- `type` — the event type (e.g. `"REPLY"`, `"DELETE"`, `"TRACK_DELIVERY"`)
- `source` — where it came from (e.g. `"gmail"`, `"telegram"`)
- `data` — the raw payload (email body, message text, etc.)
- `metadata` — timestamps, sender, subject, tags, LLM classification result

### Commands
A **command** is an action that can be taken on an event. Each event type maps to a list of commands:

```js
// Example: email classified as REPLY
{
  eventType: "REPLY",
  commands: [
    { id: "draft_reply", name: "Draft Reply", description: "Generate a reply draft using LLM" },
    { id: "mark_done",   name: "Mark Done",   description: "Mark as handled" },
    { id: "snooze",      name: "Snooze",       description: "Remind me later" },
    { id: "dismiss",     name: "Dismiss",      description: "Remove from queue" },
  ]
}
```

Each command has:
- `id` — unique identifier
- `name` — display name
- `description` — what it does
- `body` — optional rich content (LLM-generated draft, parsed data, etc.)

### Chat as Control Interface
The **chat is the control interface** on top of the event stream. Chat messages can be:

1. **Flat/regular** — plain text string (e.g. user questions, LLM text replies)
2. **Typed** — structured message containing:
   - An **event** (or list of events)
   - A **list of commands** associated with the event
   - Visual components/cards rendered inline in the chat

This means chat messages are not just text — they can contain interactive command cards that let the user act on events directly from the conversation.

### Data Flow

```
Data Sources (Gmail, future: Telegram, etc.)
    ↓
Events (classified by LLM or rules)
    ↓
Event Type → Command Map (HashMap<EventType, List<Command>>)
    ↓
Chat Messages (flat text + typed event/command cards)
    ↓
User interaction (execute commands, ask questions, drill down)
```

## Stack

- **Svelte 5** (`$state` runes, not stores) + **Vite 6**
- **@huggingface/transformers** v3.8 — ONNX model inference via WebGPU
- **Google Identity Services (GIS)** — implicit OAuth token flow
- **Gmail REST API** — direct `fetch()` with Bearer token
- **marked** — GFM-compliant markdown-to-HTML renderer (for email preview)
- **DOMPurify** — HTML sanitization (XSS protection for rendered markdown)
- **Dexie.js** — IndexedDB wrapper for universal local data store
- **Vitest** + **jsdom** — unit testing
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
      CommandCard.svelte     — Visual card for a single command (name, description, body)
      EventMessage.svelte    — Typed message: event info + list of command cards
      GpuPanel.svelte        — Expandable GPU details grid
    dashboard/
      SetupGuide.svelte      — 5-step OAuth setup with deep links + copy-to-clipboard
      AuthCard.svelte        — Sign-in button, Google icon, client ID display
      DashboardView.svelte   — Authenticated: profile + sync + search + message list + modal
      ProfileCard.svelte     — Avatar, email, stats, sign out button
      SyncStatus.svelte      — Local storage sync: progress bar, status, clear data
      MessageList.svelte     — Rows of messages with sender/subject/date/snippet
      MessageModal.svelte    — Full message detail modal, HTML iframe, Markdown preview (marked + DOMPurify)
    shared/
      ErrorCard.svelte       — Reusable error display with parseError() integration
  lib/
    google-auth.js     — GIS wrapper: initGoogleAuth, requestAccessToken, revokeToken
    gmail-api.js       — Gmail REST: getProfile, listMessages, getMessage,
                         getMessagesBatch, getHeader, getBody, getHtmlBody, base64url decode
    markdown-export.js — emailToMarkdown, htmlToMarkdownBody, emailFilename, downloadText
    events.js          — Event type → Command map registry, command definitions
    models.js          — MODELS array constant (shared between components)
    format.js          — formatBytes, formatBytesPrecise, progressPct
    error-parser.js    — parseError() — structured error guidance for API errors
    email-utils.js     — parseMessage, formatDate, extractName, initial
    debug.js           — Optional debug logger controlled by localStorage("debug")
    store/
      db.js            — Dexie database definition, schema, makeItemId()
      gmail-sync.js    — Gmail sync (full + incremental via History API)
      query-layer.js   — LLM-friendly queries (search, summaries, context)
    __tests__/
      markdown-export.test.js    — Unit tests for emailToMarkdown, emailFilename
      html-to-markdown.test.js   — Unit tests for htmlToMarkdownBody (jsdom env)
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

### Markdown export & preview
- `lib/markdown-export.js` converts email messages to `.md` format
- **HTML-to-Markdown conversion**: When `htmlBody` is available, `htmlToMarkdownBody()` uses `DOMParser` to walk the DOM tree and convert to Markdown, preserving images, links, bold, headings, tables, and lists
- **Tracking pixel filtering**: `isSkippableImage()` filters out 1x1 pixels, data: URIs, spacer GIFs, Amazon `/gp/r.html?` redirect URLs, and generic email open-tracking pixels
- Output: H1 subject heading, metadata table (From, To, Date), horizontal rule, body content
- Filenames auto-generated: `YYYY-MM-DD_subject-slug.md`
- **Preview rendering**: `MessageModal` uses **marked** (GFM mode, `breaks: true`) to render Markdown as HTML, sanitized through **DOMPurify** before injection via `{@html}`. Links open in new tabs via custom renderer.
- Download triggered via Blob URL + invisible anchor click
- Export button (`.md`) in `MessageModal` header toggles between email view and Markdown preview (Raw/Preview tabs)

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

- **Keep dependencies minimal.** No router, no state lib, no CSS framework. Only add libs when hand-rolled code is too fragile (e.g. `marked` replaced a broken regex-based markdown renderer).
- **Everything in the browser.** No backend, no API keys on server, no proxies.
- **Progressive disclosure.** Landing → model selection → loading → chat. Dashboard: setup → auth → inbox.
- **WebGPU is required.** Show fallback screen if `navigator.gpu` is undefined. Supported: Chrome 113+, Edge 113+.
- **Model files are large** (190 MB to 2.6 GB). Progress UI must handle unknown `Content-Length` (indeterminate bars) and show precise bytes.
- **User-friendly errors.** Never show raw API errors. Always parse through `parseError()` and show actionable guidance.
- **Accessibility.** Svelte a11y warnings on the modal overlay are suppressed with `<!-- svelte-ignore -->` comments. Escape key closes the modal via a window-level keydown listener.

## Local Data Store (IndexedDB via Dexie.js)

### Architecture

The app includes a universal local data store designed to hold data from multiple sources (Gmail first, extensible to messengers, social networks, etc.). All data lives in IndexedDB, accessed via Dexie.js.

```
Data Sources (Gmail, future: Telegram, Twitter, etc.)
    ↓
Source Adapters (fetch, normalize, sync)
    ↓
Universal Data Store (IndexedDB via Dexie)
    ↓
Query Layer (LLM context, search, summaries)
```

### Store Files

```
src/lib/store/
  db.js              — Dexie database definition, schema, makeItemId()
  gmail-sync.js      — Gmail sync adapter (full + incremental via History API)
  query-layer.js     — LLM-friendly query functions (search, summaries, context building)
src/components/dashboard/
  SyncStatus.svelte  — Sync progress UI (download button, progress bar, clear data)
```

### Database Schema (Dexie)

**`items`** — Universal data items (emails, messages, posts):
- `id` (PK): `"sourceType:sourceId"` — e.g. `"gmail:18e12345abcd"`
- `sourceType`, `sourceId`, `threadKey`, `type`
- `from`, `to`, `cc`, `subject`, `snippet`, `body`, `htmlBody`
- `date`: Timestamp (indexed). `labels`: String array (multi-entry index)
- `messageId`, `inReplyTo`, `references`: Email headers for graph building
- `raw`: Full original API response. `syncedAt`: Download timestamp
- Compound index: `[sourceType+date]` for efficient per-source date queries

**`contacts`** — People extracted from data items:
- `++id` (auto), `&email` (unique), `name`, `firstSeen`, `lastSeen`

**`syncState`** — Sync metadata per source:
- `sourceType` (PK), `historyId`, `lastSyncAt`, `totalItems`

### Gmail Sync

Two modes: **full sync** (first time: paginate up to 500 msgs, batch-fetch, store) and **incremental sync** (subsequent: Gmail History API for adds/deletes only). Falls back to full sync if historyId expired. Supports `AbortSignal` for cancellation.

### LLM Integration

Query layer provides `buildLLMContext()` (compact summary) and `buildEmailContext(query)` (rich context). In `Chat.svelte`, `send()` detects email-related queries via keyword matching and injects appropriate context as a system message.

### Adding New Data Sources

1. Create `src/lib/store/{source}-sync.js` following `gmail-sync.js` pattern
2. Use `makeItemId("source", id)` for item IDs
3. Normalize to same item shape. The query layer picks up all sources automatically.

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
10. **Never use real PII in test fixtures.** Use placeholder data (e.g. `elon@spacex.com`, `Elon Musk`) in tests. The repo is public.
11. **Always sanitize rendered HTML.** Any `{@html}` usage must go through DOMPurify to prevent XSS. Never inject raw user/API content as HTML.
12. **Gmail History API expiry.** `historyId` values expire after ~30 days. The sync adapter catches 404 errors and falls back to full re-sync automatically.
13. **IndexedDB storage limits.** Browsers allow ~50-80% of disk. 500 emails ≈ 5-25MB, well within limits. Consider pruning `raw` fields if storage becomes an issue.
14. **Sync during token expiry.** Long full syncs may outlast the OAuth token. The sync uses `Promise.allSettled` to handle individual fetch failures gracefully.
