<script lang="ts">
  import { onMount } from "svelte";
  import { formatBytes } from "../../lib/core.js";
  import { mountLog } from "../../lib/debug.js";

  interface GpuInfo {
    vendor?: string;
    architecture?: string;
    device?: string;
    features?: string[];
    limits?: {
      maxBufferSize?: number;
      maxComputeInvocationsPerWorkgroup?: number;
      maxComputeWorkgroupStorageSize?: number;
    };
  }
  interface ContextStats {
    messageCount: number;
    charCount: number;
    estimatedTokens: number;
    contextWindow: number | null;
    usagePercent: number | null;
  }
  interface Props {
    gpuInfo?: GpuInfo | null;
    backend?: string;
    contextStats?: ContextStats | null;
  }
  let { gpuInfo = null, backend = "webgpu", contextStats = null }: Props = $props();

  onMount(() => mountLog("GpuPanel"));

  function formatCompactTokenCount(value: number | null): string {
    if (value == null) return "unknown";
    if (value < 100) return `${value}`;
    if (value < 1_000) return `${(value / 1_000).toFixed(1)}k`;
    if (value < 10_000) return `${(value / 1_000).toFixed(1)}k`;
    return `${Math.round(value / 1_000)}k`;
  }

  function formatContextUsage(
    estimatedTokens: number,
    contextWindow: number | null,
    usagePercent: number | null
  ): string {
    if (contextWindow == null) return `~${formatCompactTokenCount(estimatedTokens)} tokens`;
    const percentLabel =
      usagePercent == null
        ? "?"
        : usagePercent < 0.1
          ? "<0.1%"
          : usagePercent < 10
            ? `${usagePercent.toFixed(1)}%`
            : `${Math.round(usagePercent)}%`;
    return `${formatCompactTokenCount(estimatedTokens)} / ${formatCompactTokenCount(contextWindow)} (${percentLabel})`;
  }

  const rows = $derived([
    { label: "Status", value: "Active", ok: true },
    ...(backend === "webgpu"
      ? [{ label: "Vendor", value: gpuInfo?.vendor }]
      : [{ label: "Vendor", value: backend === "ollama" ? "ollama" : backend }]),
    ...(gpuInfo?.architecture ? [{ label: "Architecture", value: gpuInfo.architecture }] : []),
    ...(contextStats
      ? [
          {
            label: "Chat History Data",
            value: formatContextUsage(
              contextStats.estimatedTokens,
              contextStats.contextWindow,
              contextStats.usagePercent
            ),
          },
        ]
      : []),
    ...(gpuInfo?.device && gpuInfo.device !== "unknown"
      ? [{ label: "Device", value: gpuInfo.device }]
      : []),
    ...(gpuInfo?.limits?.maxBufferSize
      ? [{ label: "Max Buffer", value: formatBytes(gpuInfo.limits.maxBufferSize) }]
      : []),
    ...(gpuInfo?.limits?.maxComputeInvocationsPerWorkgroup
      ? [{ label: "Max Compute", value: String(gpuInfo.limits.maxComputeInvocationsPerWorkgroup) }]
      : []),
    ...(gpuInfo?.limits?.maxComputeWorkgroupStorageSize
      ? [
          {
            label: "Workgroup Storage",
            value: formatBytes(gpuInfo.limits.maxComputeWorkgroupStorageSize),
          },
        ]
      : []),
  ]);
</script>

<div class="bg-card border-b border-border px-4 py-3 animate-[slideDown_0.15s_ease-out]">
  <div class="grid grid-cols-2 gap-x-6 gap-y-2">
    {#each rows as row (row.label)}
      <div class="flex flex-col gap-px">
        <span class="text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground/40"
          >{row.label}</span
        >
        <span
          class={row.ok
            ? "text-[0.78rem] font-semibold text-success"
            : "text-[0.78rem] text-foreground/75 tracking-tight"}
        >
          {row.value}
        </span>
      </div>
    {/each}

    {#if contextStats}
      <div class="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
        <div class="flex flex-col gap-px">
          <span class="text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground/40"
            >Messages</span
          >
          <span class="text-[0.78rem] text-foreground/75 tracking-tight"
            >{contextStats.messageCount}</span
          >
        </div>
        <div class="flex flex-col gap-px">
          <span class="text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground/40"
            >Chars</span
          >
          <span class="text-[0.78rem] text-foreground/75 tracking-tight"
            >{contextStats.charCount.toLocaleString()}</span
          >
        </div>
        <div class="flex flex-col gap-px">
          <span class="text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground/40"
            >Est. Tokens</span
          >
          <span class="text-[0.78rem] text-foreground/75 tracking-tight"
            >~{contextStats.estimatedTokens.toLocaleString()}</span
          >
        </div>
        <div class="flex flex-col gap-px">
          <span class="text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground/40"
            >Scope</span
          >
          <span class="text-[0.78rem] text-foreground/75 tracking-tight">Current chat history</span>
        </div>
      </div>
      <div class="col-span-2 text-[0.64rem] text-muted-foreground/45 leading-relaxed">
        Approximate only. This tracks the text history we prepare for the next request, not the
        model's true internal memory.
      </div>
    {/if}

    {#if gpuInfo?.features?.length}
      <div class="col-span-2 flex flex-col gap-1.5">
        <span class="text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground/40">
          Features ({gpuInfo.features.length})
        </span>
        <div class="flex flex-wrap gap-1">
          {#each gpuInfo.features as feat (feat)}
            <span
              class="text-[0.58rem] font-mono text-muted-foreground/60 bg-muted border border-border px-1.5 py-0.5 rounded"
            >
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
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
