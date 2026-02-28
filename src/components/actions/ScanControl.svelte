<script>
  import ScanLiveView from "./ScanLiveView.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Search } from "lucide-svelte";

  let {
    engineStatus = "idle",
    modelName = "",
    isScanning = false,
    scanProgress = null,
    scanCount = $bindable(20),
    stats = null,
    onscan,
    onrescan,
    oninspect,
    onstop,
    oncloseprogress,
  } = $props();

  const COUNT_OPTIONS = [
    { value: 1, label: "1" },
    { value: 3, label: "3" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 500, label: "500" },
  ];

  function statusLabel() {
    if (engineStatus === "ready") return `${modelName} ready`;
    if (engineStatus === "loading") return "Loading model...";
    if (engineStatus === "generating") return "Model busy...";
    return "No model loaded";
  }

  function statusColor() {
    if (engineStatus === "ready") return "var(--color-success)";
    if (engineStatus === "loading") return "var(--color-warning)";
    return "var(--color-muted-foreground)";
  }

  function canScan() {
    return engineStatus === "ready" && !isScanning;
  }

  let isVisuallyScanning = $derived(isScanning && scanProgress?.phase !== "done");
</script>

<div class="rounded border border-border bg-card mb-4 overflow-hidden">
  <!-- Header row -->
  <div class="flex items-center gap-3 px-4 py-3 border-b border-border">
    <div class="size-7 rounded border border-border bg-muted/30 flex items-center justify-center shrink-0 text-muted-foreground">
      {#if isVisuallyScanning}
        <div class="size-3.5 border-2 border-border border-t-primary rounded-full animate-spin"></div>
      {:else}
        <Search class="size-3.5" />
      {/if}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-0.5">
        <span class="text-sm font-semibold tracking-tight text-foreground">Email Triage</span>
        <button
          onclick={oninspect}
          class="flex items-center gap-1 px-1.5 py-0.5 rounded border border-border text-[0.6rem] text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
        >
          Prompt
        </button>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="size-1.5 rounded-full shrink-0" style:background={statusColor()}></span>
        <span class="text-xs text-muted-foreground">{statusLabel()}</span>
      </div>
    </div>
  </div>

  {#if stats}
    <div class="flex items-center gap-2 px-4 py-2 border-b border-border/40 text-xs text-muted-foreground/60">
      <span class="tabular-nums">{stats.totalEmails} in storage</span>
      <span class="text-muted-foreground/20">·</span>
      <span class="tabular-nums">{stats.classified} classified</span>
      <span class="text-muted-foreground/20">·</span>
      <span class="tabular-nums">{stats.unclassified} new</span>
    </div>
  {/if}

  <!-- Controls -->
  <div class="flex items-center gap-3 px-4 py-3">
    <div class="flex items-center gap-2">
      <span class="text-xs text-muted-foreground">Emails:</span>
      <select
        bind:value={scanCount}
        disabled={isScanning}
        class="h-7 rounded border border-input bg-background px-2 text-xs text-foreground disabled:opacity-50"
      >
        {#each COUNT_OPTIONS as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
    <div class="flex items-center gap-1.5 ml-auto">
      <Button variant="default" size="sm" onclick={onscan} disabled={!canScan()} class="h-7 text-xs">
        {isVisuallyScanning ? "Scanning…" : (isScanning ? "Finalizing…" : "Scan New")}
      </Button>
      <Button variant="outline" size="sm" onclick={onrescan} disabled={!canScan()} class="h-7 text-xs">
        Rescan All
      </Button>
    </div>
  </div>

  {#if engineStatus !== "ready" && engineStatus !== "loading"}
    <p class="px-4 pb-3 -mt-1 text-xs text-muted-foreground/40 italic">
      Load a model on the Chat page first, then come back to scan.
    </p>
  {/if}

  {#if isScanning || scanProgress?.phase === "done"}
    <ScanLiveView
      progress={scanProgress}
      {onstop}
      {oninspect}
      onclose={oncloseprogress}
    />
  {/if}
</div>
