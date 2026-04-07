# CI / CD

Three GitHub Actions workflows cover verification, deployment, and PR previews.
All of them delegate to `Taskfile.yml` — they set up the environment, then run `task`.

## Workflows at a glance

| Workflow | Trigger | Job | What it does |
|----------|---------|-----|--------------|
| `ci.yml` | PR to `main`, push to `main` | `test` | Full quality gate |
| `deploy.yml` | Push to `main`, manual dispatch | `deploy` | Build + publish to GitHub Pages |
| `preview.yml` | PR opened / updated / closed | `preview` | Build + publish ephemeral PR preview |
| `cortex-gardening.yml` | Weekly (Mon 09:00 UTC), manual | `gardening` | Cursor agent drift check → GitHub issue |

---

## CI (`ci.yml`) — the quality gate

Runs on every PR and every push to `main`. A PR **must** pass this before merge.

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

**Environment:** Node 20, Rust stable + `wasm32-unknown-unknown`, wasm-pack (via curl installer).

If any step fails, the workflow fails. There are no skipped steps in CI.

---

## Deploy (`deploy.yml`) — production release

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

## PR Preview (`preview.yml`) — ephemeral preview per PR

Runs on every PR open, update (synchronize), and close.

**What it does:**

- On open/update: `task deploy-build` with `VITE_BASE="./"` (relative asset paths for subdirectory hosting), then deploys to `gh-pages` under `pr-preview/pr-{number}/`
- On close: tears down the preview directory automatically

**Preview URL pattern:** `https://cypherkitty.github.io/me-ai/pr-preview/pr-{number}/`

Uses `rossjrw/pr-preview-action` which posts the preview URL as a PR comment and handles cleanup.

---

## Environment setup (shared across all workflows)

| Tool | How it's installed |
|------|-------------------|
| Node 20 | `actions/setup-node@v4` |
| Rust stable + `wasm32-unknown-unknown` | `dtolnay/rust-toolchain@stable` |
| wasm-pack | `jetli/wasm-pack-action@v0.4.0` (deploy/preview) or curl installer (CI) |
| Task | `arduino/setup-task@v2` |

---

## Cortex Gardening (`cortex-gardening.yml`) — weekly drift check

Runs every Monday at 09:00 UTC (and on manual `workflow_dispatch`).

**What it does:**

1. Collects all files changed in the last 7 days (excluding `.cortex/` and `.cursor/` themselves).
2. Passes the list + recent commit log to a Cursor agent (`PunGrumpy/cursor-action@main`).
3. The agent reads `.cortex/` and reports any documentation that may be stale.
4. If drift is found, a GitHub issue is opened with label `cortex-gardening`.
5. If nothing changed, or the agent reports "No drift detected.", no issue is opened.

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
