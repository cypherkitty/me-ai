<script>
  import { onMount } from "svelte";
  import { initGoogleAuth, requestAccessToken, revokeToken } from "./lib/google-auth.js";
  import { getProfile, listMessages, getMessagesBatch, getHeader, getBody } from "./lib/gmail-api.js";

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
  let profile = $state(null);        // { emailAddress, messagesTotal, threadsTotal }
  let emailMessages = $state([]);    // parsed message objects
  let nextPageToken = $state(null);
  let selectedMessage = $state(null);
  let searchQuery = $state("");

  let loadingAuth = $state(false);
  let loadingProfile = $state(false);
  let loadingMessages = $state(false);
  let loadingDetail = $state(false);
  let error = $state(null);

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
      profile = await getProfile(accessToken);
    } catch (e) {
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
      const ids = (result.messages || []).map((m) => m.id);
      nextPageToken = result.nextPageToken || null;

      if (ids.length === 0) {
        if (!append) emailMessages = [];
        return;
      }

      const fullMessages = await getMessagesBatch(accessToken, ids);
      const parsed = fullMessages.map(parseMessage);

      emailMessages = append ? [...emailMessages, ...parsed] : parsed;
    } catch (e) {
      error = `Failed to fetch messages: ${e.message}`;
    } finally {
      loadingMessages = false;
    }
  }

  async function viewMessage(msg) {
    selectedMessage = msg;
    // Fetch full body if not already loaded
    if (!msg.body) {
      loadingDetail = true;
      try {
        const { getMessage } = await import("./lib/gmail-api.js");
        const full = await getMessage(accessToken, msg.id, "full");
        const body = getBody(full);
        selectedMessage = { ...msg, body };
        // Update in the list too
        emailMessages = emailMessages.map((m) =>
          m.id === msg.id ? { ...m, body } : m
        );
      } catch (e) {
        error = `Failed to load message: ${e.message}`;
      } finally {
        loadingDetail = false;
      }
    }
  }

  function closeDetail() {
    selectedMessage = null;
  }

  // ── Helpers ───────────────────────────────────────────────────────
  function parseMessage(msg) {
    return {
      id: msg.id,
      threadId: msg.threadId,
      from: getHeader(msg, "From"),
      to: getHeader(msg, "To"),
      subject: getHeader(msg, "Subject") || "(no subject)",
      date: getHeader(msg, "Date"),
      snippet: msg.snippet || "",
      body: null, // lazy-loaded on click
    };
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  function extractName(fromStr) {
    if (!fromStr) return "Unknown";
    const match = fromStr.match(/^"?([^"<]+)"?\s*</);
    return match ? match[1].trim() : fromStr.split("@")[0];
  }

  function initial(fromStr) {
    const name = extractName(fromStr);
    return name.charAt(0).toUpperCase();
  }

  // ── Error intelligence ────────────────────────────────────────────
  // Parses raw API errors into user-friendly guidance
  function parseError(rawError) {
    const msg = rawError || "";

    // Gmail API not enabled
    if (msg.includes("has not been used in project") || msg.includes("is disabled")) {
      const projectMatch = msg.match(/project\s+(\d+)/);
      const projectId = projectMatch?.[1];
      const enableUrl = projectId
        ? `https://console.developers.google.com/apis/api/gmail.googleapis.com/overview?project=${projectId}`
        : "https://console.cloud.google.com/apis/library/gmail.googleapis.com";
      return {
        title: "Gmail API not enabled",
        description: "The Gmail API needs to be enabled in your Google Cloud project before it can be used.",
        fix: "Click the link below to enable it, then wait ~30 seconds and retry.",
        link: { url: enableUrl, label: "Enable Gmail API" },
      };
    }

    // Invalid / expired token
    if (msg.includes("Invalid Credentials") || msg.includes("401") || msg.includes("invalid_token")) {
      return {
        title: "Session expired",
        description: "Your access token has expired or is invalid.",
        fix: "Sign out and sign in again to get a fresh token.",
        action: "signout",
      };
    }

    // Insufficient scopes
    if (msg.includes("insufficient") && msg.includes("scope")) {
      return {
        title: "Insufficient permissions",
        description: "The app doesn't have the required permissions to access Gmail.",
        fix: "Sign out, sign in again, and make sure to grant the Gmail read permission in the consent screen.",
        action: "signout",
      };
    }

    // User denied consent
    if (msg.includes("access_denied") || msg.includes("user_denied")) {
      return {
        title: "Access denied",
        description: "You declined the Gmail permission request.",
        fix: "Click 'Sign in with Google' again and grant the Gmail read-only permission when prompted.",
      };
    }

    // Popup blocked
    if (msg.includes("popup") || msg.includes("blocked")) {
      return {
        title: "Popup blocked",
        description: "The sign-in popup was blocked by your browser.",
        fix: "Allow popups for localhost:5173 in your browser settings, then try again.",
      };
    }

    // Rate limit
    if (msg.includes("Rate Limit") || msg.includes("429") || msg.includes("quota")) {
      return {
        title: "Rate limit exceeded",
        description: "Too many requests to the Gmail API.",
        fix: "Wait a minute and try again.",
      };
    }

    // Network error
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("network")) {
      return {
        title: "Network error",
        description: "Could not reach the Gmail API.",
        fix: "Check your internet connection and try again.",
      };
    }

    // Fallback: show the raw error
    return {
      title: "Something went wrong",
      description: msg,
      fix: null,
    };
  }
</script>

<div class="dashboard">
  {#if needsSetup}
    <!-- ── Setup Section ──────────────────────────────────────────── -->
    <div class="setup-container">
      <div class="setup-card">
        <h2>Connect Gmail</h2>
        <p class="setup-intro">
          To access Gmail from the browser, you need a Google Cloud OAuth Client ID.
          This stays in your browser — no data is sent to any server.
        </p>

        <div class="setup-steps">
          <div class="step">
            <span class="step-num">1</span>
            <div>
              Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener">
                Google Cloud Console
              </a> and create a project (or use existing)
            </div>
          </div>
          <div class="step">
            <span class="step-num">2</span>
            <div>
              Enable the <strong>Gmail API</strong> under
              <em>APIs & Services → Library</em>
            </div>
          </div>
          <div class="step">
            <span class="step-num">3</span>
            <div>
              Go to <em>APIs & Services → Credentials</em> and create an
              <strong>OAuth 2.0 Client ID</strong> (type: Web application)
            </div>
          </div>
          <div class="step">
            <span class="step-num">4</span>
            <div>
              Add these to your OAuth client:
              <ul>
                <li>Authorized JavaScript origins: <code>http://localhost:5173</code></li>
                <li>Authorized redirect URIs: <code>http://localhost:5173</code></li>
              </ul>
            </div>
          </div>
          <div class="step">
            <span class="step-num">5</span>
            <div>Copy the <strong>Client ID</strong> and paste it below</div>
          </div>
        </div>

        <div class="client-id-form">
          <input
            type="text"
            placeholder="xxxx.apps.googleusercontent.com"
            bind:value={clientIdInput}
            onkeydown={(e) => e.key === "Enter" && saveClientId()}
          />
          <button class="btn primary" onclick={saveClientId} disabled={!clientIdInput.trim()}>
            Save
          </button>
        </div>
      </div>
    </div>

  {:else if !isSignedIn}
    <!-- ── Auth Section ───────────────────────────────────────────── -->
    <div class="auth-container">
      <div class="auth-card">
        <h2>Gmail Dashboard</h2>
        <p class="auth-desc">
          Sign in with your Google account to browse your Gmail messages.
          Read-only access — nothing is modified.
        </p>

        {#if error}
          {@const parsed = parseError(error)}
          <div class="error-card">
            <div class="error-card-title">{parsed.title}</div>
            <p class="error-card-desc">{parsed.description}</p>
            {#if parsed.fix}
              <p class="error-card-fix">{parsed.fix}</p>
            {/if}
            {#if parsed.link}
              <a class="error-card-link" href={parsed.link.url} target="_blank" rel="noopener">
                {parsed.link.label} →
              </a>
            {/if}
            {#if parsed.action === "signout"}
              <button class="btn small error-action" onclick={signOut}>Sign Out & Retry</button>
            {/if}
          </div>
        {/if}

        <button class="btn google-btn" onclick={signIn} disabled={loadingAuth}>
          {#if loadingAuth}
            <span class="spinner"></span> Signing in...
          {:else}
            <svg viewBox="0 0 24 24" width="18" height="18" class="google-icon">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          {/if}
        </button>

        <div class="client-id-info">
          <span class="client-id-label">Client ID:</span>
          <span class="client-id-value">{clientId.slice(0, 20)}...</span>
          <button class="btn-link" onclick={clearClientId}>Change</button>
        </div>
      </div>
    </div>

  {:else}
    <!-- ── Authenticated Dashboard ────────────────────────────────── -->
    <div class="main-content">
      {#if error}
        {@const parsed = parseError(error)}
        <div class="error-card">
          <div class="error-card-header">
            <div class="error-card-title">{parsed.title}</div>
            <button class="error-dismiss" onclick={() => error = null}>✕</button>
          </div>
          <p class="error-card-desc">{parsed.description}</p>
          {#if parsed.fix}
            <p class="error-card-fix">{parsed.fix}</p>
          {/if}
          {#if parsed.link}
            <a class="error-card-link" href={parsed.link.url} target="_blank" rel="noopener">
              {parsed.link.label} →
            </a>
          {/if}
          {#if parsed.action === "signout"}
            <button class="btn small error-action" onclick={signOut}>Sign Out & Retry</button>
          {/if}
        </div>
      {/if}

      <!-- Profile Card -->
      <div class="profile-card">
        <div class="profile-avatar">{profile ? initial(profile.emailAddress) : "?"}</div>
        <div class="profile-info">
          {#if loadingProfile}
            <span class="profile-email">Loading profile...</span>
          {:else if profile}
            <span class="profile-email">{profile.emailAddress}</span>
            <span class="profile-stats">
              {profile.messagesTotal?.toLocaleString() || "?"} messages
              · {profile.threadsTotal?.toLocaleString() || "?"} threads
            </span>
          {/if}
        </div>
        <button class="btn small" onclick={signOut}>Sign Out</button>
      </div>

      <!-- Search & Fetch -->
      <div class="toolbar">
        <input
          type="text"
          class="search-input"
          placeholder="Search Gmail (e.g. from:alice subject:meeting)..."
          bind:value={searchQuery}
          onkeydown={(e) => e.key === "Enter" && fetchMessages(false)}
        />
        <button class="btn primary" onclick={() => fetchMessages(false)} disabled={loadingMessages}>
          {loadingMessages ? "Loading..." : "Fetch Messages"}
        </button>
      </div>

      <!-- Message List -->
      {#if emailMessages.length > 0}
        <div class="message-list">
          {#each emailMessages as msg}
            <button class="message-row" onclick={() => viewMessage(msg)}>
              <div class="msg-avatar">{initial(msg.from)}</div>
              <div class="msg-body">
                <div class="msg-top">
                  <span class="msg-from">{extractName(msg.from)}</span>
                  <span class="msg-date">{formatDate(msg.date)}</span>
                </div>
                <div class="msg-subject">{msg.subject}</div>
                <div class="msg-snippet">{msg.snippet}</div>
              </div>
            </button>
          {/each}
        </div>

        {#if nextPageToken}
          <div class="load-more">
            <button class="btn" onclick={() => fetchMessages(true)} disabled={loadingMessages}>
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
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_interactive_supports_focus -->
      <div class="modal-overlay" onclick={closeDetail} role="dialog" aria-modal="true">
        <!-- svelte-ignore a11y_interactive_supports_focus -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="modal-content" onclick={(e) => e.stopPropagation()} role="document">
          <div class="modal-header">
            <h3 class="modal-subject">{selectedMessage.subject}</h3>
            <button class="modal-close" onclick={closeDetail}>✕</button>
          </div>
          <div class="modal-meta">
            <div class="meta-row">
              <span class="meta-label">From:</span>
              <span>{selectedMessage.from}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">To:</span>
              <span>{selectedMessage.to}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Date:</span>
              <span>{formatDate(selectedMessage.date)}</span>
            </div>
          </div>
          <div class="modal-body">
            {#if loadingDetail}
              <div class="loading-state">
                <span class="spinner"></span>
                <span>Loading message...</span>
              </div>
            {:else if selectedMessage.body}
              <pre class="message-text">{selectedMessage.body}</pre>
            {:else}
              <p class="empty-body">Loading...</p>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  /* ── Layout ─────────────────────────────────────────────────────── */
  .dashboard {
    height: 100%;
    overflow-y: auto;
  }

  /* ── Setup ──────────────────────────────────────────────────────── */
  .setup-container, .auth-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    padding: 2rem;
  }
  .setup-card, .auth-card {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 2rem;
    max-width: 560px;
    width: 100%;
  }
  .setup-card h2, .auth-card h2 {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }
  .setup-intro, .auth-desc {
    color: #999;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  /* ── Setup Steps ────────────────────────────────────────────────── */
  .setup-steps {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  .step {
    display: flex;
    gap: 0.75rem;
    font-size: 0.85rem;
    color: #ccc;
    line-height: 1.5;
  }
  .step a {
    color: #60a5fa;
    text-decoration: none;
  }
  .step a:hover {
    text-decoration: underline;
  }
  .step-num {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #3b82f6;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    margin-top: 0.05rem;
  }
  .step ul {
    margin: 0.3rem 0 0 1rem;
    list-style: disc;
  }
  .step li {
    margin-bottom: 0.2rem;
  }
  .step code {
    background: #222;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    font-size: 0.8rem;
    color: #e8e8e8;
  }

  /* ── Client ID Form ────────────────────────────────────────────── */
  .client-id-form {
    display: flex;
    gap: 0.5rem;
  }
  .client-id-form input {
    flex: 1;
    padding: 0.6rem 0.8rem;
    border: 1px solid #333;
    border-radius: 8px;
    background: #1a1a1a;
    color: #e8e8e8;
    font-size: 0.85rem;
    font-family: monospace;
    outline: none;
  }
  .client-id-form input:focus {
    border-color: #3b82f6;
  }

  /* ── Auth Card extras ──────────────────────────────────────────── */
  .google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
    font-weight: 500;
    background: #fff;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s, box-shadow 0.15s;
  }
  .google-btn:hover:not(:disabled) {
    background: #f8f8f8;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
  .google-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .google-icon {
    flex-shrink: 0;
  }
  .client-id-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    font-size: 0.75rem;
    color: #666;
  }
  .client-id-value {
    font-family: monospace;
    color: #888;
  }

  /* ── Buttons ───────────────────────────────────────────────────── */
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
  .btn.small {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }
  .btn-link {
    background: none;
    border: none;
    color: #60a5fa;
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0;
  }
  .btn-link:hover {
    text-decoration: underline;
  }

  /* ── Error Card ──────────────────────────────────────────────────── */
  .error-card {
    background: rgba(248, 113, 113, 0.06);
    border: 1px solid rgba(248, 113, 113, 0.25);
    border-left: 4px solid #f87171;
    border-radius: 8px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
  }
  .error-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .error-card-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: #f87171;
    margin-bottom: 0.35rem;
  }
  .error-dismiss {
    background: none;
    border: none;
    color: #666;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.1rem;
    line-height: 1;
    flex-shrink: 0;
  }
  .error-dismiss:hover {
    color: #f87171;
  }
  .error-card-desc {
    font-size: 0.82rem;
    color: #ccc;
    line-height: 1.5;
    margin-bottom: 0.35rem;
  }
  .error-card-fix {
    font-size: 0.8rem;
    color: #4ade80;
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }
  .error-card-link {
    display: inline-block;
    font-size: 0.82rem;
    color: #60a5fa;
    text-decoration: none;
    font-weight: 500;
    margin-bottom: 0.3rem;
  }
  .error-card-link:hover {
    text-decoration: underline;
  }
  .error-action {
    margin-top: 0.5rem;
    border-color: rgba(248, 113, 113, 0.4);
    color: #f87171;
  }
  .error-action:hover:not(:disabled) {
    background: rgba(248, 113, 113, 0.1);
  }

  /* ── Profile Card ──────────────────────────────────────────────── */
  .main-content {
    padding: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
  }
  .profile-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    margin-bottom: 1rem;
  }
  .profile-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #3b82f6;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  .profile-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .profile-email {
    font-size: 0.95rem;
    font-weight: 600;
  }
  .profile-stats {
    font-size: 0.8rem;
    color: #888;
  }

  /* ── Toolbar ───────────────────────────────────────────────────── */
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

  /* ── Message List ──────────────────────────────────────────────── */
  .message-list {
    display: flex;
    flex-direction: column;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    overflow: hidden;
  }
  .message-row {
    display: flex;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    background: #161616;
    border: none;
    border-bottom: 1px solid #222;
    cursor: pointer;
    transition: background 0.1s;
    text-align: left;
    color: inherit;
    font-family: inherit;
    width: 100%;
  }
  .message-row:last-child {
    border-bottom: none;
  }
  .message-row:hover {
    background: #1c1c1c;
  }
  .msg-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #2a2a2a;
    color: #aaa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 600;
    flex-shrink: 0;
  }
  .msg-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .msg-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
  }
  .msg-from {
    font-size: 0.85rem;
    font-weight: 600;
    color: #e8e8e8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .msg-date {
    font-size: 0.7rem;
    color: #666;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .msg-subject {
    font-size: 0.82rem;
    color: #ccc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .msg-snippet {
    font-size: 0.75rem;
    color: #777;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Load More ─────────────────────────────────────────────────── */
  .load-more {
    display: flex;
    justify-content: center;
    padding: 1rem;
  }

  /* ── Empty / Loading ───────────────────────────────────────────── */
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

  /* ── Modal ─────────────────────────────────────────────────────── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1rem;
  }
  .modal-content {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    max-width: 720px;
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.25rem 0.75rem;
    border-bottom: 1px solid #222;
  }
  .modal-subject {
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.4;
  }
  .modal-close {
    background: none;
    border: none;
    color: #888;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.2rem;
    line-height: 1;
    flex-shrink: 0;
  }
  .modal-close:hover {
    color: #e8e8e8;
  }
  .modal-meta {
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid #222;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .meta-row {
    display: flex;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #ccc;
    line-height: 1.4;
  }
  .meta-label {
    color: #666;
    flex-shrink: 0;
    min-width: 3rem;
  }
  .modal-body {
    padding: 1.25rem;
    overflow-y: auto;
    flex: 1;
  }
  .message-text {
    font-size: 0.85rem;
    color: #ccc;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: inherit;
    margin: 0;
  }
  .empty-body {
    color: #666;
    font-style: italic;
  }
</style>
