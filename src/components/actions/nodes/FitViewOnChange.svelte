<script>
  import { useSvelteFlow } from '@xyflow/svelte';

  let { nodes } = $props();
  const { fitView } = useSvelteFlow();

  $effect(() => {
    // Re-run whenever nodes array identity changes (new type selected)
    if (nodes && nodes.length > 0) {
      // Delay so the DOM has time to measure the new node dimensions
      setTimeout(() => fitView({ padding: 0.3, duration: 200 }), 60);
    }
  });
</script>
