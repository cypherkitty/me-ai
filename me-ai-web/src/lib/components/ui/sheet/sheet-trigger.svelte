<script lang="ts">
  import { Dialog as SheetPrimitive } from "bits-ui";

  interface Props {
    ref?: HTMLElement | null;
    [key: string]: unknown;
  }
  let { ref = $bindable(null), ...restProps }: Props = $props();
</script>

<SheetPrimitive.Trigger bind:ref data-slot="sheet-trigger" {...restProps} />
