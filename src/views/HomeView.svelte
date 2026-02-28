<script lang="ts">
  import { onMount } from "svelte";
  import { getSavedToken, isTokenValid } from "../lib/google-auth.js";
  import { getSetting } from "../lib/store/settings.js";
  import { getEventStats } from "../lib/rules.js";
  import Chat from "../Chat.svelte";
  import { GitBranch, CheckCircle2, Circle, Zap, ChevronRight } from "lucide-svelte";

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

<div class="flex flex-col h-full overflow-hidden">

  <!-- ── Top bar: brand + setup steps ─────────────────────────── -->
  <div class="shrink-0 border-b border-border bg-sidebar">

    <!-- Brand row -->
    <div class="flex items-center justify-between px-4 h-11">
      <div class="flex items-center gap-2">
        <div class="size-6 rounded bg-primary flex items-center justify-center shrink-0">
          <Zap class="size-3.5 text-primary-foreground" />
        </div>
        <span class="text-sm font-semibold tracking-tight text-foreground">me-ai</span>
      </div>

      <!-- Compact status chips (always visible) -->
      {#if !checking}
        <div class="flex items-center gap-1.5">
          <a href="#sources"
             class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.7rem] font-medium
                    transition-colors no-underline
                    {gmailConnected
                      ? 'text-success border-success/25 bg-success/6 hover:bg-success/10'
                      : 'text-muted-foreground border-border hover:text-foreground hover:border-border/80'}">
            {#if gmailConnected}
              <CheckCircle2 class="size-3 shrink-0" />
              <span class="hidden sm:inline truncate max-w-[120px]">{gmailEmail}</span>
            {:else}
              <Circle class="size-3 shrink-0" />
              <span>Connect sources</span>
            {/if}
          </a>

          <ChevronRight class="size-3 text-muted-foreground/30 shrink-0" />

          <a href="#pipelines"
             class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.7rem] font-medium
                    transition-colors no-underline
                    {pipelineCount > 0
                      ? 'text-primary border-primary/25 bg-primary/6 hover:bg-primary/10'
                      : 'text-muted-foreground border-border hover:text-foreground hover:border-border/80'}
                    {!gmailConnected ? 'opacity-40 pointer-events-none' : ''}">
            <GitBranch class="size-3 shrink-0" />
            {#if pipelineCount > 0}
              <span>{pipelineCount} pipeline{pipelineCount === 1 ? '' : 's'}</span>
            {:else}
              <span>Rules &amp; actions</span>
            {/if}
          </a>
        </div>
      {:else}
        <!-- skeleton while checking -->
        <div class="flex items-center gap-1.5">
          <div class="h-6 w-28 rounded-full bg-muted animate-pulse"></div>
          <div class="h-6 w-24 rounded-full bg-muted animate-pulse"></div>
        </div>
      {/if}
    </div>

  </div>

  <!-- ── Chat: full remaining height ──────────────────────────── -->
  <div class="flex-1 overflow-hidden flex flex-col">
    <Chat />
  </div>

</div>
