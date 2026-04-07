# Event Stream Model

The system is built on an event-stream model: all data (emails, tweets, etc.)
flows through as **events**, each classified into a **type** and **category**.

## Event anatomy

```
Event
├── type     — fine-grained label (e.g. NEWSLETTER, BILLING_REMINDER)
│             emergent: LLM-created or user-created, not a fixed enum
│             stored in: sm_event_types (with category_name)
│
├── category — coarse-grained tier: NOISE | INFO | CRITICAL
│             drives default pipeline + execution policy
│             stored in: sm_event_categories
│
└── data     — the raw payload (email body, tweet content, etc.)
```

## Execution policies

| Category | Policy | Behavior |
|----------|--------|----------|
| NOISE | `auto` | Pipeline runs without user interaction |
| INFO | `auto` | Pipeline runs without user interaction |
| CRITICAL | `manual` | Requires explicit user approval |

## Chat as control interface

The chat renders both text responses and structured event/command cards.

**Message types:**
1. **Flat/regular** — plain text (user questions, LLM replies)
2. **Typed** — structured: event(s) grouped by type/category + pipeline + visual components

**LLM control tags** (invisible, stripped by UI):
- `[EXECUTE:CATEGORY:{EventType}]` — auto-execute the pipeline batch for pending events
- `[SHOW:DASHBOARD]` — render the interactive events-by-category dashboard

CRITICAL events show an amber **approval card** in chat instead of a direct execute button.
The card displays all pipeline steps before execution.
