<script lang="ts">
  import { onMount } from "svelte";
  import { getSavedToken, isTokenValid } from "../lib/google-auth.js";
  import { getEventStats } from "../lib/rules.js";
  import { getClassificationCounts } from "../lib/triage.js";
  import { getGmailSyncStatus } from "../lib/store/gmail-sync.js";
  import { getUnifiedEngine } from "../lib/unified-engine.js";
  import Chat from "../Chat.svelte";
  import {
    GitBranch,
    CheckCircle2,
    Zap,
    ScanSearch,
    Mail,
    ShieldCheck,
  } from "lucide-svelte";

  interface SyncStatus {
    synced: boolean;
    totalItems: number;
    lastSyncAt: number | null;
    hasMore: boolean;
  }

  let gmailConnected = $state(false);
  let emailCount = $state(0);
  let scannedCount = $state(0);
  let pipelineCount = $state(0);
  let checking = $state(true);

  // Reactively track engine readiness
  const engine = getUnifiedEngine();
  let engineReady = $state(engine.isReady);
  $effect(() => {
    const unsub = engine.onMessage((msg: { status: string }) => {
      if (msg.status === "ready") engineReady = true;
    });
    return unsub;
  });

  onMount(async () => {
    try {
      const token = await getSavedToken();
      if (token && isTokenValid()) {
        gmailConnected = true;
      }
    } catch {}

    try {
      const status = (await getGmailSyncStatus()) as SyncStatus;
      emailCount = status.totalItems ?? 0;
    } catch {}

    try {
      const counts = (await getClassificationCounts()) as { total?: number };
      scannedCount = counts.total ?? 0;
    } catch {}

    try {
      const stats = (await getEventStats()) as { total?: number };
      pipelineCount = stats.total ?? 0;
    } catch {}

    checking = false;
  });

  // Step states: idle | active | done
  const s1 = $derived(
    gmailConnected ? (emailCount > 0 ? "done" : "active") : "idle",
  );
  // Scan requires emails AND AI backend to be loaded
  const s2 = $derived(
    emailCount > 0 && engineReady
      ? scannedCount > 0
        ? "done"
        : "active"
      : "idle",
  );
  const s2Blocked = $derived(emailCount > 0 && !engineReady); // has emails but no AI
  const s3 = $derived(
    scannedCount > 0 ? (pipelineCount > 0 ? "done" : "active") : "idle",
  );
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- ── Top bar: brand ────────────────────────────────────────── -->
  <div
    class="flex items-center gap-2 px-4 h-11 shrink-0 border-b border-border bg-sidebar"
  >
    <div
      class="size-6 rounded bg-primary flex items-center justify-center shrink-0"
    >
      <Zap class="size-3.5 text-primary-foreground" />
    </div>
    <span class="text-sm font-semibold tracking-tight text-foreground"
      >me-ai</span
    >
    <div class="flex-1"></div>
    <a
      href="#admin"
      class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-muted-foreground/50
             hover:text-muted-foreground hover:bg-sidebar-accent/60 transition-colors no-underline"
      title="Admin dashboard"
    >
      <ShieldCheck class="size-3.5" />
      <span class="tracking-tight">Admin</span>
    </a>
  </div>

  <!-- ── Compact Stepper Workflow ────────────────────────────────── -->
  <div
    class="shrink-0 border-b border-border bg-card/40 backdrop-blur-sm px-6 py-2.5"
  >
    {#if checking}
      <!-- Skeleton -->
      <div class="flex items-center justify-center gap-4 animate-pulse h-10">
        <div class="h-8 w-32 bg-muted/40 rounded-full"></div>
        <div class="h-px w-8 bg-muted/40"></div>
        <div class="h-8 w-32 bg-muted/40 rounded-full"></div>
        <div class="h-px w-8 bg-muted/40"></div>
        <div class="h-8 w-32 bg-muted/40 rounded-full"></div>
      </div>
    {:else}
      <div class="flex items-center justify-center">
        <nav aria-label="Progress" class="flex items-center">
          <!-- ── Step 1: Sources ───────────────────────────────── -->
          <a
            href="#sources"
            class="relative flex items-center group no-underline"
          >
            <div
              class="flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 {s1 ===
              'done'
                ? 'bg-success/10 hover:bg-success/20 text-success'
                : s1 === 'active'
                  ? 'bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm'
                  : 'hover:bg-muted/50 text-muted-foreground'}"
            >
              <div
                class="flex items-center justify-center size-5 rounded-full shrink-0 transition-colors {s1 ===
                'done'
                  ? 'bg-success text-success-foreground'
                  : s1 === 'active'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted-foreground/20 text-muted-foreground'}"
              >
                {#if s1 === "done"}<CheckCircle2 class="size-3" />{:else}<Mail
                    class="size-3"
                  />{/if}
              </div>
              <div class="flex flex-col">
                <span
                  class="text-[0.7rem] font-bold uppercase tracking-wider leading-none"
                  >Sources</span
                >
                {#if s1 === "done"}<span
                    class="text-[0.6rem] opacity-80 mt-1 leading-none"
                    >{emailCount.toLocaleString()} emails</span
                  >
                {:else if s1 === "active"}<span
                    class="text-[0.6rem] opacity-80 mt-1 leading-none"
                    >Sync needed</span
                  >
                {:else}<span class="text-[0.6rem] opacity-60 mt-1 leading-none"
                    >Start here</span
                  >{/if}
              </div>
            </div>
          </a>

          <!-- Divider -->
          <div
            class="w-6 sm:w-12 md:w-16 h-px mx-2 transition-colors duration-500 {s2 !==
            'idle'
              ? 'bg-primary/40'
              : 'bg-border/60'}"
          ></div>

          <!-- ── Step 2: Scan ──────────────────────────────────── -->
          <a
            href="#scan"
            class="relative flex items-center group no-underline {s2 === 'idle'
              ? 'pointer-events-none opacity-40 mix-blend-luminosity hover:mix-blend-normal transition-all'
              : ''}"
          >
            <div
              class="flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 {s2 ===
              'done'
                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500'
                : s2 === 'active'
                  ? 'bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm'
                  : 'hover:bg-muted/50 text-muted-foreground'}"
            >
              <div
                class="flex items-center justify-center size-5 rounded-full shrink-0 transition-colors {s2 ===
                'done'
                  ? 'bg-amber-500 text-white'
                  : s2 === 'active'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted-foreground/20 text-muted-foreground'}"
              >
                {#if s2 === "done"}<CheckCircle2
                    class="size-3"
                  />{:else}<ScanSearch class="size-3" />{/if}
              </div>
              <div class="flex flex-col">
                <span
                  class="text-[0.7rem] font-bold uppercase tracking-wider leading-none"
                  >Scan</span
                >
                {#if s2 === "done"}<span
                    class="text-[0.6rem] opacity-80 mt-1 leading-none"
                    >{scannedCount.toLocaleString()} classified</span
                  >
                {:else if s2 === "active"}<span
                    class="text-[0.6rem] opacity-80 mt-1 leading-none"
                    >Ready to run</span
                  >
                {:else if s2Blocked}<span
                    class="text-[0.6rem] opacity-80 mt-1 leading-none text-amber-400/80"
                    >Load AI first</span
                  >
                {:else}<span class="text-[0.6rem] opacity-60 mt-1 leading-none"
                    >Pending sources</span
                  >{/if}
              </div>
            </div>
          </a>

          <!-- Divider -->
          <div
            class="w-6 sm:w-12 md:w-16 h-px mx-2 transition-colors duration-500 {s3 !==
            'idle'
              ? 'bg-primary/40'
              : 'bg-border/60'}"
          ></div>

          <!-- ── Step 3: Control Plane ─────────────────────────── -->
          <a
            href="#pipelines"
            class="relative flex items-center group no-underline {s3 === 'idle'
              ? 'pointer-events-none opacity-40 mix-blend-luminosity hover:mix-blend-normal transition-all'
              : ''}"
          >
            <div
              class="flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 {s3 ===
              'done'
                ? 'bg-primary/10 hover:bg-primary/20 text-primary'
                : s3 === 'active'
                  ? 'bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm'
                  : 'hover:bg-muted/50 text-muted-foreground'}"
            >
              <div
                class="flex items-center justify-center size-5 rounded-full shrink-0 transition-colors {s3 ===
                'done'
                  ? 'bg-primary text-primary-foreground'
                  : s3 === 'active'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted-foreground/20 text-muted-foreground'}"
              >
                {#if s3 === "done"}<CheckCircle2
                    class="size-3"
                  />{:else}<GitBranch class="size-3" />{/if}
              </div>
              <div class="flex flex-col">
                <span
                  class="text-[0.7rem] font-bold uppercase tracking-wider leading-none"
                  >Control</span
                >
                {#if s3 === "done"}<span
                    class="text-[0.6rem] opacity-80 mt-1 leading-none"
                    >{pipelineCount}
                    {pipelineCount === 1 ? "rule" : "rules"} active</span
                  >
                {:else if s3 === "active"}<span
                    class="text-[0.6rem] opacity-80 mt-1 leading-none"
                    >Configure rules</span
                  >
                {:else}<span class="text-[0.6rem] opacity-60 mt-1 leading-none"
                    >Pending scan</span
                  >{/if}
              </div>
            </div>
          </a>
        </nav>
      </div>
    {/if}
  </div>

  <!-- ── Chat: full remaining height ──────────────────────────── -->
  <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
    <Chat />
  </div>
</div>
