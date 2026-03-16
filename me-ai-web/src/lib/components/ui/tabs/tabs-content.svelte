<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	interface Props {
		ref?: HTMLElement | null;
		class?: string;
		value: string;
		[key: string]: unknown;
	}
	let {
		ref = $bindable(null),
		class: className,
		value,
		...restProps
	}: Props = $props();
</script>

<TabsPrimitive.Content
	bind:ref
	{value}
	data-slot="tabs-content"
	class={cn("flex-1 outline-none", className)}
	{...restProps}
/>