# Architecture

> **me-ai** is a browser-only AI assistant built on an event-stream model.
> No backend server. LLM runs in-browser via WebGPU or Ollama. Gmail/Twitter use client-side OAuth.

## Package map

| Package | Stack | Role |
|---------|-------|------|
| `me-ai-core/` | Rust → WASM (wasm-pack) | Business logic, persistence (IndexedDB/Rexie), plugins, LLM triage, API clients |
| `me-ai-web/` | Svelte 5 + Vite 6 + Tailwind 4 | UI, routing, stores, LLM worker (WebGPU), auth flows |

**Dependency direction:** `me-ai-web` → `me-ai-core` (via `file:../me-ai-core/pkg` link). Never the reverse.

## Core WASM facade

All persistence and domain logic is exposed through a single `MeAiCore` struct in `me-ai-core/src/lib.rs`.  
TypeScript calls WASM methods only — no direct IndexedDB access from app code.

**Persistence:** IndexedDB via the `rexie` crate only (`me-ai` DB). The app does not use `localStorage` or `sessionStorage`; all durable state crosses the WASM API.  
See [`.cortex/references/rexie-patterns.md`](references/rexie-patterns.md) for conventions and the storage policy table.

**WASM / browser FFI:** Prefer pure Rust in `me-ai-core`; use `js-sys` / `web-sys` only in the rare host-only cases described in [`.cortex/coding-standards/rust.md`](coding-standards/rust.md).

## Navigating the code

Don't memorize directory trees — read the source directly. A few orientation hints:

- **Core entry point:** `me-ai-core/src/lib.rs` — the `MeAiCore` struct is the single WASM facade; every public method is here. Follow its `use` imports to find any module.
- **Web entry point:** 
  - `me-ai-web/src/App.svelte` → `AppRouter.svelte` for routing. 
  - Views live in `src/views/`, 
  - feature components in `src/components/`, 
  - shared logic in `src/lib/`.
- **WASM bridge in web:** `src/lib/core.ts` re-exports WASM types and provides `initCore` / `getCore`.

## Three-step user flow

See [`.cortex/product-specs/three-step-flow.md`](product-specs/three-step-flow.md).

## Dynamic action flow (n8n-like)

See [`.cortex/design-docs/n8n-architecture.md`](design-docs/n8n-architecture.md) — the foundational architectural principle.

## Plugin system

See [`.cortex/design-docs/plugin-system.md`](design-docs/plugin-system.md).

## Build system

All build/test/deploy goes through [Task](https://taskfile.dev). See `.agents/me-ai-builder.md`.

Key tasks: `task install`, `task build`, `task test`, `task ci`, `task deploy-build`.

## CI / CD

See [`.cortex/ci-cd.md`](ci-cd.md) — workflow triggers, what each step does, deploy targets, and how to add new CI checks.

## Coding standards

Language-level rules that every contributor and agent must follow:

- [`.cortex/coding-standards/typescript.md`](coding-standards/typescript.md) — no `null`, discriminated unions, `??` over `||`
- [`.cortex/coding-standards/rust.md`](coding-standards/rust.md) — type-driven development, `enum` over strings, no `unwrap()` outside tests

High-level statements are in [`.cortex/core-beliefs.md`](core-beliefs.md) §12–13.
