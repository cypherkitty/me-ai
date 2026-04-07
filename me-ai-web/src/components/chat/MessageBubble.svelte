<script lang="ts">
  import { marked } from "marked";
  import DOMPurify from "dompurify";
  import { onDestroy, onMount, tick } from "svelte";
  import { mountLog } from "../../lib/debug.js";
  import { getCore } from "../../lib/store/core-store.js";
  const getModelInfo = (id: string) => getCore().getOnnxModelInfo(id);
  const getModelGroups = () => getCore().getOnnxModelGroups();
  const getOllamaModelInfo = (id: string) => getCore().getOllamaModelInfo(id);
  const getApiModelInfo = (id: string) => getCore().getApiModelInfo(id);
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import { Check, ChevronRight, Copy, Pencil, RotateCcw } from "lucide-svelte";
  import { cn } from "$lib/utils.js";

  interface ChatMessage {
    role: string;
    content?: string;
    createdAt?: number;
    thinking?: string;
    thinkingStartedAt?: number | null;
    thinkingDurationMs?: number | null;
    stopped?: boolean;
    model?: string;
    [key: string]: unknown;
  }
  interface Props {
    msg: ChatMessage;
    isLast?: boolean;
    isRunning?: boolean;
    generationPhase?: string | null;
    numTokens?: number | null;
    backend?: string | null;
    showModelName?: boolean;
    canEditMessage?: boolean;
    canRegenerate?: boolean;
    oneditlastuser?: () => void;
    onregenerate?: () => void;
  }
  let {
    msg,
    isLast = false,
    isRunning = false,
    generationPhase = null,
    numTokens = null,
    backend = null,
    showModelName = false,
    canEditMessage = false,
    canRegenerate = false,
    oneditlastuser,
    onregenerate,
  }: Props = $props();

  onMount(() => mountLog(`MessageBubble[${msg.role}]`));

  const BACKEND_LABELS: Record<string, string> = {
    webgpu: "WebGPU",
    ollama: "Ollama",
    openai: "OpenAI",
    anthropic: "Claude",
    google: "Gemini",
    xai: "Grok",
  };
  const BACKEND_COLORS: Record<string, string> = {
    webgpu: "#4ade80",
    ollama: "#a78bfa",
    openai: "#10b981",
    anthropic: "#f59e0b",
    google: "#3b82f6",
    xai: "#e8e8e8",
  };

  let modelLabel = $derived(backend ? (BACKEND_LABELS[backend] ?? backend) : "AI");
  let modelColor = $derived(backend ? (BACKEND_COLORS[backend] ?? "#888") : "#888");

  let modelName = $derived.by(() => {
    if (!msg.model) return null;
    if (backend === "ollama") {
      const ollamaInfo = getOllamaModelInfo(msg.model);
      return ollamaInfo?.displayName ?? ollamaInfo?.name ?? msg.model;
    }
    if (backend && backend !== "webgpu") {
      const apiInfo = getApiModelInfo(msg.model);
      return apiInfo?.displayName ?? apiInfo?.name ?? msg.model;
    }
    for (const group of getModelGroups()) {
      const groupedModel = group.models.find((item) => item.id === msg.model);
      if (groupedModel) return `${group.label} ${groupedModel.name}`;
    }
    const info = getModelInfo(msg.model);
    if (info) return info.name;
    return (msg.model.split("/").pop() ?? msg.model)
      .replace(/[-_](ONNX|onnx)([-_](GQA|MHA|web|DQ))*$/i, "")
      .replace(/[-_]/g, " ")
      .trim();
  });

  let html = $derived.by(() => {
    if (msg.role !== "assistant" || !msg.content) return "";
    try {
      const raw = marked.parse(msg.content, { breaks: true, gfm: true }) as string;
      return DOMPurify.sanitize(raw);
    } catch {
      return msg.content;
    }
  });

  let isStreaming = $derived(isRunning && isLast);
  let showThinking = $state(false);
  let didAutoOpenThinking = $state(false);
  let thinkingContentEl = $state<HTMLPreElement | null>(null);
  let elapsedThinkingMs = $state(0);
  let isActivelyThinking = $derived(
    isStreaming && generationPhase === "thinking" && !!msg.thinking
  );
  let thinkingDurationMs = $derived.by(() => {
    if (typeof msg.thinkingDurationMs === "number") return msg.thinkingDurationMs;
    return isActivelyThinking ? elapsedThinkingMs : null;
  });
  let thinkingDurationLabel = $derived.by(() => {
    if (thinkingDurationMs == null) return null;
    return formatThinkingDuration(thinkingDurationMs);
  });

  function formatThinkingDuration(ms: number): string {
    if (ms < 10_000) return `${(ms / 1000).toFixed(1)}s`;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) return `${totalSeconds}s`;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function formatMessageTimestamp(ts: number | null | undefined): string | null {
    if (typeof ts !== "number" || !Number.isFinite(ts)) return null;
    try {
      return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(ts);
    } catch {
      return null;
    }
  }

  let messageTimestamp = $derived(formatMessageTimestamp(msg.createdAt ?? null));
  let copyState = $state<"idle" | "copied">("idle");
  let copyResetTimer = $state<number | null>(null);

  $effect(() => {
    if (isActivelyThinking && !didAutoOpenThinking) {
      showThinking = true;
      didAutoOpenThinking = true;
      return;
    }
    if (!isActivelyThinking && didAutoOpenThinking) {
      showThinking = false;
      didAutoOpenThinking = false;
    }
  });

  $effect(() => {
    if (!isActivelyThinking || !showThinking || !thinkingContentEl) return;
    void tick().then(() => {
      if (thinkingContentEl) {
        thinkingContentEl.scrollTop = thinkingContentEl.scrollHeight;
      }
    });
  });

  $effect(() => {
    if (!isActivelyThinking) {
      elapsedThinkingMs = typeof msg.thinkingDurationMs === "number" ? msg.thinkingDurationMs : 0;
      return;
    }

    const startedAt =
      typeof msg.thinkingStartedAt === "number" ? msg.thinkingStartedAt : Date.now();
    const updateElapsed = () => {
      elapsedThinkingMs = Math.max(0, Date.now() - startedAt);
    };
    updateElapsed();
    const intervalId = window.setInterval(updateElapsed, 100);
    return () => window.clearInterval(intervalId);
  });

  onDestroy(() => {
    if (copyResetTimer) window.clearTimeout(copyResetTimer);
  });

  async function copyAssistantMessage() {
    const text = typeof msg.content === "string" ? msg.content : "";
    if (!text) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      copyState = "copied";
      if (copyResetTimer) window.clearTimeout(copyResetTimer);
      copyResetTimer = window.setTimeout(() => {
        copyState = "idle";
        copyResetTimer = null;
      }, 2200);
    } catch {
      copyState = "idle";
    }
  }
</script>

{#if msg.role === "user"}
  <div class="flex justify-end py-0.5">
    <div class="flex items-end gap-2 max-w-[78%]">
      {#if canEditMessage}
        <button
          type="button"
          onclick={oneditlastuser}
          title="Edit your last message"
          aria-label="Edit your last message"
          class="message-action message-action-icon mb-0.5 shrink-0"
        >
          <Pencil class="size-3" />
        </button>
      {/if}

      <div class="min-w-0">
        {#if messageTimestamp}
          <div class="mb-1 text-right text-[0.66rem] text-muted-foreground/55 tabular-nums">
            {messageTimestamp}
          </div>
        {/if}
        <div
          class="bg-primary text-primary-foreground px-4 py-2 text-sm leading-relaxed word-break-words whitespace-pre-wrap tracking-tight"
          style="border-radius: 18px 18px 4px 18px"
        >
          {msg.content}
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="flex flex-col gap-1.5 py-2.5 pb-3 border-b border-border last:border-b-0">
    <!-- Model label row -->
    <div class="flex items-center gap-2 flex-wrap">
      <span
        class="text-[0.65rem] font-bold uppercase tracking-wider px-1.5 py-px rounded border shrink-0"
        style:color={modelColor}
        style:border-color={"color-mix(in srgb," + modelColor + " 28%, transparent)"}
        style:background={"color-mix(in srgb," + modelColor + " 8%, transparent)"}
      >
        {modelLabel}
      </span>

      {#if showModelName && modelName}
        <span class="text-xs text-muted-foreground/30">{modelName}</span>
      {/if}

      {#if messageTimestamp}
        <span class="text-[0.66rem] text-muted-foreground/45 tabular-nums">{messageTimestamp}</span>
      {/if}

      {#if msg.stopped}
        <span
          class="inline-flex items-center gap-1 text-[0.62rem] text-amber-300/80 uppercase tracking-wider"
        >
          <span class="size-1.5 rounded-full bg-amber-300/80"></span>
          Stopped
        </span>
      {/if}

      {#if isStreaming && generationPhase === "thinking"}
        <span class="inline-flex items-center gap-1.5 text-xs text-primary/60 italic">
          <span class="size-1.5 rounded-full bg-primary animate-pulse"></span>
          Thinking…{#if numTokens}<span
              class="text-[0.62rem] tabular-nums not-italic opacity-60 ml-0.5">{numTokens} tok</span
            >{/if}
        </span>
      {:else if isStreaming && generationPhase === "preparing"}
        <span class="inline-flex items-center gap-1.5 text-xs text-muted-foreground/40 italic">
          <span class="size-1.5 rounded-full bg-muted-foreground/40 animate-pulse"></span>
          Preparing…
        </span>
      {:else if isStreaming && generationPhase === "generating"}
        <span class="inline-flex items-center gap-1.5 text-xs text-primary/50 italic">
          <span class="size-1.5 rounded-full bg-primary/50 animate-pulse"></span>
          Generating…
        </span>
      {/if}
    </div>

    <!-- Thinking -->
    {#if msg.thinking}
      <Collapsible.Root bind:open={showThinking} class="mt-0.5">
        <Collapsible.Trigger
          class={cn(
            "inline-flex items-center gap-1.5 cursor-pointer text-[0.72rem] text-primary/60 hover:text-primary/90 px-2 py-1 rounded border border-primary/15 bg-primary/5 transition-colors select-none w-full text-left",
            showThinking && "rounded-b-none"
          )}
        >
          <ChevronRight
            class={cn("size-3 shrink-0 transition-transform", showThinking && "rotate-90")}
          />
          {isActivelyThinking ? "Live reasoning" : "Internal reasoning"}
          <span class="text-[0.58rem] opacity-50 ml-0.5"
            >{String(msg.thinking).split(/\s+/).filter(Boolean).length} words</span
          >
          {#if thinkingDurationLabel}
            <span class="text-[0.58rem] opacity-50 tabular-nums">{thinkingDurationLabel}</span>
          {/if}
        </Collapsible.Trigger>
        <Collapsible.Content>
          <pre
            bind:this={thinkingContentEl}
            class="text-[0.73rem] text-muted-foreground leading-relaxed px-3 py-2 rounded rounded-t-none border border-t-0 border-primary/15 bg-primary/[0.03] border-l-2 border-l-primary/15 max-h-[280px] overflow-y-auto whitespace-pre-wrap break-words font-[inherit] m-0">{msg.thinking}</pre>
        </Collapsible.Content>
      </Collapsible.Root>
    {/if}

    <!-- Content -->
    <div class="min-h-[1.2em]">
      {#if isStreaming && !msg.content && generationPhase !== "thinking"}
        <div class="flex gap-1 py-1.5">
          <span
            class="size-1.5 rounded-full bg-muted-foreground/30 animate-[dotBounce_1.2s_ease-in-out_infinite]"
          ></span>
          <span
            class="size-1.5 rounded-full bg-muted-foreground/30 animate-[dotBounce_1.2s_ease-in-out_0.18s_infinite]"
          ></span>
          <span
            class="size-1.5 rounded-full bg-muted-foreground/30 animate-[dotBounce_1.2s_ease-in-out_0.36s_infinite]"
          ></span>
        </div>
      {:else if html}
        <div class="md-body">
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html html}{#if isStreaming}<span class="cursor">▋</span>{/if}
        </div>
      {:else if msg.content}
        <div class="md-body plain">
          {msg.content}{#if isStreaming}<span class="cursor">▋</span>{/if}
        </div>
      {:else if msg.stopped}
        <div class="text-[0.75rem] italic text-muted-foreground/55">
          Stopped before final answer.
        </div>
      {/if}
    </div>

    {#if !isStreaming && (msg.content || canRegenerate)}
      <div class="flex items-center justify-end gap-2 pt-0.5 flex-wrap ml-auto">
        {#if msg.content}
          <button
            type="button"
            onclick={copyAssistantMessage}
            class={cn(
              "message-action message-action-copy",
              copyState === "copied"
                ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-300 shadow-[0_0_0_1px_rgba(52,211,153,0.08)]"
                : "border-border/60 bg-background/35 text-muted-foreground/80 hover:text-foreground hover:bg-background/75"
            )}
          >
            {#if copyState === "copied"}
              <Check class="size-3" />
              Copied
            {:else}
              <Copy class="size-3" />
              Copy
            {/if}
          </button>
        {/if}

        {#if canRegenerate}
          <button
            type="button"
            onclick={onregenerate}
            title="Regenerate response"
            aria-label="Regenerate response"
            class="message-action message-action-icon"
          >
            <RotateCcw class="size-3" />
          </button>
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  @keyframes dotBounce {
    0%,
    80%,
    100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    40% {
      opacity: 1;
      transform: scale(1.15);
    }
  }

  .message-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    min-height: 1.7rem;
    border-radius: 0.55rem;
    border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
    background: color-mix(in srgb, var(--color-background) 38%, transparent);
    color: color-mix(in srgb, var(--color-muted-foreground) 88%, transparent);
    padding: 0 0.55rem;
    font-size: 0.68rem;
    line-height: 1;
    transition:
      background-color 140ms ease,
      color 140ms ease,
      border-color 140ms ease,
      transform 140ms ease;
  }

  .message-action:hover {
    color: var(--color-foreground);
    background: color-mix(in srgb, var(--color-background) 78%, transparent);
    border-color: color-mix(in srgb, var(--color-border) 88%, transparent);
  }

  .message-action:active {
    transform: translateY(1px);
  }

  .message-action-icon {
    width: 1.7rem;
    padding: 0;
  }

  .message-action-copy {
    padding-inline: 0.62rem;
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  /* Cursor blink */
  .cursor {
    display: inline-block;
    color: var(--color-primary);
    animation: blinkCursor 0.8s step-end infinite;
    font-size: 0.85em;
    line-height: 1;
    margin-left: 1px;
  }
  @keyframes blinkCursor {
    50% {
      opacity: 0;
    }
  }

  /* Markdown body — structural styles can't be done with Tailwind since content is @html */
  .md-body {
    font-size: 0.9rem;
    line-height: 1.65;
    color: var(--color-foreground);
    word-break: break-word;
    opacity: 0.88;
  }
  .md-body.plain {
    white-space: pre-wrap;
  }

  .md-body :global(p) {
    margin: 0 0 0.7em;
  }
  .md-body :global(p:last-child) {
    margin-bottom: 0;
  }
  .md-body :global(h1),
  .md-body :global(h2),
  .md-body :global(h3),
  .md-body :global(h4),
  .md-body :global(h5),
  .md-body :global(h6) {
    font-weight: 600;
    line-height: 1.3;
    margin: 1em 0 0.4em;
    color: var(--color-foreground);
    letter-spacing: -0.02em;
  }
  .md-body :global(h1) {
    font-size: 1.2em;
  }
  .md-body :global(h2) {
    font-size: 1.08em;
  }
  .md-body :global(h3) {
    font-size: 0.97em;
  }
  .md-body :global(h1:first-child),
  .md-body :global(h2:first-child),
  .md-body :global(h3:first-child) {
    margin-top: 0;
  }
  .md-body :global(ul),
  .md-body :global(ol) {
    margin: 0.4em 0 0.7em;
    padding-left: 1.4em;
  }
  .md-body :global(li) {
    margin: 0.2em 0;
  }
  .md-body :global(code) {
    font-family: ui-monospace, "Cascadia Code", Menlo, Consolas, monospace;
    font-size: 0.84em;
    background: var(--color-muted);
    border: 1px solid var(--color-border);
    padding: 0.1em 0.35em;
    border-radius: 4px;
  }
  .md-body :global(pre) {
    background: var(--color-muted);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 0.85rem 1rem;
    overflow-x: auto;
    margin: 0.6em 0;
  }
  .md-body :global(pre code) {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.83em;
  }
  .md-body :global(blockquote) {
    border-left: 2px solid var(--color-border);
    margin: 0.5em 0;
    padding: 0.3em 0.8em;
    color: var(--color-muted-foreground);
  }
  .md-body :global(hr) {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: 0.8em 0;
  }
  .md-body :global(a) {
    color: var(--color-primary);
    text-decoration: none;
    opacity: 0.9;
  }
  .md-body :global(a:hover) {
    text-decoration: underline;
    opacity: 1;
  }
  .md-body :global(strong) {
    font-weight: 600;
    color: var(--color-foreground);
    opacity: 1;
  }
  .md-body :global(table) {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.85em;
    margin: 0.6em 0;
  }
  .md-body :global(th),
  .md-body :global(td) {
    border: 1px solid var(--color-border);
    padding: 0.35em 0.65em;
    text-align: left;
  }
  .md-body :global(th) {
    background: var(--color-muted);
    font-weight: 600;
    color: var(--color-foreground);
  }
</style>
