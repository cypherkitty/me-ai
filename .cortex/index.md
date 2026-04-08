# me-ai — Agent Orientation Index

Single source of truth for any agent entering this repository.
Read this file, then follow the links relevant to your task.

## Knowledge base

| Document | What it covers |
|----------|----------------|
| [`architecture.md`](architecture.md) | Package map, dependency direction, code navigation |
| [`core-beliefs.md`](core-beliefs.md) | Golden principles governing every line of code |
| [`design-docs/`](design-docs/index.md) | n8n architecture, plugin system, event stream model |
| [`product-specs/`](product-specs/index.md) | Three-step user flow, feature specs |
| [`ci-cd.md`](ci-cd.md) | GitHub Actions workflows, deploy targets, how to add CI steps |
| [`quality-score.md`](quality-score.md) | Health grades per domain |
| [`tech-debt-tracker.md`](tech-debt-tracker.md) | Known debt items |
| [`exec-plans/`](exec-plans/README.md) | Execution plans for complex work |
| [`references/rexie-patterns.md`](references/rexie-patterns.md) | Rexie/IndexedDB conventions, storage policy (Rexie-only app data), store inventory |
| [`coding-standards/typescript.md`](coding-standards/typescript.md) | No `null`, discriminated unions, `??` over `\|\|` |
| [`coding-standards/rust.md`](coding-standards/rust.md) | Type-driven development, `enum` over strings, no `unwrap()` outside tests; minimal `js_sys` / `web_sys` |

## Agent roles

Pick the role that matches your task. Each file defines scope, constraints, and workflow.

| Role | File | Scope |
|------|------|-------|
| Builder | [`.agents/me-ai-builder.md`](../.agents/me-ai-builder.md) | Build, install, test, deploy |
| Core | [`.agents/me-ai-core.md`](../.agents/me-ai-core.md) | Rust/WASM (`me-ai-core/src/**` excl. `src/db/`) |
| Core DB | [`.agents/me-ai-core-db.md`](../.agents/me-ai-core-db.md) | IndexedDB schema and Rexie primitives |
| Web tests | [`.agents/me-ai-web-it-tests.md`](../.agents/me-ai-web-it-tests.md) | Vitest, Playwright, svelte-check |
| Code quality | [`.agents/me-ai-code-quality.md`](../.agents/me-ai-code-quality.md) | ESLint, svelte-check, knip, Clippy |
