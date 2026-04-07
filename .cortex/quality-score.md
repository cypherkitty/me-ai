# Quality Score

Tracks the health of each domain. Updated when significant changes land.

**Grading:** A (excellent) · B (good) · C (adequate) · D (needs work) · F (broken/missing)

## Core (Rust/WASM)

| Domain | Tests | Lint (Clippy) | Docs | Score | Notes |
|--------|-------|---------------|------|-------|-------|
| `db/` (Rexie schema + access) | — | Yes | agent spec | C | No unit tests for DB primitives |
| `storage/` (domain persistence) | `rules.rs` only | Yes | — | C | Most modules untested |
| `plugins/` (registry + executors) | `gmail`, `twitter`, `mod`, `registry`, `types`, `utils` | Yes | — | B | Good coverage |
| `llm/` (client + models + triage) | `client`, `models` | Yes | — | B | Triage untested |
| `api/` (Gmail + Twitter REST) | — | Yes | — | D | No tests |
| `integrations/` (OAuth) | — | Yes | — | D | No tests |
| `error.rs` | Yes | Yes | — | A | |
| `formatting.rs` | — | Yes | — | C | No tests for utility functions |

## Web (Svelte/TypeScript)

| Domain | Tests | Lint (ESLint) | Type-check | Score | Notes |
|--------|-------|---------------|------------|-------|-------|
| Chat (`components/chat/`) | — | Yes | Yes | D | No tests |
| Sources (`components/sources/`) | — | Yes | Yes | D | No tests |
| Actions/Pipelines (`components/actions/`) | — | Yes | Yes | D | No tests |
| Dashboard (`components/dashboard/`) | — | Yes | Yes | D | No tests |
| Stores (`lib/store/`) | — | Yes | Yes | D | No tests |
| LLM engines (`lib/llm-engine.ts` etc.) | — | Yes | Yes | D | No tests |
| Triage (`lib/triage.ts`) | `triage.test.ts` | Yes | Yes | C | |
| Export utilities | `markdown-export`, `json-export`, `html-to-markdown` | Yes | Yes | B | |
| LLM context (`lib/`) | `llm-context.test.ts` | Yes | Yes | C | |
| E2E | `app.spec.ts` (1 file) | — | — | D | Single spec, some tests skip on CI |

## Documentation

| Area | Score | Notes |
|------|-------|-------|
| `.cortex/` knowledge base | B | Created PR #73; needs iteration as code evolves |
| Agent specs (`.agents/`) | B | Current; `me-ai-web.md` intentionally removed |
| `README.md` | B | Fixed in PR #73 |
| `me-ai-core/REFERENCE.md` | B | External reference patterns |

## Priority gaps

1. **Test coverage across web** — most components and stores have zero tests
2. **Core API/integration tests** — Gmail and Twitter API wrappers untested
3. **E2E expansion** — single spec doesn't cover the three-step flow
