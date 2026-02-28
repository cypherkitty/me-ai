<script>
  import { marked } from "marked";
  import DOMPurify from "dompurify";
  import { onMount } from "svelte";
  import { mountLog } from "../../lib/debug.js";
  import { getModelInfo } from "../../lib/models.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { cn } from "$lib/utils.js";

  let {
    msg,
    isLast = false,
    isRunning = false,
    generationPhase = null,
    numTokens = null,
    backend = null,
    showModelName = false,
  } = $props();

  onMount(() => mountLog(`MessageBubble[${msg.role}]`));

  const BACKEND_LABELS = {
    webgpu: "WebGPU", ollama: "Ollama", openai: "OpenAI",
    anthropic: "Claude", google: "Gemini", xai: "Grok",
  };
  const BACKEND_COLORS = {
    webgpu: "#4ade80", ollama: "#a78bfa", openai: "#10b981",
    anthropic: "#f59e0b", google: "#3b82f6", xai: "#e8e8e8",
  };

  let modelLabel = $derived(backend ? (BACKEND_LABELS[backend] ?? backend) : "AI");
  let modelColor = $derived(backend ? (BACKEND_COLORS[backend] ?? "#888") : "#888");

  let modelName = $derived.by(() => {
    if (!msg.model) return null;
    const info = getModelInfo(msg.model);
    if (info) return info.name;
    return msg.model
      .split("/").pop()
      .replace(/[-_](ONNX|onnx)([-_](GQA|MHA|web|DQ))*$/i, "")
      .replace(/[-_]/g, " ")
      .trim();
  });

  let html = $derived.by(() => {
    if (msg.role !== "assistant" || !msg.content) return "";
    try {
      const raw = marked.parse(msg.content, { breaks: true, gfm: true });
      return DOMPurify.sanitize(raw);
    } catch {
      return msg.content;
    }
  });

  let isStreaming = $derived(isRunning && isLast);
</script>

{#if msg.role === "user"}
  <div class="flex justify-end py-0.5">
    <div class="max-w-[72%] bg-primary text-primary-foreground px-4 py-2 text-sm leading-relaxed word-break-words whitespace-pre-wrap tracking-tight"
         style="border-radius: 18px 18px 4px 18px">
      {msg.content}
    </div>
  </div>

{:else}
  <div class="flex flex-col gap-1.5 py-2.5 pb-3 border-b border-border last:border-b-0">
    <!-- Model label row -->
    <div class="flex items-center gap-2 flex-wrap">
      <span
        class="text-[0.65rem] font-bold uppercase tracking-wider px-1.5 py-px rounded border shrink-0"
        style:color={modelColor}
        style:border-color={"color-mix(in srgb," + modelColor + " 28%, transparent)"}
        style:background={"color-mix(in srgb," + modelColor + " 8%, transparent)"}
      >
        {modelLabel}
      </span>

      {#if showModelName && modelName}
        <span class="text-xs text-muted-foreground/30">{modelName}</span>
      {/if}

      {#if isStreaming && generationPhase === "thinking"}
        <span class="inline-flex items-center gap-1.5 text-xs text-primary/60 italic">
          <span class="size-1.5 rounded-full bg-primary animate-pulse"></span>
          Thinking…{#if numTokens}<span class="text-[0.62rem] tabular-nums not-italic opacity-60 ml-0.5">{numTokens} tok</span>{/if}
        </span>
      {:else if isStreaming && generationPhase === "preparing"}
        <span class="inline-flex items-center gap-1.5 text-xs text-muted-foreground/40 italic">
          <span class="size-1.5 rounded-full bg-muted-foreground/40 animate-pulse"></span>
          Preparing…
        </span>
      {:else if isStreaming && generationPhase === "generating"}
        <span class="inline-flex items-center gap-1.5 text-xs text-primary/50 italic">
          <span class="size-1.5 rounded-full bg-primary/50 animate-pulse"></span>
          Generating…
        </span>
      {/if}
    </div>

    <!-- Thinking disclosure -->
    {#if msg.thinking}
      <details class="group mt-0.5">
        <summary class="inline-flex items-center gap-1.5 cursor-pointer text-[0.72rem] text-primary/60 hover:text-primary/90 px-2 py-1 rounded border border-primary/15 bg-primary/5 transition-colors list-none select-none">
          <svg class="size-3 transition-transform group-open:rotate-90 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          Internal reasoning
          <span class="text-[0.58rem] opacity-50 ml-0.5">{msg.thinking.split(/\s+/).filter(Boolean).length} words</span>
        </summary>
        <pre class="mt-1 text-[0.73rem] text-muted-foreground leading-relaxed px-3 py-2 rounded bg-primary/[0.03] border-l-2 border-primary/15 max-h-[280px] overflow-y-auto whitespace-pre-wrap break-words font-[inherit] m-0">{msg.thinking}</pre>
      </details>
    {/if}

    <!-- Content -->
    <div class="min-h-[1.2em]">
      {#if isStreaming && !msg.content && generationPhase !== "thinking"}
        <div class="flex gap-1 py-1.5">
          <span class="size-1.5 rounded-full bg-muted-foreground/30 animate-[dotBounce_1.2s_ease-in-out_infinite]"></span>
          <span class="size-1.5 rounded-full bg-muted-foreground/30 animate-[dotBounce_1.2s_ease-in-out_0.18s_infinite]"></span>
          <span class="size-1.5 rounded-full bg-muted-foreground/30 animate-[dotBounce_1.2s_ease-in-out_0.36s_infinite]"></span>
        </div>
      {:else if html}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="md-body">{@html html}{#if isStreaming}<span class="cursor">▋</span>{/if}</div>
      {:else if msg.content}
        <div class="md-body plain">{msg.content}{#if isStreaming}<span class="cursor">▋</span>{/if}</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  @keyframes dotBounce {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1.15); }
  }

  /* Cursor blink */
  .cursor {
    display: inline-block;
    color: var(--color-primary);
    animation: blinkCursor 0.8s step-end infinite;
    font-size: 0.85em;
    line-height: 1;
    margin-left: 1px;
  }
  @keyframes blinkCursor { 50% { opacity: 0; } }

  /* Markdown body — structural styles can't be done with Tailwind since content is @html */
  .md-body {
    font-size: 0.9rem;
    line-height: 1.65;
    color: var(--color-foreground);
    word-break: break-word;
    opacity: 0.88;
  }
  .md-body.plain { white-space: pre-wrap; }

  .md-body :global(p) { margin: 0 0 0.7em; }
  .md-body :global(p:last-child) { margin-bottom: 0; }
  .md-body :global(h1), .md-body :global(h2), .md-body :global(h3),
  .md-body :global(h4), .md-body :global(h5), .md-body :global(h6) {
    font-weight: 600;
    line-height: 1.3;
    margin: 1em 0 0.4em;
    color: var(--color-foreground);
    letter-spacing: -0.02em;
  }
  .md-body :global(h1) { font-size: 1.2em; }
  .md-body :global(h2) { font-size: 1.08em; }
  .md-body :global(h3) { font-size: 0.97em; }
  .md-body :global(h1:first-child), .md-body :global(h2:first-child), .md-body :global(h3:first-child) { margin-top: 0; }
  .md-body :global(ul), .md-body :global(ol) { margin: 0.4em 0 0.7em; padding-left: 1.4em; }
  .md-body :global(li) { margin: 0.2em 0; }
  .md-body :global(code) {
    font-family: ui-monospace, "Cascadia Code", Menlo, Consolas, monospace;
    font-size: 0.84em;
    background: var(--color-muted);
    border: 1px solid var(--color-border);
    padding: 0.1em 0.35em;
    border-radius: 4px;
  }
  .md-body :global(pre) {
    background: var(--color-muted);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 0.85rem 1rem;
    overflow-x: auto;
    margin: 0.6em 0;
  }
  .md-body :global(pre code) { background: none; border: none; padding: 0; font-size: 0.83em; }
  .md-body :global(blockquote) {
    border-left: 2px solid var(--color-border);
    margin: 0.5em 0;
    padding: 0.3em 0.8em;
    color: var(--color-muted-foreground);
  }
  .md-body :global(hr) { border: none; border-top: 1px solid var(--color-border); margin: 0.8em 0; }
  .md-body :global(a) { color: var(--color-primary); text-decoration: none; opacity: 0.9; }
  .md-body :global(a:hover) { text-decoration: underline; opacity: 1; }
  .md-body :global(strong) { font-weight: 600; color: var(--color-foreground); opacity: 1; }
  .md-body :global(table) { border-collapse: collapse; width: 100%; font-size: 0.85em; margin: 0.6em 0; }
  .md-body :global(th), .md-body :global(td) { border: 1px solid var(--color-border); padding: 0.35em 0.65em; text-align: left; }
  .md-body :global(th) { background: var(--color-muted); font-weight: 600; color: var(--color-foreground); }
</style>
