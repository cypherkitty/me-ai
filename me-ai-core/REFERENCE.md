# Best practices reference

This crate aligns with patterns from **memento-ai** (specifically the `nervoset/app` workspace). A copy is kept locally for reference:

```bash
# Refresh the reference repo (run from anywhere)
git clone --depth 1 https://github.com/meta-secret/memento-ai.git /tmp/memento-ai
```

## Key paths in the reference repo

All paths below are relative to `/tmp/memento-ai`:

| What | Path |
|------|------|
| Workspace deps (versions) | `nervoset/app/Cargo.toml` |
| Core crate (business logic, tracing) | `nervoset/app/nervo_core/` |
| WASM crate (browser boundary) | `nervoset/app/nervo_wasm/` |
| WASM lib (client, tracing setup) | `nervoset/app/nervo_wasm/src/lib.rs` |
| WASM utils (panic hook) | `nervoset/app/nervo_wasm/src/utils.rs` |
| WASM errors \+ JS boundary | `nervoset/app/nervo_wasm/src/common/errors.rs` |

## Patterns we follow

- **Workspace dependencies**: Use a shared workspace `Cargo.toml` for versions (see `nervoset/app/Cargo.toml`); keep core crates on workspace deps like `thiserror`, `anyhow`, `tracing`, `serde`, `serde_json`, `async-openai`, `tokio`, `sqlx`.
- **Core crate layout**: Keep business logic in a dedicated core crate (`nervo_core`) with feature-specific modules under `src/` (e.g. `ai`, `db`, `models`, `config`, `context`, `telegram`, `utils`).
- **Error handling (core)**: Use `thiserror` enums for domain errors, with `#[from]` for wrapping lower-level errors; keep error types in core and convert them only at boundaries (server/WASM).
- **WASM error handling**: Mirror the `NervoWebAppError` pattern: `thiserror` + `error-stack::Report` and a type alias (e.g. `type WebResult<T> = Result<T, WebError>`); implement `From<WebError> for JsValue` that serializes a rich error (via `serde_wasm_bindgen`) rather than just a string (see `nervoset/app/nervo_wasm/src/common/errors.rs`).
- **Tracing (WASM)**: Use `tracing` + `tracing-web` with a console writer and a performance layer, configured once (see `NervoClient::configure_tracing` in `nervoset/app/nervo_wasm/src/lib.rs`); avoid global subscribers elsewhere in WASM.
- **Panic handling (WASM)**: Set the `console_error_panic_hook` once during initialization via a small helper (`set_panic_hook` in `nervoset/app/nervo_wasm/src/utils.rs`) gated behind the `console_error_panic_hook` feature.
- **HTTP in WASM**: Use `reqwest::Client` inside the WASM crate for HTTP calls, even though it compiles down to `fetch` in the browser (see `NervoClient` methods that call the backend and parse JSON).
- **Markdown / UI transforms**: Treat markdown-to-HTML transforms at the WASM boundary (e.g. `markdown_to_html` in `nervoset/app/nervo_wasm/src/lib.rs`) instead of pushing that logic down into core.
- **Async flow**: Use `async`/`await` and `error_stack::ResultExt` to attach context to errors around network calls and JSON parsing; keep `.unwrap()` limited to places where panics are explicitly acceptable during development.

## Refreshing the reference

When updating patterns or versions, re-run the clone command above to refresh `/tmp/memento-ai`, and re-check the files listed in **Key paths**.
