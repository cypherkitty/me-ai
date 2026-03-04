<script>
  import { onMount } from "svelte";
  import { getSources, setSourceEnabled } from "../lib/rules.js";
  import {
    getSetting,
    setSetting,
    removeSetting,
  } from "../lib/store/settings.js";
  import {
    initGoogleAuth,
    requestAccessToken,
    revokeToken,
    getSavedToken,
    isTokenValid,
    getTokenTTL,
    refreshToken,
  } from "../lib/google-auth.js";
  import { getProfile } from "../lib/gmail-api.js";
  import {
    syncGmail,
    syncGmailMore,
    getGmailSyncStatus,
    clearGmailData,
  } from "../lib/store/gmail-sync.js";
  import { getStoredEmails } from "../lib/store/query-layer.js";
  import {
    initTwitterAuth,
    requestTwitterAccessToken,
    getSavedTwitterToken,
    isTwitterTokenValid,
    refreshTwitterToken,
    revokeTwitterToken,
    handleTwitterCallback,
  } from "../lib/twitter-auth.js";
  import { getMe as getTwitterMe } from "../lib/twitter-api.js";
  import {
    syncTwitter,
    syncTwitterMore,
    getTwitterSyncStatus,
    clearTwitterData,
  } from "../lib/store/twitter-sync.js";
  import { query } from "../lib/store/db.js";
  import MessageList from "../components/dashboard/MessageList.svelte";
  import MessageModal from "../components/dashboard/MessageModal.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Progress } from "$lib/components/ui/progress/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { cn } from "$lib/utils.js";
  import { RefreshCw, LogOut, Trash2, Search, Database } from "lucide-svelte";

  // ── Source metadata ────────────────────────────────────────────────
  const SOURCE_META = {
    gmail: {
      color: "#ea4335",
      icon: "M",
      label: "Gmail",
      platform: "Email",
      live: true,
    },
    telegram: {
      color: "#26a5e4",
      icon: "T",
      label: "Telegram",
      platform: "Messenger",
      live: false,
    },
    instagram: {
      color: "#e1306c",
      icon: "I",
      label: "Instagram",
      platform: "Social",
      live: false,
    },
    youtube: {
      color: "#ff0000",
      icon: "Y",
      label: "YouTube",
      platform: "Video",
      live: false,
    },
    slack: {
      color: "#611f69",
      icon: "S",
      label: "Slack",
      platform: "Messenger",
      live: false,
    },
    twitter: {
      color: "#1da1f2",
      icon: "X",
      label: "Twitter/X",
      platform: "Social",
      live: true,
    },
  };

  // All sources in display order (live first, then coming-soon alphabetical)
  const ALL_SOURCES = [
    "gmail",
    "telegram",
    "instagram",
    "slack",
    "twitter",
    "youtube",
  ];

  let sources = $state([]);
  let loadingSources = $state(true);
  let selectedSource = $state("gmail"); // always start on gmail

  async function loadSources() {
    loadingSources = true;
    try {
      sources = await getSources();
    } catch {}
    loadingSources = false;
  }
  onMount(loadSources);

  // ── Gmail auth + sync ──────────────────────────────────────────────
  const DEFAULT_CLIENT_ID =
    "562478245230-1gohf6dtsajqo1lu3kge9k7cthm4sdv6.apps.googleusercontent.com";

  let clientId = $state(
    import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID,
  );
  let clientIdInput = $state(
    import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID,
  );
  let authInitialized = $state(false);
  let showClientIdEdit = $state(false);

  let accessToken = $state(null);
  let profile = $state(null);
  let gmailError = $state(null);
  let loadingAuth = $state(false);

  let emailMessages = $state([]);
  let totalLocalMessages = $state(0);
  let localOffset = $state(0);
  let loadingMessages = $state(false);
  let searchQuery = $state("");
  let selectedMessage = $state(null);

  let syncStatus = $state(null);
  let syncProgress = $state(null);
  let isSyncing = $state(false);
  let syncLimit = $state(50);
  let showClearConfirm = $state(false);
  let refreshTimer = $state(null);

  const LIMIT_OPTIONS = [50, 100, 200, 500];
  const LOCAL_PAGE_SIZE = 50;
  const isSignedIn = $derived(!!accessToken);
  const isDefaultClientId = $derived(clientId === DEFAULT_CLIENT_ID);
  const hasMoreLocal = $derived(emailMessages.length < totalLocalMessages);

  onMount(async () => {
    const saved = await getSetting("googleClientId");
    clientId = saved || DEFAULT_CLIENT_ID;
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
        .catch((e) => {
          gmailError = `Auth init failed: ${e.message}`;
        });
    }
  });

  $effect(() => {
    if (accessToken) {
      refreshSyncStatus();
      loadLocalMessages();
    }
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
    showClientIdEdit = false;
  }

  async function signIn() {
    gmailError = null;
    loadingAuth = true;
    try {
      if (!authInitialized) {
        await initGoogleAuth(clientId);
        authInitialized = true;
      }
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
    if (accessToken) {
      try {
        await revokeToken(accessToken);
      } catch (_) {}
    }
    accessToken = null;
    profile = null;
    emailMessages = [];
    totalLocalMessages = 0;
    selectedMessage = null;
    gmailError = null;
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
      const result = await getStoredEmails({
        query: searchQuery || undefined,
        limit: LOCAL_PAGE_SIZE,
        offset,
      });
      emailMessages = append
        ? [...emailMessages, ...result.items]
        : result.items;
      totalLocalMessages = result.total;
      localOffset = emailMessages.length;
    } catch (e) {
      gmailError = `Failed to load messages: ${e.message}`;
    } finally {
      loadingMessages = false;
    }
  }

  function searchLocal() {
    localOffset = 0;
    loadLocalMessages(false);
  }
  function loadMoreLocal() {
    loadLocalMessages(true);
  }

  async function refreshSyncStatus() {
    try {
      syncStatus = await getGmailSyncStatus();
    } catch {}
  }

  async function startSync(limit) {
    if (isSyncing || !accessToken) return;
    const token = await ensureValidToken();
    if (!token) return;
    gmailError = null;
    isSyncing = true;
    syncProgress = null;
    try {
      await syncGmail(token, {
        limit,
        onProgress: (p) => {
          syncProgress = { ...p };
        },
      });
      await refreshSyncStatus();
      await loadLocalMessages(false);
    } catch (e) {
      if (e.name !== "AbortError" && accessToken)
        gmailError = `Sync failed: ${e.message}`;
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
      await syncGmailMore(token, {
        limit,
        onProgress: (p) => {
          syncProgress = { ...p };
        },
      });
      await refreshSyncStatus();
      await loadLocalMessages(false);
    } catch (e) {
      if (e.name !== "AbortError" && accessToken)
        gmailError = `Sync more failed: ${e.message}`;
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

  // ── Twitter/X state ─────────────────────────────────────────────────
  const TW_LOCAL_PAGE_SIZE = 50;

  let twClientId = $state("");
  let twClientIdInput = $state("");
  let twShowClientIdEdit = $state(false);
  let twAccessToken = $state(null);
  let twProfile = $state(null);
  let twError = $state(null);
  let twLoadingAuth = $state(false);

  let twMessages = $state([]);
  let twTotalMessages = $state(0);
  let twLocalOffset = $state(0);
  let twLoadingMessages = $state(false);
  let twSearchQuery = $state("");

  let twSyncStatus = $state(null);
  let twSyncProgress = $state(null);
  let twSyncing = $state(false);
  let twSyncLimit = $state(50);
  let twShowClearConfirm = $state(false);

  const twSignedIn = $derived(!!twAccessToken);

  // Init on mount
  onMount(async () => {
    // Restore saved client ID
    const savedTwId = await getSetting("twitterClientId");
    twClientId = savedTwId || "";
    twClientIdInput = savedTwId || "";

    if (twClientId) {
      initTwitterAuth(twClientId);
    }

    // Check for OAuth callback
    const hash = window.location.hash;
    if (hash.includes("oauth-twitter")) {
      const url = new URL(window.location.href.replace("/#", "/?"));
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      if (code && state) {
        try {
          const result = await handleTwitterCallback(code, state);
          twAccessToken = result.access_token;
          await twFetchProfile();
          // Clean up URL
          window.location.hash = "#sources";
        } catch (e) {
          twError = `Auth failed: ${e.message}`;
        }
      }
    }

    // Restore saved token
    if (!twAccessToken) {
      try {
        const saved = await getSavedTwitterToken();
        if (saved) {
          twAccessToken = saved.access_token;
          await twFetchProfile();
        }
      } catch {}
    }
  });

  async function twSaveClientId() {
    const t = twClientIdInput.trim();
    if (!t) return;
    await setSetting("twitterClientId", t);
    twClientId = t;
    initTwitterAuth(t);
    twShowClientIdEdit = false;
  }

  async function twSignIn() {
    twError = null;
    twLoadingAuth = true;
    try {
      if (!twClientId) {
        twError = "Set your Twitter Client ID first";
        twLoadingAuth = false;
        return;
      }
      initTwitterAuth(twClientId);
      await requestTwitterAccessToken(); // redirects to Twitter
    } catch (e) {
      twError = e.message;
      twLoadingAuth = false;
    }
  }

  async function twSignOut() {
    try {
      await revokeTwitterToken();
    } catch {}
    twAccessToken = null;
    twProfile = null;
    twMessages = [];
    twTotalMessages = 0;
    twError = null;
    await removeSetting("twitter-profile");
  }

  async function twFetchProfile() {
    try {
      const r = await getTwitterMe(twAccessToken);
      twProfile = r.data;
      await setSetting("twitter-profile", r.data);
      await twRefreshSyncStatus();
      await twLoadLocalMessages(false);
    } catch (e) {
      twError = `Profile fetch failed: ${e.message}`;
    }
  }

  async function twLoadLocalMessages(append = false) {
    twLoadingMessages = true;
    try {
      const offset = append ? twLocalOffset : 0;
      const rows = await query(
        `SELECT * FROM items WHERE sourceType = 'twitter'
         ${twSearchQuery ? `AND (subject ILIKE '%${twSearchQuery.replace(/'/g, "''")}%' OR body ILIKE '%${twSearchQuery.replace(/'/g, "''")}%' OR "from" ILIKE '%${twSearchQuery.replace(/'/g, "''")}%')` : ""}
         ORDER BY date DESC LIMIT ${TW_LOCAL_PAGE_SIZE} OFFSET ${offset}`,
      );
      const countRows = await query(
        `SELECT COUNT(*) AS cnt FROM items WHERE sourceType = 'twitter'
         ${twSearchQuery ? `AND (subject ILIKE '%${twSearchQuery.replace(/'/g, "''")}%' OR body ILIKE '%${twSearchQuery.replace(/'/g, "''")}%' OR "from" ILIKE '%${twSearchQuery.replace(/'/g, "''")}%')` : ""}`,
      );
      twMessages = append ? [...twMessages, ...rows] : rows;
      twTotalMessages = Number(countRows[0]?.cnt ?? 0);
      twLocalOffset = twMessages.length;
    } catch (e) {
      twError = `Failed to load tweets: ${e.message}`;
    } finally {
      twLoadingMessages = false;
    }
  }

  function twSearchLocal() {
    twLocalOffset = 0;
    twLoadLocalMessages(false);
  }
  function twLoadMoreLocal() {
    twLoadLocalMessages(true);
  }

  async function twRefreshSyncStatus() {
    try {
      twSyncStatus = await getTwitterSyncStatus();
    } catch {}
  }

  async function twStartSync(limit) {
    if (twSyncing || !twAccessToken) return;
    twError = null;
    twSyncing = true;
    twSyncProgress = null;
    try {
      await syncTwitter(twAccessToken, {
        limit,
        onProgress: (p) => {
          twSyncProgress = { ...p };
        },
      });
      await twRefreshSyncStatus();
      await twLoadLocalMessages(false);
    } catch (e) {
      if (e.name !== "AbortError") twError = `Sync failed: ${e.message}`;
    } finally {
      twSyncing = false;
    }
  }

  async function twStartSyncMore(limit) {
    if (twSyncing || !twAccessToken) return;
    twError = null;
    twSyncing = true;
    twSyncProgress = null;
    try {
      await syncTwitterMore(twAccessToken, {
        limit,
        onProgress: (p) => {
          twSyncProgress = { ...p };
        },
      });
      await twRefreshSyncStatus();
      await twLoadLocalMessages(false);
    } catch (e) {
      if (e.name !== "AbortError") twError = `Sync more failed: ${e.message}`;
    } finally {
      twSyncing = false;
    }
  }

  async function twHandleClearData() {
    try {
      await clearTwitterData();
      await twRefreshSyncStatus();
      twMessages = [];
      twTotalMessages = 0;
      twLocalOffset = 0;
      twShowClearConfirm = false;
    } catch (e) {
      twError = `Failed to clear data: ${e.message}`;
    }
  }

  function twProgressPct() {
    if (!twSyncProgress?.total || !twSyncProgress?.current) return 0;
    return Math.round((twSyncProgress.current / twSyncProgress.total) * 100);
  }
</script>

<div class="flex h-full overflow-hidden">
  <!-- ── Left sidebar: source list ─────────────────────────────── -->
  <div
    class="w-56 shrink-0 flex flex-col border-r border-border bg-sidebar overflow-hidden"
  >
    <div class="px-3 pt-4 pb-2 shrink-0">
      <p
        class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/50"
      >
        Sources
      </p>
    </div>

    <ScrollArea class="flex-1">
      <div class="px-2 pb-4 flex flex-col gap-0.5">
        {#each ALL_SOURCES as name}
          {@const meta = SOURCE_META[name]}
          {@const isSelected = selectedSource === name}
          {@const isLive = meta.live}
          {@const isConnected = isLive && isSignedIn}

          <button
            onclick={() => (selectedSource = name)}
            disabled={!isLive}
            class={cn(
              "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors",
              isSelected && isLive
                ? "bg-sidebar-accent border border-primary/20"
                : isLive
                  ? "hover:bg-sidebar-accent/60 border border-transparent"
                  : "opacity-40 cursor-default border border-transparent",
            )}
          >
            <!-- Source icon -->
            <div
              class="size-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
              style="background:{meta.color}18; color:{meta.color};"
            >
              {meta.icon}
            </div>

            <!-- Label + platform -->
            <div class="flex-1 min-w-0">
              <p
                class={cn(
                  "text-sm font-medium truncate",
                  isSelected && isLive
                    ? "text-foreground"
                    : "text-foreground/80",
                )}
              >
                {meta.label}
              </p>
              <p class="text-[0.65rem] text-muted-foreground/50 truncate">
                {meta.platform}
              </p>
            </div>

            <!-- Status indicator -->
            {#if isLive}
              {#if isConnected}
                <span class="size-1.5 rounded-full bg-success shrink-0"></span>
              {:else}
                <span
                  class="size-1.5 rounded-full bg-muted-foreground/20 shrink-0"
                ></span>
              {/if}
            {:else}
              <span
                class="text-[0.55rem] font-medium text-muted-foreground/30 shrink-0"
                >Soon</span
              >
            {/if}
          </button>
        {/each}
      </div>
    </ScrollArea>
  </div>

  <!-- ── Right panel ────────────────────────────────────────────── -->
  <div class="flex-1 overflow-hidden flex flex-col bg-background">
    {#if selectedSource === "gmail"}
      <!-- ── Gmail panel ──────────────────────────────────────── -->

      {#if isSignedIn}
        <!-- Top bar: account info + sync controls -->
        <div
          class="flex items-center gap-3 px-4 py-2.5 border-b border-border shrink-0 bg-sidebar/40"
        >
          <!-- Avatar + email -->
          <div class="flex items-center gap-2 min-w-0">
            <div
              class="size-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0"
            >
              {profile?.emailAddress?.[0]?.toUpperCase() ?? "G"}
            </div>
            <span
              class="text-sm font-medium text-foreground truncate max-w-[180px]"
            >
              {profile?.emailAddress ?? "Gmail"}
            </span>
            <span class="size-1.5 rounded-full bg-success shrink-0"></span>
          </div>

          <div class="flex items-center gap-2 ml-auto shrink-0">
            <!-- Sync controls -->
            {#if isSyncing && syncProgress}
              <span class="text-xs text-muted-foreground/60"
                >{syncProgress.message || "Syncing…"}</span
              >
            {:else if syncStatus?.synced}
              <span class="text-xs text-muted-foreground/40"
                >{syncStatus.totalItems.toLocaleString()} emails · {formatTimeAgo(
                  syncStatus.lastSyncAt,
                )}</span
              >
            {/if}

            <select
              bind:value={syncLimit}
              disabled={isSyncing}
              class="h-7 px-1.5 text-xs rounded border border-input bg-background text-foreground"
            >
              {#each LIMIT_OPTIONS as opt}<option value={opt}>{opt}</option
                >{/each}
            </select>

            <Button
              size="sm"
              onclick={() => startSync(syncLimit)}
              disabled={isSyncing}
              class="h-7 gap-1.5 text-xs"
            >
              <RefreshCw class={cn("size-3", isSyncing && "animate-spin")} />
              {isSyncing
                ? "Syncing…"
                : syncStatus?.synced
                  ? "Sync New"
                  : "Download"}
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

            <!-- Sign out -->
            <button
              onclick={signOut}
              class="text-muted-foreground/30 hover:text-destructive transition-colors p-1 rounded"
              title="Sign out"
            >
              <LogOut class="size-3.5" />
            </button>
          </div>
        </div>

        <!-- Progress bar -->
        {#if isSyncing && syncProgress?.total}
          <Progress value={progressPct()} class="h-0.5 rounded-none" />
        {/if}

        <!-- Error banner -->
        {#if gmailError}
          <div
            class="mx-4 mt-2 px-3 py-2 rounded border border-destructive/30 bg-destructive/8 text-xs text-destructive flex items-center justify-between shrink-0"
          >
            <span>{gmailError}</span>
            <button
              onclick={() => (gmailError = null)}
              class="ml-2 opacity-60 hover:opacity-100">✕</button
            >
          </div>
        {/if}

        <!-- Search bar -->
        <div
          class="flex items-center gap-2 px-4 py-2.5 border-b border-border shrink-0"
        >
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 pointer-events-none"
            />
            <Input
              type="text"
              placeholder="Search subjects, senders, or snippets…"
              bind:value={searchQuery}
              onkeydown={(e) => e.key === "Enter" && searchLocal()}
              class="pl-9 h-8 text-sm"
            />
          </div>
          <Button
            onclick={searchLocal}
            disabled={loadingMessages}
            variant="outline"
            size="sm"
            class="shrink-0 h-8"
          >
            {loadingMessages ? "…" : "Search"}
          </Button>
          {#if totalLocalMessages > 0}
            <span
              class="text-xs text-muted-foreground/40 shrink-0 whitespace-nowrap"
            >
              {emailMessages.length} of {totalLocalMessages.toLocaleString()}
            </span>
          {/if}
        </div>

        <!-- Message list -->
        <div class="flex-1 min-h-0 overflow-y-auto">
          <div class="p-3">
            {#if emailMessages.length > 0}
              <MessageList
                messages={emailMessages}
                onselect={(msg) => (selectedMessage = msg)}
              />
              {#if hasMoreLocal}
                <div class="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onclick={loadMoreLocal}
                    disabled={loadingMessages}
                  >
                    {loadingMessages ? "Loading…" : "Load More"}
                  </Button>
                </div>
              {/if}
            {:else if loadingMessages}
              <div
                class="flex items-center justify-center gap-2.5 py-16 text-sm text-muted-foreground/50"
              >
                <div
                  class="size-4 border-2 border-border border-t-primary rounded-full animate-spin shrink-0"
                ></div>
                Loading messages…
              </div>
            {:else}
              <div
                class="flex flex-col items-center justify-center gap-3 py-20 text-center"
              >
                <Database class="size-8 text-muted-foreground/15" />
                <p class="text-sm text-muted-foreground/40">
                  {searchQuery
                    ? `No emails match "${searchQuery}"`
                    : "No emails synced yet — click Download above"}
                </p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Clear data footer (subtle) -->
        {#if syncStatus?.synced}
          <div
            class="px-4 py-2 border-t border-border shrink-0 flex items-center justify-end"
          >
            {#if showClearConfirm}
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground/50"
                  >Delete all local emails?</span
                >
                <Button
                  variant="destructive"
                  size="sm"
                  onclick={handleClearData}
                  class="h-6 text-xs px-2">Delete</Button
                >
                <Button
                  variant="outline"
                  size="sm"
                  onclick={() => (showClearConfirm = false)}
                  class="h-6 text-xs px-2">Cancel</Button
                >
              </div>
            {:else}
              <button
                onclick={() => (showClearConfirm = true)}
                class="flex items-center gap-1 text-[0.65rem] text-muted-foreground/25 hover:text-destructive transition-colors"
              >
                <Trash2 class="size-3" />Clear local data
              </button>
            {/if}
          </div>
        {/if}
      {:else}
        <!-- Not signed in — sign-in panel -->
        <div
          class="flex flex-col items-center justify-center h-full gap-5 px-8"
        >
          <div
            class="size-14 rounded-2xl flex items-center justify-center text-2xl font-black"
            style="background:#ea433518; color:#ea4335;"
          >
            M
          </div>
          <div class="text-center">
            <p class="text-base font-semibold text-foreground mb-1">
              Connect Gmail
            </p>
            <p
              class="text-sm text-muted-foreground/60 max-w-xs leading-relaxed"
            >
              Sign in with Google to sync and browse your emails.
            </p>
          </div>

          {#if gmailError}
            <p class="text-sm text-destructive text-center max-w-xs">
              {gmailError}
            </p>
          {/if}

          <div class="flex flex-col items-center gap-2 w-full max-w-[260px]">
            <button
              onclick={signIn}
              disabled={loadingAuth}
              class="flex items-center justify-center gap-2.5 w-full h-10 px-4 rounded-lg border border-border bg-white text-zinc-800 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 transition-colors shadow-sm"
            >
              {#if loadingAuth}
                <div
                  class="size-4 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin shrink-0"
                ></div>
                Signing in…
              {:else}
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  class="shrink-0"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              {/if}
            </button>
            <a
              href="#oauth-redirect"
              class="text-xs text-muted-foreground/40 hover:text-primary transition-colors"
            >
              Popup blocked? Use redirect flow
            </a>
          </div>

          <!-- Client ID -->
          <div class="w-full max-w-[260px]">
            {#if !showClientIdEdit}
              <div
                class="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground/30"
              >
                <span
                  >Client ID: {isDefaultClientId
                    ? "shared default"
                    : clientId.slice(0, 16) + "…"}</span
                >
                <button
                  onclick={() => (showClientIdEdit = true)}
                  class="text-primary hover:underline ml-auto">Change</button
                >
              </div>
            {:else}
              <div class="flex flex-col gap-1.5">
                <Input
                  bind:value={clientIdInput}
                  placeholder="Paste your Client ID…"
                  class="h-8 text-xs font-mono"
                />
                <div class="flex gap-1.5">
                  <Button
                    size="sm"
                    onclick={saveClientId}
                    class="flex-1 h-7 text-xs">Save</Button
                  >
                  <Button
                    variant="outline"
                    size="sm"
                    onclick={() => (showClientIdEdit = false)}
                    class="flex-1 h-7 text-xs">Cancel</Button
                  >
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    {:else if selectedSource === "twitter"}
      <!-- ── Twitter panel ──────────────────────────────────── -->

      {#if twSignedIn}
        <!-- Top bar: account info + sync controls -->
        <div
          class="flex items-center gap-3 px-4 py-2.5 border-b border-border shrink-0 bg-sidebar/40"
        >
          <div class="flex items-center gap-2 min-w-0">
            <div
              class="size-7 rounded-full bg-[#1da1f2]/15 flex items-center justify-center text-xs font-bold text-[#1da1f2] shrink-0"
            >
              X
            </div>
            <span
              class="text-sm font-medium text-foreground truncate max-w-[180px]"
            >
              @{twProfile?.username ?? "Twitter"}
            </span>
            <span class="size-1.5 rounded-full bg-success shrink-0"></span>
          </div>

          <div class="flex items-center gap-2 ml-auto shrink-0">
            {#if twSyncing && twSyncProgress}
              <span class="text-xs text-muted-foreground/60"
                >{twSyncProgress.message || "Syncing…"}</span
              >
            {:else if twSyncStatus?.synced}
              <span class="text-xs text-muted-foreground/40"
                >{twSyncStatus.totalItems.toLocaleString()} tweets · {formatTimeAgo(
                  twSyncStatus.lastSyncAt,
                )}</span
              >
            {/if}

            <select
              bind:value={twSyncLimit}
              disabled={twSyncing}
              class="h-7 px-1.5 text-xs rounded border border-input bg-background text-foreground"
            >
              {#each LIMIT_OPTIONS as opt}<option value={opt}>{opt}</option
                >{/each}
            </select>

            <Button
              size="sm"
              onclick={() => twStartSync(twSyncLimit)}
              disabled={twSyncing}
              class="h-7 gap-1.5 text-xs"
            >
              <RefreshCw class={cn("size-3", twSyncing && "animate-spin")} />
              {twSyncing
                ? "Syncing…"
                : twSyncStatus?.synced
                  ? "Sync New"
                  : "Download"}
            </Button>

            {#if twSyncStatus?.synced && twSyncStatus.hasMore}
              <Button
                variant="outline"
                size="sm"
                onclick={() => twStartSyncMore(twSyncLimit)}
                disabled={twSyncing}
                class="h-7 text-xs">More</Button
              >
            {/if}

            <button
              onclick={twSignOut}
              class="text-muted-foreground/30 hover:text-destructive transition-colors p-1 rounded"
              title="Sign out"
            >
              <LogOut class="size-3.5" />
            </button>
          </div>
        </div>

        {#if twSyncing && twSyncProgress?.total}
          <Progress value={twProgressPct()} class="h-0.5 rounded-none" />
        {/if}

        {#if twError}
          <div
            class="mx-4 mt-2 px-3 py-2 rounded border border-destructive/30 bg-destructive/8 text-xs text-destructive flex items-center justify-between shrink-0"
          >
            <span>{twError}</span>
            <button
              onclick={() => (twError = null)}
              class="ml-2 opacity-60 hover:opacity-100">✕</button
            >
          </div>
        {/if}

        <!-- Search bar -->
        <div
          class="flex items-center gap-2 px-4 py-2.5 border-b border-border shrink-0"
        >
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 pointer-events-none"
            />
            <Input
              type="text"
              placeholder="Search tweets…"
              bind:value={twSearchQuery}
              onkeydown={(e) => e.key === "Enter" && twSearchLocal()}
              class="pl-9 h-8 text-sm"
            />
          </div>
          <Button
            onclick={twSearchLocal}
            disabled={twLoadingMessages}
            variant="outline"
            size="sm"
            class="shrink-0 h-8"
          >
            {twLoadingMessages ? "…" : "Search"}
          </Button>
          {#if twTotalMessages > 0}
            <span
              class="text-xs text-muted-foreground/40 shrink-0 whitespace-nowrap"
              >{twMessages.length} of {twTotalMessages.toLocaleString()}</span
            >
          {/if}
        </div>

        <!-- Tweet list -->
        <div class="flex-1 min-h-0 overflow-y-auto">
          <div class="p-3">
            {#if twMessages.length > 0}
              <MessageList
                messages={twMessages}
                onselect={(msg) => (selectedMessage = msg)}
              />
              {#if twMessages.length < twTotalMessages}
                <div class="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onclick={twLoadMoreLocal}
                    disabled={twLoadingMessages}
                  >
                    {twLoadingMessages ? "Loading…" : "Load More"}
                  </Button>
                </div>
              {/if}
            {:else if twLoadingMessages}
              <div
                class="flex items-center justify-center gap-2.5 py-16 text-sm text-muted-foreground/50"
              >
                <div
                  class="size-4 border-2 border-border border-t-primary rounded-full animate-spin shrink-0"
                ></div>
                Loading tweets…
              </div>
            {:else}
              <div
                class="flex flex-col items-center justify-center gap-3 py-20 text-center"
              >
                <Database class="size-8 text-muted-foreground/15" />
                <p class="text-sm text-muted-foreground/40">
                  {twSearchQuery
                    ? `No tweets match "${twSearchQuery}"`
                    : "No tweets synced yet — click Download above"}
                </p>
              </div>
            {/if}
          </div>
        </div>

        {#if twSyncStatus?.synced}
          <div
            class="px-4 py-2 border-t border-border shrink-0 flex items-center justify-end"
          >
            {#if twShowClearConfirm}
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground/50"
                  >Delete all local tweets?</span
                >
                <Button
                  variant="destructive"
                  size="sm"
                  onclick={twHandleClearData}
                  class="h-6 text-xs px-2">Delete</Button
                >
                <Button
                  variant="outline"
                  size="sm"
                  onclick={() => (twShowClearConfirm = false)}
                  class="h-6 text-xs px-2">Cancel</Button
                >
              </div>
            {:else}
              <button
                onclick={() => (twShowClearConfirm = true)}
                class="flex items-center gap-1 text-[0.65rem] text-muted-foreground/25 hover:text-destructive transition-colors"
              >
                <Trash2 class="size-3" />Clear local data
              </button>
            {/if}
          </div>
        {/if}
      {:else}
        <!-- Not signed in — sign-in panel -->
        <div
          class="flex flex-col items-center justify-center h-full gap-5 px-8"
        >
          <div
            class="size-14 rounded-2xl flex items-center justify-center text-2xl font-black"
            style="background:#1da1f218; color:#1da1f2;"
          >
            X
          </div>
          <div class="text-center">
            <p class="text-base font-semibold text-foreground mb-1">
              Connect Twitter/X
            </p>
            <p
              class="text-sm text-muted-foreground/60 max-w-xs leading-relaxed"
            >
              Sign in with Twitter to sync and browse your tweets.
            </p>
            <p
              class="text-xs text-muted-foreground/40 max-w-xs leading-relaxed mt-1"
            >
              Get your Client ID from the
              <a
                href="https://developer.x.com/en/portal/dashboard"
                target="_blank"
                rel="noopener"
                class="text-[#1da1f2] hover:underline">X Developer Portal</a
              >. Create a project → App → enable OAuth 2.0 as
              <a
                href="https://developer.x.com/en/docs/authentication/oauth-2-0/authorization-code"
                target="_blank"
                rel="noopener"
                class="text-[#1da1f2] hover:underline">Public Client</a
              >, and set the redirect URI to
              <code class="text-[0.65rem] bg-muted/30 px-1 py-0.5 rounded"
                >{window.location.origin}/#oauth-twitter</code
              >
            </p>
          </div>

          {#if twError}
            <p class="text-sm text-destructive text-center max-w-xs">
              {twError}
            </p>
          {/if}

          <div class="flex flex-col items-center gap-2 w-full max-w-[260px]">
            <button
              onclick={twSignIn}
              disabled={twLoadingAuth}
              class="flex items-center justify-center gap-2.5 w-full h-10 px-4 rounded-lg border border-border bg-black text-white text-sm font-medium hover:bg-zinc-900 disabled:opacity-50 transition-colors shadow-sm"
            >
              {#if twLoadingAuth}
                <div
                  class="size-4 border-2 border-zinc-600 border-t-white rounded-full animate-spin shrink-0"
                ></div>
                Signing in…
              {:else}
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="shrink-0"
                >
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </svg>
                Sign in with X
              {/if}
            </button>
          </div>

          <!-- Client ID -->
          <div class="w-full max-w-[260px]">
            {#if !twShowClientIdEdit}
              <div
                class="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground/30"
              >
                <span
                  >Client ID: {twClientId
                    ? twClientId.slice(0, 16) + "…"
                    : "not set"}</span
                >
                <button
                  onclick={() => (twShowClientIdEdit = true)}
                  class="text-primary hover:underline ml-auto">Change</button
                >
              </div>
            {:else}
              <div class="flex flex-col gap-1.5">
                <Input
                  bind:value={twClientIdInput}
                  placeholder="Paste your Twitter Client ID…"
                  class="h-8 text-xs font-mono"
                />
                <div class="flex gap-1.5">
                  <Button
                    size="sm"
                    onclick={twSaveClientId}
                    class="flex-1 h-7 text-xs">Save</Button
                  >
                  <Button
                    variant="outline"
                    size="sm"
                    onclick={() => (twShowClientIdEdit = false)}
                    class="flex-1 h-7 text-xs">Cancel</Button
                  >
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    {:else}
      <!-- Coming-soon source panel -->
      {@const meta = SOURCE_META[selectedSource]}
      <div
        class="flex flex-col items-center justify-center h-full gap-4 text-center px-8"
      >
        <div
          class="size-14 rounded-2xl flex items-center justify-center text-2xl font-black"
          style="background:{meta?.color ?? '#888'}18; color:{meta?.color ??
            '#888'};"
        >
          {meta?.icon ?? "?"}
        </div>
        <div>
          <p class="text-base font-semibold text-foreground mb-1">
            {meta?.label ?? selectedSource}
          </p>
          <p class="text-sm text-muted-foreground/50">{meta?.platform}</p>
        </div>
        <span
          class="px-3 py-1 rounded-full border border-border text-xs text-muted-foreground/50"
        >
          Coming soon
        </span>
      </div>
    {/if}
  </div>
</div>

<!-- Message detail modal -->
{#if selectedMessage}
  <MessageModal
    message={selectedMessage}
    loading={false}
    onclose={() => (selectedMessage = null)}
  />
{/if}
