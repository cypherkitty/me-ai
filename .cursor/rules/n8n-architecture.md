---
description: Ensure the AI understands the n8n.io-like dynamically generated action flow architecture.
alwaysApply: true
---

# n8n-like Architecture (Dynamic Action Flow)

The fundamental architectural principle of me-ai is modeled after **n8n.io** workflows, but heavily driven by the LLM on the frontend.
**DO NOT hardcode action pipelines.**

## 1. Trigger / Extraction (LLM Triage)
When a new event (email) arrives, the LLM dynamically extracts:
- `action` (the event type, e.g. `PAY_BILL`)
- `group` (execution policy: `NOISE`, `INFO`, `CRITICAL`)
- `suggestedActions` (an ordered array of plugin commands to handle this event)

## 2. Action Pipelines (The Workflow)
The extracted `suggestedActions` seed a new dynamically generated **Action Pipeline**.
- The pipeline maps an `eventType` to a sequence of `actions`.
- Each action explicitly binds to a plugin command (e.g., `pluginId: "gmail", commandId: "trash"`).
- Users can manage these pipelines visually via the **Action Pipeline Editor** (similar to n8n's workflow editor). They can add custom actions, reorder steps, or change the plugin command bound to each step.

## 3. Execution (Plugin Registry)
When a pipeline runs, the `PluginRegistry` routes each step to the correct plugin (e.g. `GmailPlugin`) and executes the specific command, tracking success or failure per step.

## Directives
- **Never hardcode pipelines.**
- **Never hardcode event types.** Event types must be organically discovered by the LLM or manually created by the user.
- **When adding a new feature**, think in terms of: 
  - 1. Is this a new Plugin Command? 
  - 2. How will the UI present this in the Action Pipeline Editor?
  - 3. Does the LLM system prompt need adjustments to extract this automatically? (Usually handled dynamically via `pluginRegistry.getAvailableActions()`).