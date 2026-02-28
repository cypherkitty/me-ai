<script>
  import { onMount } from "svelte";
  import { formatBytesPrecise, progressPct } from "../../lib/format.js";
  import { mountLog } from "../../lib/debug.js";
  import { Progress } from "$lib/components/ui/progress/index.js";
  import { Card, CardContent } from "$lib/components/ui/card/index.js";

  let { message = "", items = [] } = $props();

  onMount(() => mountLog("LoadingProgress"));
</script>

<div class="max-w-[520px] mx-auto p-8 flex flex-col items-center text-center gap-3">
  <p class="text-sm text-muted-foreground tracking-tight">{message}</p>

  {#each items as item}
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
</div>

<style>
  @keyframes slide {
    0% { margin-left: 0%; }
    50% { margin-left: 70%; }
    100% { margin-left: 0%; }
  }
</style>
