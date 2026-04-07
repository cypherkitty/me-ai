<script lang="ts">
  import { onMount } from "svelte";
  import { formatBytesPrecise, progressPct } from "../../lib/format.js";
  import { mountLog } from "../../lib/debug.js";
  import { Progress } from "$lib/components/ui/progress/index.js";
  import { Card, CardContent } from "$lib/components/ui/card/index.js";
  import { CheckCircle2 } from "lucide-svelte";
  import { cn } from "$lib/utils.js";

  interface ProgressItem {
    file?: string;
    id?: string;
    loaded?: number;
    total?: number;
    done?: boolean;
  }
  interface Props {
    message?: string;
    items?: ProgressItem[];
  }
  let { message = "", items = [] }: Props = $props();
  let aggregateSpeedBps = $state<number | null>(null);
  let aggregateEtaSeconds = $state<number | null>(null);
  let lastSampleLoaded = $state<number | null>(null);
  let lastSampleAt = $state<number | null>(null);
  let firstProgressAt = $state<number | null>(null);
  let speedSampleCount = $state(0);
  let preparationDots = $state(".");
  let nowTick = $state(performance.now());

  function formatRate(bytesPerSecond: number): string {
    return `${formatBytesPrecise(Math.max(0, Math.round(bytesPerSecond)))}/s`;
  }

  function formatEta(seconds: number): string {
    const totalSeconds = Math.ceil(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    if (minutes === 0) return `${totalSeconds}s`;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  let aggregateLoaded = $derived(
    items.reduce((sum, item) => sum + (item.loaded || 0), 0),
  );
  let aggregateTotal = $derived(
    items.reduce((sum, item) => sum + (item.total || 0), 0),
  );
  let aggregatePct = $derived(
    aggregateTotal > 0 ? progressPct(aggregateLoaded, aggregateTotal) : null,
  );
  let isPreparingModel = $derived(
    /compiling shaders|warming up model/i.test(message),
  );
  let displayedAggregatePct = $derived(aggregatePct);
  let totalFiles = $derived(items.length);
  let completedFiles = $derived(
    items.filter((item) => item.done || (item.total && (item.loaded || 0) >= item.total)).length,
  );
  let showEta = $derived(
    aggregateEtaSeconds !== null &&
    aggregateEtaSeconds > 0 &&
    completedFiles < totalFiles &&
    speedSampleCount >= 5 &&
    firstProgressAt !== null &&
    !!lastSampleAt &&
    lastSampleAt - firstProgressAt >= 5000,
  );
  let liveEtaSeconds = $derived.by(() => {
    if (!showEta || aggregateEtaSeconds === null || lastSampleAt === null) return null;
    const elapsedSinceLastSample = Math.max(0, (nowTick - lastSampleAt) / 1000);
    return Math.max(0, aggregateEtaSeconds - elapsedSinceLastSample);
  });
  let etaLabel = $derived.by(() => {
    if (liveEtaSeconds === null) return null;
    if (liveEtaSeconds >= 60) {
      return formatEta(Math.ceil(liveEtaSeconds / 5) * 5);
    }
    if (liveEtaSeconds >= 20) {
      return formatEta(Math.ceil(liveEtaSeconds / 2) * 2);
    }
    return formatEta(Math.ceil(liveEtaSeconds));
  });
  let visibleMessage = $derived(
    isPreparingModel ? `Preparing model${preparationDots}` : message,
  );
  let sortedItems = $derived(
    [...items].sort((a, b) => {
      const aDone = !!(a.done || (a.total && (a.loaded || 0) >= a.total));
      const bDone = !!(b.done || (b.total && (b.loaded || 0) >= b.total));
      if (aDone !== bDone) return aDone ? 1 : -1;
      return (b.loaded || 0) - (a.loaded || 0);
    }),
  );
  let activeItems = $derived(
    sortedItems.filter((item) => !(item.done || (item.total && (item.loaded || 0) >= item.total))),
  );
  let completedItems = $derived(
    sortedItems.filter((item) => item.done || (item.total && (item.loaded || 0) >= item.total)),
  );

  $effect(() => {
    if (!items.length) {
      aggregateSpeedBps = null;
      aggregateEtaSeconds = null;
      lastSampleLoaded = null;
      lastSampleAt = null;
      firstProgressAt = null;
      speedSampleCount = 0;
      return;
    }

    const now = performance.now();

    if (firstProgressAt === null && aggregateLoaded > 0) {
      firstProgressAt = now;
    }

    if (
      lastSampleLoaded === null ||
      lastSampleAt === null ||
      aggregateLoaded < lastSampleLoaded
    ) {
      lastSampleLoaded = aggregateLoaded;
      lastSampleAt = now;
      aggregateEtaSeconds =
        aggregateSpeedBps && aggregateTotal > aggregateLoaded
          ? (aggregateTotal - aggregateLoaded) / aggregateSpeedBps
          : null;
      return;
    }

    const elapsedSeconds = (now - lastSampleAt) / 1000;
    const deltaBytes = aggregateLoaded - lastSampleLoaded;

    if (deltaBytes > 0 && elapsedSeconds > 0.05) {
      const instantSpeed = deltaBytes / elapsedSeconds;
      aggregateSpeedBps = aggregateSpeedBps
        ? aggregateSpeedBps * 0.7 + instantSpeed * 0.3
        : instantSpeed;
      speedSampleCount += 1;
      lastSampleLoaded = aggregateLoaded;
      lastSampleAt = now;
    }

    aggregateEtaSeconds =
      aggregateSpeedBps && aggregateTotal > aggregateLoaded && completedFiles < totalFiles
        ? (aggregateTotal - aggregateLoaded) / aggregateSpeedBps
        : null;
  });

  $effect(() => {
    const intervalId = window.setInterval(() => {
      nowTick = performance.now();
    }, 2000);

    return () => window.clearInterval(intervalId);
  });

  $effect(() => {
    if (!isPreparingModel) {
      preparationDots = ".";
      return;
    }

    const frames = [".", "..", "..."];
    let frameIndex = 0;
    const intervalId = window.setInterval(() => {
      frameIndex = (frameIndex + 1) % frames.length;
      preparationDots = frames[frameIndex];
    }, 450);

    return () => window.clearInterval(intervalId);
  });

  onMount(() => mountLog("LoadingProgress"));
</script>

<div class="w-full h-full overflow-y-auto" style="scrollbar-gutter: stable;">
  <div class="max-w-[560px] w-full mx-auto p-8 flex flex-col items-center text-center gap-4">
    <p class="text-sm text-muted-foreground tracking-tight">{visibleMessage}</p>

    {#if items.length > 0}
    <Card class={cn("w-full overflow-hidden", isPreparingModel ? "border-success/30 bg-success/[0.04]" : "border-primary/15 bg-card")}>
      <CardContent class="pt-4 pb-3 px-4 text-left">
        <div class="flex items-center justify-between gap-2 mb-3">
          <span class={cn(
            "text-[0.68rem] font-semibold uppercase tracking-[0.18em]",
            isPreparingModel ? "text-success/80" : "text-muted-foreground/60",
          )}>
            {isPreparingModel ? "Download complete" : "Total download"}
          </span>
          {#if displayedAggregatePct !== null && !isPreparingModel}
            <span class="text-sm font-semibold text-primary tabular-nums">
              {displayedAggregatePct.toFixed(1)}%
            </span>
          {:else if isPreparingModel}
            <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-success">
              <CheckCircle2 class="size-4" />
              Ready
            </span>
          {/if}
        </div>

        {#if displayedAggregatePct !== null && !isPreparingModel}
          <Progress value={displayedAggregatePct} class="h-1.5 mb-2.5" />
        {/if}

        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div class="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
            <div class="text-[0.62rem] uppercase tracking-wider text-muted-foreground/45">Downloaded</div>
            <div class="mt-1 font-semibold text-foreground tabular-nums">
              {formatBytesPrecise(aggregateLoaded)}
              {#if aggregateTotal > 0}
                <span class="text-muted-foreground/35 font-normal"> / {formatBytesPrecise(aggregateTotal)}</span>
              {/if}
            </div>
          </div>
          <div class="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
            <div class="text-[0.62rem] uppercase tracking-wider text-muted-foreground/45">Files</div>
            <div class="mt-1 font-semibold text-foreground tabular-nums">{completedFiles}/{totalFiles}</div>
          </div>
          <div class="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
            <div class="text-[0.62rem] uppercase tracking-wider text-muted-foreground/45">Speed</div>
            <div class="mt-1 font-semibold text-foreground tabular-nums">
              {#if aggregateSpeedBps && !isPreparingModel}{formatRate(aggregateSpeedBps)}{:else}--{/if}
            </div>
          </div>
          <div class="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
            <div class="text-[0.62rem] uppercase tracking-wider text-muted-foreground/45">ETA</div>
            <div class="mt-1 font-semibold text-foreground tabular-nums">
              {#if etaLabel}
                {etaLabel}
              {:else if isPreparingModel}
                preparing
              {:else}
                --
              {/if}
            </div>
          </div>
        </div>
        {#if isPreparingModel}
          <div class="mt-3 text-xs text-success/80 tabular-nums">
            Compiling shaders and warming up model{preparationDots}
          </div>
        {/if}
      </CardContent>
    </Card>
    {/if}

    {#if activeItems.length > 0}
      <div class="w-full flex items-center justify-between px-1">
        <span class="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/55">
          Active downloads
        </span>
        <span class="text-[0.68rem] text-muted-foreground/45 tabular-nums">
          {activeItems.length} active
        </span>
      </div>
    {/if}

    {#each activeItems as item (item.file ?? item.id)}
    {@const pct = item.total ? progressPct(item.loaded || 0, item.total) : null}
    <Card class="w-full transition-colors">
      <CardContent class="pt-4 pb-3 px-4">
        <div class="flex items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <span class="text-xs truncate flex-1 min-w-0 text-muted-foreground" title={item.file}>
              {item.file}
            </span>
          </div>
          {#if pct !== null}
            <span class="text-sm font-semibold tabular-nums shrink-0 text-primary">
              {pct.toFixed(1)}%
            </span>
          {/if}
        </div>

        {#if item.total}
          <Progress value={pct ?? 0} class="h-1 mb-2" />
          <div class="flex items-baseline gap-1.5 flex-wrap text-xs text-muted-foreground tabular-nums">
            <span class="text-foreground font-medium">{formatBytesPrecise(item.loaded || 0)}</span>
            <span class="opacity-30">/</span>
            <span class="opacity-60">{formatBytesPrecise(item.total)}</span>
            <span class="text-[0.62rem] opacity-35 ml-1">({(item.loaded || 0).toLocaleString()} / {item.total.toLocaleString()} B)</span>
          </div>
        {:else}
          <div class="h-1 w-full bg-muted rounded-full overflow-hidden mb-2">
            <div class="h-full w-[30%] bg-primary rounded-full animate-[slide_1.5s_ease-in-out_infinite]"></div>
          </div>
          <div class="text-xs text-muted-foreground tabular-nums">
            {#if item.loaded}
              <span class="text-foreground font-medium">{formatBytesPrecise(item.loaded)}</span>
              <span class="opacity-35 ml-1">({item.loaded.toLocaleString()} B)</span>
            {:else}
              <span class="italic opacity-50">downloading…</span>
            {/if}
          </div>
        {/if}
      </CardContent>
    </Card>
    {/each}

    {#if completedItems.length > 0}
      <details class="w-full group">
        <summary class="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-success/20 bg-success/[0.035] text-left cursor-pointer list-none hover:bg-success/[0.05] transition-colors">
          <div class="flex items-center gap-2 min-w-0">
            <CheckCircle2 class="size-4 shrink-0 text-success" />
            <span class="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-success/85">
              Completed files
            </span>
          </div>
          <span class="text-xs text-success/70 tabular-nums">{completedItems.length}</span>
        </summary>
        <div class="mt-2 flex flex-col gap-2">
          {#each completedItems as item (item.file ?? item.id)}
            {@const pct = item.total ? progressPct(item.loaded || 0, item.total) : null}
            <Card class="w-full transition-colors border-success/25 bg-success/[0.04]">
              <CardContent class="pt-4 pb-3 px-4">
                <div class="flex items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2 min-w-0 flex-1">
                    <CheckCircle2 class="size-3.5 shrink-0 text-success" />
                    <span class="text-xs truncate flex-1 min-w-0 text-success/90" title={item.file}>
                      {item.file}
                    </span>
                  </div>
                  {#if pct !== null}
                    <span class="text-sm font-semibold tabular-nums shrink-0 text-success">
                      {pct.toFixed(1)}%
                    </span>
                  {/if}
                </div>

                {#if item.total}
                  <Progress value={pct ?? 0} class="h-1 mb-2 [&_[data-slot=progress-indicator]]:bg-[var(--color-success)]" />
                  <div class="flex items-baseline gap-1.5 flex-wrap text-xs text-muted-foreground tabular-nums">
                    <span class="text-foreground font-medium">{formatBytesPrecise(item.loaded || 0)}</span>
                    <span class="opacity-30">/</span>
                    <span class="opacity-60">{formatBytesPrecise(item.total)}</span>
                    <span class="text-[0.62rem] opacity-35 ml-1">({(item.loaded || 0).toLocaleString()} / {item.total.toLocaleString()} B)</span>
                  </div>
                {/if}
              </CardContent>
            </Card>
          {/each}
        </div>
      </details>
    {/if}
  </div>
</div>

<style>
  @keyframes slide {
    0% { margin-left: 0%; }
    50% { margin-left: 70%; }
    100% { margin-left: 0%; }
  }
</style>
