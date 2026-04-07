<script lang="ts">
  import { Separator as SeparatorPrimitive } from "bits-ui";
  import { cn } from "$lib/utils.js";

  interface Props {
    ref?: HTMLElement | null;
    class?: string;
    "data-slot"?: string;
    [key: string]: unknown;
  }
  let {
    ref = $bindable(null),
    class: className,
    "data-slot": dataSlot = "separator",
    ...restProps
  }: Props = $props();
</script>

<SeparatorPrimitive.Root
  bind:ref
  data-slot={dataSlot}
  class={cn(
    "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:min-h-full data-[orientation=vertical]:w-px",
    className
  )}
  {...restProps}
/>
