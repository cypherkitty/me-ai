<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";

	interface Props {
		open?: boolean;
		value?: string;
		[key: string]: unknown;
	}
	let {
		open = $bindable(false),
		value = $bindable(),
		...restProps
	}: Props = $props();
</script>

<SelectPrimitive.Root bind:open bind:value={value} {...restProps} />