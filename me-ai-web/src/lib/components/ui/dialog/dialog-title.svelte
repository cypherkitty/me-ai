<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	interface Props {
		ref?: HTMLElement | null;
		class?: string;
		[key: string]: unknown;
	}
	let {
		ref = $bindable(null),
		class: className = undefined,
		...restProps
	}: Props = $props();
</script>

<DialogPrimitive.Title
	bind:ref
	data-slot="dialog-title"
	class={cn("text-lg leading-none font-semibold", className)}
	{...restProps}
/>