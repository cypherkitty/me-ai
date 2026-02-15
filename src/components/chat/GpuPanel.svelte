<script>
  import { onMount } from "svelte";
  import { formatBytes } from "../../lib/format.js";
  import { mountLog } from "../../lib/debug.js";

  let { gpuInfo } = $props();

  onMount(() => mountLog("GpuPanel"));
</script>

<div class="gpu-panel">
  <div class="gpu-panel-grid">
    <div class="gpu-panel-item">
      <div class="gpu-panel-label">Status</div>
      <div class="gpu-panel-value ok">Active</div>
    </div>
    <div class="gpu-panel-item">
      <div class="gpu-panel-label">Vendor</div>
      <div class="gpu-panel-value">{gpuInfo.vendor}</div>
    </div>
    <div class="gpu-panel-item">
      <div class="gpu-panel-label">Architecture</div>
      <div class="gpu-panel-value">{gpuInfo.architecture}</div>
    </div>
    {#if gpuInfo.device && gpuInfo.device !== "unknown"}
      <div class="gpu-panel-item">
        <div class="gpu-panel-label">Device</div>
        <div class="gpu-panel-value">{gpuInfo.device}</div>
      </div>
    {/if}
    {#if gpuInfo.limits?.maxBufferSize}
      <div class="gpu-panel-item">
        <div class="gpu-panel-label">Max Buffer</div>
        <div class="gpu-panel-value">{formatBytes(gpuInfo.limits.maxBufferSize)}</div>
      </div>
    {/if}
    {#if gpuInfo.limits?.maxComputeInvocationsPerWorkgroup}
      <div class="gpu-panel-item">
        <div class="gpu-panel-label">Max Compute Invocations</div>
        <div class="gpu-panel-value">{gpuInfo.limits.maxComputeInvocationsPerWorkgroup}</div>
      </div>
    {/if}
    {#if gpuInfo.limits?.maxComputeWorkgroupStorageSize}
      <div class="gpu-panel-item">
        <div class="gpu-panel-label">Workgroup Storage</div>
        <div class="gpu-panel-value">{formatBytes(gpuInfo.limits.maxComputeWorkgroupStorageSize)}</div>
      </div>
    {/if}
    {#if gpuInfo.features?.length}
      <div class="gpu-panel-item full">
        <div class="gpu-panel-label">Features ({gpuInfo.features.length})</div>
        <div class="gpu-panel-features">
          {#each gpuInfo.features as feat}
            <span class="gpu-feature-tag">{feat}</span>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .gpu-panel {
    background: #131313;
    border-bottom: 1px solid #1f1f1f;
    padding: 0.75rem 1rem;
    animation: slideDown 0.15s ease-out;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .gpu-panel-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem 1.5rem;
  }
  .gpu-panel-item {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
  .gpu-panel-item.full {
    grid-column: 1 / -1;
  }
  .gpu-panel-label {
    font-size: 0.65rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .gpu-panel-value {
    font-size: 0.8rem;
    color: #ccc;
  }
  .gpu-panel-value.ok {
    color: #4ade80;
    font-weight: 600;
  }
  .gpu-panel-features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-top: 0.2rem;
  }
  .gpu-feature-tag {
    font-size: 0.6rem;
    color: #888;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
  }
</style>
