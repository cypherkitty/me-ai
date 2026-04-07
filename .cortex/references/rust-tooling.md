# Rust tooling

Rust is the preferred language for all repository tooling — not just WASM business logic.
Dev tools, CI scripts, and build utilities should be written in Rust unless there is a hard
technical constraint that prevents it (see [exceptions](#exceptions) below).

## Why Rust for tooling

- **No runtime surprises** — binary runs identically everywhere; no Node.js version mismatch,
  no missing npm dep.
- **Compile-time guarantees** — if it compiles, the logic is sound. Parser edge-cases and
  off-by-one bugs are caught before CI runs.
- **Single binary** — CI installs nothing extra; `cargo run` from the workspace root.
- **Consistent style** — same language, same formatter (`rustfmt`), same linter (`Clippy`)
  as `me-ai-core`. Agents don't context-switch.
- **Fast** — tools like `cortex-check` take ~0.3 s including compile (dev profile, cached).

## Tool locations

All standalone Rust tools live under `tools/` at the repo root. Each tool is its own Cargo
project (its own `Cargo.toml`); they are **not** part of the `me-ai-core` WASM crate.

```
tools/
  cortex-check/       — structural integrity check for .cortex/
    Cargo.toml
    src/main.rs
```

Run any tool via Taskfile:

```
task cortex:check     # runs: cargo run --manifest-path tools/cortex-check/Cargo.toml
```

## cortex-check

`tools/cortex-check/` verifies the `.cortex/` knowledge base on every CI run.

**Checks (in order):**

1. **Link integrity** — every local markdown link inside `.cortex/**/*.md` resolves to a real
   file or directory.
2. **Entry-file links** — same check for `CLAUDE.md` and every `.agents/*.md` file.
3. **Store inventory** — the `## Store inventory` table in
   `.cortex/references/rexie-patterns.md` must exactly match the `pub const … &str` store
   names defined in `me-ai-core/src/db/rexie_schema.rs`. One missing or extra store is a CI
   failure.

Exit code `0` = all clean. Exit code `1` = one or more errors (printed to stderr).

Run locally: `task cortex:check`

## Adding a new tool

1. Create `tools/<name>/Cargo.toml` with `edition = "2021"` and `[[bin]]`.
2. Write `tools/<name>/src/main.rs` — no external crates unless essential; prefer `std`.
3. Add a Taskfile task: `cargo run --manifest-path tools/<name>/Cargo.toml`.
4. If it should run in CI, add it to the `ci` task in `Taskfile.yml`.

## Exceptions

Some scripts **cannot** be Rust because they run as npm lifecycle hooks:

| Script | Why it must be Node.js |
|--------|----------------------|
| `me-ai-web/scripts/ensure-core.cjs` | `postinstall` npm hook — runs before cargo is guaranteed to be available in an npm context |
| `me-ai-web/scripts/ensure-tslib.cjs` | Same; also downloads from npm registry inline |

These are intentional exceptions. Do not add new Node.js scripts outside this narrow category.
