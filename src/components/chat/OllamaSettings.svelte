<script>
  import { OLLAMA_MODELS, getRecommendedOllamaModels } from "../../lib/ollama-models.js";
  import { getOllamaUrl, setOllamaUrl, testOllamaConnection, listOllamaModels } from "../../lib/ollama-client.js";

  let { selectedModel = $bindable(), onload, error = $bindable() } = $props();

  const isLocal = typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  let ollamaUrl = $state(getOllamaUrl());
  let isTestingConnection = $state(false);
  let connectionStatus = $state(null); // { connected: boolean, version?: string, error?: string }
  let availableModels = $state([]); // Models installed on the Ollama server
  let isLoadingModels = $state(false);

  // Test connection on mount
  $effect(() => {
    testConnection();
  });

  async function testConnection() {
    isTestingConnection = true;
    connectionStatus = null;
    
    const result = await testOllamaConnection(ollamaUrl);
    connectionStatus = result;
    isTestingConnection = false;

    // Load available models if connected
    if (result.connected) {
      loadAvailableModels();
    }
  }

  async function loadAvailableModels() {
    isLoadingModels = true;
    try {
      const models = await listOllamaModels(ollamaUrl);
      availableModels = models.map(m => m.name);
    } catch (e) {
      console.error("Failed to load Ollama models:", e);
      availableModels = [];
    }
    isLoadingModels = false;
  }

  function handleUrlChange() {
    setOllamaUrl(ollamaUrl);
    testConnection();
  }

  function handleLoadModel() {
    if (!selectedModel) {
      error = "Please select a model";
      return;
    }
    onload();
  }

  // Helper to check if model is installed
  function isModelInstalled(modelName) {
    if (!availableModels.length) return false;
    // Exact match only - don't match qwen3:4b when checking for qwen3:14b
    return availableModels.includes(modelName);
  }

  const recommendedModels = getRecommendedOllamaModels();
</script>

<div class="ollama-settings">
  <!-- Connection settings -->
  <div class="connection-section">
    <label for="ollama-url">
      Ollama Server URL:
      <span class="env-badge">{isLocal ? "🖥 local" : "☁️ remote"}</span>
    </label>
    <div class="url-input-group">
      <input
        id="ollama-url"
        type="text"
        bind:value={ollamaUrl}
        onchange={handleUrlChange}
        placeholder={isLocal ? "http://localhost:11434" : "https://me-ai.metaelon.space"}
      />
      <button 
        class="btn-test" 
        onclick={testConnection}
        disabled={isTestingConnection}
      >
        {isTestingConnection ? "Testing..." : "Test"}
      </button>
    </div>

    {#if connectionStatus}
      <div class="connection-status" class:connected={connectionStatus.connected}>
        {#if connectionStatus.connected}
          <span class="status-dot connected"></span>
          <span>Connected • v{connectionStatus.version}</span>
        {:else}
          <span class="status-dot disconnected"></span>
          <div class="error-content">
            <span>Disconnected: {connectionStatus.error}</span>
            {#if connectionStatus.corsError}
              <div class="cors-help">
                <strong>Fix CORS Error:</strong>
                <ul>
                  <li>In Cloudflare: Add Transform Rule to set <code>Access-Control-Allow-Origin: {window.location.origin}</code></li>
                  <li>Or set <code>OLLAMA_ORIGINS={window.location.origin}</code> on your server</li>
                  <li>For testing: Use <code>http://localhost:5173</code> (no CORS restrictions)</li>
                </ul>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Model selector -->
  <div class="model-section">
    <label for="ollama-model">Choose Model:</label>
    <select id="ollama-model" bind:value={selectedModel}>
      <optgroup label="Recommended (install via: ollama pull MODEL_NAME)">
        {#each recommendedModels as model}
          <option value={model.name}>
            {model.displayName} ({model.params}) - {(model.contextWindow / 1024).toFixed(0)}k context
            {#if isModelInstalled(model.name)} ✓{/if}
          </option>
        {/each}
      </optgroup>
      <optgroup label="Other Models">
        {#each OLLAMA_MODELS.filter(m => !m.recommended) as model}
          <option value={model.name}>
            {model.displayName} ({model.params}) - {(model.contextWindow / 1024).toFixed(0)}k context
            {#if isModelInstalled(model.name)} ✓{/if}
          </option>
        {/each}
      </optgroup>
    </select>

    {#if selectedModel}
      {@const modelInfo = OLLAMA_MODELS.find(m => m.name === selectedModel)}
      {#if modelInfo}
        <div class="model-info">
          <p class="model-desc">{modelInfo.description}</p>
          <div class="model-meta">
            <span>{(modelInfo.contextWindow / 1024).toFixed(0)}k context</span>
            <span class="sep">·</span>
            <span>{modelInfo.params} params</span>
            {#if modelInfo.tags?.length}
              <span class="sep">·</span>
              <span>{modelInfo.tags.join(", ")}</span>
            {/if}
          </div>
          {#if !isModelInstalled(selectedModel)}
            <div class="install-hint">
              <strong>Not installed.</strong> Run: <code>ollama pull {selectedModel}</code>
            </div>
          {:else}
            <div class="install-hint installed">
              ✓ Model installed and ready
            </div>
          {/if}
        </div>
      {/if}
    {/if}
  </div>

  <!-- Model capabilities table -->
  <details class="model-details">
    <summary class="model-details-summary">Ollama Model Capabilities</summary>
    <div class="model-table-wrapper">
      <table class="model-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Context Window</th>
            <th>Params</th>
            <th>Strengths</th>
          </tr>
        </thead>
        <tbody>
          {#each OLLAMA_MODELS as model}
            <tr class:selected={model.name === selectedModel} class:installed={isModelInstalled(model.name)}>
              <td class="model-name">
                {model.displayName}
                {#if model.name === selectedModel}
                  <span class="current-badge">Current</span>
                {/if}
                {#if isModelInstalled(model.name)}
                  <span class="installed-badge">✓</span>
                {/if}
              </td>
              <td class="context-col">
                <strong>{(model.contextWindow / 1024).toFixed(0)}k</strong>
              </td>
              <td class="params-col">{model.params}</td>
              <td class="tags-col">
                {#if model.recommended}
                  <span class="rec-badge">✅</span>
                {/if}
                {model.tags.slice(0, 2).join(", ")}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <p class="model-table-note">
      ✓ = installed on your Ollama server. To install: <code>ollama pull MODEL_NAME</code>
    </p>
  </details>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <button class="btn primary" onclick={handleLoadModel} disabled={!connectionStatus?.connected || error}>
    Load Model
  </button>
</div>

<style>
  .ollama-settings {
    width: 100%;
    max-width: 520px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  /* ── Connection section ─────────────────────────────────────────── */
  .connection-section label {
    display: block;
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .url-input-group {
    display: flex;
    gap: 0.5rem;
  }
  .url-input-group input {
    flex: 1;
    padding: 0.65rem 0.8rem;
    font-size: 0.85rem;
    color: #e8e8e8;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    font-family: monospace;
  }
  .url-input-group input:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
  .btn-test {
    padding: 0.65rem 1rem;
    font-size: 0.8rem;
    color: #e8e8e8;
    background: #2a2a2a;
    border: 1px solid #333;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-test:hover:not(:disabled) {
    background: #333;
  }
  .btn-test:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .connection-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.8rem;
    font-size: 0.75rem;
    border-radius: 6px;
    margin-top: 0.5rem;
  }
  .connection-status.connected {
    background: rgba(52, 211, 153, 0.1);
    border: 1px solid rgba(52, 211, 153, 0.2);
    color: #34d399;
  }
  .connection-status:not(.connected) {
    background: rgba(248, 113, 113, 0.1);
    border: 1px solid rgba(248, 113, 113, 0.2);
    color: #f87171;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .status-dot.connected {
    background: #34d399;
    box-shadow: 0 0 6px #34d399;
  }
  .status-dot.disconnected {
    background: #f87171;
  }

  /* ── Model section ──────────────────────────────────────────────── */
  .model-section label {
    display: block;
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .model-section select {
    width: 100%;
    padding: 0.65rem 0.8rem;
    font-size: 0.85rem;
    color: #e8e8e8;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .model-section select:hover {
    border-color: #4a90e2;
  }
  .model-section select:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }

  .model-info {
    margin-top: 0.6rem;
    padding: 0.6rem;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
  }
  .model-desc {
    font-size: 0.75rem;
    color: #bbb;
    margin: 0 0 0.4rem 0;
  }
  .model-meta {
    font-size: 0.7rem;
    color: #777;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    flex-wrap: wrap;
  }
  .sep {
    color: #444;
  }
  .install-hint {
    margin-top: 0.5rem;
    padding: 0.4rem 0.6rem;
    font-size: 0.7rem;
    background: rgba(251, 191, 36, 0.1);
    border: 1px solid rgba(251, 191, 36, 0.2);
    border-radius: 4px;
    color: #fbbf24;
  }
  .install-hint.installed {
    background: rgba(52, 211, 153, 0.1);
    border-color: rgba(52, 211, 153, 0.2);
    color: #34d399;
  }
  .install-hint code {
    background: rgba(0, 0, 0, 0.3);
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.68rem;
  }

  /* ── Model capabilities table ───────────────────────────────────── */
  .model-details {
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    background: #161616;
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
    transition: background 0.15s;
  }
  .model-details-summary:hover {
    background: #1a1a1a;
  }
  .model-details[open] .model-details-summary {
    border-bottom: 1px solid #2a2a2a;
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
  .model-table tbody tr.installed {
    opacity: 1;
  }
  .model-table tbody tr:not(.installed) {
    opacity: 0.5;
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
  }
  .installed-badge {
    margin-left: 0.3rem;
    color: #34d399;
    font-size: 0.65rem;
  }
  .context-col, .params-col {
    font-variant-numeric: tabular-nums;
    color: #999;
  }
  .tags-col {
    font-size: 0.65rem;
    color: #777;
  }
  .rec-badge {
    font-size: 0.7rem;
    margin-right: 0.3rem;
  }
  .model-table-note {
    padding: 0.5rem 0.8rem 0.8rem;
    font-size: 0.65rem;
    color: #666;
    line-height: 1.4;
    margin: 0;
  }
  .model-table-note code {
    background: rgba(0, 0, 0, 0.3);
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    font-family: monospace;
    color: #aaa;
  }

  /* ── Error & buttons ────────────────────────────────────────────── */
  .error {
    color: #f87171;
    font-size: 0.8rem;
    margin: 0;
  }
  .error-content {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .cors-help {
    padding: 0.5rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 5px;
    font-size: 0.7rem;
    line-height: 1.5;
  }
  .cors-help strong {
    display: block;
    margin-bottom: 0.3rem;
    color: #ef4444;
  }
  .cors-help ul {
    margin: 0;
    padding-left: 1.2rem;
    list-style: disc;
  }
  .cors-help li {
    margin-bottom: 0.2rem;
    color: #ccc;
  }
  .cors-help code {
    background: rgba(0, 0, 0, 0.3);
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.65rem;
    color: #fca5a5;
  }
  .env-badge {
    display: inline-block;
    margin-left: 0.4rem;
    padding: 0.1rem 0.4rem;
    font-size: 0.6rem;
    font-weight: 600;
    background: rgba(59, 130, 246, 0.15);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 4px;
    color: #60a5fa;
    vertical-align: middle;
  }
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
