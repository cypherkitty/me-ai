<script>
  import { actionColor, tagColor } from "../../lib/triage.js";

  let {
    pendingData = null,
    onmarkacted,
    ondismiss,
    onremove,
    oncleargroup,
    onaskai,
  } = $props();

  let expandedGroup = $state(null);
  let confirmClear = $state(null);

  /** Expand or collapse a group; exposed so QuickActions can call it */
  export function toggleGroup(action) {
    expandedGroup = expandedGroup === action ? null : action;
  }

  function formatLabel(str) {
    return str
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  }

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
</script>

{#if pendingData && pendingData.total > 0}
  <div class="dashboard">
    <div class="dash-header">
      <svg class="dash-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
      <span class="dash-title">{pendingData.total} pending action{pendingData.total !== 1 ? "s" : ""}</span>
    </div>

    <div class="group-grid">
      {#each pendingData.order as action (action)}
        {@const items = pendingData.groups[action]}
        {@const color = actionColor(action)}
        {@const isExpanded = expandedGroup === action}

        <div class="group-card" class:expanded={isExpanded}>
          <button class="group-btn" onclick={() => toggleGroup(action)}>
            <span class="group-dot" style:background={color}></span>
            <span class="group-label">{formatLabel(action)}</span>
            <span class="group-count">{items.length}</span>
            <svg
              class="group-chevron"
              class:open={isExpanded}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {#if isExpanded}
            <div class="group-body">
              {#each items as item (item.emailId)}
                <div class="email-row">
                  <button class="email-info" onclick={() => onaskai?.(`Tell me about the email "${item.subject}" from ${item.from}`)}>
                    <span class="email-subject">{item.subject}</span>
                    <span class="email-meta">
                      <span class="email-from">{item.from}</span>
                      {#if item.date}
                        <span class="email-date">{formatDate(item.date)}</span>
                      {/if}
                    </span>
                    {#if item.summary}
                      <span class="email-summary">{item.summary}</span>
                    {/if}
                    {#if item.tags && item.tags.length > 0}
                      <span class="email-tags">
                        {#each item.tags as tag}
                          <span class="tag" style:background={tagColor(tag)}>{tag}</span>
                        {/each}
                      </span>
                    {/if}
                  </button>
                  <div class="email-actions">
                    <button class="icon-btn done-btn" title="Mark handled" onclick={() => onmarkacted?.(item.emailId)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                    <button class="icon-btn dismiss-btn" title="Dismiss" onclick={() => ondismiss?.(item.emailId)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                    <button class="icon-btn remove-btn" title="Remove" onclick={() => onremove?.(item.emailId)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"/>
                        <path d="M8 6V4h8v2"/>
                        <path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              {/each}

              <div class="batch-bar">
                {#if confirmClear !== action}
                  <button class="batch-btn" onclick={() => onmarkacted && items.forEach(i => onmarkacted(i.emailId))}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Mark All Handled
                  </button>
                  <button class="batch-btn danger" onclick={() => confirmClear = action}>
                    Clear Group
                  </button>
                {:else}
                  <span class="confirm-text">Clear {items.length} items?</span>
                  <button class="batch-btn" onclick={() => confirmClear = null}>Cancel</button>
                  <button class="batch-btn danger" onclick={() => { oncleargroup?.(action); confirmClear = null; }}>
                    Delete
                  </button>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .dashboard {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 0.6rem;
    max-width: 90%;
    align-self: flex-start;
  }

  .dash-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.2rem 0.3rem 0.5rem;
  }
  .dash-icon {
    color: #666;
    flex-shrink: 0;
  }
  .dash-title {
    font-size: 0.78rem;
    font-weight: 600;
    color: #aaa;
  }

  /* ── Group grid ────────────────────────────────────────────────── */
  .group-grid {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .group-card {
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.15s;
  }
  .group-card.expanded {
    border-color: #333;
  }

  .group-btn {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    width: 100%;
    padding: 0.45rem 0.55rem;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    color: #e8e8e8;
    transition: background 0.12s;
    font-family: inherit;
  }
  .group-btn:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .group-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .group-label {
    font-size: 0.78rem;
    font-weight: 500;
    flex: 1;
  }

  .group-count {
    font-size: 0.7rem;
    font-weight: 700;
    color: #888;
    background: rgba(255, 255, 255, 0.06);
    padding: 0.05rem 0.4rem;
    border-radius: 10px;
    min-width: 20px;
    text-align: center;
  }

  .group-chevron {
    color: #555;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }
  .group-chevron.open {
    transform: rotate(180deg);
  }

  /* ── Expanded body ─────────────────────────────────────────────── */
  .group-body {
    border-top: 1px solid #222;
  }

  /* ── Email rows ────────────────────────────────────────────────── */
  .email-row {
    display: flex;
    align-items: flex-start;
    gap: 0.3rem;
    padding: 0.35rem 0.5rem;
    transition: background 0.12s;
  }
  .email-row:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  .email-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    color: inherit;
    padding: 0;
    font-family: inherit;
  }

  .email-subject {
    font-size: 0.76rem;
    font-weight: 500;
    color: #ddd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .email-meta {
    display: flex;
    gap: 0.4rem;
    font-size: 0.66rem;
    color: #666;
  }
  .email-from {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 180px;
  }
  .email-date {
    flex-shrink: 0;
  }

  .email-summary {
    font-size: 0.68rem;
    color: #777;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .email-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.15rem;
    margin-top: 0.05rem;
  }
  .tag {
    font-size: 0.55rem;
    font-weight: 600;
    color: #ddd;
    padding: 0.05rem 0.3rem;
    border-radius: 3px;
    white-space: nowrap;
  }

  /* ── Action buttons ────────────────────────────────────────────── */
  .email-actions {
    display: flex;
    gap: 0.1rem;
    flex-shrink: 0;
    padding-top: 0.05rem;
  }

  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 5px;
    background: transparent;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .done-btn { color: #555; }
  .done-btn:hover { background: rgba(52, 211, 153, 0.15); color: #34d399; }
  .dismiss-btn { color: #555; }
  .dismiss-btn:hover { background: rgba(248, 113, 113, 0.15); color: #f87171; }
  .remove-btn { color: #444; }
  .remove-btn:hover { background: rgba(255, 255, 255, 0.06); color: #888; }

  /* ── Batch bar ─────────────────────────────────────────────────── */
  .batch-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.55rem;
    border-top: 1px solid #1e1e1e;
    justify-content: flex-end;
  }

  .batch-btn {
    font-size: 0.66rem;
    font-weight: 500;
    color: #777;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    transition: background 0.12s, color 0.12s;
    font-family: inherit;
  }
  .batch-btn:hover { background: rgba(255, 255, 255, 0.05); color: #aaa; }
  .batch-btn.danger { color: #888; }
  .batch-btn.danger:hover { color: #f87171; background: rgba(248, 113, 113, 0.08); }

  .confirm-text {
    font-size: 0.66rem;
    color: #888;
  }
</style>
