<script>
  import { onMount } from "svelte";
  import { mountLog } from "../../lib/debug.js";

  onMount(() => mountLog("SyncStatus"));

  let {
    syncStatus = null,
    syncProgress = null,
    isSyncing = false,
    onsync,
    onsyncmore,
    onclear,
  } = $props();

  let showClearConfirm = $state(false);
  let syncLimit = $state(50);

  const LIMIT_OPTIONS = [
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 200, label: "200" },
    { value: 500, label: "500" },
    { value: 0, label: "All" },
  ];

  function formatTimeAgo(timestamp) {
    if (!timestamp) return "never";
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function progressPercent() {
    if (!syncProgress?.total || !syncProgress?.current) return 0;
    return Math.round((syncProgress.current / syncProgress.total) * 100);
  }
</script>

<div class="sync-card">
  <div class="sync-header">
    <div class="sync-icon">
      {#if isSyncing}
        <span class="spinner"></span>
      {:else}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m0 0a9 9 0 0 1 9-9m-9 9a9 9 0 0 0 9 9" />
        </svg>
      {/if}
    </div>
    <div class="sync-info">
      <span class="sync-title">Local Storage</span>
      {#if syncStatus?.synced}
        <span class="sync-meta">
          {syncStatus.totalItems.toLocaleString()} emails stored
          · synced {formatTimeAgo(syncStatus.lastSyncAt)}
          {#if syncStatus.hasMore}
            · more available
          {:else}
            · all synced
          {/if}
        </span>
      {:else}
        <span class="sync-meta">Not synced yet</span>
      {/if}
    </div>
    <div class="sync-actions">
      {#if syncStatus?.synced && !isSyncing}
        <button
          class="btn-icon"
          title="Clear local data"
          onclick={() => showClearConfirm = !showClearConfirm}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M8 6V4h8v2m1 0v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6h10z" />
          </svg>
        </button>
      {/if}
    </div>
  </div>

  <!-- Sync controls -->
  <div class="sync-controls">
    <div class="limit-group">
      <label class="limit-label" for="sync-limit">Batch:</label>
      <select id="sync-limit" class="limit-select" bind:value={syncLimit} disabled={isSyncing}>
        {#each LIMIT_OPTIONS as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
    <div class="sync-buttons">
      {#if syncStatus?.synced}
        <button
          class="btn sync-btn"
          onclick={() => onsync(syncLimit)}
          disabled={isSyncing}
        >
          {isSyncing ? "Syncing..." : "Sync New"}
        </button>
        {#if syncStatus.hasMore}
          <button
            class="btn sync-btn primary"
            onclick={() => onsyncmore(syncLimit)}
            disabled={isSyncing}
          >
            {isSyncing ? "Loading..." : "Sync More"}
          </button>
        {/if}
      {:else}
        <button
          class="btn sync-btn primary"
          onclick={() => onsync(syncLimit)}
          disabled={isSyncing}
        >
          {isSyncing ? "Syncing..." : "Download Emails"}
        </button>
      {/if}
    </div>
  </div>

  <!-- Progress bar during sync -->
  {#if isSyncing && syncProgress}
    <div class="sync-progress">
      <div class="progress-bar">
        <div
          class="progress-fill"
          style:width="{progressPercent()}%"
          class:indeterminate={!syncProgress.total}
        ></div>
      </div>
      <span class="progress-text">{syncProgress.message || "Syncing..."}</span>
    </div>
  {/if}

  <!-- Clear confirmation -->
  {#if showClearConfirm}
    <div class="clear-confirm">
      <span>Delete all locally stored emails?</span>
      <div class="clear-actions">
        <button class="btn small" onclick={() => showClearConfirm = false}>Cancel</button>
        <button class="btn small danger" onclick={() => { onclear(); showClearConfirm = false; }}>
          Delete
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .sync-card {
    padding: 0.75rem 1rem;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    margin-bottom: 1rem;
  }

  .sync-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .sync-icon {
    color: #888;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .sync-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
  }

  .sync-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: #e8e8e8;
  }

  .sync-meta {
    font-size: 0.75rem;
    color: #888;
  }

  .sync-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  /* ── Sync controls row ──────────────────────────────────────────── */
  .sync-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.6rem;
    padding-top: 0.5rem;
    border-top: 1px solid #222;
  }

  .limit-group {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .limit-label {
    font-size: 0.75rem;
    color: #666;
  }

  .limit-select {
    padding: 0.25rem 0.4rem;
    border: 1px solid #333;
    border-radius: 6px;
    background: #1a1a1a;
    color: #e8e8e8;
    font-size: 0.75rem;
    outline: none;
    cursor: pointer;
  }
  .limit-select:focus {
    border-color: #3b82f6;
  }

  .sync-buttons {
    display: flex;
    gap: 0.4rem;
  }

  /* ── Buttons ─────────────────────────────────────────────────────── */
  .sync-btn {
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
  .sync-btn:hover:not(:disabled) {
    background: #3b82f6;
    color: #fff;
  }
  .sync-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .sync-btn.primary {
    background: #3b82f6;
    color: #fff;
  }
  .sync-btn.primary:hover:not(:disabled) {
    background: #2563eb;
  }

  .btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: #666;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .btn-icon:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #f87171;
  }

  .btn {
    padding: 0.3rem 0.7rem;
    border: 1px solid #333;
    border-radius: 6px;
    background: #1a1a1a;
    color: #e8e8e8;
    font-size: 0.78rem;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn:hover {
    background: #2a2a2a;
  }
  .btn.small {
    padding: 0.25rem 0.6rem;
    font-size: 0.75rem;
  }
  .btn.danger {
    border-color: #f87171;
    color: #f87171;
  }
  .btn.danger:hover {
    background: #f87171;
    color: #fff;
  }

  /* ── Progress ────────────────────────────────────────────────────── */
  .sync-progress {
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
    background: linear-gradient(
      90deg,
      transparent 0%,
      #3b82f6 50%,
      transparent 100%
    );
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

  /* ── Clear confirmation ──────────────────────────────────────────── */
  .clear-confirm {
    margin-top: 0.6rem;
    padding: 0.5rem 0.6rem;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    font-size: 0.78rem;
    color: #ccc;
  }

  .clear-actions {
    display: flex;
    gap: 0.4rem;
    flex-shrink: 0;
  }

  /* ── Spinner ─────────────────────────────────────────────────────── */
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
