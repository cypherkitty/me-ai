# Category-Based Pipeline Architecture

**Status:** Active  
**Last updated:** 2026-03-03

---

## Overview

The category-based pipeline model is an RBAC-like approach to event routing. Instead of creating individual pipeline rules for each event type (which causes proliferation), **categories carry default pipelines** and AI-generated event types are grouped into categories.

```
Incoming Message → AI classifies → Event Type → belongs to → Category
                                                                │
                                                     Default Pipeline
                                                     (ordered actions)
                                                                │
                                              Optional per-type override
```

---

## Core Concepts

### Event Type
A fine-grained label assigned by the AI classifier to each incoming message. Event types are **emergent** — the LLM creates them dynamically based on message content.

- Analogous to a **Linux user** or **RBAC permission**
- Examples: `PROMOTION`, `INVOICE`, `SECURITY_ALERT`, `SHIPPING_UPDATE`, `NEWSLETTER`
- Stored in `sm_event_types` with a `category_name` FK and `auto_created` flag
- Many event types can belong to one category

### Event Category
A coarse-grained bucket that carries a **default pipeline** and an **execution policy**. Categories are few, memorable, and user-managed.

- Analogous to a **Linux group** or **RBAC role**

| Category | Default Pipeline | Policy | Description |
|----------|-----------------|--------|-------------|
| 🗑 `noise` | `gmail:trash` | `auto` | Spam, mass marketing, social digests. Auto-deleted. |
| 📋 `informational` | `gmail:mark_read` → `gmail:archive` | `supervised` | Newsletters, shipping updates, confirmations. Silently archived. |
| ⭐ `important` | _(none)_ | `manual` | Personal messages, invoices, account changes. User must act. |
| 🚨 `urgent` | _(none)_ | `manual` | Security alerts, payment failures, deadlines. Immediate action needed. |

### Execution Policy
Controls whether the agent acts autonomously or defers to the user.

| Policy | Behavior |
|--------|----------|
| `auto` | Agent executes immediately, no user involvement |
| `supervised` | Agent executes, then notifies user |
| `manual` | Agent waits for explicit user approval |

### Pipeline Override
An optional per-event-type pipeline that **overrides** the category's default. Used when a specific event type needs special handling that differs from its category.

- Example: `INVOICE` is in `important` category (no default actions), but user adds a custom override pipeline: `[star, mark_important]`
- Stored in `sm_type_pipeline`

---

## Flow

```
1. Message arrives from Source (Gmail, Twitter, etc.)
       │
       ▼
2. AI classifier assigns:
   - event_type (e.g., PROMOTION)  ← fine-grained
   - category (e.g., noise)        ← coarse-grained
       │
       ▼
3. Event type persisted in sm_event_types with category_name
       │
       ▼
4. Pipeline resolution (getPipelineForEvent):
   a. Check sm_type_pipeline for per-type override → use it if found
   b. Otherwise, look up category from sm_event_types
   c. Use sm_category_pipeline for category's default pipeline
       │
       ▼
5. Execution policy from sm_event_categories:
   - auto       → dispatch actions immediately
   - supervised → dispatch actions, then notify user
   - manual     → wait for user approval, then dispatch
       │
       ▼
6. Actions dispatched via the Plugin that handles the source
       │
       ▼
7. Audit trail recorded in sm_events
```

---

## Database Schema

### sm_event_categories — Category definitions with policies
```sql
CREATE TABLE sm_event_categories (
  name     VARCHAR PRIMARY KEY,   -- 'noise', 'informational', 'important', 'urgent'
  label    VARCHAR,
  priority INTEGER,               -- 1 (lowest) to 4 (highest)
  policy   VARCHAR DEFAULT 'manual' -- 'auto' | 'supervised' | 'manual'
);
```

### sm_event_types — Event type definitions with category assignment
```sql
CREATE TABLE sm_event_types (
  name          VARCHAR PRIMARY KEY,   -- 'PROMOTION', 'INVOICE', etc.
  label         VARCHAR,
  category_name VARCHAR DEFAULT 'important',  -- FK to sm_event_categories
  auto_created  BOOLEAN DEFAULT false          -- true = created by AI
);
```

### sm_category_pipeline — Default pipeline actions for each category
```sql
CREATE TABLE sm_category_pipeline (
  category_name VARCHAR,   -- FK to sm_event_categories
  action_idx    INTEGER,   -- execution order (0, 1, 2...)
  plugin_id     VARCHAR,   -- e.g., 'gmail'
  command_id    VARCHAR,   -- e.g., 'gmail:trash'
  PRIMARY KEY (category_name, action_idx)
);
```

### sm_type_pipeline — Optional per-type override pipeline
```sql
CREATE TABLE sm_type_pipeline (
  type_name  VARCHAR,      -- FK to sm_event_types
  action_idx INTEGER,
  plugin_id  VARCHAR,
  command_id VARCHAR,
  PRIMARY KEY (type_name, action_idx)
);
```

---

## LLM Classification Format

The AI classifier produces a JSON object for each message:

```json
{
  "action": "EVENT_TYPE_NAME",
  "category": "noise",
  "reason": "One sentence explaining why",
  "summary": "2-3 sentence summary",
  "tags": ["tag1", "tag2"]
}
```

**Key changes from the previous model:**
- `group` → `category` (4 values instead of 2)
- `suggestedActions` **removed** — categories carry pipelines now
- LLM's job is purely classification, not action suggestion

---

## Key API Functions (rules.js)

| Function | Description |
|----------|-------------|
| `getPipelineForEvent(eventType)` | Resolves the pipeline: type override → category default |
| `getCategoryPipelines()` | Returns all categories with their pipelines and event types |
| `updateCategoryPipeline(cat, actions)` | Updates a category's default pipeline |
| `updateCategoryPolicy(cat, policy)` | Changes a category's execution policy |
| `moveEventTypeToCategory(type, cat)` | Moves an event type to a different category |

---

## UI: PipelinesView

The PipelinesView shows **4 category cards** (not individual rules):

Each card displays:
- Category icon, label, event type count
- Execution policy selector (auto / supervised / manual)
- Default pipeline (editable: add/remove actions)
- Expandable event types list (with drag-to-reassign)

---

## RBAC Analogy

| Pipeline Concept | RBAC Equivalent | Linux Equivalent |
|-----------------|-----------------|------------------|
| Event Type | Permission / User | User |
| Event Category | Role | Group |
| Category Pipeline | Role permissions | Group permissions |
| Type Override | User-specific permission | User-specific permission |
| Execution Policy | Approval workflow | sudo policy |

---

## Design Decisions

### Why categories over per-type rules?
- **Scalability**: Users see 4 categories, not 50+ auto-generated rules
- **Predictability**: All `noise` types go to trash; all `important` types wait for approval
- **Simplicity**: LLM just classifies; it doesn't need to know about actions
- **Flexibility**: Users can override any specific type when needed

### Why keep event types?
- They give the AI a **vocabulary** for classification
- They allow **per-type overrides** when one type in a category needs special handling
- They enable **analytics** (how many INVOICE events vs NEWSLETTER events)

### Migration from old model
- Old `sm_rules` / `sm_rule_triggers` / `sm_rule_commands` tables are kept for backward compat
- New code uses `getPipelineForEvent()` which reads from category/type pipeline tables
- Old seeded rules remain but are superseded by the category model
