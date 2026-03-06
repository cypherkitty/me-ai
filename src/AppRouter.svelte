<script lang="ts">
  import StreamView        from "./views/StreamView.svelte";
  import PipelinesView     from "./views/PipelinesView.svelte";
  import ApprovalsView     from "./views/ApprovalsView.svelte";
  import SourcesView       from "./views/SourcesView.svelte";
  import PluginsView       from "./views/PluginsView.svelte";
  import AdminView         from "./views/AdminView.svelte";
  import OAuthView         from "./views/OAuthView.svelte";
  import OAuthRedirectView from "./views/OAuthRedirectView.svelte";
  import HomeView          from "./views/HomeView.svelte";
  import ControlBoard      from "./ControlBoard.svelte";
  import { cn }            from "$lib/utils.js";
  import {
    Zap, Activity, GitBranch, CheckSquare,
    ArrowLeft, ScanSearch, ShieldCheck,
  } from "lucide-svelte";

  interface Props {
    page: string;
    inOAuth: boolean;
    inHome: boolean;
    inSources: boolean;
    inScan: boolean;
    inAdmin: boolean;
    stats: { total: number; completed: number; awaiting_user: number; escalated: number; failed: number };
  }
  let { page, inOAuth, inHome, inSources, inScan, inAdmin, stats }: Props = $props();
</script>

<div class="h-full w-full overflow-hidden">
{#if inOAuth}
  <div class="flex flex-col h-full w-full overflow-hidden bg-background">
    {#if page === "auth"}
      <OAuthView />
    {:else}
      <OAuthRedirectView />
    {/if}
  </div>

{:else if inHome}
  <div class="h-full w-full overflow-hidden">
    <HomeView />
  </div>

{:else if inSources}
  <div class="flex flex-col h-full w-full overflow-hidden">
    <header class="flex items-center gap-3 px-5 h-11 border-b border-border bg-sidebar shrink-0">
      <a href="#home" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
         transition-colors no-underline shrink-0">
        <ArrowLeft class="size-3.5" />
        <span class="tracking-tight">Home</span>
      </a>
      <div class="w-px h-4 bg-border shrink-0"></div>
      <div class="size-6 rounded bg-primary flex items-center justify-center shrink-0">
        <Zap class="size-3.5 text-primary-foreground" />
      </div>
      <span class="text-sm font-semibold tracking-tight text-foreground">Sources</span>
    </header>
    <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
      <div style:display={page === "sources" ? "contents" : "none"}><SourcesView /></div>
      <div style:display={page === "plugins" ? "contents" : "none"}><PluginsView /></div>
    </div>
  </div>

{:else if inScan}
  <div class="flex flex-col h-full w-full overflow-hidden">
    <header class="flex items-center gap-3 px-5 h-11 border-b border-border bg-sidebar shrink-0">
      <a href="#home" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
         transition-colors no-underline shrink-0">
        <ArrowLeft class="size-3.5" />
        <span class="tracking-tight">Home</span>
      </a>
      <div class="w-px h-4 bg-border shrink-0"></div>
      <div class="size-6 rounded bg-primary flex items-center justify-center shrink-0">
        <ScanSearch class="size-3.5 text-primary-foreground" />
      </div>
      <span class="text-sm font-semibold tracking-tight text-foreground">Scan</span>
    </header>
    <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
      <ControlBoard />
    </div>
  </div>

{:else if inAdmin}
  <div class="flex flex-col h-full w-full overflow-hidden">
    <header class="flex items-center gap-3 px-5 h-11 border-b border-border bg-sidebar shrink-0">
      <a href="#home" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
         transition-colors no-underline shrink-0">
        <ArrowLeft class="size-3.5" />
        <span class="tracking-tight">Home</span>
      </a>
      <div class="w-px h-4 bg-border shrink-0"></div>
      <div class="size-6 rounded bg-primary flex items-center justify-center shrink-0">
        <ShieldCheck class="size-3.5 text-primary-foreground" />
      </div>
      <span class="text-sm font-semibold tracking-tight text-foreground">Admin</span>
    </header>
    <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
      <AdminView />
    </div>
  </div>

{:else}
  <div class="flex h-full w-full overflow-hidden">
    <aside class="w-52 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden">
      <div class="flex items-center gap-3 px-4 h-11 border-b border-sidebar-border shrink-0">
        <a href="#home" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
           transition-colors no-underline shrink-0">
          <ArrowLeft class="size-3.5" />
          <span class="tracking-tight">Home</span>
        </a>
        <div class="w-px h-4 bg-sidebar-border shrink-0"></div>
        <div class="size-6 rounded bg-primary flex items-center justify-center shrink-0">
          <Zap class="size-3.5 text-primary-foreground" />
        </div>
        <span class="text-sm font-semibold tracking-tight text-foreground">me-ai</span>
      </div>

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
      </nav>
    </aside>

    <main class="flex-1 min-h-0 overflow-hidden flex flex-col bg-background">
      <div class="flex-1 min-h-0 flex flex-col overflow-hidden" style:display={page === "stream"    ? "flex" : "none"}><StreamView    /></div>
      <div class="flex-1 min-h-0 flex flex-col overflow-hidden" style:display={page === "pipelines" ? "flex" : "none"}><PipelinesView  /></div>
      <div class="flex-1 min-h-0 flex flex-col overflow-hidden" style:display={page === "approvals" ? "flex" : "none"}><ApprovalsView  /></div>
    </main>
  </div>
{/if}
</div>
