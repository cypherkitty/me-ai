<script>
  import { onMount } from "svelte";
  import { mountLog } from "../../lib/debug.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Progress } from "$lib/components/ui/progress/index.js";
  import { Card, CardContent } from "$lib/components/ui/card/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  onMount(() => mountLog("SyncStatus"));

  let {
    syncStatus = null,
    syncProgress = null,
    isSyncing = false,
    onsync,
    onsyncmore,
    onclear,
  } = $props();

  let showClearConfirm = $state(false);
  let syncLimit = $state(50);

  const LIMIT_OPTIONS = [
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 200, label: "200" },
    { value: 500, label: "500" },
    { value: 0, label: "All" },
  ];

  function formatTimeAgo(timestamp) {
    if (!timestamp) return "never";
    const secs = Math.floor((Date.now() - timestamp) / 1000);
    if (secs < 60) return "just now";
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  function progressPercent() {
    if (!syncProgress?.total || !syncProgress?.current) return 0;
    return Math.round((syncProgress.current / syncProgress.total) * 100);
  }
</script>

<Card class="mb-4">
  <CardContent class="pt-4 pb-4 px-4 flex flex-col gap-3">
    <!-- Header row -->
    <div class="flex items-center gap-3">
      <span class="text-muted-foreground/50 shrink-0">
        {#if isSyncing}
          <span class="size-[18px] inline-flex rounded-full border-2 border-border border-t-primary animate-spin"></span>
        {:else}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m0 0a9 9 0 0 1 9-9m-9 9a9 9 0 0 0 9 9" />
          </svg>
        {/if}
      </span>

      <div class="flex-1 flex flex-col gap-0.5 min-w-0">
        <span class="text-sm font-semibold text-foreground">Local Storage</span>
        <span class="text-xs text-muted-foreground/50">
          {#if syncStatus?.synced}
            {syncStatus.totalItems.toLocaleString()} emails stored
            · synced {formatTimeAgo(syncStatus.lastSyncAt)}
            · {syncStatus.hasMore ? "more available" : "all synced"}
          {:else}
            Not synced yet
          {/if}
        </span>
      </div>

      {#if syncStatus?.synced && !isSyncing}
        <button
          onclick={() => showClearConfirm = !showClearConfirm}
          title="Clear local data"
          class="text-muted-foreground/30 hover:text-destructive transition-colors p-1 rounded hover:bg-destructive/8"
          aria-label="Clear data"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M8 6V4h8v2m1 0v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6h10z" />
          </svg>
        </button>
      {/if}
    </div>

    <!-- Sync controls -->
    <div class="flex items-center gap-3 flex-wrap">
      <div class="flex items-center gap-2">
        <Label for="sync-limit" class="text-[0.68rem] uppercase tracking-wider opacity-50 whitespace-nowrap">Batch:</Label>
        <select
          id="sync-limit"
          bind:value={syncLimit}
          disabled={isSyncing}
          class="h-7 px-2 text-xs rounded border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {#each LIMIT_OPTIONS as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>

      <div class="flex gap-2 ml-auto">
        {#if syncStatus?.synced}
          <Button variant="outline" size="sm" onclick={() => onsync(syncLimit)} disabled={isSyncing}>
            {isSyncing ? "Syncing…" : "Sync New"}
          </Button>
          {#if syncStatus.hasMore}
            <Button size="sm" onclick={() => onsyncmore(syncLimit)} disabled={isSyncing}>
              {isSyncing ? "Loading…" : "Sync More"}
            </Button>
          {/if}
        {:else}
          <Button size="sm" onclick={() => onsync(syncLimit)} disabled={isSyncing}>
            {isSyncing ? "Syncing…" : "Download Emails"}
          </Button>
        {/if}
      </div>
    </div>

    <!-- Progress bar -->
    {#if isSyncing && syncProgress}
      <div class="flex flex-col gap-1.5">
        <Progress value={syncProgress.total ? progressPercent() : null} class="h-1" />
        <p class="text-[0.68rem] text-muted-foreground/50">{syncProgress.message || "Syncing…"}</p>
      </div>
    {/if}

    <!-- Clear confirmation -->
    {#if showClearConfirm}
      <div class="flex items-center justify-between gap-3 pt-2 border-t border-border">
        <span class="text-xs text-muted-foreground/60">Delete all locally stored emails?</span>
        <div class="flex gap-2">
          <Button variant="outline" size="sm" onclick={() => showClearConfirm = false}>Cancel</Button>
          <Button variant="destructive" size="sm" onclick={() => { onclear(); showClearConfirm = false; }}>Delete</Button>
        </div>
      </div>
    {/if}
  </CardContent>
</Card>
