<script>
	import { cn } from "$lib/utils.js";
	let {
		ref = $bindable(null),
		class: className = undefined,
		children = undefined,
		...restProps
	} = $props();
</script>

<tbody
	bind:this={ref}
	data-slot="table-body"
	class={cn("[&_tr:last-child]:border-0", className)}
	{...restProps}
>
	{@render children?.()}
</tbody>