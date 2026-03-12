---
description: Ensure the AI understands the n8n.io-like dynamically generated action flow architecture.
alwaysApply: true
---

# n8n-like Architecture (Dynamic Action Flow)

The fundamental architectural principle of me-ai is modeled after **n8n.io** workflows, but heavily driven by the LLM on the frontend.
**DO NOT hardcode action pipelines.**

## 1. Trigger / Extraction (LLM Triage)

When a new event (e.g. email) arrives, the LLM dynamically extracts:

- **`action`** — the **event type** (e.g. `PROMOTION`, `INVOICE`, `SECURITY_ALERT`, `SHIPPING_UPDATE`). 
  Event types are emergent: the LLM creates them from message content; they are not a fixed enum.
- **`category`** — one of three **event categories**: `noise` | `info` | `critical`. 
  This tier drives both the **default pipeline** and the **execution policy** (auto / manual).

The LLM does **not** suggest concrete actions or command IDs. 
Categories carry their own default pipelines; the classifier only assigns type + category.

## 2. Event Types and Event Categories

- **Event type**: Fine-grained label per message (e.g. `NEWSLETTER`, `BILLING_REMINDER`). 
  Stored in `sm_event_types` with a `category_name`. Many event types can share one category.
- **Event category**: Coarse-grained bucket with a **default pipeline** and **execution policy**. Stored in `sm_event_categories`. The three categories are:
  - `noise` — auto-delete (e.g. trash); policy `auto`
  - `info` — useful but not urgent; policy `auto`
  - `critical` — requires attention; policy `manual` (user approval)

Execution policies: `auto` (run without user), `manual` (wait for approval).

## 3. Pipeline Resolution (Category-Based + Optional Overrides)

Pipelines are **not** seeded from LLM output. Resolution order:

1. **Per-type override**: If the event type has a user-defined pipeline in `sm_type_pipeline`, use it.
2. **Category default**: Otherwise, look up the event type’s category in `sm_event_types`, then use that category’s default pipeline from `sm_category_pipeline`.

So: **categories carry default pipelines**; optional **per-event-type overrides** exist for special cases. 
Users manage category pipelines and overrides in the UI (e.g. Action Pipeline Editor / Rules view).

## 4. Rules (Alternative Trigger → Actions Path)

**Rules** are another way to bind triggers to actions: a Rule has triggers (event_type and/or event_category), 
an ordered list of plugin commands, and an execution policy. 
Stored in `sm_rules`, `sm_rule_triggers`, `sm_rule_commands`, `sm_rule_policies`. 
At execution time, matching rules are considered first; if a rule matches and has actions, those are used. 
Otherwise, the category-based pipeline (above) is used.

## 5. Execution (Plugin Registry)

When a pipeline runs, the **PluginRegistry** routes each step to the correct plugin (e.g. `GmailPlugin`) 
and executes the specific command (e.g. `trash`, `archive`), tracking success or failure per step.

## Directives

- **Never hardcode pipelines.** Pipelines come from category defaults, per-type overrides, or rules.
- **Never hardcode event types.** Event types are discovered by the LLM or created by the user.
- **Do not reintroduce suggestedActions.** The LLM outputs only event type + category; categories (and optional overrides/rules) define the actions.
- When adding a new feature, think in terms of:
  1. Is this a new plugin command?
  2. How does it appear in the pipeline / Rules UI?
  3. Does the triage system prompt need changes for event type or category? (Prompt is built dynamically; plugin list is for context only.)
