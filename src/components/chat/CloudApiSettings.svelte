<script>
  import { onMount } from "svelte";
  import { API_MODELS } from "../../lib/api-models.js";
  import { getSetting, setSetting } from "../../lib/store/settings.js";

  let {
    provider = "openai",
    selectedModel = $bindable(),
    error = $bindable(null),
    onload
  } = $props();

  let apiKey = $state("");
  let isChecking = $state(false);

  let providerModels = $derived(API_MODELS.filter(m => m.provider === provider));

  onMount(async () => {
    const savedKey = await getSetting(`${provider}ApiKey`);
    if (savedKey) apiKey = savedKey;

    // Check if the currently selected model belongs to the provider
    if (!providerModels.some(m => m.id === selectedModel)) {
      selectedModel = providerModels[0]?.id;
    }
  });

  // Re-run setup if provider changes
  $effect(() => {
    if (provider) {
      getSetting(`${provider}ApiKey`).then(k => {
        if (k) apiKey = k; else apiKey = "";
      });
      // Also update selectedModel if invalid
      if (!API_MODELS.filter(m => m.provider === provider).some(m => m.id === selectedModel)) {
        selectedModel = API_MODELS.filter(m => m.provider === provider)[0]?.id;
      }
    }
  });

  async function handleLoad() {
    if (!apiKey) {
      error = `API key for ${provider} is required`;
      return;
    }
    error = null;
    isChecking = true;
    
    await setSetting(`${provider}ApiKey`, apiKey);
    
    // Test connection?
    // The engine handles the connection test when loadModel is called.
    isChecking = false;
    onload();
  }
</script>

<div class="api-settings">
  <div class="field">
    <label for="api-key">{provider.toUpperCase()} API Key</label>
    <div class="input-row">
      <input
        id="api-key"
        type="password"
        bind:value={apiKey}
        placeholder="Enter your API key..."
        autocomplete="off"
      />
    </div>
    <div class="hint">
      Your key is stored locally in your browser's IndexedDB and never sent anywhere except directly to {provider.toUpperCase()}.
    </div>
  </div>

  <div class="field">
    <label for="model-select">Select Model</label>
    <select id="model-select" bind:value={selectedModel}>
      {#each providerModels as model}
        <option value={model.id}>
          {model.displayName}
          {#if model.recommendedForEmailProcessing}★{/if}
        </option>
      {/each}
    </select>
    
    {#if selectedModel}
      {@const info = providerModels.find(m => m.id === selectedModel)}
      {#if info}
        <div class="model-info">
          {info.description}. Context window: {info.contextWindow.toLocaleString()} tokens.
          {#if !info.recommendedForEmailProcessing}
            <span class="warning">May struggle with long emails.</span>
          {/if}
        </div>
      {/if}
    {/if}
  </div>

  <button class="btn primary load-btn" onclick={handleLoad} disabled={isChecking || !apiKey}>
    {isChecking ? "Checking..." : "Load Model"}
  </button>
  
  {#if error}
    <div class="error-msg">{error}</div>
  {/if}
</div>

<style>
  .api-settings {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: left;
    max-width: 400px;
    margin: 0 auto;
  }
  .field {
    margin-bottom: 1.25rem;
  }
  label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #e8e8e8;
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .input-row {
    display: flex;
    gap: 0.5rem;
  }
  input[type="password"], select {
    flex: 1;
    background: #111;
    border: 1px solid #333;
    color: #fff;
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
    font-size: 0.95rem;
    font-family: inherit;
  }
  input[type="password"]:focus, select:focus {
    border-color: #3b82f6;
    outline: none;
  }
  .hint {
    font-size: 0.7rem;
    color: #666;
    margin-top: 0.4rem;
    line-height: 1.4;
  }
  .model-info {
    font-size: 0.75rem;
    color: #aaa;
    margin-top: 0.5rem;
    line-height: 1.4;
  }
  .warning {
    color: #fbbf24;
    font-weight: 500;
  }
  .load-btn {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.75rem;
    font-size: 0.95rem;
    font-weight: 600;
  }
  .error-msg {
    margin-top: 1rem;
    padding: 0.75rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 6px;
    color: #ef4444;
    font-size: 0.85rem;
    text-align: center;
  }

  .btn {
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn.primary {
    background: #3b82f6;
    color: #fff;
  }
  .btn.primary:hover:not(:disabled) {
    background: #2563eb;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>