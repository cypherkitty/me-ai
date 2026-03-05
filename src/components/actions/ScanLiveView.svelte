<script>
  import { EVENT_GROUPS } from "../../lib/events.js";

  let { progress = null, onstop, oninspect, onclose } = $props();

  function fmtTime(ms) {
    if (!ms || ms < 0) return "—";
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
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
      return new Date(ts).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  }

  let pct = $derived(
    progress?.total ? Math.round((progress.current / progress.total) * 100) : 0,
  );
  let isDone = $derived(progress?.phase === "done");
  let isWaiting = $derived(
    !isDone && !progress?.streamingText && progress?.phase !== "loading",
  );

  // Phase label shown in the stream box header
  let phaseLabel = $derived(
    (() => {
      if (!progress) return "";
      if (progress.phase === "loading") return "Loading emails from database";
      if (progress.phase === "generating" || progress.phase === "scanning") {
        return progress.streamingText
          ? "Reading email & reasoning"
          : "Sending to AI model…";
      }
      return "Processing";
    })(),
  );
</script>

{#if progress}
  <div class="scan-view">
    <!-- ── Top bar: phase + progress ────────────────────────────── -->
    <div class="top-bar">
      <div class="top-left">
        {#if isDone}
          <span class="phase-dot done"></span>
          <span class="phase-label done-label">Scan complete</span>
        {:else if progress.phase === "loading"}
          <span class="phase-dot loading"></span>
          <span class="phase-label">Loading emails…</span>
        {:else}
          <span class="phase-dot scanning"></span>
          <span class="phase-label">
            Scanning email <strong>{progress.current ?? 0}</strong> of
            <strong>{progress.total ?? 0}</strong>
          </span>
        {/if}
      </div>
      <span class="pct-badge">{pct}%</span>
    </div>

    <!-- Progress bar -->
    <div class="bar">
      <div class="bar-fill" class:done={isDone} style:width="{pct}%"></div>
    </div>

    <!-- Quick stats row (during scan) -->
    {#if progress.totals && !isDone}
      <div class="stat-row">
        <span class="stat">
          <span class="stat-icon">✓</span>
          {progress.classified || 0} classified
        </span>
        {#if progress.errors}
          <span class="stat err">
            <span class="stat-icon">✗</span>
            {progress.errors} error{progress.errors !== 1 ? "s" : ""}
          </span>
        {/if}
        <span class="stat dim">
          <span class="stat-icon">⏱</span>
          {fmtTime(progress.totals.elapsed)}
        </span>
        {#if progress.live?.tps}
          <span class="stat dim">
            <span class="stat-icon">⚡</span>
            {progress.live.tps.toFixed(0)} tok/s
          </span>
        {/if}
      </div>
    {/if}

    <!-- ── Active email + AI output ─────────────────────────────── -->
    {#if !isDone && progress.email && (progress.phase === "generating" || progress.phase === "scanning")}
      <div class="active-email-card">
        <!-- Email info -->
        <div class="ae-email">
          <div class="ae-subject">
            {progress.email.subject || "(no subject)"}
          </div>
          <div class="ae-from">
            {shortSender(progress.email.from)}
            {#if progress.email.date}<span class="ae-date">
                · {shortDate(progress.email.date)}</span
              >{/if}
          </div>
        </div>

        <!-- AI thinking label -->
        <div class="ae-phase-label">
          <span class="ae-phase-dot" class:thinking={!!progress.streamingText}
          ></span>
          <span>{phaseLabel}</span>
          {#if progress.live?.numTokens}
            <span class="ae-token-count">{progress.live.numTokens} tokens</span>
          {/if}
        </div>

        <!-- Streaming output -->
        <pre class="stream-output">{progress.streamingText ||
            "Waiting for AI response…"}</pre>
      </div>
    {/if}

    <!-- ── Completed email log ───────────────────────────────────── -->
    {#if progress.results?.length > 0}
      <div class="history">
        <div class="history-head">
          <span class="history-title">Processed emails</span>
          <span class="history-count"
            >{progress.results.length} / {progress.total ?? 0}</span
          >
        </div>
        {#each progress.results as r, idx}
          <div class="email-item" class:failed={!r.success}>
            <!-- Row 1: number, subject, action tag -->
            <div class="ei-row">
              <span class="ei-num">#{idx + 1}</span>
              <span class="ei-subj">{r.email.subject || "(no subject)"}</span>
              {#if r.success}
                <span class="ei-tag">{r.classification.action}</span>
                {#if r.classification.group}
                  {@const grp =
                    EVENT_GROUPS[r.classification.group] ||
                    EVENT_GROUPS["CRITICAL"]}
                  {#if grp}
                    <span
                      class="ei-group"
                      style:color={grp.color}
                      title={grp.description}
                    >
                      {grp.label}
                    </span>
                  {/if}
                {/if}
              {:else}
                <span class="ei-tag err">Error</span>
              {/if}
            </div>
            <!-- Row 2: sender + date -->
            <div class="ei-from">
              {shortSender(r.email.from)}{#if r.email.date}<span class="sep">
                  ·
                </span>{shortDate(r.email.date)}{/if}
            </div>
            <!-- Summary -->
            {#if r.success && r.classification.summary}
              <div class="ei-summary">{r.classification.summary}</div>
            {/if}
            <!-- Perf stats -->
            {#if r.success && r.stats}
              <div class="ei-stats">
                {#if r.stats.tps}{r.stats.tps.toFixed(0)} tok/s ·
                {/if}{r.stats.inputTokens || 0} in · {r.stats.numTokens || 0} out
                · {fmtTime(r.stats.elapsed)}
              </div>
            {/if}
            {#if !r.success}
              <div class="ei-error">{r.error}</div>
            {/if}
            {#if r.rawResponse}
              <details class="ei-llm">
                <summary>Raw AI output</summary>
                <pre class="ei-llm-text">{r.rawResponse}</pre>
              </details>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    <!-- ── Done summary ──────────────────────────────────────────── -->
    {#if isDone && progress.totals}
      <div class="done-summary">
        <div class="ds-row">
          <div class="ds-stat">
            <span class="ds-val"
              >{progress.summary?.processed || progress.total || 0}</span
            >
            <span class="ds-label">Emails scanned</span>
          </div>
          <div class="ds-stat good">
            <span class="ds-val">{progress.classified || 0}</span>
            <span class="ds-label">Classified</span>
          </div>
          {#if progress.errors > 0}
            <div class="ds-stat err">
              <span class="ds-val">{progress.errors}</span>
              <span class="ds-label">Errors</span>
            </div>
          {/if}
          {#if progress.summary?.skipped}
            <div class="ds-stat dim">
              <span class="ds-val">{progress.summary.skipped}</span>
              <span class="ds-label">Skipped</span>
            </div>
          {/if}
        </div>
        <div class="ds-perf">
          {#if progress.summary?.avgTps}Avg speed: {progress.summary.avgTps} tok/s
            ·
          {/if}Tokens: {fmtTokens(progress.totals.inputTokens)} in / {fmtTokens(
            progress.totals.outputTokens,
          )} out · Time: {fmtTime(
            progress.totals.elapsed,
          )}{#if progress.summary?.modelName}
            · {progress.summary.modelName}{/if}
        </div>
      </div>
    {/if}

    <!-- ── Buttons ───────────────────────────────────────────────── -->
    <div class="btns">
      {#if isDone}
        <button class="btn" onclick={oninspect}>View Prompt</button>
        <button class="btn primary" onclick={onclose}>Done</button>
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
    padding: 0.75rem;
    background: #0d0d0d;
    border: 1px solid #1e1e1e;
    border-radius: 12px;
  }

  /* ── Top bar ─────────────────────────────── */
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.4rem;
  }
  .top-left {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .phase-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .phase-dot.done {
    background: #34d399;
  }
  .phase-dot.loading {
    background: #facc15;
    animation: pulse 1.4s ease-in-out infinite;
  }
  .phase-dot.scanning {
    background: #3b82f6;
    animation: pulse 1.2s ease-in-out infinite;
  }
  .phase-label {
    font-size: 0.72rem;
    font-weight: 500;
    color: #999;
  }
  .done-label {
    color: #34d399;
    font-weight: 600;
  }
  .phase-label strong {
    color: #ddd;
  }
  .pct-badge {
    font-size: 0.68rem;
    font-weight: 700;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.08);
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
  }

  /* ── Progress bar ────────────────────────── */
  .bar {
    height: 3px;
    background: #1e1e1e;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.55rem;
  }
  .bar-fill {
    height: 100%;
    background: #3b82f6;
    border-radius: 2px;
    transition: width 0.35s ease;
  }
  .bar-fill.done {
    background: #34d399;
  }

  /* ── Stat row ────────────────────────────── */
  .stat-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 0.8rem;
    margin-bottom: 0.55rem;
  }
  .stat {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.64rem;
    font-weight: 500;
    color: #34d399;
  }
  .stat.dim {
    color: #666;
  }
  .stat.err {
    color: #f87171;
  }
  .stat-icon {
    opacity: 0.7;
  }

  /* ── Active email card ───────────────────── */
  .active-email-card {
    background: #0a0a0a;
    border: 1px solid #1e3a52;
    border-radius: 8px;
    padding: 0.55rem 0.6rem;
    margin-bottom: 0.55rem;
  }
  .ae-email {
    margin-bottom: 0.35rem;
    padding-bottom: 0.35rem;
    border-bottom: 1px solid #1a1a1a;
  }
  .ae-subject {
    font-size: 0.72rem;
    font-weight: 600;
    color: #ddd;
    margin-bottom: 0.1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ae-from {
    font-size: 0.6rem;
    color: #555;
  }
  .ae-date {
    color: #444;
  }

  .ae-phase-label {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.62rem;
    color: #555;
    margin-bottom: 0.3rem;
  }
  .ae-phase-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #3b82f6;
    flex-shrink: 0;
    opacity: 0.5;
    animation: pulse 1.5s ease-in-out infinite;
  }
  .ae-phase-dot.thinking {
    opacity: 1;
    background: #34d399;
  }
  .ae-token-count {
    margin-left: auto;
    font-size: 0.58rem;
    color: #444;
  }

  .stream-output {
    margin: 0;
    font-size: 0.65rem;
    color: #999;
    font-family: "Courier New", Consolas, monospace;
    line-height: 1.55;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
    padding: 0.4rem;
    background: #060606;
    border-radius: 5px;
  }

  /* ── History ─────────────────────────────── */
  .history {
    margin-bottom: 0.5rem;
  }
  .history-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.35rem;
  }
  .history-title {
    font-size: 0.62rem;
    font-weight: 700;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .history-count {
    font-size: 0.6rem;
    font-weight: 600;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.08);
    padding: 0.06rem 0.35rem;
    border-radius: 4px;
  }

  .email-item {
    padding: 0.4rem 0.55rem;
    background: #111;
    border: 1px solid #1a1a1a;
    border-radius: 7px;
    margin-bottom: 0.25rem;
  }
  .email-item.failed {
    border-color: rgba(248, 113, 113, 0.2);
  }
  .ei-row {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.06rem;
  }
  .ei-num {
    font-size: 0.58rem;
    color: #444;
    font-weight: 700;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }
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
    font-size: 0.56rem;
    font-weight: 700;
    color: #34d399;
    letter-spacing: 0.03em;
    flex-shrink: 0;
    text-transform: uppercase;
    background: rgba(52, 211, 153, 0.08);
    padding: 0.05rem 0.3rem;
    border-radius: 3px;
  }
  .ei-tag.err {
    color: #f87171;
    background: rgba(248, 113, 113, 0.08);
  }
  .ei-group {
    font-size: 0.52rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    flex-shrink: 0;
    opacity: 0.8;
  }
  .ei-from {
    font-size: 0.58rem;
    color: #444;
    margin-bottom: 0.1rem;
  }
  .sep {
    color: #2a2a2a;
  }
  .ei-summary {
    font-size: 0.63rem;
    color: #777;
    line-height: 1.45;
    margin-bottom: 0.1rem;
  }
  .ei-stats {
    font-size: 0.57rem;
    color: #444;
  }
  .ei-error {
    font-size: 0.62rem;
    color: #f87171;
    margin-top: 0.1rem;
  }
  .ei-llm {
    margin-top: 0.15rem;
  }
  .ei-llm summary {
    font-size: 0.58rem;
    color: #444;
    cursor: pointer;
    user-select: none;
  }
  .ei-llm summary:hover {
    color: #777;
  }
  .ei-llm-text {
    margin: 0.2rem 0 0;
    padding: 0.35rem;
    background: #000;
    border: 1px solid #1a1a1a;
    border-radius: 4px;
    font-size: 0.6rem;
    color: #888;
    font-family: "Courier New", Consolas, monospace;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
    line-height: 1.4;
  }

  /* ── Done summary ────────────────────────── */
  .done-summary {
    padding: 0.55rem 0.65rem;
    background: #0f1a12;
    border: 1px solid #1a2e1e;
    border-radius: 8px;
    margin-bottom: 0.45rem;
  }
  .ds-row {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 0.3rem;
  }
  .ds-stat {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
  .ds-val {
    font-size: 1rem;
    font-weight: 700;
    color: #ccc;
    line-height: 1;
  }
  .ds-label {
    font-size: 0.58rem;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .ds-stat.good .ds-val {
    color: #34d399;
  }
  .ds-stat.err .ds-val {
    color: #f87171;
  }
  .ds-stat.dim .ds-val {
    color: #666;
  }
  .ds-perf {
    font-size: 0.6rem;
    color: #555;
  }

  /* ── Buttons ─────────────────────────────── */
  .btns {
    display: flex;
    gap: 0.35rem;
    justify-content: flex-end;
    margin-top: 0.45rem;
  }
  .btn {
    font-size: 0.66rem;
    font-weight: 500;
    color: #777;
    background: none;
    border: 1px solid #252525;
    border-radius: 5px;
    padding: 0.25rem 0.6rem;
    cursor: pointer;
    transition: all 0.12s;
    font-family: inherit;
  }
  .btn:hover {
    color: #ccc;
    border-color: #333;
  }
  .btn.primary {
    color: #fff;
    background: #3b82f6;
    border-color: #3b82f6;
  }
  .btn.primary:hover {
    background: #2563eb;
  }
  .btn.stop {
    color: #f87171;
    border-color: rgba(248, 113, 113, 0.3);
  }
  .btn.stop:hover {
    background: rgba(248, 113, 113, 0.08);
    border-color: rgba(248, 113, 113, 0.5);
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
</style>
