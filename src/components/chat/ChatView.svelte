<script>
  import { onMount } from "svelte";
  import MessageBubble from "./MessageBubble.svelte";
  import EventMessage from "./EventMessage.svelte";
  import ActionDashboard from "./ActionDashboard.svelte";
  import TaskCard from "./TaskCard.svelte";
  import QuickActions from "./QuickActions.svelte";
  import GpuPanel from "./GpuPanel.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { cn } from "$lib/utils.js";
  import { mountLog } from "../../lib/debug.js";

  onMount(() => mountLog("ChatView"));

  let {
    messages = [],
    pendingData = null,
    hasScanData = false,
    engineReady = false,
    isScanning = false,
    isRunning = false,
    tps = null,
    numTokens = null,
    generationPhase = null,
    gpuInfo = null,
    backend = "webgpu",
    chatContainer = $bindable(),
    onsend,
    onstop,
    onreset,
    onmarkacted,
    ondismiss,
    onremove,
    oncleargroup,
    onscan,
    oncommand,
    onexecuted,
  } = $props();

  let input = $state("");
  let showGpuPanel = $state(false);

  function handleKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text || isRunning) return;
    input = "";
    onsend(text);
  }

  function handleAskAI(question) {
    if (question && !isRunning) {
      onsend(question);
    }
  }

  const BACKEND_META = {
    ollama:    { label: "Ollama",    color: "text-primary border-primary/30 bg-primary/8" },
    openai:    { label: "OpenAI",    color: "text-success border-success/30 bg-success/8" },
    anthropic: { label: "Anthropic", color: "text-warning border-warning/30 bg-warning/8" },
    google:    { label: "Google",    color: "text-info border-info/30 bg-info/8" },
    xai:       { label: "xAI",       color: "text-foreground border-border bg-muted/30" },
  };
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Stats bar -->
  <div class="flex items-center gap-3 px-6 h-10 border-b border-border shrink-0">
    {#if gpuInfo}
      <Button
        variant="outline"
        size="sm"
        onclick={() => showGpuPanel = !showGpuPanel}
        class="h-5 px-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-success border-success/30 bg-success/8 hover:bg-success/14"
      >
        WebGPU {showGpuPanel ? "▲" : "▼"}
      </Button>
    {:else if BACKEND_META[backend]}
      {@const meta = BACKEND_META[backend]}
      <Badge variant="outline" class={cn("text-[0.6rem] font-bold uppercase tracking-wider h-5 px-1.5", meta.color)}>
        {meta.label}
      </Badge>
    {/if}

    {#if tps && !isRunning}
      <span class="text-xs text-muted-foreground/50 tabular-nums">
        {numTokens} tok · {(numTokens / tps).toFixed(1)}s · {tps.toFixed(1)} tok/s
      </span>
    {:else if isRunning && generationPhase === "preparing"}
      <span class="text-xs text-muted-foreground/40 italic animate-pulse">preparing…</span>
    {:else if isRunning && generationPhase === "thinking"}
      <span class="text-xs text-muted-foreground/40 italic animate-pulse">
        thinking… {tps ? `${tps.toFixed(0)} tok/s` : ""}
      </span>
    {:else if tps && isRunning}
      <span class="text-xs text-muted-foreground/50 tabular-nums">{tps.toFixed(1)} tok/s</span>
    {/if}

    <span class="flex-1"></span>
    <Button variant="ghost" size="sm" onclick={onreset} disabled={isRunning} class="h-6 text-xs px-2">
      Reset
    </Button>
  </div>

  {#if showGpuPanel && gpuInfo}
    <GpuPanel {gpuInfo} />
  {/if}

  <!-- Messages -->
  <div
    class="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-2"
    bind:this={chatContainer}
  >
    {#if messages.length === 0}
      <div class="m-auto flex flex-col items-center gap-2 text-center py-12">
        <span class="text-2xl text-muted-foreground/20">✦</span>
        <span class="text-sm font-medium text-muted-foreground/50 tracking-tight">Start a conversation</span>
        <span class="text-xs text-muted-foreground/30">Ask about your emails, events, or anything else.</span>
      </div>
    {/if}

    {#each messages as msg, i}
      {#if msg.type === "dashboard"}
        <ActionDashboard
          pendingData={msg.pendingData}
          {onmarkacted}
          {ondismiss}
          {onremove}
          {oncleargroup}
          onaskai={handleAskAI}
        />
      {:else if msg.type === "task-card"}
        <TaskCard {msg} />
      {:else if msg.type === "event" || msg.type === "event-batch" || msg.type === "events-grouped"}
        <EventMessage {msg} {oncommand} {onexecuted} />
      {:else}
        {@const prevModel = messages.slice(0, i).filter(m => m.role === "assistant").at(-1)?.model}
        <MessageBubble
          {msg}
          isLast={i === messages.length - 1}
          {isRunning}
          {generationPhase}
          {numTokens}
          {backend}
          showModelName={msg.role === "assistant" && !!msg.model && msg.model !== prevModel}
        />
      {/if}
    {/each}
  </div>

  <QuickActions
    {hasScanData}
    {engineReady}
    {isScanning}
    {onscan}
  />

  <!-- Input row -->
  <div class="flex items-end gap-2 px-6 py-3 pb-4 border-t border-border shrink-0">
    <Textarea
      rows={1}
      placeholder="Type a message…"
      bind:value={input}
      onkeydown={handleKeydown}
      disabled={isRunning}
      class="flex-1 resize-none min-h-[42px] max-h-[160px] overflow-y-auto leading-relaxed py-2.5"
    />
    {#if isRunning}
      <Button variant="outline" size="sm" onclick={onstop} class="h-[42px] px-4">Stop</Button>
    {:else}
      <Button size="sm" onclick={handleSend} disabled={!input.trim()} class="h-[42px] px-4">Send</Button>
    {/if}
  </div>
</div>
