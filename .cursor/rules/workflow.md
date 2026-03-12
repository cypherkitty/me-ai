---
description: Git workflow, CI/CD, testing, and deployment practices
alwaysApply: true
---

# me-ai — Workflow

## Git Workflow

### Branch & PR Policy (MANDATORY)

- **NEVER push directly to `main`.**
- **Every feature, refactor, bug fix, or docs update** must go through a pull request.
- If no feature branch exists yet, create one before committing.
- **One open PR at a time.** If there is already an open PR (on the current branch or any branch), push new work to that existing PR's branch. Do NOT create a new branch or a new PR while one is already open. The existing PR updates automatically when you push commits.
- **Only create a new PR after the previous one is merged.** When the user says "merge" / "ship it" / "let's merge", merge the current PR first (via the `merge-pr` skill), then create a new branch and PR for the next piece of work.
- The **only** exception is if the user explicitly says "push to main without a PR" or explicitly asks for a separate PR.

### Commit Conventions

- Use conventional commit prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`
- Keep commits focused — one logical change per commit
- Write commit messages that explain **why**, not just **what**
- Use HEREDOC for multi-line commit messages

### PR Requirements

- **Title**: concise, describes the change (e.g. `fix: decode all HTML entities in Gmail message bodies`)
- **Body**: must include `## Summary` (1-3 bullet points) and `## Test plan` (verification steps)
- Push branch with `git push -u origin HEAD` before creating PR
- Use `gh pr create` — never create PRs through other means
- Return the PR URL to the user when done
- Wait for CI checks to pass before merging

### Merging (MANDATORY — all checks must pass before merge)

**For the full step-by-step merge procedure, use the `merge-pr` skill (`.cursor/skills/merge-pr/SKILL.md`).**

Core rules (non-negotiable):
1. **Always ask before merging** — never merge automatically. Report CI/comment status, then ask the user for explicit confirmation. The user may have additional instructions.
2. **CI must pass** — do NOT merge if any check is failing or pending.
3. **All PR comments must be addressed** — resolve every comment before merging.
4. **ALWAYS squash merge** — `gh pr merge N --squash`. Never regular merge or rebase. Squash keeps `main` history clean with one commit per feature/fix.
5. After merge, the deploy workflow auto-triggers for `main` pushes.
6. Pull latest main after merging: `git checkout main && git pull`

## CI Pipeline

Build and test use the **Taskfile** (see Architecture rule: "Building with Taskfile"). CI installs Rust, wasm-pack, and Task, then runs `task ci`.

### Test Workflow (`.github/workflows/ci.yml`)

Runs on: **every PR** to `main` and **every push** to `main`.

```yaml
steps:
  - checkout
  - setup node 20 + npm cache (me-ai-web/package.json)
  - setup Rust (stable + wasm32-unknown-unknown)
  - install wasm-pack
  - setup Task
  - run: task ci   # install (build:core + npm install) → unit tests → E2E tests
```

### Deploy Workflow (`.github/workflows/deploy.yml`)

Runs on: **push to `main`** only (and manual `workflow_dispatch`).

```yaml
steps:
  - checkout
  - setup node 20 + npm cache (me-ai-web/package.json)
  - setup Rust (stable + wasm32-unknown-unknown)
  - jetli/wasm-pack-action
  - setup Task
  - run: task deploy-build   # install (build:core + npm install) then npm run build
  - peaceiris/actions-gh-pages (publish_dir: me-ai-web/dist)
```

Both workflows are independent — tests gate PRs, deploy handles releases.

## Testing

### Framework

- **Vitest** — native Vite integration, zero extra config, reuses `vite.config.js`
- Tests run in Node by default — fast, no DOM overhead for pure logic
- Tests that need DOM APIs (e.g. `DOMParser`) use `@vitest-environment jsdom` directive at the top of the file

### Scripts

```bash
npm test        # watch mode — re-runs on file changes (for development)
npm run test:ci # single run — exits with code 0/1 (for CI)
```

**Guidelines:**
- Test pure functions first — they're the easiest and highest-value targets
- Use descriptive `it()` names that read like sentences
- Group tests by function using `describe()` blocks
- Create shared fixtures at the top of the test file
- Avoid testing locale-dependent output (like date formatting) with exact matches — use `toContain()` or structural checks instead
- Keep tests independent — no shared mutable state between tests

### What to Test

Priority order for adding tests:
1. **Utility functions** in `lib/` — pure input/output, no DOM
2. **Data transformations** — email parsing, format conversions, error parsing
3. **Worker message protocol** — message shape validation (future)
4. **Component logic** — extracted into testable functions where possible

### What NOT to Test (Yet)

- Svelte component rendering (would need `@testing-library/svelte` + jsdom)
- Browser APIs (OAuth, clipboard, file download)
- WebGPU / model inference

## Deployment

### GitHub Pages

- **URL**: `https://cypherkitty.github.io/me-ai/`
- **Repository**: `cypherkitty/me-ai` (public)
- **Branch**: `main` (auto-deploys on push)

### Deployment Checklist (for new features)

1. PR created and CI passes
2. Squash merge to `main`
3. Deploy workflow triggers automatically
4. Verify at `https://cypherkitty.github.io/me-ai/`
5. If OAuth is involved, ensure Google Cloud Console has the correct redirect URIs

### Monitoring Deploys

```bash
gh run list --limit 3                    # recent workflow runs
gh pr checks <PR_NUMBER>                 # CI status on a PR
gh run watch <RUN_ID>                    # live follow a run
```
