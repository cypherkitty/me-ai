<script>
  import { Handle, Position } from '@xyflow/svelte';
  let { data } = $props();
</script>

<button
  class="size-10 rounded-full bg-card border-2 border-dashed border-border text-muted-foreground flex items-center justify-center cursor-pointer transition-all p-0 hover:border-foreground/40 hover:text-foreground hover:bg-secondary"
  onclick={data.onClick}
  title="Add next action"
>
  <Handle type="target" position={Position.Left} style="opacity: 0" />
  <span class="text-xl leading-none -mt-0.5">+</span>
</button>
