<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";

	interface Props {
		ref?: HTMLElement | null;
		[key: string]: unknown;
	}
	let { ref = $bindable(null), ...restProps }: Props = $props();
</script>

<DialogPrimitive.Trigger bind:ref data-slot="dialog-trigger" {...restProps} />