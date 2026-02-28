<script>
  import { onMount } from "svelte";
  import { MODELS } from "../../lib/models.js";
  import { formatBytes } from "../../lib/format.js";
  import { mountLog } from "../../lib/debug.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card/index.js";
  import { cn } from "$lib/utils.js";

  let { selectedModel = $bindable(), gpuInfo = null, error = null, onload } = $props();

  onMount(() => mountLog("ModelSelector"));
</script>

<div class="w-full flex flex-col items-center gap-5 text-center">
    <!-- Model selector -->
    <div class="w-full text-left flex flex-col gap-1.5">
      <Label for="model-select" class="text-[0.68rem] uppercase tracking-wider opacity-60">
        Choose Model
      </Label>
      <select
        id="model-select"
        bind:value={selectedModel}
        class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {#each MODELS as model}
          <option value={model.id}>{model.name} — {model.size}</option>
        {/each}
      </select>
      {#if selectedModel}
        {@const m = MODELS.find(m => m.id === selectedModel)}
        {#if m}
          <p class="text-xs text-muted-foreground/60 italic">{m.description}</p>
        {/if}
      {/if}
    </div>

    <!-- Capabilities table -->
    <details class="w-full group">
      <summary class="flex items-center gap-2 px-3 py-2 rounded border border-border bg-card text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 cursor-pointer hover:bg-accent transition-colors list-none">
        <svg class="size-3 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        Model Capabilities
      </summary>
      <Card class="mt-1 w-full text-left">
        <CardContent class="pt-0 pb-2 px-0">
          <div class="overflow-x-auto max-h-[260px] overflow-y-auto">
            <table class="w-full text-xs border-collapse">
              <thead class="sticky top-0 bg-card">
                <tr>
                  {#each ["Model", "Context", "Email Limit", "Status"] as h}
                    <th class="text-left px-3 py-2 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40 border-b border-border">{h}</th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#each MODELS as model}
                  <tr class={cn(
                    "transition-colors",
                    model.id === selectedModel ? "bg-primary/5" : "hover:bg-accent"
                  )}>
                    <td class="px-3 py-2 font-medium text-foreground border-b border-border/50">
                      {model.name}
                      {#if model.id === selectedModel}
                        <Badge variant="outline" class="ml-1 text-[0.5rem] h-3.5 px-1 py-0 text-primary border-primary/30">current</Badge>
                      {/if}
                    </td>
                    <td class="px-3 py-2 tabular-nums border-b border-border/50">
                      <strong class="text-foreground">{(model.contextWindow / 1024).toFixed(0)}k</strong>
                    </td>
                    <td class="px-3 py-2 tabular-nums text-muted-foreground border-b border-border/50">
                      ~{(model.maxEmailTokens / 1000).toFixed(0)}k
                    </td>
                    <td class="px-3 py-2 border-b border-border/50">
                      {#if model.recommendedForEmailProcessing}
                        <span class="text-success">✅</span>
                      {:else if model.maxEmailTokens >= 6000}
                        <span class="text-warning">⚠️</span>
                      {:else}
                        <span class="text-destructive">❌</span>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <p class="px-3 pt-2 pb-1 text-[0.62rem] text-muted-foreground/40 leading-relaxed">
            <strong class="opacity-80">Context</strong> = max input. <strong class="opacity-80">Email Limit</strong> = WebGPU safe limit. ✅ Recommended · ⚠️ Limited · ❌ May fail
          </p>
        </CardContent>
      </Card>
    </details>

    <!-- GPU info card -->
    {#if gpuInfo}
      <Card class="w-full text-left">
        <CardContent class="pt-3 pb-3 px-4">
          <div class="flex items-center gap-2 text-xs font-semibold text-success mb-2">
            <span class="size-2 rounded-full bg-success shrink-0"></span>
            WebGPU Active
          </div>
          <div class="flex flex-col gap-1">
            {#each [["Vendor", gpuInfo.vendor], ["Architecture", gpuInfo.architecture], ...(gpuInfo.limits?.maxBufferSize ? [["Max Buffer", formatBytes(gpuInfo.limits.maxBufferSize)]] : [])] as [label, value]}
              <div class="flex justify-between text-xs">
                <span class="text-muted-foreground/50">{label}</span>
                <span class="text-foreground/75 text-right">{value}</span>
              </div>
            {/each}
          </div>
        </CardContent>
      </Card>
    {/if}

    {#if error}
      <p class="text-sm text-destructive">{error}</p>
    {/if}

    <Button onclick={onload} disabled={!!error} class="w-full">
      Load Model
    </Button>
  </div>
