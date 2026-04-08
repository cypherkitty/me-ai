# CI / CD

Four workflow files live under [`.github/workflows/`](../.github/workflows/). Most jobs delegate to the root [`Taskfile.yml`](../Taskfile.yml) after installing Node, Rust, wasm-pack, and Task.

## Reproduce GitHub CI locally

The **CI** workflow’s only substantive step is `task ci` (see [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)).

From the **repository root**, with the same tooling CI expects:

| Requirement | Notes |
|---------------|--------|
| [Task](https://taskfile.dev) v3 | `arduino/setup-task@v2` on CI |
| Node **20** | CI uses `actions/setup-node@v4` with `node-version: 20` (match this locally to avoid engine warnings) |
| Rust **stable** + `wasm32-unknown-unknown` | `dtolnay/rust-toolchain@stable` on CI |
| **wasm-pack** | CI: `curl … wasm-pack/installer/init.sh`; deploy/preview: `jetli/wasm-pack-action@v0.4.0` |

Run:

```bash
task ci
```

That runs, in order: `install:ci` (dependency) then `cortex:check`, `core:clippy`, `web:format:check`, `web:check`, `web:lint`, `web:knip`, `core:test`, `web:test`, `web:test:e2e` — see the root `Taskfile.yml` `ci` task. No workflow YAML change is needed when you add steps there; only change [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) if the **runner environment** (versions, caches, secrets) must change.

---

## Workflows at a glance

| Workflow file | Trigger | Job | What it does |
|---------------|---------|-----|--------------|
| [`ci.yml`](../.github/workflows/ci.yml) | PR to `main`, push to `main` | `test` | Full quality gate (`task ci`) |
| [`deploy.yml`](../.github/workflows/deploy.yml) | Push to `main`, manual dispatch | `deploy` | Build + publish to GitHub Pages |
| [`preview.yml`](../.github/workflows/preview.yml) | PR opened / updated / closed | `preview` | Build + publish ephemeral PR preview |
| [`cortex-gardening.yml`](../.github/workflows/cortex-gardening.yml) | Weekly (Mon 09:00 UTC), manual | `gardening` | `cursor-agent` drift check → optional GitHub issue |

---

## CI ([`ci.yml`](../.github/workflows/ci.yml)) — the quality gate

Runs on every PR and every push to `main`. A PR **must** pass this before merge.

**Runner steps:** checkout → Node 20 + npm cache (`me-ai-web/package.json`) → Rust stable + wasm32 → wasm-pack (curl installer) → Task → **`task ci`**.

**What `task ci` does (in order):**

1. `install:ci` — `core:build` (wasm-pack) + `npm install` with one-retry esbuild workaround + `web:copy-core`
2. `cortex:check` — Rust binary verifies `.cortex/` link integrity and store inventory (see [rust-tooling.md](references/rust-tooling.md))
3. `core:clippy` — Rust lints on `wasm32-unknown-unknown` target, `-D warnings`
4. `web:format:check` — Prettier formatting check on `me-ai-web/src/`
5. `web:check` — `svelte-check` (TypeScript + Svelte types)
6. `web:lint` — ESLint on `me-ai-web/src/`
7. `web:knip` — dead code / unused exports detection
8. `core:test` — Rust unit tests (`cargo test --lib`)
9. `web:test` — Vitest (`vitest run`)
10. `web:test:e2e` — Playwright E2E against a dev server (Chromium)

Task names follow the `<namespace>:<task>` convention — see [taskfile-architecture.md](references/taskfile-architecture.md).

**Environment:** Ubuntu `ubuntu-latest`, Node 20, Rust stable + `wasm32-unknown-unknown`, wasm-pack (curl installer).

If any step fails, the workflow fails. There are no skipped steps in CI (Playwright may report individual tests as skipped by design).

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
| Node 20 | `actions/setup-node@v4` + npm cache on `me-ai-web/package.json` | Same; **deploy** omits `cache: npm` so `file:../me-ai-core/pkg` is never stale |
| Rust + wasm32 | `dtolnay/rust-toolchain@stable` | Same |
| wasm-pack | **curl** official installer | `jetli/wasm-pack-action@v0.4.0` |
| Task | `arduino/setup-task@v2` | Same |

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
2. Add it to the `ci` task's `cmds` list in the root `Taskfile.yml` using its namespaced name
3. The GitHub Actions workflow picks it up automatically — no YAML change needed

Only touch `.github/workflows/` if you need to change triggers, environment, secrets, or external actions.
