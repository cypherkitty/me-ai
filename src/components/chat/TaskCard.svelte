<script>
  /**
   * Perplexity-style task card with nested expandable steps.
   */

  import { cn } from "$lib/utils.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

  let { msg } = $props();

  const MODEL_LABELS = {
    webgpu: "WebGPU", ollama: "Ollama", openai: "GPT",
    anthropic: "Claude", google: "Gemini", xai: "Grok",
  };
  const MODEL_COLORS = {
    webgpu: "#4ade80", ollama: "#a78bfa", openai: "#10b981",
    anthropic: "#f59e0b", google: "#3b82f6", xai: "#e2e2e2",
  };
  const GROUP_COLORS = {
    NOISE:   { bg: "color-mix(in srgb, #9ca3af 10%, transparent)", text: "#9ca3af", border: "color-mix(in srgb, #9ca3af 20%, transparent)" },
    INFO:    { bg: "color-mix(in srgb, #60a5fa 10%, transparent)", text: "#60a5fa", border: "color-mix(in srgb, #60a5fa 20%, transparent)" },
    COMMAND: { bg: "color-mix(in srgb, #fbbf24 10%, transparent)", text: "#fbbf24", border: "color-mix(in srgb, #fbbf24 20%, transparent)" },
  };

  let cardOpen = $state(true);
  let expandedSteps = $state(new Set());

  function toggleCard() { cardOpen = !cardOpen; }
  function toggleStep(id) {
    const next = new Set(expandedSteps);
    if (next.has(id)) next.delete(id); else next.add(id);
    expandedSteps = next;
  }

  let modelLabel = $derived(msg.model ? (MODEL_LABELS[msg.model] ?? msg.model) : null);
  let modelColor = $derived(msg.model ? (MODEL_COLORS[msg.model] ?? "#888") : "#888");

  function elapsed(ts) {
    if (!ts) return "";
    const secs = Math.round((Date.now() - ts) / 1000);
    return secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}m ${secs % 60}s`;
  }

  function groupStyle(group) {
    return GROUP_COLORS[group] ?? {
      bg: "color-mix(in srgb, white 4%, transparent)",
      text: "var(--color-muted-foreground)",
      border: "color-mix(in srgb, white 8%, transparent)"
    };
  }

  function stepTextClass(status) {
    return {
      running: "text-foreground/70",
      done:    "text-muted-foreground/40",
      error:   "text-destructive",
      pending: "text-muted-foreground/25",
    }[status] ?? "text-muted-foreground/40";
  }

  function stepIconClass(status) {
    return {
      running: "text-primary",
      done:    "text-success",
      error:   "text-destructive",
      pending: "text-muted-foreground/25",
    }[status] ?? "text-muted-foreground/25";
  }
</script>

<div class={cn(
  "w-full max-w-[680px] rounded border overflow-hidden text-[0.82rem] bg-card transition-colors self-start",
  msg.status === "done"  ? "border-success/15" :
  msg.status === "error" ? "border-destructive/15" : "border-border"
)}>
  <!-- Header -->
  <button
    onclick={toggleCard}
    class="w-full flex items-center gap-2 px-3.5 py-2.5 bg-transparent hover:bg-accent transition-colors text-left"
  >
    <!-- Status icon -->
    <span class={cn(
      "size-[22px] flex items-center justify-center rounded shrink-0",
      "bg-foreground/4 border border-foreground/6",
      msg.status === "running" && "text-primary animate-pulse"
    )}>
      {#if msg.status === "running"}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        </svg>
      {:else if msg.status === "done"}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-success"><polyline points="20 6 9 17 4 12"/></svg>
      {:else}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-destructive">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      {/if}
    </span>

    <span class="flex-1 text-[0.82rem] font-medium text-foreground/85 truncate tracking-tight">{msg.title}</span>

    {#if modelLabel}
      <span
        class="inline-flex items-center gap-1 text-[0.64rem] font-semibold px-1.5 py-px rounded border shrink-0"
        style:color={modelColor}
        style:border-color={"color-mix(in srgb," + modelColor + " 22%, transparent)"}
        style:background={"color-mix(in srgb," + modelColor + " 7%, transparent)"}
      >
        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
        </svg>
        {modelLabel}
      </span>
    {/if}

    <svg
      class={cn("size-3 text-muted-foreground/30 shrink-0 transition-transform", cardOpen && "rotate-180")}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </button>

  {#if cardOpen}
    {#if msg.description}
      <div class="px-3.5 py-2.5 text-[0.8rem] text-muted-foreground leading-relaxed border-t border-border whitespace-pre-wrap">
        {msg.description}
      </div>
    {/if}

    {#if msg.steps?.length > 0}
      <ScrollArea class="border-t border-border h-[min(320px,50vh)]">
        <div class="pr-2">
        {#each msg.steps as step (step.id)}
          {@const isExpanded = expandedSteps.has(step.id)}
          {@const hasBody = step.expandable && (step.subContent || step.thumbnail || step.badges?.length)}

          <div class="border-b border-border last:border-b-0">
            <!-- Step row -->
            {#snippet stepRow()}
              <!-- Icon -->
              <span class={cn("size-4 flex items-center justify-center shrink-0", stepIconClass(step.status))}>
                {#if step.status === "running"}
                  <span class="size-2.5 rounded-full border border-border border-t-primary animate-spin"></span>
                {:else if step.status === "done"}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                {:else if step.status === "error"}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                {:else}
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg>
                {/if}
              </span>

              <span class={cn("flex-1 min-w-0 truncate text-[0.78rem]", stepTextClass(step.status))}>
                {step.label}
              </span>

              {#if step.badges?.length}
                <span class="flex gap-1 shrink-0">
                  {#each step.badges as badge}
                    {@const gs = groupStyle(badge)}
                    <span
                      class="text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-px rounded border"
                      style:background={gs.bg}
                      style:color={gs.text}
                      style:border-color={gs.border}
                    >{badge}</span>
                  {/each}
                </span>
              {/if}

              {#if step.detail || (step.startedAt && step.status === "running")}
                <span class={cn("text-[0.68rem] tabular-nums shrink-0", stepTextClass(step.status))}>
                  {#if step.detail}{step.detail}{/if}
                  {#if step.startedAt && step.status === "running"} · {elapsed(step.startedAt)}{/if}
                </span>
              {/if}

              {#if hasBody}
                <svg
                  class={cn("size-2.5 text-muted-foreground/30 shrink-0 transition-transform", isExpanded && "rotate-180")}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              {/if}
            {/snippet}

            {#if hasBody}
              <button
                onclick={() => toggleStep(step.id)}
                class="flex items-center gap-2 w-full px-3.5 py-2 text-left hover:bg-accent transition-colors"
              >
                {@render stepRow()}
              </button>
            {:else}
              <div class="flex items-center gap-2 px-3.5 py-2">
                {@render stepRow()}
              </div>
            {/if}

            <!-- Expandable body -->
            {#if hasBody && isExpanded}
              <div class="px-3.5 pb-2.5 pt-1 pl-9 border-t border-border bg-foreground/[0.01] flex flex-col gap-2">
                {#if step.thumbnail}
                  <img src={step.thumbnail} alt="screenshot" class="max-w-[260px] w-full rounded border border-border" />
                {/if}
                {#if step.badges?.length}
                  <div class="flex flex-wrap gap-1.5">
                    {#each step.badges as badge}
                      {@const gs = groupStyle(badge)}
                      <span
                        class="text-[0.63rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                        style:background={gs.bg}
                        style:color={gs.text}
                        style:border-color={gs.border}
                      >{badge}</span>
                    {/each}
                  </div>
                {/if}
                {#if step.subContent}
                  <pre class="font-[inherit] text-[0.74rem] text-muted-foreground leading-relaxed whitespace-pre-wrap break-words m-0">{step.subContent}</pre>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
        </div>
      </ScrollArea>
    {/if}
  {/if}
</div>
