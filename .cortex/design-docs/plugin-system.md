# Plugin System

Plugins provide functionality to work with external services — calling APIs directly
(Gmail, Twitter, filesystem, HTTP).

## Architecture

All plugin logic lives in `me-ai-core/src/plugins/`:

```
plugins/
├── mod.rs          — Public types, registry access, execute_pipeline/batch
├── registry.rs     — PluginRegistry: resolves plugin by source, routes execution
├── resolution.rs   — Pipeline resolution: category defaults → type overrides → rules
├── types.rs        — ActionInput, EventInput, PipelineResult, etc.
├── traits.rs       — Plugin trait definition
├── utils.rs        — Shared utilities
├── gmail.rs        — Gmail plugin: trash, archive, mark_read, label, etc.
├── twitter.rs      — Twitter plugin: like, retweet, bookmark, mute, block, etc.
├── filesystem.rs   — Filesystem plugin
└── http.rs         — HTTP plugin
```

## Plugin resolution flow

```
Event arrives with (type, category)
    │
    ├─ 1. Check sm_rules for matching rule → if found, use rule's commands
    │
    ├─ 2. Check sm_type_pipeline for per-type override → if found, use it
    │
    └─ 3. Fall back to sm_category_pipeline for category default pipeline
```

## Adding a new plugin

1. Create `plugins/{name}.rs` implementing the plugin trait
2. Register it in `plugins/registry.rs`
3. Add any new action handlers
4. Update the triage system prompt if the plugin introduces new event types
5. Expose any new WASM methods on `MeAiCore` in `lib.rs`

## Key types (defined in `plugins/types.rs`)

- `ActionInput` — plugin_id + command_id + params
- `EventInput` — the event payload passed to pipeline execution
- `PipelineResult` / `PipelineBatchResult` — execution outcomes
- `PluginDefinition` — metadata for the plugin registry UI
- `ActionMetadata` — describes available actions per plugin
