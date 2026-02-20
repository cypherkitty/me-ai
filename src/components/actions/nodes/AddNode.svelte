<script>
  import { Handle, Position } from '@xyflow/svelte';
  let { data } = $props();
</script>

<button class="add-node" onclick={data.onClick} title="Add next action">
  <Handle type="target" position={Position.Left} style="opacity: 0" />
  <div class="plus">+</div>
</button>

<style>
  .add-node {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: #111;
    border: 2px dashed #444;
    color: #888;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0;
  }
  .add-node:hover {
    border-color: #aaa;
    color: #ccc;
    background: #222;
  }
  .plus {
    font-size: 20px;
    line-height: 1;
    margin-top: -2px; /* optical centering */
  }
</style>