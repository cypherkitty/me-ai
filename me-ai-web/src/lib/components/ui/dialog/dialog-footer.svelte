<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils.js";

  interface Props {
    ref?: HTMLElement | null;
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

<div
  bind:this={ref}
  data-slot="dialog-footer"
  class={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
  {...restProps}
>
  {@render children?.()}
</div>
