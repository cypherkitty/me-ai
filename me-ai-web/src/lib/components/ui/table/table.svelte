<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils.js";

  interface Props {
    ref?: HTMLTableElement | null;
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

<div data-slot="table-container" class="relative w-full overflow-x-auto">
  <table
    bind:this={ref}
    data-slot="table"
    class={cn("w-full caption-bottom text-sm", className)}
    {...restProps}
  >
    {@render children?.()}
  </table>
</div>
