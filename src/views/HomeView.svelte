<script lang="ts">
  import { onMount } from "svelte";
  import { getSavedToken, isTokenValid } from "../lib/google-auth.js";
  import { getSetting } from "../lib/store/settings.js";
  import { getEventStats } from "../lib/rules.js";
  import { getClassificationCounts } from "../lib/triage.js";
  import { getGmailSyncStatus } from "../lib/store/gmail-sync.js";
  import Chat from "../Chat.svelte";
  import { GitBranch, CheckCircle2, Zap, ScanSearch, Mail, ArrowRight } from "lucide-svelte";

  interface SyncStatus { synced: boolean; totalItems: number; lastSyncAt: number | null; hasMore: boolean; }

  let gmailConnected = $state(false);
  let gmailEmail     = $state<string | null>(null);
  let emailCount     = $state(0);
  let scannedCount   = $state(0);
  let pipelineCount  = $state(0);
  let checking       = $state(true);

  onMount(async () => {
    try {
      const token = await getSavedToken();
      if (token && isTokenValid()) {
        const profile = await getSetting("gmail-profile") as { emailAddress?: string } | null;
        gmailEmail    = profile?.emailAddress ?? "Gmail";
        gmailConnected = true;
      }
    } catch {}

    try {
      const status = await getGmailSyncStatus() as SyncStatus;
      emailCount = status.totalItems ?? 0;
    } catch {}

    try {
      const counts = await getClassificationCounts() as { total?: number };
      scannedCount = counts.total ?? 0;
    } catch {}

    try {
      const stats = await getEventStats() as { total?: number };
      pipelineCount = stats.total ?? 0;
    } catch {}

    checking = false;
  });

  // Step states: idle | active | done
  const s1 = $derived(gmailConnected ? (emailCount > 0 ? 'done' : 'active') : 'idle');
  const s2 = $derived(emailCount > 0 ? (scannedCount > 0 ? 'done' : 'active') : 'idle');
  const s3 = $derived(scannedCount > 0 ? (pipelineCount > 0 ? 'done' : 'active') : 'idle');
</script>

<div class="flex flex-col h-full overflow-hidden">

  <!-- ── Top bar: brand ────────────────────────────────────────── -->
  <div class="flex items-center gap-2 px-4 h-11 shrink-0 border-b border-border bg-sidebar">
    <div class="size-6 rounded bg-primary flex items-center justify-center shrink-0">
      <Zap class="size-3.5 text-primary-foreground" />
    </div>
    <span class="text-sm font-semibold tracking-tight text-foreground">me-ai</span>
  </div>

  <!-- ── Workflow strip ────────────────────────────────────────── -->
  <div class="shrink-0 border-b border-border bg-sidebar/60 px-6 py-4">
    {#if checking}
      <!-- Skeleton -->
      <div class="flex items-center gap-3">
        {#each [1,2,3] as _}
          <div class="flex-1 h-16 rounded-xl bg-muted/40 animate-pulse"></div>
          {#if _ < 3}<div class="size-5 rounded-full bg-muted/30 animate-pulse shrink-0"></div>{/if}
        {/each}
      </div>
    {:else}
      <div class="flex items-stretch gap-2">

        <!-- ── Step 1: Sources ───────────────────────────────── -->
        <a href="#sources" class="
          group flex-1 flex flex-col gap-2 px-4 py-3 rounded-xl border no-underline transition-all duration-200
          {s1 === 'done'   ? 'border-success/30 bg-success/5 hover:bg-success/8'
          : s1 === 'active' ? 'border-primary/40 bg-primary/5 hover:bg-primary/8 ring-1 ring-primary/20'
          :                   'border-border/50 bg-muted/20 hover:bg-muted/30 opacity-70'}
        ">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="size-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold shrink-0
                {s1 === 'done' ? 'bg-success text-white' : s1 === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}">
                {#if s1 === 'done'}<CheckCircle2 class="size-3" />{:else}1{/if}
              </div>
              <span class="text-xs font-semibold tracking-tight
                {s1 === 'done' ? 'text-success' : s1 === 'active' ? 'text-foreground' : 'text-muted-foreground'}">
                Sources
              </span>
            </div>
            <Mail class="size-3.5 {s1 === 'done' ? 'text-success/60' : s1 === 'active' ? 'text-primary/60' : 'text-muted-foreground/30'}" />
          </div>
          <div class="flex flex-col gap-0.5">
            {#if s1 === 'done'}
              <span class="text-[0.7rem] font-medium text-success/80 truncate">{gmailEmail}</span>
              <span class="text-[0.65rem] text-muted-foreground/50">{emailCount.toLocaleString()} emails synced</span>
            {:else if s1 === 'active'}
              <span class="text-[0.7rem] text-foreground/70">Connected — sync emails</span>
              <span class="text-[0.65rem] text-primary/50">Click to download →</span>
            {:else}
              <span class="text-[0.7rem] text-muted-foreground/50">Connect Gmail or other sources</span>
              <span class="text-[0.65rem] text-muted-foreground/30">Start here</span>
            {/if}
          </div>
        </a>

        <!-- Connector -->
        <div class="flex items-center shrink-0 self-center">
          <ArrowRight class="size-4 {s2 !== 'idle' ? 'text-muted-foreground/50' : 'text-muted-foreground/20'}" />
        </div>

        <!-- ── Step 2: Scan ──────────────────────────────────── -->
        <a href="#scan" class="
          group flex-1 flex flex-col gap-2 px-4 py-3 rounded-xl border no-underline transition-all duration-200
          {s2 === 'done'   ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/8'
          : s2 === 'active' ? 'border-primary/40 bg-primary/5 hover:bg-primary/8 ring-1 ring-primary/20'
          :                   'border-border/50 bg-muted/20 hover:bg-muted/30 opacity-40 pointer-events-none'}
        ">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="size-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold shrink-0
                {s2 === 'done' ? 'bg-amber-500 text-white' : s2 === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}">
                {#if s2 === 'done'}<CheckCircle2 class="size-3" />{:else}2{/if}
              </div>
              <span class="text-xs font-semibold tracking-tight
                {s2 === 'done' ? 'text-amber-400' : s2 === 'active' ? 'text-foreground' : 'text-muted-foreground'}">
                Scan
              </span>
            </div>
            <ScanSearch class="size-3.5 {s2 === 'done' ? 'text-amber-400/60' : s2 === 'active' ? 'text-primary/60' : 'text-muted-foreground/30'}" />
          </div>
          <div class="flex flex-col gap-0.5">
            {#if s2 === 'done'}
              <span class="text-[0.7rem] font-medium text-amber-400/80">{scannedCount.toLocaleString()} classified</span>
              <span class="text-[0.65rem] text-muted-foreground/50">AI has processed your emails</span>
            {:else if s2 === 'active'}
              <span class="text-[0.7rem] text-foreground/70">{emailCount.toLocaleString()} emails ready</span>
              <span class="text-[0.65rem] text-primary/50">Run AI classifier →</span>
            {:else}
              <span class="text-[0.7rem] text-muted-foreground/50">AI classifies your emails</span>
              <span class="text-[0.65rem] text-muted-foreground/30">After sources</span>
            {/if}
          </div>
        </a>

        <!-- Connector -->
        <div class="flex items-center shrink-0 self-center">
          <ArrowRight class="size-4 {s3 !== 'idle' ? 'text-muted-foreground/50' : 'text-muted-foreground/20'}" />
        </div>

        <!-- ── Step 3: Control Plane ─────────────────────────── -->
        <a href="#pipelines" class="
          group flex-1 flex flex-col gap-2 px-4 py-3 rounded-xl border no-underline transition-all duration-200
          {s3 === 'done'   ? 'border-primary/30 bg-primary/5 hover:bg-primary/8'
          : s3 === 'active' ? 'border-primary/40 bg-primary/5 hover:bg-primary/8 ring-1 ring-primary/20'
          :                   'border-border/50 bg-muted/20 hover:bg-muted/30 opacity-40 pointer-events-none'}
        ">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="size-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold shrink-0
                {s3 === 'done' ? 'bg-primary text-primary-foreground' : s3 === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}">
                {#if s3 === 'done'}<CheckCircle2 class="size-3" />{:else}3{/if}
              </div>
              <span class="text-xs font-semibold tracking-tight
                {s3 !== 'idle' ? 'text-foreground' : 'text-muted-foreground'}">
                Control plane
              </span>
            </div>
            <GitBranch class="size-3.5 {s3 !== 'idle' ? 'text-primary/60' : 'text-muted-foreground/30'}" />
          </div>
          <div class="flex flex-col gap-0.5">
            {#if s3 === 'done'}
              <span class="text-[0.7rem] font-medium text-primary/80">{pipelineCount} pipeline{pipelineCount === 1 ? '' : 's'} active</span>
              <span class="text-[0.65rem] text-muted-foreground/50">Rules & actions configured</span>
            {:else if s3 === 'active'}
              <span class="text-[0.7rem] text-foreground/70">Ready to configure</span>
              <span class="text-[0.65rem] text-primary/50">Set up rules & actions →</span>
            {:else}
              <span class="text-[0.7rem] text-muted-foreground/50">Rules, pipelines & approvals</span>
              <span class="text-[0.65rem] text-muted-foreground/30">After scanning</span>
            {/if}
          </div>
        </a>

      </div>
    {/if}
  </div>

  <!-- ── Chat: full remaining height ──────────────────────────── -->
  <div class="flex-1 overflow-hidden flex flex-col">
    <Chat />
  </div>

</div>
