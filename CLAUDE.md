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

Six specialist agents live in `.claude/agents/` (symlinked from `.agents/`):

- **me-ai-builder** — Building, installing, testing, deploying — always use `task`, never `npm install` or `npm run build` directly
- **me-ai-web** — Svelte/TypeScript changes in `me-ai-web/src/**`
- **me-ai-core** — Rust/WASM changes in `me-ai-core/src/**` (excluding `src/db/`)
- **me-ai-core-db** — IndexedDB schema and Rexie primitives in `me-ai-core/src/db/`
- **me-ai-web-it-tests** — Running/fixing unit tests (Vitest), E2E (Playwright), or `task check`
- **me-ai-code-quality** — Linting, static analysis, dead code detection (ESLint, svelte-check, knip, Clippy)

**Do not mix concerns**: no core logic in web; no web concerns in core.

## Build system: Taskfile

All build, test, and deploy steps go through [Task](https://taskfile.dev).
Use the **me-ai-builder** agent for all build, install, test, and deploy operations.


## Code quality

Use the **me-ai-code-quality** agent for linting, static analysis, and dead code detection. 
It covers ESLint, svelte-check, knip (web), and Clippy (Rust core).

