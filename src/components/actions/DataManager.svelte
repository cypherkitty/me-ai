<script>
  import { query, exec, getDb } from "../../lib/store/db.js";
  import { clearGmailData } from "../../lib/store/gmail-sync.js";
  import { clearClassifications, clearClassificationsByAction } from "../../lib/triage.js";
  import { cn } from "$lib/utils.js";
  import { Database, ChevronDown } from "lucide-svelte";

  let { onrefresh, groupOrder = [] } = $props();

  let showPanel = $state(false);
  let confirm = $state(null);
  let busy = $state(false);
  let storageSummary = $state(null);

  async function loadSummary() {
    const [[emailRow], [classRow], [contactRow]] = await Promise.all([
      query(`SELECT COUNT(*) AS cnt FROM items WHERE sourceType = 'gmail'`),
      query(`SELECT COUNT(*) AS cnt FROM emailClassifications`),
      query(`SELECT COUNT(*) AS cnt FROM contacts`),
    ]);
    const emailCount   = Number(emailRow?.cnt   ?? 0);
    const classCount   = Number(classRow?.cnt   ?? 0);
    const contactCount = Number(contactRow?.cnt ?? 0);

    let totalBytes = 0;
    try {
      const est = await navigator.storage?.estimate();
      totalBytes = est?.usage ?? 0;
    } catch {}

    storageSummary = { emailCount, classCount, contactCount, totalBytes };
  }

  function fmtBytes(b) {
    if (!b) return "—";
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  }

  function toggle() {
    showPanel = !showPanel;
    if (showPanel) loadSummary();
  }

  async function execAction(fn) {
    busy = true;
    confirm = null;
    try {
      await fn();
      await loadSummary();
      onrefresh?.();
    } finally {
      busy = false;
    }
  }

  async function clearClassificationsAction() {
    await execAction(() => clearClassifications());
  }

  async function clearGroupAction(action) {
    await execAction(() => clearClassificationsByAction(action));
  }

  async function clearEmailsAction() {
    await execAction(async () => {
      await clearGmailData();
      await clearClassifications();
    });
  }

  async function clearContactsAction() {
    await execAction(() => exec(`DELETE FROM contacts`));
  }

  async function nukeEverything() {
    await execAction(async () => {
      await Promise.all([
        exec(`DELETE FROM items`),
        exec(`DELETE FROM emailClassifications`),
        exec(`DELETE FROM contacts`),
        exec(`DELETE FROM syncState`),
        exec(`DELETE FROM settings`),
        exec(`DELETE FROM auditLog`),
      ]);
      window.location.reload();
    });
  }

  function formatLabel(str) {
    return str
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  }
</script>

<div class="mt-3">
  <!-- Toggle -->
  <button
    onclick={toggle}
    class="flex items-center gap-2 w-full px-3.5 py-2 rounded border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
  >
    <Database class="size-3.5 shrink-0" />
    <span class="flex-1 text-left tracking-tight">Data Management</span>
    <ChevronDown class={cn("size-3 text-muted-foreground/40 transition-transform", showPanel && "rotate-180")} />
  </button>

  {#if showPanel}
    <div class="mt-1 rounded border border-border bg-card px-3.5 py-3 flex flex-col gap-3 relative">

      <!-- Storage summary -->
      {#if storageSummary}
        <div class="flex flex-wrap items-center gap-1.5 text-[0.65rem] text-muted-foreground/50 pb-2.5 border-b border-border/40">
          <span class="tabular-nums">{storageSummary.emailCount} emails</span>
          <span class="text-muted-foreground/20">·</span>
          <span class="tabular-nums">{storageSummary.classCount} classifications</span>
          <span class="text-muted-foreground/20">·</span>
          <span class="tabular-nums">{storageSummary.contactCount} contacts</span>
          {#if storageSummary.totalBytes}
            <span class="text-muted-foreground/20">·</span>
            <span>{fmtBytes(storageSummary.totalBytes)} used</span>
          {/if}
        </div>
      {/if}

      <!-- Per-group clear -->
      {#if groupOrder.length > 0}
        <div class="flex flex-col gap-1.5">
          <span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40">Clear by group</span>
          <div class="flex flex-wrap gap-1">
            {#each groupOrder as action}
              {#if confirm === `group:${action}`}
                <span class="inline-flex items-center gap-1.5 text-[0.65rem] text-muted-foreground/60">
                  Delete {formatLabel(action)}?
                  <button onclick={() => confirm = null} class="hover:text-foreground underline transition-colors">No</button>
                  <button onclick={() => clearGroupAction(action)} disabled={busy} class="text-destructive hover:text-destructive/80 underline disabled:opacity-40 transition-colors">Yes</button>
                </span>
              {:else}
                <button
                  onclick={() => confirm = `group:${action}`}
                  disabled={busy}
                  class="text-[0.65rem] px-1.5 py-0.5 rounded border border-border/40 text-muted-foreground/50 bg-muted/20 hover:text-destructive hover:border-destructive/30 disabled:opacity-40 transition-colors"
                >
                  {formatLabel(action)} ✕
                </button>
              {/if}
            {/each}
          </div>
        </div>
      {/if}

      <!-- Bulk actions -->
      <div class="flex flex-col gap-0.5">
        <span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40 mb-1">Bulk actions</span>

        {#each [
          { key: "classifications", label: "Clear all classifications", desc: "Remove all LLM scan results. Emails stay.", action: clearClassificationsAction },
          { key: "emails", label: "Clear emails & classifications", desc: "Remove all synced Gmail data and scan results.", action: clearEmailsAction },
          { key: "contacts", label: "Clear contacts", desc: "Remove extracted contacts from the database.", action: clearContactsAction },
        ] as item}
          {#if confirm === item.key}
            <div class="flex items-center flex-wrap gap-1.5 px-2 py-2 rounded border border-destructive/15 bg-destructive/5 text-[0.65rem] text-muted-foreground/60">
              <span>Delete {item.label.toLowerCase()}?</span>
              <button onclick={() => confirm = null} class="hover:text-foreground underline transition-colors">Cancel</button>
              <button onclick={item.action} disabled={busy} class="text-destructive hover:text-destructive/80 underline disabled:opacity-40 transition-colors">Delete</button>
            </div>
          {:else}
            <button
              onclick={() => confirm = item.key}
              disabled={busy}
              class="flex flex-col items-start gap-px px-2 py-1.5 rounded border border-transparent hover:bg-muted/20 hover:border-border/40 disabled:opacity-40 transition-colors w-full text-left"
            >
              <span class="text-xs text-foreground/70">{item.label}</span>
              <span class="text-[0.6rem] text-muted-foreground/40">{item.desc}</span>
            </button>
          {/if}
        {/each}
      </div>

      <!-- Nuclear option -->
      <div class="pt-2.5 border-t border-border/40">
        {#if confirm === "nuke"}
          <div class="flex items-center flex-wrap gap-1.5 px-2 py-2 rounded border border-destructive/30 bg-destructive/8 text-[0.65rem] text-muted-foreground/60">
            <span>This will delete the entire database and reload. Are you sure?</span>
            <button onclick={() => confirm = null} class="hover:text-foreground underline transition-colors">Cancel</button>
            <button onclick={nukeEverything} disabled={busy} class="text-destructive hover:text-destructive/80 underline font-semibold disabled:opacity-40 transition-colors">Wipe Everything</button>
          </div>
        {:else}
          <button
            onclick={() => confirm = "nuke"}
            disabled={busy}
            class="flex flex-col items-start gap-px px-2 py-1.5 rounded border border-transparent hover:bg-destructive/5 hover:border-destructive/20 disabled:opacity-40 transition-colors w-full text-left"
          >
            <span class="text-xs text-destructive/70">Wipe entire local storage</span>
            <span class="text-[0.6rem] text-muted-foreground/40">Delete the IndexedDB database and reload. All data will be lost.</span>
          </button>
        {/if}
      </div>

      {#if busy}
        <div class="absolute inset-0 rounded bg-card/70 flex items-center justify-center backdrop-blur-sm">
          <span class="text-xs text-muted-foreground">Working…</span>
        </div>
      {/if}
    </div>
  {/if}
</div>
