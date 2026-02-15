<script>
  import { onMount } from "svelte";
  import { initGoogleAuth, requestAccessToken, revokeToken } from "./lib/google-auth.js";
  import { getProfile, listMessages, getMessagesBatch, getBody, getHtmlBody } from "./lib/gmail-api.js";
  import { parseMessage } from "./lib/email-utils.js";
  import { syncGmail, getGmailSyncStatus, clearGmailData } from "./lib/store/gmail-sync.js";
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
  let emailMessages = $state([]);
  let nextPageToken = $state(null);
  let selectedMessage = $state(null);
  let searchQuery = $state("");

  let loadingAuth = $state(false);
  let loadingProfile = $state(false);
  let loadingMessages = $state(false);
  let loadingDetail = $state(false);
  let error = $state(null);

  // ── Sync state ─────────────────────────────────────────────────────
  let syncStatus = $state(null);
  let syncProgress = $state(null);
  let isSyncing = $state(false);
  let syncAbortController = $state(null);

  // Load sync status on mount and after sign-in
  $effect(() => {
    if (accessToken) {
      refreshSyncStatus();
    }
  });

  // ── Derived state ─────────────────────────────────────────────────
  let needsSetup = $derived(!clientId);
  let isSignedIn = $derived(!!accessToken);

  // ── Initialize Google Auth when Client ID is available ────────────
  $effect(() => {
    if (clientId && !authInitialized) {
      initGoogleAuth(clientId)
        .then(() => { authInitialized = true; })
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
    nextPageToken = null;
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
    nextPageToken = null;
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

  async function fetchMessages(append = false) {
    error = null;
    loadingMessages = true;
    try {
      const opts = { maxResults: 20, q: searchQuery || undefined };
      if (append && nextPageToken) opts.pageToken = nextPageToken;

      const result = await listMessages(accessToken, opts);
      if (!accessToken) return;

      const ids = (result.messages || []).map((m) => m.id);
      nextPageToken = result.nextPageToken || null;

      if (ids.length === 0) {
        if (!append) emailMessages = [];
        return;
      }

      const fullMessages = await getMessagesBatch(accessToken, ids);
      if (!accessToken) return;

      const parsed = fullMessages.map(parseMessage);
      emailMessages = append ? [...emailMessages, ...parsed] : parsed;
    } catch (e) {
      if (!accessToken) return;
      error = `Failed to fetch messages: ${e.message}`;
    } finally {
      loadingMessages = false;
    }
  }

  async function viewMessage(msg) {
    selectedMessage = msg;
    if (!msg.body) {
      loadingDetail = true;
      try {
        const { getMessage } = await import("./lib/gmail-api.js");
        const full = await getMessage(accessToken, msg.id, "full");
        if (!accessToken) return;
        const body = getBody(full);
        const htmlBody = getHtmlBody(full);
        selectedMessage = { ...msg, body, htmlBody };
        emailMessages = emailMessages.map((m) =>
          m.id === msg.id ? { ...m, body, htmlBody } : m
        );
      } catch (e) {
        if (!accessToken) return;
        error = `Failed to load message: ${e.message}`;
      } finally {
        loadingDetail = false;
      }
    }
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

  async function startSync() {
    if (isSyncing || !accessToken) return;

    error = null;
    isSyncing = true;
    syncProgress = null;

    const controller = new AbortController();
    syncAbortController = controller;

    try {
      await syncGmail(accessToken, {
        onProgress: (progress) => {
          syncProgress = { ...progress };
        },
        signal: controller.signal,
      });
      await refreshSyncStatus();
    } catch (e) {
      if (e.name !== "AbortError") {
        if (!accessToken) return;
        error = `Sync failed: ${e.message}`;
      }
    } finally {
      isSyncing = false;
      syncAbortController = null;
    }
  }

  async function handleClearData() {
    try {
      await clearGmailData();
      await refreshSyncStatus();
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
      {nextPageToken}
      {loadingMessages}
      {selectedMessage}
      {loadingDetail}
      {syncStatus}
      {syncProgress}
      {isSyncing}
      bind:searchQuery
      onsignout={signOut}
      onfetch={() => fetchMessages(false)}
      onfetchmore={() => fetchMessages(true)}
      onviewmessage={viewMessage}
      onclosedetail={closeDetail}
      ondismisserror={() => error = null}
      onsync={startSync}
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
