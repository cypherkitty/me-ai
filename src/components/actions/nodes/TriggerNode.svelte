<script>
  import { Handle, Position } from "@xyflow/svelte";
  import { ChevronDown, Trash2 } from "lucide-svelte";

  let { data } = $props();
</script>

<div
  class="bg-card border border-border border-l-4 rounded-xl w-[200px] text-foreground flex flex-col shadow-sm transition-[border-color] duration-200"
  class:border-l-primary={data.triggerType !== "add"}
  class:border-l-muted={data.triggerType === "add"}
  class:cursor-pointer={data.triggerType === "add"}
>
  {#if data.triggerType === "add"}
    <!-- Add Button Mode -->
    <button
      class="w-full h-full p-4 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-all"
      onclick={data.onClick}
    >
      {data.label}
    </button>
  {:else}
    <!-- Content Mode -->
    <div
      class="px-3 py-2 text-[10px] font-bold rounded-t-xl bg-secondary border-b border-border flex items-center justify-between"
    >
      <div
        class="flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground"
      >
        <span>⚡</span> Condition
      </div>
      {#if data.isEditable}
        <button
          class="text-muted-foreground hover:text-destructive transition-colors bg-transparent border-none cursor-pointer p-0.5"
          onclick={data.onDelete}
          title="Remove trigger"
        >
          <Trash2 class="size-3" />
        </button>
      {/if}
    </div>

    <div
      class="p-3 flex flex-col gap-2 bg-background rounded-b-xl relative z-[1000] flow-nodrag"
    >
      {#if data.isEditable}
        <div class="flex flex-col gap-1.5 w-full">
          <select
            class="text-[10px] bg-black/60 border border-border rounded px-1.5 py-1 text-foreground cursor-pointer outline-none w-full"
            value={data.triggerData.type}
            onchange={(e) =>
              data.onChange({
                ...data.triggerData,
                type: e.target.value,
                name: "",
              })}
          >
            <option value="event_type">EVENT TYPE</option>
            <option value="event_category">CATEGORY</option>
          </select>

          <select
            class="text-[11px] font-bold bg-black/60 border border-border rounded px-1.5 py-1 text-foreground cursor-pointer outline-none w-full"
            value={data.triggerData.name}
            onchange={(e) =>
              data.onChange({ ...data.triggerData, name: e.target.value })}
          >
            <option value="">(Any)</option>
            {#if data.triggerData.type === "event_type"}
              {#each data.eventTypes || [] as et}
                <option value={et}
                  >{et
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}</option
                >
              {/each}
            {:else}
              {#each data.eventCats || [] as ec}
                <option value={ec.name}>{ec.label}</option>
              {/each}
            {/if}
          </select>
        </div>
      {:else}
        <div
          class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold"
        >
          {data.triggerType === "event_type" ? "EVENT TYPE" : "CATEGORY"}
        </div>
        <div
          class="text-[12px] font-bold text-primary truncate"
          title={data.label}
        >
          {data.label}
        </div>
      {/if}
    </div>
    <Handle
      type="source"
      position={Position.Right}
      class="w-3 h-3 bg-border border-2 border-background"
    />
  {/if}
</div>
