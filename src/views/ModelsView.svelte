<script lang="ts">
  import { onMount } from "svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Button }     from "$lib/components/ui/button/index.js";
  import { Badge }      from "$lib/components/ui/badge/index.js";
  import { RefreshCw, Trash2, HardDrive, Cpu, AlertTriangle, CheckCircle2 } from "lucide-svelte";
  import { cn }         from "$lib/utils.js";
  import { MODELS }     from "../lib/models.js";

  const CACHE_NAME = "transformers-cache";
  const HF_PREFIX  = "https://huggingface.co/";

  interface CachedModel {
    id: string;
    /** friendly name from MODELS list, or null if unknown */
    name: string | null;
    /** declared size string from MODELS list */
    declaredSize: string | null;
    files: { url: string; bytes: number }[];
    totalBytes: number;
    /** model is in MODELS list */
    isKnown: boolean;
  }

  let models    = $state<CachedModel[]>([]);
  let knownNotDownloaded = $state<typeof MODELS>([]);
  let loading   = $state(true);
  let deleting  = $state<string | null>(null);
  let confirmId = $state<string | null>(null);
  let cacheSupported = $state(true);

  function fmtBytes(n: number): string {
    if (n === 0) return "—";
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
    return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  /** Extract "org/repo" from a HuggingFace URL */
  function modelIdFromUrl(url: string): string | null {
    if (!url.startsWith(HF_PREFIX)) return null;
    const path = url.slice(HF_PREFIX.length);
    const resolveIdx = path.indexOf("/resolve/");
    if (resolveIdx === -1) return null;
    return path.slice(0, resolveIdx);
  }

  async function load() {
    loading = true;
    try {
      if (!("caches" in window)) { cacheSupported = false; return; }

      const cache = await caches.open(CACHE_NAME);
      const requests = await cache.keys();

      // Group entries by model ID
      const byModel = new Map<string, { url: string; bytes: number }[]>();
      for (const req of requests) {
        const id = modelIdFromUrl(req.url);
        if (!id) continue;
        if (!byModel.has(id)) byModel.set(id, []);

        // Use blob().size for accurate byte count regardless of Content-Length header
        let bytes = 0;
        try {
          const resp = await cache.match(req);
          if (resp) {
            const blob = await resp.blob();
            bytes = blob.size;
          }
        } catch { /* ignore */ }
        byModel.get(id)!.push({ url: req.url, bytes });
      }

      // Build model rows
      const cachedIds = new Set(byModel.keys());
      const rows: CachedModel[] = [];
      for (const [id, files] of byModel) {
        const meta = MODELS.find((m) => m.id === id);
        rows.push({
          id,
          name: meta?.name ?? null,
          declaredSize: meta?.size ?? null,
          files,
          totalBytes: files.reduce((s, f) => s + f.bytes, 0),
          isKnown: !!meta,
        });
      }
      // Sort: known first, then by name/id
      rows.sort((a, b) => {
        if (a.isKnown !== b.isKnown) return a.isKnown ? -1 : 1;
        return (a.name ?? a.id).localeCompare(b.name ?? b.id);
      });
      models = rows;
      knownNotDownloaded = MODELS.filter((m) => !cachedIds.has(m.id));
    } finally {
      loading = false;
    }
  }

  async function deleteModel(id: string) {
    deleting = id;
    confirmId = null;
    try {
      const cache = await caches.open(CACHE_NAME);
      const requests = await cache.keys();
      await Promise.all(
        requests
          .filter((r) => modelIdFromUrl(r.url) === id)
          .map((r) => cache.delete(r))
      );
      await load();
    } finally {
      deleting = null;
    }
  }

  onMount(load);
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Header -->
  <div class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border">
    <div>
      <div class="flex items-center gap-2 mb-0.5">
        <h1 class="text-sm font-semibold tracking-tight text-foreground">Local Models</h1>
        <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ cache</span>
      </div>
      <p class="text-xs text-muted-foreground">
        ONNX model weights cached in the browser via Transformers.js (<code class="font-mono text-[0.65rem]">transformers-cache</code>).
      </p>
    </div>
    <Button variant="ghost" size="icon-sm" onclick={load} title="Refresh"
      class={cn(loading && "[&_svg]:animate-spin")}>
      <RefreshCw class="size-3.5" />
    </Button>
  </div>

  <ScrollArea class="flex-1 min-h-0 px-8 py-6">
    {#if loading}
      <div class="flex items-center justify-center py-16 text-muted-foreground gap-3">
        <div class="size-4 rounded-full border-2 border-border border-t-primary animate-spin"></div>
        <span class="text-xs">Scanning cache…</span>
      </div>

    {:else if !cacheSupported}
      <div class="flex items-center gap-2 text-amber-500/70 text-xs py-8">
        <AlertTriangle class="size-4 shrink-0" />
        Cache API is not available in this browser.
      </div>

    {:else}
      <div class="flex flex-col gap-8 max-w-2xl">

        <!-- Downloaded models -->
        <section class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <h2 class="text-xs font-semibold tracking-tight text-foreground">Downloaded</h2>
            {#if models.length > 0}
              <span class="text-[0.6rem] text-muted-foreground/40 bg-muted/30 px-1.5 py-0.5 rounded font-mono">
                {models.length} model{models.length !== 1 ? "s" : ""} · {fmtBytes(models.reduce((s, m) => s + m.totalBytes, 0))} total
              </span>
            {/if}
          </div>

          {#if models.length === 0}
            <p class="text-xs text-muted-foreground/50 py-4">No models cached yet.</p>
          {:else}
            <div class="flex flex-col gap-2">
              {#each models as m (m.id)}
                {@const isDeleting = deleting === m.id}
                {@const isConfirming = confirmId === m.id}

                <div class={cn(
                  "rounded border transition-colors",
                  isConfirming ? "border-destructive/30 bg-destructive/5" : "border-border/50 bg-card"
                )}>
                  <div class="flex items-start gap-3 px-4 py-3">
                    <!-- Icon -->
                    <div class="shrink-0 mt-0.5">
                      <Cpu class="size-3.5 text-muted-foreground/40" />
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-xs font-medium text-foreground">
                          {m.name ?? m.id.split("/").pop()}
                        </span>
                        {#if !m.isKnown}
                          <Badge variant="outline" class="text-[0.6rem] px-1.5 py-0 text-amber-500/70 border-amber-500/30">
                            legacy
                          </Badge>
                        {/if}
                      </div>
                      <p class="text-[0.65rem] font-mono text-muted-foreground/40 mt-0.5 truncate">{m.id}</p>
                      <div class="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span class="text-[0.65rem] text-muted-foreground/50 flex items-center gap-1">
                          <HardDrive class="size-3" />
                          {fmtBytes(m.totalBytes)}
                          {#if m.declaredSize && m.declaredSize !== fmtBytes(m.totalBytes)}
                            <span class="text-muted-foreground/30">(declared {m.declaredSize})</span>
                          {/if}
                        </span>
                        <span class="text-[0.65rem] text-muted-foreground/40">
                          {m.files.length} file{m.files.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="shrink-0 flex items-center gap-1">
                      {#if isConfirming}
                        <span class="text-[0.7rem] text-muted-foreground/60 mr-1">Delete?</span>
                        <button
                          onclick={() => (confirmId = null)}
                          class="text-[0.7rem] text-muted-foreground/60 hover:text-foreground underline transition-colors">
                          Cancel
                        </button>
                        <button
                          onclick={() => deleteModel(m.id)}
                          disabled={isDeleting}
                          class="text-[0.7rem] text-destructive hover:text-destructive/80 underline font-medium ml-2 disabled:opacity-40 transition-colors">
                          Delete
                        </button>
                      {:else}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={isDeleting || deleting !== null}
                          onclick={() => (confirmId = m.id)}
                          title="Remove from cache"
                          class="text-muted-foreground/40 hover:text-destructive">
                          {#if isDeleting}
                            <div class="size-3 rounded-full border border-border border-t-foreground animate-spin"></div>
                          {:else}
                            <Trash2 class="size-3.5" />
                          {/if}
                        </Button>
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </section>

        <!-- Not yet downloaded -->
        {#if knownNotDownloaded.length > 0}
          <section class="flex flex-col gap-3">
            <h2 class="text-xs font-semibold tracking-tight text-muted-foreground/50">Available but not downloaded</h2>
            <div class="flex flex-col gap-1">
              {#each knownNotDownloaded as m (m.id)}
                <div class="flex items-center gap-3 px-4 py-2.5 rounded border border-border/30 bg-muted/5 opacity-60">
                  <Cpu class="size-3.5 text-muted-foreground/30 shrink-0" />
                  <div class="flex-1 min-w-0">
                    <span class="text-xs text-muted-foreground/60">{m.name}</span>
                    <span class="text-[0.65rem] text-muted-foreground/30 ml-2">{m.size}</span>
                  </div>
                  <span class="text-[0.6rem] text-muted-foreground/30 font-mono truncate max-w-[140px]">{m.id.split("/").pop()}</span>
                </div>
              {/each}
            </div>
          </section>
        {/if}

        <!-- Summary footer -->
        {#if models.length > 0}
          <div class="flex items-start gap-2 px-3 py-2.5 rounded border border-border/20 bg-muted/10 text-[0.65rem] text-muted-foreground/40">
            <CheckCircle2 class="size-3.5 shrink-0 mt-0.5 text-muted-foreground/30" />
            <span>
              Models are stored in the browser's <code class="font-mono">Cache API</code> (not OPFS).
              Deleting a model here only removes the cached weights — you can re-download it by loading it in the Chat view.
            </span>
          </div>
        {/if}

      </div>
    {/if}
  </ScrollArea>
</div>
