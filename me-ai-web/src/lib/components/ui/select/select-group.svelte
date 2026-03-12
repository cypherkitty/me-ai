<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";

	interface Props {
		ref?: unknown;
		[key: string]: unknown;
	}
	let { ref = $bindable(null), ...restProps }: Props = $props();
</script>

<SelectPrimitive.Group bind:ref data-slot="select-group" {...restProps} />