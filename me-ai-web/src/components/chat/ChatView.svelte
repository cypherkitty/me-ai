<script lang="ts">
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
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { cn } from "$lib/utils.js";
  import { actionColor } from "../../lib/core.js";
  import { mountLog } from "../../lib/debug.js";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import { ChevronRight, MessageSquarePlus, Pencil, Trash2 } from "lucide-svelte";
  import type { ChatSessionRecord } from "me-ai-core";

  interface PendingData {
    total: number;
    order: string[];
    categories: Record<string, unknown[]>;
  }
  interface ChatMsg {
    type?: string;
    role?: string;
    content?: string;
    model?: string;
    pendingData?: PendingData;
    [key: string]: unknown;
  }
  interface ContextStats {
    messageCount: number;
    charCount: number;
    estimatedTokens: number;
    contextWindow: number | null;
    usagePercent: number | null;
  }
  interface Props {
    messages?: ChatMsg[];
    pendingData?: PendingData | null;
    hasScanData?: boolean;
    engineReady?: boolean;
    isScanning?: boolean;
    isRunning?: boolean;
    tps?: number | null;
    numTokens?: number | null;
    generationPhase?: string | null;
    gpuInfo?: unknown;
    enableThinking?: boolean;
    maxTokens?: number;
    doSample?: boolean;
    temperature?: number;
    repetitionPenalty?: number;
    backend?: string;
    activeModelLabel?: string | null;
    hasModelIssue?: boolean;
    contextStats?: ContextStats | null;
    chatSessions?: ChatSessionRecord[];
    activeChatId?: string | null;
    chatContainer?: HTMLElement | null;
    onsend?: (text: string) => void;
    onstop?: () => void;
    onfixmodel?: () => void;
    onnewchat?: () => void;
    onselectchat?: (chatId: string) => void;
    onrenamechat?: (chatId: string) => void;
    ondeletechat?: (chatId: string) => void;
    oneditlastuser?: () => void;
    onregenerate?: () => void;
    onsessiontitle?: (session: ChatSessionRecord) => string;
    onsessionsubtitle?: (session: ChatSessionRecord) => string;
    onsessiondate?: (session: ChatSessionRecord) => string;
    onmarkacted?: (id: string) => void;
    ondismiss?: (id: string) => void;
    onremove?: (id: string) => void;
    onclearcategory?: (category: string) => void;
    onscan?: () => void;
    oncommand?: (
      cmd: { event: Record<string, unknown>; commandId: string } | { id: string }
    ) => void;
    onexecuted?: () => void;
  }
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
    enableThinking = $bindable(false),
    maxTokens = $bindable(4096),
    doSample = $bindable(false),
    temperature = $bindable(0.7),
    repetitionPenalty = $bindable(1.1),
    backend = "webgpu",
    activeModelLabel = null,
    hasModelIssue = false,
    contextStats = null,
    chatSessions = [],
    activeChatId = null,
    chatContainer = $bindable(),
    onsend,
    onstop,
    onfixmodel,
    onnewchat,
    onselectchat,
    onrenamechat,
    ondeletechat,
    oneditlastuser,
    onregenerate,
    onsessiontitle,
    onsessionsubtitle,
    onsessiondate,
    onmarkacted,
    ondismiss,
    onremove,
    onclearcategory,
    onscan,
    oncommand: _oncommand,
    onexecuted,
  }: Props = $props();

  let input = $state("");
  let showGpuPanel = $state(false);
  let showGenerationPanel = $state(false);
  let showChatSessionsPanel = $state(false);
  let backendIndicatorState = $derived.by(() => {
    if (hasModelIssue || !activeModelLabel) return "error";
    if (isRunning && generationPhase === "thinking") return "thinking";
    if (isRunning && generationPhase !== "preparing") return "generating";
    return "idle";
  });
  let backendHeaderLabel = $derived.by(() => {
    if (backend === "webgpu" && activeModelLabel) return `WebGPU-${activeModelLabel}`;
    if (backend === "ollama" && activeModelLabel) return `Ollama-${activeModelLabel}`;
    if (backend === "openai" && activeModelLabel) return `OpenAI-${activeModelLabel}`;
    if (backend === "anthropic" && activeModelLabel) return `Anthropic-${activeModelLabel}`;
    if (backend === "google" && activeModelLabel) return `Google-${activeModelLabel}`;
    if (backend === "xai" && activeModelLabel) return `xAI-${activeModelLabel}`;
    return activeModelLabel;
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text || isRunning) return;
    input = "";
    onsend?.(text);
  }

  function sendCommand(cmdStr: string) {
    if (isRunning) return;
    onsend?.(cmdStr);
  }

  function handleAskAI(question: string) {
    if (question && !isRunning) {
      onsend?.(question);
    }
  }

  const BACKEND_META: Record<string, { label: string; color: string }> = {
    ollama: {
      label: "Ollama",
      color: "text-primary border-primary/30 bg-primary/8",
    },
    openai: {
      label: "OpenAI",
      color: "text-success border-success/30 bg-success/8",
    },
    anthropic: {
      label: "Anthropic",
      color: "text-warning border-warning/30 bg-warning/8",
    },
    google: { label: "Google", color: "text-info border-info/30 bg-info/8" },
    xai: { label: "xAI", color: "text-foreground border-border bg-muted/30" },
  };
</script>

<div class="flex h-full w-full overflow-hidden">
  <!-- Left Side Control Panel (Cockpit) -->
  <div
    class="w-64 border-r border-border bg-card/30 flex flex-col shrink-0 overflow-y-auto hidden md:flex"
  >
    <div class="px-4 py-4 border-b border-border/50 sticky top-0 bg-card/95 backdrop-blur z-10">
      <h3 class="text-xs font-semibold text-foreground tracking-tight flex items-center gap-2">
        <span class="text-[0.6rem] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm uppercase"
          >AI Control Plane</span
        >
      </h3>
      <p class="text-[0.65rem] text-muted-foreground mt-1.5 leading-tight">
        Interactive commands mapped directly to the local AI engine.
      </p>
    </div>

    <div class="p-3 space-y-4">
      <!-- General Commands -->
      <div class="space-y-1">
        <div
          class="text-[0.65rem] font-bold text-muted-foreground/60 uppercase tracking-wider px-1 pb-1"
        >
          Overview
        </div>
        <button
          onclick={() => sendCommand("[SHOW:DASHBOARD]")}
          disabled={isRunning}
          class="w-full flex items-center justify-between text-left px-2.5 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-50"
        >
          <span class="flex items-center gap-2">
            <span class="text-muted-foreground">📊</span> Event Dashboard
          </span>
          <span
            class="text-[0.55rem] text-muted-foreground/50 border border-border px-1 rounded bg-background"
            >UI</span
          >
        </button>
      </div>

      <!-- Pending Groups / Execution Links -->
      {#if pendingData && pendingData.total > 0}
        <div class="space-y-1">
          <div
            class="text-[0.65rem] font-bold text-muted-foreground/60 uppercase tracking-wider px-1 pb-1 flex justify-between items-center"
          >
            Pending Actions
            <span class="bg-warning/20 text-warning px-1 rounded text-[0.55rem] font-black"
              >{pendingData.total}</span
            >
          </div>

          {#each pendingData.order as eventType (eventType)}
            {@const count = pendingData.categories[eventType].length}
            {@const color = actionColor(eventType)}
            <button
              onclick={() => sendCommand(`[EXECUTE:CATEGORY:${eventType}]`)}
              disabled={isRunning}
              class="w-full flex items-center justify-between text-left px-2 py-1.5 text-xs text-foreground/80 hover:bg-accent rounded-md transition-all group/btn disabled:opacity-50"
            >
              <span class="flex items-center gap-1.5 min-w-0 pr-2">
                <span class="size-1.5 rounded-full shrink-0 shadow-sm" style:background={color}
                ></span>
                <span class="truncate tracking-tight group-hover/btn:text-foreground"
                  >{eventType.split("_").join(" ")}</span
                >
              </span>
              <span class="flex items-center gap-1.5 shrink-0">
                <span class="text-[0.55rem] font-bold opacity-60 tabular-nums">{count}</span>
                <span
                  class="text-[0.55rem] font-bold tracking-wider text-muted-foreground/40 group-hover/btn:text-primary transition-colors border border-border/50 bg-background/50 px-1 rounded opacity-0 group-hover/btn:opacity-100"
                  >RUN</span
                >
              </span>
            </button>
          {/each}
        </div>
      {:else if engineReady}
        <div class="space-y-2">
          <div class="px-2 py-3 border border-dashed border-border/60 rounded-md text-center">
            <p class="text-[0.65rem] text-muted-foreground">No pending items.</p>
            <button
              onclick={onscan}
              class="mt-1.5 text-[0.65rem] font-medium text-primary hover:underline"
            >
              Scan Inbox Now
            </button>
          </div>

          <Collapsible.Root bind:open={showChatSessionsPanel}>
            <Collapsible.Trigger
              class="w-full inline-flex items-center justify-between gap-2 rounded-md border border-border/60 bg-background/50 px-2.5 py-2 text-left text-[0.68rem] text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
            >
              <span class="inline-flex items-center gap-1.5">
                <ChevronRight
                  class={cn("size-3 transition-transform", showChatSessionsPanel && "rotate-90")}
                />
                Chat history
              </span>
              <span class="text-[0.6rem] uppercase tracking-wider opacity-50">
                {chatSessions.length}
              </span>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <div class="mt-1 rounded-md border border-border/50 bg-background/35 p-2 space-y-2">
                <button
                  onclick={onnewchat}
                  disabled={isRunning}
                  class="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-primary/20 bg-primary/8 px-2.5 py-2 text-[0.68rem] font-semibold text-primary hover:bg-primary/14 transition-colors disabled:opacity-50"
                >
                  <MessageSquarePlus class="size-3.5" />
                  New chat
                </button>

                {#if chatSessions.length > 0}
                  <div class="space-y-2">
                    {#each chatSessions as session (session.id)}
                      {@const isActiveSession = session.id === activeChatId}
                      <div
                        class={`group rounded-lg border px-2.5 py-2 text-left transition-colors ${
                          isActiveSession
                            ? "border-primary/30 bg-primary/10"
                            : "border-border/50 bg-background/55 hover:bg-background/80"
                        } ${isRunning && !isActiveSession ? "pointer-events-none opacity-60" : ""}`}
                        onclick={() => onselectchat?.(session.id)}
                        onkeydown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onselectchat?.(session.id);
                          }
                        }}
                        role="button"
                        tabindex={isRunning && !isActiveSession ? -1 : 0}
                        aria-pressed={isActiveSession}
                      >
                        <div class="flex items-start gap-2">
                          <div class="min-w-0 flex-1">
                            {#if session.titleStatus === "pending" && !session.title}
                              <div class="space-y-1.5 py-0.5">
                                <div class="h-3 w-24 rounded bg-muted/60 animate-pulse"></div>
                                <div class="h-3 w-16 rounded bg-muted/40 animate-pulse"></div>
                              </div>
                            {:else}
                              <div class="truncate text-[0.72rem] font-medium text-foreground/95">
                                {onsessiontitle?.(session) || session.title || "Untitled chat"}
                              </div>
                            {/if}

                            <div
                              class="mt-1 line-clamp-2 text-[0.65rem] leading-relaxed text-muted-foreground/65"
                            >
                              {onsessionsubtitle?.(session) ?? ""}
                            </div>

                            <div
                              class="mt-1.5 text-[0.58rem] uppercase tracking-wider text-muted-foreground/45"
                            >
                              {onsessiondate?.(session) ?? ""}
                            </div>
                          </div>

                          <div
                            class="flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <button
                              class="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                              onclick={(event) => {
                                event.stopPropagation();
                                onrenamechat?.(session.id);
                              }}
                              title="Rename chat"
                              type="button"
                            >
                              <Pencil class="size-3.5" />
                            </button>
                            <button
                              class="rounded-md p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              onclick={(event) => {
                                event.stopPropagation();
                                ondeletechat?.(session.id);
                              }}
                              title="Delete chat"
                              type="button"
                            >
                              <Trash2 class="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
      {/if}
    </div>
  </div>

  <!-- Main Chat Area -->
  <div class="flex flex-col h-full flex-1 min-w-0 min-h-0 bg-background">
    <!-- Stats bar + Generation panel -->
    <div class="flex flex-col border-b border-border shrink-0">
      <div class="flex items-center gap-3 px-6 h-10 bg-card/10">
        {#if hasModelIssue}
          <div class="flex items-center gap-1.5 text-[0.68rem] text-destructive">
            <span class={`model-live-dot ${backendIndicatorState}`} aria-hidden="true"></span>
            <span class="font-semibold">No model loaded, re-downloading model.</span>
            <a
              href="#home"
              onclick={onfixmodel}
              class="underline underline-offset-2 hover:text-destructive/80"
            >
              Open model picker
            </a>
            {#if backendHeaderLabel}
              <span class="text-destructive/70">({backendHeaderLabel})</span>
            {/if}
          </div>
        {:else if activeModelLabel}
          <Button
            variant="outline"
            size="sm"
            onclick={() => (showGpuPanel = !showGpuPanel)}
            class={cn(
              "h-5 px-1.5 text-[0.6rem] font-bold tracking-wider",
              backend === "webgpu"
                ? "uppercase text-success border-success/30 bg-success/8 hover:bg-success/14"
                : "border-border/70 bg-background/45 text-foreground/80 hover:bg-background/80"
            )}
          >
            <span>{backendHeaderLabel}</span>
            <span class={`model-live-dot ${backendIndicatorState}`} aria-hidden="true"></span>
            {showGpuPanel ? "▲" : "▼"}
          </Button>
        {:else if BACKEND_META[backend]}
          {@const meta = BACKEND_META[backend]}
          <Badge
            variant="outline"
            class={cn("text-[0.6rem] font-bold uppercase tracking-wider h-5 px-1.5", meta.color)}
          >
            <span>{backendHeaderLabel ?? meta.label}</span>
            <span class={`model-live-dot ${backendIndicatorState}`} aria-hidden="true"></span>
          </Badge>
        {/if}

        {#if tps && !isRunning}
          <span class="text-xs text-muted-foreground/50 tabular-nums">
            {numTokens ?? 0} tok · {((numTokens ?? 0) / tps).toFixed(1)}s · {tps.toFixed(1)}
            tok/s
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
        {#if gpuInfo}
          <div class="flex items-center gap-2">
            <Label for="thinking-switch" class="text-xs text-muted-foreground/60 cursor-pointer">
              Thinking
            </Label>
            <Switch
              id="thinking-switch"
              bind:checked={enableThinking}
              disabled={isRunning}
              class="scale-90"
            />
          </div>
        {/if}
        <Button
          variant="ghost"
          size="sm"
          onclick={() => (showGenerationPanel = !showGenerationPanel)}
          class={cn(
            "h-6 text-[0.6rem] font-semibold uppercase tracking-wider px-2",
            showGenerationPanel
              ? "bg-accent/50 text-foreground"
              : "text-muted-foreground/50 hover:bg-accent/50"
          )}
        >
          Generation {showGenerationPanel ? "▲" : "▼"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onclick={onnewchat}
          disabled={isRunning}
          class="h-6 text-xs px-2"
        >
          New Chat
        </Button>
      </div>
      {#if showGenerationPanel}
        <div class="px-6 py-3 border-t border-border bg-muted/20 flex flex-wrap gap-4">
          <div class="flex flex-col gap-1 min-w-[70px]">
            <Label for="max-tokens" class="text-[0.6rem] opacity-60">Max tokens</Label>
            <Input
              id="max-tokens"
              type="number"
              bind:value={maxTokens}
              min={256}
              max={32768}
              step={256}
              disabled={isRunning}
              class="h-7 text-xs"
            />
          </div>
          <div class="flex items-center gap-2 pt-5">
            <Label for="do-sample" class="text-[0.6rem] opacity-60">Sample</Label>
            <Switch id="do-sample" bind:checked={doSample} disabled={isRunning} class="scale-90" />
          </div>
          {#if doSample}
            <div class="flex flex-col gap-1 min-w-[70px]">
              <Label for="temperature" class="text-[0.6rem] opacity-60">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                bind:value={temperature}
                min={0}
                max={2}
                step={0.1}
                disabled={isRunning}
                class="h-7 text-xs"
              />
            </div>
          {/if}
          <div class="flex flex-col gap-1 min-w-[70px]">
            <Label for="repetition-penalty" class="text-[0.6rem] opacity-60">Rep. penalty</Label>
            <Input
              id="repetition-penalty"
              type="number"
              bind:value={repetitionPenalty}
              min={1}
              max={2}
              step={0.05}
              disabled={isRunning}
              class="h-7 text-xs"
            />
          </div>
        </div>
      {/if}
    </div>

    {#if showGpuPanel && activeModelLabel}
      <GpuPanel
        gpuInfo={gpuInfo as {
          vendor?: string;
          architecture?: string;
          device?: string;
          features?: string[];
          limits?: {
            maxBufferSize?: number;
            maxComputeInvocationsPerWorkgroup?: number;
            maxComputeWorkgroupStorageSize?: number;
          };
        } | null}
        {backend}
        {contextStats}
      />
    {/if}

    <!-- Messages -->
    <div
      class="flex-1 min-h-0 overflow-y-auto px-6 py-5 flex flex-col gap-2"
      bind:this={chatContainer}
    >
      {#if messages.length === 0}
        <div class="m-auto flex flex-col items-center gap-2 text-center py-12">
          <span class="text-2xl text-muted-foreground/30">✦</span>
          <span class="text-sm font-medium text-foreground/90 tracking-tight"
            >Start a conversation</span
          >
          <span class="text-xs text-muted-foreground/80"
            >Ask about your emails, events, or anything else.</span
          >
        </div>
      {/if}

      {#each messages as msg, i (i)}
        {#if msg.type === "dashboard"}
          <ActionDashboard
            pendingData={msg.pendingData}
            {onmarkacted}
            {ondismiss}
            {onremove}
            {onclearcategory}
            onaskai={handleAskAI}
          />
        {:else if msg.type === "task-card"}
          <TaskCard {msg} />
        {:else if msg.type === "event" || msg.type === "event-batch" || msg.type === "events-by-category"}
          <EventMessage
            {msg}
            {onexecuted}
            ondismiss={() => (messages = messages.filter((_, idx) => idx !== i))}
          />
        {:else}
          {@const prevModel = messages
            .slice(0, i)
            .filter((m) => m.role === "assistant")
            .at(-1)?.model}
          {@const lastAssistantIndex = messages.findLastIndex(
            (m) => m.role === "assistant" && !m.type
          )}
          {@const lastUserIndex = messages.findLastIndex((m) => m.role === "user")}
          {@const isLatestAssistant = msg.role === "assistant" && i === lastAssistantIndex}
          {@const isLatestUser = msg.role === "user" && i === lastUserIndex}
          <MessageBubble
            msg={msg as unknown as {
              role: string;
              content?: string;
              model?: string;
              [key: string]: unknown;
            }}
            isLast={i === messages.length - 1}
            {isRunning}
            {generationPhase}
            {numTokens}
            {backend}
            canEditMessage={isLatestUser && !isRunning}
            canRegenerate={isLatestAssistant &&
              lastUserIndex !== -1 &&
              lastUserIndex < i &&
              !isRunning}
            {oneditlastuser}
            {onregenerate}
            showModelName={msg.role === "assistant" && !!msg.model && msg.model !== prevModel}
          />
        {/if}
      {/each}
    </div>

    <QuickActions {hasScanData} {engineReady} {isScanning} {onscan} />

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
        <Button size="sm" onclick={handleSend} disabled={!input.trim()} class="h-[42px] px-4"
          >Send</Button
        >
      {/if}
    </div>
  </div>
</div>

<style>
  .model-live-dot {
    position: relative;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    display: inline-block;
    margin-left: 0.15rem;
    flex-shrink: 0;
  }

  .model-live-dot::after {
    content: "";
    position: absolute;
    inset: -0.28rem;
    border-radius: 9999px;
    opacity: 0.45;
    transform: scale(0.8);
  }

  .model-live-dot.idle {
    background: #4ade80;
    box-shadow: 0 0 0.45rem rgba(74, 222, 128, 0.55);
    animation: liveIdlePulse 1.8s ease-in-out infinite;
  }

  .model-live-dot.idle::after {
    border: 1px solid rgba(74, 222, 128, 0.42);
    animation: liveRing 1.8s ease-out infinite;
  }

  .model-live-dot.generating {
    background: #facc15;
    box-shadow: 0 0 0.5rem rgba(250, 204, 21, 0.55);
    animation: liveGeneratePulse 1.05s ease-in-out infinite;
  }

  .model-live-dot.generating::after {
    border: 1px solid rgba(250, 204, 21, 0.42);
    animation: liveRingFast 1.05s ease-out infinite;
  }

  .model-live-dot.thinking {
    background: #facc15;
    box-shadow: 0 0 0.5rem rgba(250, 204, 21, 0.48);
    animation: liveThinkingBlink 0.95s steps(1, end) infinite;
  }

  .model-live-dot.thinking::after {
    border: 1px solid rgba(255, 255, 255, 0.5);
    animation: liveRingFast 0.95s ease-out infinite;
  }

  .model-live-dot.error {
    background: #f87171;
    box-shadow: 0 0 0.5rem rgba(248, 113, 113, 0.5);
    animation: liveErrorPulse 1.3s ease-in-out infinite;
  }

  .model-live-dot.error::after {
    border: 1px solid rgba(248, 113, 113, 0.45);
    animation: liveRingFast 1.3s ease-out infinite;
  }

  @keyframes liveIdlePulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.95;
    }
    50% {
      transform: scale(1.08);
      opacity: 1;
    }
  }

  @keyframes liveGeneratePulse {
    0%,
    100% {
      transform: scale(0.95);
      opacity: 0.88;
    }
    50% {
      transform: scale(1.14);
      opacity: 1;
    }
  }

  @keyframes liveThinkingBlink {
    0%,
    49% {
      background: #facc15;
      box-shadow: 0 0 0.5rem rgba(250, 204, 21, 0.48);
    }
    50%,
    100% {
      background: rgba(255, 255, 255, 0.96);
      box-shadow: 0 0 0.5rem rgba(255, 255, 255, 0.45);
    }
  }

  @keyframes liveErrorPulse {
    0%,
    100% {
      transform: scale(0.96);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.12);
      opacity: 1;
    }
  }

  @keyframes liveRing {
    0% {
      opacity: 0.55;
      transform: scale(0.72);
    }
    100% {
      opacity: 0;
      transform: scale(1.55);
    }
  }

  @keyframes liveRingFast {
    0% {
      opacity: 0.5;
      transform: scale(0.74);
    }
    100% {
      opacity: 0;
      transform: scale(1.65);
    }
  }
</style>
