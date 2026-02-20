<script>
  import { EVENT_GROUPS } from "../../lib/events.js";
  
  let { eventType, group, commands = [], onExecute, executionState = null } = $props();
  
  let grpDef = $derived(group ? EVENT_GROUPS[group] : EVENT_GROUPS.INFO);
</script>

<div class="pipeline-graph">
  <!-- Trigger Node -->
  <div class="node trigger-node" style:border-color={grpDef?.color}>
    <div class="node-header" style:background={grpDef?.color}>
      <span class="icon">⚡</span> Trigger
    </div>
    <div class="node-body">
      <div class="label">{eventType}</div>
      {#if grpDef}
        <div class="group" style:color={grpDef.color}>{grpDef.label}</div>
      {/if}
    </div>
  </div>

  {#each commands as cmd, i}
    <!-- Connector Arrow -->
    <div class="connector">
      <div class="line"></div>
      <div class="arrow">▶</div>
    </div>
    
    <!-- Action Node -->
    <div class="node action-node">
      <div class="node-header action-header">
        <span class="icon">{cmd.icon || '⚙️'}</span> {cmd.name}
      </div>
      <div class="node-body">
        <div class="desc" title={cmd.description}>{cmd.description}</div>
        {#if cmd.pluginId && cmd.commandId}
          <div class="binding">{cmd.pluginId}·{cmd.commandId}</div>
        {:else}
          <div class="binding unbound">unbound</div>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .pipeline-graph {
    display: flex;
    align-items: center;
    overflow-x: auto;
    padding: 0.5rem 0;
    gap: 0;
  }
  .pipeline-graph::-webkit-scrollbar {
    height: 6px;
  }
  .pipeline-graph::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
  }

  .node {
    flex-shrink: 0;
    background: #1e1e1e;
    border-radius: 8px;
    width: 140px;
    font-family: sans-serif;
    color: #eee;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    border: 1px solid #444;
    display: flex;
    flex-direction: column;
  }
  
  .trigger-node {
    border-width: 2px;
  }

  .node-header {
    padding: 4px 8px;
    font-size: 11px;
    font-weight: bold;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .trigger-node .node-header {
    color: #111;
  }

  .action-header {
    background: #2a2a2a;
    border-bottom: 1px solid #333;
  }

  .node-body {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .label { font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .group { font-size: 9px; text-transform: uppercase; font-weight: bold; opacity: 0.8; }
  
  .desc {
    font-size: 10px;
    color: #aaa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .binding {
    font-size: 9px;
    font-family: monospace;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    padding: 2px 4px;
    border-radius: 3px;
    align-self: flex-start;
  }
  .binding.unbound {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
  }

  .connector {
    display: flex;
    align-items: center;
    width: 30px;
    flex-shrink: 0;
    position: relative;
  }
  .line {
    height: 2px;
    background: #555;
    flex: 1;
  }
  .arrow {
    color: #555;
    font-size: 10px;
    margin-left: -4px;
  }
</style>
