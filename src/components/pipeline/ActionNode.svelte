<script>
  import { Handle, Position } from '@xyflow/svelte';
  import { Play } from 'lucide-svelte';
  let { data } = $props();
</script>

<Handle
  type="target"
  position={Position.Left}
  style="background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.08); width:8px; height:8px; left:-4px;"
/>

<div
  class="flex items-center gap-2.5 bg-node-action rounded px-3 py-2 w-[175px] cursor-pointer hover:brightness-110 transition-all border border-white/8"
>
  <div class="size-6 rounded bg-white/8 flex items-center justify-center shrink-0">
    <Play class="size-3 text-node-foreground" fill="currentColor" />
  </div>
  <div class="min-w-0 flex-1">
    <p class="text-[0.6rem] font-bold uppercase tracking-wider text-node-foreground/50 leading-none mb-0.5">action</p>
    <p class="text-xs font-medium text-node-foreground truncate tracking-tight">{data.label}</p>
  </div>
</div>

<Handle
  type="source"
  position={Position.Right}
  style="background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.08); width:8px; height:8px; right:-4px;"
/>
