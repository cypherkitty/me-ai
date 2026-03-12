<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils.js";

	interface Props {
		ref?: HTMLTableCaptionElement | null;
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

<caption
	bind:this={ref}
	data-slot="table-caption"
	class={cn("text-muted-foreground mt-4 text-sm", className)}
	{...restProps}
>
	{@render children?.()}
</caption>