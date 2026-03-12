<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";

	interface Props {
		[key: string]: unknown;
	}
	let { ...restProps }: Props = $props();
</script>

<SelectPrimitive.Portal {...restProps} />