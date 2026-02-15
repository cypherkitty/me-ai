<script>
  let {
    engineStatus = "idle",
    modelName = "",
    isScanning = false,
    scanProgress = null,
    scanCount = $bindable(20),
    onscan,
  } = $props();

  const COUNT_OPTIONS = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
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
</script>

<div class="scan-card">
  <div class="scan-header">
    <div class="scan-icon">
      {#if isScanning}
        <span class="spinner"></span>
      {:else}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      {/if}
    </div>
    <div class="scan-info">
      <span class="scan-title">Email Triage</span>
      <span class="scan-status">
        <span class="status-dot" style:background={statusColor()}></span>
        {statusLabel()}
      </span>
    </div>
  </div>

  <div class="scan-controls">
    <div class="control-group">
      <label class="control-label" for="scan-count">Emails:</label>
      <select id="scan-count" class="control-select" bind:value={scanCount} disabled={isScanning}>
        {#each COUNT_OPTIONS as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
    <button
      class="btn scan-btn primary"
      onclick={onscan}
      disabled={!canScan()}
    >
      {isScanning ? "Scanning..." : "Scan Emails"}
    </button>
  </div>

  {#if engineStatus !== "ready" && engineStatus !== "loading"}
    <p class="scan-hint">Load a model on the Chat page first, then come back to scan.</p>
  {/if}

  {#if isScanning && scanProgress}
    <div class="scan-progress">
      <div class="progress-bar">
        <div
          class="progress-fill"
          style:width="{scanProgress.totalBatches ? (scanProgress.batch / scanProgress.totalBatches) * 100 : 0}%"
          class:indeterminate={!scanProgress.totalBatches}
        ></div>
      </div>
      <span class="progress-text">{scanProgress.message || "Scanning..."}</span>
    </div>
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

  .scan-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: #e8e8e8;
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

  .scan-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.6rem;
    padding-top: 0.5rem;
    border-top: 1px solid #222;
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

  .scan-progress {
    margin-top: 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .progress-bar {
    height: 4px;
    background: #2a2a2a;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: #3b82f6;
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .progress-fill.indeterminate {
    width: 100% !important;
    animation: shimmer 1.5s infinite;
    background: linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%);
    background-size: 200% 100%;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .progress-text {
    font-size: 0.72rem;
    color: #666;
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
