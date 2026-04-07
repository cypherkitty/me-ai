<script lang="ts">
  import { Tooltip as TooltipPrimitive } from "bits-ui";

  interface Props {
    open?: boolean;
    [key: string]: unknown;
  }
  let { open = $bindable(false), ...restProps }: Props = $props();
</script>

<TooltipPrimitive.Root bind:open {...restProps} />
