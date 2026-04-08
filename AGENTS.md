# me-ai — Codex Agent Guide

## Knowledge base

- [`.cortex/architecture.md`](.cortex/architecture.md) — package map, dependency direction, code navigation
- [`.cortex/core-beliefs.md`](.cortex/core-beliefs.md) — golden principles governing every line of code
- [`.cortex/design-docs/`](.cortex/design-docs/index.md) — n8n architecture, plugin system, event stream
- [`.cortex/product-specs/`](.cortex/product-specs/index.md) — three-step user flow, feature specs
- [`.cortex/ci-cd.md`](.cortex/ci-cd.md) — GitHub Actions workflows, deploy targets, how to add CI steps
- [`.cortex/quality-score.md`](.cortex/quality-score.md) — health grades per domain
- [`.cortex/tech-debt-tracker.md`](.cortex/tech-debt-tracker.md) — known debt items
- [`.cortex/exec-plans/`](.cortex/exec-plans/README.md) — execution plans for complex work
- [`.cortex/references/rexie-patterns.md`](.cortex/references/rexie-patterns.md) — Rexie/IndexedDB conventions

## Agents

- [`.agents/me-ai-builder.md`](.agents/me-ai-builder.md) — build, install, test, deploy
- [`.agents/me-ai-core.md`](.agents/me-ai-core.md) — Rust/WASM (`me-ai-core/src/**` excl. `src/db/`)
- [`.agents/me-ai-core-db.md`](.agents/me-ai-core-db.md) — IndexedDB schema and Rexie primitives
- [`.agents/me-ai-web-it-tests.md`](.agents/me-ai-web-it-tests.md) — Vitest, Playwright, svelte-check
- [`.agents/me-ai-code-quality.md`](.agents/me-ai-code-quality.md) — ESLint, svelte-check, knip, Clippy
