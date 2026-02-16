<script>
  import { onMount } from "svelte";
  import { initGoogleAuth, requestAccessToken, revokeToken, getSavedToken } from "./lib/google-auth.js";
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

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  // ── State ──────────────────────────────────────────────────────────
  let clientId = $state(
    import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem("googleClientId") || ""
  );
  let clientIdInput = $state(
    import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem("googleClientId") || ""
  );
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
  let isSignedIn = $derived(!!accessToken);
  let hasMoreLocal = $derived(emailMessages.length < totalLocalMessages);

  // ── Initialize Google Auth when Client ID is available ────────────
  $effect(() => {
    if (clientId && !authInitialized) {
      initGoogleAuth(clientId)
        .then(() => {
          authInitialized = true;
          // Auto-restore session token (survives page refresh within same tab)
          if (!accessToken) {
            const saved = getSavedToken();
            if (saved) {
              accessToken = saved.access_token;
              fetchProfile();
            }
          }
        })
        .catch((e) => { error = `Auth init failed: ${e.message}`; });
    }
  });

  // ── Actions ───────────────────────────────────────────────────────
  function saveClientId() {
    const trimmed = clientIdInput.trim();
    if (!trimmed) return;
    localStorage.setItem("googleClientId", trimmed);
    clientId = trimmed;
    error = null;
  }

  function clearClientId() {
    localStorage.removeItem("googleClientId");
    clientId = "";
    clientIdInput = "";
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
      await fetchProfile();
    } catch (e) {
      error = e.message;
    } finally {
      loadingAuth = false;
    }
  }

  async function signOut() {
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

    error = null;
    isSyncing = true;
    syncProgress = null;

    const controller = new AbortController();

    try {
      await syncGmail(accessToken, {
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

    error = null;
    isSyncing = true;
    syncProgress = null;

    const controller = new AbortController();

    try {
      await syncGmailMore(accessToken, {
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
    <SetupGuide bind:clientIdInput onsave={saveClientId} />

  {:else if !isSignedIn}
    <AuthCard {clientId} {error} {loadingAuth} onsignin={signIn} onclear={clearClientId} onsignout={signOut} />

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
