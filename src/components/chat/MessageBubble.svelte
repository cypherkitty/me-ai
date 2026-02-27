<script>
  import { marked } from "marked";
  import DOMPurify from "dompurify";
  import { onMount } from "svelte";
  import { mountLog } from "../../lib/debug.js";
  import { getModelInfo } from "../../lib/models.js";

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
    webgpu: "WebGPU",
    ollama: "Ollama",
    openai: "OpenAI",
    anthropic: "Claude",
    google: "Gemini",
    xai: "Grok",
  };

  const BACKEND_COLORS = {
    webgpu: "#4ade80",
    ollama: "#a78bfa",
    openai: "#10b981",
    anthropic: "#f59e0b",
    google: "#3b82f6",
    xai: "#e8e8e8",
  };

  let modelLabel = $derived(backend ? (BACKEND_LABELS[backend] ?? backend) : "AI");
  let modelColor = $derived(backend ? (BACKEND_COLORS[backend] ?? "#888") : "#888");

  let modelName = $derived.by(() => {
    if (!msg.model) return null;
    const info = getModelInfo(msg.model);
    if (info) return info.name;
    // fallback: strip namespace and common ONNX suffixes, humanise
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
  <div class="user-row">
    <div class="user-pill">{msg.content}</div>
  </div>
{:else}
  <div class="ai-row">
    <!-- Model label -->
    <div class="ai-header">
      <span class="ai-badge" style:color={modelColor} style:border-color={"color-mix(in srgb," + modelColor + " 30%, transparent)"} style:background={"color-mix(in srgb," + modelColor + " 8%, transparent)"}>
        {modelLabel}
      </span>

      {#if showModelName && modelName}
        <span class="model-name">{modelName}</span>
      {/if}

      {#if isStreaming && generationPhase === "thinking"}
        <span class="phase-tag thinking">
          <span class="dot-pulse"></span>
          Thinking…{#if numTokens}<span class="token-count">{numTokens} tok</span>{/if}
        </span>
      {:else if isStreaming && generationPhase === "preparing"}
        <span class="phase-tag preparing">
          <span class="dot-pulse"></span>
          Preparing…
        </span>
      {:else if isStreaming && generationPhase === "generating"}
        <span class="phase-tag generating">
          <span class="dot-pulse"></span>
          Generating…
        </span>
      {/if}
    </div>

    <!-- Thinking disclosure -->
    {#if msg.thinking}
      <details class="thinking-details">
        <summary class="thinking-summary">
          <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          Internal reasoning
          <span class="thinking-words">{msg.thinking.split(/\s+/).filter(Boolean).length} words</span>
        </summary>
        <pre class="thinking-content">{msg.thinking}</pre>
      </details>
    {/if}

    <!-- Content area -->
    <div class="ai-content">
      {#if isStreaming && !msg.content && generationPhase !== "thinking"}
        <div class="gen-placeholder">
          <span class="dot-row"><span></span><span></span><span></span></span>
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
  /* ── User message ─────────────────────────────────────────────── */
  .user-row {
    display: flex;
    justify-content: flex-end;
    padding: 0.1rem 0;
  }

  .user-pill {
    max-width: 72%;
    background: #2563eb;
    color: #fff;
    padding: 0.55rem 0.95rem;
    border-radius: 18px;
    border-bottom-right-radius: 5px;
    font-size: 0.9rem;
    line-height: 1.5;
    word-break: break-word;
    white-space: pre-wrap;
  }

  /* ── AI message ───────────────────────────────────────────────── */
  .ai-row {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.55rem 0 0.75rem;
    border-bottom: 1px solid #181818;
  }
  .ai-row:last-child {
    border-bottom: none;
  }

  /* header row with model badge */
  .ai-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .ai-badge {
    font-size: 0.67rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    border: 1px solid;
    flex-shrink: 0;
  }

  .model-name {
    font-size: 0.7rem;
    color: #4a4a4a;
    font-weight: 400;
    letter-spacing: 0;
  }

  /* phase tags */
  .phase-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    color: #666;
    font-style: italic;
  }
  .phase-tag.thinking { color: #a78bfa; }
  .phase-tag.generating { color: #3b82f6; }
  .phase-tag.preparing { color: #888; }

  .token-count {
    font-size: 0.62rem;
    color: #665da0;
    font-style: normal;
    font-variant-numeric: tabular-nums;
  }

  /* animated dot pulse */
  .dot-pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    display: inline-block;
    animation: pulse 1.4s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.25; transform: scale(0.75); }
    50% { opacity: 1; transform: scale(1.1); }
  }

  /* ── Thinking disclosure ──────────────────────────────────────── */
  .thinking-details {
    margin: 0.1rem 0;
  }
  .thinking-summary {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    cursor: pointer;
    font-size: 0.72rem;
    color: #7c6dbd;
    padding: 0.25rem 0.55rem;
    background: rgba(167, 139, 250, 0.07);
    border: 1px solid rgba(167, 139, 250, 0.15);
    border-radius: 6px;
    user-select: none;
    transition: background 0.15s;
    list-style: none;
  }
  .thinking-summary::-webkit-details-marker { display: none; }
  .thinking-summary:hover { background: rgba(167, 139, 250, 0.13); }

  .chevron {
    transition: transform 0.15s;
    flex-shrink: 0;
  }
  .thinking-details[open] .chevron {
    transform: rotate(90deg);
  }
  .thinking-words {
    font-size: 0.6rem;
    color: #5a4f90;
    margin-left: 0.2rem;
  }
  .thinking-content {
    font-size: 0.73rem;
    color: #777;
    line-height: 1.6;
    padding: 0.55rem 0.75rem;
    margin-top: 0.3rem;
    background: rgba(167, 139, 250, 0.04);
    border-radius: 0 0 6px 6px;
    border-left: 2px solid rgba(167, 139, 250, 0.2);
    max-height: 280px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: inherit;
  }

  /* ── Content ──────────────────────────────────────────────────── */
  .ai-content {
    min-height: 1.2em;
  }

  .gen-placeholder {
    padding: 0.3rem 0;
  }

  .dot-row {
    display: inline-flex;
    gap: 4px;
  }
  .dot-row span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #444;
    animation: dotBounce 1.2s ease-in-out infinite;
  }
  .dot-row span:nth-child(2) { animation-delay: 0.18s; }
  .dot-row span:nth-child(3) { animation-delay: 0.36s; }
  @keyframes dotBounce {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1.15); }
  }

  .cursor {
    display: inline-block;
    color: #3b82f6;
    animation: blinkCursor 0.8s step-end infinite;
    font-size: 0.85em;
    line-height: 1;
    margin-left: 1px;
  }
  @keyframes blinkCursor {
    50% { opacity: 0; }
  }

  /* ── Markdown body ────────────────────────────────────────────── */
  .md-body {
    font-size: 0.9rem;
    line-height: 1.65;
    color: #d4d4d4;
    word-break: break-word;
  }
  .md-body.plain {
    white-space: pre-wrap;
  }

  /* markdown element styles (applied via :global since content is innerHTML) */
  .md-body :global(p) {
    margin: 0 0 0.7em;
  }
  .md-body :global(p:last-child) {
    margin-bottom: 0;
  }
  .md-body :global(h1), .md-body :global(h2), .md-body :global(h3),
  .md-body :global(h4), .md-body :global(h5), .md-body :global(h6) {
    font-weight: 600;
    line-height: 1.3;
    margin: 1em 0 0.4em;
    color: #e8e8e8;
  }
  .md-body :global(h1) { font-size: 1.2em; }
  .md-body :global(h2) { font-size: 1.08em; }
  .md-body :global(h3) { font-size: 0.97em; }
  .md-body :global(h1:first-child), .md-body :global(h2:first-child), .md-body :global(h3:first-child) {
    margin-top: 0;
  }
  .md-body :global(ul), .md-body :global(ol) {
    margin: 0.4em 0 0.7em;
    padding-left: 1.4em;
  }
  .md-body :global(li) {
    margin: 0.2em 0;
  }
  .md-body :global(code) {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 0.84em;
    background: #1e1e1e;
    border: 1px solid #2a2a2a;
    padding: 0.1em 0.35em;
    border-radius: 4px;
    color: #c9d1d9;
  }
  .md-body :global(pre) {
    background: #141414;
    border: 1px solid #252525;
    border-radius: 8px;
    padding: 0.85rem 1rem;
    overflow-x: auto;
    margin: 0.6em 0;
  }
  .md-body :global(pre code) {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.83em;
    color: #c9d1d9;
  }
  .md-body :global(blockquote) {
    border-left: 3px solid #333;
    margin: 0.5em 0;
    padding: 0.3em 0.8em;
    color: #888;
  }
  .md-body :global(hr) {
    border: none;
    border-top: 1px solid #252525;
    margin: 0.8em 0;
  }
  .md-body :global(a) {
    color: #60a5fa;
    text-decoration: none;
  }
  .md-body :global(a:hover) {
    text-decoration: underline;
  }
  .md-body :global(strong) {
    font-weight: 600;
    color: #e8e8e8;
  }
  .md-body :global(table) {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.85em;
    margin: 0.6em 0;
  }
  .md-body :global(th), .md-body :global(td) {
    border: 1px solid #2a2a2a;
    padding: 0.35em 0.65em;
    text-align: left;
  }
  .md-body :global(th) {
    background: #1a1a1a;
    font-weight: 600;
    color: #e8e8e8;
  }
</style>
