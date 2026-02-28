<script>
  let { command, onexecute } = $props();
</script>

<button
  onclick={() => onexecute?.(command.id)}
  class="flex items-center gap-2 w-full px-2.5 py-2 rounded border border-primary/15 bg-primary/6 hover:bg-primary/12 hover:border-primary/30 transition-all text-left"
>
  {#if command.icon}
    <span class="text-sm shrink-0">{command.icon}</span>
  {/if}
  <div class="flex flex-col gap-px min-w-0">
    <span class="text-[0.7rem] font-semibold text-foreground tracking-tight">{command.name}</span>
    <span class="text-[0.58rem] text-muted-foreground leading-snug">{command.description}</span>
  </div>
</button>

{#if command.body}
  <div class="mt-1 px-2.5 py-2 rounded border border-border bg-background">
    <pre class="m-0 text-[0.6rem] text-muted-foreground font-[ui-monospace,'Cascadia_Code',Menlo,Consolas,monospace] whitespace-pre-wrap break-words leading-relaxed">{command.body}</pre>
  </div>
{/if}
