<script>
  import ScanLiveView from "./ScanLiveView.svelte";

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
    if (engineStatus === "ready") return "#34d399";
    if (engineStatus === "loading") return "#fbbf24";
    return "#666";
  }

  function canScan() {
    return engineStatus === "ready" && !isScanning;
  }

  let isVisuallyScanning = $derived(isScanning && scanProgress?.phase !== "done");
</script>

<div class="scan-card">
  <div class="scan-header">
    <div class="scan-icon">
      {#if isVisuallyScanning}
        <span class="spinner"></span>
      {:else}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      {/if}
    </div>
    <div class="scan-info">
      <div class="scan-title-row">
        <span class="scan-title">Email Triage</span>
        <button class="inspect-btn" onclick={oninspect} title="View system prompt and LLM config">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          Prompt
        </button>
      </div>
      <span class="scan-status">
        <span class="status-dot" style:background={statusColor()}></span>
        {statusLabel()}
      </span>
    </div>
  </div>

  {#if stats}
    <div class="scan-stats">
      <span class="stat">{stats.totalEmails} emails in storage</span>
      <span class="stat-sep">·</span>
      <span class="stat">{stats.classified} classified</span>
      <span class="stat-sep">·</span>
      <span class="stat">{stats.unclassified} new</span>
    </div>
  {/if}

  <div class="scan-controls">
    <div class="control-group">
      <label class="control-label" for="scan-count">Emails:</label>
      <select id="scan-count" class="control-select" bind:value={scanCount} disabled={isScanning}>
        {#each COUNT_OPTIONS as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
    <div class="btn-group">
      <button
        class="btn scan-btn primary"
        onclick={onscan}
        disabled={!canScan()}
      >
        {isVisuallyScanning ? "Scanning..." : (isScanning ? "Finalizing..." : "Scan New")}
      </button>
      <button
        class="btn scan-btn"
        onclick={onrescan}
        disabled={!canScan()}
        title="Rescan all (including already classified)"
      >
        Rescan All
      </button>
    </div>
  </div>

  {#if engineStatus !== "ready" && engineStatus !== "loading"}
    <p class="scan-hint">Load a model on the Chat page first, then come back to scan.</p>
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

<style>
  .scan-card {
    padding: 0.75rem 1rem;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    margin-bottom: 1rem;
  }

  .scan-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .scan-icon {
    color: #888;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .scan-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .scan-title-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .scan-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: #e8e8e8;
  }

  .inspect-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.15rem 0.45rem;
    background: none;
    border: 1px solid #333;
    border-radius: 5px;
    color: #666;
    font-size: 0.65rem;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }
  .inspect-btn:hover {
    color: #3b82f6;
    border-color: #3b82f6;
  }

  .scan-status {
    font-size: 0.75rem;
    color: #888;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .scan-stats {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin-top: 0.4rem;
    padding: 0.3rem 0.5rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 6px;
    font-size: 0.7rem;
  }

  .stat { color: #888; }
  .stat-sep { color: #333; }

  .scan-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.6rem;
    padding-top: 0.5rem;
    border-top: 1px solid #222;
  }

  .btn-group {
    display: flex;
    gap: 0.35rem;
  }

  .control-group {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .control-label {
    font-size: 0.75rem;
    color: #666;
  }

  .control-select {
    padding: 0.25rem 0.4rem;
    border: 1px solid #333;
    border-radius: 6px;
    background: #1a1a1a;
    color: #e8e8e8;
    font-size: 0.75rem;
    outline: none;
    cursor: pointer;
  }
  .control-select:focus {
    border-color: #3b82f6;
  }

  .scan-btn {
    padding: 0.3rem 0.8rem;
    border: 1px solid #3b82f6;
    border-radius: 8px;
    background: transparent;
    color: #3b82f6;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .scan-btn:hover:not(:disabled) {
    background: #3b82f6;
    color: #fff;
  }
  .scan-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .scan-btn.primary {
    background: #3b82f6;
    color: #fff;
  }
  .scan-btn.primary:hover:not(:disabled) {
    background: #2563eb;
  }

  .scan-hint {
    margin-top: 0.5rem;
    font-size: 0.72rem;
    color: #666;
    font-style: italic;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid #333;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
