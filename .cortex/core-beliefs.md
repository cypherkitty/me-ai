# Core Beliefs

Golden principles that govern every line of code in this repository.
When a belief is violated, the violation should be fixed — not the belief relaxed.

## 1. No fallbacks — fail explicitly

Never implement fallback paths, default alternatives, or silent degradation.
If the primary path is unavailable, throw an error with a clear message.
This applies to both Rust core and TypeScript web.

## 2. Rust owns all persistence

All IndexedDB access goes through `MeAiCore` (WASM).
TypeScript never touches IndexedDB directly — it calls core methods.
No SQL; stores and indexes only (Rexie crate).

## 3. No untyped data at boundaries

Parse and validate at the boundary. Use `serde` + `tsify-next` in core;
use typed stores and interfaces in web. No `any` casts without an explicit
typed intermediary (`as unknown as T`).

## 4. Plugins go through the registry

All external service interactions (Gmail, Twitter, filesystem, HTTP) are
routed through the plugin registry in `me-ai-core/src/plugins/`.
Never call external APIs from ad-hoc locations.

## 5. Events are typed — no unstructured data

Every event has a `type` (fine-grained label) and a `category` (NOISE/INFO/CRITICAL).
Event types are emergent (LLM-created or user-created), not a fixed enum —
but they are always stored with structure in `sm_event_types`.

## 6. Pipelines are never hardcoded

Pipelines come from category defaults, per-type overrides, or rules.
The LLM classifies; it does not suggest actions.
See `.cortex/design-docs/n8n-architecture.md`.

## 7. Core and web do not mix

`me-ai-core/` contains no UI or Svelte concerns.
`me-ai-web/` contains no persistence logic or Rust.
The WASM boundary is the only interface.

## 8. Build through Task, not raw commands

All build, install, test, and deploy operations go through `Taskfile.yml`.
Never run `npm install` or `cargo build` directly from the repo root.

## 9. Agent context must be in-repo

Decisions, architecture, conventions, and plans live in versioned files
(`.cortex/`, `.agents/`, `.cursor/rules/`). If it's not discoverable
in the repo, it doesn't exist for agents.
