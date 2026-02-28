<script>
  import { OLLAMA_MODELS, getRecommendedOllamaModels } from "../../lib/ollama-models.js";
  import { getOllamaUrl, getOllamaUrlAsync, setOllamaUrl, testOllamaConnection, listOllamaModels } from "../../lib/ollama-client.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Card, CardContent } from "$lib/components/ui/card/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { cn } from "$lib/utils.js";

  let { selectedModel = $bindable(), onload, error = $bindable() } = $props();

  const isLocal = typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  let ollamaUrl = $state(getOllamaUrl());
  let isTestingConnection = $state(false);
  let connectionStatus = $state(null);
  let availableModels = $state([]);
  let isLoadingModels = $state(false);

  $effect(() => {
    getOllamaUrlAsync().then((url) => {
      ollamaUrl = url;
      testConnection();
    });
  });

  async function testConnection() {
    isTestingConnection = true;
    connectionStatus = null;
    const result = await testOllamaConnection(ollamaUrl);
    connectionStatus = result;
    isTestingConnection = false;
    if (result.connected) loadAvailableModels();
  }

  async function loadAvailableModels() {
    isLoadingModels = true;
    try {
      const models = await listOllamaModels(ollamaUrl);
      availableModels = models.map(m => m.name);
    } catch (e) {
      availableModels = [];
    }
    isLoadingModels = false;
  }

  function handleUrlChange() {
    setOllamaUrl(ollamaUrl);
    testConnection();
  }

  function handleLoadModel() {
    if (!selectedModel) { error = "Please select a model"; return; }
    onload();
  }

  function isModelInstalled(modelName) {
    return availableModels.length > 0 && availableModels.includes(modelName);
  }

  const recommendedModels = getRecommendedOllamaModels();
</script>

<div class="flex flex-col gap-5 w-full max-w-[520px] mx-auto">
  <!-- Connection -->
  <Card>
    <CardContent class="pt-4 pb-4 px-4 flex flex-col gap-3">
      <div class="flex flex-col gap-1.5">
        <Label for="ollama-url" class="text-[0.68rem] uppercase tracking-wider opacity-60">
          Ollama Server URL
          <Badge variant="outline" class="ml-1.5 text-[0.55rem] h-4 px-1.5 normal-case tracking-normal">
            {isLocal ? "🖥 local" : "☁️ remote"}
          </Badge>
        </Label>
        <div class="flex gap-2">
          <Input
            id="ollama-url"
            type="text"
            bind:value={ollamaUrl}
            onchange={handleUrlChange}
            placeholder={isLocal ? "http://localhost:11434" : "https://your-server.example.com"}
            class="font-mono text-xs"
          />
          <Button variant="outline" size="sm" onclick={testConnection} disabled={isTestingConnection} class="shrink-0">
            {isTestingConnection ? "Testing…" : "Test"}
          </Button>
        </div>
      </div>

      {#if connectionStatus}
        <div class={cn(
          "flex items-start gap-2 px-3 py-2 rounded border text-xs",
          connectionStatus.connected
            ? "text-success border-success/20 bg-success/8"
            : "text-destructive border-destructive/20 bg-destructive/8"
        )}>
          <span class={cn(
            "size-1.5 rounded-full shrink-0 mt-0.5",
            connectionStatus.connected ? "bg-success" : "bg-destructive"
          )}></span>
          <div class="flex flex-col gap-1">
            {#if connectionStatus.connected}
              <span>Connected · v{connectionStatus.version}</span>
            {:else}
              <span>Disconnected: {connectionStatus.error}</span>
              {#if connectionStatus.corsError}
                <div class="mt-1 text-[0.65rem] leading-relaxed opacity-80">
                  <strong class="text-destructive block mb-1">Fix CORS Error:</strong>
                  <ul class="list-disc pl-4 space-y-0.5">
                    <li>Cloudflare: Add Transform Rule setting <code class="bg-black/20 px-1 rounded font-mono">Access-Control-Allow-Origin: {window.location.origin}</code></li>
                    <li>Or set <code class="bg-black/20 px-1 rounded font-mono">OLLAMA_ORIGINS={window.location.origin}</code> on your server</li>
                    <li>Testing locally: Use <code class="bg-black/20 px-1 rounded font-mono">http://localhost:5173</code></li>
                  </ul>
                </div>
              {/if}
            {/if}
          </div>
        </div>
      {/if}
    </CardContent>
  </Card>

  <!-- Model selector -->
  <Card>
    <CardContent class="pt-4 pb-4 px-4 flex flex-col gap-3">
      <div class="flex flex-col gap-1.5">
        <Label for="ollama-model" class="text-[0.68rem] uppercase tracking-wider opacity-60">
          Choose Model
        </Label>
        <select
          id="ollama-model"
          bind:value={selectedModel}
          class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <optgroup label="Recommended (ollama pull MODEL_NAME)">
            {#each recommendedModels as model}
              <option value={model.name}>
                {model.displayName} ({model.params}) – {(model.contextWindow / 1024).toFixed(0)}k ctx{isModelInstalled(model.name) ? " ✓" : ""}
              </option>
            {/each}
          </optgroup>
          <optgroup label="Other Models">
            {#each OLLAMA_MODELS.filter(m => !m.recommended) as model}
              <option value={model.name}>
                {model.displayName} ({model.params}) – {(model.contextWindow / 1024).toFixed(0)}k ctx{isModelInstalled(model.name) ? " ✓" : ""}
              </option>
            {/each}
          </optgroup>
        </select>
      </div>

      {#if selectedModel}
        {@const modelInfo = OLLAMA_MODELS.find(m => m.name === selectedModel)}
        {#if modelInfo}
          <div class="flex flex-col gap-1.5">
            <p class="text-xs text-muted-foreground">{modelInfo.description}</p>
            <div class="flex items-center gap-1.5 text-[0.68rem] text-muted-foreground/50">
              <span class="tabular-nums">{(modelInfo.contextWindow / 1024).toFixed(0)}k ctx</span>
              <span>·</span>
              <span>{modelInfo.params}</span>
              {#if modelInfo.tags?.length}
                <span>·</span>
                <span>{modelInfo.tags.slice(0, 2).join(", ")}</span>
              {/if}
            </div>
            {#if !isModelInstalled(selectedModel)}
              <p class="text-xs text-warning/80 bg-warning/6 border border-warning/15 rounded px-2 py-1.5">
                Not installed. Run: <code class="font-mono bg-black/20 px-1 rounded">ollama pull {selectedModel}</code>
              </p>
            {:else}
              <p class="text-xs text-success bg-success/6 border border-success/15 rounded px-2 py-1.5">
                ✓ Model installed and ready
              </p>
            {/if}
          </div>
        {/if}
      {/if}
    </CardContent>
  </Card>

  <!-- Capabilities table -->
  <details class="group">
    <summary class="flex items-center gap-2 px-3 py-2 rounded border border-border bg-card text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 cursor-pointer hover:bg-accent transition-colors list-none">
      <svg class="size-3 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      Ollama Model Capabilities
    </summary>
    <Card class="mt-1">
      <CardContent class="pt-0 pb-2 px-0">
        <div class="overflow-x-auto">
          <table class="w-full text-xs border-collapse">
            <thead>
              <tr>
                {#each ["Model", "Context", "Params", "Strengths"] as h}
                  <th class="text-left px-3 py-2 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40 border-b border-border">{h}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each OLLAMA_MODELS as model}
                <tr class={cn(
                  "transition-colors",
                  model.name === selectedModel ? "bg-primary/5" : "hover:bg-accent",
                  !isModelInstalled(model.name) && "opacity-50"
                )}>
                  <td class="px-3 py-1.5 font-medium text-foreground border-b border-border/50">
                    {model.displayName}
                    {#if model.name === selectedModel}
                      <Badge variant="outline" class="ml-1 text-[0.5rem] h-3.5 px-1 py-0 text-primary border-primary/30">current</Badge>
                    {/if}
                    {#if isModelInstalled(model.name)}
                      <span class="ml-1 text-success text-[0.65rem]">✓</span>
                    {/if}
                  </td>
                  <td class="px-3 py-1.5 tabular-nums text-muted-foreground border-b border-border/50">
                    <strong class="text-foreground">{(model.contextWindow / 1024).toFixed(0)}k</strong>
                  </td>
                  <td class="px-3 py-1.5 tabular-nums text-muted-foreground border-b border-border/50">{model.params}</td>
                  <td class="px-3 py-1.5 text-muted-foreground/60 border-b border-border/50">
                    {#if model.recommended}<span class="text-success mr-1">✅</span>{/if}
                    {model.tags.slice(0, 2).join(", ")}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <p class="px-3 pt-2 pb-1 text-[0.62rem] text-muted-foreground/40">
          ✓ = installed. Install: <code class="font-mono bg-muted px-1 rounded">ollama pull MODEL_NAME</code>
        </p>
      </CardContent>
    </Card>
  </details>

  {#if error}
    <p class="text-sm text-destructive text-center">{error}</p>
  {/if}

  <Button
    onclick={handleLoadModel}
    disabled={!connectionStatus?.connected || !!error}
    class="w-full"
  >
    Load Model
  </Button>
</div>
