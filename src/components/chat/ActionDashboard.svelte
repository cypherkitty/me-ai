<script>
  import { actionColor } from "../../lib/triage.js";
  import { getActionsForEvent, getGroupForEventType } from "../../lib/events.js";
  import PipelineGraph from "../actions/PipelineGraph.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  let {
    pendingData = null,
    onmarkacted,
    ondismiss,
    onremove,
    oncleargroup,
    onaskai,
  } = $props();

  let activeGroup = $state(null);
  let confirmClear = $state(null);
  let activePipeline = $state([]);
  let activeTier = $state(null);

  export function toggleGroup(action) {
    activeGroup = activeGroup === action ? null : action;
    confirmClear = null;
  }

  $effect(() => {
    if (activeGroup) {
      getActionsForEvent(activeGroup).then(actions => activePipeline = actions);
      getGroupForEventType(activeGroup).then(grp => activeTier = grp);
    } else {
      activePipeline = [];
      activeTier = null;
    }
  });

  function fmt(str) {
    return str.split("_").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
  }

  function shortDate(ts) {
    if (!ts) return "";
    try { return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
    catch { return ""; }
  }

  function shortSender(from) {
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

    <!-- Group chips -->
    <div class="flex flex-wrap gap-1">
      {#each pendingData.order as action (action)}
        {@const items = pendingData.groups[action]}
        {@const color = actionColor(action)}
        {@const isActive = activeGroup === action}
        <button
          onclick={() => toggleGroup(action)}
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
          <span class={cn("text-[0.58rem] font-bold min-w-[14px] text-center", isActive ? "opacity-70" : "opacity-50")}>
            {items.length}
          </span>
        </button>
      {/each}
    </div>

    <!-- Drilled-in group detail -->
    {#if activeGroup && pendingData.groups[activeGroup]}
      {@const items = pendingData.groups[activeGroup]}
      {@const color = actionColor(activeGroup)}
      <div class="mt-2 pt-2 border-t border-border">
        <!-- Group header -->
        <div class="flex items-center gap-1.5 pb-2 mb-2 border-b-2" style:border-color={color}>
          <button
            onclick={() => { activeGroup = null; confirmClear = null; }}
            class="text-xs text-muted-foreground/50 hover:text-foreground transition-colors px-1 py-0.5 rounded hover:bg-accent"
          >
            ←
          </button>
          <span class="text-xs font-semibold text-foreground tracking-tight flex-1">{fmt(activeGroup)}</span>
          <span class="text-[0.6rem] text-muted-foreground/40">{items.length}</span>
        </div>

        <!-- Pipeline preview -->
        <div class="mb-2 bg-background p-1 px-2 rounded border border-border">
          <PipelineGraph eventType={activeGroup} group={activeTier} commands={activePipeline} />
        </div>

        <!-- Email rows -->
        <div class="flex flex-col">
          {#each items as item (item.emailId)}
            <div class="flex items-center gap-1.5 py-1 border-b border-border last:border-b-0 group/row">
              <button
                onclick={() => onaskai?.(`Tell me about the email "${item.subject}" from ${item.from}`)}
                class="flex-1 min-w-0 flex flex-col gap-px text-left"
                title="Ask AI about this email"
              >
                <span class="text-[0.7rem] font-medium text-foreground/80 truncate group-hover/row:text-foreground transition-colors tracking-tight">
                  {item.subject}
                </span>
                <span class="flex gap-1.5 text-[0.58rem] text-muted-foreground/35">
                  <span>{shortSender(item.from)}</span>
                  {#if item.date}<span class="opacity-70">{shortDate(item.date)}</span>{/if}
                </span>
              </button>
              <div class="flex gap-0.5 opacity-30 group-hover/row:opacity-100 transition-opacity">
                <button
                  onclick={() => onmarkacted?.(item.emailId)}
                  title="Handled"
                  class="size-5 flex items-center justify-center text-[0.64rem] font-bold rounded transition-all hover:bg-success/12 hover:text-success text-muted-foreground"
                >✓</button>
                <button
                  onclick={() => ondismiss?.(item.emailId)}
                  title="Dismiss"
                  class="size-5 flex items-center justify-center text-[0.64rem] font-bold rounded transition-all hover:bg-destructive/12 hover:text-destructive text-muted-foreground"
                >✕</button>
              </div>
            </div>
          {/each}
        </div>

        <!-- Batch actions -->
        <div class="flex items-center justify-end gap-1.5 pt-2 mt-1 border-t border-border">
          {#if confirmClear !== activeGroup}
            <button
              onclick={() => items.forEach(i => onmarkacted?.(i.emailId))}
              class="text-[0.6rem] font-medium text-muted-foreground/60 hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-all"
            >All handled</button>
            <button
              onclick={() => confirmClear = activeGroup}
              class="text-[0.6rem] font-medium text-muted-foreground/40 hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-all"
            >Clear group</button>
          {:else}
            <span class="text-[0.6rem] text-muted-foreground/40 mr-auto">Remove {items.length}?</span>
            <button
              onclick={() => confirmClear = null}
              class="text-[0.6rem] text-muted-foreground/60 hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-all"
            >Cancel</button>
            <button
              onclick={() => { oncleargroup?.(activeGroup); confirmClear = null; activeGroup = null; }}
              class="text-[0.6rem] text-destructive/70 hover:text-destructive hover:bg-destructive/8 px-1.5 py-0.5 rounded transition-all"
            >Delete</button>
          {/if}
        </div>
      </div>
    {/if}
  </div>
{/if}
