<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	interface Props {
		ref?: unknown;
		class?: string;
		[key: string]: unknown;
	}
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: Props = $props();
</script>

<TabsPrimitive.Content
	bind:ref
	data-slot="tabs-content"
	class={cn("flex-1 outline-none", className)}
	{...restProps}
/>