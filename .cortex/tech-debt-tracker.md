# Tech Debt Tracker

Known technical debt items, ordered by impact. Update this file when debt is created or paid down.

## Active

### HIGH — Stale documentation references
- `README.md` references "sea-query" and "type-safe queries via sea-query" — should say Rexie/IndexedDB
- `README.md` dev commands say `npm install` / `npm run dev` — should reference `task install` / Task workflow
- `.cursor/rules/architecture.mdc` references "type-safe SQL" and "sea-query" — should say Rexie/IndexedDB
- `.cursor/rules/architecture.mdc` plugin tree references JS files (`gmail-plugin.js`, `plugin-registry.js`) that no longer exist; plugins are now in Rust core
- `.cursor/rules/development-workflow.mdc` references "sea-query" and `.agents/me-ai-web.md` (deleted)
- `CLAUDE.md` lists six subagents but only five `.agents/` files exist (`me-ai-web.md` deleted)

### HIGH — Missing test coverage
- Web components: zero test files for chat, sources, actions, dashboard, stores
- Core: no tests for `api/`, `integrations/`, `formatting.rs`, triage logic
- E2E: single spec file, some tests skip on CI

### MEDIUM — No formatting config
- No `.prettierrc` for TypeScript/Svelte
- No `.rustfmt.toml` for Rust
- No `.editorconfig` for cross-editor consistency
- No pre-commit hooks (husky/lint-staged)

### MEDIUM — knip not in CI
- `task knip` exists but is not part of `task ci` — dead code can accumulate

### LOW — `init(adapter)` reference in CLAUDE.md
- `CLAUDE.md` says "Exposes WASM API via `init(adapter)`" but the actual API is `MeAiCore::new()` — no adapter pattern

## Paid down

_(Move items here when resolved, with date and PR/commit reference)_
