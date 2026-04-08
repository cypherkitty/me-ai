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

## 10. Tests use real objects — mocks are a last resort

Prefer real structs, classes, and instances in tests. Mocks hide real
behavior, couple tests to implementation details, and erode confidence.

**Rust:** use real `CoreError`, real struct constructors, real parsing logic.
Never mock what you can instantiate.

**TypeScript:** use real module functions with controlled inputs. Only mock
at a true external boundary — specifically WASM (`me-ai-core`) and browser
APIs (`fetch`, and IndexedDB when not going through WASM) that cannot run in Vitest's
node/jsdom environment. Application data uses Rexie only via core; do not add `localStorage` or `sessionStorage`.

When you reach for `vi.mock()`, ask first: can I pass a real value instead?
If yes, do that. If the only reason to mock is to avoid a slow or complex
setup, fix the setup — don't hide it.

## 11. Build artifacts are never committed — gitignore before first commit

Before landing any new package, tool, or sub-crate, identify every directory
or file it generates at build/install time and make sure it is gitignored.

**Convention for this repo:**

| Scope | Where to gitignore |
|-------|--------------------|
| Sub-package (`me-ai-core/`, `me-ai-web/`) | its own `.gitignore` |
| Dev tools under `tools/*/` | root `.gitignore` glob — `tools/*/target` already covers all Rust tool targets |
| Repo-wide patterns (`.env`, `.idea`) | root `.gitignore` |

**Checklist when adding a new location:**

- Rust crate → `target/` in its `.gitignore` (or covered by `tools/*/target` glob if under `tools/`)
- npm package → `node_modules/`, `dist/`, `.vite/` in its `.gitignore`
- wasm-pack output → `pkg/` in the crate's `.gitignore` (already set for `me-ai-core`)
- Editor/OS noise → root `.gitignore` (`.idea`, `.DS_Store`, `*.local`)

## 12. No `null` in TypeScript — use `undefined`

`null` is strictly prohibited in `me-ai-web`. The only permitted source of `null` is the
WASM boundary, where Rust `Option<T>` serialises to JavaScript `null`. Convert it to
`undefined` immediately at the call site — never let it propagate into application code.

See [`.cortex/coding-standards/typescript.md`](coding-standards/typescript.md) for the
full rule set, boundary exception, and enforcement details.

## 13. Type-driven development in Rust

The type system is the first line of defence. Design types so illegal states are
unrepresentable: use `enum` over stringly-typed values, `Option<T>` over sentinel values,
newtype wrappers for domain identifiers, and `Result<T, CoreError>` for every fallible
operation. No `unwrap()` / `expect()` outside tests.

See [`.cortex/coding-standards/rust.md`](coding-standards/rust.md) for the full rule set
and Clippy enforcement details.
