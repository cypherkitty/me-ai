<script>
  import { Handle, Position } from '@xyflow/svelte';
  import { Tag, AlertCircle } from 'lucide-svelte';
  let { data } = $props();
</script>

<div
  class="flex items-center gap-2.5 bg-node-trigger rounded px-3 py-2 w-[175px] cursor-pointer hover:brightness-110 transition-all border border-white/8"
>
  <div class="size-6 rounded bg-white/8 flex items-center justify-center shrink-0">
    {#if data.triggerType === 'event_type'}
      <Tag class="size-3 text-node-foreground" />
    {:else}
      <AlertCircle class="size-3 text-node-foreground" />
    {/if}
  </div>
  <div class="min-w-0 flex-1">
    <p class="text-[0.6rem] font-bold uppercase tracking-wider text-node-foreground/50 leading-none mb-0.5">
      {data.triggerType === 'event_type' ? 'event type' : 'category'}
    </p>
    <p class="text-xs font-medium text-node-foreground truncate tracking-tight">{data.label || 'any'}</p>
  </div>
</div>

<Handle type="source" position={Position.Right} />
