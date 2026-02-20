<script>
  import { onMount } from "svelte";
  import { API_MODELS } from "../../lib/api-models.js";
  import { getSetting, setSetting } from "../../lib/store/settings.js";

  let {
    selectedModel = $bindable(),
    error = $bindable(null),
    onload
  } = $props();

  let activeProvider = $state("openai");
  let apiKeys = $state({ openai: "", anthropic: "", google: "", xai: "" });
  let isChecking = $state(false);

  let providerModels = $derived(API_MODELS.filter(m => m.provider === activeProvider));

  onMount(async () => {
    apiKeys.openai = await getSetting("openaiApiKey") || "";
    apiKeys.anthropic = await getSetting("anthropicApiKey") || "";
    apiKeys.google = await getSetting("googleApiKey") || "";
    apiKeys.xai = await getSetting("xaiApiKey") || "";

    const currModel = API_MODELS.find(m => m.id === selectedModel);
    if (currModel) {
      activeProvider = currModel.provider;
    } else {
      activeProvider = "openai";
      selectedModel = providerModels[0]?.id;
    }
  });

  // Re-run setup if provider changes
  $effect(() => {
    if (!API_MODELS.filter(m => m.provider === activeProvider).some(m => m.id === selectedModel)) {
      selectedModel = API_MODELS.filter(m => m.provider === activeProvider)[0]?.id;
    }
  });

  async function handleLoad() {
    if (!apiKeys[activeProvider]) {
      error = `API key for ${activeProvider} is required`;
      return;
    }
    error = null;
    isChecking = true;
    
    await setSetting(`${activeProvider}ApiKey`, apiKeys[activeProvider]);
    
    isChecking = false;
    onload();
  }
</script>

<div class="api-settings">
  <div class="tabs">
    <button class="tab-btn" class:active={activeProvider === "openai"} onclick={() => activeProvider = "openai"}>
      <span class="icon">⚡</span> OpenAI
    </button>
    <button class="tab-btn" class:active={activeProvider === "anthropic"} onclick={() => activeProvider = "anthropic"}>
      <span class="icon">🧠</span> Anthropic
    </button>
    <button class="tab-btn" class:active={activeProvider === "google"} onclick={() => activeProvider = "google"}>
      <span class="icon">🔍</span> Google
    </button>
    <button class="tab-btn" class:active={activeProvider === "xai"} onclick={() => activeProvider = "xai"}>
      <span class="icon">✖️</span> xAI
    </button>
  </div>

  <div class="field mt">
    <label for="api-key">{activeProvider.toUpperCase()} API Key</label>
    <div class="input-row">
      <input
        id="api-key"
        type="password"
        bind:value={apiKeys[activeProvider]}
        placeholder="Enter your API key..."
        autocomplete="off"
      />
    </div>
    <div class="hint">
      Your key is stored locally in your browser's IndexedDB and never sent anywhere except directly to {activeProvider.toUpperCase()}.
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

  <button class="btn primary load-btn" onclick={handleLoad} disabled={isChecking || !apiKeys[activeProvider]}>
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
    max-width: 440px;
    margin: 0 auto;
  }
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    background: #111;
    padding: 0.35rem;
    border-radius: 10px;
    border: 1px solid #333;
  }
  .tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.5rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    color: #888;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .tab-btn:hover {
    color: #ccc;
    background: rgba(255, 255, 255, 0.05);
  }
  .tab-btn.active {
    background: #2a2a2a;
    border-color: #444;
    color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  .tab-btn .icon {
    font-size: 0.9rem;
  }
  .field {
    margin-bottom: 1.25rem;
  }
  .mt {
    margin-top: 1rem;
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