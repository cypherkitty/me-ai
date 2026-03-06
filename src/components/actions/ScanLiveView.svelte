<script>
  import { EVENT_GROUPS } from "../../lib/events.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

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
  <div class="mt-2 p-3 rounded-xl border border-border bg-card">
    <!-- ── Top bar: phase + progress ────────────────────────────── -->
    <div class="flex justify-between items-center mb-1.5">
      <div class="flex items-center gap-1.5">
        {#if isDone}
          <span class="size-1.5 rounded-full shrink-0 bg-[var(--color-success)]"></span>
          <span class="text-[0.72rem] font-semibold text-[var(--color-success)]">Scan complete</span>
        {:else if progress.phase === "loading"}
          <span class="size-1.5 rounded-full shrink-0 bg-[var(--color-warning)] animate-pulse"></span>
          <span class="text-[0.72rem] font-medium text-muted-foreground">Loading emails…</span>
        {:else}
          <span class="size-1.5 rounded-full shrink-0 bg-primary animate-pulse"></span>
          <span class="text-[0.72rem] font-medium text-muted-foreground">
            Scanning email <strong class="text-foreground">{progress.current ?? 0}</strong> of
            <strong class="text-foreground">{progress.total ?? 0}</strong>
          </span>
        {/if}
      </div>
      <span class="text-[0.68rem] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{pct}%</span>
    </div>

    <!-- Progress bar -->
    <div class="h-0.5 rounded bg-muted overflow-hidden mb-2">
      <div
        class="h-full rounded transition-[width] duration-300 {isDone ? 'bg-[var(--color-success)]' : 'bg-primary'}"
        style:width="{pct}%"
      ></div>
    </div>

    <!-- Quick stats row (during scan) -->
    {#if progress.totals && !isDone}
      <div class="flex flex-wrap gap-x-3 gap-y-1 mb-2">
        <span class="flex items-center gap-1 text-[0.64rem] font-medium text-[var(--color-success)]">
          <span class="opacity-70">✓</span>
          {progress.classified || 0} classified
        </span>
        {#if progress.errors}
          <span class="flex items-center gap-1 text-[0.64rem] font-medium text-destructive">
            <span class="opacity-70">✗</span>
            {progress.errors} error{progress.errors !== 1 ? "s" : ""}
          </span>
        {/if}
        <span class="flex items-center gap-1 text-[0.64rem] font-medium text-muted-foreground">
          <span class="opacity-70">⏱</span>
          {fmtTime(progress.totals.elapsed)}
        </span>
        {#if progress.live?.tps}
          <span class="flex items-center gap-1 text-[0.64rem] font-medium text-muted-foreground">
            <span class="opacity-70">⚡</span>
            {progress.live.tps.toFixed(0)} tok/s
          </span>
        {/if}
      </div>
    {/if}

    <!-- ── Active email + AI output ─────────────────────────────── -->
    {#if !isDone && progress.email && (progress.phase === "generating" || progress.phase === "scanning")}
      <div class="rounded-lg border border-border bg-card p-2.5 mb-2">
        <div class="mb-1.5 pb-1.5 border-b border-border">
          <div class="text-[0.72rem] font-semibold text-foreground truncate">
            {progress.email.subject || "(no subject)"}
          </div>
          <div class="text-[0.6rem] text-muted-foreground">
            {shortSender(progress.email.from)}
            {#if progress.email.date}<span class="text-muted-foreground/80"> · {shortDate(progress.email.date)}</span>{/if}
          </div>
        </div>

        <div class="flex items-center gap-1.5 text-[0.62rem] text-muted-foreground mb-1.5">
          <span
            class={cn(
              "size-1.5 rounded-full shrink-0",
              progress.streamingText ? "bg-[var(--color-success)]" : "bg-primary/50 animate-pulse"
            )}
          ></span>
          <span>{phaseLabel}</span>
          {#if progress.live?.numTokens}
            <span class="ml-auto text-muted-foreground/70">{progress.live.numTokens} tokens</span>
          {/if}
        </div>

        <pre class="m-0 p-2 text-[0.65rem] text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto rounded bg-muted/50 border border-border">{progress.streamingText ||
            "Waiting for AI response…"}</pre>
      </div>
    {/if}

    <!-- ── Completed email log ───────────────────────────────────── -->
    {#if progress.results?.length > 0}
      <div class="mb-2">
        <div class="flex justify-between items-center mb-1.5">
          <span class="text-[0.62rem] font-bold text-muted-foreground uppercase tracking-wider">Processed emails</span>
          <span class="text-[0.6rem] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
            {progress.results.length} / {progress.total ?? 0}
          </span>
        </div>
        {#each progress.results as r, idx}
          <div
            class="p-2 rounded-lg border mb-1 {!r.success ? 'border-destructive/20 bg-destructive/5' : 'border-border bg-muted/20'}"
          >
            <div class="flex items-center gap-1.5 mb-0.5">
              <span class="text-[0.58rem] font-bold text-muted-foreground tabular-nums shrink-0">#{idx + 1}</span>
              <span class="text-[0.68rem] font-medium text-foreground truncate flex-1">{r.email.subject || "(no subject)"}</span>
              {#if r.success}
                <span class="text-[0.56rem] font-bold text-[var(--color-success)] uppercase tracking-wide bg-[var(--color-success)]/10 px-1.5 py-0.5 rounded shrink-0">{r.classification.action}</span>
                {#if r.classification.group}
                  {@const grp = EVENT_GROUPS[r.classification.group] || EVENT_GROUPS["CRITICAL"]}
                  {#if grp}
                    <span class="text-[0.52rem] font-bold uppercase tracking-wide shrink-0 opacity-80" style:color={grp.color} title={grp.description}>{grp.label}</span>
                  {/if}
                {/if}
              {:else}
                <span class="text-[0.56rem] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded shrink-0">Error</span>
              {/if}
            </div>
            <div class="text-[0.58rem] text-muted-foreground mb-0.5">
              {shortSender(r.email.from)}{#if r.email.date}<span class="text-muted-foreground/60"> · </span>{shortDate(r.email.date)}{/if}
            </div>
            {#if r.success && r.classification.summary}
              <div class="text-[0.63rem] text-muted-foreground leading-snug mb-0.5">{r.classification.summary}</div>
            {/if}
            {#if r.success && r.stats}
              <div class="text-[0.57rem] text-muted-foreground/80">
                {#if r.stats.tps}{r.stats.tps.toFixed(0)} tok/s · {/if}{r.stats.inputTokens || 0} in · {r.stats.numTokens || 0} out · {fmtTime(r.stats.elapsed)}
              </div>
            {/if}
            {#if !r.success}
              <div class="text-[0.62rem] text-destructive mt-0.5">{r.error}</div>
            {/if}
            {#if r.rawResponse}
              <details class="mt-1">
                <summary class="text-[0.58rem] text-muted-foreground cursor-pointer select-none hover:text-foreground">Raw AI output</summary>
                <pre class="mt-1 p-2 bg-muted/50 border border-border rounded text-[0.6rem] text-muted-foreground font-mono whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto leading-tight">{r.rawResponse}</pre>
              </details>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    <!-- ── Done summary ──────────────────────────────────────────── -->
    {#if isDone && progress.totals}
      <div class="p-2.5 rounded-lg border border-border bg-muted/20 mb-2">
        <div class="flex gap-6 mb-1.5">
          <div class="flex flex-col gap-0.5">
            <span class="text-base font-bold text-foreground leading-none">{progress.summary?.processed || progress.total || 0}</span>
            <span class="text-[0.58rem] text-muted-foreground uppercase tracking-wide">Emails scanned</span>
          </div>
          <div class="flex flex-col gap-0.5">
            <span class="text-base font-bold text-[var(--color-success)] leading-none">{progress.classified || 0}</span>
            <span class="text-[0.58rem] text-muted-foreground uppercase tracking-wide">Classified</span>
          </div>
          {#if progress.errors > 0}
            <div class="flex flex-col gap-0.5">
              <span class="text-base font-bold text-destructive leading-none">{progress.errors}</span>
              <span class="text-[0.58rem] text-muted-foreground uppercase tracking-wide">Errors</span>
            </div>
          {/if}
          {#if progress.summary?.skipped}
            <div class="flex flex-col gap-0.5">
              <span class="text-base font-bold text-muted-foreground leading-none">{progress.summary.skipped}</span>
              <span class="text-[0.58rem] text-muted-foreground uppercase tracking-wide">Skipped</span>
            </div>
          {/if}
        </div>
        <div class="text-[0.6rem] text-muted-foreground">
          {#if progress.summary?.avgTps}Avg speed: {progress.summary.avgTps} tok/s · {/if}
          Tokens: {fmtTokens(progress.totals.inputTokens)} in / {fmtTokens(progress.totals.outputTokens)} out · Time: {fmtTime(progress.totals.elapsed)}
          {#if progress.summary?.modelName} · {progress.summary.modelName}{/if}
        </div>
      </div>
    {/if}

    <!-- ── Buttons ───────────────────────────────────────────────── -->
    <div class="flex gap-1.5 justify-end mt-2">
      {#if isDone}
        <Button variant="outline" size="sm" onclick={oninspect} class="text-xs h-7">View Prompt</Button>
        <Button size="sm" onclick={onclose} class="text-xs h-7">Done</Button>
      {:else}
        <Button variant="outline" size="sm" onclick={oninspect} class="text-xs h-7">View Prompt</Button>
        <Button variant="destructive" size="sm" onclick={onstop} class="text-xs h-7">Stop</Button>
      {/if}
    </div>
  </div>
{/if}
