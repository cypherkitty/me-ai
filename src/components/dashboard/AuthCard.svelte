<script>
  import { onMount } from "svelte";
  import ErrorCard from "../shared/ErrorCard.svelte";
  import { mountLog } from "../../lib/debug.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Card, CardContent } from "$lib/components/ui/card/index.js";

  let { clientId, isDefaultClientId = false, error = null, loadingAuth = false, onsignin, onclear, onsignout } = $props();

  onMount(() => mountLog("AuthCard"));
</script>

<div class="flex items-center justify-center min-h-full p-8">
  <Card class="w-full max-w-[560px]">
    <CardContent class="pt-8 pb-8 px-8 flex flex-col gap-5">
      <div>
        <h2 class="text-xl font-bold tracking-tight mb-2">Gmail Dashboard</h2>
        <p class="text-sm text-muted-foreground leading-relaxed">
          Sign in with your Google account to browse your Gmail messages.
          Read-only access — nothing is modified.
        </p>
      </div>

      {#if error}
        <ErrorCard {error} {onsignout} />
      {/if}

      <button
        onclick={onsignin}
        disabled={loadingAuth}
        class="flex items-center justify-center gap-2.5 w-full px-4 py-3 text-sm font-medium bg-white text-[#333] border border-[#ddd] rounded hover:bg-[#f8f8f8] hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {#if loadingAuth}
          <span class="size-[18px] rounded-full border-2 border-[#333]/20 border-t-primary animate-spin shrink-0"></span>
          Signing in…
        {:else}
          <svg viewBox="0 0 24 24" width="18" height="18" class="shrink-0" aria-hidden>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        {/if}
      </button>

      <p class="text-xs text-muted-foreground/50 leading-relaxed">
        Popup blocked? Use
        <a href="/oauth-redirect.html" class="text-primary hover:underline">Sign in with Google (redirect)</a>
        — works in Cursor and environments without popups.
      </p>

      <div class="flex items-center gap-2 text-xs text-muted-foreground/40">
        <span>Client ID:</span>
        {#if isDefaultClientId}
          <Badge variant="outline" class="text-[0.62rem] text-success border-success/25 bg-success/6 h-4 px-1.5">
            shared default
          </Badge>
        {:else}
          <code class="font-mono text-muted-foreground/60">{clientId.slice(0, 20)}…</code>
        {/if}
        <button onclick={onclear} class="text-primary hover:underline text-xs">Change</button>
      </div>
    </CardContent>
  </Card>
</div>
