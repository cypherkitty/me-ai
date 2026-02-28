# Signal Map — Event-Driven Agent Architecture

**Status:** Draft  
**Branch:** `feature/signal-map`  
**Last updated:** 2026-02-26

---

## Motivation

Modern people receive a continuous, high-volume stream of messages from many different platforms at the same time — emails, Telegram messages, Instagram posts, YouTube videos, Slack notifications, invoices, security alerts, and more. The sources are heterogeneous, the content varies wildly in urgency, and the right response is different for each combination of type, category, and context.

The goal of **me-ai** is to act as a personal AI agent that sits in front of this stream. Instead of the user manually triaging every message, the agent should:

1. **Continuously ingest** messages from all connected sources into a single unified event stream.
2. **Automatically classify** each event — understanding what it is (type) and how important it is (category).
3. **Route each event** through a user-defined pipeline of actions, either executing them autonomously or pausing for user approval depending on the stakes.
4. **Give the user full control** over how the pipeline is configured — without requiring any code changes. Adding a rule, changing what happens to ads, or switching a policy from auto to manual should be something any user can do through a UI.

The key insight is that the relationship between an event and what should happen to it is **not static**. It changes as the user's preferences evolve, as new sources are added, and as new types of content emerge. This rules out any hardcoded workflow. The system must be **fully dynamic**.

---

## Why Event Sourcing

The incoming data is modelled as an **event stream** rather than a mutable database of inboxes. This is a deliberate architectural choice:

- Every message that arrives becomes an immutable `Event` node. It is never updated in place.
- All state changes (classification, processing, action outcomes) are recorded as new relationships on that node, not as mutations of it.
- This gives a complete, queryable audit trail: for any event, you can always answer "what happened to this, and why?" by traversing its edges in the graph.
- It also makes the system naturally replayable — if a rule changes, you can re-evaluate past events against the new rule without data loss.

---

## Why a Graph Database (Neo4j)

A relational database would model the pipeline as foreign-key joins between static tables. This breaks down quickly when the relationships themselves need to be dynamic and user-editable:

- In SQL, changing what actions fire for a given event type means schema migrations or complex pivot table updates.
- In a graph, it means adding or removing a single edge. No migration, no downtime.

Neo4j was chosen because the entire architecture **is** a graph:

- Events connect to their types, categories, and sources.
- Rules connect to their triggers, actions, and policies.
- Plugins connect to the actions they provide and the sources they handle.
- Every relationship between these concepts is a first-class, traversable edge.

This means the pipeline editor UI can be built directly on top of graph mutations — creating a rule is a `CREATE` statement, disabling one is a property update, reordering actions is updating an `order` property on an edge.

---

## Why n8n-Inspired (Dynamic Pipelines, Not Hardcoded Workflows)

[n8n](https://n8n.io) is a workflow automation tool where users visually connect trigger nodes to action nodes to build pipelines. The key property is that the workflow is data, not code — users change it at runtime without deploying anything.

Signal Map applies the same principle to personal AI agents:

- **No hardcoded pipelines.** The agent does not have a fixed set of rules baked into the source code. All routing logic lives in the graph.
- **User-owned rules.** Every `Rule` node is owned by a `User`. Different users (or future multi-user scenarios) have independent pipeline configurations.
- **Live editing.** A user can open the pipeline editor, change "delete ads automatically" to "archive ads and notify me", and the next ad that arrives will follow the new rule — no restart, no deploy.
- **Extensibility through plugins.** Adding a new integration (e.g. WhatsApp) means adding a new `Plugin` node with its `Source` and `Action` edges. Existing rules that act on message types will automatically become available for the new source, with no rule changes needed.

---

## Overview

Signal Map is the routing and action layer of me-ai. It defines how incoming events (emails, messages, social posts, videos, etc.) are continuously classified, matched against user-defined rules, and dispatched to actions — either autonomously or with user approval.

The three axes of every routing decision are captured in a simple triple notation borrowed from the original design sketch:

```
event_type : action : execution_policy

Examples:
  ad            : delete      : auto
  newsletter    : archive     : auto
  personal_msg  : reply       : manual
  security_alert: escalate    : supervised
  invoice       : notify+fwd  : manual
```

Each triple maps to a **Rule node** in the graph. Rules are the central unit of the pipeline. They are explicit, first-class, user-owned, and fully editable at runtime.

---

## Core Concepts

### Event

An `Event` is a single incoming message from any source. It is raw data — it carries no routing logic.

```
(:Event)
  - id
  - content
  - sender
  - timestamp
  - status  ← completed | awaiting_user | failed | escalated

  -[:HAS_TYPE]→     (:EventType)
  -[:HAS_CATEGORY]→ (:EventCategory)
  -[:FROM_SOURCE]→  (:Source)
  -[:PROCESSED_BY]→ (:Rule)    ← added at runtime
  -[:ACTION_TAKEN]→ (:Action)  ← added at runtime
```

> **Important:** An Event never stores its own policy or routing decision. Those belong entirely to the Rule that matches it.

---

### EventType

What kind of content the event represents. Assigned by the AI classifier plugin.

Examples: `ad`, `newsletter`, `personal_message`, `work_email`, `instagram_post`, `youtube_video`, `security_alert`, `invoice`, `social_mention`, `startup_notification`

---

### EventCategory

The urgency/priority tier of the event. Assigned by the AI classifier alongside the type.

| Category | Meaning |
|----------|---------|
| `noise` | Low-priority automated content, no action needed |
| `informational` | Useful context, no action required |
| `important` | Requires attention but not immediately |
| `urgent` | Requires immediate user action |

---

### Source

Where the event originated. Determines which plugin handles actions on it.

Examples: `gmail`, `telegram`, `instagram`, `youtube`, `slack`, `twitter`

---

### Rule

The central pipeline unit. A Rule is the explicit, first-class node that connects a trigger condition to an action and a policy.

The canonical triple from the original design sketch — `ad : delete : auto` — maps directly to a Rule node:

```
(:Rule {name: "ad:delete:auto", priority: 10, enabled: true})
  -[:TRIGGERED_BY]->  (:EventType {name: "ad"})
  -[:EXECUTES {order: 1}]-> (:Action {name: "delete"})
  -[:WITH_POLICY]->   (:ExecutionPolicy {name: "auto"})
```

A Rule can have multiple `[:TRIGGERED_BY]` edges, combining `EventType` AND `EventCategory` conditions. It can also execute multiple actions in order via the `order` property on the `[:EXECUTES]` relationship.

**Key Rule properties:**

| Property | Description |
|----------|-------------|
| `id` | Unique identifier |
| `name` | Human-readable triple, e.g. `invoice:notify+forward:manual` |
| `description` | What this rule does |
| `enabled` | Toggle without deleting |
| `priority` | Higher = evaluated first (conflict resolution) |
| `created_at` | Timestamp |

---

### ExecutionPolicy

Controls whether the agent acts autonomously or defers to the user.

| Policy | Behavior |
|--------|----------|
| `auto` | Agent executes immediately, no user involvement |
| `supervised` | Agent executes but sends a post-action notification to user |
| `manual` | Agent drafts the action and waits for explicit user approval |

---

### Action

A discrete operation the agent can perform. Actions are not hardcoded — they are nodes in the graph, provided by plugins.

Examples: `delete`, `archive`, `mark_read`, `reply`, `forward`, `summarize`, `notify_user`, `tag`, `escalate`, `unsubscribe`

---

### Plugin

A plugin is a module that provides one or more Actions and handles one or more Sources. Disabling a plugin makes all its actions unavailable without touching any rules.

```
(:Plugin)-[:PROVIDES]->(:Action)
(:Plugin)-[:HANDLES_SOURCE]->(:Source)
```

Examples: `gmail_plugin`, `telegram_plugin`, `instagram_plugin`, `ai_summarizer`, `notifier`, `ai_classifier`

The `ai_classifier` plugin is special — it runs before all rules and assigns `EventType` and `EventCategory` to every raw incoming event.

---

## Graph Model

```
User ──OWNS──► Rule ──TRIGGERED_BY──► EventType
                │    └─TRIGGERED_BY──► EventCategory
                │
                ├──WITH_POLICY──► ExecutionPolicy
                │
                └──EXECUTES──► Action ──PROVIDED_BY──► Plugin
                                                         │
                                                   HANDLES_SOURCE
                                                         │
Event ──HAS_TYPE──► EventType                            ▼
Event ──HAS_CATEGORY──► EventCategory               Source
Event ──FROM_SOURCE──► Source ◄─────────────────────────┘
Event ──PROCESSED_BY──► Rule
Event ──ACTION_TAKEN──► Action
```

---

## Pipeline Lifecycle

```
1. Raw event arrives from a Source
       │
       ▼
2. ai_classifier plugin assigns EventType + EventCategory
       │
       ▼
3. Graph query: find all enabled Rules whose TRIGGERED_BY
   edges match this event's type and/or category
       │
       ▼
4. Rules sorted by priority (highest first)
       │
       ▼
5. For each matching Rule:
   a. Check ExecutionPolicy
   b. auto       → dispatch Actions immediately
   c. supervised → dispatch Actions, then notify user
   d. manual     → notify user, await approval, then dispatch
       │
       ▼
6. Actions dispatched via the Plugin that HANDLES_SOURCE
   for this event's source
       │
       ▼
7. PROCESSED_BY and ACTION_TAKEN edges written to Event node
   (full audit trail in graph)
```

---

## Example Rules

| Rule ID | Trigger | Action(s) | Policy | Description |
|---------|---------|-----------|--------|-------------|
| `rule_01` | EventType: `ad` | `delete` | `auto` | Auto-delete all ads |
| `rule_02` | EventType: `newsletter` | `archive` | `auto` | Auto-archive newsletters |
| `rule_03` | EventCategory: `noise` | `mark_read` | `auto` | Mark-read all noise |
| `rule_04` | EventType: `personal_message` + EventCategory: `important` | `notify_user` → `reply` | `manual` | Notify then draft reply |
| `rule_05` | EventType: `security_alert` | `escalate` | `supervised` | Escalate security alerts |
| `rule_06` | EventType: `youtube_video` | `summarize` | `auto` | Auto-summarize videos |
| `rule_07` | EventType: `invoice` | `notify_user` → `forward` | `manual` | Notify and forward invoices |

---

## Neo4j Cypher — Full Schema

### Constraints

```cypher
CREATE CONSTRAINT IF NOT EXISTS FOR (et:EventType) REQUIRE et.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (ec:EventCategory) REQUIRE ec.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (s:Source) REQUIRE s.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (a:Action) REQUIRE a.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (p:Plugin) REQUIRE p.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (ep:ExecutionPolicy) REQUIRE ep.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (r:Rule) REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (e:Event) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
```

### Seed Data

```cypher
// --- Execution Policies ---
CREATE (:ExecutionPolicy { name: "auto",       label: "Automatic",  description: "Agent executes without human input" });
CREATE (:ExecutionPolicy { name: "manual",     label: "Manual",     description: "Waits for explicit user approval" });
CREATE (:ExecutionPolicy { name: "supervised", label: "Supervised", description: "Executes then notifies user" });

// --- Event Types ---
CREATE (:EventType { name: "ad",                  label: "Advertisement" });
CREATE (:EventType { name: "newsletter",           label: "Newsletter" });
CREATE (:EventType { name: "personal_message",     label: "Personal Message" });
CREATE (:EventType { name: "work_email",           label: "Work Email" });
CREATE (:EventType { name: "instagram_post",       label: "Instagram Post" });
CREATE (:EventType { name: "youtube_video",        label: "YouTube Video" });
CREATE (:EventType { name: "security_alert",       label: "Security Alert" });
CREATE (:EventType { name: "invoice",              label: "Invoice" });
CREATE (:EventType { name: "social_mention",       label: "Social Mention" });
CREATE (:EventType { name: "startup_notification", label: "Startup Notification" });

// --- Event Categories ---
CREATE (:EventCategory { name: "noise",         label: "Noise" });
CREATE (:EventCategory { name: "informational", label: "Informational" });
CREATE (:EventCategory { name: "important",     label: "Important" });
CREATE (:EventCategory { name: "urgent",        label: "Urgent" });

// --- Sources ---
CREATE (:Source { name: "gmail",     label: "Gmail",     platform: "email",     api: "gmail_api_v1" });
CREATE (:Source { name: "telegram",  label: "Telegram",  platform: "messenger", api: "telegram_bot_api" });
CREATE (:Source { name: "instagram", label: "Instagram", platform: "social",    api: "instagram_graph_api" });
CREATE (:Source { name: "youtube",   label: "YouTube",   platform: "video",     api: "youtube_data_api_v3" });
CREATE (:Source { name: "slack",     label: "Slack",     platform: "messenger", api: "slack_web_api" });
CREATE (:Source { name: "twitter",   label: "Twitter/X", platform: "social",    api: "twitter_api_v2" });

// --- Plugins ---
CREATE (:Plugin { name: "gmail_plugin",     version: "2.1.0", enabled: true });
CREATE (:Plugin { name: "telegram_plugin",  version: "3.0.1", enabled: true });
CREATE (:Plugin { name: "instagram_plugin", version: "1.3.0", enabled: true });
CREATE (:Plugin { name: "ai_summarizer",    version: "1.0.0", enabled: true });
CREATE (:Plugin { name: "notifier",         version: "1.1.0", enabled: true });
CREATE (:Plugin { name: "ai_classifier",    version: "2.0.0", enabled: true });

// --- Actions ---
MERGE (:Action { name: "delete",      label: "Delete" });
MERGE (:Action { name: "archive",     label: "Archive" });
MERGE (:Action { name: "mark_read",   label: "Mark as Read" });
MERGE (:Action { name: "reply",       label: "Reply" });
MERGE (:Action { name: "forward",     label: "Forward" });
MERGE (:Action { name: "summarize",   label: "Summarize" });
MERGE (:Action { name: "notify_user", label: "Notify User" });
MERGE (:Action { name: "tag",         label: "Tag" });
MERGE (:Action { name: "escalate",    label: "Escalate" });
MERGE (:Action { name: "unsubscribe", label: "Unsubscribe" });

// --- Plugin → Action ---
MATCH (p:Plugin {name:"gmail_plugin"}),    (a:Action {name:"delete"})      CREATE (p)-[:PROVIDES]->(a);
MATCH (p:Plugin {name:"gmail_plugin"}),    (a:Action {name:"archive"})     CREATE (p)-[:PROVIDES]->(a);
MATCH (p:Plugin {name:"gmail_plugin"}),    (a:Action {name:"reply"})       CREATE (p)-[:PROVIDES]->(a);
MATCH (p:Plugin {name:"gmail_plugin"}),    (a:Action {name:"mark_read"})   CREATE (p)-[:PROVIDES]->(a);
MATCH (p:Plugin {name:"gmail_plugin"}),    (a:Action {name:"forward"})     CREATE (p)-[:PROVIDES]->(a);
MATCH (p:Plugin {name:"gmail_plugin"}),    (a:Action {name:"unsubscribe"}) CREATE (p)-[:PROVIDES]->(a);
MATCH (p:Plugin {name:"telegram_plugin"}), (a:Action {name:"reply"})       CREATE (p)-[:PROVIDES]->(a);
MATCH (p:Plugin {name:"telegram_plugin"}), (a:Action {name:"forward"})     CREATE (p)-[:PROVIDES]->(a);
MATCH (p:Plugin {name:"telegram_plugin"}), (a:Action {name:"notify_user"}) CREATE (p)-[:PROVIDES]->(a);
MATCH (p:Plugin {name:"instagram_plugin"}),(a:Action {name:"reply"})       CREATE (p)-[:PROVIDES]->(a);
MATCH (p:Plugin {name:"instagram_plugin"}),(a:Action {name:"tag"})         CREATE (p)-[:PROVIDES]->(a);
MATCH (p:Plugin {name:"ai_summarizer"}),   (a:Action {name:"summarize"})   CREATE (p)-[:PROVIDES]->(a);
MATCH (p:Plugin {name:"notifier"}),        (a:Action {name:"notify_user"}) CREATE (p)-[:PROVIDES]->(a);
MATCH (p:Plugin {name:"notifier"}),        (a:Action {name:"escalate"})    CREATE (p)-[:PROVIDES]->(a);

// --- Plugin → Source ---
MATCH (p:Plugin {name:"gmail_plugin"}),    (s:Source {name:"gmail"})     CREATE (p)-[:HANDLES_SOURCE]->(s);
MATCH (p:Plugin {name:"telegram_plugin"}), (s:Source {name:"telegram"})  CREATE (p)-[:HANDLES_SOURCE]->(s);
MATCH (p:Plugin {name:"instagram_plugin"}),(s:Source {name:"instagram"}) CREATE (p)-[:HANDLES_SOURCE]->(s);

// --- User ---
CREATE (:User { id: "user_01", name: "Alex", email: "alex@example.com", role: "owner" });

// --- Rules ---
MATCH (u:User {id:"user_01"})
CREATE (r:Rule { id:"rule_01", name:"ad:delete:auto", description:"Auto-delete all ads", enabled:true, priority:10, created_at:datetime() })
CREATE (u)-[:OWNS]->(r);
MATCH (r:Rule {id:"rule_01"}), (et:EventType {name:"ad"}), (a:Action {name:"delete"}), (ep:ExecutionPolicy {name:"auto"})
CREATE (r)-[:TRIGGERED_BY]->(et) CREATE (r)-[:EXECUTES {order:1}]->(a) CREATE (r)-[:WITH_POLICY]->(ep);

MATCH (u:User {id:"user_01"})
CREATE (r:Rule { id:"rule_02", name:"newsletter:archive:auto", description:"Auto-archive newsletters", enabled:true, priority:9, created_at:datetime() })
CREATE (u)-[:OWNS]->(r);
MATCH (r:Rule {id:"rule_02"}), (et:EventType {name:"newsletter"}), (a:Action {name:"archive"}), (ep:ExecutionPolicy {name:"auto"})
CREATE (r)-[:TRIGGERED_BY]->(et) CREATE (r)-[:EXECUTES {order:1}]->(a) CREATE (r)-[:WITH_POLICY]->(ep);

MATCH (u:User {id:"user_01"})
CREATE (r:Rule { id:"rule_03", name:"noise:mark_read:auto", description:"Auto-mark-read noise events", enabled:true, priority:5, created_at:datetime() })
CREATE (u)-[:OWNS]->(r);
MATCH (r:Rule {id:"rule_03"}), (ec:EventCategory {name:"noise"}), (a:Action {name:"mark_read"}), (ep:ExecutionPolicy {name:"auto"})
CREATE (r)-[:TRIGGERED_BY]->(ec) CREATE (r)-[:EXECUTES {order:1}]->(a) CREATE (r)-[:WITH_POLICY]->(ep);

MATCH (u:User {id:"user_01"})
CREATE (r:Rule { id:"rule_04", name:"personal_important:notify+reply:manual", description:"Notify and draft reply for important personal messages", enabled:true, priority:20, created_at:datetime() })
CREATE (u)-[:OWNS]->(r);
MATCH (r:Rule {id:"rule_04"}), (et:EventType {name:"personal_message"}), (ec:EventCategory {name:"important"}), (ep:ExecutionPolicy {name:"manual"})
CREATE (r)-[:TRIGGERED_BY]->(et) CREATE (r)-[:TRIGGERED_BY]->(ec) CREATE (r)-[:WITH_POLICY]->(ep);
MATCH (r:Rule {id:"rule_04"}), (a1:Action {name:"notify_user"}), (a2:Action {name:"reply"})
CREATE (r)-[:EXECUTES {order:1}]->(a1) CREATE (r)-[:EXECUTES {order:2}]->(a2);

MATCH (u:User {id:"user_01"})
CREATE (r:Rule { id:"rule_05", name:"security_alert:escalate:supervised", description:"Escalate security alerts", enabled:true, priority:100, created_at:datetime() })
CREATE (u)-[:OWNS]->(r);
MATCH (r:Rule {id:"rule_05"}), (et:EventType {name:"security_alert"}), (a:Action {name:"escalate"}), (ep:ExecutionPolicy {name:"supervised"})
CREATE (r)-[:TRIGGERED_BY]->(et) CREATE (r)-[:EXECUTES {order:1}]->(a) CREATE (r)-[:WITH_POLICY]->(ep);

MATCH (u:User {id:"user_01"})
CREATE (r:Rule { id:"rule_06", name:"youtube:summarize:auto", description:"Auto-summarize YouTube videos", enabled:true, priority:7, created_at:datetime() })
CREATE (u)-[:OWNS]->(r);
MATCH (r:Rule {id:"rule_06"}), (et:EventType {name:"youtube_video"}), (a:Action {name:"summarize"}), (ep:ExecutionPolicy {name:"auto"})
CREATE (r)-[:TRIGGERED_BY]->(et) CREATE (r)-[:EXECUTES {order:1}]->(a) CREATE (r)-[:WITH_POLICY]->(ep);

MATCH (u:User {id:"user_01"})
CREATE (r:Rule { id:"rule_07", name:"invoice:notify+forward:manual", description:"Notify and forward invoices for review", enabled:true, priority:30, created_at:datetime() })
CREATE (u)-[:OWNS]->(r);
MATCH (r:Rule {id:"rule_07"}), (et:EventType {name:"invoice"}), (ep:ExecutionPolicy {name:"manual"})
CREATE (r)-[:TRIGGERED_BY]->(et) CREATE (r)-[:WITH_POLICY]->(ep);
MATCH (r:Rule {id:"rule_07"}), (a1:Action {name:"notify_user"}), (a2:Action {name:"forward"})
CREATE (r)-[:EXECUTES {order:1}]->(a1) CREATE (r)-[:EXECUTES {order:2}]->(a2);

// --- Sample Events ---

// evt_001: Ad email → auto-deleted by rule_01
MATCH (et:EventType {name:"ad"}), (ec:EventCategory {name:"noise"}), (s:Source {name:"gmail"})
CREATE (e:Event { id:"evt_001", subject:"FLASH SALE - 50% Off Everything!", content:"50% off! Flash sale ends tonight.", sender:"promo@shopstore.com", timestamp:datetime("2026-02-26T08:12:00"), status:"completed" })
CREATE (e)-[:HAS_TYPE]->(et) CREATE (e)-[:HAS_CATEGORY]->(ec) CREATE (e)-[:FROM_SOURCE]->(s);
MATCH (e:Event {id:"evt_001"}), (r:Rule {id:"rule_01"}), (a:Action {name:"delete"})
CREATE (e)-[:PROCESSED_BY {at:datetime("2026-02-26T08:12:02"), result:"success"}]->(r)
CREATE (e)-[:ACTION_TAKEN {at:datetime("2026-02-26T08:12:02"), result:"deleted"}]->(a);

// evt_002: Newsletter → auto-archived by rule_02
MATCH (et:EventType {name:"newsletter"}), (ec:EventCategory {name:"informational"}), (s:Source {name:"gmail"})
CREATE (e:Event { id:"evt_002", subject:"Your Morning Brew — Feb 26", content:"Today: Fed rate hike, OpenAI news.", sender:"newsletters@morningbrew.com", timestamp:datetime("2026-02-26T06:00:00"), status:"completed" })
CREATE (e)-[:HAS_TYPE]->(et) CREATE (e)-[:HAS_CATEGORY]->(ec) CREATE (e)-[:FROM_SOURCE]->(s);
MATCH (e:Event {id:"evt_002"}), (r:Rule {id:"rule_02"}), (a:Action {name:"archive"})
CREATE (e)-[:PROCESSED_BY {at:datetime("2026-02-26T06:00:05"), result:"success"}]->(r)
CREATE (e)-[:ACTION_TAKEN {at:datetime("2026-02-26T06:00:05"), result:"archived"}]->(a);

// evt_003: Important Telegram message → awaiting user via rule_04
MATCH (et:EventType {name:"personal_message"}), (ec:EventCategory {name:"important"}), (s:Source {name:"telegram"})
CREATE (e:Event { id:"evt_003", subject:"", content:"Hey! Are you coming to the meeting tomorrow at 10am?", sender:"john_doe", timestamp:datetime("2026-02-26T09:30:00"), status:"awaiting_user" })
CREATE (e)-[:HAS_TYPE]->(et) CREATE (e)-[:HAS_CATEGORY]->(ec) CREATE (e)-[:FROM_SOURCE]->(s);
MATCH (e:Event {id:"evt_003"}), (r:Rule {id:"rule_04"}), (a1:Action {name:"notify_user"})
CREATE (e)-[:PROCESSED_BY {at:datetime("2026-02-26T09:30:02"), result:"pending_user_input"}]->(r)
CREATE (e)-[:ACTION_TAKEN {at:datetime("2026-02-26T09:30:02"), result:"push_notification_sent"}]->(a1);

// evt_004: Security alert → escalated (supervised) by rule_05
MATCH (et:EventType {name:"security_alert"}), (ec:EventCategory {name:"urgent"}), (s:Source {name:"gmail"})
CREATE (e:Event { id:"evt_004", subject:"Security alert: new sign-in", content:"New sign-in from unknown device in Russia.", sender:"no-reply@accounts.google.com", timestamp:datetime("2026-02-26T11:45:00"), status:"escalated" })
CREATE (e)-[:HAS_TYPE]->(et) CREATE (e)-[:HAS_CATEGORY]->(ec) CREATE (e)-[:FROM_SOURCE]->(s);
MATCH (e:Event {id:"evt_004"}), (r:Rule {id:"rule_05"}), (a:Action {name:"escalate"})
CREATE (e)-[:PROCESSED_BY {at:datetime("2026-02-26T11:45:01"), result:"success"}]->(r)
CREATE (e)-[:ACTION_TAKEN {at:datetime("2026-02-26T11:45:01"), result:"moved_to_urgent_queue"}]->(a);

// evt_005: YouTube video → auto-summarized by rule_06
MATCH (et:EventType {name:"youtube_video"}), (ec:EventCategory {name:"informational"}), (s:Source {name:"youtube"})
CREATE (e:Event { id:"evt_005", subject:"Sam Altman: GPT-5 and the Path to AGI | Lex Fridman", content:"3h 12m video. Lex interviews Sam Altman about OpenAI roadmap.", sender:"lexfridman", timestamp:datetime("2026-02-26T14:00:00"), status:"completed" })
CREATE (e)-[:HAS_TYPE]->(et) CREATE (e)-[:HAS_CATEGORY]->(ec) CREATE (e)-[:FROM_SOURCE]->(s);
MATCH (e:Event {id:"evt_005"}), (r:Rule {id:"rule_06"}), (a:Action {name:"summarize"})
CREATE (e)-[:PROCESSED_BY {at:datetime("2026-02-26T14:00:08"), result:"success"}]->(r)
CREATE (e)-[:ACTION_TAKEN {at:datetime("2026-02-26T14:00:08"), result:"summary_generated", output:"Sam Altman discusses GPT-5, AGI timeline 3-5 years, and OpenAI restructuring."}]->(a);

// evt_006: AWS Invoice → awaiting user via rule_07
MATCH (et:EventType {name:"invoice"}), (ec:EventCategory {name:"important"}), (s:Source {name:"gmail"})
CREATE (e:Event { id:"evt_006", subject:"Your AWS Invoice for February 2026", content:"Invoice #2026-089. Amount: $342.50. Due: March 1, 2026.", sender:"billing@aws.amazon.com", timestamp:datetime("2026-02-26T16:20:00"), status:"awaiting_user" })
CREATE (e)-[:HAS_TYPE]->(et) CREATE (e)-[:HAS_CATEGORY]->(ec) CREATE (e)-[:FROM_SOURCE]->(s);
MATCH (e:Event {id:"evt_006"}), (r:Rule {id:"rule_07"}), (a1:Action {name:"notify_user"})
CREATE (e)-[:PROCESSED_BY {at:datetime("2026-02-26T16:20:03"), result:"pending_user_input"}]->(r)
CREATE (e)-[:ACTION_TAKEN {at:datetime("2026-02-26T16:20:03"), result:"notification_sent"}]->(a1);

// evt_007: Instagram ad → auto-deleted by rule_01 (rule is source-agnostic)
MATCH (et:EventType {name:"ad"}), (ec:EventCategory {name:"noise"}), (s:Source {name:"instagram"})
CREATE (e:Event { id:"evt_007", subject:"", content:"Sponsored: Try NordVPN — 73% off today only!", sender:"nordvpn_official", timestamp:datetime("2026-02-26T17:05:00"), status:"completed" })
CREATE (e)-[:HAS_TYPE]->(et) CREATE (e)-[:HAS_CATEGORY]->(ec) CREATE (e)-[:FROM_SOURCE]->(s);
MATCH (e:Event {id:"evt_007"}), (r:Rule {id:"rule_01"}), (a:Action {name:"delete"})
CREATE (e)-[:PROCESSED_BY {at:datetime("2026-02-26T17:05:01"), result:"success"}]->(r)
CREATE (e)-[:ACTION_TAKEN {at:datetime("2026-02-26T17:05:01"), result:"deleted"}]->(a);
```

---

## Useful Read Queries

```cypher
-- Q1: Which rules fire for an "ad" event?
MATCH (r:Rule)-[:TRIGGERED_BY]->(et:EventType {name:"ad"})
MATCH (r)-[:WITH_POLICY]->(ep)
MATCH (r)-[:EXECUTES]->(a)
RETURN r.name, ep.name, collect(a.name) AS actions
ORDER BY r.priority DESC;

-- Q2: Full audit trail for a specific event
MATCH (e:Event {id:"evt_003"})
MATCH (e)-[:HAS_TYPE]->(et)
MATCH (e)-[:HAS_CATEGORY]->(ec)
MATCH (e)-[:FROM_SOURCE]->(s)
MATCH (e)-[:PROCESSED_BY]->(r)
MATCH (e)-[:ACTION_TAKEN]->(a)
RETURN e.id, et.name, ec.name, s.name, r.name, collect(a.name) AS actions_taken;

-- Q3: All rules for a user with their full configuration
MATCH (u:User {id:"user_01"})-[:OWNS]->(r:Rule)
MATCH (r)-[:TRIGGERED_BY]->(trigger)
MATCH (r)-[:EXECUTES]->(a)
MATCH (r)-[:WITH_POLICY]->(ep)
RETURN r.name, r.enabled, r.priority,
       collect(DISTINCT trigger.name) AS triggers,
       collect(DISTINCT a.name) AS actions,
       ep.name AS policy
ORDER BY r.priority DESC;

-- Q4: Actions available through a specific plugin
MATCH (p:Plugin {name:"gmail_plugin"})-[:PROVIDES]->(a:Action)
RETURN a.name, a.label;

-- Q5: Events currently awaiting user input
MATCH (e:Event {status:"awaiting_user"})
MATCH (e)-[:FROM_SOURCE]->(s)
MATCH (e)-[:HAS_TYPE]->(et)
RETURN e.id, e.subject, et.name, s.name, e.timestamp
ORDER BY e.timestamp DESC;
```

---

## Design Decisions & Open Questions

### Resolved

- **Policy lives on Rule, not Event.** Events are raw data with no routing awareness.
- **Rule is a first-class node.** It can be toggled, prioritized, queried, and owned by a user without touching any other node.
- **Source is explicit.** This enables plugin dispatch routing and source-scoped rules.
- **Actions are separate nodes.** Plugin availability is checked at runtime via `(:Plugin {enabled: true})-[:PROVIDES]->(:Action)`.

### Still Open

1. **Multi-trigger logic (AND vs OR):** When a Rule has `[:TRIGGERED_BY]` edges to both an `EventType` and an `EventCategory`, should both need to match (AND) or either (OR)? The recommendation is AND for precision, with a `trigger_mode` property on Rule for override.

2. **Rule conflict resolution:** When multiple rules match the same event, the current design uses `priority` to pick the winner. An alternative is to fire all matching rules in priority order. This should be a user-configurable setting.

3. **Pipeline chaining:** Should a Rule be able to trigger another Rule (chains/branches like n8n)? This would require `(:Rule)-[:CHAINS_TO]->(:Rule)` edges and cycle detection.

4. **Condition nodes:** For fine-grained matching (e.g. "only ads from unknown senders"), a `(:Condition)` node linked to a Rule with filter predicates (field, operator, value) would allow SQL-like WHERE clauses without changing the graph schema.
