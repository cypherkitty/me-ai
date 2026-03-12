# Best practices reference

This crate aligns with patterns from **meta-secret-core**. A copy is kept locally for reference:

```bash
# Refresh the reference repo (run from anywhere)
git clone --depth 1 https://github.com/meta-secret/meta-secret-core.git /tmp/meta-secret-core
```

## Key paths in the reference repo

| What | Path |
|------|------|
| Workspace deps (versions) | `/tmp/meta-secret-core/meta-secret/Cargo.toml` |
| Core crate (errors, tracing) | `/tmp/meta-secret-core/meta-secret/core/` |
| Core errors (thiserror, `#[from]`, tests) | `core/src/errors/mod.rs` |
| WASM crate (tracing-web, boundary) | `/tmp/meta-secret-core/meta-secret/wasm/` |
| WASM lib (configure, JsError::from) | `wasm/src/lib.rs` |
| WASM utils (panic hook) | `wasm/src/utils.rs` |

## Patterns we follow

- **Error handling**: `thiserror` for `CoreError`; `#[error(transparent)]` and `#[from]` for wrapping; convert to `JsValue` (or `JsError`) at the WASM boundary only.
- **Dependencies**: Pin same versions as meta-secret where shared: `thiserror`, `anyhow`, and optionally `derive_more`, `tracing`, `tracing-web`; pin `serde` / `serde_json` for consistency.
- **Tracing (WASM)**: Use `tracing` + `tracing-web`; optional init in an `init`/`configure` step with `MakeWebConsoleWriter` and a static guard; no default `tracing-subscriber` in WASM.
- **WASM boundary**: Keep core logic in Rust; convert errors at the boundary (e.g. `error_to_js(&e)` or `.map_err(JsError::from)?`); use `serde_wasm_bindgen` for (de)serialization.

## Refreshing the reference

When updating patterns or versions, re-run the clone command above to refresh `/tmp/meta-secret-core`.
