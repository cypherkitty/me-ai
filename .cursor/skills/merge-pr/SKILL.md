---
name: merge-pr
description: Merge a pull request safely with all required checks. Use when the user says "merge", "merge the PR", "let's merge", "ship it", or asks to complete/land a pull request. Enforces CI pass, comment resolution, and squash merge.
---

# Merge Pull Request

Safely merge a PR with all mandatory checks. Never skip steps.

## Procedure

### Step 1: Identify the PR

```bash
gh pr list --state open
```

If multiple PRs are open, ask the user which one to merge.
If on a feature branch, use the PR for the current branch:

```bash
gh pr list --head "$(git branch --show-current)"
```

### Step 2: Check CI status

```bash
gh pr checks <PR_NUMBER>
```

- **All checks must pass.** If any check is `pending`, wait and re-check (sleep 15–30s between attempts, up to 5 minutes).
- If a check **fails**, stop. Report the failure to the user. Do NOT merge.

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

- **Never push directly to main.** All changes go through PRs.
- **Never merge with failing CI.** Wait or fix first.
- **Never merge with unaddressed comments.** Resolve everything.
- **Always squash merge.** Clean history, one commit per feature.
- **Never skip steps.** Even if the user says "just merge it", run all checks first and inform them of any issues.
