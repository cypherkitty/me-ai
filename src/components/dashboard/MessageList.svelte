<script>
  import { onMount } from "svelte";
  import { formatDate, extractName, initial } from "../../lib/email-utils.js";
  import { mountLog } from "../../lib/debug.js";

  let { messages = [], onselect } = $props();

  onMount(() => mountLog("MessageList"));
</script>

<div class="flex flex-col rounded border border-border overflow-hidden">
  {#each messages as msg}
    <button
      onclick={() => onselect(msg)}
      class="flex gap-3 px-4 py-3.5 bg-card border-b border-border last:border-b-0 text-left hover:bg-accent transition-colors w-full"
    >
      <div class="size-[34px] rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold shrink-0">
        {initial(msg.from)}
      </div>
      <div class="flex-1 min-w-0 flex flex-col gap-0.5">
        <div class="flex items-baseline justify-between gap-2">
          <span class="text-[0.84rem] font-semibold text-foreground truncate">{extractName(msg.from)}</span>
          <span class="text-[0.68rem] text-muted-foreground/40 whitespace-nowrap shrink-0">{formatDate(msg.date)}</span>
        </div>
        <div class="text-[0.8rem] text-foreground/70 truncate">{msg.subject}</div>
        <div class="text-[0.73rem] text-muted-foreground/50 truncate">{msg.snippet}</div>
      </div>
    </button>
  {/each}
</div>
