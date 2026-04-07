<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";

  interface Props {
    open?: boolean;
    value?: string | string[];
    [key: string]: unknown;
  }
  let { open = $bindable(false), value = $bindable(), ...restProps }: Props = $props();
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<SelectPrimitive.Root bind:open bind:value={value as any} {...restProps as any} />
