# Three-Step User Flow

The app is structured around three explicit steps that the user progresses through in order.

## Step 1 — Sources (`#sources`)

Connect accounts and browse raw data.

- **Gmail** — OAuth sign-in, sync inbox to IndexedDB
- **Twitter/X** — OAuth sign-in, sync timeline
- **Future:** Telegram, Slack, etc.

## Step 2 — Scan (`#scan`)

Run the LLM classifier over synced data. Review categorized results.

- LLM assigns each item an **event type** + **category** (NOISE / INFO / CRITICAL)
- Results are stored as `emailClassifications` in IndexedDB
- User can review, override, or re-classify

Scan is the bridge between Sources and the Control Plane — it transforms raw data
into typed events that the pipeline system can act on.

## Step 3 — Control Plane

Configure and monitor the automated pipeline system.

| Route | Purpose |
|-------|---------|
| `#pipelines` | Edit category-default and per-type pipelines |
| `#approvals` | Review and approve CRITICAL events |
| `#stream` | Live event stream |
| `#audit` | Audit trail of all executed actions |

## Flow diagram

```
Sources (Gmail, Twitter…)
    │
    ▼
  Scan (LLM Classifier)
    │
    ├── NOISE / INFO → auto-execute pipeline
    │
    └── CRITICAL → awaiting_user → Approvals
                                       │
                                       ▼
                                   Execute (with audit)
```
