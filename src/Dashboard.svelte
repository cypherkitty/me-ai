<script>
  import { onMount } from "svelte";
  import { getSetting, setSetting, removeSetting } from "./lib/store/settings.js";
  import {
    initGoogleAuth, requestAccessToken, revokeToken,
    getSavedToken, isTokenValid, getTokenTTL, refreshToken,
  } from "./lib/google-auth.js";
  import { getProfile } from "./lib/gmail-api.js";
  import { syncGmail, syncGmailMore, getGmailSyncStatus, clearGmailData } from "./lib/store/gmail-sync.js";
  import { getStoredEmails } from "./lib/store/query-layer.js";
  import SetupGuide from "./components/dashboard/SetupGuide.svelte";
  import AuthCard from "./components/dashboard/AuthCard.svelte";
  import DashboardView from "./components/dashboard/DashboardView.svelte";

  // Close modal on Escape key
  function handleKeydown(e) {
    if (e.key === "Escape" && selectedMessage) {
      closeDetail();
    }
  }

  let refreshTimer = null;

  onMount(async () => {
    window.addEventListener("keydown", handleKeydown);

    // Load saved Google Client ID from IndexedDB, fall back to default
    if (!clientId) {
      const saved = await getSetting("googleClientId");
      clientId = saved || DEFAULT_CLIENT_ID;
      clientIdInput = saved || DEFAULT_CLIENT_ID;
    }

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  });

  /**
   * Schedule a silent token refresh shortly before it expires.
   * If the silent attempt fails, sign the user out gracefully.
   */
  function scheduleTokenRefresh() {
    if (refreshTimer) clearTimeout(refreshTimer);
    const ttl = getTokenTTL();
    if (ttl <= 0) return;

    // Refresh 2 minutes before expiry (or immediately if <2 min left)
    const delay = Math.max(0, ttl - 2 * 60 * 1000);
    refreshTimer = setTimeout(async () => {
      try {
        const result = await refreshToken();
        accessToken = result.access_token;
        scheduleTokenRefresh();
      } catch {
        // Silent refresh failed — token is dead
        accessToken = null;
        profile = null;
        error = "Session expired. Please sign in again.";
      }
    }, delay);
  }

  /**
   * Verify the token is still valid before any API call.
   * If expired, attempt a silent refresh first.
   * Returns a valid access token or null (signs out on failure).
   */
  async function ensureValidToken() {
    if (isTokenValid()) return accessToken;

    try {
      const result = await refreshToken();
      accessToken = result.access_token;
      scheduleTokenRefresh();
      return accessToken;
    } catch {
      accessToken = null;
      profile = null;
      error = "Session expired. Please sign in again.";
      return null;
    }
  }

  // ── State ──────────────────────────────────────────────────────────
  // Default shared Client ID — safe to be public (OAuth client_id is not a secret).
  // Users can override this with their own Client ID below.
  const DEFAULT_CLIENT_ID = "562478245230-1gohf6dtsajqo1lu3kge9k7cthm4sdv6.apps.googleusercontent.com";

  let clientId = $state(import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID);
  let clientIdInput = $state(import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID);
  let authInitialized = $state(false);

  let accessToken = $state(null);
  let profile = $state(null);
  let selectedMessage = $state(null);
  let searchQuery = $state("");

  // Local message list (from IndexedDB)
  let emailMessages = $state([]);
  let totalLocalMessages = $state(0);
  let localOffset = $state(0);
  let loadingMessages = $state(false);

  let loadingAuth = $state(false);
  let loadingProfile = $state(false);
  let error = $state(null);

  // ── Sync state ─────────────────────────────────────────────────────
  let syncStatus = $state(null);
  let syncProgress = $state(null);
  let isSyncing = $state(false);

  const LOCAL_PAGE_SIZE = 50;

  // Load sync status and local messages after sign-in
  $effect(() => {
    if (accessToken) {
      refreshSyncStatus();
      loadLocalMessages();
    }
  });

  // ── Derived state ─────────────────────────────────────────────────
  let needsSetup = $derived(!clientId);
  let isDefaultClientId = $derived(clientId === DEFAULT_CLIENT_ID);
  let isSignedIn = $derived(!!accessToken);
  let hasMoreLocal = $derived(emailMessages.length < totalLocalMessages);

  // ── Initialize Google Auth when Client ID is available ────────────
  $effect(() => {
    if (clientId && !authInitialized) {
      initGoogleAuth(clientId)
        .then(async () => {
          authInitialized = true;
          // Auto-restore saved token from IndexedDB
          if (!accessToken) {
            const saved = await getSavedToken();
            if (saved) {
              accessToken = saved.access_token;
              scheduleTokenRefresh();
              fetchProfile();
            }
          }
        })
        .catch((e) => { error = `Auth init failed: ${e.message}`; });
    }
  });

  // ── Actions ───────────────────────────────────────────────────────
  async function saveClientId() {
    const trimmed = clientIdInput.trim();
    if (!trimmed) return;
    await setSetting("googleClientId", trimmed);
    clientId = trimmed;
    error = null;
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
    error = null;
    loadingAuth = true;
    try {
      if (!authInitialized) {
        await initGoogleAuth(clientId);
        authInitialized = true;
      }
      const result = await requestAccessToken();
      accessToken = result.access_token;
      scheduleTokenRefresh();
      await fetchProfile();
    } catch (e) {
      error = e.message;
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
    error = null;
  }

  async function fetchProfile() {
    loadingProfile = true;
    try {
      const result = await getProfile(accessToken);
      if (!accessToken) return;
      profile = result;
    } catch (e) {
      if (!accessToken) return;
      error = `Profile fetch failed: ${e.message}`;
    } finally {
      loadingProfile = false;
    }
  }

  // ── Local message loading (from IndexedDB) ─────────────────────────
  async function loadLocalMessages(append = false) {
    loadingMessages = true;
    try {
      const offset = append ? localOffset : 0;
      const result = await getStoredEmails({
        query: searchQuery || undefined,
        limit: LOCAL_PAGE_SIZE,
        offset,
      });
      if (append) {
        emailMessages = [...emailMessages, ...result.items];
      } else {
        emailMessages = result.items;
      }
      totalLocalMessages = result.total;
      localOffset = emailMessages.length;
    } catch (e) {
      error = `Failed to load messages: ${e.message}`;
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

  function viewMessage(msg) {
    // Messages from local store already have body and htmlBody
    selectedMessage = msg;
  }

  function closeDetail() {
    selectedMessage = null;
  }

  // ── Sync actions ───────────────────────────────────────────────────
  async function refreshSyncStatus() {
    try {
      syncStatus = await getGmailSyncStatus();
    } catch {
      // Silently ignore — non-critical
    }
  }

  async function startSync(limit) {
    if (isSyncing || !accessToken) return;

    const token = await ensureValidToken();
    if (!token) return;

    error = null;
    isSyncing = true;
    syncProgress = null;

    const controller = new AbortController();

    try {
      await syncGmail(token, {
        limit,
        onProgress: (progress) => {
          syncProgress = { ...progress };
        },
        signal: controller.signal,
      });
      await refreshSyncStatus();
      await loadLocalMessages(false);
    } catch (e) {
      if (e.name !== "AbortError") {
        if (!accessToken) return;
        error = `Sync failed: ${e.message}`;
      }
    } finally {
      isSyncing = false;
    }
  }

  async function startSyncMore(limit) {
    if (isSyncing || !accessToken) return;

    const token = await ensureValidToken();
    if (!token) return;

    error = null;
    isSyncing = true;
    syncProgress = null;

    const controller = new AbortController();

    try {
      await syncGmailMore(token, {
        limit,
        onProgress: (progress) => {
          syncProgress = { ...progress };
        },
        signal: controller.signal,
      });
      await refreshSyncStatus();
      await loadLocalMessages(false);
    } catch (e) {
      if (e.name !== "AbortError") {
        if (!accessToken) return;
        error = `Sync more failed: ${e.message}`;
      }
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
      error = `Failed to clear data: ${e.message}`;
    }
  }
</script>

<div class="dashboard">
  {#if needsSetup}
    <SetupGuide bind:clientIdInput onsave={saveClientId} defaultClientId={DEFAULT_CLIENT_ID} />

  {:else if !isSignedIn}
    <AuthCard {clientId} {isDefaultClientId} {error} {loadingAuth} onsignin={signIn} onclear={clearClientId} onsignout={signOut} />

  {:else}
    <DashboardView
      {error}
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
      onclosedetail={closeDetail}
      ondismisserror={() => error = null}
      onsync={startSync}
      onsyncmore={startSyncMore}
      oncleardata={handleClearData}
    />
  {/if}
</div>

<style>
  .dashboard {
    height: 100%;
    overflow-y: auto;
  }
</style>
