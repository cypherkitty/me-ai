<script>
  import { onMount } from "svelte";
  import StreamView        from "./views/StreamView.svelte";
  import PipelinesView     from "./views/PipelinesView.svelte";
  import ApprovalsView     from "./views/ApprovalsView.svelte";
  import SourcesView       from "./views/SourcesView.svelte";
  import PluginsView       from "./views/PluginsView.svelte";
  import AuditView         from "./views/AuditView.svelte";
  import OAuthView         from "./views/OAuthView.svelte";
  import OAuthRedirectView from "./views/OAuthRedirectView.svelte";
  import Chat              from "./Chat.svelte";
  import ControlBoard      from "./ControlBoard.svelte";
  import { cn }        from "$lib/utils.js";
  import { Zap, Activity, GitBranch, CheckSquare, Settings, Mail, ScanSearch, ClipboardList, ChevronLeft } from "lucide-svelte";
  import { getEventStats } from "./lib/rules.js";
  import { getSavedToken, isTokenValid } from "./lib/google-auth.js";

  const OAUTH_PAGES    = ["auth", "oauth-redirect"];
  const PIPELINE_PAGES = ["stream", "pipelines", "approvals", "sources", "plugins", "audit", "scan"];
  const ALL_PAGES      = [...OAUTH_PAGES, ...PIPELINE_PAGES, "chat"];

  function getPage() {
    const h = location.hash.replace("#", "");
    return ALL_PAGES.includes(h) ? h : "chat";
  }

  let page         = $state(getPage());
  const inOAuth    = $derived(OAUTH_PAGES.includes(page));
  const inPipeline = $derived(PIPELINE_PAGES.includes(page));

  let stats            = $state({ total: 0, completed: 0, awaiting_user: 0, escalated: 0, failed: 0 });
  let gmailEmail       = $state(null);
  let gmailChecking    = $state(true);
  let statsLoading     = $state(true);

  async function loadStats() {
    try { stats = await getEventStats(); } catch {}
    statsLoading = false;
  }

  async function checkGmailAuth() {
    gmailChecking = true;
    try {
      const token = await getSavedToken();
      if (token && isTokenValid()) {
        const { getSetting } = await import("./lib/store/settings.js");
        const profile = await getSetting("gmail-profile");
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
    if (!inPipeline) checkGmailAuth();
    if (inPipeline) loadStats();
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

{:else if !inPipeline}
  <!-- ── Chat mode ────────────────────────────────────────────── -->
  <div class="flex flex-col h-dvh w-full overflow-hidden">
    <header class="flex items-center justify-between px-5 h-11 border-b border-border bg-sidebar shrink-0">
      <div class="flex items-center gap-2.5">
        <div class="size-6 rounded bg-primary flex items-center justify-center">
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
        <a href="#stream" class="flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium
           text-muted-foreground border-border hover:text-primary hover:border-primary/40 transition-colors no-underline tracking-tight">
          <Zap class="size-3" />Pipeline
        </a>
      </div>
    </header>
    <div class="flex-1 overflow-hidden flex flex-col"><Chat /></div>
  </div>

{:else}
  <!-- ── Pipeline mode ─────────────────────────────────────────── -->
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

      <!-- Divider -->
      <div class="h-px bg-sidebar-border mx-4 shrink-0"></div>

      <!-- Bottom: Settings & Back to Chat -->
      <div class="py-2 flex flex-col shrink-0">
        <a href="#sources"
          class={cn("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors no-underline",
            page === "sources" || page === "plugins"
              ? "text-foreground font-medium bg-sidebar-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
          )}
        >
          {#if page === "sources" || page === "plugins"}<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>{/if}
          <Settings class="size-3.5 shrink-0" />
          <span class="flex-1 tracking-tight">Settings</span>
        </a>
        <a href="#chat" class="flex items-center gap-2 px-4 py-1.5 text-xs text-muted-foreground/50
           hover:text-muted-foreground transition-colors no-underline">
          <ChevronLeft class="size-3" />
          Back to Chat
        </a>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 overflow-hidden flex flex-col bg-background">
      <div class="flex-1 flex flex-col overflow-hidden" style:display={page === "stream"    ? "flex" : "none"}><StreamView    /></div>
      <div class="flex-1 flex flex-col overflow-hidden" style:display={page === "pipelines" ? "flex" : "none"}><PipelinesView  /></div>
      <div class="flex-1 flex flex-col overflow-hidden" style:display={page === "approvals" ? "flex" : "none"}><ApprovalsView  /></div>
      <div class="flex-1 flex flex-col overflow-hidden" style:display={page === "sources"   ? "flex" : "none"}><SourcesView   /></div>
      <div class="flex-1 flex flex-col overflow-hidden" style:display={page === "plugins"   ? "flex" : "none"}><PluginsView   /></div>
      <div class="flex-1 flex flex-col overflow-hidden" style:display={page === "audit"     ? "flex" : "none"}><AuditView     /></div>
      <div class="flex-1 flex flex-col overflow-hidden" style:display={page === "scan"      ? "flex" : "none"}><ControlBoard  /></div>
    </main>
  </div>
{/if}
