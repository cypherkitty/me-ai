<script>
  import { actionColor } from "../../lib/triage.js";

  let {
    pendingData,
    onsend,
  } = $props();

  let customAction = $state("");
  let expandedGroup = $state(null);

  function formatAction(action) {
    return action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function handleQuickAction(text) {
    onsend(text);
  }

  function handleCustomSubmit() {
    const text = customAction.trim();
    if (!text) return;
    onsend(text);
    customAction = "";
  }

  function handleKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCustomSubmit();
    }
  }

  function toggleGroup(action) {
    expandedGroup = expandedGroup === action ? null : action;
  }
</script>

<div class="pending-card">
  <div class="card-header">
    <span class="icon">&#128276;</span>
    <div>
      <h3>You have {pendingData.total} pending action{pendingData.total !== 1 ? "s" : ""}</h3>
      <p class="subtitle">Here's what needs your attention:</p>
    </div>
  </div>

  <div class="groups">
    {#each pendingData.order as action (action)}
      {@const items = pendingData.groups[action]}
      {@const color = actionColor(action)}
      <div class="group">
        <button class="group-header" onclick={() => toggleGroup(action)}>
          <span class="action-badge" style="background: {color}20; color: {color}; border-color: {color}40">
            {formatAction(action)}
          </span>
          <span class="count">{items.length}</span>
          <span class="chevron" class:expanded={expandedGroup === action}>&#9654;</span>
        </button>

        {#if expandedGroup === action}
          <div class="group-items">
            {#each items.slice(0, 5) as item (item.emailId)}
              <div class="item">
                <div class="item-subject">{item.subject}</div>
                <div class="item-meta">
                  {item.from}
                  {#if item.date}
                    &middot; {new Date(item.date).toLocaleDateString()}
                  {/if}
                </div>
                {#if item.summary}
                  <div class="item-summary">{item.summary}</div>
                {/if}
              </div>
            {/each}
            {#if items.length > 5}
              <div class="more">...and {items.length - 5} more</div>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <div class="suggestions">
    <p class="suggestions-label">Quick actions:</p>
    <div class="chips">
      <button class="chip" onclick={() => handleQuickAction("Summarize all my pending action items and help me prioritize them")}>
        Prioritize all
      </button>
      <button class="chip" onclick={() => handleQuickAction("Which pending emails can I safely archive or delete?")}>
        What to archive?
      </button>
      <button class="chip" onclick={() => handleQuickAction("Which pending emails need an urgent reply?")}>
        Urgent replies?
      </button>
      <button class="chip" onclick={() => handleQuickAction("Help me write replies for pending emails that need a response")}>
        Draft replies
      </button>
    </div>
  </div>

  <div class="custom-action">
    <p class="custom-label">Or describe what you'd like to do:</p>
    <div class="custom-input-row">
      <textarea
        rows="1"
        placeholder="e.g. 'Mark all newsletters as read' or 'What deliveries am I waiting for?'"
        bind:value={customAction}
        onkeydown={handleKeydown}
      ></textarea>
      <button
        class="send-btn"
        onclick={handleCustomSubmit}
        disabled={!customAction.trim()}
      >Go</button>
    </div>
  </div>
</div>

<style>
  .pending-card {
    background: linear-gradient(135deg, #1a2332 0%, #1e1e2e 100%);
    border: 1px solid #2a3a4a;
    border-radius: 12px;
    padding: 1rem 1.2rem;
    max-width: 90%;
    align-self: flex-start;
  }

  .card-header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .icon {
    font-size: 1.4rem;
    line-height: 1;
    flex-shrink: 0;
    margin-top: 0.1rem;
  }
  .card-header h3 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #e8e8e8;
  }
  .subtitle {
    margin: 0.15rem 0 0;
    font-size: 0.8rem;
    color: #888;
  }

  /* ── Groups ──────────────────────────────────────────────────────── */
  .groups {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }
  .group-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.4rem 0.5rem;
    border: none;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s;
    text-align: left;
    color: inherit;
    font-family: inherit;
  }
  .group-header:hover {
    background: rgba(255, 255, 255, 0.06);
  }
  .action-badge {
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    border: 1px solid;
    white-space: nowrap;
  }
  .count {
    font-size: 0.75rem;
    color: #888;
    font-variant-numeric: tabular-nums;
  }
  .chevron {
    margin-left: auto;
    font-size: 0.6rem;
    color: #666;
    transition: transform 0.15s;
  }
  .chevron.expanded {
    transform: rotate(90deg);
  }

  /* ── Group items ─────────────────────────────────────────────────── */
  .group-items {
    padding: 0.25rem 0 0.25rem 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .item {
    padding: 0.35rem 0.5rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 4px;
    border-left: 2px solid #333;
  }
  .item-subject {
    font-size: 0.82rem;
    font-weight: 500;
    color: #ddd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .item-meta {
    font-size: 0.7rem;
    color: #777;
    margin-top: 0.1rem;
  }
  .item-summary {
    font-size: 0.72rem;
    color: #999;
    margin-top: 0.2rem;
    line-height: 1.4;
  }
  .more {
    font-size: 0.72rem;
    color: #666;
    font-style: italic;
    padding-left: 0.5rem;
  }

  /* ── Quick action chips ──────────────────────────────────────────── */
  .suggestions {
    margin-bottom: 0.75rem;
  }
  .suggestions-label {
    font-size: 0.75rem;
    color: #888;
    margin: 0 0 0.4rem;
    font-weight: 500;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .chip {
    font-size: 0.75rem;
    padding: 0.3rem 0.65rem;
    border: 1px solid #3b82f6;
    border-radius: 16px;
    background: rgba(59, 130, 246, 0.08);
    color: #6aa3f8;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
    white-space: nowrap;
  }
  .chip:hover {
    background: rgba(59, 130, 246, 0.18);
    color: #93bbfc;
  }

  /* ── Custom action input ─────────────────────────────────────────── */
  .custom-action {
    border-top: 1px solid #2a3a4a;
    padding-top: 0.65rem;
  }
  .custom-label {
    font-size: 0.75rem;
    color: #888;
    margin: 0 0 0.35rem;
    font-weight: 500;
  }
  .custom-input-row {
    display: flex;
    gap: 0.4rem;
  }
  .custom-input-row textarea {
    flex: 1;
    resize: none;
    border: 1px solid #333;
    border-radius: 8px;
    background: #1a1a1a;
    color: #e8e8e8;
    padding: 0.45rem 0.65rem;
    font-size: 0.82rem;
    font-family: inherit;
    line-height: 1.4;
    outline: none;
  }
  .custom-input-row textarea:focus {
    border-color: #3b82f6;
  }
  .send-btn {
    padding: 0.45rem 0.9rem;
    border: 1px solid #3b82f6;
    border-radius: 8px;
    background: #3b82f6;
    color: #fff;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
    font-family: inherit;
  }
  .send-btn:hover:not(:disabled) {
    background: #2563eb;
  }
  .send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
