<script>
  import { Handle, Position } from "@xyflow/svelte";
  import { Edit2, Trash2 } from "lucide-svelte";

  let { data } = $props();
  let cmd = $derived(data.cmd);
</script>

<div
  class="bg-card border border-border rounded-xl w-[280px] text-foreground transition-all duration-200 shadow-sm flex flex-col relative group"
  class:hover:border-primary={!data.onClick}
  class:cursor-pointer={!!data.onClick}
  class:border-dashed={!!data.onClick}
  class:hover:border-muted-foreground={!!data.onClick}
  class:opacity-80={!!data.onClick}
>
  <Handle
    type="target"
    position={Position.Left}
    class="w-3 h-3 bg-background border-2 border-primary left-[-6px]"
  />

  {#if data.onClick}
    <button
      class="w-full h-full p-4 flex items-center justify-center gap-3 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
      onclick={data.onClick}
    >
      <div
        class="size-8 rounded-full bg-secondary flex items-center justify-center border border-border/50 shadow-sm text-lg"
      >
        +
      </div>
      Add Next Action
    </button>
  {:else}
    <div
      class="p-3 pb-2 border-b border-border/50 flex items-center justify-between bg-card rounded-t-xl"
    >
      <div class="flex items-center gap-2.5">
        <div
          class="size-6 rounded bg-secondary flex items-center justify-center text-foreground text-sm shrink-0 shadow-sm border border-border/50"
        >
          {cmd.icon || "⚙️"}
        </div>
        <div class="flex flex-col">
          <span
            class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
          >
            {cmd.pluginId ? cmd.pluginId.toUpperCase() : "ACTION"}
          </span>
        </div>
      </div>

      <!-- Actions menu visible on hover -->
      <div
        class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          onclick={data.onEdit}
          title="Edit"
          class="text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-1 rounded hover:bg-primary/10"
        >
          <Edit2 class="size-3.5" />
        </button>
        <button
          onclick={data.onDelete}
          title="Delete"
          class="text-muted-foreground hover:text-destructive transition-colors bg-transparent border-none cursor-pointer p-1 rounded hover:bg-destructive/10"
        >
          <Trash2 class="size-3.5" />
        </button>
      </div>
    </div>

    <div
      class="p-3.5 pt-2.5 flex flex-col gap-1.5 relative z-[1000] flow-nodrag bg-background rounded-b-xl"
    >
      <div
        class="font-semibold text-sm text-foreground flex items-baseline gap-2"
      >
        <span class="text-muted-foreground text-xs font-mono"
          >{data.index ?? "•"}.</span
        >
        <span class="truncate" title={cmd.name}>{cmd.name}</span>
      </div>

      {#if cmd.description}
        <div
          class="text-[11px] text-muted-foreground leading-snug line-clamp-2 pl-5"
          title={cmd.description}
        >
          {cmd.description}
        </div>
      {/if}

      {#if !cmd.pluginId || !cmd.commandId}
        <div
          class="mt-1 ml-5 text-[9px] font-bold text-warning bg-warning/10 px-1.5 py-0.5 rounded-[4px] self-start uppercase tracking-wider"
        >
          Needs Configuration
        </div>
      {/if}
    </div>
  {/if}

  <Handle
    type="source"
    position={Position.Right}
    class="w-3 h-3 bg-background border-2 border-primary right-[-6px]"
  />
</div>
