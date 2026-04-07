# Taskfile architecture

The root `Taskfile.yml` is an **orchestration layer only** — it contains no inline task logic.
All package-level tasks live in the Taskfile of the package that owns them, then get included
into the root under a namespace.

## Structure

```
Taskfile.yml                        ← root: includes + orchestration tasks
me-ai-core/Taskfile.yml             ← included as  core:*
me-ai-web/Taskfile.yml              ← included as  web:*
tools/cortex-check/Taskfile.yml     ← included as  cortex:*
```

## Namespaces and working directories

| Namespace | Source file | Working directory |
|-----------|-------------|-------------------|
| `core:*` | `me-ai-core/Taskfile.yml` | `me-ai-core/` |
| `web:*` | `me-ai-web/Taskfile.yml` | `me-ai-web/` |
| `cortex:*` | `tools/cortex-check/Taskfile.yml` | repo root |

The `dir` is set on the `includes` entry in the root Taskfile (not repeated in each task).
This means tasks in `me-ai-core/Taskfile.yml` can write `cargo build .` instead of
`cargo build me-ai-core/` — the working directory is already correct.

Tools under `tools/` that need to reference paths relative to the repo root (like
`cortex-check`) are included without a `dir` override so they run from the repo root.

## Task reference

### Root (cross-package orchestration only)

A task belongs in the root only if it **must coordinate across multiple namespaces**.
Single-package tasks belong in their own Taskfile.

| Task | What it does |
|------|--------------|
| `install` | `core:build` (dep) → `web:install` |
| `install:ci` | `core:build` (dep) → `web:install:ci` |
| `restart` | Wipes `me-ai-core/pkg` → `core:build` → `web:copy-core` → `web:kill-dev` → `web:dev` |
| `ci` | Full pipeline — see [ci-cd.md](../ci-cd.md) |
| `deploy-build` | `install:ci` → `web:build` |

### `core:*` (me-ai-core/Taskfile.yml)

| Task | What it does |
|------|--------------|
| `core:build` | `wasm-pack build . --target web --out-dir pkg` |
| `core:clippy` | `cargo clippy --target wasm32-unknown-unknown -- -D warnings` |
| `core:test` | `cargo test --lib` |

### `web:*` (me-ai-web/Taskfile.yml)

| Task | What it does |
|------|--------------|
| `web:install` | `npm install` → `web:copy-core` |
| `web:install:ci` | `npm install` with one-retry esbuild fallback → `web:copy-core` |
| `web:build` | `npm run build` (Vite production build) |
| `web:dev` | `npm run dev` |
| `web:kill-dev` | `pkill` Vite and npm dev processes |
| `web:copy-core` | Syncs `me-ai-core/pkg` → `node_modules/me-ai-core` |
| `web:check` | `svelte-check` |
| `web:lint` | ESLint |
| `web:knip` | Dead code detection |
| `web:format:check` | Prettier check |
| `web:test` | Vitest (`npm run test:ci`) |
| `web:test:e2e` | Playwright (installs Chromium) |

### `cortex:*` (tools/cortex-check/Taskfile.yml)

| Task | What it does |
|------|--------------|
| `cortex:check` | Rust binary — link integrity + store inventory check |

## Adding a new package or tool

1. Create `<location>/Taskfile.yml` with `version: "3"` and the package's tasks.
2. Add an entry under `includes:` in the root `Taskfile.yml`:
   ```yaml
   includes:
     <namespace>:
       taskfile: ./<location>/Taskfile.yml
       dir: ./<location>   # omit if the tool needs to run from repo root
   ```
3. Reference the tasks in root orchestration tasks using `<namespace>:<task>`.
4. Run `task --list` to confirm everything resolves.

**Rule:** a task belongs in the root only if it coordinates across multiple namespaces.
The moment it only touches one package, move it to that package's Taskfile.

**Constraint:** included Taskfiles cannot reference sibling namespaces. Only the root can call
`core:*`, `web:*`, and `cortex:*` together — which is exactly why cross-package orchestration
tasks must live in root.
