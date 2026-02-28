<script>
  let {
    hasScanData = false,
    engineReady = false,
    isScanning = false,
    onscan,
  } = $props();

  let showScanChip = $derived(engineReady && !hasScanData && !isScanning);
  let visible = $derived(showScanChip || isScanning);
</script>

{#if visible}
  <div class="flex gap-1.5 px-6 py-2 shrink-0 border-t border-border">
    {#if isScanning}
      <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-card text-xs text-muted-foreground/50">
        <span class="size-2.5 rounded-full border border-border border-t-primary animate-spin shrink-0"></span>
        Scanning…
      </span>
    {:else if showScanChip}
      <button
        onclick={onscan}
        class="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-primary/25 bg-primary/6 text-xs text-primary hover:bg-primary/12 hover:border-primary/40 transition-colors"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        Scan Emails
      </button>
    {/if}
  </div>
{/if}
