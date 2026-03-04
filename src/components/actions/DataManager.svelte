<script lang="ts">
  import { onMount } from "svelte";
  import {
    query,
    exec,
    getOpfsStats,
    clearAllDuckDbData,
    deleteOpfsFileAndReload,
    nukeAllLocalData,
  } from "../../lib/store/db.js";
  import { clearGmailData } from "../../lib/store/gmail-sync.js";
  import {
    clearClassifications,
    clearClassificationsByAction,
    getClassificationsGrouped,
  } from "../../lib/triage.js";
  import { clearAllEvents } from "../../lib/rules.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { RefreshCw } from "lucide-svelte";
  import { cn } from "$lib/utils.js";

  interface OpfsStats {
    supported: boolean;
    fileBytes: number;
    tables: Record<string, number>;
  }
  interface IdbSummary {
    emailCount: number;
    classCount: number;
    contactCount: number;
    idbBytes: number;
  }

  let confirm = $state<string | null>(null);
  let busy = $state(false);
  let loading = $state(true);
  let groupOrder = $state<string[]>([]);
  let opfs = $state<OpfsStats | null>(null);
  let idb = $state<IdbSummary | null>(null);

  async function load() {
    loading = true;
    try {
      const [[emailRow], [classRow], [contactRow]] = await Promise.all([
        query(`SELECT COUNT(*) AS cnt FROM items WHERE sourceType = 'gmail'`),
        query(`SELECT COUNT(*) AS cnt FROM emailClassifications`),
        query(`SELECT COUNT(*) AS cnt FROM contacts`),
      ]);
      let idbBytes = 0;
      try {
        idbBytes = (await navigator.storage?.estimate())?.usage ?? 0;
      } catch {}
      idb = {
        emailCount: Number((emailRow as any)?.cnt ?? 0),
        classCount: Number((classRow as any)?.cnt ?? 0),
        contactCount: Number((contactRow as any)?.cnt ?? 0),
        idbBytes,
      };

      opfs = (await getOpfsStats()) as OpfsStats;

      const result = (await getClassificationsGrouped()) as {
        groups: unknown;
        order: string[];
      };
      groupOrder = result.order;
    } finally {
      loading = false;
    }
  }

  onMount(load);

  function fmt(n: number): string {
    if (!n) return "—";
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function run(fn: () => Promise<void>) {
    busy = true;
    confirm = null;
    try {
      await fn();
      await load();
    } finally {
      busy = false;
    }
  }

  function label(str: string): string {
    return str
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  }
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Header -->
  <div
    class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border"
  >
    <div>
      <div class="flex items-center gap-2 mb-0.5">
        <h1 class="text-sm font-semibold tracking-tight text-foreground">
          Data Management
        </h1>
        <span
          class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50"
          >/ storage</span
        >
      </div>
      <p class="text-xs text-muted-foreground">
        Manage local storage — emails, classifications, pipelines, audit trail.
      </p>
    </div>
    <Button
      variant="ghost"
      size="icon-sm"
      onclick={load}
      title="Refresh"
      class={cn(loading && "[&_svg]:animate-spin")}
    >
      <RefreshCw class="size-3.5" />
    </Button>
  </div>

  <ScrollArea class="flex-1 min-h-0 px-8 py-6">
    {#if loading}
      <div
        class="flex items-center justify-center py-16 text-muted-foreground gap-3"
      >
        <div
          class="size-4 rounded-full border-2 border-border border-t-primary animate-spin"
        ></div>
        <span class="text-xs">Loading…</span>
      </div>
    {:else}
      <div class="flex flex-col gap-8 max-w-2xl relative">
        <!-- ── OPFS / DuckDB ─────────────────────────────────────────── -->
        <section class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <h2 class="text-xs font-semibold tracking-tight text-foreground">
              DuckDB · OPFS
            </h2>
            <span
              class="text-[0.6rem] font-mono text-muted-foreground/40 bg-muted/30 px-1.5 py-0.5 rounded"
              >opfs://me-ai.db</span
            >
            {#if opfs && !opfs.supported}
              <span
                class="text-[0.6rem] text-amber-500/70 bg-amber-500/10 px-1.5 py-0.5 rounded"
                >in-memory fallback</span
              >
            {/if}
          </div>

          {#if opfs}
            <!-- File + key table counts -->
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <div
                class="flex flex-col items-center px-3 py-2.5 rounded border bg-card border-border/50"
              >
                <span class="text-sm font-bold tabular-nums text-foreground"
                  >{fmt(opfs.fileBytes)}</span
                >
                <span
                  class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/50 mt-0.5"
                  >File size</span
                >
              </div>
              {#each [{ key: "sm_rules", label: "Rules" }, { key: "sm_events", label: "Events" }, { key: "items", label: "Emails" }] as t}
                <div
                  class="flex flex-col items-center px-3 py-2.5 rounded border bg-card border-border/50"
                >
                  <span class="text-sm font-bold tabular-nums text-foreground"
                    >{opfs.tables[t.key] ?? 0}</span
                  >
                  <span
                    class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/50 mt-0.5"
                    >{t.label}</span
                  >
                </div>
              {/each}
            </div>

            <!-- DuckDB actions -->
            <div class="flex flex-col gap-1">
              {#each [{ key: "clear-events", label: "Clear audit trail", desc: "Delete all sm_events records (pipeline execution log).", action: () => run( () => clearAllEvents(), ) }, { key: "clear-duckdb", label: "Clear all DuckDB data", desc: "Reset pipelines, rules, events, emails and classifications from DuckDB.", action: () => run( () => clearAllDuckDbData(), ) }] as item}
                {#if confirm === item.key}
                  <div
                    class="flex items-center flex-wrap gap-2 px-3 py-2.5 rounded border border-destructive/20 bg-destructive/5 text-[0.7rem] text-muted-foreground/60"
                  >
                    <span>Delete {item.label.toLowerCase()}?</span>
                    <button
                      onclick={() => (confirm = null)}
                      class="hover:text-foreground underline transition-colors"
                      >Cancel</button
                    >
                    <button
                      onclick={item.action}
                      disabled={busy}
                      class="text-destructive hover:text-destructive/80 underline font-medium disabled:opacity-40 transition-colors"
                      >Delete</button
                    >
                  </div>
                {:else}
                  <button
                    onclick={() => (confirm = item.key)}
                    disabled={busy}
                    class="flex flex-col items-start gap-0.5 px-3 py-2 rounded border border-transparent hover:bg-muted/20 hover:border-border/40 disabled:opacity-40 transition-colors w-full text-left"
                  >
                    <span class="text-xs text-foreground/80 font-medium"
                      >{item.label}</span
                    >
                    <span class="text-[0.65rem] text-muted-foreground/40"
                      >{item.desc}</span
                    >
                  </button>
                {/if}
              {/each}

              <!-- Delete OPFS file -->
              {#if opfs.supported}
                {#if confirm === "delete-opfs"}
                  <div
                    class="flex items-center flex-wrap gap-2 px-3 py-2.5 rounded border border-destructive/30 bg-destructive/8 text-[0.7rem] text-muted-foreground/60"
                  >
                    <span
                      >Delete the <code class="font-mono text-destructive/80"
                        >me-ai.db</code
                      > OPFS file and reload? All DuckDB data will be lost.</span
                    >
                    <button
                      onclick={() => (confirm = null)}
                      class="hover:text-foreground underline transition-colors"
                      >Cancel</button
                    >
                    <button
                      onclick={() => run(() => deleteOpfsFileAndReload())}
                      disabled={busy}
                      class="text-destructive hover:text-destructive/80 underline font-semibold disabled:opacity-40 transition-colors"
                      >Delete file</button
                    >
                  </div>
                {:else}
                  <button
                    onclick={() => (confirm = "delete-opfs")}
                    disabled={busy}
                    class="flex flex-col items-start gap-0.5 px-3 py-2 rounded border border-transparent hover:bg-destructive/5 hover:border-destructive/20 disabled:opacity-40 transition-colors w-full text-left"
                  >
                    <span class="text-xs text-destructive/70 font-medium"
                      >Delete OPFS file</span
                    >
                    <span class="text-[0.65rem] text-muted-foreground/40"
                      >Remove <code class="font-mono">me-ai.db</code> from the browser's
                      Origin Private File System and reload.</span
                    >
                  </button>
                {/if}
              {/if}
            </div>
          {/if}
        </section>

        <div class="border-t border-border/40"></div>

        <!-- ── IndexedDB ─────────────────────────────────────────────── -->
        <section class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <h2 class="text-xs font-semibold tracking-tight text-foreground">
              IndexedDB
            </h2>
            <span
              class="text-[0.6rem] text-muted-foreground/40 bg-muted/30 px-1.5 py-0.5 rounded font-mono"
              >emails · classifications · contacts</span
            >
          </div>

          {#if idb}
            <div class="grid grid-cols-3 gap-2">
              {#each [{ label: "Emails", val: idb.emailCount }, { label: "Classifications", val: idb.classCount }, { label: "Contacts", val: idb.contactCount }] as stat}
                <div
                  class="flex flex-col items-center px-3 py-2.5 rounded border bg-card border-border/50"
                >
                  <span class="text-sm font-bold tabular-nums text-foreground"
                    >{stat.val}</span
                  >
                  <span
                    class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/50 mt-0.5 text-center"
                    >{stat.label}</span
                  >
                </div>
              {/each}
            </div>
            {#if idb.idbBytes > 0}
              <p class="text-[0.65rem] text-muted-foreground/40">
                Origin storage (IndexedDB + OPFS + browser caches): <span
                  class="font-mono">{fmt(idb.idbBytes)}</span
                >
              </p>
            {/if}
          {/if}

          <!-- Per-group clear -->
          {#if groupOrder.length > 0}
            <div class="flex flex-col gap-2">
              <span
                class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40"
                >Clear by group</span
              >
              <div class="flex flex-wrap gap-1.5">
                {#each groupOrder as action}
                  {#if confirm === `group:${action}`}
                    <span
                      class="inline-flex items-center gap-2 text-[0.7rem] text-muted-foreground/60 px-2 py-1 rounded border border-destructive/20 bg-destructive/5"
                    >
                      Delete {label(action)}?
                      <button
                        onclick={() => (confirm = null)}
                        class="hover:text-foreground underline transition-colors"
                        >No</button
                      >
                      <button
                        onclick={() =>
                          run(() => clearClassificationsByAction(action))}
                        disabled={busy}
                        class="text-destructive hover:text-destructive/80 underline disabled:opacity-40 transition-colors"
                        >Yes</button
                      >
                    </span>
                  {:else}
                    <button
                      onclick={() => (confirm = `group:${action}`)}
                      disabled={busy}
                      class="text-[0.7rem] px-2 py-1 rounded border border-border/40 text-muted-foreground/60 bg-muted/20 hover:text-destructive hover:border-destructive/30 disabled:opacity-40 transition-colors"
                    >
                      {label(action)} ✕
                    </button>
                  {/if}
                {/each}
              </div>
            </div>
          {/if}

          <!-- Bulk actions -->
          <div class="flex flex-col gap-1">
            {#each [{ key: "classifications", label: "Clear all classifications", desc: "Remove all LLM scan results. Emails stay.", action: () => run( () => clearClassifications(), ) }, { key: "emails", label: "Clear emails & classifications", desc: "Remove all synced Gmail data and scan results.", action: () => run( async () => {
                        await clearGmailData();
                        await clearClassifications();
                      }, ) }, { key: "contacts", label: "Clear contacts", desc: "Remove extracted contacts from the database.", action: () => run( () => exec(`DELETE FROM contacts`), ) }] as item}
              {#if confirm === item.key}
                <div
                  class="flex items-center flex-wrap gap-2 px-3 py-2.5 rounded border border-destructive/20 bg-destructive/5 text-[0.7rem] text-muted-foreground/60"
                >
                  <span>Delete {item.label.toLowerCase()}?</span>
                  <button
                    onclick={() => (confirm = null)}
                    class="hover:text-foreground underline transition-colors"
                    >Cancel</button
                  >
                  <button
                    onclick={item.action}
                    disabled={busy}
                    class="text-destructive hover:text-destructive/80 underline font-medium disabled:opacity-40 transition-colors"
                    >Delete</button
                  >
                </div>
              {:else}
                <button
                  onclick={() => (confirm = item.key)}
                  disabled={busy}
                  class="flex flex-col items-start gap-0.5 px-3 py-2 rounded border border-transparent hover:bg-muted/20 hover:border-border/40 disabled:opacity-40 transition-colors w-full text-left"
                >
                  <span class="text-xs text-foreground/80 font-medium"
                    >{item.label}</span
                  >
                  <span class="text-[0.65rem] text-muted-foreground/40"
                    >{item.desc}</span
                  >
                </button>
              {/if}
            {/each}
          </div>
        </section>

        <div class="border-t border-border/40"></div>

        <!-- ── Danger zone ────────────────────────────────────────────── -->
        <section class="flex flex-col gap-3">
          <h2
            class="text-xs font-semibold tracking-tight text-muted-foreground/60 uppercase tracking-wider"
          >
            Danger zone
          </h2>

          <!-- Wipe everything -->
          {#if confirm === "nuke-all"}
            <div
              class="flex items-start flex-wrap gap-2 px-3 py-2.5 rounded border border-destructive/40 bg-destructive/8 text-[0.7rem] text-muted-foreground/60"
            >
              <span class="flex-1">
                <strong class="text-destructive/80 font-semibold"
                  >This cannot be undone.</strong
                >
                Deletes OPFS files (DuckDB), all IndexedDB databases, all cached
                model weights (Cache API), and localStorage. The page will reload
                fresh.
              </span>
              <div class="flex items-center gap-3 shrink-0">
                <button
                  onclick={() => (confirm = null)}
                  class="hover:text-foreground underline transition-colors"
                  >Cancel</button
                >
                <button
                  onclick={() =>
                    run(async () => {
                      try {
                        await nukeAllLocalData();
                      } catch (e) {
                        console.error(e);
                        alert(
                          "Error wiping data: " +
                            (e instanceof Error ? e.message : String(e)),
                        );
                      }
                    })}
                  disabled={busy}
                  class="text-destructive hover:text-destructive/80 underline font-semibold disabled:opacity-40 transition-colors"
                  >Wipe everything</button
                >
              </div>
            </div>
          {:else}
            <button
              onclick={() => (confirm = "nuke-all")}
              disabled={busy}
              class="flex flex-col items-start gap-0.5 px-3 py-2 rounded border border-destructive/20 hover:bg-destructive/8 hover:border-destructive/40 disabled:opacity-40 transition-colors w-full text-left"
            >
              <span class="text-xs text-destructive/80 font-semibold"
                >Wipe everything</span
              >
              <span class="text-[0.65rem] text-muted-foreground/40"
                >OPFS · IndexedDB · model cache · localStorage — full reset.</span
              >
            </button>
          {/if}

          <!-- Wipe IndexedDB only -->
          {#if confirm === "nuke"}
            <div
              class="flex items-center flex-wrap gap-2 px-3 py-2.5 rounded border border-destructive/30 bg-destructive/8 text-[0.7rem] text-muted-foreground/60"
            >
              <span
                >This will wipe all IndexedDB tables and reload. DuckDB/OPFS
                data is kept.</span
              >
              <button
                onclick={() => (confirm = null)}
                class="hover:text-foreground underline transition-colors"
                >Cancel</button
              >
              <button
                onclick={() =>
                  run(async () => {
                    await Promise.all([
                      exec(`DELETE FROM items`),
                      exec(`DELETE FROM emailClassifications`),
                      exec(`DELETE FROM contacts`),
                      exec(`DELETE FROM syncState`),
                      exec(`DELETE FROM settings`),
                      exec(`DELETE FROM auditLog`),
                    ]);
                    window.location.reload();
                  })}
                disabled={busy}
                class="text-destructive hover:text-destructive/80 underline font-semibold disabled:opacity-40 transition-colors"
                >Wipe IndexedDB</button
              >
            </div>
          {:else}
            <button
              onclick={() => (confirm = "nuke")}
              disabled={busy}
              class="flex flex-col items-start gap-0.5 px-3 py-2 rounded border border-transparent hover:bg-destructive/5 hover:border-destructive/20 disabled:opacity-40 transition-colors w-full text-left"
            >
              <span class="text-xs text-destructive/70 font-medium"
                >Wipe IndexedDB only</span
              >
              <span class="text-[0.65rem] text-muted-foreground/40"
                >Delete all IndexedDB tables and reload. Emails,
                classifications, contacts and settings will be lost.</span
              >
            </button>
          {/if}
        </section>

        <!-- Busy overlay -->
        {#if busy}
          <div
            class="absolute inset-0 rounded bg-background/60 flex items-center justify-center backdrop-blur-sm z-10"
          >
            <span class="text-xs text-muted-foreground">Working…</span>
          </div>
        {/if}
      </div>
    {/if}
  </ScrollArea>
</div>
