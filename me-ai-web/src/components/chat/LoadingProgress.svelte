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

  let smoothedSpeedBps = $state<number | null>(null);
  let visibleSpeedBps = $state<number | null>(null);
  let visibleEtaSeconds = $state<number | null>(null);
  let lastSampleLoaded = $state<number | null>(null);
  let lastSampleAt = $state<number | null>(null);
  let firstProgressAt = $state<number | null>(null);
  let speedSampleCount = $state(0);

  onMount(() => mountLog("LoadingProgress"));

  let aggregateLoaded = $derived(items.reduce((sum, item) => sum + (item.loaded || 0), 0));
  let aggregateTotal = $derived(items.reduce((sum, item) => sum + (item.total || 0), 0));
  let aggregatePct = $derived(
    aggregateTotal > 0 ? progressPct(aggregateLoaded, aggregateTotal) : null,
  );
  let totalFiles = $derived(items.length);
  let completedFiles = $derived(
    items.filter((item) => item.done || ((item.loaded || 0) > 0 && item.loaded === item.total))
      .length,
  );
  let sortedItems = $derived(
    [...items].sort((a, b) => {
      const aDone = a.done || ((a.loaded || 0) > 0 && a.loaded === a.total);
      const bDone = b.done || ((b.loaded || 0) > 0 && b.loaded === b.total);
      if (aDone !== bDone) return aDone ? 1 : -1;
      return (b.loaded || 0) - (a.loaded || 0);
    }),
  );
  let activeItems = $derived(
    sortedItems.filter((item) => !(item.done || ((item.loaded || 0) > 0 && item.loaded === item.total))),
  );
  let completedItems = $derived(
    sortedItems.filter((item) => item.done || ((item.loaded || 0) > 0 && item.loaded === item.total)),
  );
  let showSpeed = $derived(visibleSpeedBps !== null && speedSampleCount >= 3);
  let showEta = $derived(
    visibleEtaSeconds !== null &&
      visibleEtaSeconds > 0 &&
      speedSampleCount >= 4 &&
      completedFiles < totalFiles,
  );

  $effect(() => {
    if (aggregateLoaded <= 0) return;

    const now = performance.now();
    if (firstProgressAt === null) {
      firstProgressAt = now;
    }

    if (lastSampleLoaded === null || lastSampleAt === null) {
      lastSampleLoaded = aggregateLoaded;
      lastSampleAt = now;
      return;
    }

    const deltaBytes = aggregateLoaded - lastSampleLoaded;
    const deltaTimeSeconds = (now - lastSampleAt) / 1000;
    if (deltaBytes <= 0 || deltaTimeSeconds < 0.5) return;

    const instantaneousSpeed = deltaBytes / deltaTimeSeconds;
    smoothedSpeedBps =
      smoothedSpeedBps === null
        ? instantaneousSpeed
        : smoothedSpeedBps * 0.72 + instantaneousSpeed * 0.28;

    lastSampleLoaded = aggregateLoaded;
    lastSampleAt = now;
    speedSampleCount += 1;
  });

  $effect(() => {
    const timer = window.setInterval(() => {
      visibleSpeedBps = smoothedSpeedBps;

      if (
        smoothedSpeedBps &&
        smoothedSpeedBps > 0 &&
        aggregateTotal > aggregateLoaded &&
        speedSampleCount >= 4 &&
        firstProgressAt !== null &&
        performance.now() - firstProgressAt >= 4000
      ) {
        visibleEtaSeconds = (aggregateTotal - aggregateLoaded) / smoothedSpeedBps;
      } else {
        visibleEtaSeconds = null;
      }
    }, 3000);

    return () => window.clearInterval(timer);
  });

  function formatEta(seconds: number): string {
    const roundedSeconds = Math.ceil(seconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;

    if (minutes === 0) return `${roundedSeconds}s`;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
</script>

<div class="w-full h-full overflow-y-auto" style="scrollbar-gutter: stable;">
  <div class="max-w-[560px] w-full mx-auto p-8 flex flex-col items-center text-center gap-4">
    <p class="text-sm text-muted-foreground tracking-tight">{message}</p>

    <Card class="w-full overflow-hidden border-primary/15 bg-card">
      <CardContent class="pt-4 pb-3 px-4 text-left">
        <div class="flex items-center justify-between gap-2 mb-3">
          <span class="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
            Total download
          </span>
          {#if aggregatePct !== null}
            <span class="text-sm font-semibold text-primary tabular-nums">
              {aggregatePct.toFixed(1)}%
            </span>
          {/if}
        </div>

        {#if aggregatePct !== null}
          <Progress value={aggregatePct} class="h-1.5 mb-2.5" />
        {/if}

        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div class="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
            <div class="text-[0.62rem] uppercase tracking-wider text-muted-foreground/45">
              Downloaded
            </div>
            <div class="mt-1 font-semibold text-foreground tabular-nums">
              {formatBytesPrecise(aggregateLoaded)}
              {#if aggregateTotal > 0}
                <span class="text-muted-foreground/35 font-normal">
                  / {formatBytesPrecise(aggregateTotal)}
                </span>
              {/if}
            </div>
          </div>

          <div class="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
            <div class="text-[0.62rem] uppercase tracking-wider text-muted-foreground/45">Files</div>
            <div class="mt-1 font-semibold text-foreground tabular-nums">
              {completedFiles}/{totalFiles}
            </div>
          </div>

          <div class="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
            <div class="text-[0.62rem] uppercase tracking-wider text-muted-foreground/45">Speed</div>
            <div class="mt-1 font-semibold text-foreground tabular-nums">
              {#if showSpeed && visibleSpeedBps}
                {formatBytesPrecise(visibleSpeedBps)}/s
              {:else}
                --
              {/if}
            </div>
          </div>

          <div class="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
            <div class="text-[0.62rem] uppercase tracking-wider text-muted-foreground/45">ETA</div>
            <div class="mt-1 font-semibold text-foreground tabular-nums">
              {#if showEta && visibleEtaSeconds}
                {formatEta(visibleEtaSeconds)}
              {:else}
                --
              {/if}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {#if activeItems.length > 0}
      <div class="w-full text-left">
        <div class="mb-2 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/55">
          Active downloads
        </div>
        <div class="flex flex-col gap-3">
          {#each activeItems as item (item.file ?? item.id)}
            {@const pct = item.total ? progressPct(item.loaded || 0, item.total) : null}
            <Card class="w-full">
              <CardContent class="pt-4 pb-3 px-4">
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="text-xs text-muted-foreground truncate flex-1 min-w-0" title={item.file}>
                    {item.file}
                  </span>
                  {#if pct !== null}
                    <span class="text-sm font-semibold text-primary tabular-nums shrink-0">
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
                  </div>
                {:else}
                  <div class="h-1 w-full bg-muted rounded-full overflow-hidden mb-2">
                    <div class="h-full w-[30%] bg-primary rounded-full animate-[slide_1.5s_ease-in-out_infinite]"></div>
                  </div>
                  <div class="text-xs text-muted-foreground tabular-nums">
                    {#if item.loaded}
                      <span class="text-foreground font-medium">{formatBytesPrecise(item.loaded)}</span>
                    {:else}
                      <span class="italic opacity-50">downloading...</span>
                    {/if}
                  </div>
                {/if}
              </CardContent>
            </Card>
          {/each}
        </div>
      </div>
    {/if}

    {#if completedItems.length > 0}
      <details class="w-full text-left rounded-xl border border-border/70 bg-card overflow-hidden">
        <summary class="cursor-pointer list-none px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60">
          Completed files ({completedItems.length})
        </summary>
        <div class="border-t border-border/60 px-3 py-3 flex flex-col gap-2 bg-background/30">
          {#each completedItems as item (item.file ?? item.id)}
            <div
              class={cn(
                "rounded-lg border px-3 py-2 flex items-center gap-3",
                "border-emerald-500/20 bg-emerald-500/8 text-emerald-200",
              )}
            >
              <CheckCircle2 class="size-4 shrink-0 text-emerald-400" />
              <div class="min-w-0 flex-1">
                <div class="truncate text-xs font-medium" title={item.file}>{item.file}</div>
                {#if item.total}
                  <div class="text-[0.72rem] text-emerald-200/70 tabular-nums">
                    {formatBytesPrecise(item.total)}
                  </div>
                {/if}
              </div>
            </div>
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
