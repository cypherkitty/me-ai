<script>
  /**
   * Perplexity-style task card with nested expandable steps.
   *
   * msg shape:
   * {
   *   type: "task-card",
   *   role: "assistant",
   *   title: string,
   *   model?: string,           // "xai" | "openai" | "anthropic" | "google" | "webgpu" | "ollama"
   *   status: "running"|"done"|"error",
   *   description?: string,     // plain text shown below header
   *   steps: Array<{
   *     id: string,
   *     label: string,
   *     status: "pending"|"running"|"done"|"error",
   *     detail?: string,        // right-aligned metadata text
   *     startedAt?: number,     // ms — shown as elapsed when status=running
   *     expandable?: boolean,   // shows chevron, clickable
   *     thumbnail?: string,     // img src shown when expanded
   *     subContent?: string,    // plain-text block shown when expanded
   *     badges?: string[],      // small tag pills (e.g. ["NOISE", "delete"])
   *   }>
   * }
   */

  let { msg } = $props();

  const MODEL_LABELS = {
    webgpu: "WebGPU",
    ollama: "Ollama",
    openai: "GPT",
    anthropic: "Claude",
    google: "Gemini",
    xai: "Grok",
  };
  const MODEL_COLORS = {
    webgpu: "#4ade80",
    ollama: "#a78bfa",
    openai: "#10b981",
    anthropic: "#f59e0b",
    google: "#3b82f6",
    xai: "#e2e2e2",
  };

  const GROUP_COLORS = {
    NOISE:   { bg: "rgba(107,114,128,0.12)", text: "#9ca3af", border: "rgba(107,114,128,0.2)" },
    INFO:    { bg: "rgba(59,130,246,0.10)",  text: "#60a5fa", border: "rgba(59,130,246,0.2)" },
    COMMAND: { bg: "rgba(245,158,11,0.10)",  text: "#fbbf24", border: "rgba(245,158,11,0.2)" },
  };

  let cardOpen = $state(true);
  let expandedSteps = $state(new Set());

  function toggleCard() { cardOpen = !cardOpen; }
  function toggleStep(id) {
    const next = new Set(expandedSteps);
    if (next.has(id)) next.delete(id); else next.add(id);
    expandedSteps = next;
  }

  let modelLabel = $derived(msg.model ? (MODEL_LABELS[msg.model] ?? msg.model) : null);
  let modelColor = $derived(msg.model ? (MODEL_COLORS[msg.model] ?? "#888") : "#888");

  function elapsed(ts) {
    if (!ts) return "";
    const secs = Math.round((Date.now() - ts) / 1000);
    if (secs < 60) return `${secs}s`;
    return `${Math.floor(secs / 60)}m ${secs % 60}s`;
  }

  function groupStyle(group) {
    return GROUP_COLORS[group] ?? { bg: "rgba(255,255,255,0.04)", text: "#777", border: "rgba(255,255,255,0.08)" };
  }
</script>

<div class="card" class:done={msg.status === "done"} class:error={msg.status === "error"}>

  <!-- ── Card header ─────────────────────────────────────── -->
  <button class="header" onclick={toggleCard}>
    <span class="hd-icon" class:pulsing={msg.status === "running"}>
      {#if msg.status === "running"}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        </svg>
      {:else if msg.status === "done"}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      {:else}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      {/if}
    </span>

    <span class="hd-title">{msg.title}</span>

    {#if modelLabel}
      <span class="model-badge" style:color={modelColor}
        style:border-color={"color-mix(in srgb," + modelColor + " 22%, transparent)"}
        style:background={"color-mix(in srgb," + modelColor + " 7%, transparent)"}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
        </svg>
        {modelLabel}
      </span>
    {/if}

    <svg class="chevron" class:open={cardOpen} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </button>

  {#if cardOpen}
    <!-- ── Optional description ─────────────────────────── -->
    {#if msg.description}
      <div class="description">{msg.description}</div>
    {/if}

    <!-- ── Steps ──────────────────────────────────────────── -->
    {#if msg.steps?.length > 0}
      <div class="steps" class:has-desc={!!msg.description}>
        {#each msg.steps as step (step.id)}
          {@const isExpanded = expandedSteps.has(step.id)}
          {@const hasBody = step.expandable && (step.subContent || step.thumbnail || step.badges?.length)}

          <div class="step"
            class:step-running={step.status === "running"}
            class:step-done={step.status === "done"}
            class:step-error={step.status === "error"}
            class:step-pending={step.status === "pending"}
            class:expandable={hasBody}>

            <!-- Step row ─────────────────────────────── -->
            {#snippet stepRowContent()}
              <span class="step-icon">
                {#if step.status === "running"}
                  <span class="spinner"></span>
                {:else if step.status === "done"}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                {:else if step.status === "error"}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                {:else}
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg>
                {/if}
              </span>

              <span class="step-label">{step.label}</span>

              {#if step.badges?.length}
                <span class="badges">
                  {#each step.badges as badge}
                    {@const gs = groupStyle(badge)}
                    <span class="badge" style:background={gs.bg} style:color={gs.text} style:border-color={gs.border}>{badge}</span>
                  {/each}
                </span>
              {/if}

              {#if step.detail || step.startedAt}
                <span class="step-meta">
                  {#if step.detail}{step.detail}{/if}
                  {#if step.startedAt && step.status === "running"} · {elapsed(step.startedAt)}{/if}
                </span>
              {/if}

              {#if hasBody}
                <svg class="step-chevron" class:open={isExpanded} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              {/if}
            {/snippet}

            {#if hasBody}
              <button class="step-row step-row-btn" onclick={() => toggleStep(step.id)}>
                {@render stepRowContent()}
              </button>
            {:else}
              <div class="step-row">
                {@render stepRowContent()}
              </div>
            {/if}

            <!-- Expandable body ─────────────────────── -->
            {#if hasBody && isExpanded}
              <div class="step-body">
                {#if step.thumbnail}
                  <img class="thumbnail" src={step.thumbnail} alt="screenshot" />
                {/if}
                {#if step.badges?.length}
                  <div class="body-badges">
                    {#each step.badges as badge}
                      {@const gs = groupStyle(badge)}
                      <span class="badge lg" style:background={gs.bg} style:color={gs.text} style:border-color={gs.border}>{badge}</span>
                    {/each}
                  </div>
                {/if}
                {#if step.subContent}
                  <pre class="sub-content">{step.subContent}</pre>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  /* ── Card shell ───────────────────────────────────────── */
  .card {
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 12px;
    overflow: hidden;
    font-size: 0.82rem;
    width: 100%;
    max-width: 680px;
    align-self: flex-start;
    transition: border-color 0.2s;
  }
  .card.done  { border-color: rgba(74,222,128,0.10); }
  .card.error { border-color: rgba(248,113,113,0.12); }

  /* ── Header ───────────────────────────────────────────── */
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 0.85rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    color: #d4d4d4;
    font-family: inherit;
    font-size: inherit;
    transition: background 0.12s;
  }
  .header:hover { background: rgba(255,255,255,0.02); }

  .hd-icon {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    color: #555;
  }
  @keyframes iconPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
  .hd-icon.pulsing { color: #3b82f6; animation: iconPulse 1.5s ease-in-out infinite; }

  .hd-title {
    flex: 1;
    font-size: 0.82rem;
    font-weight: 500;
    color: #c8c8c8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .model-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.66rem;
    font-weight: 600;
    padding: 0.13rem 0.4rem;
    border-radius: 5px;
    border: 1px solid;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .chevron {
    color: #3a3a3a;
    flex-shrink: 0;
    transition: transform 0.18s ease;
  }
  .chevron.open { transform: rotate(180deg); }

  /* ── Description ─────────────────────────────────────── */
  .description {
    padding: 0.55rem 0.85rem 0.65rem;
    color: #888;
    font-size: 0.8rem;
    line-height: 1.55;
    border-top: 1px solid #181818;
    white-space: pre-wrap;
  }

  /* ── Steps container ─────────────────────────────────── */
  .steps {
    border-top: 1px solid #181818;
  }
  .steps.has-desc {
    border-top-color: #161616;
  }

  /* ── Step ─────────────────────────────────────────────── */
  .step {
    border-bottom: 1px solid #161616;
  }
  .step:last-child { border-bottom: none; }

  .step-row {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.85rem;
    color: #666;
    transition: background 0.1s;
    width: 100%;
    text-align: left;
  }
  .step-row-btn {
    background: none;
    border: none;
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
  }
  .step-row-btn:hover { background: rgba(255,255,255,0.02); }

  .step-running .step-row  { color: #aaa; }
  .step-done    .step-row  { color: #555; }
  .step-error   .step-row  { color: #f87171; }
  .step-pending .step-row  { color: #3a3a3a; }

  .step-icon {
    flex-shrink: 0;
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .step-done  .step-icon { color: #4ade80; }
  .step-running .step-icon { color: #3b82f6; }
  .step-error .step-icon { color: #f87171; }

  .step-label {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.78rem;
  }

  .badges {
    display: flex;
    gap: 0.25rem;
    flex-shrink: 0;
  }
  .badge {
    font-size: 0.6rem;
    font-weight: 700;
    padding: 0.08rem 0.35rem;
    border-radius: 4px;
    border: 1px solid;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
  .badge.lg {
    font-size: 0.65rem;
    padding: 0.15rem 0.45rem;
  }

  .step-meta {
    font-size: 0.69rem;
    color: #3a3a3a;
    white-space: nowrap;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }
  .step-running .step-meta { color: #555; }
  .step-done    .step-meta { color: #3a3a3a; }

  .step-chevron {
    color: #333;
    flex-shrink: 0;
    transition: transform 0.15s;
  }
  .step-chevron.open { transform: rotate(180deg); }

  /* ── Expandable body ─────────────────────────────────── */
  .step-body {
    padding: 0.5rem 0.85rem 0.65rem 2.3rem;
    border-top: 1px solid #161616;
    background: rgba(255,255,255,0.01);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .thumbnail {
    width: 100%;
    max-width: 260px;
    border-radius: 6px;
    border: 1px solid #222;
    display: block;
  }

  .body-badges {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
  }

  .sub-content {
    font-family: inherit;
    font-size: 0.74rem;
    color: #666;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
  }

  /* ── Spinner ─────────────────────────────────────────── */
  .spinner {
    width: 10px;
    height: 10px;
    border: 1.5px solid rgba(59,130,246,0.2);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
    display: inline-block;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
