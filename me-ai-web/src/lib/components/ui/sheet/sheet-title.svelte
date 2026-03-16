<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	interface Props {
		ref?: HTMLElement | null;
		class?: string;
		[key: string]: unknown;
	}
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: Props = $props();
</script>

<SheetPrimitive.Title
	bind:ref
	data-slot="sheet-title"
	class={cn("text-foreground font-semibold", className)}
	{...restProps}
/>