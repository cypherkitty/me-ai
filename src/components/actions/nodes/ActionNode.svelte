<script>
  import { Handle, Position } from '@xyflow/svelte';

  let { data } = $props();
  let cmd = $derived(data.cmd);
</script>

<div class="bg-card border border-border rounded-xl w-[160px] text-foreground transition-[border-color] duration-200 hover:border-primary flex flex-col">
  <Handle type="target" position={Position.Left} />

  <div class="bg-secondary px-2 py-[5px] text-[11px] font-semibold rounded-t-xl flex items-center gap-[5px] border-b border-border">
    <span class="text-xs">{cmd.icon || '⚙️'}</span>
    {cmd.name}
  </div>

  <div class="p-2 flex flex-col gap-[5px]">
    <div class="text-[10px] text-muted-foreground leading-[1.45] break-words" title={cmd.description}>
      {cmd.description}
    </div>
    {#if cmd.pluginId && cmd.commandId}
      <div class="text-[9px] font-mono text-primary bg-primary/10 px-1 py-0.5 rounded-[3px] self-start">
        {cmd.pluginId}·{cmd.commandId}
      </div>
    {:else}
      <div class="text-[9px] font-mono text-warning bg-warning/10 px-1 py-0.5 rounded-[3px] self-start">
        unbound
      </div>
    {/if}
  </div>

  <div class="px-2 py-1 flex justify-between gap-1 border-t border-border bg-background rounded-b-xl">
    <button
      onclick={data.onEdit}
      title="Edit"
      class="bg-transparent border border-transparent rounded text-muted-foreground cursor-pointer text-[10px] px-[5px] py-0.5 transition-all hover:text-foreground hover:bg-secondary hover:border-border"
    >✏️ Edit</button>
    <button
      onclick={data.onDelete}
      title="Delete"
      class="bg-transparent border border-transparent rounded text-muted-foreground cursor-pointer text-[10px] px-[5px] py-0.5 transition-all hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10"
    >🗑️</button>
  </div>

  <Handle type="source" position={Position.Right} />
</div>
