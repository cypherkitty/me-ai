<script>
  import { onMount } from "svelte";
  import { formatBytes } from "../../lib/format.js";
  import { mountLog } from "../../lib/debug.js";

  let { gpuInfo } = $props();

  onMount(() => mountLog("GpuPanel"));

  const rows = $derived([
    { label: "Status",       value: "Active",              ok: true },
    { label: "Vendor",       value: gpuInfo.vendor },
    { label: "Architecture", value: gpuInfo.architecture },
    ...(gpuInfo.device && gpuInfo.device !== "unknown" ? [{ label: "Device", value: gpuInfo.device }] : []),
    ...(gpuInfo.limits?.maxBufferSize ? [{ label: "Max Buffer", value: formatBytes(gpuInfo.limits.maxBufferSize) }] : []),
    ...(gpuInfo.limits?.maxComputeInvocationsPerWorkgroup ? [{ label: "Max Compute", value: String(gpuInfo.limits.maxComputeInvocationsPerWorkgroup) }] : []),
    ...(gpuInfo.limits?.maxComputeWorkgroupStorageSize ? [{ label: "Workgroup Storage", value: formatBytes(gpuInfo.limits.maxComputeWorkgroupStorageSize) }] : []),
  ]);
</script>

<div class="bg-card border-b border-border px-4 py-3 animate-[slideDown_0.15s_ease-out]">
  <div class="grid grid-cols-2 gap-x-6 gap-y-2">
    {#each rows as row}
      <div class="flex flex-col gap-px">
        <span class="text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground/40">{row.label}</span>
        <span class={row.ok ? "text-[0.78rem] font-semibold text-success" : "text-[0.78rem] text-foreground/75 tracking-tight"}>
          {row.value}
        </span>
      </div>
    {/each}

    {#if gpuInfo.features?.length}
      <div class="col-span-2 flex flex-col gap-1.5">
        <span class="text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground/40">
          Features ({gpuInfo.features.length})
        </span>
        <div class="flex flex-wrap gap-1">
          {#each gpuInfo.features as feat}
            <span class="text-[0.58rem] font-mono text-muted-foreground/60 bg-muted border border-border px-1.5 py-0.5 rounded">
              {feat}
            </span>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
