<script>
  let { backend = $bindable("webgpu"), isWebGPUAvailable = true } = $props();
</script>

<div class="backend-selector">
  <div class="backend-label">AI Backend:</div>
  <div class="backend-options">
    <button 
      class="backend-btn" 
      class:active={backend === "webgpu"}
      onclick={() => backend = "webgpu"}
      disabled={!isWebGPUAvailable}
    >
      <span class="backend-icon">🔷</span>
      <div class="backend-info">
        <div class="backend-name">WebGPU</div>
        <div class="backend-desc">Browser, private, no server</div>
      </div>
    </button>

    <button 
      class="backend-btn" 
      class:active={backend === "ollama"}
      onclick={() => backend = "ollama"}
    >
      <span class="backend-icon">🦙</span>
      <div class="backend-info">
        <div class="backend-name">Ollama</div>
        <div class="backend-desc">Local server, larger models</div>
      </div>
    </button>

    <button 
      class="backend-btn cloud-btn" 
      class:active={backend === "cloud"}
      onclick={() => backend = "cloud"}
    >
      <span class="backend-icon">☁️</span>
      <div class="backend-info">
        <div class="backend-name">Cloud APIs</div>
        <div class="backend-desc">ChatGPT, Claude, Grok</div>
      </div>
    </button>
  </div>

  {#if !isWebGPUAvailable && backend === "webgpu"}
    <p class="warning">
      WebGPU not available in this browser. Use Ollama or upgrade your browser.
    </p>
  {/if}
</div>

<style>
  .backend-selector {
    width: 100%;
    max-width: 520px;
    margin: 0 auto 1.5rem;
  }
  .backend-label {
    display: block;
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: center;
  }
  .backend-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
  }
  .backend-btn {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.8rem 1rem;
    background: #1a1a1a;
    border: 2px solid #333;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  .backend-btn:hover:not(:disabled) {
    background: #222;
    border-color: #4a90e2;
  }
  .backend-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .backend-btn.active {
    background: rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  .backend-icon {
    font-size: 1.8rem;
    line-height: 1;
    flex-shrink: 0;
  }
  .backend-info {
    flex: 1;
  }
  .backend-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: #e8e8e8;
    margin-bottom: 0.2rem;
  }
  .backend-desc {
    font-size: 0.7rem;
    color: #777;
  }
  .backend-btn.active .backend-name {
    color: #4a90e2;
  }
  .backend-btn.active .backend-desc {
    color: #999;
  }
  .warning {
    margin-top: 0.6rem;
    padding: 0.5rem 0.8rem;
    font-size: 0.75rem;
    background: rgba(251, 191, 36, 0.1);
    border: 1px solid rgba(251, 191, 36, 0.2);
    border-radius: 6px;
    color: #fbbf24;
    text-align: center;
  }
</style>
