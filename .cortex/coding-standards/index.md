# Coding Standards

Language-level rules for this repository. These are **non-negotiable** — violations must be
fixed, not worked around. Each standard is grounded in a core belief; the belief gives the
"why", this directory gives the "how".

## Standards

| Standard | Language | Core belief |
|----------|----------|-------------|
| [`typescript.md`](typescript.md) | TypeScript / Svelte | #12 — No null in TypeScript |
| [`rust.md`](rust.md) | Rust / WASM | #13 — Type-driven development |

## Where they are enforced

- **TypeScript**: ESLint rules + `svelte-check` type-checking in CI (`task ci`).
- **Rust**: Clippy lints + compiler errors in CI (`task ci`).
- **Both**: `cortex-check` verifies this directory is cross-linked correctly.
