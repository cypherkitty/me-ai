<script lang="ts">
  import { onMount } from "svelte";
  import StreamView        from "./views/StreamView.svelte";
  import PipelinesView     from "./views/PipelinesView.svelte";
  import ApprovalsView     from "./views/ApprovalsView.svelte";
  import SourcesView       from "./views/SourcesView.svelte";
  import PluginsView       from "./views/PluginsView.svelte";
  import AuditView         from "./views/AuditView.svelte";
  import OAuthView         from "./views/OAuthView.svelte";
  import OAuthRedirectView from "./views/OAuthRedirectView.svelte";
  import HomeView          from "./views/HomeView.svelte";
  import ControlBoard      from "./ControlBoard.svelte";
  import { cn }            from "$lib/utils.js";
  import {
    Zap, Activity, GitBranch, CheckSquare, Mail,
    ScanSearch, ClipboardList, ChevronLeft, ArrowLeft,
  } from "lucide-svelte";
  import { getEventStats } from "./lib/rules.js";
  import { getSavedToken, isTokenValid } from "./lib/google-auth.js";

  const OAUTH_PAGES   = ["auth", "oauth-redirect"];
  const SOURCE_PAGES  = ["sources", "plugins"];
  const CP_PAGES      = ["stream", "pipelines", "approvals", "audit", "scan"];
  // keep "chat" in ALL_PAGES so old links don't 404 — redirect to home
  const ALL_PAGES     = [...OAUTH_PAGES, ...SOURCE_PAGES, ...CP_PAGES, "home", "chat"];

  function getPage() {
    const h = location.hash.replace("#", "");
    if (h === "chat") return "home"; // redirect chat → home
    return ALL_PAGES.includes(h) ? h : "home";
  }

  let page          = $state(getPage());
  const inOAuth     = $derived(OAUTH_PAGES.includes(page));
  const inSources   = $derived(SOURCE_PAGES.includes(page));
  const inCP        = $derived(CP_PAGES.includes(page));
  const inHome      = $derived(page === "home");

  interface EventStats { total: number; completed: number; awaiting_user: number; escalated: number; failed: number; }
  let stats         = $state<EventStats>({ total: 0, completed: 0, awaiting_user: 0, escalated: 0, failed: 0 });
  let gmailEmail    = $state<string | null>(null);
  let gmailChecking = $state(true);

  async function loadStats() {
    try { stats = await getEventStats() as EventStats; } catch {}
  }

  async function checkGmailAuth() {
    gmailChecking = true;
    try {
      const token = await getSavedToken();
      if (token && isTokenValid()) {
        const { getSetting } = await import("./lib/store/settings.js");
        const profile = await getSetting("gmail-profile") as { emailAddress?: string } | null;
        gmailEmail = profile?.emailAddress ?? "Gmail";
      } else {
        gmailEmail = null;
      }
    } catch {
      gmailEmail = null;
    }
    gmailChecking = false;
  }

  onMount(() => {
    const onHash = () => { page = getPage(); };
    window.addEventListener("hashchange", onHash);
    checkGmailAuth();
    loadStats();
    return () => window.removeEventListener("hashchange", onHash);
  });

  $effect(() => {
    if (inHome || inSources) checkGmailAuth();
    if (inCP) loadStats();
  });
</script>

{#if inOAuth}
  <!-- ── OAuth pages (full-screen, no chrome) ─────────────────── -->
  <div class="flex flex-col h-dvh w-full overflow-hidden bg-background">
    {#if page === "auth"}
      <OAuthView />
    {:else}
      <OAuthRedirectView />
    {/if}
  </div>

{:else if inHome}
  <!-- ── Home: setup panel + chat ─────────────────────────────── -->
  <div class="flex flex-col h-dvh w-full overflow-hidden">
    <!-- Minimal top bar -->
    <header class="flex items-center justify-between px-5 h-11 border-b border-border bg-sidebar shrink-0">
      <div class="flex items-center gap-2">
        <div class="size-6 rounded bg-primary flex items-center justify-center shrink-0">
          <Zap class="size-3.5 text-primary-foreground" />
        </div>
        <span class="text-sm font-semibold tracking-tight text-foreground">me-ai</span>
      </div>
      <div class="flex items-center gap-2">
        {#if !gmailChecking}
          {#if gmailEmail}
            <a href="#sources" class="flex items-center gap-1.5 px-2 py-1 rounded border text-xs
               text-success border-success/25 bg-success/6 hover:bg-success/12 transition-colors no-underline">
              <span class="size-1 rounded-full bg-success shrink-0"></span>
              <Mail class="size-3 shrink-0" />
              <span class="truncate max-w-[140px] tracking-tight">{gmailEmail}</span>
            </a>
          {:else}
            <a href="#sources" class="flex items-center gap-1.5 px-2 py-1 rounded border text-xs
               text-muted-foreground border-border hover:text-foreground transition-colors no-underline tracking-tight">
              <Mail class="size-3" />Connect Gmail
            </a>
          {/if}
        {/if}
        <a href="#pipelines" class="flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium
           text-muted-foreground border-border hover:text-primary hover:border-primary/40 transition-colors no-underline tracking-tight">
          <Zap class="size-3" />Control Plane
        </a>
      </div>
    </header>
    <div class="flex-1 overflow-hidden">
      <HomeView />
    </div>
  </div>

{:else if inSources}
  <!-- ── Sources: standalone, no control-plane sidebar ────────── -->
  <div class="flex flex-col h-dvh w-full overflow-hidden">
    <header class="flex items-center justify-between px-5 h-11 border-b border-border bg-sidebar shrink-0">
      <div class="flex items-center gap-3">
        <a href="#home" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
           transition-colors no-underline">
          <ArrowLeft class="size-3.5" />
          <span class="tracking-tight">Home</span>
        </a>
        <div class="w-px h-4 bg-border shrink-0"></div>
        <div class="flex items-center gap-2">
          <div class="size-6 rounded bg-primary flex items-center justify-center shrink-0">
            <Zap class="size-3.5 text-primary-foreground" />
          </div>
          <span class="text-sm font-semibold tracking-tight text-foreground">Sources</span>
        </div>
      </div>
      <a href="#pipelines" class="flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium
         text-muted-foreground border-border hover:text-primary hover:border-primary/40 transition-colors no-underline tracking-tight">
        <Zap class="size-3" />Control Plane
      </a>
    </header>
    <div class="flex-1 overflow-hidden flex flex-col">
      <div style:display={page === "sources" ? "contents" : "none"}><SourcesView /></div>
      <div style:display={page === "plugins" ? "contents" : "none"}><PluginsView /></div>
    </div>
  </div>

{:else}
  <!-- ── Control Plane: sidebar layout ────────────────────────── -->
  <div class="flex h-dvh w-full overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-52 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden">
      <!-- Brand -->
      <div class="flex items-center gap-2.5 px-4 h-12 border-b border-sidebar-border shrink-0">
        <div class="size-6 rounded bg-primary flex items-center justify-center shrink-0">
          <Zap class="size-3.5 text-primary-foreground" />
        </div>
        <span class="text-sm font-semibold tracking-tight text-foreground">me-ai</span>
      </div>

      <!-- Nav -->
      <nav class="flex flex-col flex-1 overflow-y-auto py-1.5">
        <div class="px-4 pt-1 pb-0.5">
          <span class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/50">Control Plane</span>
        </div>

        <a href="#stream"
          class={cn("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors no-underline",
            page === "stream"
              ? "text-foreground font-medium bg-sidebar-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
          )}
        >
          {#if page === "stream"}<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>{/if}
          <Activity class="size-3.5 shrink-0" />
          <span class="flex-1 tracking-tight">Event Stream</span>
        </a>

        <a href="#pipelines"
          class={cn("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors no-underline",
            page === "pipelines"
              ? "text-foreground font-medium bg-sidebar-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
          )}
        >
          {#if page === "pipelines"}<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>{/if}
          <GitBranch class="size-3.5 shrink-0" />
          <span class="flex-1 tracking-tight">Pipelines</span>
          {#if stats.total > 0}
            <span class="text-[0.6rem] font-bold tabular-nums px-1.5 py-px rounded bg-primary/15 text-primary mr-1">
              {stats.total}
            </span>
          {/if}
        </a>

        <a href="#approvals"
          class={cn("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors no-underline",
            page === "approvals"
              ? "text-foreground font-medium bg-sidebar-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
          )}
        >
          {#if page === "approvals"}<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>{/if}
          <CheckSquare class="size-3.5 shrink-0" />
          <span class="flex-1 tracking-tight">Approvals</span>
          {#if stats.awaiting_user > 0}
            <span class="text-[0.6rem] font-bold tabular-nums px-1.5 py-px rounded bg-primary text-primary-foreground mr-1">
              {stats.awaiting_user}
            </span>
          {/if}
        </a>

        <a href="#audit"
          class={cn("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors no-underline",
            page === "audit"
              ? "text-foreground font-medium bg-sidebar-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
          )}
        >
          {#if page === "audit"}<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>{/if}
          <ClipboardList class="size-3.5 shrink-0" />
          <span class="flex-1 tracking-tight">Audit Trail</span>
        </a>

        <a href="#scan"
          class={cn("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors no-underline",
            page === "scan"
              ? "text-foreground font-medium bg-sidebar-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
          )}
        >
          {#if page === "scan"}<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>{/if}
          <ScanSearch class="size-3.5 shrink-0" />
          <span class="flex-1 tracking-tight">Scan</span>
        </a>
      </nav>

      <!-- Bottom -->
      <div class="h-px bg-sidebar-border mx-4 shrink-0"></div>
      <div class="py-2 flex flex-col shrink-0">
        <a href="#home" class="flex items-center gap-2 px-4 py-1.5 text-xs text-muted-foreground/50
           hover:text-muted-foreground transition-colors no-underline">
          <ChevronLeft class="size-3" />
          Back to Home
        </a>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 overflow-hidden flex flex-col bg-background">
      <div class="flex-1 flex flex-col overflow-hidden" style:display={page === "stream"    ? "flex" : "none"}><StreamView    /></div>
      <div class="flex-1 flex flex-col overflow-hidden" style:display={page === "pipelines" ? "flex" : "none"}><PipelinesView  /></div>
      <div class="flex-1 flex flex-col overflow-hidden" style:display={page === "approvals" ? "flex" : "none"}><ApprovalsView  /></div>
      <div class="flex-1 flex flex-col overflow-hidden" style:display={page === "audit"     ? "flex" : "none"}><AuditView     /></div>
      <div class="flex-1 flex flex-col overflow-hidden" style:display={page === "scan"      ? "flex" : "none"}><ControlBoard  /></div>
    </main>
  </div>
{/if}
