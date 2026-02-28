<script>
  /**
   * OAuth redirect landing page — handles the implicit-grant redirect from Google.
   *
   * Google redirects back to this route with the token in the URL fragment:
   *   /#oauth-redirect#access_token=...&expires_in=...
   *
   * Because the app uses hash-based routing, we parse the *second* fragment
   * (everything after the first `#`) from the raw location.href.
   */
  import { onMount } from "svelte";
  import { Button }  from "$lib/components/ui/button/index.js";
  import { Badge }   from "$lib/components/ui/badge/index.js";
  import { CheckCircle, AlertCircle, Loader, Mail } from "lucide-svelte";
  import { setSetting } from "../lib/store/settings.js";

  const TOKEN_KEY = "me-ai:oauth-token";

  /** @type {"processing" | "success" | "error" | "idle"} */
  let phase       = $state("idle");
  let errorMsg    = $state("");
  let tokenTTLMin = $state(0);
  let savedOk     = $state(false);

  /** @returns {Record<string, string>} */
  function parseOAuthFragment() {
    // The raw URL looks like:  .../index.html#oauth-redirect#access_token=...
    // location.hash gives us:  #oauth-redirect  (only the first fragment)
    // We need to parse the raw href for the second fragment.
    const raw = window.location.href;
    const secondHash = raw.indexOf("#", raw.indexOf("#") + 1);
    if (secondHash === -1) return {};
    const fragment = raw.slice(secondHash + 1);
    return Object.fromEntries(new URLSearchParams(fragment));
  }

  async function processRedirect() {
    phase = "processing";
    const params = parseOAuthFragment();

    if (params.error) {
      errorMsg = params.error_description
        ? decodeURIComponent(params.error_description)
        : params.error;
      phase = "error";
      return;
    }

    if (!params.access_token || !params.expires_in) {
      // No token in URL — user landed here directly, show the "start" screen
      phase = "idle";
      return;
    }

    try {
      const expiresIn = parseInt(params.expires_in, 10);
      const expiresAt = Date.now() + expiresIn * 1000;
      await setSetting(TOKEN_KEY, { access_token: params.access_token, expires_at: expiresAt });
      tokenTTLMin = Math.floor(expiresIn / 60);
      savedOk = true;
      // Clean the token out of the URL bar
      history.replaceState(null, "", window.location.pathname + "#oauth-redirect");
    } catch (e) {
      savedOk = false;
    }

    phase = "success";
  }

  /** @returns {string} */
  function buildRedirectAuthUrl() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      || "562478245230-1gohf6dtsajqo1lu3kge9k7cthm4sdv6.apps.googleusercontent.com";
    const redirectUri = window.location.origin + window.location.pathname + "#oauth-redirect";
    const scope = "https://www.googleapis.com/auth/gmail.modify";
    return (
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(scope)}` +
      `&prompt=consent`
    );
  }

  onMount(processRedirect);
</script>

<div class="flex flex-col items-center justify-center min-h-full p-8">
  <div class="w-full max-w-md flex flex-col gap-6">

    <!-- Header -->
    <div class="flex flex-col items-center gap-3 text-center">
      <div class="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Mail class="size-6 text-primary" />
      </div>
      <div>
        <h1 class="text-xl font-semibold tracking-tight text-foreground">Google OAuth</h1>
        <p class="text-sm text-muted-foreground mt-1">Redirect-based sign-in flow</p>
      </div>
    </div>

    <!-- Card -->
    <div class="rounded-lg border border-border bg-card p-6 flex flex-col gap-5">

      {#if phase === "processing"}
        <div class="flex flex-col items-center gap-3 py-4">
          <Loader class="size-5 text-primary animate-spin" />
          <p class="text-sm text-muted-foreground">Processing authentication…</p>
        </div>

      {:else if phase === "success"}
        <div class="flex items-center gap-3 p-3 rounded border border-success/25 bg-success/8">
          <CheckCircle class="size-4 text-success shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-foreground">Successfully authenticated</p>
            <p class="text-xs text-muted-foreground mt-0.5">
              Token saved · {tokenTTLMin} minutes remaining ·
              {savedOk ? "stored ✓" : "storage failed ✗"}
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <Button href="#sources" class="w-full gap-2">
            <Mail class="size-3.5" />
            Go to Sources
          </Button>
          <Button variant="outline" href="#chat" class="w-full">
            Back to Chat
          </Button>
        </div>

      {:else if phase === "error"}
        <div class="flex items-start gap-3 p-3 rounded border border-destructive/25 bg-destructive/8">
          <AlertCircle class="size-4 text-destructive shrink-0 mt-0.5" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-destructive">Authentication failed</p>
            <p class="text-xs text-muted-foreground mt-0.5 break-words">{errorMsg}</p>
          </div>
        </div>
        <Button href={buildRedirectAuthUrl()} class="w-full gap-2.5">
          {@render GoogleIcon()}
          Try again
        </Button>

      {:else}
        <!-- idle: no token in URL, show the start screen -->
        <div class="flex flex-col gap-3">
          <p class="text-sm text-muted-foreground leading-relaxed">
            This flow redirects you to Google and back. Useful in environments
            where popups are blocked (e.g. Cursor's embedded browser).
          </p>

          <div class="rounded border border-border bg-muted/40 p-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
            <div class="flex items-center gap-2">
              <span class="size-1 rounded-full bg-primary shrink-0"></span>
              Click the button — you'll be redirected to Google
            </div>
            <div class="flex items-center gap-2">
              <span class="size-1 rounded-full bg-primary shrink-0"></span>
              After approval, you'll land back here automatically
            </div>
            <div class="flex items-center gap-2">
              <span class="size-1 rounded-full bg-primary shrink-0"></span>
              Token is saved locally and the app is ready to use
            </div>
          </div>
        </div>

        <Button href={buildRedirectAuthUrl()} class="w-full gap-2.5">
          {@render GoogleIcon()}
          Sign in with Google (redirect)
        </Button>

        <p class="text-center text-xs text-muted-foreground">
          Prefer popups?
          <a href="#auth" class="text-primary hover:underline no-underline">Use the standard flow</a>
        </p>
      {/if}

    </div>

    <a href="#chat" class="text-center text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">
      ← Back to Chat
    </a>
  </div>
</div>

{#snippet GoogleIcon()}
  <svg class="size-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
{/snippet}
