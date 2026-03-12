<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	interface Props {
		ref?: unknown;
		value?: string;
		class?: string;
		[key: string]: unknown;
	}
	let {
		ref = $bindable(null),
		value = $bindable(""),
		class: className,
		...restProps
	}: Props = $props();
</script>

<TabsPrimitive.Root
	bind:ref
	bind:value
	data-slot="tabs"
	class={cn("flex flex-col gap-2", className)}
	{...restProps}
/>