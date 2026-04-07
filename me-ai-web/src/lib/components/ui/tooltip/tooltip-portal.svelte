<script lang="ts">
  import { Tooltip as TooltipPrimitive } from "bits-ui";

  interface Props {
    [key: string]: unknown;
  }
  let { ...restProps }: Props = $props();
</script>

<TooltipPrimitive.Portal {...restProps} />
