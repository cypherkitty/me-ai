<script lang="ts">
  import { onMount } from "svelte";
  import {
    getDirectories,
    addDirectory,
    removeDirectory,
  } from "$lib/plugins/filesystem-store.js";
  import type { DirectoryEntry } from "$lib/plugins/filesystem-store.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { FolderOpen, Trash2, Plus } from "lucide-svelte";

  let directories = $state<DirectoryEntry[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  const apiSupported =
    typeof window !== "undefined" && "showDirectoryPicker" in window;

  async function load() {
    loading = true;
    error = null;
    try {
      directories = await getDirectories();
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
    loading = false;
  }

  onMount(load);

  async function addDir() {
    if (!apiSupported) return;
    error = null;
    try {
      const handle = await (window as unknown as { showDirectoryPicker: (opts: { mode: string }) => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker({ mode: "readwrite" });
      const entry = await addDirectory(handle.name, handle);
      directories = [...directories, entry];
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      error = e instanceof Error ? e.message : String(e);
    }
  }

  async function removeDir(id: string) {
    error = null;
    try {
      await removeDirectory(id);
      directories = directories.filter((d) => d.id !== id);
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }
</script>

{#if !apiSupported}
  <p class="text-sm text-destructive">
    File System Access API is not supported. Use Chrome or Edge.
  </p>
{:else if loading}
  <p class="text-xs text-muted-foreground">Loading…</p>
{:else}
  <div class="flex flex-col gap-3">
    {#if directories.length > 0}
      <div class="flex flex-col gap-1.5">
        {#each directories as dir (dir.id)}
          <div
            class="flex items-center gap-3 rounded-md border border-border bg-muted/30 px-3 py-2"
          >
            <FolderOpen class="size-4 text-muted-foreground shrink-0" />
            <span
              class="flex-1 min-w-0 text-sm font-mono text-foreground truncate"
              title={dir.label}
            >
              {dir.label}
            </span>
            <button
              type="button"
              class="text-muted-foreground hover:text-destructive transition-colors shrink-0"
              onclick={() => removeDir(dir.id)}
              aria-label="Remove {dir.label}"
            >
              <Trash2 class="size-3.5" />
            </button>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-xs text-muted-foreground">No directories configured.</p>
    {/if}

    <Button variant="outline" size="sm" onclick={addDir} class="w-fit gap-1.5">
      <Plus class="size-3.5" />
      Add directory
    </Button>

    {#if error}
      <p class="text-xs text-destructive">{error}</p>
    {/if}
  </div>
{/if}
