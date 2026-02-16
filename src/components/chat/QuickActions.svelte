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
  <div class="strip">
    {#if isScanning}
      <div class="chip scanning">
        <span class="spinner"></span>
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
  </div>
{/if}

<style>
  .strip {
    display: flex;
    gap: 0.3rem;
    padding: 0.4rem 1rem;
    flex-shrink: 0;
    border-top: 1px solid #1a1a1a;
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
    transition: all 0.12s;
    font-family: inherit;
    flex-shrink: 0;
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

  .spinner {
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
