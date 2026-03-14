<script lang="ts">
  import { onMount } from "svelte";
  import { getDirectoryHandle, setDirectoryHandle, clearDirectoryHandle } from "$lib/plugins/filesystem-store.js";

  let dirName = $state<string | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);
  const apiSupported = typeof window !== "undefined" && "showDirectoryPicker" in window;

  async function load() {
    loading = true;
    error = null;
    try {
      const handle = await getDirectoryHandle();
      dirName = handle?.name ?? null;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
    loading = false;
  }

  onMount(load);

  async function chooseDirectory() {
    if (!apiSupported) return;
    error = null;
    try {
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      await setDirectoryHandle(handle);
      dirName = handle.name;
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      error = e instanceof Error ? e.message : String(e);
    }
  }

  async function clearDirectory() {
    error = null;
    try {
      await clearDirectoryHandle();
      dirName = null;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }
</script>

<div class="fs-settings">
  <span class="fs-label">Root directory</span>
  {#if !apiSupported}
    <p class="fs-unsupported">
      File System Access API is not supported. Use Chrome or Edge.
    </p>
  {:else if loading}
    <span class="fs-status">Loading…</span>
  {:else}
    <div class="fs-row">
      <span class="fs-path" title={dirName ?? "No directory chosen"}>
        {dirName ?? "No directory chosen"}
      </span>
      <div class="fs-buttons">
        <button class="fs-btn" onclick={chooseDirectory} type="button">
          Choose directory
        </button>
        {#if dirName}
          <button class="fs-btn fs-btn-clear" onclick={clearDirectory} type="button">
            Clear
          </button>
        {/if}
      </div>
    </div>
    {#if error}
      <p class="fs-error">{error}</p>
    {/if}
  {/if}
</div>

<style>
  .fs-settings {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.55rem 0.85rem;
    border-top: 1px solid #181818;
    background: rgba(0, 0, 0, 0.2);
  }
  .fs-label {
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #666;
  }
  .fs-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .fs-path {
    font-size: 0.72rem;
    font-family: "Courier New", monospace;
    color: #aaa;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fs-buttons {
    display: flex;
    gap: 0.35rem;
  }
  .fs-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.65rem;
    font-family: inherit;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 4px;
    color: #aaa;
    cursor: pointer;
    transition: all 0.12s;
  }
  .fs-btn:hover {
    background: #222;
    border-color: #444;
    color: #ddd;
  }
  .fs-btn-clear {
    color: #888;
  }
  .fs-btn-clear:hover {
    color: #e55;
    border-color: rgba(229, 85, 85, 0.3);
  }
  .fs-status {
    font-size: 0.7rem;
    color: #666;
  }
  .fs-unsupported {
    font-size: 0.68rem;
    color: #a55;
    margin: 0;
  }
  .fs-error {
    font-size: 0.65rem;
    color: #e55;
    margin: 0;
  }
</style>
