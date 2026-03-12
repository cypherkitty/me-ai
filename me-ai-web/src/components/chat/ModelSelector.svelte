<script lang="ts">
  import { onMount } from "svelte";
  import { MODELS, MODEL_GROUPS } from "../../lib/models.js";
  import { formatBytes } from "../../lib/format.js";
  import { mountLog } from "../../lib/debug.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Card, CardContent } from "$lib/components/ui/card/index.js";
  import { cn } from "$lib/utils.js";

  const DTYPE_OPTIONS = [
    { value: "q4f16", label: "q4f16 (recommended)" },
    { value: "q4", label: "q4 (smaller)" },
    { value: "fp16", label: "fp16 (best quality)" },
  ] as const;
  const DEVICE_OPTIONS = [
    { value: "webgpu", label: "WebGPU" },
    { value: "wasm", label: "WASM" },
  ] as const;

  interface Props {
    selectedModel: string;
    loadDtype?: string;
    loadDevice?: string;
    gpuInfo?: { vendor?: string; architecture?: string; limits?: { maxBufferSize?: number } } | null;
    error?: string | null;
    onload: () => void;
    onclearerror?: () => void;
    onclearcache?: () => void;
  }
  let { selectedModel = $bindable(), loadDtype = $bindable("q4f16"), loadDevice = $bindable("webgpu"), gpuInfo = null, error = null, onload, onclearerror, onclearcache }: Props = $props();

  const selectedInfo = $derived(MODELS.find(m => m.id === selectedModel));

  onMount(() => mountLog("ModelSelector"));
</script>

<div class="w-full flex flex-col items-center gap-5 text-center">
    <div class="w-full text-left flex flex-col gap-1.5">
      <Label for="model-select" class="text-[0.68rem] uppercase tracking-wider opacity-60">
        Choose Model
      </Label>
      <select
        id="model-select"
        bind:value={selectedModel}
        onchange={() => onclearerror?.()}
        class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {#each MODEL_GROUPS as group}
          <optgroup label={group.label}>
            {#each group.models as model}
              <option value={model.id}>{group.label} {model.name} — {model.size}</option>
            {/each}
          </optgroup>
        {/each}
      </select>
      {#if selectedInfo}
        <p class="text-xs text-muted-foreground/60 italic">{selectedInfo.description}</p>
      {/if}
    </div>

    <div class="w-full grid grid-cols-2 gap-3 text-left">
      <div class="flex flex-col gap-1">
        <Label for="dtype-select" class="text-[0.68rem] uppercase tracking-wider opacity-60">Dtype</Label>
        <select
          id="dtype-select"
          bind:value={loadDtype}
          class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {#each DTYPE_OPTIONS as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <Label for="device-select" class="text-[0.68rem] uppercase tracking-wider opacity-60">Device</Label>
        <select
          id="device-select"
          bind:value={loadDevice}
          class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {#each DEVICE_OPTIONS as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
    </div>

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
                {#each MODEL_GROUPS as group}
                  <tr>
                    <td colspan="4" class="px-3 pt-3 pb-1 text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/40">{group.label}</td>
                  </tr>
                  {#each group.models as model}
                    <tr class={cn(
                      "transition-colors",
                      model.id === selectedModel ? "bg-primary/5" : "hover:bg-accent"
                    )}>
                      <td class="px-3 py-2 font-medium text-foreground border-b border-border/50">
                        {group.label} {model.name}
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
      <Button variant="outline" onclick={onclearcache} class="w-full text-xs">
        Clear cache & retry
      </Button>
    {/if}

    <Button onclick={onload} disabled={!!error} class="w-full">
      Load Model
    </Button>
  </div>
