# Execution Plans

Execution plans are first-class artifacts for complex, multi-step work.
They are checked into the repo so agents can operate without external context.

## When to create a plan

- Multi-day features spanning core + web
- Architectural migrations
- Any work involving 5+ files or 3+ PRs

## Structure

```
exec-plans/
├── active/         ← plans currently in progress
├── completed/      ← finished plans (kept for history)
└── README.md       ← this file
```

## Plan template

```markdown
# [Feature/Migration Name]

**Status:** active | completed | abandoned
**Created:** YYYY-MM-DD
**Owner:** [who is driving this]

## Goal
One-paragraph summary of what this plan achieves.

## Steps
- [ ] Step 1 — description
- [ ] Step 2 — description
- [ ] Step 3 — description

## Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|

## Notes
Anything learned during execution.
```
