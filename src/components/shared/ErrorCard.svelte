<script>
  import { onMount } from "svelte";
  import { parseError } from "../../lib/error-parser.js";
  import { mountLog } from "../../lib/debug.js";
  import { Button } from "$lib/components/ui/button/index.js";

  let { error, ondismiss = null, onsignout = null } = $props();

  let parsed = $derived(parseError(error));

  onMount(() => mountLog("ErrorCard"));
</script>

<div class="flex flex-col gap-1.5 mb-5 px-4 py-3.5 rounded border-l-4 border border-destructive/20 border-l-destructive bg-destructive/5">
  {#if ondismiss}
    <div class="flex items-center justify-between gap-2">
      <span class="text-sm font-bold text-destructive">{parsed.title}</span>
      <button
        onclick={ondismiss}
        class="text-muted-foreground/40 hover:text-destructive transition-colors text-base leading-none"
        aria-label="Dismiss"
      >✕</button>
    </div>
  {:else}
    <span class="text-sm font-bold text-destructive">{parsed.title}</span>
  {/if}

  <p class="text-[0.8rem] text-foreground/75 leading-relaxed">{parsed.description}</p>

  {#if parsed.fix}
    <p class="text-[0.78rem] text-success leading-relaxed">{parsed.fix}</p>
  {/if}

  {#if parsed.link}
    <a
      href={parsed.link.url}
      target="_blank"
      rel="noopener"
      class="text-[0.8rem] font-medium text-primary hover:underline"
    >{parsed.link.label} →</a>
  {/if}

  {#if parsed.action === "signout" && onsignout}
    <Button
      variant="outline"
      size="sm"
      onclick={onsignout}
      class="mt-1 self-start text-destructive border-destructive/30 hover:bg-destructive/8"
    >Sign Out & Retry</Button>
  {/if}
</div>
