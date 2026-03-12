<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";

	interface Props {
		ref?: unknown;
		[key: string]: unknown;
	}
	let { ref = $bindable(null), ...restProps }: Props = $props();
</script>

<TooltipPrimitive.Trigger bind:ref data-slot="tooltip-trigger" {...restProps} />