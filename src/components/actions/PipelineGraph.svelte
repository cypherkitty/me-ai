<script>
  import { EVENT_GROUPS } from "../../lib/events.js";

  let { eventType, group, commands = [], onExecute, executionState = null } = $props();

  let grpDef = $derived(group ? EVENT_GROUPS[group] : EVENT_GROUPS.INFO);
</script>

<div class="flex items-center overflow-x-auto py-2 gap-0 scrollbar-thin">
  <!-- Trigger Node -->
  <div
    class="shrink-0 bg-card border-2 border-border rounded-xl w-[140px] text-foreground flex flex-col"
    style:border-color={grpDef?.color}
  >
    <div
      class="px-2 py-1 text-[11px] font-bold rounded-t-xl text-background flex items-center gap-1"
      style:background={grpDef?.color}
    >
      <span>⚡</span> Trigger
    </div>
    <div class="p-2 flex flex-col gap-1">
      <div class="text-xs font-semibold truncate">{eventType}</div>
      {#if grpDef}
        <div class="text-[9px] uppercase font-bold opacity-80" style:color={grpDef.color}>
          {grpDef.label}
        </div>
      {/if}
    </div>
  </div>

  {#each commands as cmd}
    <!-- Connector Arrow -->
    <div class="flex items-center w-[30px] shrink-0">
      <div class="h-0.5 bg-border flex-1"></div>
      <div class="text-border text-[10px] -ml-1">▶</div>
    </div>

    <!-- Action Node -->
    <div class="shrink-0 bg-card border border-border rounded-xl w-[140px] text-foreground flex flex-col">
      <div class="bg-secondary px-2 py-1 text-[11px] font-bold rounded-t-xl flex items-center gap-1 border-b border-border">
        <span>{cmd.icon || '⚙️'}</span>
        {cmd.name}
      </div>
      <div class="p-2 flex flex-col gap-1">
        <div class="text-[10px] text-muted-foreground truncate" title={cmd.description}>
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
    </div>
  {/each}
</div>
