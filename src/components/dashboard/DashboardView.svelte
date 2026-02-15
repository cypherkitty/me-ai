<script>
  import { onMount } from "svelte";
  import ErrorCard from "../shared/ErrorCard.svelte";
  import ProfileCard from "./ProfileCard.svelte";
  import SyncStatus from "./SyncStatus.svelte";
  import MessageList from "./MessageList.svelte";
  import MessageModal from "./MessageModal.svelte";
  import { mountLog } from "../../lib/debug.js";

  onMount(() => mountLog("DashboardView"));

  let {
    error = null,
    profile = null,
    loadingProfile = false,
    emailMessages = [],
    nextPageToken = null,
    loadingMessages = false,
    selectedMessage = null,
    loadingDetail = false,
    syncStatus = null,
    syncProgress = null,
    isSyncing = false,
    searchQuery = $bindable(),
    onsignout,
    onfetch,
    onfetchmore,
    onviewmessage,
    onclosedetail,
    ondismisserror,
    onsync,
    oncleardata,
  } = $props();
</script>

<div class="main-content">
  {#if error}
    <ErrorCard {error} ondismiss={ondismisserror} {onsignout} />
  {/if}

  <ProfileCard {profile} {loadingProfile} {onsignout} />

  <!-- Local storage sync -->
  <SyncStatus {syncStatus} {syncProgress} {isSyncing} {onsync} onclear={oncleardata} />

  <!-- Search & Fetch -->
  <div class="toolbar">
    <input
      type="text"
      class="search-input"
      placeholder="Search Gmail (e.g. from:alice subject:meeting)..."
      bind:value={searchQuery}
      onkeydown={(e) => e.key === "Enter" && onfetch()}
    />
    <button class="btn primary" onclick={onfetch} disabled={loadingMessages}>
      {loadingMessages ? "Loading..." : "Fetch Messages"}
    </button>
  </div>

  <!-- Message List -->
  {#if emailMessages.length > 0}
    <MessageList messages={emailMessages} onselect={onviewmessage} />

    {#if nextPageToken}
      <div class="load-more">
        <button class="btn" onclick={onfetchmore} disabled={loadingMessages}>
          {loadingMessages ? "Loading..." : "Load More"}
        </button>
      </div>
    {/if}
  {:else if !loadingMessages}
    <div class="empty-state">
      <p>Click "Fetch Messages" to load your Gmail inbox.</p>
    </div>
  {/if}

  {#if loadingMessages && emailMessages.length === 0}
    <div class="loading-state">
      <span class="spinner"></span>
      <span>Loading messages...</span>
    </div>
  {/if}
</div>

<!-- Message Detail Modal -->
{#if selectedMessage}
  <MessageModal message={selectedMessage} loading={loadingDetail} onclose={onclosedetail} />
{/if}

<style>
  .main-content {
    padding: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
  }

  /* ── Toolbar ─────────────────────────────────────────────────────── */
  .toolbar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .search-input {
    flex: 1;
    padding: 0.6rem 0.8rem;
    border: 1px solid #333;
    border-radius: 8px;
    background: #1a1a1a;
    color: #e8e8e8;
    font-size: 0.85rem;
    outline: none;
  }
  .search-input:focus {
    border-color: #3b82f6;
  }

  /* ── Load More ───────────────────────────────────────────────────── */
  .load-more {
    display: flex;
    justify-content: center;
    padding: 1rem;
  }

  /* ── Empty / Loading ─────────────────────────────────────────────── */
  .empty-state {
    text-align: center;
    color: #555;
    padding: 3rem 1rem;
    font-size: 0.9rem;
  }
  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 3rem 1rem;
    color: #888;
    font-size: 0.9rem;
  }
  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid #333;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Buttons ─────────────────────────────────────────────────────── */
  .btn {
    padding: 0.55rem 1.2rem;
    border: 1px solid #333;
    border-radius: 8px;
    background: #1a1a1a;
    color: #e8e8e8;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .btn:hover:not(:disabled) {
    background: #2a2a2a;
  }
  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .btn.primary {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #fff;
  }
  .btn.primary:hover:not(:disabled) {
    background: #2563eb;
  }
</style>
