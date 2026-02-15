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
- The **only** exception is if the user explicitly says "push to main without a PR".

### Branch Naming

```
feature/*    — new functionality (feature/export-email-markdown)
fix/*        — bug fixes (fix/html-entity-decoding)
refactor/*   — code restructuring (refactor/extract-components)
docs/*       — documentation (docs/update-cursor-rules)
chore/*      — tooling, dependencies (chore/add-vitest)
test/*       — test additions (test/markdown-export)
```

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

### Merging (MANDATORY checks before merge)

1. **CI must pass** — verify with `gh pr checks <PR_NUMBER>`. Do NOT merge if any check is failing or pending.
2. **All PR comments must be addressed** — check with `gh api repos/{owner}/{repo}/pulls/{N}/comments`. Resolve every comment before merging. If a comment requests changes, make the fix, push, and verify CI again.
3. **Squash merge**: `gh pr merge N --squash`
4. After merge, the deploy workflow auto-triggers for `main` pushes.
5. Pull latest main after merging: `git checkout main && git pull`

## CI Pipeline

### Test Workflow (`.github/workflows/ci.yml`)

Runs on: **every PR** to `main` and **every push** to `main`.

```yaml
steps:
  - checkout
  - setup node 20 + npm cache
  - npm ci
  - npm run test:ci
```

### Deploy Workflow (`.github/workflows/deploy.yml`)

Runs on: **push to `main`** only (and manual `workflow_dispatch`).

```yaml
steps:
  - checkout
  - setup node 20 + npm cache
  - npm ci
  - npm run build
  - upload dist/ as pages artifact
  - deploy to GitHub Pages
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

### Test Location

Tests live next to the source they cover:

```
src/lib/
  markdown-export.js
  __tests__/
    markdown-export.test.js       — pure logic tests (Node env)
    html-to-markdown.test.js      — DOM-dependent tests (jsdom env)
```

Convention: `src/lib/__tests__/<module>.test.js`

### Writing Tests

```js
import { describe, it, expect } from "vitest";
import { myFunction } from "../my-module.js";

describe("myFunction", () => {
  it("does the expected thing", () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
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

### Vite Base Path

```js
// vite.config.js
base: process.env.GITHUB_ACTIONS ? "/me-ai/" : "/",
```

Local dev serves at `/`, GitHub Pages at `/me-ai/`. This is set via the `GITHUB_ACTIONS` env var which is automatically present in CI.

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
