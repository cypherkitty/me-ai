<script lang="ts">
  import { onMount } from "svelte";
  import { coreStore } from "../../lib/store/core-store.js";
  import type { ApiModel } from "../../lib/api-models.js";
  import { getSetting, setSetting } from "../../lib/store/settings.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Card, CardContent } from "$lib/components/ui/card/index.js";
  import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs/index.js";

  interface Props {
    selectedModel?: string;
    error?: string | null;
    onload?: () => void;
  }
  let {
    selectedModel = $bindable(),
    error = $bindable(null),
    onload
  }: Props = $props();

  let activeProvider = $state("openai");
  let apiKeys: Record<"openai" | "anthropic" | "google" | "xai", string> = $state({
    openai: "",
    anthropic: "",
    google: "",
    xai: "",
  });
  let isChecking = $state(false);

  let allModels: ApiModel[] = $state([]);
  $effect(() => {
    const { core } = $coreStore;
    if (!core) { allModels = []; return; }
    try {
      allModels = (core as any).getApiModels() as ApiModel[];
    } catch (e) {
      console.error("[CloudApiSettings] getApiModels failed:", e);
      allModels = [];
    }
  });

  let providerModels = $derived(allModels.filter(m => m.provider === activeProvider));

  onMount(async () => {
    apiKeys.openai    = await getSetting("openaiApiKey")    || "";
    apiKeys.anthropic = await getSetting("anthropicApiKey") || "";
    apiKeys.google    = await getSetting("googleApiKey")    || "";
    apiKeys.xai       = await getSetting("xaiApiKey")       || "";

    const currModel = allModels.find(m => m.id === selectedModel);
    if (currModel) {
      activeProvider = currModel.provider;
    } else {
      activeProvider = "openai";
      selectedModel = providerModels[0]?.id;
    }
  });

  $effect(() => {
    if (!providerModels.some(m => m.id === selectedModel)) {
      selectedModel = providerModels[0]?.id;
    }
  });

  async function handleLoad() {
    if (!apiKeys[activeProvider as keyof typeof apiKeys]) {
      error = `API key for ${activeProvider} is required`;
      return;
    }
    error = null;
    isChecking = true;
    await setSetting(`${activeProvider}ApiKey`, apiKeys[activeProvider as keyof typeof apiKeys]);
    isChecking = false;
    onload?.();
  }

  const PROVIDERS = [
    { id: "openai",    icon: "⚡", label: "OpenAI" },
    { id: "anthropic", icon: "🧠", label: "Anthropic" },
    { id: "google",    icon: "🔍", label: "Google" },
    { id: "xai",       icon: "✖️", label: "xAI" },
  ];
</script>

<Card class="w-full max-w-[440px] mx-auto">
  <CardContent class="pt-5 pb-5 px-5">
    <form
      class="flex flex-col gap-5"
      onsubmit={(event) => {
        event.preventDefault();
        handleLoad();
      }}
    >
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
          bind:value={apiKeys[activeProvider as keyof typeof apiKeys]}
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
        type="submit"
        disabled={isChecking || !apiKeys[activeProvider as keyof typeof apiKeys]}
        class="w-full"
      >
        {isChecking ? "Checking…" : "Load Model"}
      </Button>

      {#if error}
        <p class="text-sm text-destructive text-center px-3 py-2 bg-destructive/8 border border-destructive/20 rounded">
          {error}
        </p>
      {/if}
    </form>
  </CardContent>
</Card>
