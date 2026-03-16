# me-ai — Claude Code Guide

**Browser-only AI assistant built on an event-stream model.**

- No backend server. 
- The LLM runs entirely in the browser via WebGPU or Ollama.
- Gmail uses client-side OAuth.

**Never use fallback functionality — strictly prohibited.** 
Do not implement or rely on fallback paths, default alternatives, or degradation; 
fail explicitly when the primary path is unavailable.

## Project layout: core + web

The repo is split into two main parts:

- **me-ai-core** (Rust, WASM) — Business logic. Exposes WASM API via `init(adapter)`, `getEventTypes`, `getSources`, etc. See `me-ai-core/REFERENCE.md` for patterns.
- **me-ai-web** (Svelte + TypeScript) — Frontend and app layer. Depends on `me-ai-core` as a local package (file link to `me-ai-core/pkg` after building with wasm-pack).

## Subagents

Four specialist agents live in `.claude/agents/` (symlinked from `.agents/`):

- **builder** — Building, installing, testing, deploying — always use `task`, never `npm install` or `npm run build` directly
- **me-ai-web** — Svelte/TypeScript changes in `me-ai-web/src/**`
- **me-ai-core** — Rust/WASM changes in `me-ai-core/src/**`
- **web-it-tests** — Running/fixing unit tests (Vitest), E2E (Playwright), or `task check`

**Do not mix concerns**: no core logic in web; no web concerns in core.

## Build system: Taskfile

All build, test, and deploy steps go through [Task](https://taskfile.dev) from the repo root. 
Use the **builder** agent for these. Key tasks:

```bash
task install    # build core (wasm-pack) + npm install in me-ai-web — run once after clone
task build      # full build: install → npm run build
task build:web  # web only (skip core rebuild)
task test       # unit tests (Vitest)
task test:e2e   # E2E tests (Playwright)
task check      # Svelte/TypeScript check
task lint       # ESLint on me-ai-web/src
task ci         # full CI: install → check → lint → unit → E2E
```

Requires: Task v3, Node 20, Rust (stable + `wasm32-unknown-unknown`), wasm-pack.

## Three-Step User Flow

```
Step 1 — Sources  →  Step 2 — Scan  →  Step 3 — Control Plane
(Gmail, …)            (LLM classifier)   (Pipelines, Approvals, Event Stream, Audit)
```

- **Sources** `#sources` — connect accounts, browse raw data
- **Scan** `#scan` — run LLM classifier over synced emails; review categorized results
- **Control Plane** `#pipelines`, `#approvals`, `#stream`, `#audit` — configure rules, review approvals, audit trail

## Core Concept: Dynamically Generated Action Flow (n8n-like)

The system is modeled as a **dynamically generated flow of actions**. The LLM analyzes incoming data and dynamically structures execution pipelines.

- **Events** — any discrete data item (e.g. an email). The LLM extracts `type` (e.g. `REPLY`, `DELETE`) and `category` (`NOISE`, `INFO`, `CRITICAL`).
- Two execution modes: **auto** (NOISE + INFO) and **manual** (CRITICAL).
- Pipelines come from category defaults and optional per-type overrides — not from LLM suggestions.

### Plugin Architecture

```
src/lib/plugins/
  base-plugin.js       — BasePlugin: registerHandler, execute, canExecute
  gmail-plugin.js      — Extends BasePlugin; 12 Gmail action handlers
  plugin-registry.js   — PluginRegistry singleton: resolves plugin by source
  execution-service.js — High-level UI API: executePipeline, executePipelineBatch, …
```

### Chat as Control Interface

The chat is the control interface over the event stream. The LLM can trigger UI actions via hidden control tags it appends to responses:

- `[EXECUTE:CATEGORY:{EventType}]` — UI strips tag and executes pipeline batch for that pending event category
- `[SHOW:DASHBOARD]` — UI strips tag and renders the interactive events-by-category dashboard inline

CRITICAL events show an amber **approval card** instead of a direct execute button.

## Linting (me-ai-web)

ESLint 9 flat config in `me-ai-web/eslint.config.js`. Runs on `me-ai-web/src/` via `npm run lint` or `task lint`.

- **Config**: ESLint 9 flat config with `eslint-plugin-svelte`, `typescript-eslint`, `globals`
- **Rules**: `@typescript-eslint/no-explicit-any` — use typed casts (`as unknown as T`) instead of `as any`; empty catch blocks must log the error or use `_e`
- **CI**: `task ci` runs lint before tests; GitHub CI workflow runs `task ci`
- **Fix**: `npx eslint src/ --fix` auto-fixes many issues

## UI standards (me-ai-web)

- **shadcn-svelte v1** + **Tailwind CSS v4** — prefer shadcn components over custom CSS
- **Never override shadcn component colors** — use `variant` prop instead
- No `<style>` blocks — Tailwind utilities only
- Dark-only app — no `dark:` prefix needed
- Icons from **lucide-svelte**
- Custom colors → `src/app.css` CSS variables
