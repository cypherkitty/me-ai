<script>
  import { MODELS } from "../../lib/models.js";
  import { formatBytes } from "../../lib/format.js";

  let { selectedModel = $bindable(), gpuInfo = null, error = null, onload } = $props();
</script>

<div class="container center">
  <h1>me-ai</h1>
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
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    letter-spacing: -0.02em;
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
