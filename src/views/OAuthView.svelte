<script>
  import { onMount } from "svelte";
  import { Button }  from "$lib/components/ui/button/index.js";
  import { Badge }   from "$lib/components/ui/badge/index.js";
  import { cn }      from "$lib/utils.js";
  import { Zap, Mail, CheckCircle, AlertCircle, Loader } from "lucide-svelte";
  import {
    initGoogleAuth,
    requestAccessToken,
    getSavedToken,
    isTokenValid,
    getTokenTTL,
    revokeToken,
  } from "../lib/google-auth.js";
  import { getSetting } from "../lib/store/settings.js";

  const DEFAULT_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
    || "562478245230-1gohf6dtsajqo1lu3kge9k7cthm4sdv6.apps.googleusercontent.com";

  /** @type {"idle" | "loading" | "success" | "error"} */
  let status      = $state("idle");
  let errorMsg    = $state("");
  /** @type {{ emailAddress?: string } | null} */
  let profile     = $state(null);
  let tokenTTLMin = $state(0);
  let initialized = $state(false);

  async function init() {
    try {
      await initGoogleAuth(DEFAULT_CLIENT_ID);
      initialized = true;
      const token = await getSavedToken();
      if (token && isTokenValid()) {
        profile = await getSetting("gmail-profile");
        tokenTTLMin = Math.floor(getTokenTTL() / 60_000);
        status = "success";
      }
    } catch (e) {
      errorMsg = e instanceof Error ? e.message : String(e);
      status = "error";
    }
  }

  async function signIn() {
    status = "loading";
    errorMsg = "";
    try {
      await requestAccessToken();
      profile = await getSetting("gmail-profile");
      tokenTTLMin = Math.floor(getTokenTTL() / 60_000);
      status = "success";
    } catch (e) {
      errorMsg = e instanceof Error ? e.message : String(e);
      status = "error";
    }
  }

  async function signOut() {
    const token = await getSavedToken();
    if (token) await revokeToken(token.access_token);
    profile = null;
    tokenTTLMin = 0;
    status = "idle";
  }

  onMount(init);
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
        <p class="text-sm text-muted-foreground mt-1">
          Authorize me-ai to access your Gmail messages
        </p>
      </div>
    </div>

    <!-- Card -->
    <div class="rounded-lg border border-border bg-card p-6 flex flex-col gap-5">

      {#if status === "success" && profile}
        <!-- Connected state -->
        <div class="flex items-center gap-3 p-3 rounded border border-success/25 bg-success/8">
          <CheckCircle class="size-4 text-success shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-foreground">Connected</p>
            <p class="text-xs text-muted-foreground truncate">{profile.emailAddress ?? "Gmail account"}</p>
          </div>
          <Badge variant="outline" class="text-success border-success/30 bg-success/10 shrink-0 text-[0.6rem]">
            {tokenTTLMin}m left
          </Badge>
        </div>

        <div class="flex flex-col gap-2">
          <Button href="#sources" class="w-full gap-2">
            <Zap class="size-3.5" />
            Go to Sources
          </Button>
          <Button variant="ghost" onclick={signOut} class="w-full text-muted-foreground">
            Disconnect
          </Button>
        </div>

      {:else if status === "loading"}
        <!-- Loading state -->
        <div class="flex flex-col items-center gap-3 py-4">
          <Loader class="size-5 text-primary animate-spin" />
          <p class="text-sm text-muted-foreground">Opening Google sign-in…</p>
        </div>

      {:else if status === "error"}
        <!-- Error state -->
        <div class="flex items-start gap-3 p-3 rounded border border-destructive/25 bg-destructive/8">
          <AlertCircle class="size-4 text-destructive shrink-0 mt-0.5" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-destructive">Authentication failed</p>
            <p class="text-xs text-muted-foreground mt-0.5 break-words">{errorMsg}</p>
          </div>
        </div>
        <Button onclick={signIn} class="w-full gap-2" disabled={!initialized}>
          {@render GoogleIcon()}
          Try again
        </Button>

      {:else}
        <!-- Idle state -->
        <div class="flex flex-col gap-3">
          <p class="text-sm text-muted-foreground leading-relaxed">
            Sign in with Google to let me-ai read and manage your Gmail messages
            for automated pipeline processing.
          </p>

          <div class="rounded border border-border bg-muted/40 p-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
            <div class="flex items-center gap-2">
              <span class="size-1 rounded-full bg-success shrink-0"></span>
              Read and modify Gmail messages
            </div>
            <div class="flex items-center gap-2">
              <span class="size-1 rounded-full bg-success shrink-0"></span>
              Token stored locally — never sent to any server
            </div>
            <div class="flex items-center gap-2">
              <span class="size-1 rounded-full bg-success shrink-0"></span>
              Revoke access at any time from Google Account settings
            </div>
          </div>
        </div>

        <Button onclick={signIn} class="w-full gap-2.5" disabled={!initialized}>
          {@render GoogleIcon()}
          Sign in with Google
        </Button>

        <p class="text-center text-[0.65rem] text-muted-foreground/60">
          Client ID: <span class="font-mono">{DEFAULT_CLIENT_ID.slice(0, 30)}…</span>
        </p>
      {/if}

    </div>

    <!-- Back link -->
    <a href="#home" class="text-center text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">
      ← Back to Home
    </a>
  </div>
</div>

<!-- Inline Google "G" logo SVG as a snippet -->
{#snippet GoogleIcon()}
  <svg class="size-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
{/snippet}
