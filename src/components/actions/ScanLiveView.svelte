<script>
  import { EVENT_GROUPS } from "../../lib/events.js";

  let { progress = null, onstop, oninspect, onclose } = $props();

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

  let pct = $derived(progress?.total ? Math.round((progress.current / progress.total) * 100) : 0);
  let isDone = $derived(progress?.phase === "done");
</script>

{#if progress}
  <div class="scan-view">

    <!-- Header + progress bar -->
    <div class="header">
      <span class="title">
        {#if isDone}
          Scan complete — {progress.classified || 0} classified
        {:else if progress.phase === "loading"}
          Loading emails…
        {:else}
          Processing {progress.current ?? 0} / {progress.total ?? 0}
        {/if}
      </span>
      <span class="pct">{pct}%</span>
    </div>
    <div class="bar"><div class="bar-fill" class:done={isDone} style:width="{pct}%"></div></div>

    <!-- Running totals (during scan) -->
    {#if progress.totals && !isDone}
      <div class="totals">
        {progress.classified || 0} classified
        {#if progress.errors}<span class="err"> · {progress.errors} errors</span>{/if}
        <span class="sep"> · </span>
        {fmtTokens(progress.totals.inputTokens)} in + {fmtTokens(progress.totals.outputTokens)} out
        <span class="sep"> · </span>
        {fmtTime(progress.totals.elapsed)}
      </div>
    {/if}

    <!-- Live LLM stream for the current email -->
    {#if !isDone && progress.email && (progress.phase === "generating" || progress.phase === "scanning")}
      <div class="stream-box">
        <div class="stream-head">
          <span class="stream-email">{progress.email.subject || "(no subject)"}</span>
          {#if progress.live?.tps}
            <span class="stream-stats">{progress.live.tps.toFixed(0)} tok/s · {progress.live.numTokens || 0} tokens</span>
          {/if}
        </div>
        <pre class="stream-output">{progress.streamingText || "Waiting for model…"}</pre>
      </div>
    {/if}

    <!-- Email history list: shows all completed emails -->
    {#if progress.results?.length > 0}
      <div class="history">
        <div class="history-head">
          <span class="history-title">Processed emails</span>
          <span class="history-count">{progress.results.length}</span>
        </div>
        {#each progress.results as r, idx}
          <div class="email-item" class:failed={!r.success}>
            <div class="ei-row">
              <span class="ei-num">{idx + 1}.</span>
              <span class="ei-subj">{r.email.subject || "(no subject)"}</span>
              {#if r.success}
                <span class="ei-tag">{r.classification.action}</span>
                {#if r.classification.group}
                  {@const grp = EVENT_GROUPS[r.classification.group]}
                  {#if grp}
                    <span class="ei-group" style:color={grp.color} title={grp.description}>
                      {grp.label}
                    </span>
                  {/if}
                {/if}
              {:else}
                <span class="ei-tag err">ERROR</span>
              {/if}
            </div>
            <div class="ei-from">
              {shortSender(r.email.from)}{#if r.email.date}<span class="sep"> · </span>{shortDate(r.email.date)}{/if}
            </div>
            {#if r.success}
              {#if r.classification.summary}
                <div class="ei-summary">{r.classification.summary}</div>
              {/if}
              {#if r.stats}
                <div class="ei-stats">
                  {r.stats.tps ? `${r.stats.tps.toFixed(0)} tok/s` : "—"}
                  <span class="sep"> · </span>
                  {r.stats.inputTokens || 0} in + {r.stats.numTokens || 0} out
                  <span class="sep"> · </span>
                  {fmtTime(r.stats.elapsed)}
                </div>
              {/if}
              {#if r.rawResponse}
                <details class="ei-llm">
                  <summary>LLM output</summary>
                  <pre class="ei-llm-text">{r.rawResponse}</pre>
                </details>
              {/if}
            {:else}
              <div class="ei-error">{r.error}</div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    <!-- Done summary -->
    {#if isDone && progress.totals}
      <div class="summary">
        <div class="summary-stats">
          <span>{progress.summary?.processed || progress.total || 0} processed</span>
          <span class="sep"> · </span>
          <span class="good">{progress.classified || 0} classified</span>
          {#if progress.errors > 0}<span class="sep"> · </span><span class="err">{progress.errors} errors</span>{/if}
          {#if progress.summary?.skipped}<span class="sep"> · </span><span>{progress.summary.skipped} skipped</span>{/if}
        </div>
        <div class="summary-perf">
          {#if progress.summary?.avgTps}Avg {progress.summary.avgTps} tok/s<span class="sep"> · </span>{/if}
          {fmtTokens(progress.totals.inputTokens)} in + {fmtTokens(progress.totals.outputTokens)} out
          <span class="sep"> · </span>
          {fmtTime(progress.totals.elapsed)}
          <span class="sep"> · </span>
          Model: {progress.summary?.modelName || "Unknown"}
        </div>
      </div>
    {/if}

    <!-- Buttons -->
    <div class="btns">
      {#if isDone}
        <button class="btn" onclick={oninspect}>View Prompt</button>
        <button class="btn primary" onclick={onclose}>Close</button>
      {:else}
        <button class="btn" onclick={oninspect}>View Prompt</button>
        <button class="btn stop" onclick={onstop}>Stop</button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .scan-view {
    margin-top: 0.5rem;
    padding: 0.6rem;
    background: #0f0f0f;
    border: 1px solid #222;
    border-radius: 10px;
  }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; }
  .title { font-size: 0.74rem; font-weight: 600; color: #ccc; }
  .pct { font-size: 0.68rem; font-weight: 700; color: #3b82f6; }

  /* Progress bar */
  .bar { height: 3px; background: #1e1e1e; border-radius: 2px; overflow: hidden; margin-bottom: 0.5rem; }
  .bar-fill { height: 100%; background: #3b82f6; border-radius: 2px; transition: width 0.3s ease; }
  .bar-fill.done { background: #34d399; }

  /* Totals */
  .totals { font-size: 0.62rem; color: #666; margin-bottom: 0.4rem; }

  /* Common */
  .sep { color: #333; }
  .err { color: #f87171; }
  .good { color: #34d399; }

  /* Live stream box */
  .stream-box {
    margin-bottom: 0.5rem;
    padding: 0.4rem;
    background: #0a0a0a;
    border: 1px solid #34d399;
    border-radius: 6px;
  }
  .stream-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }
  .stream-email {
    font-size: 0.66rem;
    font-weight: 600;
    color: #ccc;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    margin-right: 0.5rem;
  }
  .stream-stats {
    font-size: 0.6rem;
    color: #34d399;
    flex-shrink: 0;
    font-weight: 600;
  }
  .stream-output {
    margin: 0;
    font-size: 0.66rem;
    color: #bbb;
    font-family: 'Courier New', Consolas, monospace;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 250px;
    overflow-y: auto;
    padding: 0.35rem;
    background: #000;
    border-radius: 4px;
  }

  /* History list */
  .history { margin-bottom: 0.5rem; }
  .history-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.3rem;
  }
  .history-title { font-size: 0.68rem; font-weight: 600; color: #777; text-transform: uppercase; letter-spacing: 0.04em; }
  .history-count {
    font-size: 0.6rem;
    font-weight: 700;
    color: #3b82f6;
    background: rgba(59,130,246,0.1);
    padding: 0.08rem 0.35rem;
    border-radius: 4px;
  }

  .email-item {
    padding: 0.4rem 0.5rem;
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 6px;
    margin-bottom: 0.25rem;
  }
  .email-item.failed { border-color: rgba(248,113,113,0.25); }

  .ei-row {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.05rem;
  }
  .ei-num { font-size: 0.6rem; color: #555; font-weight: 700; flex-shrink: 0; font-variant-numeric: tabular-nums; }
  .ei-subj {
    font-size: 0.68rem;
    font-weight: 500;
    color: #ddd;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ei-tag {
    font-size: 0.58rem;
    font-weight: 700;
    color: #34d399;
    letter-spacing: 0.03em;
    flex-shrink: 0;
    text-transform: uppercase;
  }
  .ei-tag.err { color: #f87171; }
  .ei-group {
    font-size: 0.52rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    flex-shrink: 0;
    opacity: 0.85;
  }
  .ei-from { font-size: 0.58rem; color: #555; margin-bottom: 0.1rem; }
  .ei-summary { font-size: 0.62rem; color: #888; line-height: 1.4; margin-bottom: 0.1rem; }
  .ei-stats { font-size: 0.58rem; color: #555; }
  .ei-error {
    font-size: 0.6rem;
    color: #f87171;
    margin-top: 0.1rem;
  }

  .ei-llm { margin-top: 0.15rem; }
  .ei-llm summary {
    font-size: 0.58rem;
    color: #555;
    cursor: pointer;
    user-select: none;
  }
  .ei-llm summary:hover { color: #888; }
  .ei-llm-text {
    margin: 0.2rem 0 0;
    padding: 0.35rem;
    background: #000;
    border: 1px solid #1e1e1e;
    border-radius: 4px;
    font-size: 0.6rem;
    color: #bbb;
    font-family: 'Courier New', Consolas, monospace;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
    line-height: 1.4;
  }

  /* Summary */
  .summary {
    padding: 0.4rem 0.5rem;
    background: #161616;
    border: 1px solid #222;
    border-radius: 6px;
    margin-bottom: 0.4rem;
  }
  .summary-stats { font-size: 0.68rem; color: #aaa; margin-bottom: 0.15rem; }
  .summary-perf { font-size: 0.6rem; color: #666; }

  /* Buttons */
  .btns { display: flex; gap: 0.35rem; justify-content: flex-end; }
  .btn {
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
  .btn:hover { color: #ccc; border-color: #3a3a3a; }
  .btn.primary { color: #fff; background: #3b82f6; border-color: #3b82f6; }
  .btn.primary:hover { background: #2563eb; }
  .btn.stop { color: #f87171; border-color: rgba(248,113,113,0.3); }
  .btn.stop:hover { background: rgba(248,113,113,0.08); border-color: rgba(248,113,113,0.5); }

  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
</style>
