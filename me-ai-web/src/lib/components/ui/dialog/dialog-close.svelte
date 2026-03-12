<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";

	interface Props {
		ref?: unknown;
		[key: string]: unknown;
	}
	let { ref = $bindable(null), ...restProps }: Props = $props();
</script>

<DialogPrimitive.Close bind:ref data-slot="dialog-close" {...restProps} />