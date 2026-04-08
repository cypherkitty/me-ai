# Rexie / IndexedDB Patterns

Conventions for the persistence layer in `me-ai-core/src/db/` and how it relates to the rest of the browser stack.

## Storage policy (application data)

**Rexie-backed IndexedDB is the only permitted persistence for app state.** The web layer must not use `localStorage`, `sessionStorage`, or ad-hoc IndexedDB opens. Everything goes through `MeAiCore` (WASM), which owns the single database named `"me-ai"`.

| Concern | Where it lives |
|---------|----------------|
| Settings, tokens, OAuth PKCE pending, chat snapshot key, scan history, etc. | `settings` store (and other Rexie stores) via `me-ai-core` |
| User data (items, rules, classifications, …) | Domain stores in `me-ai-core/src/db/` |
| Verbose mount/debug logging | `SettingValue.debugLogging` → `debugLogging` key in `settings` (load/save via `loadSettings` / `saveSettings`) |
| Transformer model weights | **Cache API** (browser), used by `@huggingface/transformers` — not Rexie; `nukeAllLocalData` in `me-ai-web` still clears caches for a full reset |

Vitest cannot run Rexie; tests mock `me-ai-core` at the WASM boundary rather than touching `localStorage`.

## Schema definition (`rexie_schema.rs`)

- DB name: `"me-ai"`
- Object stores and indexes are defined in the Rexie builder
- `store` constants module provides store name strings
- `RexieDb` wraps `Rexie` and is built once at init via `RexieDb::new().await`

## Access primitives (`access.rs`)

All reads/writes go through these functions:

| Function | Purpose |
|----------|---------|
| `store_get(db, store, key)` | Get single record by key |
| `store_put(db, store, value)` | Upsert a record (key extracted from value) |
| `store_put_all(db, store, values)` | Batch upsert |
| `store_delete(db, store, key)` | Delete by key |
| `store_clear(db, store)` | Clear all records in store |
| `store_count(db, store)` | Count records |
| `index_count(db, store, index, key)` | Count by index value |
| `store_get_all(db, store)` | Get all records |
| `index_get_all(db, store, index, key)` | Get all by index |
| `index_scan(db, store, index, range)` | Range scan on index |
| `key_range_only(value)` | Create an IDBKeyRange for exact match |

## Conventions

- **`DbRef<'a>`** — copy wrapper around `&'a Rexie`, passed into domain calls via `db.db()`
- **Composite keys** — pipe delimiter (e.g. `"plugin_name|action_name"`); key field is always `"id"`
- **Key paths** — baked into `store_put`'s match block; keep in sync with `rexie_schema.rs`
- **Serialization** — `serde_wasm_bindgen::Serializer::new().serialize_maps_as_objects(true)` for puts
- **Deserialization** — `serde_wasm_bindgen::from_value`
- **Invalid keys** — `store_get`/`store_delete` silently no-op on `""`, `"null"`, `"undefined"`
- **Transactions** — one transaction per primitive call; always `tx.done().await` to commit

## Store inventory

**User data:** `items`, `syncState`, `contacts`, `settings`, `auditLog`, `emailClassifications`  
**Reference:** `sm_event_types`, `sm_event_categories`, `sm_sources`, `sm_actions`, `sm_plugins`  
**Config:** `sm_plugin_actions`, `sm_plugin_sources`, `sm_category_pipeline`, `sm_type_pipeline`  
**Rules:** `sm_rules`, `sm_rule_triggers`, `sm_rule_commands`, `sm_rule_policies`, `sm_events`
