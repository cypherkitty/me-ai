<script>
  import { onMount } from "svelte";
  import { getEngine } from "./lib/llm-engine.js";
  import { MODELS } from "./lib/models.js";
  import { scanEmails, getActionItems, updateActionStatus, clearActionItems, getActionCounts } from "./lib/triage.js";
  import ActionsView from "./components/actions/ActionsView.svelte";

  const engine = getEngine();

  // ── State ──────────────────────────────────────────────────────────
  let engineStatus = $state(engine.status);
  let modelName = $state("");
  let items = $state([]);
  let counts = $state({ total: 0, todo: 0, calendar: 0, note: 0, new: 0, done: 0, dismissed: 0 });
  let filter = $state("all"); // "all" | "todo" | "calendar" | "note"

  let isScanning = $state(false);
  let scanProgress = $state(null);
  let scanCount = $state(20);
  let error = $state(null);

  // ── Track engine status ────────────────────────────────────────────
  onMount(() => {
    const unsub = engine.onMessage((msg) => {
      if (msg.status === "ready") {
        engineStatus = "ready";
        const model = MODELS.find((m) => m.id === engine.modelId);
        modelName = model?.name || engine.modelId || "";
      }
      if (msg.status === "loading") engineStatus = "loading";
    });

    // Sync current status
    engineStatus = engine.status;
    if (engine.modelId) {
      const model = MODELS.find((m) => m.id === engine.modelId);
      modelName = model?.name || engine.modelId || "";
    }

    loadItems();
    return () => unsub();
  });

  // ── Load items from DB ─────────────────────────────────────────────
  async function loadItems() {
    try {
      const typeFilter = filter === "all" ? undefined : filter;
      items = await getActionItems({ type: typeFilter });
      counts = await getActionCounts();
    } catch (e) {
      error = `Failed to load items: ${e.message}`;
    }
  }

  // ── Scan emails ────────────────────────────────────────────────────
  async function startScan() {
    if (isScanning || !engine.isReady) return;

    error = null;
    isScanning = true;
    scanProgress = null;

    try {
      await scanEmails(engine, {
        count: scanCount,
        onProgress: (progress) => {
          scanProgress = { ...progress };
        },
      });
      await loadItems();
    } catch (e) {
      error = `Scan failed: ${e.message}`;
    } finally {
      isScanning = false;
    }
  }

  // ── Item actions ───────────────────────────────────────────────────
  async function markDone(id) {
    await updateActionStatus(id, "done");
    await loadItems();
  }

  async function dismiss(id) {
    await updateActionStatus(id, "dismissed");
    await loadItems();
  }

  async function clearAll() {
    await clearActionItems();
    await loadItems();
  }

  function setFilter(newFilter) {
    filter = newFilter;
    loadItems();
  }
</script>

<div class="actions-page">
  <ActionsView
    {engineStatus}
    {modelName}
    {items}
    {counts}
    {filter}
    {isScanning}
    {scanProgress}
    {error}
    onscan={startScan}
    onsetfilter={setFilter}
    onmarkdone={markDone}
    ondismiss={dismiss}
    onclear={clearAll}
    ondismisserror={() => error = null}
    bind:scanCount
  />
</div>

<style>
  .actions-page {
    height: 100%;
    overflow-y: auto;
  }
</style>
