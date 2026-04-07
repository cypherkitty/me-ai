<script lang="ts">
  import { Dialog as SheetPrimitive } from "bits-ui";

  interface Props {
    open?: boolean;
    [key: string]: unknown;
  }
  let { open = $bindable(false), ...restProps }: Props = $props();
</script>

<SheetPrimitive.Root bind:open {...restProps} />
