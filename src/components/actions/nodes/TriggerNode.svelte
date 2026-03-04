<script>
  import { Handle, Position } from "@xyflow/svelte";
  import { ChevronDown, Trash2 } from "lucide-svelte";

  let { data } = $props();
</script>

<div
  class="bg-card border border-border rounded-xl w-[280px] text-foreground flex flex-col shadow-sm transition-all duration-200"
  class:hover:border-primary={data.triggerType !== "add"}
  class:cursor-pointer={data.triggerType === "add"}
  class:border-dashed={data.triggerType === "add"}
  class:hover:border-muted-foreground={data.triggerType === "add"}
>
  {#if data.triggerType === "add"}
    <!-- Add Button Mode -->
    <button
      class="w-full h-full p-4 flex items-center justify-center gap-3 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
      onclick={data.onClick}
    >
      <div
        class="size-8 rounded-full bg-secondary flex items-center justify-center border border-border/50 shadow-sm text-lg"
      >
        +
      </div>
      Add Trigger Condition
    </button>
  {:else}
    <!-- Content Mode -->
    <div
      class="p-3 pb-2 border-b border-border/50 flex items-center justify-between bg-card rounded-t-xl"
    >
      <div class="flex items-center gap-2.5">
        <div
          class="size-6 rounded bg-primary/10 flex items-center justify-center text-primary text-xs shrink-0 shadow-sm border border-primary/20"
        >
          ⚡
        </div>
        <span
          class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
          >Event Trigger</span
        >
      </div>
      {#if data.isEditable}
        <button
          class="text-muted-foreground hover:text-destructive transition-colors bg-transparent border-none cursor-pointer p-1 rounded hover:bg-destructive/10"
          onclick={data.onDelete}
          title="Remove trigger"
        >
          <Trash2 class="size-3.5" />
        </button>
      {/if}
    </div>

    <div
      class="p-3.5 pt-2.5 flex flex-col gap-2 relative z-[1000] flow-nodrag bg-background rounded-b-xl"
    >
      <div
        class="font-semibold text-sm text-foreground flex items-baseline gap-2"
      >
        <span class="text-muted-foreground text-xs font-mono"
          >{data.index ?? "1"}.</span
        >
        <span class="truncate" title={data.label}
          >{data.label || "(Configuring...)"}</span
        >
      </div>

      {#if data.isEditable}
        <div class="flex flex-col gap-2 w-full mt-2">
          <div class="space-y-1 w-full">
            <select
              class="text-xs font-semibold bg-secondary border border-border rounded-md px-2 py-1.5 text-foreground cursor-pointer outline-none w-full hover:border-border/80 focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20"
              value={data.triggerData.name}
              onchange={(e) =>
                data.onChange({ type: "event_type", name: e.target.value })}
            >
              <option value="">(Select Event Condition)</option>
              {#each data.eventTypes || [] as et}
                <option value={et}
                  >{et
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}</option
                >
              {/each}
            </select>
          </div>
        </div>
      {/if}
    </div>
    <Handle
      type="source"
      position={Position.Right}
      class="w-3 h-3 bg-background border-2 border-primary right-[-6px]"
    />
  {/if}
</div>
