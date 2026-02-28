<script>
  import { SvelteFlow, SmoothStepEdge } from "@xyflow/svelte";
  import TriggerNode from "./TriggerNode.svelte";
  import ActionNode  from "./ActionNode.svelte";
  import PolicyNode  from "./PolicyNode.svelte";

  const nodeTypes = { trigger: TriggerNode, action: ActionNode, policy: PolicyNode };
  const edgeTypes = { smoothstep: SmoothStepEdge };

  /**
   * nodes / edges: plain serialisable arrays — NO functions in data.
   * onNodeClick: (nodeId: string) => void — called when any node is clicked.
   */
  let { nodes, edges, height, onNodeClick } = $props();

  // Strip any lingering Svelte-proxy wrapping so structuredClone succeeds.
  let rawNodes = $state.raw([]);
  let rawEdges = $state.raw([]);

  $effect(() => {
    rawNodes = nodes.map(n => ({ ...n, data: { ...n.data } }));
    rawEdges = edges.map(e => ({ ...e }));
  });

  function handleNodeClick({ node }) {
    onNodeClick?.(node.id);
  }
</script>

<div style="height: {height}px; position: relative; overflow: hidden;">
  <SvelteFlow
    nodes={rawNodes}
    edges={rawEdges}
    {nodeTypes}
    {edgeTypes}
    fitView
    fitViewOptions={{ padding: 0.18 }}
    colorMode="dark"
    nodesDraggable={false}
    nodesConnectable={false}
    elementsSelectable={false}
    panOnDrag={false}
    zoomOnScroll={false}
    zoomOnPinch={false}
    zoomOnDoubleClick={false}
    minZoom={0.4}
    maxZoom={1.2}
    proOptions={{ hideAttribution: true }}
    style="background: transparent;"
    onnodeclick={handleNodeClick}
  />
</div>
