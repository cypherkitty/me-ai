<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";

	interface Props {
		ref?: unknown;
		[key: string]: unknown;
	}
	let { ref = $bindable(null), ...restProps }: Props = $props();
</script>

<SheetPrimitive.Close bind:ref data-slot="sheet-close" {...restProps} />