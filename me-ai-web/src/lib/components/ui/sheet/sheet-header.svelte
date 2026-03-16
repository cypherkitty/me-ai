<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils.js";

	interface Props {
		ref?: HTMLElement | null;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	}
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Props = $props();
</script>

<div
	bind:this={ref}
	data-slot="sheet-header"
	class={cn("flex flex-col gap-1.5 p-4", className)}
	{...restProps}
>
	{@render children?.()}
</div>