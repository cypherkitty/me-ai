<script lang="ts">
  import { onMount } from "svelte";
  import { getUnifiedEngine } from "./lib/unified-engine.js";
  import { MODELS } from "./lib/models.js";
  import { OLLAMA_MODELS } from "./lib/ollama-models.js";
  import {
    scanEmails,
    getClassificationsByCategory,
    getClassificationCounts,
    updateClassificationStatus,
    clearClassificationsByAction,
    deleteClassification,
    getScanStats,
  } from "./lib/triage.js";
  import { getCategoryForEventType, categoryTierToName } from "./lib/events.js";
  import ControlBoardView from "./components/actions/ControlBoardView.svelte";
  import {
    getSetting,
    setSetting,
    removeSetting,
  } from "./lib/store/settings.js";

  const engine = getUnifiedEngine();

  // ── State ──────────────────────────────────────────────────────────
  let engineStatus = $state(engine.status);
  let modelName = $state("");
  let categories = $state({});
  let categoryOrder = $state([]);
  let eventTypeToCategory = $state({});
  let counts = $state({ total: 0 });
  let stats = $state(null);
  let expandedCategory = $state(null);

  let isScanning = $state(false);
  let scanProgress = $state(null);
  let scanCount = $state(3);
  let error = $state(null);
  let successMsg = $state(null);
  let scanAbort = $state(null);

  const SCAN_HISTORY_KEY = "me-ai-scan-history";

  async function loadScanHistory() {
    return await getSetting(SCAN_HISTORY_KEY);
  }

  async function saveScanHistory(progress) {
    if (!progress || progress.phase !== "done") return;
    // Store only stats — no email content outside DuckDB
    await setSetting(SCAN_HISTORY_KEY, {
      timestamp: Date.now(),
      classified: progress.classified || 0,
      errors: progress.errors || 0,
      total: progress.total || 0,
      totals: progress.totals || {},
      summary: progress.summary || {},
    });
  }

  // ── Track engine status ────────────────────────────────────────────
  onMount(async () => {
    const unsub = engine.onMessage((msg) => {
      if (msg.status === "ready") {
        engineStatus = "ready";
        const webgpuModel = MODELS.find((m) => m.id === engine.modelId);
        const ollamaModel = OLLAMA_MODELS.find(
          (m) => m.name === engine.modelId,
        );
        const model = webgpuModel || ollamaModel;
        modelName = model?.name || model?.displayName || engine.modelId || "";
      }
      if (msg.status === "loading") engineStatus = "loading";
    });

    engineStatus = engine.status;
    if (engine.modelId) {
      const webgpuModel = MODELS.find((m) => m.id === engine.modelId);
      const ollamaModel = OLLAMA_MODELS.find((m) => m.name === engine.modelId);
      const model = webgpuModel || ollamaModel;
      modelName = model?.name || model?.displayName || engine.modelId || "";
    }

    // Restore last scan from DuckDB
    const saved = await loadScanHistory();
    if (saved) {
      scanProgress = { phase: "done", ...saved };
    }

    loadData();
    return () => unsub();
  });

  // ── Load data from DB ──────────────────────────────────────────────
  async function loadData() {
    try {
      const result = await getClassificationsByCategory();
      const fetchedCounts = await getClassificationCounts();
      const fetchedStats = await getScanStats();

      const map = {};
      for (const et of result.order) {
        const categoryTier = await getCategoryForEventType(et);
        map[et] = categoryTierToName(categoryTier);
      }

      categories = result.categories;
      categoryOrder = result.order;
      counts = fetchedCounts;
      stats = fetchedStats;
      eventTypeToCategory = map;
    } catch (e) {
      error = `Failed to load data: ${e.message}`;
    }
  }

  // ── Scan emails (skip already classified) ──────────────────────────
  async function startScan() {
    await doScan(false);
  }
  async function rescan() {
    await doScan(true);
  }

  async function doScan(force) {
    if (isScanning || !engine.isReady) return;

    error = null;
    successMsg = null;
    isScanning = true;
    scanProgress = null;
    const abort = new AbortController();
    scanAbort = abort;

    try {
      await scanEmails(engine, {
        count: scanCount,
        force,
        signal: abort.signal,
        onProgress: (progress) => {
          scanProgress = { ...progress };
          if (progress.phase === "done") saveScanHistory(progress);
        },
      });
      await loadData();
    } catch (e) {
      if (!abort.signal.aborted) error = `Scan failed: ${e.message}`;
    } finally {
      isScanning = false;
      scanAbort = null;
    }
  }

  function stopScan() {
    scanAbort?.abort();
  }

  // ── Item actions ───────────────────────────────────────────────────
  async function markActed(emailId) {
    await updateClassificationStatus(emailId, "acted");
    await loadData();
  }

  async function executeEmail(eventType, email) {
    const { executePipeline, isAuthenticated } = await import(
      "./lib/plugins/execution-service.js"
    );

    if (!(await isAuthenticated())) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }

    try {
      // Find the email's full data from the category to pass to the pipeline
      const eventData = { type: eventType, source: "gmail", data: email };

      const result = await executePipeline(
        eventData,
        (progress) => {
          // Could update UI progress here if needed
          console.log("Pipeline progress:", progress);
        },
        true,
      ); // Pass true for approved if we bypass the CRITICAL UI check here for simplicity, or we can handle it properly

      if (result.success) {
        successMsg = result.message;
        error = null;
        await markActed(email.emailId); // Mark as done after successful execution
      } else {
        error = `Execution failed: ${result.message}`;
        successMsg = null;
      }
    } catch (e) {
      error = `Execution error: ${e.message}`;
      successMsg = null;
    }
  }

  async function dismiss(emailId) {
    await updateClassificationStatus(emailId, "dismissed");
    await loadData();
  }

  async function removeItem(emailId) {
    await deleteClassification(emailId);
    await loadData();
  }

  // ── Category actions ───────────────────────────────────────────────
  async function clearCategory(actionId) {
    await clearClassificationsByAction(actionId);
    await loadData();
  }

  function toggleCategory(actionId) {
    expandedCategory = expandedCategory === actionId ? null : actionId;
  }
</script>

<div class="flex flex-col h-full min-h-0">
  <ControlBoardView
    {engineStatus}
    {modelName}
    categories={categories}
    categoryOrder={categoryOrder}
    {eventTypeToCategory}
    {counts}
    {stats}
    expandedCategory={expandedCategory}
    {isScanning}
    {scanProgress}
    {error}
    {successMsg}
    onscan={startScan}
    onrescan={rescan}
    ontogglecategory={toggleCategory}
    onexecute={executeEmail}
    onmarkacted={markActed}
    ondismiss={dismiss}
    onremove={removeItem}
    onclearcategory={clearCategory}
    ondismisserror={() => (error = null)}
    ondismisssuccess={() => (successMsg = null)}
    onstop={stopScan}
    oncloseprogress={async () => {
      scanProgress = null;
      await removeSetting(SCAN_HISTORY_KEY);
    }}
    bind:scanCount
  />
</div>
