<script>
  import { onMount } from "svelte";
  import { API_MODELS } from "../../lib/api-models.js";
  import { getSetting, setSetting } from "../../lib/store/settings.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Card, CardContent } from "$lib/components/ui/card/index.js";
  import { Tabs, TabsList, TabsTrigger, TabsContent } from "$lib/components/ui/tabs/index.js";
  import { cn } from "$lib/utils.js";

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
    apiKeys.openai    = await getSetting("openaiApiKey")    || "";
    apiKeys.anthropic = await getSetting("anthropicApiKey") || "";
    apiKeys.google    = await getSetting("googleApiKey")    || "";
    apiKeys.xai       = await getSetting("xaiApiKey")       || "";

    const currModel = API_MODELS.find(m => m.id === selectedModel);
    if (currModel) {
      activeProvider = currModel.provider;
    } else {
      activeProvider = "openai";
      selectedModel = providerModels[0]?.id;
    }
  });

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

  const PROVIDERS = [
    { id: "openai",    icon: "⚡", label: "OpenAI" },
    { id: "anthropic", icon: "🧠", label: "Anthropic" },
    { id: "google",    icon: "🔍", label: "Google" },
    { id: "xai",       icon: "✖️", label: "xAI" },
  ];
</script>

<Card class="w-full max-w-[440px] mx-auto">
  <CardContent class="pt-5 pb-5 px-5 flex flex-col gap-5">
    <!-- Provider tabs -->
    <Tabs bind:value={activeProvider}>
      <TabsList class="w-full">
        {#each PROVIDERS as p}
          <TabsTrigger value={p.id} class="flex-1 gap-1.5">
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </TabsTrigger>
        {/each}
      </TabsList>
    </Tabs>

    <!-- API key field -->
    <div class="flex flex-col gap-1.5">
      <Label for="api-key" class="text-[0.68rem] uppercase tracking-wider opacity-60">
        {activeProvider.toUpperCase()} API Key
      </Label>
      <Input
        id="api-key"
        type="password"
        bind:value={apiKeys[activeProvider]}
        placeholder="Enter your API key…"
        autocomplete="off"
      />
      <p class="text-[0.68rem] text-muted-foreground/50 leading-relaxed">
        Stored locally in IndexedDB. Sent only to {activeProvider.toUpperCase()}.
      </p>
    </div>

    <!-- Model select -->
    <div class="flex flex-col gap-1.5">
      <Label for="model-select" class="text-[0.68rem] uppercase tracking-wider opacity-60">
        Select Model
      </Label>
      <select
        id="model-select"
        bind:value={selectedModel}
        class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
      >
        {#each providerModels as model}
          <option value={model.id}>
            {model.displayName}{model.recommendedForEmailProcessing ? " ★" : ""}
          </option>
        {/each}
      </select>

      {#if selectedModel}
        {@const info = providerModels.find(m => m.id === selectedModel)}
        {#if info}
          <p class="text-xs text-muted-foreground leading-relaxed">
            {info.description}. Context: {info.contextWindow.toLocaleString()} tokens.
            {#if !info.recommendedForEmailProcessing}
              <span class="text-warning font-medium"> May struggle with long emails.</span>
            {/if}
          </p>
        {/if}
      {/if}
    </div>

    <Button
      onclick={handleLoad}
      disabled={isChecking || !apiKeys[activeProvider]}
      class="w-full"
    >
      {isChecking ? "Checking…" : "Load Model"}
    </Button>

    {#if error}
      <p class="text-sm text-destructive text-center px-3 py-2 bg-destructive/8 border border-destructive/20 rounded">
        {error}
      </p>
    {/if}
  </CardContent>
</Card>
