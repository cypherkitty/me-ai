<script>
  import { onMount } from "svelte";
  import ErrorCard from "../shared/ErrorCard.svelte";
  import ProfileCard from "./ProfileCard.svelte";
  import SyncStatus from "./SyncStatus.svelte";
  import MessageList from "./MessageList.svelte";
  import MessageModal from "./MessageModal.svelte";
  import { mountLog } from "../../lib/debug.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  onMount(() => mountLog("DashboardView"));

  let {
    error = null,
    profile = null,
    loadingProfile = false,
    emailMessages = [],
    totalLocalMessages = 0,
    hasMoreLocal = false,
    loadingMessages = false,
    selectedMessage = null,
    syncStatus = null,
    syncProgress = null,
    isSyncing = false,
    searchQuery = $bindable(),
    onsignout,
    onsearch,
    onloadmore,
    onviewmessage,
    onclosedetail,
    ondismisserror,
    onsync,
    onsyncmore,
    oncleardata,
  } = $props();
</script>

<div class="max-w-[800px] mx-auto px-6 py-6">
  {#if error}
    <ErrorCard {error} ondismiss={ondismisserror} {onsignout} />
  {/if}

  <ProfileCard {profile} {loadingProfile} {onsignout} />

  <SyncStatus {syncStatus} {syncProgress} {isSyncing} {onsync} {onsyncmore} onclear={oncleardata} />

  <!-- Search toolbar -->
  <div class="flex gap-2 mb-4">
    <Input
      type="text"
      placeholder="Search stored emails (subject, sender, snippet)…"
      bind:value={searchQuery}
      onkeydown={(e) => e.key === "Enter" && onsearch()}
      class="flex-1"
    />
    <Button onclick={onsearch} disabled={loadingMessages} class="shrink-0">
      {loadingMessages ? "Searching…" : "Search"}
    </Button>
  </div>

  <!-- Message list -->
  {#if emailMessages.length > 0}
    <p class="text-xs text-muted-foreground/40 px-1 mb-2">
      Showing {emailMessages.length} of {totalLocalMessages.toLocaleString()}
      {searchQuery ? " matching" : ""} emails
    </p>
    <MessageList messages={emailMessages} onselect={onviewmessage} />

    {#if hasMoreLocal}
      <div class="flex justify-center pt-4">
        <Button variant="outline" onclick={onloadmore} disabled={loadingMessages}>
          {loadingMessages ? "Loading…" : "Load More"}
        </Button>
      </div>
    {/if}

  {:else if loadingMessages}
    <div class="flex items-center justify-center gap-2.5 py-12 text-sm text-muted-foreground/50">
      <span class="size-[18px] rounded-full border-2 border-border border-t-primary animate-spin shrink-0"></span>
      Loading messages…
    </div>

  {:else if syncStatus?.synced}
    <div class="text-center py-12 text-sm text-muted-foreground/40">
      {#if searchQuery}
        <p>No emails match "{searchQuery}".</p>
      {:else}
        <p>No emails in local storage. Click "Sync New" to download.</p>
      {/if}
    </div>

  {:else}
    <div class="text-center py-12 text-sm text-muted-foreground/40">
      <p>Sync your emails to browse them locally.</p>
    </div>
  {/if}
</div>

{#if selectedMessage}
  <MessageModal message={selectedMessage} loading={false} onclose={onclosedetail} />
{/if}
