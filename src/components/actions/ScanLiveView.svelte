<script>
  import { SYSTEM_PROMPT } from "../../lib/triage.js";

  let { progress = null, onstop, oninspect, onclose } = $props();

  // Running list of processed emails (accumulates during scan)
  let processedEmails = $state([]);
  let lastCapturedIndex = $state(-1);

  $effect(() => {
    if (!progress) {
      console.log("❌ No progress object");
      processedEmails = [];
      lastCapturedIndex = -1;
      return;
    }

    console.log(`📊 Progress update: phase=${progress.phase}, current=${progress.current}, lastCaptured=${lastCapturedIndex}, processedCount=${processedEmails.length}`);

    // New scan started - clear everything
    if (progress.phase === "loading") {
      console.log("🔄 Scan starting, clearing processedEmails");
      processedEmails = [];
      lastCapturedIndex = -1;
      return;
    }

    // Capture each email when it finishes (classified phase has result + stats)
    if (progress.phase === "classified") {
      if (progress.current !== lastCapturedIndex) {
        console.log(`✅ CAPTURING email ${progress.current}:`, {
          subject: progress.email?.subject,
          action: progress.result?.action,
          hasStats: !!progress.emailStats,
          hasRawResponse: !!progress.rawResponse,
          rawResponseLength: progress.rawResponse?.length || 0
        });
        
        processedEmails = [...processedEmails, {
          index: progress.current,
          email: progress.email,
          result: progress.result,
          rawResponse: progress.rawResponse || "",
          stats: progress.emailStats,
        }];
        lastCapturedIndex = progress.current;
        
        console.log(`   Total captured now: ${processedEmails.length}`);
      } else {
        console.log(`⚠️ Skipping duplicate email ${progress.current} (already captured)`);
      }
    }

    // Log when scan completes
    if (progress.phase === "done") {
      console.log(`🏁 Scan complete!`);
      console.log(`   - processedEmails.length: ${processedEmails.length}`);
      console.log(`   - progress.results.length: ${progress.results?.length || 0}`);
      console.log(`   - progress.classified: ${progress.classified}`);
      console.log(`   - progress.errors: ${progress.errors}`);
      if (progress.results) {
        console.log(`   - First result:`, progress.results[0]);
      }
    }
  });

  function fmtTime(ms) {
    if (!ms || ms < 0) return "—";
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }

  function fmtTokens(n) {
    if (!n) return "0";
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  }

  function shortSender(from) {
    if (!from) return "—";
    const name = from.replace(/<.*>/, "").trim();
    return name.length > 30 ? name.slice(0, 28) + "…" : name;
  }

  function shortDate(ts) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch { return ""; }
  }

  function estimateRemaining(p) {
    if (!p?.totals?.elapsed || !p?.current || p.current < 2) return null;
    const avgPerEmail = p.totals.elapsed / p.current;
    const remaining = (p.total - p.current) * avgPerEmail;
    return remaining;
  }

  let pct = $derived(progress?.total ? Math.round((progress.current / progress.total) * 100) : 0);
  let eta = $derived(estimateRemaining(progress));
  let isDone = $derived(progress?.phase === "done");
  
  // Computed email list for display - prefer final results when scan is done
  let useResults = $derived(progress?.phase === "done" && progress?.results?.length > 0);
  let emailsList = $derived(useResults && progress?.results ? 
    progress.results.map((r, idx) => ({
      index: idx + 1,
      email: r.email,
      result: r.success ? r.classification : null,
      rawResponse: r.rawResponse || "",
      stats: r.stats,
      error: r.success ? null : r.error
    })) : processedEmails
  );
</script>

{#if progress}
  <div class="live">
    <!-- ── Header ──────────────────────────────────── -->
    <div class="live-head">
      <span class="live-title">
        {#if isDone}
          Scan complete
        {:else if progress.phase === "loading"}
          Loading emails...
        {:else}
          Processing {progress.current ?? 0} of {progress.total ?? 0}
        {/if}
      </span>
      <span class="live-pct">{pct}%</span>
    </div>

    <!-- ── Progress bar ────────────────────────────── -->
    <div class="bar-track">
      <div
        class="bar-fill"
        class:done={isDone}
        style:width="{pct}%"
      ></div>
    </div>

    <!-- ── Current email ───────────────────────────── -->
    {#if progress.email && !isDone}
      <div class="email-card">
        <div class="email-subj">{progress.email.subject || "(no subject)"}</div>
        <div class="email-meta">
          {shortSender(progress.email.from)}
          {#if progress.email.date}
            <span class="sep">·</span>{shortDate(progress.email.date)}
          {/if}
        </div>
      </div>
    {/if}

    <!-- ── Live generation stats ───────────────────── -->
    {#if progress.live && progress.phase === "generating"}
      <div class="stats-row">
        <div class="stat">
          <span class="stat-val">{progress.live.tps ? progress.live.tps.toFixed(0) : "—"}</span>
          <span class="stat-label">tok/s</span>
        </div>
        <div class="stat">
          <span class="stat-val">{progress.live.numTokens || 0}</span>
          <span class="stat-label">tokens</span>
        </div>
        {#if eta}
          <div class="stat">
            <span class="stat-val">~{fmtTime(eta)}</span>
            <span class="stat-label">remaining</span>
          </div>
        {/if}
      </div>
    {/if}

    <!-- ── Live LLM Output (current email streaming) ── -->
    {#if !isDone && (progress.phase === "generating" || progress.phase === "scanning") && progress.email}
      <div class="llm-stream-box">
        <div class="llm-stream-header">
          <span class="llm-stream-label">
            {#if progress.phase === "generating"}
              LLM Output
            {:else}
              Sending to model…
            {/if}
          </span>
          {#if progress.phase === "generating"}
            <span class="llm-stream-badge">Live</span>
          {/if}
        </div>
        <div class="llm-output-content">{progress.streamingText || "Waiting for model…"}</div>
      </div>
    {/if}

    <!-- ── Debug info ─────────────────────────────────── -->
    <div class="debug-info">
      Phase: {progress.phase} | 
      Captured: {processedEmails.length} | 
      Results: {progress.results?.length || 0} | 
      Current: {progress.current || 0}/{progress.total || 0} |
      Classified: {progress.classified || 0} |
      Errors: {progress.errors || 0}
    </div>

    <!-- ── Processed emails list - ALWAYS SHOW ── -->
    <div class="processed-list">
      <div class="processed-header">
        <span class="processed-title">Processed Emails {useResults ? '(Final)' : '(Live)'}</span>
        <span class="processed-count">{emailsList.length}{progress.total ? ` / ${progress.total}` : ""}</span>
      </div>
      {#if emailsList.length === 0}
        <div class="processed-empty">
          {#if progress.phase === "loading"}
            Loading emails...
          {:else if progress.phase === "done"}
            No emails were processed (all may have been skipped)
          {:else}
            Waiting for first email to finish processing...
          {/if}
        </div>
      {:else}
        {#each emailsList as item}
          <div class="processed-item" class:failed={item.error}>
            <div class="pi-head">
              <span class="pi-index">#{item.index}</span>
              <span class="pi-subj">{item.email.subject || "(no subject)"}</span>
              {#if item.error}
                <span class="pi-action error">ERROR</span>
              {:else}
                <span class="pi-action">{item.result?.action || "—"}</span>
              {/if}
            </div>
            <div class="pi-meta">
              {shortSender(item.email.from)}
              {#if item.email.date}
                <span class="sep">·</span>{shortDate(item.email.date)}
              {/if}
            </div>
            {#if item.error}
              <div class="pi-error-msg">{item.error}</div>
            {:else}
              {#if item.result?.summary}
                <div class="pi-summary">{item.result.summary}</div>
              {/if}
              {#if item.result?.tags?.length}
                <div class="pi-tags">
                  {#each item.result.tags as tag}
                    <span class="pi-tag">{tag}</span>
                  {/each}
                </div>
              {/if}
              {#if item.stats}
                <div class="pi-stats">
                  {item.stats.tps ? `${item.stats.tps.toFixed(0)} tok/s` : ""}
                  <span class="sep">·</span>
                  {item.stats.inputTokens || 0} in + {item.stats.numTokens || 0} out tokens
                  <span class="sep">·</span>
                  {fmtTime(item.stats.elapsed)}
                </div>
              {/if}
              {#if item.rawResponse}
                <details class="pi-llm-details">
                  <summary class="pi-llm-toggle">View raw LLM output</summary>
                  <div class="llm-output-content">{item.rawResponse}</div>
                </details>
              {/if}
            {/if}
          </div>
        {/each}
      {/if}
    </div>

    <!-- ── Completion summary (phase=done) ─────────── -->
    {#if isDone}
      <div class="summary-card">
        <div class="summary-head">
          <span class="summary-title">Scan Summary</span>
        </div>

        <!-- Main stats grid -->
        <div class="summary-grid">
          <div class="summary-stat">
            <span class="sstat-val">{progress.summary?.processed || progress.total || 0}</span>
            <span class="sstat-label">emails processed</span>
          </div>
          {#if progress.summary?.skipped}
            <div class="summary-stat">
              <span class="sstat-val">{progress.summary.skipped}</span>
              <span class="sstat-label">already classified</span>
            </div>
          {/if}
          <div class="summary-stat">
            <span class="sstat-val success">{progress.classified || 0}</span>
            <span class="sstat-label">classified</span>
          </div>
          {#if progress.errors > 0}
            <div class="summary-stat">
              <span class="sstat-val err">{progress.errors}</span>
              <span class="sstat-label">errors</span>
            </div>
          {/if}
        </div>

        <!-- LLM performance -->
        <div class="summary-section">
          <div class="ssec-title">LLM Performance</div>
          <div class="ssec-items">
            {#if progress.summary?.avgTps}
              <span class="ssec-item">Avg speed: <strong>{progress.summary.avgTps} tok/s</strong></span>
              <span class="sep">·</span>
            {/if}
            <span class="ssec-item">Total tokens: <strong>{fmtTokens(progress.totals.inputTokens)} in + {fmtTokens(progress.totals.outputTokens)} out</strong></span>
            <span class="sep">·</span>
            <span class="ssec-item">Duration: <strong>{fmtTime(progress.totals.elapsed)}</strong></span>
          </div>
        </div>

        <!-- Model & Prompt info -->
        <div class="summary-section">
          <div class="ssec-title">Model & Prompts</div>
          <div class="ssec-items">
            <span class="ssec-item">Model: <strong>{progress.summary?.modelName || "Unknown"}</strong> ({Math.round((progress.summary?.modelContextWindow || 0) / 1024)}k context, ~{Math.round((progress.summary?.modelMaxEmailTokens || 0) / 1000)}k email limit)</span>
            <span class="sep">·</span>
            <span class="ssec-item">System prompt: <strong>{fmtTokens(progress.summary?.systemPromptSize || 0)} chars</strong></span>
            <span class="sep">·</span>
            <span class="ssec-item">Avg email: <strong>{fmtTokens(progress.summary?.avgPromptSize || 0)} chars</strong></span>
          </div>
        </div>

      </div>
    {:else}
      <!-- ── In-progress totals ────────────────────────── -->
      {#if progress.totals}
        <div class="totals">
          <span>{progress.classified || 0} classified</span>
          {#if progress.errors}<span class="err">{progress.errors} errors</span>{/if}
          <span class="sep">·</span>
          <span>{fmtTokens(progress.totals.inputTokens)} in + {fmtTokens(progress.totals.outputTokens)} out tokens</span>
          <span class="sep">·</span>
          <span>{fmtTime(progress.totals.elapsed)}</span>
        </div>
      {/if}
    {/if}

    <!-- ── Actions ─────────────────────────────────── -->
    <div class="actions">
      {#if isDone}
        <button class="action-btn" onclick={oninspect}>View Prompt Config</button>
        <button class="action-btn primary" onclick={onclose}>Close</button>
      {:else}
        <button class="action-btn" onclick={oninspect}>View Prompt</button>
        <button class="action-btn stop" onclick={onstop}>Stop</button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .live {
    margin-top: 0.6rem;
    padding: 0.6rem 0.7rem;
    background: #0f0f0f;
    border: 1px solid #222;
    border-radius: 10px;
  }

  /* ── Header ──────────────────────────────────────── */
  .live-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.35rem;
  }
  .live-title { font-size: 0.74rem; font-weight: 600; color: #ccc; }
  .live-pct { font-size: 0.68rem; font-weight: 700; color: #3b82f6; }

  /* ── Progress bar ────────────────────────────────── */
  .bar-track {
    height: 3px;
    background: #1e1e1e;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }
  .bar-fill {
    height: 100%;
    background: #3b82f6;
    border-radius: 2px;
    transition: width 0.3s ease;
  }
  .bar-fill.done { background: #34d399; }

  /* ── Current email ───────────────────────────────── */
  .email-card {
    padding: 0.35rem 0.45rem;
    background: #161616;
    border: 1px solid #1e1e1e;
    border-radius: 6px;
    margin-bottom: 0.4rem;
  }
  .email-subj {
    font-size: 0.72rem;
    font-weight: 500;
    color: #ddd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .email-meta {
    font-size: 0.6rem;
    color: #555;
    margin-top: 0.05rem;
  }

  /* ── Stats row ───────────────────────────────────── */
  .stats-row {
    display: flex;
    gap: 0.8rem;
    margin-bottom: 0.4rem;
  }
  .stat { display: flex; align-items: baseline; gap: 0.2rem; }
  .stat-val { font-size: 0.78rem; font-weight: 700; color: #e8e8e8; font-variant-numeric: tabular-nums; }
  .stat-label { font-size: 0.58rem; color: #555; }

  /* ── Debug info ─────────────────────────────────────── */
  .debug-info {
    font-size: 0.6rem;
    color: #666;
    background: #0a0a0a;
    border: 1px solid #1e1e1e;
    border-radius: 4px;
    padding: 0.3rem 0.5rem;
    margin-bottom: 0.5rem;
    font-family: monospace;
  }

  /* ── Live LLM stream box ─────────────────────────── */
  .llm-stream-box {
    margin-bottom: 0.5rem;
    padding: 0.45rem;
    background: #0a0a0a;
    border: 1px solid #34d399;
    border-radius: 6px;
  }
  .llm-stream-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.3rem;
  }
  .llm-stream-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .llm-stream-badge {
    font-size: 0.55rem;
    font-weight: 700;
    color: #34d399;
    background: rgba(52, 211, 153, 0.15);
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    animation: pulse 2s ease-in-out infinite;
  }

  /* ── Processed emails list ──────────────────────── */
  .processed-list {
    margin-bottom: 0.5rem;
  }
  .processed-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.35rem;
  }
  .processed-title {
    font-size: 0.7rem;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .processed-count {
    font-size: 0.62rem;
    font-weight: 700;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
  }
  .processed-empty {
    padding: 1rem;
    text-align: center;
    font-size: 0.7rem;
    color: #666;
    font-style: italic;
  }
  .processed-item {
    padding: 0.4rem 0.5rem;
    background: rgba(52, 211, 153, 0.03);
    border: 1px solid rgba(52, 211, 153, 0.1);
    border-radius: 6px;
    margin-bottom: 0.3rem;
  }
  .processed-item.failed {
    background: rgba(248, 113, 113, 0.03);
    border-color: rgba(248, 113, 113, 0.15);
  }
  .pi-head {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.1rem;
  }
  .pi-index {
    font-size: 0.58rem;
    font-weight: 700;
    color: #555;
    flex-shrink: 0;
  }
  .pi-subj {
    font-size: 0.68rem;
    font-weight: 500;
    color: #ccc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
  .pi-action {
    font-size: 0.58rem;
    font-weight: 700;
    color: #34d399;
    letter-spacing: 0.03em;
    flex-shrink: 0;
  }
  .pi-action.error {
    color: #f87171;
  }
  .pi-meta {
    font-size: 0.6rem;
    color: #555;
    margin-bottom: 0.15rem;
  }
  .pi-summary {
    font-size: 0.62rem;
    color: #888;
    line-height: 1.4;
    margin-bottom: 0.15rem;
  }
  .pi-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.15rem;
    margin-bottom: 0.15rem;
  }
  .pi-tag {
    font-size: 0.55rem;
    font-weight: 600;
    color: #999;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.05rem 0.3rem;
    border-radius: 3px;
  }
  .pi-stats {
    font-size: 0.58rem;
    color: #555;
  }
  .pi-error-msg {
    font-size: 0.58rem;
    color: #f87171;
    margin-top: 0.15rem;
  }
  .pi-llm-details {
    margin-top: 0.2rem;
  }
  .pi-llm-toggle {
    font-size: 0.6rem;
    color: #666;
    cursor: pointer;
    user-select: none;
  }
  .pi-llm-toggle:hover { color: #999; }

  /* ── Totals ──────────────────────────────────────── */
  .totals {
    font-size: 0.62rem;
    color: #666;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-bottom: 0.35rem;
  }
  .err { color: #f87171; }
  .sep { color: #333; }

  /* ── Completion summary ─────────────────────────── */
  .summary-card {
    margin-top: 0.4rem;
    padding: 0.5rem;
    background: #161616;
    border: 1px solid #222;
    border-radius: 8px;
  }
  .summary-head {
    margin-bottom: 0.4rem;
  }
  .summary-title {
    font-size: 0.7rem;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .summary-stat {
    display: flex;
    flex-direction: column;
    padding: 0.35rem 0.45rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 6px;
  }
  .sstat-val {
    font-size: 1.1rem;
    font-weight: 700;
    color: #e8e8e8;
    font-variant-numeric: tabular-nums;
  }
  .sstat-val.success { color: #34d399; }
  .sstat-val.err { color: #f87171; }
  .sstat-label {
    font-size: 0.6rem;
    color: #555;
    margin-top: 0.05rem;
  }

  .summary-section {
    margin-bottom: 0.45rem;
    padding: 0.35rem 0.45rem;
    background: rgba(255, 255, 255, 0.015);
    border-radius: 6px;
  }
  .ssec-title {
    font-size: 0.62rem;
    font-weight: 600;
    color: #666;
    margin-bottom: 0.25rem;
  }
  .ssec-items {
    font-size: 0.64rem;
    color: #888;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  .ssec-item strong { color: #ccc; font-weight: 600; }

  /* ── LLM Output Display ─────────────────────────── */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .llm-output-content {
    font-size: 0.68rem;
    color: #ccc;
    font-family: 'Courier New', Consolas, monospace;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 300px;
    overflow-y: auto;
    padding: 0.4rem;
    background: #000;
    border-radius: 4px;
  }

  .processed-item .llm-output-content {
    margin-top: 0.2rem;
    max-height: 200px;
    font-size: 0.6rem;
  }

  /* ── Actions ─────────────────────────────────────── */
  .actions {
    display: flex;
    gap: 0.35rem;
    justify-content: flex-end;
  }
  .action-btn {
    font-size: 0.66rem;
    font-weight: 500;
    color: #888;
    background: none;
    border: 1px solid #2a2a2a;
    border-radius: 5px;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    transition: all 0.12s;
    font-family: inherit;
  }
  .action-btn:hover { color: #ccc; border-color: #3a3a3a; }
  .action-btn.primary { color: #fff; background: #3b82f6; border-color: #3b82f6; }
  .action-btn.primary:hover { background: #2563eb; }
  .action-btn.stop { color: #f87171; border-color: rgba(248, 113, 113, 0.3); }
  .action-btn.stop:hover { background: rgba(248, 113, 113, 0.08); border-color: rgba(248, 113, 113, 0.5); }
</style>