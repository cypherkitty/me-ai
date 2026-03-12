<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";

	interface Props {
		[key: string]: unknown;
	}
	let { ...restProps }: Props = $props();
</script>

<DialogPrimitive.Portal {...restProps} />