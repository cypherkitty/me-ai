<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils.js";

  interface Props {
    ref?: HTMLTableSectionElement | null;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }
  let { ref = $bindable(null), class: className, children, ...restProps }: Props = $props();
</script>

<tfoot
  bind:this={ref}
  data-slot="table-footer"
  class={cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className)}
  {...restProps}
>
  {@render children?.()}
</tfoot>
