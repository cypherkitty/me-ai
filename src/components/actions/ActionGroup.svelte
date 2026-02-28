<script>
  import EmailRow from "./EmailRow.svelte";
  import { cn } from "$lib/utils.js";
  import { ChevronDown } from "lucide-svelte";

  let {
    action, color = "#888", count = 0, items = [], expanded = false,
    ontoggle, onexecute, onmarkacted, ondismiss, onremove, oncleargroup,
  } = $props();

  let pendingItems = $derived(items.filter((i) => i.status === "pending"));
  let actedItems = $derived(items.filter((i) => i.status !== "pending"));
  let showClearConfirm = $state(false);

  function formatLabel(str) {
    return str
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  }
</script>

<div class="rounded border border-border bg-card overflow-hidden">
  <!-- Group header toggle -->
  <button
    onclick={ontoggle}
    class="flex items-center gap-2.5 w-full px-4 py-2.5 text-left hover:bg-accent/30 transition-colors"
  >
    <span
      class="text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0"
      style:background={color}
    >
      {formatLabel(action)}
    </span>
    <span class="text-sm font-semibold tabular-nums text-foreground">{pendingItems.length}</span>
    {#if actedItems.length > 0}
      <span class="text-xs text-muted-foreground/40">{actedItems.length} handled</span>
    {/if}
    <span class="flex-1"></span>
    <ChevronDown class={cn("size-3.5 text-muted-foreground/40 transition-transform", expanded && "rotate-180")} />
  </button>

  {#if expanded}
    <div class="border-t border-border/40">
      {#if pendingItems.length === 0 && actedItems.length === 0}
        <p class="text-xs text-muted-foreground/40 text-center py-6">No emails in this category.</p>
      {/if}

      {#each pendingItems as item (item.emailId)}
        <EmailRow {item} actionColor={color} {onexecute} {onmarkacted} {ondismiss} {onremove} />
      {/each}

      {#if actedItems.length > 0}
        <details class="border-t border-border/40">
          <summary class="px-4 py-2 text-xs text-muted-foreground/40 cursor-pointer hover:text-muted-foreground select-none transition-colors">
            {actedItems.length} handled
          </summary>
          {#each actedItems as item (item.emailId)}
            <EmailRow {item} actionColor={color} {onremove} dimmed />
          {/each}
        </details>
      {/if}

      <div class="flex justify-end px-4 py-2 border-t border-border/40">
        {#if !showClearConfirm}
          <button
            onclick={() => showClearConfirm = true}
            class="text-xs text-muted-foreground/40 hover:text-muted-foreground underline transition-colors"
          >
            Clear group
          </button>
        {:else}
          <div class="flex items-center gap-2 text-xs text-muted-foreground/60">
            <span>Clear {items.length} items?</span>
            <button onclick={() => showClearConfirm = false} class="hover:text-foreground transition-colors">Cancel</button>
            <button
              onclick={() => { oncleargroup(); showClearConfirm = false; }}
              class="text-destructive hover:text-destructive/80 transition-colors"
            >Delete</button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
