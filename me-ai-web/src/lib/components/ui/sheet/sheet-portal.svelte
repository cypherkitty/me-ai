<script lang="ts">
  import { Dialog as SheetPrimitive } from "bits-ui";

  interface Props {
    [key: string]: unknown;
  }
  let { ...restProps }: Props = $props();
</script>

<SheetPrimitive.Portal {...restProps} />
