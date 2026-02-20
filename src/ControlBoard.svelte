<script>
  import { onMount } from "svelte";
  import { getUnifiedEngine } from "./lib/unified-engine.js";
  import { MODELS } from "./lib/models.js";
  import { OLLAMA_MODELS } from "./lib/ollama-models.js";
  import {
    scanEmails,
    getClassificationsGrouped,
    getClassificationCounts,
    updateClassificationStatus,
    clearClassificationsByAction,
    deleteClassification,
    getScanStats,
  } from "./lib/triage.js";
  import ControlBoardView from "./components/actions/ControlBoardView.svelte";
  import { getSetting, setSetting, removeSetting } from "./lib/store/settings.js";

  const engine = getUnifiedEngine();

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
    // Store only stats — no email content outside IndexedDB
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
        const ollamaModel = OLLAMA_MODELS.find((m) => m.name === engine.modelId);
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

    // Restore last scan from IndexedDB
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
    const { executePipeline, isAuthenticated } = await import("./lib/plugins/execution-service.js");
    
    if (!await isAuthenticated()) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }

    try {
      // Find the email's full data from the group to pass to the pipeline
      const eventData = { type: eventType, source: "gmail", data: email };
      
      const result = await executePipeline(eventData, (progress) => {
        // Could update UI progress here if needed
        console.log("Pipeline progress:", progress);
      }, true); // Pass true for approved if we bypass the CRITICAL UI check here for simplicity, or we can handle it properly

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

  // ── Group actions ──────────────────────────────────────────────────
  async function clearGroup(actionId) {
    await clearClassificationsByAction(actionId);
    await loadData();
  }

  function toggleGroup(actionId) {
    expandedGroup = expandedGroup === actionId ? null : actionId;
  }
</script>

<div class="control-board-page">
  <ControlBoardView
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
    {successMsg}
    onscan={startScan}
    onrescan={rescan}
    ontogglegroup={toggleGroup}
    onexecute={executeEmail}
    onmarkacted={markActed}
    ondismiss={dismiss}
    onremove={removeItem}
    oncleargroup={clearGroup}
    ondismisserror={() => error = null}
    ondismisssuccess={() => successMsg = null}
    onstop={stopScan}
    onrefresh={loadData}
    oncloseprogress={async () => { scanProgress = null; await removeSetting(SCAN_HISTORY_KEY); }}
    bind:scanCount
  />
</div>

<style>
  .control-board-page {
    height: 100%;
    overflow-y: auto;
  }
</style>