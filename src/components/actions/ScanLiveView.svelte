<script>
  import { SYSTEM_PROMPT } from "../../lib/triage.js";

  let { progress = null, onstop } = $props();

  let showPrompt = $state(false);
  let promptTab = $state("system");

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
</script>

{#if progress}
  <div class="live">
    <!-- ── Header ──────────────────────────────────── -->
    <div class="live-head">
      <span class="live-title">
        {#if progress.phase === "done"}
          Scan complete
        {:else}
          Processing {progress.current} of {progress.total}
        {/if}
      </span>
      <span class="live-pct">{pct}%</span>
    </div>

    <!-- ── Progress bar ────────────────────────────── -->
    <div class="bar-track">
      <div
        class="bar-fill"
        class:done={progress.phase === "done"}
        style:width="{pct}%"
      ></div>
    </div>

    <!-- ── Current email ───────────────────────────── -->
    {#if progress.email && progress.phase !== "done"}
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

    <!-- ── Last result ─────────────────────────────── -->
    {#if progress.result}
      <div class="result-card">
        <span class="result-action">{progress.result.action}</span>
        {#if progress.result.summary}
          <span class="result-summary">{progress.result.summary}</span>
        {/if}
        {#if progress.result.tags?.length}
          <div class="result-tags">
            {#each progress.result.tags as tag}
              <span class="result-tag">{tag}</span>
            {/each}
          </div>
        {/if}
        {#if progress.emailStats}
          <div class="result-stats">
            {progress.emailStats.tps ? `${progress.emailStats.tps.toFixed(0)} tok/s` : ""}
            <span class="sep">·</span>
            {progress.emailStats.inputTokens} in + {progress.emailStats.numTokens} out tokens
            <span class="sep">·</span>
            {fmtTime(progress.emailStats.elapsed)}
          </div>
        {/if}
      </div>
    {/if}

    <!-- ── Totals ──────────────────────────────────── -->
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

    <!-- ── Actions ─────────────────────────────────── -->
    <div class="actions">
      {#if progress.phase !== "done"}
        <button class="action-btn" onclick={() => showPrompt = true}>View Prompt</button>
        <button class="action-btn stop" onclick={onstop}>Stop</button>
      {/if}
    </div>
  </div>

  <!-- ── Prompt modal ────────────────────────────── -->
  {#if showPrompt}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-bg" onclick={() => showPrompt = false} onkeydown={(e) => e.key === "Escape" && (showPrompt = false)}>
      <!-- svelte-ignore a11y_interactive_supports_focus -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="modal" role="dialog" onclick={(e) => e.stopPropagation()}>
        <div class="modal-head">
          <h3>Current Prompt</h3>
          <button class="modal-close" onclick={() => showPrompt = false}>✕</button>
        </div>
        <div class="modal-tabs">
          <button class="mtab" class:active={promptTab === "system"} onclick={() => promptTab = "system"}>System</button>
          <button class="mtab" class:active={promptTab === "email"} onclick={() => promptTab = "email"}>Email</button>
          <button class="mtab" class:active={promptTab === "full"} onclick={() => promptTab = "full"}>Full Prompt</button>
        </div>
        <div class="modal-body">
          {#if promptTab === "system"}
            <pre class="prompt-code">{SYSTEM_PROMPT}</pre>
            <div class="prompt-meta">{SYSTEM_PROMPT.length} chars</div>
          {:else if promptTab === "email"}
            <pre class="prompt-code">{progress.prompt?.user || "(no email prompt)"}</pre>
            <div class="prompt-meta">{progress.prompt?.user?.length || 0} chars</div>
          {:else}
            <pre class="prompt-code">{progress.prompt?.system || ""}{"\n\n---\n\n"}{progress.prompt?.user || ""}</pre>
            <div class="prompt-meta">{(progress.prompt?.system?.length || 0) + (progress.prompt?.user?.length || 0)} chars total</div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
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

  /* ── Last result ─────────────────────────────────── */
  .result-card {
    padding: 0.35rem 0.45rem;
    background: rgba(52, 211, 153, 0.04);
    border: 1px solid rgba(52, 211, 153, 0.15);
    border-radius: 6px;
    margin-bottom: 0.4rem;
  }
  .result-action {
    font-size: 0.66rem;
    font-weight: 700;
    color: #34d399;
    letter-spacing: 0.03em;
  }
  .result-summary {
    display: block;
    font-size: 0.66rem;
    color: #888;
    line-height: 1.35;
    margin-top: 0.1rem;
  }
  .result-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.15rem;
    margin-top: 0.2rem;
  }
  .result-tag {
    font-size: 0.55rem;
    font-weight: 600;
    color: #999;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.05rem 0.3rem;
    border-radius: 3px;
  }
  .result-stats {
    font-size: 0.58rem;
    color: #555;
    margin-top: 0.2rem;
  }

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
  .action-btn.stop { color: #f87171; border-color: rgba(248, 113, 113, 0.3); }
  .action-btn.stop:hover { background: rgba(248, 113, 113, 0.08); border-color: rgba(248, 113, 113, 0.5); }

  /* ── Prompt modal ────────────────────────────────── */
  .modal-bg {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }
  .modal {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 14px;
    width: min(600px, 92vw);
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }
  .modal-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem 0.5rem;
    border-bottom: 1px solid #222;
  }
  .modal-head h3 { font-size: 0.9rem; font-weight: 600; color: #e8e8e8; margin: 0; }
  .modal-close {
    background: none;
    border: none;
    color: #666;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
  }
  .modal-close:hover { color: #ccc; background: #2a2a2a; }

  .modal-tabs {
    display: flex;
    border-bottom: 1px solid #222;
    padding: 0 1rem;
  }
  .mtab {
    padding: 0.45rem 0.7rem;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: #666;
    font-size: 0.74rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.12s;
  }
  .mtab:hover { color: #aaa; }
  .mtab.active { color: #3b82f6; border-bottom-color: #3b82f6; }

  .modal-body {
    padding: 0.75rem 1rem;
    overflow-y: auto;
    flex: 1;
  }
  .prompt-code {
    background: #0d0d0d;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 0.7rem;
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 0.68rem;
    line-height: 1.5;
    color: #c9d1d9;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .prompt-meta {
    font-size: 0.62rem;
    color: #555;
    margin-top: 0.3rem;
    text-align: right;
  }
</style>
