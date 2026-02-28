<script>
  import { onMount } from "svelte";
  import { getSources, setSourceEnabled } from "../lib/rules.js";
  import { getSetting, setSetting, removeSetting } from "../lib/store/settings.js";
  import {
    initGoogleAuth, requestAccessToken, revokeToken,
    getSavedToken, isTokenValid, getTokenTTL, refreshToken,
  } from "../lib/google-auth.js";
  import { getProfile } from "../lib/gmail-api.js";
  import { syncGmail, syncGmailMore, getGmailSyncStatus, clearGmailData } from "../lib/store/gmail-sync.js";
  import { getStoredEmails } from "../lib/store/query-layer.js";
  import MessageList   from "../components/dashboard/MessageList.svelte";
  import MessageModal  from "../components/dashboard/MessageModal.svelte";
  import { Badge }      from "$lib/components/ui/badge/index.js";
  import { Button }     from "$lib/components/ui/button/index.js";
  import { Input }      from "$lib/components/ui/input/index.js";
  import { Progress }   from "$lib/components/ui/progress/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { cn }         from "$lib/utils.js";
  import { RefreshCw, LogOut, Trash2, Search, Database, Mail } from "lucide-svelte";

  // ── Sources list ───────────────────────────────────────────────────
  let sources        = $state([]);
  let loadingSources = $state(true);

  const SOURCE_META = {
    gmail:     { color: "#ea4335", icon: "M", platform: "Email",     status: "connected"   },
    telegram:  { color: "#26a5e4", icon: "T", platform: "Messenger", status: "coming_soon" },
    instagram: { color: "#e1306c", icon: "I", platform: "Social",    status: "coming_soon" },
    youtube:   { color: "#ff0000", icon: "Y", platform: "Video",     status: "coming_soon" },
    slack:     { color: "#611f69", icon: "S", platform: "Messenger", status: "coming_soon" },
    twitter:   { color: "#1da1f2", icon: "X", platform: "Social",    status: "coming_soon" },
  };

  async function loadSources() {
    loadingSources = true;
    try { sources = await getSources(); } catch {}
    loadingSources = false;
  }

  onMount(loadSources);

  const notConnected = $derived(sources.filter(s => SOURCE_META[s.name]?.status !== "connected"));

  // ── Gmail auth + sync ──────────────────────────────────────────────
  const DEFAULT_CLIENT_ID = "562478245230-1gohf6dtsajqo1lu3kge9k7cthm4sdv6.apps.googleusercontent.com";

  let clientId        = $state(import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID);
  let clientIdInput   = $state(import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID);
  let authInitialized = $state(false);
  let showClientIdEdit = $state(false);

  let accessToken    = $state(null);
  let profile        = $state(null);
  let gmailError     = $state(null);
  let loadingAuth    = $state(false);

  let emailMessages      = $state([]);
  let totalLocalMessages = $state(0);
  let localOffset        = $state(0);
  let loadingMessages    = $state(false);
  let searchQuery        = $state("");
  let selectedMessage    = $state(null);

  let syncStatus      = $state(null);
  let syncProgress    = $state(null);
  let isSyncing       = $state(false);
  let syncLimit       = $state(50);
  let showClearConfirm = $state(false);
  let refreshTimer    = $state(null);

  const LIMIT_OPTIONS = [50, 100, 200, 500];

  const LOCAL_PAGE_SIZE   = 50;
  const isSignedIn        = $derived(!!accessToken);
  const isDefaultClientId = $derived(clientId === DEFAULT_CLIENT_ID);
  const hasMoreLocal      = $derived(emailMessages.length < totalLocalMessages);

  onMount(async () => {
    const saved = await getSetting("googleClientId");
    clientId      = saved || DEFAULT_CLIENT_ID;
    clientIdInput = saved || DEFAULT_CLIENT_ID;
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  });

  function handleKeydown(e) {
    if (e.key === "Escape" && selectedMessage) selectedMessage = null;
  }

  $effect(() => {
    if (clientId && !authInitialized) {
      initGoogleAuth(clientId)
        .then(async () => {
          authInitialized = true;
          const saved = await getSavedToken();
          if (saved) {
            accessToken = saved.access_token;
            scheduleTokenRefresh();
            fetchProfile();
          }
        })
        .catch(e => { gmailError = `Auth init failed: ${e.message}`; });
    }
  });

  $effect(() => {
    if (accessToken) { refreshSyncStatus(); loadLocalMessages(); }
  });

  function scheduleTokenRefresh() {
    if (refreshTimer) clearTimeout(refreshTimer);
    const ttl = getTokenTTL();
    if (ttl <= 0) return;
    const delay = Math.max(0, ttl - 2 * 60 * 1000);
    refreshTimer = setTimeout(async () => {
      try {
        const r = await refreshToken();
        accessToken = r.access_token;
        scheduleTokenRefresh();
      } catch {
        accessToken = null; profile = null;
        gmailError = "Session expired. Please sign in again.";
      }
    }, delay);
  }

  async function ensureValidToken() {
    if (isTokenValid()) return accessToken;
    try {
      const r = await refreshToken();
      accessToken = r.access_token;
      scheduleTokenRefresh();
      return accessToken;
    } catch {
      accessToken = null; profile = null;
      gmailError = "Session expired. Please sign in again.";
      return null;
    }
  }

  async function saveClientId() {
    const t = clientIdInput.trim();
    if (!t) return;
    await setSetting("googleClientId", t);
    clientId = t;
    gmailError = null;
    showClientIdEdit = false;
  }

  async function signIn() {
    gmailError = null;
    loadingAuth = true;
    try {
      if (!authInitialized) { await initGoogleAuth(clientId); authInitialized = true; }
      const r = await requestAccessToken();
      accessToken = r.access_token;
      scheduleTokenRefresh();
      await fetchProfile();
    } catch (e) {
      gmailError = e.message;
    } finally {
      loadingAuth = false;
    }
  }

  async function signOut() {
    if (refreshTimer) clearTimeout(refreshTimer);
    if (accessToken) { try { await revokeToken(accessToken); } catch (_) {} }
    accessToken = null; profile = null;
    emailMessages = []; totalLocalMessages = 0;
    selectedMessage = null; gmailError = null;
    await removeSetting("gmail-profile");
  }

  async function fetchProfile() {
    try {
      const r = await getProfile(accessToken);
      if (!accessToken) return;
      profile = r;
      await setSetting("gmail-profile", r);
    } catch (e) {
      if (!accessToken) return;
      gmailError = `Profile fetch failed: ${e.message}`;
    }
  }

  async function loadLocalMessages(append = false) {
    loadingMessages = true;
    try {
      const offset = append ? localOffset : 0;
      const result = await getStoredEmails({ query: searchQuery || undefined, limit: LOCAL_PAGE_SIZE, offset });
      emailMessages = append ? [...emailMessages, ...result.items] : result.items;
      totalLocalMessages = result.total;
      localOffset = emailMessages.length;
    } catch (e) {
      gmailError = `Failed to load messages: ${e.message}`;
    } finally {
      loadingMessages = false;
    }
  }

  function searchLocal() { localOffset = 0; loadLocalMessages(false); }
  function loadMoreLocal() { loadLocalMessages(true); }

  async function refreshSyncStatus() {
    try { syncStatus = await getGmailSyncStatus(); } catch {}
  }

  async function startSync(limit) {
    if (isSyncing || !accessToken) return;
    const token = await ensureValidToken();
    if (!token) return;
    gmailError = null; isSyncing = true; syncProgress = null;
    try {
      await syncGmail(token, { limit, onProgress: p => { syncProgress = { ...p }; } });
      await refreshSyncStatus();
      await loadLocalMessages(false);
    } catch (e) {
      if (e.name !== "AbortError" && accessToken) gmailError = `Sync failed: ${e.message}`;
    } finally { isSyncing = false; }
  }

  async function startSyncMore(limit) {
    if (isSyncing || !accessToken) return;
    const token = await ensureValidToken();
    if (!token) return;
    gmailError = null; isSyncing = true; syncProgress = null;
    try {
      await syncGmailMore(token, { limit, onProgress: p => { syncProgress = { ...p }; } });
      await refreshSyncStatus();
      await loadLocalMessages(false);
    } catch (e) {
      if (e.name !== "AbortError" && accessToken) gmailError = `Sync more failed: ${e.message}`;
    } finally { isSyncing = false; }
  }

  async function handleClearData() {
    try {
      await clearGmailData();
      await refreshSyncStatus();
      emailMessages = []; totalLocalMessages = 0; localOffset = 0;
      showClearConfirm = false;
    } catch (e) {
      gmailError = `Failed to clear data: ${e.message}`;
    }
  }

  function formatTimeAgo(ts) {
    if (!ts) return "never";
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  function progressPct() {
    if (!syncProgress?.total || !syncProgress?.current) return 0;
    return Math.round((syncProgress.current / syncProgress.total) * 100);
  }
</script>

<div class="flex h-full overflow-hidden">

  <!-- ── Left sidebar ───────────────────────────────────────────── -->
  <div class="w-72 shrink-0 flex flex-col border-r border-border bg-sidebar overflow-hidden">
    <ScrollArea class="flex-1">
      <div class="p-4 flex flex-col gap-4">

        <!-- Gmail source header -->
        <div>
          <p class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">Connected Account</p>

          {#if isSignedIn && profile}
            <!-- Account card -->
            <div class="rounded-lg border border-success/20 bg-card p-3 flex flex-col gap-3">
              <div class="flex items-center gap-2.5">
                <div class="size-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {profile.emailAddress?.[0]?.toUpperCase() ?? "G"}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-foreground truncate">{profile.emailAddress}</p>
                  <div class="flex items-center gap-1 mt-0.5">
                    <span class="size-1.5 rounded-full bg-success shrink-0"></span>
                    <span class="text-[0.65rem] text-success">Connected</span>
                  </div>
                </div>
              </div>
              {#if syncStatus?.synced}
                <p class="text-[0.65rem] text-muted-foreground/60">
                  {syncStatus.totalItems.toLocaleString()} msgs
                </p>
              {/if}
              <button
                onclick={signOut}
                class="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground/50 hover:text-destructive transition-colors w-fit"
              >
                <LogOut class="size-3" />Sign out
              </button>
            </div>

          {:else if loadingAuth}
            <div class="rounded-lg border border-border bg-card p-4 flex items-center gap-2.5 text-sm text-muted-foreground">
              <div class="size-4 border-2 border-border border-t-primary rounded-full animate-spin shrink-0"></div>
              Signing in…
            </div>

          {:else}
            <!-- Sign-in card -->
            <div class="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
              <div class="flex items-center gap-2.5">
                <div class="size-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Mail class="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p class="text-sm font-medium text-foreground">Gmail</p>
                  <p class="text-[0.65rem] text-muted-foreground">Not connected</p>
                </div>
              </div>

              {#if gmailError}
                <p class="text-[0.7rem] text-destructive leading-relaxed">{gmailError}</p>
              {/if}

              <button
                onclick={signIn}
                disabled={loadingAuth}
                class="flex items-center justify-center gap-2 w-full h-8 px-3 rounded border border-border bg-white text-zinc-800 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" class="shrink-0">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
              <p class="text-[0.65rem] text-muted-foreground/40 text-center">
                Popup blocked?
                <a href="#oauth-redirect" class="text-primary hover:underline">Use redirect flow</a>
              </p>
            </div>

            <!-- Client ID row -->
            {#if !showClientIdEdit}
              <div class="flex items-center gap-1.5 mt-2 text-[0.65rem] text-muted-foreground/40">
                <span>Client ID:</span>
                {#if isDefaultClientId}
                  <span class="font-medium text-muted-foreground/60">shared default</span>
                {:else}
                  <code class="font-mono">{clientId.slice(0, 16)}…</code>
                {/if}
                <button onclick={() => showClientIdEdit = true} class="text-primary hover:underline ml-auto">Change</button>
              </div>
            {:else}
              <div class="mt-2 flex flex-col gap-1.5">
                <Input
                  bind:value={clientIdInput}
                  placeholder="Paste your Client ID…"
                  class="h-7 text-xs font-mono"
                />
                <div class="flex gap-1.5">
                  <Button size="sm" onclick={saveClientId} class="flex-1 h-7 text-xs">Save</Button>
                  <Button variant="outline" size="sm" onclick={() => showClientIdEdit = false} class="h-7 text-xs">Cancel</Button>
                </div>
              </div>
            {/if}
          {/if}
        </div>

        <!-- Local storage + sync (only when signed in) -->
        {#if isSignedIn}
          <div>
            <p class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">Local Storage</p>
            <div class="rounded-lg border border-border bg-card p-3 flex flex-col gap-3">
              <!-- Stats -->
              <div class="flex items-center gap-2">
                <Database class="size-3.5 text-muted-foreground/50 shrink-0" />
                <span class="text-sm font-medium text-foreground">
                  {syncStatus?.synced ? syncStatus.totalItems.toLocaleString() : "0"} emails stored
                </span>
              </div>

              {#if syncStatus?.synced}
                <div class="flex flex-col gap-0.5 text-[0.65rem] text-muted-foreground/50">
                  <span>Last synced {formatTimeAgo(syncStatus.lastSyncAt)}</span>
                  {#if syncStatus.hasMore}
                    <span class="text-warning">More emails available</span>
                  {:else}
                    <span class="text-success">All synced</span>
                  {/if}
                </div>
              {/if}

              <!-- Progress bar -->
              {#if isSyncing && syncProgress}
                <div class="flex flex-col gap-1">
                  <Progress value={syncProgress.total ? progressPct() : null} class="h-1" />
                  <p class="text-[0.65rem] text-muted-foreground/50">{syncProgress.message || "Syncing…"}</p>
                </div>
              {/if}

              <!-- Sync controls -->
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground/50">
                  <span>Batch</span>
                  <select
                    bind:value={syncLimit}
                    disabled={isSyncing}
                    class="h-6 px-1.5 text-xs rounded border border-input bg-background text-foreground"
                  >
                    {#each LIMIT_OPTIONS as opt}
                      <option value={opt}>{opt}</option>
                    {/each}
                  </select>
                </div>
                <Button
                  size="sm"
                  onclick={() => syncStatus?.synced ? startSync(syncLimit) : startSync(syncLimit)}
                  disabled={isSyncing}
                  class="flex-1 gap-1.5 h-7 text-xs"
                >
                  <RefreshCw class={cn("size-3", isSyncing && "animate-spin")} />
                  {isSyncing ? "Syncing…" : syncStatus?.synced ? "Sync New" : "Download"}
                </Button>
                {#if syncStatus?.synced && syncStatus.hasMore}
                  <Button
                    variant="outline"
                    size="sm"
                    onclick={() => startSyncMore(syncLimit)}
                    disabled={isSyncing}
                    class="h-7 text-xs"
                  >
                    More
                  </Button>
                {/if}
              </div>

              <!-- Clear data -->
              {#if syncStatus?.synced}
                {#if showClearConfirm}
                  <div class="flex flex-col gap-2 pt-2 border-t border-border">
                    <p class="text-[0.65rem] text-muted-foreground/60">Delete all locally stored emails?</p>
                    <div class="flex gap-1.5">
                      <Button variant="destructive" size="sm" onclick={handleClearData} class="flex-1 h-7 text-xs">Delete</Button>
                      <Button variant="outline" size="sm" onclick={() => showClearConfirm = false} class="flex-1 h-7 text-xs">Cancel</Button>
                    </div>
                  </div>
                {:else}
                  <button
                    onclick={() => showClearConfirm = true}
                    class="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground/30 hover:text-destructive transition-colors w-fit"
                  >
                    <Trash2 class="size-3" />Clear local data
                  </button>
                {/if}
              {/if}
            </div>
          </div>
        {/if}

        <!-- Available sources (coming soon) -->
        {#if !loadingSources && notConnected.length}
          <div>
            <p class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">Available Sources</p>
            <div class="flex flex-col gap-1">
              {#each notConnected as s (s.name)}
                {@const meta = SOURCE_META[s.name] ?? {}}
                <div class="flex items-center gap-2.5 px-3 py-2 rounded border border-border/30 bg-card/50 opacity-50">
                  <div
                    class="size-6 rounded text-xs font-black flex items-center justify-center shrink-0"
                    style="color:{meta.color ?? '#6b7280'}; background:{(meta.color ?? '#6b7280')}15;"
                  >
                    {meta.icon ?? s.name[0].toUpperCase()}
                  </div>
                  <div class="flex-1 min-w-0">
                    <span class="text-xs font-medium text-foreground">{s.label}</span>
                    <span class="text-[0.65rem] text-muted-foreground/50 ml-1.5 capitalize">{meta.platform}</span>
                  </div>
                  <span class="text-[0.6rem] text-muted-foreground/30">Soon</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}

      </div>
    </ScrollArea>
  </div>

  <!-- ── Right panel: email browser ────────────────────────────── -->
  <div class="flex-1 overflow-hidden flex flex-col bg-background">
    {#if isSignedIn}
      <!-- Search bar -->
      <div class="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search subjects, senders, or snippets…"
            bind:value={searchQuery}
            onkeydown={(e) => e.key === "Enter" && searchLocal()}
            class="pl-9"
          />
        </div>
        <Button onclick={searchLocal} disabled={loadingMessages} variant="outline" class="shrink-0 gap-1.5">
          {loadingMessages ? "Searching…" : "Search"}
        </Button>
        {#if totalLocalMessages > 0}
          <span class="text-xs text-muted-foreground/50 shrink-0 whitespace-nowrap">
            {emailMessages.length} of {totalLocalMessages.toLocaleString()}
          </span>
        {/if}
      </div>

      <!-- Error banner -->
      {#if gmailError}
        <div class="mx-4 mt-3 px-3 py-2 rounded border border-destructive/30 bg-destructive/8 text-xs text-destructive flex items-center justify-between shrink-0">
          <span>{gmailError}</span>
          <button onclick={() => gmailError = null} class="ml-2 text-destructive/60 hover:text-destructive">✕</button>
        </div>
      {/if}

      <!-- Message list -->
      <ScrollArea class="flex-1">
        <div class="p-4">
          {#if emailMessages.length > 0}
            <MessageList messages={emailMessages} onselect={(msg) => selectedMessage = msg} />
            {#if hasMoreLocal}
              <div class="flex justify-center pt-4">
                <Button variant="outline" onclick={loadMoreLocal} disabled={loadingMessages}>
                  {loadingMessages ? "Loading…" : "Load More"}
                </Button>
              </div>
            {/if}

          {:else if loadingMessages}
            <div class="flex items-center justify-center gap-2.5 py-16 text-sm text-muted-foreground/50">
              <div class="size-4 border-2 border-border border-t-primary rounded-full animate-spin shrink-0"></div>
              Loading messages…
            </div>

          {:else}
            <div class="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <Database class="size-8 text-muted-foreground/20" />
              <p class="text-sm text-muted-foreground/50">
                {searchQuery ? `No emails match "${searchQuery}"` : "No emails synced yet — click Download in the sidebar"}
              </p>
            </div>
          {/if}
        </div>
      </ScrollArea>

    {:else}
      <!-- Not signed in state -->
      <div class="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
        <div class="size-14 rounded-2xl bg-muted flex items-center justify-center">
          <Mail class="size-7 text-muted-foreground/40" />
        </div>
        <div>
          <p class="text-base font-semibold text-foreground mb-1">Connect your Gmail</p>
          <p class="text-sm text-muted-foreground/60 max-w-xs leading-relaxed">
            Sign in with Google in the sidebar to browse and sync your emails.
          </p>
        </div>
      </div>
    {/if}
  </div>

</div>

<!-- Message detail modal -->
{#if selectedMessage}
  <MessageModal message={selectedMessage} loading={false} onclose={() => selectedMessage = null} />
{/if}
