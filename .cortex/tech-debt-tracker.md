# Tech Debt Tracker

Known technical debt items, ordered by impact. Update this file when debt is created or paid down.

## Active


### HIGH — Missing test coverage
- Web components: zero test files for chat, sources, actions, dashboard, stores
- Core: no tests for `api/`, `integrations/`, `formatting.rs`, triage logic
- E2E: single spec file, some tests skip on CI


## Paid down

- **Stale documentation references** (2026-04-07, PR #73) — sea-query → Rexie, JS plugin tree → Rust core, init(adapter) → MeAiCore, dev commands updated to Task, removed deleted spec/doc files
- **No formatting config** (2026-04-07) — added `.prettierrc`, `.rustfmt.toml`, `.editorconfig`; husky + lint-staged pre-commit hooks; `task knip` added to `task ci`
