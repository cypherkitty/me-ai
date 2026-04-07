<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils.js";

  interface Props {
    ref?: HTMLElement | null;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }
  let { ref = $bindable(null), class: className, children, ...restProps }: Props = $props();
</script>

<div
  bind:this={ref}
  data-slot="select-label"
  class={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
  {...restProps}
>
  {@render children?.()}
</div>
