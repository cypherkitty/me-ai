<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils.js";

	interface Props {
		ref?: unknown;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	}
	let {
		ref = $bindable(null),
		class: className = undefined,
		children = undefined,
		...restProps
	}: Props = $props();
</script>

<div
	bind:this={ref}
	data-slot="dialog-header"
	class={cn("flex flex-col gap-2 text-center sm:text-start", className)}
	{...restProps}
>
	{@render children?.()}
</div>