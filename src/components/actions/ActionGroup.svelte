<script>
  import EmailRow from "./EmailRow.svelte";

  let {
    action, items = [], expanded = false,
    ontoggle, onmarkacted, ondismiss, onremove, oncleargroup,
  } = $props();

  let pendingItems = $derived(items.filter((i) => i.status === "pending"));
  let actedItems = $derived(items.filter((i) => i.status !== "pending"));
  let showClearConfirm = $state(false);
</script>

<div class="action-group">
  <button class="group-header" onclick={ontoggle}>
    <span class="group-badge" style:background={action.color}>{action.label}</span>
    <span class="group-count">{pendingItems.length}</span>
    {#if actedItems.length > 0}
      <span class="group-acted">{actedItems.length} handled</span>
    {/if}
    <span class="spacer"></span>
    <span class="group-description">{action.description}</span>
    <svg
      class="chevron"
      class:open={expanded}
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </button>

  {#if expanded}
    <div class="group-body">
      {#if pendingItems.length === 0 && actedItems.length === 0}
        <p class="group-empty">No emails in this category.</p>
      {/if}

      {#each pendingItems as item (item.emailId)}
        <EmailRow {item} actionColor={action.color} {onmarkacted} {ondismiss} {onremove} />
      {/each}

      {#if actedItems.length > 0}
        <details class="handled-section">
          <summary class="handled-summary">{actedItems.length} handled</summary>
          {#each actedItems as item (item.emailId)}
            <EmailRow {item} actionColor={action.color} {onremove} dimmed />
          {/each}
        </details>
      {/if}

      <div class="group-footer">
        {#if !showClearConfirm}
          <button class="group-action-btn" onclick={() => showClearConfirm = true}>
            Clear group
          </button>
        {:else}
          <span class="confirm-row">
            Clear {items.length} items?
            <button class="group-action-btn" onclick={() => showClearConfirm = false}>Cancel</button>
            <button class="group-action-btn danger" onclick={() => { oncleargroup(); showClearConfirm = false; }}>Delete</button>
          </span>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .action-group {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    overflow: hidden;
  }

  .group-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.6rem 0.8rem;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    color: #e8e8e8;
    transition: background 0.15s;
  }
  .group-header:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .group-badge {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 0.15rem 0.5rem;
    border-radius: 5px;
    color: #fff;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .group-count {
    font-size: 0.8rem;
    font-weight: 600;
    color: #e8e8e8;
    min-width: 20px;
  }

  .group-acted {
    font-size: 0.68rem;
    color: #555;
  }

  .spacer { flex: 1; }

  .group-description {
    font-size: 0.68rem;
    color: #555;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
  }

  .chevron {
    flex-shrink: 0;
    color: #555;
    transition: transform 0.2s ease;
  }
  .chevron.open {
    transform: rotate(180deg);
  }

  .group-body {
    border-top: 1px solid #222;
    padding: 0.3rem 0;
  }

  .group-empty {
    padding: 0.75rem 1rem;
    color: #555;
    font-size: 0.78rem;
    text-align: center;
  }

  .handled-section {
    border-top: 1px solid #1e1e1e;
    margin-top: 0.2rem;
  }

  .handled-summary {
    padding: 0.4rem 0.8rem;
    font-size: 0.7rem;
    color: #555;
    cursor: pointer;
    user-select: none;
  }
  .handled-summary:hover {
    color: #888;
  }

  .group-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0.35rem 0.8rem;
    border-top: 1px solid #1e1e1e;
  }

  .group-action-btn {
    background: none;
    border: none;
    color: #555;
    font-size: 0.68rem;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
  }
  .group-action-btn:hover { color: #999; }
  .group-action-btn.danger { color: #f87171; }
  .group-action-btn.danger:hover { color: #fca5a5; }

  .confirm-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.68rem;
    color: #888;
  }
</style>
