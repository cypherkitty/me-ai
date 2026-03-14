# me-ai-core — Spec for AI Agents

- Rust/WebAssembly business logic and persistence layer. 
- Browser-only. 
- No server. 
- All data in IndexedDB via Rexie. 
- me-ai-web calls WASM functions only — no direct DB access from TypeScript.

## Tech Stack

Rust, wasm-bindgen, rexie (IndexedDB), serde, thiserror. Build: wasm-pack, target web.

## Structure

- `src/lib.rs` — WASM API surface, all #[wasm_bindgen] exports
- `src/error.rs` — error types
- `src/db/` — persistence layer
  - `rexie_schema.rs` — IndexedDB store definitions, RexieDb
  - `access.rs` — Rexie primitives (store_get, store_put, store_scan, etc.)
- `src/domain/` — domain logic
  - `app.rs` — schema init, seed data, settings
  - `audit.rs`, `classifications.rs`, `events.rs`, `items.rs`, `pipelines.rs`, `rules.rs`, `rules_data.rs`, `sync.rs`
- `src/plugins/` — plugin metadata (actions, scopes, source mapping); execution stays in TS

## WASM API (main groups)

- Initialization
- Settings
- Table Utilities
- Event Types & Categories
- Items
- Sync State
- Contacts
- Email Classifications
- Audit Log
- Pipelines & Configuration
- Sources/Actions/Plugins
- Rules
- Events (Stream).

## Database Schema

DB name: `"me-ai"`, version 1. Composite keys use pipe delimiter (e.g. `"plugin|action"`).

**User data:** items, syncState, contacts, settings, auditLog, emailClassifications  
**Reference:** sm_event_types, sm_event_categories, sm_sources, sm_actions, sm_plugins  
**Config:** sm_plugin_actions, sm_plugin_sources, sm_category_pipeline, sm_type_pipeline  
**Rules:** sm_rules, sm_rule_triggers, sm_rule_commands, sm_rule_policies, sm_events

## Business Logic

- `create_schema_and_migrations()` — opens Rexie (creates stores), seeds reference data if sm_event_types is empty
- All access via db.rs primitives; sorting/pagination done in Rust (IndexedDB has no multi-column order)

## Build

`wasm-pack build me-ai-core --target web --out-dir me-ai-core/pkg`. 
Output: ES module JS glue + WASM binary. me-ai-web imports from `file:../me-ai-core/pkg`.

## Conventions

- No DB logic in TypeScript — all via WASM
- No fallbacks — fail explicitly
- Key injection for composite keys; serde_wasm_bindgen with serialize_maps_as_objects(true) at boundary
