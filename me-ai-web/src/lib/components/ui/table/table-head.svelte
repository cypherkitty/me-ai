<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils.js";

  interface Props {
    ref?: HTMLTableCellElement | null;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }
  let {
    ref = $bindable(null),
    class: className = undefined,
    children = undefined,
    ...restProps
  }: Props = $props();
</script>

<th
  bind:this={ref}
  data-slot="table-head"
  class={cn(
    "text-foreground h-10 bg-clip-padding px-2 text-start align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pe-0",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</th>
