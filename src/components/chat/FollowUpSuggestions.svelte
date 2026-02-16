<script>
  let {
    suggestions = [],
    onsend,
  } = $props();
</script>

{#if suggestions.length > 0}
  <div class="follow-ups">
    <span class="label">Follow-ups</span>
    {#each suggestions as text (text)}
      <button class="suggestion" onclick={() => onsend(text)}>
        <span class="arrow">&#8618;</span>
        <span class="text">{text}</span>
      </button>
    {/each}
  </div>
{/if}

<style>
  .follow-ups {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.5rem 0 0.25rem;
    max-width: 80%;
    align-self: flex-start;
  }

  .label {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #666;
    padding: 0 0.25rem;
    margin-bottom: 0.2rem;
  }

  .suggestion {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.45rem 0.6rem;
    border: 1px solid transparent;
    border-radius: 8px;
    background: none;
    color: #b0b8c8;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
    font-size: 0.88rem;
    text-align: left;
    line-height: 1.4;
  }

  .suggestion:hover {
    background: rgba(59, 130, 246, 0.06);
    border-color: rgba(59, 130, 246, 0.15);
    color: #d0d8e8;
  }

  .arrow {
    color: #4a7bbd;
    font-size: 1rem;
    line-height: 1.3;
    flex-shrink: 0;
  }

  .suggestion:hover .arrow {
    color: #6aa3f8;
  }

  .text {
    flex: 1;
  }
</style>
