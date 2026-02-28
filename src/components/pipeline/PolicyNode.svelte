<script>
  import { Handle, Position } from '@xyflow/svelte';
  import { Zap } from 'lucide-svelte';
  let { data } = $props();
</script>

<Handle type="target" position={Position.Left} />

<div
  class="flex items-center gap-2.5 bg-node-policy rounded px-3 py-2 w-[155px] cursor-pointer hover:brightness-125 transition-all border border-white/8"
>
  <div class="size-6 rounded bg-white/8 flex items-center justify-center shrink-0">
    <Zap class="size-3 text-node-foreground" />
  </div>
  <div class="min-w-0 flex-1">
    <p class="text-[0.6rem] font-bold uppercase tracking-wider text-node-foreground/50 leading-none mb-0.5">mode</p>
    <p class="text-xs font-medium text-node-foreground tracking-tight">{data.label}</p>
  </div>
</div>
