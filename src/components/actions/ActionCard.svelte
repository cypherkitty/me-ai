<script>
  let { item, onmarkdone, ondismiss } = $props();

  const TYPE_CONFIG = {
    todo: { label: "TODO", color: "#3b82f6" },
    calendar: { label: "CALENDAR", color: "#a78bfa" },
    note: { label: "NOTE", color: "#34d399" },
  };

  const PRIORITY_CONFIG = {
    high: { label: "high", color: "#f87171" },
    medium: { label: "med", color: "#fbbf24" },
    low: { label: "low", color: "#666" },
  };

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

  let typeConf = $derived(TYPE_CONFIG[item.type] || TYPE_CONFIG.note);
  let prioConf = $derived(PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium);
  let isDone = $derived(item.status === "done" || item.status === "dismissed");
</script>

<div class="action-card" class:done={isDone}>
  <div class="card-header">
    <span class="type-badge" style:background={typeConf.color}>
      {typeConf.label}
    </span>
    <span class="priority-badge" style:color={prioConf.color}>
      {prioConf.label}
    </span>
    {#if item.dueDate}
      <span class="due-date">{formatDate(item.dueDate)}</span>
    {/if}
    <span class="spacer"></span>
    {#if !isDone}
      <button class="icon-btn done-btn" title="Mark done" onclick={() => onmarkdone(item.id)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </button>
      <button class="icon-btn dismiss-btn" title="Dismiss" onclick={() => ondismiss(item.id)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    {:else}
      <span class="status-label">{item.status}</span>
    {/if}
  </div>

  <div class="card-body">
    <p class="card-title">{item.title}</p>
    {#if item.description}
      <p class="card-desc">{item.description}</p>
    {/if}
  </div>

  <div class="card-source">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
    <span class="source-subject">{item.sourceSubject}</span>
  </div>
</div>

<style>
  .action-card {
    padding: 0.65rem 0.85rem;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    transition: border-color 0.15s;
  }

  .action-card:hover {
    border-color: #333;
  }

  .action-card.done {
    opacity: 0.5;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.35rem;
  }

  .type-badge {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 0.12rem 0.4rem;
    border-radius: 4px;
    color: #fff;
  }

  .priority-badge {
    font-size: 0.65rem;
    font-weight: 600;
  }

  .due-date {
    font-size: 0.7rem;
    color: #888;
  }

  .spacer {
    flex: 1;
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

  .done-btn {
    color: #555;
  }
  .done-btn:hover {
    background: rgba(52, 211, 153, 0.15);
    color: #34d399;
  }

  .dismiss-btn {
    color: #555;
  }
  .dismiss-btn:hover {
    background: rgba(248, 113, 113, 0.15);
    color: #f87171;
  }

  .status-label {
    font-size: 0.65rem;
    color: #555;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .card-body {
    margin-bottom: 0.3rem;
  }

  .card-title {
    font-size: 0.82rem;
    font-weight: 500;
    color: #e0e0e0;
    line-height: 1.35;
  }

  .card-desc {
    font-size: 0.75rem;
    color: #888;
    line-height: 1.4;
    margin-top: 0.15rem;
  }

  .card-source {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: #555;
  }

  .source-subject {
    font-size: 0.7rem;
    color: #555;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
