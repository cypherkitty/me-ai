<script>
  import { Handle, Position } from '@xyflow/svelte';
  
  let { data } = $props();
  let cmd = $derived(data.cmd);
</script>

<div class="action-node">
  <Handle type="target" position={Position.Left} />
  
  <div class="action-header">
    <span class="icon">{cmd.icon || '⚙️'}</span> {cmd.name}
  </div>
  <div class="action-body">
    <div class="desc" title={cmd.description}>{cmd.description}</div>
    {#if cmd.pluginId && cmd.commandId}
      <div class="binding">{cmd.pluginId}·{cmd.commandId}</div>
    {:else}
      <div class="binding unbound">unbound</div>
    {/if}
  </div>
  <div class="action-footer">
    <button onclick={data.onEdit} title="Edit">✏️ Edit</button>
    <button onclick={data.onDelete} title="Delete" class="danger">🗑️</button>
  </div>
  
  <Handle type="source" position={Position.Right} />
</div>

<style>
  .action-node {
    background: #1e1e1e;
    border: 1px solid #444;
    border-radius: 8px;
    width: 200px;
    font-family: sans-serif;
    color: #eee;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    transition: border-color 0.2s;
  }
  .action-node:hover {
    border-color: #3b82f6;
  }
  .action-header {
    background: #2a2a2a;
    padding: 6px 10px;
    font-size: 13px;
    font-weight: 600;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
    display: flex;
    align-items: center;
    gap: 6px;
    border-bottom: 1px solid #333;
  }
  .icon { font-size: 14px; }
  .action-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .desc {
    font-size: 11px;
    color: #aaa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .binding {
    font-size: 10px;
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
  .action-footer {
    padding: 6px 10px;
    display: flex;
    justify-content: space-between;
    gap: 4px;
    border-top: 1px solid #333;
    background: #161616;
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
  }
  .action-footer button {
    background: none;
    border: 1px solid transparent;
    border-radius: 4px;
    color: #888;
    cursor: pointer;
    font-size: 11px;
    padding: 2px 6px;
    transition: all 0.2s;
  }
  .action-footer button:hover {
    color: #ccc;
    background: #2a2a2a;
    border-color: #444;
  }
  .action-footer button.danger:hover {
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.4);
    background: rgba(239, 68, 68, 0.1);
  }
</style>