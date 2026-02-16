<script>
  import { db } from "../../lib/store/db.js";
  import { clearGmailData } from "../../lib/store/gmail-sync.js";
  import { clearClassifications, clearClassificationsByAction } from "../../lib/triage.js";

  let { onrefresh, groupOrder = [] } = $props();

  let showPanel = $state(false);
  let confirm = $state(null);
  let busy = $state(false);
  let storageSummary = $state(null);

  async function loadSummary() {
    const [emailCount, classCount, contactCount] = await Promise.all([
      db.items.where("sourceType").equals("gmail").count(),
      db.emailClassifications.count(),
      db.contacts.count(),
    ]);

    let totalBytes = 0;
    try {
      const est = await navigator.storage?.estimate();
      totalBytes = est?.usage ?? 0;
    } catch {}

    storageSummary = { emailCount, classCount, contactCount, totalBytes };
  }

  function fmtBytes(b) {
    if (!b) return "—";
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  }

  function toggle() {
    showPanel = !showPanel;
    if (showPanel) loadSummary();
  }

  async function execAction(fn) {
    busy = true;
    confirm = null;
    try {
      await fn();
      await loadSummary();
      onrefresh?.();
    } finally {
      busy = false;
    }
  }

  async function clearClassificationsAction() {
    await execAction(() => clearClassifications());
  }

  async function clearGroupAction(action) {
    await execAction(() => clearClassificationsByAction(action));
  }

  async function clearEmailsAction() {
    await execAction(async () => {
      await clearGmailData();
      await clearClassifications();
    });
  }

  async function clearContactsAction() {
    await execAction(() => db.contacts.clear());
  }

  async function nukeEverything() {
    await execAction(async () => {
      await db.delete();
      window.location.reload();
    });
  }

  function formatLabel(str) {
    return str
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  }
</script>

<div class="dm">
  <button class="dm-toggle" onclick={toggle}>
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
    Data Management
    <svg class="chev" class:open={showPanel} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </button>

  {#if showPanel}
    <div class="dm-panel">
      <!-- ── Storage summary ─────────────── -->
      {#if storageSummary}
        <div class="summary-row">
          <span class="s-item">{storageSummary.emailCount} emails</span>
          <span class="sep">·</span>
          <span class="s-item">{storageSummary.classCount} classifications</span>
          <span class="sep">·</span>
          <span class="s-item">{storageSummary.contactCount} contacts</span>
          {#if storageSummary.totalBytes}
            <span class="sep">·</span>
            <span class="s-item">{fmtBytes(storageSummary.totalBytes)} used</span>
          {/if}
        </div>
      {/if}

      <!-- ── Per-group clear ─────────────── -->
      {#if groupOrder.length > 0}
        <div class="section">
          <div class="section-title">Clear by action group</div>
          <div class="group-chips">
            {#each groupOrder as action}
              {#if confirm === `group:${action}`}
                <span class="confirm-inline">
                  Delete {formatLabel(action)}?
                  <button class="link-btn" onclick={() => confirm = null}>No</button>
                  <button class="link-btn danger" onclick={() => clearGroupAction(action)} disabled={busy}>Yes</button>
                </span>
              {:else}
                <button class="chip" onclick={() => confirm = `group:${action}`} disabled={busy}>
                  {formatLabel(action)} ✕
                </button>
              {/if}
            {/each}
          </div>
        </div>
      {/if}

      <!-- ── Bulk actions ────────────────── -->
      <div class="section">
        <div class="section-title">Bulk actions</div>
        <div class="btn-list">
          <!-- Clear all classifications -->
          {#if confirm === "classifications"}
            <div class="confirm-row">
              <span>Clear all classifications?</span>
              <button class="link-btn" onclick={() => confirm = null}>Cancel</button>
              <button class="link-btn danger" onclick={clearClassificationsAction} disabled={busy}>Delete</button>
            </div>
          {:else}
            <button class="action-row" onclick={() => confirm = "classifications"} disabled={busy}>
              <span class="action-label">Clear all classifications</span>
              <span class="action-desc">Remove all LLM scan results. Emails stay.</span>
            </button>
          {/if}

          <!-- Clear emails + classifications -->
          {#if confirm === "emails"}
            <div class="confirm-row">
              <span>Delete all synced emails &amp; classifications?</span>
              <button class="link-btn" onclick={() => confirm = null}>Cancel</button>
              <button class="link-btn danger" onclick={clearEmailsAction} disabled={busy}>Delete</button>
            </div>
          {:else}
            <button class="action-row" onclick={() => confirm = "emails"} disabled={busy}>
              <span class="action-label">Clear emails &amp; classifications</span>
              <span class="action-desc">Remove all synced Gmail data and scan results.</span>
            </button>
          {/if}

          <!-- Clear contacts -->
          {#if confirm === "contacts"}
            <div class="confirm-row">
              <span>Delete all contacts?</span>
              <button class="link-btn" onclick={() => confirm = null}>Cancel</button>
              <button class="link-btn danger" onclick={clearContactsAction} disabled={busy}>Delete</button>
            </div>
          {:else}
            <button class="action-row" onclick={() => confirm = "contacts"} disabled={busy}>
              <span class="action-label">Clear contacts</span>
              <span class="action-desc">Remove extracted contacts from the database.</span>
            </button>
          {/if}
        </div>
      </div>

      <!-- ── Nuclear option ──────────────── -->
      <div class="section danger-section">
        {#if confirm === "nuke"}
          <div class="confirm-row nuke">
            <span>This will delete the entire database and reload the page. Are you sure?</span>
            <button class="link-btn" onclick={() => confirm = null}>Cancel</button>
            <button class="link-btn danger" onclick={nukeEverything} disabled={busy}>Wipe Everything</button>
          </div>
        {:else}
          <button class="action-row nuke-btn" onclick={() => confirm = "nuke"} disabled={busy}>
            <span class="action-label">Wipe entire local storage</span>
            <span class="action-desc">Delete the IndexedDB database and reload. All data will be lost.</span>
          </button>
        {/if}
      </div>

      {#if busy}
        <div class="busy-overlay">Working...</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .dm {
    margin-top: 0.75rem;
  }

  .dm-toggle {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: 100%;
    padding: 0.5rem 0.65rem;
    background: #111;
    border: 1px solid #222;
    border-radius: 8px;
    color: #666;
    font-size: 0.72rem;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.12s, border-color 0.12s;
    font-family: inherit;
  }
  .dm-toggle:hover {
    color: #999;
    border-color: #333;
  }

  .chev {
    margin-left: auto;
    transition: transform 0.2s ease;
    color: #444;
  }
  .chev.open { transform: rotate(180deg); }

  .dm-panel {
    margin-top: 0.35rem;
    padding: 0.55rem 0.65rem;
    background: #111;
    border: 1px solid #222;
    border-radius: 8px;
    position: relative;
  }

  /* ── Summary ──────────────────── */
  .summary-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    font-size: 0.66rem;
    color: #666;
    padding-bottom: 0.45rem;
    border-bottom: 1px solid #1e1e1e;
    margin-bottom: 0.45rem;
  }
  .sep { color: #333; }

  /* ── Sections ─────────────────── */
  .section {
    margin-bottom: 0.5rem;
  }
  .section-title {
    font-size: 0.62rem;
    font-weight: 600;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 0.3rem;
  }

  /* ── Group chips ──────────────── */
  .group-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  .chip {
    font-size: 0.64rem;
    font-weight: 500;
    color: #888;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid #2a2a2a;
    border-radius: 5px;
    padding: 0.15rem 0.45rem;
    cursor: pointer;
    transition: all 0.12s;
    font-family: inherit;
  }
  .chip:hover:not(:disabled) {
    color: #f87171;
    border-color: rgba(248, 113, 113, 0.3);
    background: rgba(248, 113, 113, 0.05);
  }
  .chip:disabled { opacity: 0.4; cursor: not-allowed; }

  .confirm-inline {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.64rem;
    color: #888;
  }

  /* ── Button list ──────────────── */
  .btn-list {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .action-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.05rem;
    padding: 0.35rem 0.5rem;
    background: none;
    border: 1px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.12s;
    text-align: left;
    font-family: inherit;
    width: 100%;
  }
  .action-row:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.02);
    border-color: #2a2a2a;
  }
  .action-row:disabled { opacity: 0.4; cursor: not-allowed; }
  .action-label {
    font-size: 0.72rem;
    font-weight: 500;
    color: #ccc;
  }
  .action-desc {
    font-size: 0.6rem;
    color: #555;
  }

  /* ── Confirm rows ─────────────── */
  .confirm-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.4rem;
    font-size: 0.68rem;
    color: #888;
    padding: 0.35rem 0.5rem;
    background: rgba(248, 113, 113, 0.03);
    border: 1px solid rgba(248, 113, 113, 0.12);
    border-radius: 6px;
  }
  .confirm-row.nuke {
    background: rgba(248, 113, 113, 0.06);
    border-color: rgba(248, 113, 113, 0.25);
  }

  .link-btn {
    background: none;
    border: none;
    color: #888;
    font-size: 0.66rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    font-family: inherit;
  }
  .link-btn:hover { color: #ccc; }
  .link-btn.danger { color: #f87171; }
  .link-btn.danger:hover { color: #fca5a5; }
  .link-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Danger section ───────────── */
  .danger-section {
    padding-top: 0.45rem;
    border-top: 1px solid #1e1e1e;
    margin-bottom: 0;
  }
  .nuke-btn .action-label { color: #f87171; }
  .nuke-btn:hover:not(:disabled) {
    background: rgba(248, 113, 113, 0.04);
    border-color: rgba(248, 113, 113, 0.15);
  }

  /* ── Busy overlay ─────────────── */
  .busy-overlay {
    position: absolute;
    inset: 0;
    background: rgba(17, 17, 17, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    color: #888;
    border-radius: 8px;
    backdrop-filter: blur(1px);
  }
</style>
