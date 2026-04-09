# Taskfile architecture

The root `Taskfile.yml` is the **orchestration layer**: it wires included namespaces and defines
cross-package flows.
All package-level tasks live in the Taskfile of the package that owns them, then get included
into the root under a namespace.

## Structure

```
Taskfile.yml                        ← root: includes + cross-package orchestration only
Taskfile.ci.yml                     ← included as  ci:*  (repo root, dir: .)
Taskfile.docker.yml                 ← included as  docker:*  (repo root, dir: .)
me-ai-core/Taskfile.yml             ← included as  core:*
me-ai-web/Taskfile.yml              ← included as  web:*
tools/cortex-check/Taskfile.yml     ← included as  cortex:*
```

## Namespaced task groups

**Prohibited:** Defining tasks in the **root** `Taskfile.yml` whose YAML keys look like a namespace plus task name (e.g. `docker:build:`, `docker:rust-test:`). That duplicates what Task’s `includes` already provides and clutters the orchestration file.

**Required:** For a cohesive tool group (Docker, CI pipelines, etc.), add a **separate Taskfile** and include it:

```yaml
includes:
  docker:
    taskfile: ./Taskfile.docker.yml
    dir: .
```

Inside that file, task names are **short** (`build`, `rust-test`, `web-local`). Invocations are still `task docker:build`, `task docker:rust-test` — the `docker:` prefix comes **only** from the include key, not from hand-written colonated names in the root.

**Not covered by this rule:** Root tasks like `install:ci` or `deploy-build` that are true cross-package orchestration steps (single flow, not a whole sub-tooling surface). Prefer short, descriptive root names where possible; use a dedicated included Taskfile when a **family** of related commands appears.

## Namespaces and working directories

| Namespace | Source file | Working directory |
|-----------|-------------|-------------------|
| `core:*` | `me-ai-core/Taskfile.yml` | `me-ai-core/` |
| `web:*` | `me-ai-web/Taskfile.yml` | `me-ai-web/` |
| `cortex:*` | `tools/cortex-check/Taskfile.yml` | repo root |
| `docker:*` | `Taskfile.docker.yml` | repo root |
| `ci:*` | `Taskfile.ci.yml` | repo root |

The `dir` is set on the `includes` entry in the root Taskfile (not repeated in each task).
This means tasks in `me-ai-core/Taskfile.yml` can write `cargo build .` instead of
`cargo build me-ai-core/` — the working directory is already correct.

Tools under `tools/` that need to reference paths relative to the repo root (like
`cortex-check`) are included without a `dir` override so they run from the repo root.
`docker:*` and `ci:*` use `dir: .` so commands see the repo root as context.

## Task reference

### Root (cross-package orchestration only)

A task belongs in the root only if it **must coordinate across multiple namespaces**.
Single-package tasks belong in their own Taskfile.

| Task | What it does |
|------|--------------|
| `install` | `core:build` (dep) → `web:install` |
| `install:ci` | `core:build` (dep) → `web:install:ci` |
| `restart` | Wipes `me-ai-core/pkg` → `core:build` → `web:copy-core` → `web:kill-dev` → `web:dev` |
| `ci` | Thin alias → **`ci:full`** ([`Taskfile.ci.yml`](../../Taskfile.ci.yml)) |
| `deploy-build` | `install:ci` → `web:build` |

### `ci:*` ([`Taskfile.ci.yml`](../../Taskfile.ci.yml))

CI pipelines only; may call `core:*`, `web:*`, and `cortex:*`. See [ci-cd.md](../ci-cd.md).

| Task | What it does |
|------|--------------|
| `ci:full` | `install:ci` (dep) → cortex + `core:clippy` + web checks + `core:test` + `web:test` + `web:test:e2e` |
| `ci:docker` | After Docker populated `me-ai-core/pkg`: `web:install:ci` → cortex + web checks/tests (no `core:build` / `core:clippy` / `core:test`) |

### `docker:*` ([`Taskfile.docker.yml`](../../Taskfile.docker.yml))

Vars: `REGISTRY` (default `me-ai`), `PUSH_CACHE` (optional registry cache write). See [ci-cd.md](../ci-cd.md) § Docker builds.

| Task | What it does |
|------|--------------|
| `docker:build` | `docker buildx bake --load default` |
| `docker:push` | `docker buildx bake --push default` |
| `docker:run` | `docker:build` (dep) → `docker run` (host 8080 → container 3000) |
| `docker:web-local` | Bake `web-output` → `me-ai-web/dist-docker/` |
| `docker:wasm-local` | Bake `wasm-output` → `me-ai-core/pkg-docker/` |
| `docker:rust-test` | Bake `rust-test` stage (`cargo test --lib` in core) |
| `docker:bake-ci` | `docker buildx bake ci` (same targets as GitHub Actions; set `CACHE_GHA=1` for GHA cache backend) |

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

1. Create `<location>/Taskfile.yml` with `version: "3"` and the package's tasks (or a root-level `Taskfile.<group>.yml` for repo-root tools like Docker).
2. Add an entry under `includes:` in the root `Taskfile.yml`:
   ```yaml
   includes:
     <namespace>:
       taskfile: ./<location>/Taskfile.yml
       dir: ./<location>   # use `.` if commands must run from repo root (e.g. docker)
   ```
3. Reference the tasks in root orchestration tasks using `<namespace>:<task>`.
4. Run `task --list` to confirm everything resolves.

**Rule:** a task belongs in the root only if it coordinates across multiple namespaces.
The moment it only touches one package — or forms a **group** of same-domain commands (Docker, …) — move it to that package’s Taskfile or to a dedicated included file (see **Namespaced task groups** above).

**Constraint:** package Taskfiles (`me-ai-core/`, `me-ai-web/`, …) **cannot** reference sibling namespaces. **Root** and repo-root includes **`ci:*`** and **`docker:*`** are where cross-namespace orchestration lives: `ci:*` may call `core:*`, `web:*`, and `cortex:*`; `docker:*` runs Buildx only. Keep **short** task names inside each included file.
