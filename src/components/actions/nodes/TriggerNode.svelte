<script>
  import { Handle, Position } from '@xyflow/svelte';
  import { EVENT_GROUPS } from '../../../lib/events.js';
  
  let { data } = $props();
  let groupInfo = $derived(EVENT_GROUPS[data.group] || EVENT_GROUPS.INFO);
</script>

<div class="trigger-node" style:border-color={groupInfo.color}>
  <div class="trigger-header" style:background={groupInfo.color}>
    <span class="icon">⚡</span> Trigger
  </div>
  <div class="trigger-body">
    <div class="label">Event: {data.label}</div>
    <div class="group" style:color={groupInfo.color}>{groupInfo.label}</div>
  </div>
  <Handle type="source" position={Position.Right} />
</div>

<style>
  .trigger-node {
    background: #1e1e1e;
    border: 2px solid #555;
    border-radius: 7px;
    width: 150px;
    font-family: sans-serif;
    color: #eee;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }
  .trigger-header {
    padding: 4px 8px;
    font-size: 10px;
    font-weight: bold;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    color: #111;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .trigger-body {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .label { font-size: 12px; font-weight: 700; }
  .group { font-size: 9px; text-transform: uppercase; font-weight: bold; opacity: 0.8; }
</style>