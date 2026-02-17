<script>
  let { command, onexecute } = $props();
</script>

<button class="command-card" onclick={() => onexecute?.(command.id)}>
  {#if command.icon}
    <span class="cmd-icon">{command.icon}</span>
  {/if}
  <div class="cmd-info">
    <span class="cmd-name">{command.name}</span>
    <span class="cmd-desc">{command.description}</span>
  </div>
</button>

{#if command.body}
  <div class="cmd-body">
    <pre>{command.body}</pre>
  </div>
{/if}

<style>
  .command-card {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.65rem;
    background: rgba(59, 130, 246, 0.06);
    border: 1px solid rgba(59, 130, 246, 0.15);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
    font-family: inherit;
    width: 100%;
  }
  .command-card:hover {
    background: rgba(59, 130, 246, 0.12);
    border-color: rgba(59, 130, 246, 0.3);
  }
  .cmd-icon {
    font-size: 0.9rem;
    flex-shrink: 0;
  }
  .cmd-info {
    display: flex;
    flex-direction: column;
    gap: 0.05rem;
    min-width: 0;
  }
  .cmd-name {
    font-size: 0.72rem;
    font-weight: 600;
    color: #ddd;
  }
  .cmd-desc {
    font-size: 0.6rem;
    color: #777;
    line-height: 1.3;
  }
  .cmd-body {
    margin-top: 0.25rem;
    padding: 0.4rem;
    background: #0a0a0a;
    border: 1px solid #1e1e1e;
    border-radius: 6px;
  }
  .cmd-body pre {
    margin: 0;
    font-size: 0.62rem;
    color: #bbb;
    font-family: 'Courier New', Consolas, monospace;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.4;
  }
</style>
