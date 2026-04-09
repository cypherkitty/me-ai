# CI / CD

Four workflow files live under [`.github/workflows/`](../.github/workflows/). **CI on GitHub** builds Rust/WASM and runs core tests **in Docker** (Buildx + [`docker-bake.hcl`](../docker-bake.hcl) group `ci`), then runs **`task ci:docker`** for web install and JS checks. **Deploy / preview** still use `task deploy-build` (native wasm-pack + Vite on the runner).

## Reproduce GitHub CI locally

**Same as GitHub Actions (Docker-backed):** from the repo root, with Docker Buildx and Task:

```bash
CACHE_GHA=1 docker buildx bake ci
mkdir -p me-ai-core/pkg && cp -a me-ai-core/pkg-docker/. me-ai-core/pkg/
task ci:docker
```

(`CACHE_GHA=1` switches bake to `type=gha`-style cache entries; locally that is optional — omit it to use registry cache hints from [`docker-bake.hcl`](../docker-bake.hcl) or no remote cache.)

**Full native pipeline (no Docker):** matches historical behaviour and is still useful locally:

| Requirement | Notes |
|---------------|--------|
| [Task](https://taskfile.dev) v3 | `arduino/setup-task@v2` on CI for `ci:docker` only; full `task ci` needs this |
| Node **20** | `actions/setup-node@v4` with `node-version: 20` |
| Rust **stable** + `wasm32-unknown-unknown` | `dtolnay/rust-toolchain@stable` |
| **wasm-pack** | Only for `task ci` / `task install` (not for GitHub CI’s Docker path) |

```bash
task ci
```

That runs `install:ci` then `cortex:check`, `core:clippy`, web checks, `core:test`, `web:test`, `web:test:e2e` — see [`Taskfile.ci.yml`](../Taskfile.ci.yml) task **`ci:full`** (root `task ci` delegates to it).

Change [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) when the **Docker / runner environment** (caching, permissions, Node/Rust versions for `ci:docker`) must change.

---

## Workflows at a glance

| Workflow file | Trigger | Job | What it does |
|---------------|---------|-----|--------------|
| [`ci.yml`](../.github/workflows/ci.yml) | PR to `main`, push to `main` | `ci` | Docker `buildx bake ci` (GHA cache) + cache verification + `task ci:docker` |
| [`deploy.yml`](../.github/workflows/deploy.yml) | Push to `main`, manual dispatch | `deploy` | Build + publish to GitHub Pages |
| [`preview.yml`](../.github/workflows/preview.yml) | PR opened / updated / closed | `preview` | Build + publish ephemeral PR preview |
| [`cortex-gardening.yml`](../.github/workflows/cortex-gardening.yml) | Weekly (Mon 09:00 UTC), manual | `gardening` | `cursor-agent` drift check → optional GitHub issue |

---

## CI ([`ci.yml`](../.github/workflows/ci.yml)) — the quality gate

Runs on every PR and every push to `main`. A PR **must** pass this before merge.

**Permissions:** `contents: read`, **`actions: write`** (required so BuildKit can use the [`type=gha` cache backend](https://docs.docker.com/build/cache/backends/gha/)).

**Runner steps (summary):**

1. **Docker Buildx** — `docker buildx bake ci` with `CACHE_GHA=1` (see [`docker-bake.hcl`](../docker-bake.hcl) group **`ci`**): builds **`web-image`**, runs **`rust-test`** and **`wasm-clippy`** stages, exports wasm **`pkg`** to `me-ai-core/pkg-docker/` via **`wasm-local`**.
2. **Cache verification** — Immediately runs `docker buildx bake web-image --progress=plain` again and **fails** if fewer than **8** log lines contain `CACHED` (guards against a broken or disabled BuildKit cache on the runner).
3. **Sync pkg** — `cp` from `me-ai-core/pkg-docker/` into `me-ai-core/pkg/` for the `file:` dependency.
4. **Node 20** + npm cache, **Rust stable** + wasm32 (for `cortex-check` and toolchain consistency), **Task** → **`task ci:docker`**.

**What runs in Docker vs `ci:docker`:**

| Step | Where |
|------|--------|
| wasm-pack production build, Vite production build | Dockerfile → `web-image` |
| `cargo test --lib` | Dockerfile → `rust-test` |
| `cargo clippy` wasm32 `-D warnings` | Dockerfile → `wasm-clippy` |
| `web:install:ci`, `cortex:check`, Prettier, svelte-check, ESLint, knip, Vitest, Playwright | `task ci:docker` on the runner |

**`ci:docker`** ([`Taskfile.ci.yml`](../Taskfile.ci.yml)) runs, in order: `web:install:ci`, `cortex:check`, `web:format:check`, `web:check`, `web:lint`, `web:knip`, `web:test`, `web:test:e2e`.

**Caching:** With `CACHE_GHA=1`, bake uses **`cache-from` / `cache-to` `type=gha,scope=me-ai`** so layers persist across workflow runs. **Fork PRs** set **`CACHE_GHA_RO=1`** (no `cache-to`) because the token cannot write Actions cache; they still **read** cache when GitHub allows.

**Native equivalent:** `task ci` still exists for local full-native runs (includes `install:ci`, `core:clippy`, `core:test`). Task names follow the `<namespace>:<task>` convention — see [taskfile-architecture.md](references/taskfile-architecture.md).

If any step fails, the workflow fails. Playwright may report individual tests as skipped by design.

---

## Deploy ([`deploy.yml`](../.github/workflows/deploy.yml)) — production release

Runs on every push to `main` (so after a PR merges) and can be triggered manually via `workflow_dispatch`.

**What it does:**

1. `task deploy-build` — `install:ci` then `npm run build` (Vite production build)
2. Publishes `me-ai-web/dist/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`

**Key details:**
- `keep_files: true` — preserves `pr-preview/` subdirectories on `gh-pages` when a production deploy runs, so existing PR previews are not wiped.
- `concurrency: pages-deploy` — only one deploy runs at a time; a newer push cancels the in-flight one.
- No npm cache here (intentional): the `file:../me-ai-core/pkg` local link is built fresh each time, and a stale cache can leave an empty `node_modules/me-ai-core`.

**Live URL:** https://cypherkitty.github.io/me-ai/

---

## PR Preview ([`preview.yml`](../.github/workflows/preview.yml)) — ephemeral preview per PR

Runs on every PR open, update (synchronize), and close.

**What it does:**

- On open/update: `task deploy-build` with `VITE_BASE="./"` (relative asset paths for subdirectory hosting), then deploys to `gh-pages` under `pr-preview/pr-{number}/`
- On close: tears down the preview directory automatically

**Preview URL pattern:** `https://cypherkitty.github.io/me-ai/pr-preview/pr-{number}/`

Uses `rossjrw/pr-preview-action` which posts the preview URL as a PR comment and handles cleanup.

---

## Environment setup (shared across workflows)

| Tool | CI (`ci.yml`) | Deploy / preview |
|------|----------------|------------------|
| Docker / Buildx | `docker/setup-buildx-action@v3`; **`docker buildx bake ci`** + GHA cache | — |
| Node 20 | After Docker bake: `actions/setup-node@v4` + npm cache on `me-ai-web/package.json` | Same; **deploy** omits `cache: npm` so `file:../me-ai-core/pkg` is never stale |
| Rust + wasm32 | After Docker: `dtolnay/rust-toolchain@stable` (cortex-check; core already built in Docker) | Same |
| wasm-pack | Not installed on CI (WASM built in Docker) | `jetli/wasm-pack-action@v0.4.0` |
| Task | `arduino/setup-task@v2` → **`task ci:docker`** | Same |

---

## Cortex Gardening ([`cortex-gardening.yml`](../.github/workflows/cortex-gardening.yml)) — weekly drift check

Runs every Monday at 09:00 UTC (and on manual `workflow_dispatch`).

**What it does:**

1. Collects paths touched in the last 7 days (`git log --since`, excluding `.cortex/` and `.cursor/`). If none, the job no-ops.
2. Installs the **Cursor CLI** (`curl -fsSL https://cursor.com/install | sh`) and restores auth from the `CURSOR_CLI_CONFIG` secret into `~/.cursor/cli-config.json`.
3. Runs **`cursor-agent`** in ask mode (`--print --output-format text --mode ask`) with a fixed prompt that lists key `.cortex/` files, the changed paths, and recent commits; the model must either list concrete drift or reply exactly `No drift detected.`
4. **`actions/github-script@v7`** reads `/tmp/agent-output.txt`: if the summary is not `No drift detected.`, it opens an issue labeled `cortex-gardening`; otherwise it skips.

**Auth setup (one-time, local):**

```bash
cursor-agent login          # opens browser, authenticates with your Cursor account
cat ~/.cursor/cli-config.json   # copy the full JSON output
```

Then store it as a GitHub secret:
→ GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
→ Name: `CURSOR_CLI_CONFIG`, Value: the JSON from above

No separate API key or paid plan needed — uses your regular Cursor account session. The `authId` field inside that JSON is the session credential the CLI uses.

This is the semantic layer that `cortex:check` (structural, always-on) cannot cover alone.

---

## Adding or changing CI steps

Tasks are split across package Taskfiles — see [taskfile-architecture.md](references/taskfile-architecture.md).

To add a new check:
1. Add the task to the relevant package Taskfile (e.g. `me-ai-web/Taskfile.yml`)
2. Add it to the **`ci:docker`** and/or **`ci:full`** task `cmds` in [`Taskfile.ci.yml`](../Taskfile.ci.yml) (GitHub uses `ci:docker`; native `task ci` uses `ci:full` via the root alias).
3. If the check belongs in Docker (Rust compile, new binary test), extend the [`Dockerfile`](../Dockerfile) and [`docker-bake.hcl`](../docker-bake.hcl) group **`ci`** as needed.

Touch [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) when changing Docker setup, cache verification, or runner tool versions for `ci:docker`. Other workflow files: triggers, secrets, external actions.

---

## Docker builds (optional)

Container builds use the repo-root [`Dockerfile`](../Dockerfile) and [`docker-bake.hcl`](../docker-bake.hcl). **Orchestration is Task** via [`Taskfile.docker.yml`](../Taskfile.docker.yml) (included as `docker:*` from the root Taskfile). **GitHub CI** runs `docker buildx bake ci` with **`CACHE_GHA=1`** (and **`CACHE_GHA_RO=1`** on fork PRs) for the [GHA cache backend](https://docs.docker.com/build/cache/backends/gha/); locally use **`PUSH_CACHE=1`** for registry cache writes or leave both unset for offline builds.

| Artifact | Notes |
|----------|--------|
| Rust toolchain | `rust:bookworm` — Docker’s **latest stable** Rust on Debian bookworm (`ARG RUST_VERSION=bookworm`; pin with e.g. `1.85.0-bookworm` via build-arg). |
| Rust **build cache** | **[cargo-chef](https://github.com/LukeMathWalker/cargo-chef):** `chef-planner` builds a recipe from `Cargo.toml` + a stub `src/lib.rs` (so the heavy **dependency** layer rebuilds only when dependencies change, not when application Rust changes). `chef-cacher` runs `cargo chef cook` for `wasm32-unknown-unknown`. **`wasm-builder`** copies that `target/` then the real `me-ai-core/` sources and runs `wasm-pack` (incremental compile for the crate). **BuildKit cache mounts** on `cargo` registry/git speed repeated fetches; `rust-test` also mounts registry/git/`target` for repeated native test runs. Dockerfile uses `# syntax=docker/dockerfile:1` so cache mounts resolve. |
| Final **`web` image** | Node 20 slim + global [`serve`](https://www.npmjs.com/package/serve) on port **3000** (`-s dist` for SPA fallback). No nginx. |
| Bake outputs | `wasm-output` / `web-output` scratch stages for exporting artifacts |

**Optional (repo policy):** committing a **`Cargo.lock`** for `me-ai-core` (even if the crate stays unpublished) makes dependency versions fully pinned for chef and for local `cargo`; today the lockfile is gitignored, so Docker resolves semver ranges at build time like a fresh `cargo build`.

**Commands** (repo root, Docker running):

```bash
task docker:build                    # load $(REGISTRY)/web:latest (default REGISTRY=me-ai)
task docker:run                       # build + run → http://localhost:8080
task docker:push PUSH_CACHE=1          # push + remote cache (after registry login)
task docker:web-local                 # dist → me-ai-web/dist-docker/
task docker:wasm-local                # pkg → me-ai-core/pkg-docker/
task docker:rust-test                 # core lib tests in a Rust stage
task docker:bake-ci CACHE_GHA=1       # same targets as CI (GHA cache when env set)
```

Override image prefix: `task docker:build REGISTRY=ghcr.io/myorg`.

The **CI** workflow is Docker-first for Rust/WASM/Vite; see § CI ([`ci.yml`](../.github/workflows/ci.yml)).
