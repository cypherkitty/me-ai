<script lang="ts">
  import { onMount } from "svelte";
  import type { AuditLogEntry } from "$lib/types.js";
  import { getAuditLog, clearAuditLog } from "../lib/store/audit.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { FileText } from "lucide-svelte";

  let entries = $state<AuditLogEntry[]>([]);
  let total = $state(0);
  let loading = $state(false);
  let failuresOnly = $state(false);
  let confirmClear = $state(false);

  onMount(load);

  async function load() {
    loading = true;
    try {
      const result = await getAuditLog({ limit: 100, failuresOnly });
      entries = result.entries;
      total = result.total;
    } finally {
      loading = false;
    }
  }

  async function handleClear() {
    await clearAuditLog();
    entries = [];
    total = 0;
    confirmClear = false;
  }

  function formatTime(ts: number | null | undefined) {
    if (!ts) return "—";
    const d = new Date(ts);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function shortSender(from: string | null | undefined) {
    if (!from) return "—";
    return from.replace(/<.*>/, "").trim().slice(0, 32);
  }
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Header -->
  <div class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border">
    <div>
      <div class="flex items-center gap-2 mb-0.5">
        <FileText class="size-5 text-primary/60" />
        <h2 class="text-xl font-bold tracking-tight text-foreground">Audit Trail</h2>
      </div>
      <p class="text-sm text-muted-foreground/60">Execution history for all pipeline actions.</p>
    </div>
    <div class="flex items-center gap-3">
      <label
        class="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none"
      >
        <input type="checkbox" bind:checked={failuresOnly} onchange={load} class="accent-primary" />
        Failures only
      </label>
      {#if !confirmClear}
        <button
          class="text-xs text-muted-foreground/50 hover:text-destructive transition-colors underline"
          onclick={() => (confirmClear = true)}
        >
          Clear log
        </button>
      {:else}
        <span class="flex items-center gap-1.5">
          <button
            class="text-xs text-destructive hover:text-destructive/80 transition-colors"
            onclick={handleClear}
          >
            Confirm clear
          </button>
          <button
            class="text-xs text-muted-foreground hover:text-foreground transition-colors"
            onclick={() => (confirmClear = false)}
          >
            Cancel
          </button>
        </span>
      {/if}
    </div>
  </div>

  <!-- Content -->
  <ScrollArea class="flex-1 min-h-0">
    {#if loading}
      <div class="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <div class="size-6 border-2 border-border border-t-primary rounded-full animate-spin"></div>
        Loading…
      </div>
    {:else if entries.length === 0}
      <div class="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground/40">
        <FileText class="size-9" />
        <p class="text-sm">No executions recorded yet.</p>
      </div>
    {:else}
      <div class="px-8 py-4">
        <p class="text-xs text-muted-foreground/50 mb-4">
          {total} execution{total !== 1 ? "s" : ""}
        </p>
        <div class="flex flex-col gap-2">
          {#each entries as entry (entry.id)}
            <div
              class="rounded-lg border border-border/50 bg-card/60 px-4 py-3 flex items-start gap-3 text-sm {entry.success
                ? ''
                : 'border-destructive/20'}"
            >
              <span
                class="shrink-0 mt-0.5 text-xs font-bold {entry.success
                  ? 'text-success'
                  : 'text-destructive'}"
              >
                {entry.success ? "✓" : "✕"}
              </span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-mono text-xs text-primary/80 font-semibold uppercase"
                    >{entry.eventType}</span
                  >
                  <span class="text-xs text-muted-foreground/50"
                    >{formatTime(entry.executedAt)}</span
                  >
                </div>
                {#if entry.subject}
                  <p class="text-xs text-muted-foreground truncate mt-0.5">{entry.subject}</p>
                {/if}
                {#if entry.from}
                  <p class="text-xs text-muted-foreground/50 mt-0.5">{shortSender(entry.from)}</p>
                {/if}
                {#if entry.steps && entry.steps.length > 0}
                  <div class="flex flex-wrap gap-1 mt-1.5">
                    {#each entry.steps as step, si (si)}
                      <span
                        class="text-[0.6rem] font-semibold px-1.5 py-0.5 rounded border {step.success
                          ? 'border-success/20 text-success/80'
                          : 'border-destructive/25 text-destructive/80'}"
                      >
                        {step.success ? "✓" : "✕"}
                        {step.actionName ?? step.actionId}
                      </span>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </ScrollArea>
</div>
