<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from "bits-ui";

	interface Props {
		ref?: HTMLElement | null;
		[key: string]: unknown;
	}
	let { ref = $bindable(null), ...restProps }: Props = $props();
</script>

<CollapsiblePrimitive.Trigger bind:ref data-slot="collapsible-trigger" {...restProps} />