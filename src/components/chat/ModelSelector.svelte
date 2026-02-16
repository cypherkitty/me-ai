<script>
  import { onMount } from "svelte";
  import { MODELS } from "../../lib/models.js";
  import { formatBytes } from "../../lib/format.js";
  import { mountLog } from "../../lib/debug.js";

  let { selectedModel = $bindable(), gpuInfo = null, error = null, onload } = $props();

  onMount(() => mountLog("ModelSelector"));
</script>

<div class="container center">
  <p class="subtitle">
    A private AI chat that runs <strong>entirely in your browser</strong> using WebGPU.
  </p>

  <div class="model-selector">
    <label for="model-select">Choose Model:</label>
    <select id="model-select" bind:value={selectedModel}>
      {#each MODELS as model}
        <option value={model.id}>
          {model.name} — {model.size}
        </option>
      {/each}
    </select>
    {#if selectedModel}
      {@const currentModel = MODELS.find(m => m.id === selectedModel)}
      {#if currentModel}
        <p class="model-description">{currentModel.description}</p>
      {/if}
    {/if}

    <!-- Model capabilities table -->
    <details class="model-details" open>
      <summary class="model-details-summary">Model Capabilities</summary>
      <div class="model-table-wrapper">
        <table class="model-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Context Window</th>
              <th>Email Limit</th>
              <th>Email Processing</th>
            </tr>
          </thead>
          <tbody>
            {#each MODELS as model}
              <tr class:selected={model.id === selectedModel}>
                <td class="model-name">
                  {model.name}
                  {#if model.id === selectedModel}
                    <span class="current-badge">Current</span>
                  {/if}
                </td>
                <td class="context-col">
                  <strong>{(model.contextWindow / 1024).toFixed(0)}k</strong>
                </td>
                <td class="tokens-col">~{(model.maxEmailTokens / 1000).toFixed(0)}k</td>
                <td class="rec-col">
                  {#if model.recommendedForEmailProcessing}
                    <span class="rec-badge rec-good">✅ Recommended</span>
                  {:else if model.maxEmailTokens >= 6000}
                    <span class="rec-badge rec-ok">⚠️ Limited</span>
                  {:else}
                    <span class="rec-badge rec-bad">❌ May fail on long emails</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <p class="model-table-note">
        <strong>Context Window</strong> = model's maximum input capacity. <strong>Email Limit</strong> = WebGPU memory-safe limit (smaller models need more conservative limits to avoid memory errors).
      </p>
    </details>
  </div>

  {#if gpuInfo}
    <div class="gpu-card">
      <div class="gpu-card-header">
        <span class="gpu-dot"></span>
        <span>WebGPU Active</span>
      </div>
      <div class="gpu-card-body">
        <div class="gpu-row"><span>Vendor</span><span>{gpuInfo.vendor}</span></div>
        <div class="gpu-row"><span>Architecture</span><span>{gpuInfo.architecture}</span></div>
        {#if gpuInfo.device && gpuInfo.device !== "unknown"}
          <div class="gpu-row"><span>Device</span><span>{gpuInfo.device}</span></div>
        {/if}
        {#if gpuInfo.description && gpuInfo.description !== "unknown"}
          <div class="gpu-row"><span>Description</span><span>{gpuInfo.description}</span></div>
        {/if}
        {#if gpuInfo.limits?.maxBufferSize}
          <div class="gpu-row"><span>Max buffer</span><span>{formatBytes(gpuInfo.limits.maxBufferSize)}</span></div>
        {/if}
        {#if gpuInfo.features?.length}
          <div class="gpu-row"><span>Features</span><span>{gpuInfo.features.length} supported</span></div>
        {/if}
      </div>
    </div>
  {/if}
  {#if error}
    <p class="error">{error}</p>
  {/if}
  <button class="btn primary" onclick={onload} disabled={error}>
    Load Model
  </button>
</div>

<style>
  .container {
    max-width: 520px;
    margin: auto;
    padding: 2rem;
  }
  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    gap: 0.75rem;
  }
  .subtitle {
    color: #aaa;
    font-size: 1rem;
    line-height: 1.5;
  }
  .error {
    color: #f87171;
    font-size: 0.85rem;
  }

  /* ── Model selector ──────────────────────────────────────────────── */
  .model-selector {
    width: 100%;
    max-width: 400px;
    margin: 1.5rem 0;
    text-align: left;
  }
  .model-selector label {
    display: block;
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .model-selector select {
    width: 100%;
    padding: 0.65rem 0.8rem;
    font-size: 0.9rem;
    color: #e8e8e8;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
  }
  .model-selector select:hover {
    border-color: #4a90e2;
    background: #1f1f1f;
  }
  .model-selector select:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
  .model-description {
    font-size: 0.75rem;
    color: #777;
    margin-top: 0.4rem;
    font-style: italic;
  }

  /* ── Model capabilities table ────────────────────────────────────── */
  .model-details {
    margin-top: 1.2rem;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    background: #161616;
    padding: 0;
  }
  .model-details-summary {
    padding: 0.6rem 0.8rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    user-select: none;
    border-radius: 8px;
    transition: background 0.15s;
  }
  .model-details-summary:hover {
    background: #1a1a1a;
  }
  .model-details[open] .model-details-summary {
    border-bottom: 1px solid #2a2a2a;
    border-radius: 8px 8px 0 0;
  }
  .model-table-wrapper {
    overflow-x: auto;
    padding: 0.8rem;
  }
  .model-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.7rem;
  }
  .model-table thead th {
    text-align: left;
    padding: 0.4rem 0.5rem;
    font-size: 0.65rem;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    border-bottom: 1px solid #2a2a2a;
  }
  .model-table tbody tr {
    transition: background 0.1s;
  }
  .model-table tbody tr:hover {
    background: #1a1a1a;
  }
  .model-table tbody tr.selected {
    background: rgba(59, 130, 246, 0.08);
  }
  .model-table tbody td {
    padding: 0.5rem 0.5rem;
    color: #bbb;
    border-bottom: 1px solid #1f1f1f;
  }
  .model-table tbody tr:last-child td {
    border-bottom: none;
  }
  .model-name {
    font-weight: 500;
    color: #e8e8e8;
  }
  .current-badge {
    display: inline-block;
    margin-left: 0.3rem;
    padding: 0.1rem 0.35rem;
    font-size: 0.55rem;
    font-weight: 700;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.15);
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .context-col, .tokens-col {
    font-variant-numeric: tabular-nums;
    color: #999;
  }
  .rec-col {
    text-align: right;
  }
  .rec-badge {
    display: inline-block;
    padding: 0.15rem 0.4rem;
    font-size: 0.65rem;
    font-weight: 600;
    border-radius: 4px;
    white-space: nowrap;
  }
  .rec-badge.rec-good {
    color: #34d399;
    background: rgba(52, 211, 153, 0.1);
  }
  .rec-badge.rec-ok {
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.1);
  }
  .rec-badge.rec-bad {
    color: #f87171;
    background: rgba(248, 113, 113, 0.1);
  }
  .model-table-note {
    padding: 0.5rem 0.8rem 0.8rem;
    font-size: 0.65rem;
    color: #666;
    line-height: 1.4;
    margin: 0;
  }
  .model-table-note strong {
    color: #888;
  }

  /* ── GPU info card ───────────────────────────────────────────────── */
  .gpu-card {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    width: 100%;
    max-width: 340px;
    text-align: left;
  }
  .gpu-card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #4ade80;
    margin-bottom: 0.5rem;
  }
  .gpu-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 6px #4ade80;
  }
  .gpu-card-body {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .gpu-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
  }
  .gpu-row span:first-child {
    color: #666;
  }
  .gpu-row span:last-child {
    color: #bbb;
    text-align: right;
  }

  /* ── Buttons ─────────────────────────────────────────────────────── */
  .btn {
    padding: 0.55rem 1.2rem;
    border: 1px solid #333;
    border-radius: 8px;
    background: #1a1a1a;
    color: #e8e8e8;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn:hover:not(:disabled) {
    background: #2a2a2a;
  }
  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .btn.primary {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #fff;
  }
  .btn.primary:hover:not(:disabled) {
    background: #2563eb;
  }
</style>
