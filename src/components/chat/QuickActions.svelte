<script>
  import { actionColor } from "../../lib/triage.js";

  let {
    pendingData = null,
    hasScanData = false,
    engineReady = false,
    isScanning = false,
    ontogglegroup,
    onscan,
  } = $props();

  function formatLabel(str) {
    return str
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  }

  let showScanChip = $derived(engineReady && !hasScanData && !isScanning);
  let hasChips = $derived((pendingData && pendingData.total > 0) || showScanChip || isScanning);
</script>

{#if hasChips}
  <div class="quick-strip">
    {#if isScanning}
      <div class="chip scanning">
        <span class="scan-spinner"></span>
        <span>Scanning...</span>
      </div>
    {:else if showScanChip}
      <button class="chip scan-chip" onclick={onscan}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        Scan Emails
      </button>
    {/if}

    {#if pendingData && pendingData.total > 0}
      {#each pendingData.order as action (action)}
        {@const items = pendingData.groups[action]}
        {@const color = actionColor(action)}
        <button class="chip action-chip" onclick={() => ontogglegroup?.(action)}>
          <span class="chip-dot" style:background={color}></span>
          <span class="chip-label">{formatLabel(action)}</span>
          <span class="chip-count">{items.length}</span>
        </button>
      {/each}
    {/if}
  </div>
{/if}

<style>
  .quick-strip {
    display: flex;
    gap: 0.3rem;
    padding: 0.4rem 1rem;
    overflow-x: auto;
    flex-shrink: 0;
    border-top: 1px solid #1a1a1a;
    scrollbar-width: none;
  }
  .quick-strip::-webkit-scrollbar {
    display: none;
  }

  .chip {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem 0.55rem;
    border: 1px solid #2a2a2a;
    border-radius: 16px;
    background: #1a1a1a;
    color: #aaa;
    font-size: 0.7rem;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.12s, border-color 0.12s, color 0.12s;
    font-family: inherit;
    flex-shrink: 0;
  }
  .chip:hover {
    background: #222;
    border-color: #3a3a3a;
    color: #ddd;
  }

  .chip-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .chip-label {
    line-height: 1;
  }

  .chip-count {
    font-weight: 700;
    font-size: 0.65rem;
    color: #888;
    background: rgba(255, 255, 255, 0.06);
    padding: 0.05rem 0.3rem;
    border-radius: 8px;
    min-width: 16px;
    text-align: center;
  }

  .scan-chip {
    color: #3b82f6;
    border-color: rgba(59, 130, 246, 0.3);
    background: rgba(59, 130, 246, 0.06);
  }
  .scan-chip:hover {
    background: rgba(59, 130, 246, 0.12);
    border-color: rgba(59, 130, 246, 0.5);
    color: #60a5fa;
  }

  .scanning {
    color: #888;
    cursor: default;
    border-color: #2a2a2a;
  }

  .scan-spinner {
    width: 10px;
    height: 10px;
    border: 1.5px solid #333;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
    flex-shrink: 0;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
