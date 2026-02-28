<script>
  import { Handle, Position } from '@xyflow/svelte';
  import { EVENT_GROUPS } from '../../../lib/events.js';

  let { data } = $props();
  let groupInfo = $derived(EVENT_GROUPS[data.group] || EVENT_GROUPS.INFO);
</script>

<div
  class="bg-card border-2 rounded-xl w-[150px] text-foreground flex flex-col"
  style:border-color={groupInfo.color}
>
  <div
    class="px-2 py-1 text-[10px] font-bold rounded-t-xl text-background flex items-center gap-1"
    style:background={groupInfo.color}
  >
    <span>⚡</span> Trigger
  </div>
  <div class="p-2 flex flex-col gap-[3px]">
    <div class="text-xs font-bold">Event: {data.label}</div>
    <div class="text-[9px] uppercase font-bold opacity-80" style:color={groupInfo.color}>
      {groupInfo.label}
    </div>
  </div>
  <Handle type="source" position={Position.Right} />
</div>
