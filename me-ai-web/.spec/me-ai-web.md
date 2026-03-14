# me-ai-web — Spec 

- Browser-only Svelte/TypeScript frontend. 
- No backend. 
- Data via IndexedDB (me-ai-core WASM). 
- LLM runs in-browser (WebGPU/Ollama/cloud APIs). 
- Gmail uses client-side OAuth.

## Tech Stack

- Svelte 5, TypeScript, Vite, Tailwind, bits-ui, @xyflow/svelte. 
- LLM: @huggingface/transformers (WebGPU), Ollama, or cloud APIs. 
- Persistence: me-ai-core (Rust WASM → IndexedDB).

## User Flow

**Sources** → connect Gmail/Twitter, sync emails  
**Scan** → LLM classifies emails (action + category)  
**Control Plane** → pipelines, approvals, event stream

## Structure

- `src/App.svelte` — hash routing, page state
- `src/views/` — full-page views (Home, Sources, Scan, Pipelines, Approvals, Stream, Admin, OAuth)
- `src/components/chat/` — chat UI, message bubbles, backend/model selectors
- `src/components/actions/` — pipeline editor, audit log, scan controls
- `lib/` — services, plugins, store

## Key Modules

- **core.ts** — WASM init, re-exports all me-ai-core functions
- **store/** — settings, gmail-sync, audit; all persistence via core
- **plugins/** — BasePlugin, GmailPlugin, PluginRegistry, ExecutionService
- **triage.ts** — email scan via LLM, parseClassification, buildSystemPrompt
- **rules.ts** — rule CRUD, pipeline resolution, approvals
- **events.ts** — NOISE/INFO/CRITICAL tiers, event type → pipeline mapping
- **llm-engine.ts** — WebGPU Worker wrapper; unified-engine.ts picks backend by model ID

## Event Categories

- **NOISE** — policy: auto, auto-execute
- **INFO** — policy: auto, auto-execute
- **CRITICAL** — policy: manual, requires user approval

## Plugin System

- Plugins extend BasePlugin, register action handlers. 
- PluginRegistry routes execution by source. 
- ExecutionService: executePipeline, executePipelineBatch; resolves rules → category pipeline → runs via registry.
- GmailPlugin: mark_read, trash, archive, delete, etc. 

## Chat & Control Tags

Chat supports plain text and typed messages (event, event-batch, events-by-category). 
LLM can emit hidden tags: `[EXECUTE:CATEGORY:...]` triggers batch execution; `[SHOW:DASHBOARD]` shows inline dashboard.

## Conventions

- Svelte 5 runes ($state, $derived); no writable/readable stores
- Hash routing (#home, #sources, #scan, #stream, #pipelines, #approvals)
- No fallbacks — fail explicitly
- WASM returns: cast at call site; use toJson/fromJson for complex params
