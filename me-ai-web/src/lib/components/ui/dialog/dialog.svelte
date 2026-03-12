<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";

	interface Props {
		open?: boolean;
		[key: string]: unknown;
	}
	let { open = $bindable(false), ...restProps }: Props = $props();
</script>

<DialogPrimitive.Root bind:open {...restProps} />