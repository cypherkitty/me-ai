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
    border-radius: 8px;
    width: 180px;
    font-family: sans-serif;
    color: #eee;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  }
  .trigger-header {
    padding: 6px 10px;
    font-size: 12px;
    font-weight: bold;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    color: #111;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .trigger-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .label { font-size: 14px; font-weight: 600; }
  .group { font-size: 10px; text-transform: uppercase; font-weight: bold; opacity: 0.8; }
</style>