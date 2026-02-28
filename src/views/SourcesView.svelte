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
  import SetupGuide    from "../components/dashboard/SetupGuide.svelte";
  import DashboardView from "../components/dashboard/DashboardView.svelte";
  import { Badge }      from "$lib/components/ui/badge/index.js";
  import { Switch }     from "$lib/components/ui/switch/index.js";
  import { Button }     from "$lib/components/ui/button/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Separator }  from "$lib/components/ui/separator/index.js";
  import { cn }         from "$lib/utils.js";
  import { ChevronDown, Info, Database } from "lucide-svelte";

  // ── Sources list ───────────────────────────────────────────────────
  let sources        = $state([]);
  let loadingSources = $state(true);
  let activeSource   = $state(null);

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
    try { sources = await getSources(); }
    catch (e) { console.error("SourcesView load error:", e); }
    loadingSources = false;
  }

  async function toggleSource(s) {
    if (SOURCE_META[s.name]?.status === "coming_soon") return;
    await setSourceEnabled(s.name, !s.enabled);
    s.enabled = !s.enabled;
  }

  function togglePanel(name) { activeSource = activeSource === name ? null : name; }

  onMount(loadSources);

  const connected    = $derived(sources.filter(s => SOURCE_META[s.name]?.status === "connected"));
  const notConnected = $derived(sources.filter(s => SOURCE_META[s.name]?.status !== "connected"));

  // ── Gmail auth + sync ──────────────────────────────────────────────
  const DEFAULT_CLIENT_ID = "562478245230-1gohf6dtsajqo1lu3kge9k7cthm4sdv6.apps.googleusercontent.com";

  let clientId        = $state(import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID);
  let clientIdInput   = $state(import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID);
  let authInitialized = $state(false);

  let accessToken   = $state(null);
  let profile       = $state(null);
  let gmailError    = $state(null);
  let loadingAuth   = $state(false);
  let loadingProfile = $state(false);

  let emailMessages      = $state([]);
  let totalLocalMessages = $state(0);
  let localOffset        = $state(0);
  let loadingMessages    = $state(false);
  let searchQuery        = $state("");
  let selectedMessage    = $state(null);

  let syncStatus   = $state(null);
  let syncProgress = $state(null);
  let isSyncing    = $state(false);
  let refreshTimer = $state(null);

  const LOCAL_PAGE_SIZE    = 50;
  const isSignedIn         = $derived(!!accessToken);
  const needsSetup         = $derived(!clientId);
  const isDefaultClientId  = $derived(clientId === DEFAULT_CLIENT_ID);
  const hasMoreLocal       = $derived(emailMessages.length < totalLocalMessages);

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
          if (!accessToken) {
            const saved = await getSavedToken();
            if (saved) {
              accessToken = saved.access_token;
              scheduleTokenRefresh();
              fetchProfile();
            }
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
        accessToken = null;
        profile = null;
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
      accessToken = null;
      profile = null;
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
  }

  async function clearClientId() {
    await removeSetting("googleClientId");
    clientId = "";
    clientIdInput = DEFAULT_CLIENT_ID;
    authInitialized = false;
    accessToken = null;
    profile = null;
    emailMessages = [];
    totalLocalMessages = 0;
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
    accessToken = null;
    profile = null;
    emailMessages = [];
    totalLocalMessages = 0;
    selectedMessage = null;
    gmailError = null;
    await removeSetting("gmail-profile");
  }

  async function fetchProfile() {
    loadingProfile = true;
    try {
      const r = await getProfile(accessToken);
      if (!accessToken) return;
      profile = r;
      await setSetting("gmail-profile", r);
    } catch (e) {
      if (!accessToken) return;
      gmailError = `Profile fetch failed: ${e.message}`;
    } finally {
      loadingProfile = false;
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
  function viewMessage(msg) { selectedMessage = msg; }

  async function refreshSyncStatus() {
    try { syncStatus = await getGmailSyncStatus(); } catch {}
  }

  async function startSync(limit) {
    if (isSyncing || !accessToken) return;
    const token = await ensureValidToken();
    if (!token) return;
    gmailError = null;
    isSyncing = true;
    syncProgress = null;
    try {
      await syncGmail(token, { limit, onProgress: p => { syncProgress = { ...p }; } });
      await refreshSyncStatus();
      await loadLocalMessages(false);
    } catch (e) {
      if (e.name !== "AbortError" && accessToken) gmailError = `Sync failed: ${e.message}`;
    } finally {
      isSyncing = false;
    }
  }

  async function startSyncMore(limit) {
    if (isSyncing || !accessToken) return;
    const token = await ensureValidToken();
    if (!token) return;
    gmailError = null;
    isSyncing = true;
    syncProgress = null;
    try {
      await syncGmailMore(token, { limit, onProgress: p => { syncProgress = { ...p }; } });
      await refreshSyncStatus();
      await loadLocalMessages(false);
    } catch (e) {
      if (e.name !== "AbortError" && accessToken) gmailError = `Sync more failed: ${e.message}`;
    } finally {
      isSyncing = false;
    }
  }

  async function handleClearData() {
    try {
      await clearGmailData();
      await refreshSyncStatus();
      emailMessages = [];
      totalLocalMessages = 0;
      localOffset = 0;
    } catch (e) {
      gmailError = `Failed to clear data: ${e.message}`;
    }
  }
</script>

<div class="flex flex-col h-full overflow-hidden">
  <div class="px-8 pt-5 pb-4 shrink-0 border-b border-border">
    <div class="flex items-center gap-2 mb-0.5">
      <h1 class="text-sm font-semibold tracking-tight text-foreground">Sources</h1>
      <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ connected</span>
    </div>
    <p class="text-xs text-muted-foreground">{sources.filter(s => s.enabled).length} active — click a source to manage auth and sync.</p>
  </div>

  <ScrollArea class="flex-1 px-8 pb-6">
    {#if loadingSources}
      <div class="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <div class="size-5 rounded-full border-2 border-border border-t-primary animate-spin"></div>
        <span class="text-xs">Loading sources…</span>
      </div>
    {:else}
      <div class="flex flex-col gap-5">
        <!-- Connected sources -->
        <section class="flex flex-col gap-2">
          <div class="flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-success"></span>
            <span class="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground/50">Connected</span>
          </div>
          <div class="flex flex-col gap-1.5">
            {#each connected as s (s.name)}
              {@const meta = SOURCE_META[s.name] ?? {}}
              <div class="flex flex-col">
                <!-- Source card row -->
                <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
                <div
                  class={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded border bg-card transition-colors cursor-pointer",
                    activeSource === s.name
                      ? "border-primary/30 rounded-b-none"
                      : "border-border/50 hover:border-border"
                  )}
                  role="button"
                  tabindex="0"
                  onclick={() => togglePanel(s.name)}
                >
                  <div
                    class="size-8 rounded flex items-center justify-center text-sm font-black shrink-0"
                    style="background:{meta.color}15;color:{meta.color};"
                  >
                    {meta.icon ?? s.name[0].toUpperCase()}
                  </div>
                  <div class="flex-1 min-w-0">
                    <span class="block text-sm font-semibold text-foreground">{s.label}</span>
                    <span class="text-xs text-muted-foreground capitalize">{s.platform ?? meta.platform}</span>
                  </div>
                  <div
                    class="flex items-center gap-2 shrink-0"
                    role="none"
                    onclick={(e) => e.stopPropagation()}
                  >
                    {#if isSignedIn && s.name === "gmail"}
                      <Badge variant="secondary" class="gap-1.5 max-w-[160px]">
                        <span class="size-1.5 rounded-full bg-success shrink-0"></span>
                        <span class="truncate">{profile?.emailAddress ?? "Signed in"}</span>
                      </Badge>
                    {:else}
                      <Badge variant="secondary" class="gap-1.5">
                        <span class="size-1.5 rounded-full bg-success shrink-0"></span>
                        Active
                      </Badge>
                    {/if}
                    <Switch
                      checked={s.enabled}
                      onCheckedChange={() => toggleSource(s)}
                      aria-label={s.enabled ? `Disable ${s.label}` : `Enable ${s.label}`}
                    />
                  </div>
                  <ChevronDown
                    class={cn("size-4 text-muted-foreground/40 shrink-0 transition-transform", activeSource === s.name && "rotate-180")}
                  />
                </div>

                <!-- Expanded Gmail panel -->
                {#if activeSource === s.name && s.name === "gmail"}
                  <div class="border border-t-0 border-primary/30 rounded-b overflow-hidden bg-background min-h-[400px] max-h-[70dvh] overflow-y-auto">
                    {#if needsSetup}
                      <SetupGuide
                        bind:clientIdInput
                        onsave={saveClientId}
                        defaultClientId={DEFAULT_CLIENT_ID}
                      />
                    {:else if !isSignedIn}
                      <div class="flex flex-col gap-4 p-6 max-w-sm">
                        {#if gmailError}
                          <div class="px-3 py-2.5 rounded bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                            {gmailError}
                          </div>
                        {/if}
                        <p class="text-sm text-muted-foreground leading-relaxed">Sign in with Google to browse and sync Gmail messages.</p>
                        <button
                          class="flex items-center justify-center gap-2.5 w-full max-w-[280px] h-9 px-4 rounded border border-border bg-white text-zinc-800 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                          onclick={signIn}
                          disabled={loadingAuth}
                        >
                          {#if loadingAuth}
                            <div class="size-4 border-2 border-border border-t-primary rounded-full animate-spin"></div>
                            Signing in…
                          {:else}
                            <svg viewBox="0 0 24 24" width="16" height="16">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Sign in with Google
                          {/if}
                        </button>
                        <p class="text-xs text-muted-foreground/60">
                          Popup blocked?
                          <a href="/oauth-redirect.html" class="text-primary hover:underline">Use redirect flow</a>
                        </p>
                        <div class="flex items-center gap-1.5 text-xs text-muted-foreground/50">
                          <span>Client ID:</span>
                          {#if isDefaultClientId}
                            <Badge variant="secondary" class="text-xs">shared default</Badge>
                          {:else}
                            <code class="font-mono text-muted-foreground/60">{clientId.slice(0, 20)}…</code>
                          {/if}
                          <Button variant="ghost" size="sm" onclick={clearClientId} class="h-5 text-xs px-1.5 text-primary">Change</Button>
                        </div>
                      </div>
                    {:else}
                      <DashboardView
                        error={gmailError}
                        {profile}
                        {loadingProfile}
                        {emailMessages}
                        {totalLocalMessages}
                        {hasMoreLocal}
                        {loadingMessages}
                        {selectedMessage}
                        {syncStatus}
                        {syncProgress}
                        {isSyncing}
                        bind:searchQuery
                        onsignout={signOut}
                        onsearch={searchLocal}
                        onloadmore={loadMoreLocal}
                        onviewmessage={viewMessage}
                        onclosedetail={() => selectedMessage = null}
                        ondismisserror={() => gmailError = null}
                        onsync={startSync}
                        onsyncmore={startSyncMore}
                        oncleardata={handleClearData}
                      />
                    {/if}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </section>

        <!-- Available / coming soon -->
        {#if notConnected.length}
          <section class="flex flex-col gap-2">
            <div class="flex items-center gap-1.5">
              <span class="size-1.5 rounded-full bg-muted-foreground/30"></span>
              <span class="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground/40">Available Sources</span>
            </div>
            <div class="flex flex-col gap-1.5">
              {#each notConnected as s (s.name)}
                {@const meta = SOURCE_META[s.name] ?? {}}
                <div class="flex items-center gap-3 px-3.5 py-3 rounded border bg-card/50 border-border/30 opacity-50">
                  <div
                    class="size-8 rounded bg-muted border border-border flex items-center justify-center text-sm font-black shrink-0"
                    style="color:{meta.color ?? '#6b7280'};"
                  >
                    {meta.icon ?? s.name[0].toUpperCase()}
                  </div>
                  <div class="flex-1 min-w-0">
                    <span class="block text-sm font-semibold text-foreground">{s.label}</span>
                    <span class="text-xs text-muted-foreground capitalize">{s.platform ?? meta.platform}</span>
                  </div>
                  <Badge variant="outline" class="text-[0.62rem] text-muted-foreground/50 border-border/30">Coming soon</Badge>
                </div>
              {/each}
            </div>
          </section>
        {/if}

        <!-- Info box -->
        <div class="flex items-start gap-2.5 px-3.5 py-3 rounded border border-border/40 bg-muted/20 text-muted-foreground">
          <Info class="size-3.5 shrink-0 mt-0.5 opacity-60" />
          <p class="text-xs leading-relaxed">
            Click a connected source to manage auth, sync emails, and browse messages.
            Disabling a source stops new events from being ingested without affecting existing rules.
          </p>
        </div>
      </div>
    {/if}
  </ScrollArea>
</div>
