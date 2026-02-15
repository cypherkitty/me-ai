---
name: merge-pr
description: Merge a pull request safely with all required checks. Use when the user says "merge", "merge the PR", "let's merge", "ship it", or asks to complete/land a pull request. Enforces CI pass, comment resolution, and squash merge.
---

# Merge Pull Request

Safely merge a PR with all mandatory checks. Never skip steps.

**CRITICAL: Never merge automatically.** After completing all checks (CI, comments), always stop and ask the user for explicit confirmation before merging. The user may have additional instructions, want to review something first, or need to coordinate timing.

## Procedure

### Step 0: Ask for confirmation

After creating a PR or when the user mentions merging, **always ask the user first**:
- Report: CI status, comment status, PR summary
- Then ask: "Ready to merge?" or "Shall I squash merge this?"
- **Wait for explicit "yes" / confirmation before proceeding to the merge step.**
- Do NOT merge just because all checks pass. The user decides when.

### Step 1: Identify the PR

First, check if the current branch already has an open PR:

```bash
gh pr list --head "$(git branch --show-current)"
```

**If the current branch has an open PR, always reuse it.** Push new commits to the same branch — do NOT create a new branch or a new PR. The existing PR will update automatically.

If no PR exists for the current branch, list all open PRs:

```bash
gh pr list --state open
```

If multiple PRs are open, ask the user which one to merge.

### Step 2: Check CI status

```bash
gh pr checks <PR_NUMBER>
```

- **All checks must pass.** If any check is `pending`, wait and re-check (sleep 15–30s between attempts, up to 5 minutes).
- If a check **fails**, stop. Report the failure to the user. Do NOT merge.

### Step 2.5: Verify preview deployment

If a `preview` check exists in the PR checks output:

1. Find the preview URL from the PR issue comments (the bot posts it):

```bash
gh api repos/{owner}/{repo}/issues/<PR_NUMBER>/comments --jq '.[].body' | grep 'pr-preview'
```

The preview URL follows the pattern: `https://cypherkitty.github.io/me-ai/pr-preview/pr-<PR_NUMBER>/`

2. Navigate to the preview URL using the browser and verify the page loads:
   - Use `browser_navigate` to open the preview URL
   - Use `browser_snapshot` to confirm the page rendered (look for the nav bar with "me-ai", "Chat", "Dashboard" links)
   - Take a screenshot for the user if needed

3. Report the preview status alongside CI and comment status.

If no `preview` check exists (e.g., docs-only changes), skip this step.

### Step 3: Check PR comments

```bash
gh api repos/{owner}/{repo}/pulls/<PR_NUMBER>/comments
```

Also check review comments:

```bash
gh api repos/{owner}/{repo}/pulls/<PR_NUMBER>/reviews
```

- If there are **unresolved comments or change requests**, stop. Show the comments to the user and address them. After fixing, push changes and go back to Step 2.
- If there are **no comments** or all are resolved/approved, proceed.

### Step 4: Squash merge

**ALWAYS use squash merge. Never regular merge or rebase.**

```bash
gh pr merge <PR_NUMBER> --squash
```

### Step 5: Update local main

```bash
git checkout main && git pull
```

### Step 6: Confirm

Report to the user:
- PR number and title
- Merge status (success)
- Any post-merge actions (e.g., deploy triggered)

## Rules

- **Always ask before merging.** Never merge without explicit user confirmation. Report status, then wait for a "yes".
- **Never push directly to main.** All changes go through PRs.
- **Never merge with failing CI.** Wait or fix first.
- **Never merge with unaddressed comments.** Resolve everything.
- **Always squash merge.** Clean history, one commit per feature.
- **Never skip steps.** Even if the user says "just merge it", run all checks first and inform them of any issues.
