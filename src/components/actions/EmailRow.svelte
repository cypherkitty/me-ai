<script>
  let { item, actionColor = "#666", dimmed = false, onmarkacted, ondismiss, onremove } = $props();

  function formatDate(timestamp) {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  }

  let isPending = $derived(item.status === "pending");
</script>

<div class="email-row" class:dimmed>
  <div class="row-left" style:border-left-color={actionColor}>
    <span class="row-subject">{item.subject}</span>
    <span class="row-meta">
      <span class="row-from">{item.from}</span>
      {#if item.date}
        <span class="row-date">{formatDate(item.date)}</span>
      {/if}
    </span>
    {#if item.reason}
      <span class="row-reason">{item.reason}</span>
    {/if}
  </div>

  <div class="row-actions">
    {#if isPending}
      <button class="icon-btn done-btn" title="Mark handled" onclick={() => onmarkacted(item.emailId)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </button>
      <button class="icon-btn dismiss-btn" title="Dismiss" onclick={() => ondismiss(item.emailId)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    {:else}
      <span class="status-label">{item.status}</span>
    {/if}
    {#if onremove}
      <button class="icon-btn remove-btn" title="Remove classification" onclick={() => onremove(item.emailId)}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18"/>
          <path d="M8 6V4h8v2"/>
          <path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/>
        </svg>
      </button>
    {/if}
  </div>
</div>

<style>
  .email-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.8rem 0.4rem 0;
    transition: background 0.12s;
  }
  .email-row:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  .email-row.dimmed {
    opacity: 0.45;
  }

  .row-left {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    border-left: 3px solid;
    padding-left: 0.7rem;
  }

  .row-subject {
    font-size: 0.8rem;
    font-weight: 500;
    color: #ddd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .row-meta {
    display: flex;
    gap: 0.5rem;
    font-size: 0.7rem;
    color: #666;
  }

  .row-from {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }

  .row-date {
    flex-shrink: 0;
  }

  .row-reason {
    font-size: 0.7rem;
    color: #555;
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .row-actions {
    display: flex;
    gap: 0.15rem;
    flex-shrink: 0;
  }

  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border: none;
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .done-btn { color: #555; }
  .done-btn:hover {
    background: rgba(52, 211, 153, 0.15);
    color: #34d399;
  }

  .dismiss-btn { color: #555; }
  .dismiss-btn:hover {
    background: rgba(248, 113, 113, 0.15);
    color: #f87171;
  }

  .remove-btn { color: #444; }
  .remove-btn:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #888;
  }

  .status-label {
    font-size: 0.65rem;
    color: #444;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }
</style>
