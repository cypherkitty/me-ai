<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    ref?: HTMLElement | null;
    class?: string;
    [key: string]: unknown;
  }
  let { ref = $bindable(null), class: className, ...restProps }: Props = $props();
</script>

<Separator
  bind:ref
  data-slot="select-separator"
  class={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
  {...restProps}
/>
