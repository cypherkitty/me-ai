<script>
  import { getAuditLog, clearAuditLog } from "../../lib/store/audit.js";

  let { open = $bindable(false) } = $props();

  let entries = $state([]);
  let total = $state(0);
  let loading = $state(false);
  let failuresOnly = $state(false);
  let expandedId = $state(null);
  let confirmClear = $state(false);

  $effect(() => {
    if (open) load();
  });

  async function load() {
    loading = true;
    try {
      const result = await getAuditLog({ limit: 100, failuresOnly });
      entries = result.entries;
      total = result.total;
    } finally {
      loading = false;
    }
  }

  async function handleClear() {
    await clearAuditLog();
    entries = [];
    total = 0;
    confirmClear = false;
  }

  function toggle(id) {
    expandedId = expandedId === id ? null : id;
  }

  function formatTime(ts) {
    if (!ts) return "—";
    const d = new Date(ts);
    return d.toLocaleString("en-US", {
      month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  }

  function shortSender(from) {
    if (!from) return "—";
    return from.replace(/<.*>/, "").trim().slice(0, 32);
  }
</script>

{#if open}
  <div class="overlay" role="dialog">
    <div class="panel">
      <!-- Header -->
      <div class="hd">
        <div class="hd-left">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <h2>Audit Log</h2>
          <span class="count">{total} execution{total !== 1 ? "s" : ""}</span>
        </div>
        <div class="hd-right">
          <label class="toggle-label">
            <input type="checkbox" bind:checked={failuresOnly} onchange={load} />
            Failures only
          </label>
          {#if !confirmClear}
            <button class="text-btn danger" onclick={() => confirmClear = true}>Clear log</button>
          {:else}
            <span class="confirm-row">
              <button class="small-btn danger" onclick={handleClear}>Confirm clear</button>
              <button class="small-btn" onclick={() => confirmClear = false}>Cancel</button>
            </span>
          {/if}
          <button class="close-btn" onclick={() => open = false}>✕</button>
        </div>
      </div>

      <!-- Body -->
      <div class="body">
        {#if loading}
          <div class="empty-state">Loading…</div>
        {:else if entries.length === 0}
          <div class="empty-state">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <p>No executions recorded yet.</p>
          </div>
        {:else}
          <table class="log-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event type</th>
                <th>Subject</th>
                <th>From</th>
                <th>Actions</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {#each entries as entry (entry.id)}
                {@const isOpen = expandedId === entry.id}
                <tr class="row" class:expanded={isOpen} class:failed={!entry.success}>
                  <td class="td-time">{formatTime(entry.executedAt)}</td>
                  <td class="td-type">
                    <span class="type-chip">{entry.eventType}</span>
                  </td>
                  <td class="td-subject" title={entry.subject}>{entry.subject}</td>
                  <td class="td-from">{shortSender(entry.from)}</td>
                  <td class="td-actions">
                    {#each (entry.steps ?? []) as step}
                      <span class="step-pill" class:fail={!step.success} title={step.message}>
                        {step.success ? "✓" : "✕"} {step.actionName ?? step.actionId}
                      </span>
                    {/each}
                  </td>
                  <td class="td-status">
                    {#if entry.success}
                      <span class="status ok">Done</span>
                    {:else}
                      <span class="status err">Failed</span>
                    {/if}
                  </td>
                  <td class="td-expand">
                    <button class="expand-btn" class:open={isOpen} onclick={() => toggle(entry.id)} aria-label="Toggle details">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                  </td>
                </tr>

                {#if isOpen}
                  <tr class="detail-row">
                    <td colspan="7">
                      <div class="detail">
                        <div class="detail-meta">
                          <span class="dmeta-label">Email ID</span>
                          <code class="dmeta-val">{entry.emailId ?? "—"}</code>
                        </div>
                        {#if entry.error}
                          <div class="detail-error">{entry.error}</div>
                        {/if}
                        <div class="steps-list">
                          {#each (entry.steps ?? []) as step}
                            <div class="step-row" class:step-ok={step.success} class:step-fail={!step.success}>
                              <span class="step-status">{step.success ? "✓" : "✕"}</span>
                              <span class="step-name">{step.actionName ?? step.actionId}</span>
                              <code class="step-cmd">{step.pluginId}·{step.commandId}</code>
                              {#if step.message}
                                <span class="step-msg">{step.message}</span>
                              {/if}
                            </div>
                          {/each}
                        </div>
                      </div>
                    </td>
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }

  .panel {
    background: #111;
    border: 1px solid #222;
    border-radius: 14px;
    width: 100%;
    max-width: 860px;
    height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  }

  /* ── Header ─────────────────────────────────────────────────── */
  .hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #1e1e1e;
    flex-shrink: 0;
    background: #151515;
    gap: 0.6rem;
  }
  .hd-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #aaa;
  }
  .hd-left h2 {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 700;
    color: #e0e0e0;
  }
  .count {
    font-size: 0.68rem;
    color: #555;
  }
  .hd-right {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .toggle-label {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.68rem;
    color: #666;
    cursor: pointer;
    user-select: none;
  }
  .toggle-label input { accent-color: #3b82f6; cursor: pointer; }

  .text-btn {
    background: none;
    border: none;
    font-size: 0.65rem;
    cursor: pointer;
    color: #555;
    text-decoration: underline;
    padding: 0;
    font-family: inherit;
  }
  .text-btn.danger { color: #555; }
  .text-btn.danger:hover { color: #f87171; }

  .confirm-row {
    display: flex;
    gap: 0.3rem;
    align-items: center;
  }
  .small-btn {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 5px;
    color: #ccc;
    font-size: 0.62rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.12s;
  }
  .small-btn:hover { background: #222; }
  .small-btn.danger { border-color: rgba(248,113,113,0.4); color: #f87171; }
  .small-btn.danger:hover { background: rgba(248,113,113,0.08); }

  .close-btn {
    background: none;
    border: none;
    color: #555;
    font-size: 0.95rem;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    transition: all 0.12s;
    line-height: 1;
  }
  .close-btn:hover { color: #ccc; background: rgba(255,255,255,0.05); }

  /* ── Body ───────────────────────────────────────────────────── */
  .body {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }
  .body::-webkit-scrollbar { width: 5px; }
  .body::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 3px; }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    height: 100%;
    color: #555;
    font-size: 0.82rem;
    text-align: center;
    padding: 3rem;
  }

  /* ── Table ──────────────────────────────────────────────────── */
  .log-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.74rem;
  }
  thead th {
    position: sticky;
    top: 0;
    background: #141414;
    color: #555;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 0.5rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid #1e1e1e;
    white-space: nowrap;
  }

  .row td {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid #161616;
    color: #888;
    vertical-align: middle;
  }
  .row:hover td { background: rgba(255,255,255,0.015); }
  .row.failed td { color: #777; }
  .row.expanded td { border-bottom: none; }

  .td-time { white-space: nowrap; color: #555; font-size: 0.68rem; }
  .td-subject {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #bbb;
  }
  .td-from { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.68rem; }
  .td-actions { white-space: nowrap; }
  .td-expand { width: 32px; text-align: center; }

  .type-chip {
    font-size: 0.6rem;
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    background: rgba(59,130,246,0.1);
    color: #60a5fa;
    border: 1px solid rgba(59,130,246,0.2);
    text-transform: uppercase;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .step-pill {
    display: inline-block;
    font-size: 0.58rem;
    font-weight: 600;
    padding: 0.08rem 0.35rem;
    border-radius: 4px;
    background: rgba(74,222,128,0.08);
    color: #4ade80;
    border: 1px solid rgba(74,222,128,0.15);
    margin-right: 0.2rem;
    white-space: nowrap;
  }
  .step-pill.fail {
    background: rgba(248,113,113,0.08);
    color: #f87171;
    border-color: rgba(248,113,113,0.18);
  }

  .status {
    font-size: 0.62rem;
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    white-space: nowrap;
  }
  .status.ok  { color: #4ade80; background: rgba(74,222,128,0.08); }
  .status.err { color: #f87171; background: rgba(248,113,113,0.08); }

  .expand-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #444;
    padding: 0.2rem;
    border-radius: 3px;
    display: flex;
    align-items: center;
    transition: all 0.12s;
  }
  .expand-btn:hover { color: #888; }
  .expand-btn svg { transition: transform 0.15s; }
  .expand-btn.open svg { transform: rotate(180deg); }

  /* ── Detail row ─────────────────────────────────────────────── */
  .detail-row td {
    padding: 0;
    border-bottom: 1px solid #1a1a1a;
    background: #0d0d0d;
  }
  .detail {
    padding: 0.65rem 1.5rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .detail-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.68rem;
  }
  .dmeta-label { color: #444; }
  .dmeta-val { font-size: 0.65rem; color: #555; background: #1a1a1a; padding: 0.1rem 0.4rem; border-radius: 3px; }

  .detail-error {
    font-size: 0.68rem;
    color: #f87171;
    background: rgba(248,113,113,0.06);
    border: 1px solid rgba(248,113,113,0.15);
    border-radius: 5px;
    padding: 0.4rem 0.6rem;
  }

  .steps-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .step-row {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.7rem;
    padding: 0.25rem 0;
    color: #666;
  }
  .step-ok  .step-status { color: #4ade80; }
  .step-fail .step-status { color: #f87171; }
  .step-name { color: #aaa; font-weight: 500; }
  .step-cmd  { font-size: 0.62rem; color: #3b82f6; background: rgba(59,130,246,0.08); padding: 0.1rem 0.35rem; border-radius: 3px; }
  .step-msg  { color: #555; font-size: 0.65rem; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
