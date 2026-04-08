<script lang="ts">
  import { actionColor } from "../../lib/core.js";
  import { getActionsForEvent, getCategoryForEventType } from "../../lib/core.js";
  import type { Action } from "$lib/types.js";
  import PipelineGraph from "../actions/PipelineGraph.svelte";
  import { cn } from "$lib/utils.js";

  interface DashboardItem {
    emailId?: string;
    subject?: string;
    from?: string;
    date?: number | null;
    [key: string]: unknown;
  }
  interface PendingDashboard {
    total: number;
    order: string[];
    categories: Record<string, unknown[]>;
  }
  interface Props {
    pendingData?: PendingDashboard | null;
    onmarkacted?: (id: string) => void;
    ondismiss?: (id: string) => void;
    onclearcategory?: (category: string) => void;
    onaskai?: (question: string) => void;
    onremove?: (id: string) => void;
  }
  let {
    pendingData = null,
    onmarkacted,
    ondismiss,
    onclearcategory,
    onaskai,
    onremove: _onremove,
  }: Props = $props();

  let activeCategory = $state<string | null>(null);
  let confirmClear = $state<string | null>(null);
  let activePipeline = $state<Action[]>([]);
  let activeTier = $state<string | null>(null);

  export function toggleCategory(action: string) {
    activeCategory = activeCategory === action ? null : action;
    confirmClear = null;
  }

  $effect(() => {
    if (activeCategory) {
      getActionsForEvent(activeCategory).then((actions) => (activePipeline = actions));
      getCategoryForEventType(activeCategory).then((cat) => (activeTier = cat));
    } else {
      activePipeline = [];
      activeTier = null;
    }
  });

  function asItems(raw: unknown[]): DashboardItem[] {
    return raw as DashboardItem[];
  }

  function fmt(str: string) {
    return str
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  }

  function shortDate(ts: number | null | undefined) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }

  function shortSender(from: string) {
    if (!from) return "";
    const name = from.replace(/<.*>/, "").trim();
    return name.length > 24 ? name.slice(0, 22) + "…" : name;
  }
</script>

{#if pendingData && pendingData.total > 0}
  <div class="max-w-[420px] w-full rounded border border-border bg-card px-2.5 py-2 self-start">
    <!-- Summary -->
    <p class="text-xs text-muted-foreground/60 font-medium mb-2 tracking-tight">
      {pendingData.total} item{pendingData.total !== 1 ? "s" : ""} need attention
    </p>

    <!-- Category chips -->
    <div class="flex flex-wrap gap-1">
      {#each pendingData.order as action (action)}
        {@const items = pendingData.categories[action]}
        {@const color = actionColor(action)}
        {@const isActive = activeCategory === action}
        <button
          onclick={() => toggleCategory(action)}
          class={cn(
            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[0.64rem] font-medium transition-all whitespace-nowrap",
            isActive
              ? "border-transparent text-foreground"
              : "bg-transparent border-border text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
          style={isActive
            ? `background: color-mix(in srgb, ${color} 10%, transparent); border-color: color-mix(in srgb, ${color} 40%, transparent); color: ${color}`
            : ""}
        >
          <span class="size-1.5 rounded-full shrink-0" style:background={color}></span>
          {fmt(action)}
          <span
            class={cn(
              "text-[0.58rem] font-bold min-w-[14px] text-center",
              isActive ? "opacity-70" : "opacity-50"
            )}
          >
            {items.length}
          </span>
        </button>
      {/each}
    </div>

    <!-- Drilled-in category detail -->
    {#if activeCategory && pendingData.categories[activeCategory]}
      {@const items = asItems(pendingData.categories[activeCategory])}
      {@const color = actionColor(activeCategory)}
      <div class="mt-2 pt-2 border-t border-border">
        <!-- Category header -->
        <div class="flex items-center gap-1.5 pb-2 mb-2 border-b-2" style:border-color={color}>
          <button
            onclick={() => {
              activeCategory = null;
              confirmClear = null;
            }}
            class="text-xs text-muted-foreground/50 hover:text-foreground transition-colors px-1 py-0.5 rounded hover:bg-accent"
          >
            ←
          </button>
          <span class="text-xs font-semibold text-foreground tracking-tight flex-1"
            >{fmt(activeCategory)}</span
          >
          <span class="text-[0.6rem] text-muted-foreground/40">{items.length}</span>
        </div>

        <!-- Pipeline preview -->
        <div class="mb-2 bg-background p-1 px-2 rounded border border-border">
          <PipelineGraph
            eventType={activeCategory}
            category={activeTier ?? undefined}
            commands={activePipeline as unknown as {
              commandId?: string;
              pluginId?: string;
              name?: string;
              description?: string;
              icon?: string;
              [key: string]: unknown;
            }[]}
          />
        </div>

        <!-- Email rows -->
        <div class="flex flex-col">
          {#each items as item (item.emailId)}
            <div
              class="flex items-center gap-1.5 py-1 border-b border-border last:border-b-0 group/row"
            >
              <button
                onclick={() =>
                  onaskai?.(`Tell me about the email "${item.subject}" from ${item.from}`)}
                class="flex-1 min-w-0 flex flex-col gap-px text-left"
                title="Ask AI about this email"
              >
                <span
                  class="text-[0.7rem] font-medium text-foreground/80 truncate group-hover/row:text-foreground transition-colors tracking-tight"
                >
                  {item.subject}
                </span>
                <span class="flex gap-1.5 text-[0.58rem] text-muted-foreground/35">
                  <span>{shortSender(item.from ?? "")}</span>
                  {#if item.date}<span class="opacity-70">{shortDate(item.date)}</span>{/if}
                </span>
              </button>
              <div class="flex gap-0.5 opacity-30 group-hover/row:opacity-100 transition-opacity">
                <button
                  onclick={() => onmarkacted?.(item.emailId ?? "")}
                  title="Handled"
                  class="size-5 flex items-center justify-center text-[0.64rem] font-bold rounded transition-all hover:bg-success/12 hover:text-success text-muted-foreground"
                  >✓</button
                >
                <button
                  onclick={() => ondismiss?.(item.emailId ?? "")}
                  title="Dismiss"
                  class="size-5 flex items-center justify-center text-[0.64rem] font-bold rounded transition-all hover:bg-destructive/12 hover:text-destructive text-muted-foreground"
                  >✕</button
                >
              </div>
            </div>
          {/each}
        </div>

        <!-- Batch actions -->
        <div class="flex items-center justify-end gap-1.5 pt-2 mt-1 border-t border-border">
          {#if confirmClear !== activeCategory}
            <button
              onclick={() => items.forEach((i) => onmarkacted?.(i.emailId ?? ""))}
              class="text-[0.6rem] font-medium text-muted-foreground/60 hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-all"
              >All handled</button
            >
            <button
              onclick={() => (confirmClear = activeCategory)}
              class="text-[0.6rem] font-medium text-muted-foreground/40 hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-all"
              >Clear category</button
            >
          {:else}
            <span class="text-[0.6rem] text-muted-foreground/40 mr-auto"
              >Remove {items.length}?</span
            >
            <button
              onclick={() => (confirmClear = null)}
              class="text-[0.6rem] text-muted-foreground/60 hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-all"
              >Cancel</button
            >
            <button
              onclick={() => {
                if (activeCategory) onclearcategory?.(activeCategory);
                confirmClear = null;
                activeCategory = null;
              }}
              class="text-[0.6rem] text-destructive/70 hover:text-destructive hover:bg-destructive/8 px-1.5 py-0.5 rounded transition-all"
              >Delete</button
            >
          {/if}
        </div>
      </div>
    {/if}
  </div>
{/if}
