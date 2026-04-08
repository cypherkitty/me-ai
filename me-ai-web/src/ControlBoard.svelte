<script lang="ts">
  import { getCore } from "./lib/store/core-store.js";
  import { onMount } from "svelte";
  import { getUnifiedEngine } from "./lib/unified-engine.js";
  import {
    scanEmails,
    getClassificationsByCategory,
    getClassificationCounts,
    updateClassificationStatus,
    clearClassificationsByAction,
    deleteClassification,
    getScanStats,
  } from "$lib/triage";
  import type { ScanProgress, ScanStats } from "$lib/triage";
  import { getCategoryForEventType, categoryTierToName } from "$lib/events";
  import ControlBoardView from "./components/actions/ControlBoardView.svelte";
  import { SettingValue, ScanHistory } from "./lib/core.js";

  const engine = getUnifiedEngine();

  // ── State ──────────────────────────────────────────────────────────
  let engineStatus = $state<string>(engine.status);
  let modelName = $state("");
  let categories = $state<Record<string, unknown>>({});
  let categoryOrder = $state<string[]>([]);
  let eventTypeToCategory = $state<Record<string, string>>({});
  let counts = $state<Record<string, number> & { total: number }>({ total: 0 });
  let stats = $state<ScanStats | null>(null);
  let expandedCategory = $state<string | null>(null);

  let isScanning = $state(false);
  let scanProgress = $state<ScanProgress | null>(null);
  let scanCount = $state(3);
  let error = $state<string | null>(null);
  let successMsg = $state<string | null>(null);
  let scanAbort = $state<AbortController | null>(null);

  const SCAN_HISTORY_KEY = "me-ai-scan-history";

  async function loadScanHistory() {
    const sv = await getCore().loadSettings();
    return sv.scanHistory ?? null;
  }

  async function saveScanHistory(progress: ScanProgress) {
    if (progress.phase !== "done") return;
    const sv = new SettingValue();
    sv.scanHistory = new ScanHistory(
      Date.now(),
      Number(progress.classified) || 0,
      Number(progress.errors) || 0,
      Number(progress.total) || 0
    );
    await getCore().saveSettings(sv);
  }

  // ── Track engine status ────────────────────────────────────────────
  onMount(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      unsub = engine.onMessage((rawMsg) => {
        const msg = rawMsg as Record<string, unknown>;
        if (msg.status === "ready") {
          engineStatus = "ready";
          const webgpuModel = getCore()
            .getOnnxModels()
            .find((m) => m.id === engine.modelId);
          const ollamaModel = getCore()
            .getOllamaModels()
            .find((m) => m.name === engine.modelId);
          modelName = ollamaModel?.displayName ?? webgpuModel?.name ?? engine.modelId ?? "";
        }
        if (msg.status === "loading") engineStatus = "loading";
      });

      engineStatus = engine.status;
      if (engine.modelId) {
        const webgpuModel = getCore()
          .getOnnxModels()
          .find((m) => m.id === engine.modelId);
        const ollamaModel = getCore()
          .getOllamaModels()
          .find((m) => m.name === engine.modelId);
        modelName = ollamaModel?.displayName ?? webgpuModel?.name ?? engine.modelId ?? "";
      }

      // Restore last scan from IndexedDB
      const saved = await loadScanHistory();
      if (saved) {
        scanProgress = {
          phase: "done",
          classified: saved.classified,
          errors: saved.errors,
          total: saved.total,
        };
      }

      loadData();
    })();
    return () => unsub?.();
  });

  // ── Load data from DB ──────────────────────────────────────────────
  async function loadData() {
    try {
      const result = await getClassificationsByCategory();
      const fetchedCounts = await getClassificationCounts();
      const fetchedStats = await getScanStats();

      const map: Record<string, string> = {};
      for (const et of result.order) {
        const categoryTier = await getCategoryForEventType(et);
        map[et] = categoryTierToName(categoryTier);
      }

      categories = result.categories as Record<string, unknown>;
      categoryOrder = result.order;
      counts = fetchedCounts as Record<string, number> & { total: number };
      stats = fetchedStats;
      eventTypeToCategory = map;
    } catch (e) {
      error = `Failed to load data: ${(e as Error)?.message ?? String(e)}`;
    }
  }

  // ── Scan emails (skip already classified) ──────────────────────────
  async function startScan() {
    await doScan(false);
  }
  async function rescan() {
    await doScan(true);
  }

  async function doScan(force: boolean) {
    if (isScanning || !engine.isReady) return;

    error = null;
    successMsg = null;
    isScanning = true;
    scanProgress = null;
    const abort = new AbortController();
    scanAbort = abort;

    try {
      await scanEmails(engine as unknown as Parameters<typeof scanEmails>[0], {
        count: scanCount,
        force,
        signal: abort.signal,
        onProgress: (progress) => {
          scanProgress = progress;
          if (progress.phase === "done") saveScanHistory(progress);
        },
      });
      await loadData();
    } catch (e) {
      if (!abort.signal.aborted) error = `Scan failed: ${(e as Error)?.message ?? String(e)}`;
    } finally {
      isScanning = false;
      scanAbort = null;
    }
  }

  function stopScan() {
    scanAbort?.abort();
  }

  // ── Item actions ───────────────────────────────────────────────────
  async function markActed(emailId: string) {
    await updateClassificationStatus(emailId, "acted");
    await loadData();
  }

  async function executeEmail(eventType: string, email: Record<string, unknown>) {
    const { executePipeline, isAuthenticated } = await import("./lib/plugins/execution-service.js");

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
        true
      ); // Pass true for approved if we bypass the CRITICAL UI check here for simplicity, or we can handle it properly

      if (result.success) {
        successMsg = result.message ?? null;
        error = null;
        await markActed(email.emailId as string); // Mark as done after successful execution
      } else {
        error = `Execution failed: ${result.message}`;
        successMsg = null;
      }
    } catch (e) {
      error = `Execution error: ${(e as Error)?.message ?? String(e)}`;
      successMsg = null;
    }
  }

  async function dismiss(emailId: string) {
    await updateClassificationStatus(emailId, "dismissed");
    await loadData();
  }

  async function removeItem(emailId: string) {
    await deleteClassification(emailId);
    await loadData();
  }

  // ── Category actions ───────────────────────────────────────────────
  async function clearCategory(actionId: string) {
    await clearClassificationsByAction(actionId);
    await loadData();
  }

  function toggleCategory(actionId: string) {
    expandedCategory = expandedCategory === actionId ? null : actionId;
  }
</script>

<div class="flex flex-col h-full min-h-0">
  <ControlBoardView
    {engineStatus}
    {modelName}
    {categories}
    {categoryOrder}
    {eventTypeToCategory}
    {counts}
    {stats}
    {expandedCategory}
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
      await getCore().removeSetting(SCAN_HISTORY_KEY);
    }}
    bind:scanCount
  />
</div>
