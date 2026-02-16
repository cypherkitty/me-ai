<script>
  import { onMount } from "svelte";
  import { getEngine } from "./lib/llm-engine.js";
  import { MODELS } from "./lib/models.js";
  import {
    scanEmails,
    getClassificationsGrouped,
    getClassificationCounts,
    updateClassificationStatus,
    clearClassificationsByAction,
    deleteClassification,
    getScanStats,
  } from "./lib/triage.js";
  import ActionsView from "./components/actions/ActionsView.svelte";

  const engine = getEngine();

  // ── State ──────────────────────────────────────────────────────────
  let engineStatus = $state(engine.status);
  let modelName = $state("");
  let groups = $state({});
  let groupOrder = $state([]);
  let counts = $state({ total: 0 });
  let stats = $state(null);
  let expandedGroup = $state(null);

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

    engineStatus = engine.status;
    if (engine.modelId) {
      const model = MODELS.find((m) => m.id === engine.modelId);
      modelName = model?.name || engine.modelId || "";
    }

    loadData();
    return () => unsub();
  });

  // ── Load data from DB ──────────────────────────────────────────────
  async function loadData() {
    try {
      const result = await getClassificationsGrouped();
      groups = result.groups;
      groupOrder = result.order;
      counts = await getClassificationCounts();
      stats = await getScanStats();
    } catch (e) {
      error = `Failed to load data: ${e.message}`;
    }
  }

  // ── Scan emails (skip already classified) ──────────────────────────
  async function startScan() { await doScan(false); }
  async function rescan() { await doScan(true); }

  async function doScan(force) {
    if (isScanning || !engine.isReady) return;

    error = null;
    isScanning = true;
    scanProgress = null;

    try {
      await scanEmails(engine, {
        count: scanCount,
        force,
        onProgress: (progress) => { scanProgress = { ...progress }; },
      });
      await loadData();
    } catch (e) {
      error = `Scan failed: ${e.message}`;
    } finally {
      isScanning = false;
    }
  }

  // ── Item actions ───────────────────────────────────────────────────
  async function markActed(emailId) {
    await updateClassificationStatus(emailId, "acted");
    await loadData();
  }

  async function dismiss(emailId) {
    await updateClassificationStatus(emailId, "dismissed");
    await loadData();
  }

  async function removeItem(emailId) {
    await deleteClassification(emailId);
    await loadData();
  }

  // ── Group actions ──────────────────────────────────────────────────
  async function clearGroup(actionId) {
    await clearClassificationsByAction(actionId);
    await loadData();
  }

  function toggleGroup(actionId) {
    expandedGroup = expandedGroup === actionId ? null : actionId;
  }
</script>

<div class="actions-page">
  <ActionsView
    {engineStatus}
    {modelName}
    {groups}
    {groupOrder}
    {counts}
    {stats}
    {expandedGroup}
    {isScanning}
    {scanProgress}
    {error}
    onscan={startScan}
    onrescan={rescan}
    ontogglegroup={toggleGroup}
    onmarkacted={markActed}
    ondismiss={dismiss}
    onremove={removeItem}
    oncleargroup={clearGroup}
    ondismisserror={() => error = null}
    onrefresh={loadData}
    bind:scanCount
  />
</div>

<style>
  .actions-page {
    height: 100%;
    overflow-y: auto;
  }
</style>
