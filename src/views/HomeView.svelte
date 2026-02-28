<script lang="ts">
  import { onMount } from "svelte";
  import { getSavedToken, isTokenValid } from "../lib/google-auth.js";
  import { getSetting } from "../lib/store/settings.js";
  import { getEventStats } from "../lib/rules.js";
  import Chat from "../Chat.svelte";
  import {
    Mail, GitBranch, ArrowRight, CheckCircle2, Circle,
  } from "lucide-svelte";

  let gmailConnected = $state(false);
  let gmailEmail = $state<string | null>(null);
  let checking = $state(true);
  let pipelineCount = $state(0);

  onMount(async () => {
    try {
      const token = await getSavedToken();
      if (token && isTokenValid()) {
        const profile = await getSetting("gmail-profile") as { emailAddress?: string } | null;
        gmailEmail = profile?.emailAddress ?? "Gmail";
        gmailConnected = true;
      }
    } catch {}

    try {
      const stats = await getEventStats() as { total?: number };
      pipelineCount = stats.total ?? 0;
    } catch {}

    checking = false;
  });
</script>

<div class="flex h-full overflow-hidden">

  <!-- ── Left panel: setup steps ───────────────────────────────── -->
  <div class="w-72 shrink-0 flex flex-col border-r border-border bg-sidebar overflow-y-auto">
    <div class="px-5 pt-8 pb-6">
      <p class="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Get started</p>

      <!-- Step 1: Sources -->
      <a
        href="#sources"
        class="group flex flex-col rounded-lg border bg-card p-4 no-underline mb-3
               transition-all hover:border-primary/40
               {gmailConnected ? 'border-success/30' : 'border-border'}"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/60">Step 1</span>
          {#if !checking}
            {#if gmailConnected}
              <span class="inline-flex items-center gap-1 text-[0.6rem] font-medium text-success">
                <CheckCircle2 class="size-2.5" />Connected
              </span>
            {:else}
              <span class="inline-flex items-center gap-1 text-[0.6rem] font-medium text-warning">
                <Circle class="size-2.5" />Not set up
              </span>
            {/if}
          {/if}
        </div>

        <div class="flex items-center gap-2.5 mb-2">
          <div class="size-8 rounded-md bg-muted flex items-center justify-center shrink-0
                      group-hover:bg-primary/10 transition-colors">
            <Mail class="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p class="text-sm font-semibold text-foreground tracking-tight">Connect Sources</p>
            <p class="text-[0.65rem] text-muted-foreground">Gmail &amp; more</p>
          </div>
        </div>

        <p class="text-[0.7rem] text-muted-foreground leading-relaxed mb-3">
          Connect email accounts so me-ai can monitor and route incoming messages.
        </p>

        {#if gmailConnected && gmailEmail}
          <div class="flex items-center gap-1.5 text-[0.7rem] text-success">
            <span class="size-1.5 rounded-full bg-success shrink-0"></span>
            {gmailEmail}
          </div>
        {:else}
          <div class="flex items-center gap-1 text-[0.7rem] text-primary font-medium">
            Set up now <ArrowRight class="size-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        {/if}
      </a>

      <!-- Step 2: Control Plane -->
      <a
        href="#pipelines"
        class="group flex flex-col rounded-lg border bg-card p-4 no-underline
               transition-all hover:border-primary/40 border-border
               {!gmailConnected && !checking ? 'opacity-50 pointer-events-none' : ''}"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/60">Step 2</span>
          {#if pipelineCount > 0}
            <span class="text-[0.6rem] font-medium text-primary">{pipelineCount} active</span>
          {/if}
        </div>

        <div class="flex items-center gap-2.5 mb-2">
          <div class="size-8 rounded-md bg-muted flex items-center justify-center shrink-0
                      group-hover:bg-primary/10 transition-colors">
            <GitBranch class="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p class="text-sm font-semibold text-foreground tracking-tight">Rules &amp; Actions</p>
            <p class="text-[0.65rem] text-muted-foreground">Control plane</p>
          </div>
        </div>

        <p class="text-[0.7rem] text-muted-foreground leading-relaxed mb-3">
          Define pipelines, classify emails, trigger actions, and review approvals.
        </p>

        <div class="flex items-center gap-1 text-[0.7rem] text-primary font-medium">
          Open dashboard <ArrowRight class="size-3 transition-transform group-hover:translate-x-0.5" />
        </div>
      </a>
    </div>
  </div>

  <!-- ── Right panel: AI Chat ───────────────────────────────────── -->
  <div class="flex-1 overflow-hidden flex flex-col">
    <Chat />
  </div>

</div>
