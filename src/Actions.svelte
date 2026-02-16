<script>
  import { onMount } from "svelte";
  import { getEngine } from "./lib/llm-engine.js";
  import { MODELS } from "./lib/models.js";
  import {
    scanEmails,
    getClassificationsGrouped,
    getClassificationCounts,
    updateClassificationStatus,
    clearClassifications,
    ACTION_TYPES,
    VALID_ACTIONS,
  } from "./lib/triage.js";
  import ActionsView from "./components/actions/ActionsView.svelte";

  const engine = getEngine();

  // ── State ──────────────────────────────────────────────────────────
  let engineStatus = $state(engine.status);
  let modelName = $state("");
  let groups = $state({});
  let counts = $state({ total: 0 });
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
      groups = await getClassificationsGrouped();
      counts = await getClassificationCounts();
    } catch (e) {
      error = `Failed to load data: ${e.message}`;
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

  async function clearAll() {
    await clearClassifications();
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
    {counts}
    {expandedGroup}
    {isScanning}
    {scanProgress}
    {error}
    onscan={startScan}
    ontogglegroup={toggleGroup}
    onmarkacted={markActed}
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
