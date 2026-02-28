<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import { Zap } from 'lucide-svelte';

  interface PolicyNodeData {
    label: string;
    isEditable?: boolean;
    onChange?: (policy: string) => void;
  }
  interface Props { data: PolicyNodeData; }
  let { data }: Props = $props();
</script>

<Handle type="target" position={Position.Left} />

<div
  class="flex flex-col bg-card rounded-xl w-[200px] border border-border shadow-sm"
>
  <div class="px-3 py-2 text-[10px] font-bold rounded-t-xl bg-secondary border-b border-border flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
    <Zap class="size-3" /> Execution Mode
  </div>
  <div class="p-3 flex flex-col gap-2 bg-background rounded-b-xl relative z-[1000] flow-nodrag">
    {#if data.isEditable}
      <select 
        class="text-[11px] font-bold bg-black/60 border border-border rounded px-1.5 py-1.5 text-foreground cursor-pointer outline-none w-full"
        value={data.label}
        onchange={(e) => data.onChange?.((e.target as HTMLSelectElement).value)}
      >
        <option value="auto">auto</option>
        <option value="supervised">supervised</option>
        <option value="manual">manual</option>
      </select>
    {:else}
      <div class="text-[12px] font-bold text-foreground truncate" title={data.label}>
        {data.label}
      </div>
    {/if}
  </div>
</div>
