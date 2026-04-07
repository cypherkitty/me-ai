# me-ai — Claude Code Guide

**Browser-only AI assistant built on an event-stream model.**

- No backend server.
- The LLM runs entirely in the browser via WebGPU or Ollama.
- Gmail/Twitter use client-side OAuth.

**Never use fallback functionality — strictly prohibited.**
Do not implement or rely on fallback paths, default alternatives, or degradation;
fail explicitly when the primary path is unavailable.

## Knowledge base: `.cortex/`

The repository's system of record. Start here, follow links to go deeper:

| Document | What it covers |
|----------|---------------|
| [`.cortex/architecture.md`](.cortex/architecture.md) | Package map, module layouts, dependency direction |
| [`.cortex/core-beliefs.md`](.cortex/core-beliefs.md) | Golden principles — the rules that govern every line of code |
| [`.cortex/design-docs/`](.cortex/design-docs/index.md) | n8n architecture, plugin system, event stream model |
| [`.cortex/product-specs/`](.cortex/product-specs/index.md) | Three-step user flow, feature specs |
| [`.cortex/quality-score.md`](.cortex/quality-score.md) | Health grades per domain |
| [`.cortex/tech-debt-tracker.md`](.cortex/tech-debt-tracker.md) | Known debt items |
| [`.cortex/exec-plans/`](.cortex/exec-plans/README.md) | Execution plans for complex work |
| [`.cortex/references/`](.cortex/references/rexie-patterns.md) | Rexie/IndexedDB conventions |

## Project layout

- **me-ai-core** (Rust, WASM) — Business logic, persistence (IndexedDB via Rexie), plugins, LLM. Exposes WASM API via `MeAiCore` in `lib.rs`. See `me-ai-core/REFERENCE.md` for patterns.
- **me-ai-web** (Svelte 5 + TypeScript) — Frontend and app layer. Depends on `me-ai-core` as a local package (`file:../me-ai-core/pkg` after building with wasm-pack).

## Subagents

Five specialist agents live in `.agents/`:

- **me-ai-builder** — Build, install, test, deploy — always use `task`, never raw `npm install` or `npm run build`
- **me-ai-core** — Rust/WASM changes in `me-ai-core/src/**` (excluding `src/db/`)
- **me-ai-core-db** — IndexedDB schema and Rexie primitives in `me-ai-core/src/db/`
- **me-ai-web-it-tests** — Running/fixing unit tests (Vitest), E2E (Playwright), or `task check`
- **me-ai-code-quality** — Linting, static analysis, dead code detection (ESLint, svelte-check, knip, Clippy)

**Do not mix concerns**: no core logic in web; no web concerns in core. See `.cortex/core-beliefs.md`.

## Build system: Taskfile

All build, test, and deploy steps go through [Task](https://taskfile.dev).
Use the **me-ai-builder** agent for all build, install, test, and deploy operations.

## Code quality

Use the **me-ai-code-quality** agent for linting, static analysis, and dead code detection.
It covers ESLint, svelte-check, knip (web), and Clippy (Rust core).

