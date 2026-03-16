<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from "bits-ui";

	interface Props {
		ref?: HTMLElement | null;
		open?: boolean;
		[key: string]: unknown;
	}
	let {
		ref = $bindable(null),
		open = $bindable(false),
		...restProps
	}: Props = $props();
</script>

<CollapsiblePrimitive.Root bind:ref bind:open data-slot="collapsible" {...restProps} />