<script>
  let { filter = "all", counts = {}, onsetfilter } = $props();

  const FILTERS = [
    { id: "all", label: "All", countKey: "total" },
    { id: "todo", label: "Todos", countKey: "todo" },
    { id: "calendar", label: "Calendar", countKey: "calendar" },
    { id: "note", label: "Notes", countKey: "note" },
  ];
</script>

<div class="filter-bar">
  {#each FILTERS as f}
    <button
      class="filter-btn"
      class:active={filter === f.id}
      onclick={() => onsetfilter(f.id)}
    >
      {f.label}
      {#if counts[f.countKey]}
        <span class="filter-count">{counts[f.countKey]}</span>
      {/if}
    </button>
  {/each}
</div>

<style>
  .filter-bar {
    display: flex;
    gap: 0.3rem;
    margin-bottom: 0.75rem;
    padding: 0.15rem;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
  }

  .filter-btn {
    flex: 1;
    padding: 0.4rem 0.5rem;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #777;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
  }

  .filter-btn:hover {
    color: #ccc;
    background: rgba(255, 255, 255, 0.04);
  }

  .filter-btn.active {
    color: #e8e8e8;
    background: rgba(255, 255, 255, 0.08);
  }

  .filter-count {
    font-size: 0.65rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.1rem 0.35rem;
    border-radius: 8px;
    color: #aaa;
    min-width: 18px;
    text-align: center;
  }

  .filter-btn.active .filter-count {
    background: rgba(59, 130, 246, 0.2);
    color: #93bbfc;
  }
</style>
