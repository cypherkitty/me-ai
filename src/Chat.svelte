<script>
  import { onMount, tick } from "svelte";
  import { MODELS } from "./lib/models.js";
  import { OLLAMA_MODELS } from "./lib/ollama-models.js";
  import { getUnifiedEngine } from "./lib/unified-engine.js";
  import { getPendingActions } from "./lib/store/query-layer.js";
  import { buildLLMContext, buildEmailContext } from "./lib/llm-context.js";
  import { buildBatchEventMessage } from "./lib/events.js";
  import {
    updateClassificationStatus,
    deleteClassification,
    clearClassificationsByAction,
    scanEmails,
    getScanStats,
  } from "./lib/triage.js";
  import BackendSelector from "./components/chat/BackendSelector.svelte";
  import ModelSelector from "./components/chat/ModelSelector.svelte";
  import OllamaSettings from "./components/chat/OllamaSettings.svelte";
  import LoadingProgress from "./components/chat/LoadingProgress.svelte";
  import ChatView from "./components/chat/ChatView.svelte";

  const IS_WEBGPU_AVAILABLE = !!navigator.gpu;

  // ── State ──────────────────────────────────────────────────────────
  const engine = getUnifiedEngine();
  let backend = $state(localStorage.getItem("aiBackend") || "webgpu");
  
  // Get default model based on backend
  function getDefaultModel() {
    const saved = localStorage.getItem("selectedModel");
    if (saved) return saved;
    return backend === "webgpu" ? MODELS[0].id : OLLAMA_MODELS[0].name;
  }
  
  let selectedModel = $state(getDefaultModel());
  let status = $state(null);       // null | "loading" | "ready"
  let error = $state(null);
  let loadingMessage = $state("");
  let progressItems = $state([]);

  let messages = $state([]);
  let isRunning = $state(false);
  let tps = $state(null);
  let numTokens = $state(null);

  let chatContainer = $state(null);
  let gpuInfo = $state(null);
  let generationPhase = $state(null);

  // ── Cockpit state ─────────────────────────────────────────────────
  let pendingData = $state(null);
  let hasScanData = $state(false);
  let isScanning = $state(false);
  let greetingShown = false;

  // ── Shared engine listener ─────────────────────────────────────────
  onMount(() => {
    engine.check();

    if (engine.isReady) {
      showDashboardIfNeeded();
    }

    const unsub = engine.onMessage((msg) => {
      switch (msg.status) {
        case "webgpu-info":
          gpuInfo = msg.data;
          break;

        case "loading":
          status = "loading";
          loadingMessage = msg.data;
          break;

        case "initiate":
          progressItems = [...progressItems, msg];
          break;

        case "progress":
          progressItems = progressItems.map((item) =>
            item.file === msg.file ? { ...item, ...msg } : item
          );
          break;

        case "done":
          progressItems = progressItems.filter((item) => item.file !== msg.file);
          break;

        case "ready":
          status = "ready";
          showDashboardIfNeeded();
          break;

        case "start":
          if (!isRunning) break;
          generationPhase = msg.phase || "preparing";
          messages = [...messages, { role: "assistant", content: "", thinking: "" }];
          break;

        case "phase":
          if (!isRunning) break;
          generationPhase = msg.phase;
          break;

        case "thinking": {
          if (!isRunning) break;
          tps = msg.tps;
          numTokens = msg.numTokens;
          const last = messages[messages.length - 1];
          messages = [
            ...messages.slice(0, -1),
            { ...last, thinking: (last.thinking || "") + msg.content },
          ];
          scrollToBottom();
          break;
        }

        case "thinking-done": {
          if (!isRunning) break;
          tps = msg.tps;
          numTokens = msg.numTokens;
          const last = messages[messages.length - 1];
          messages = [
            ...messages.slice(0, -1),
            { ...last, thinking: msg.content },
          ];
          break;
        }

        case "update": {
          if (!isRunning) break;
          tps = msg.tps;
          numTokens = msg.numTokens;
          const last = messages[messages.length - 1];
          messages = [
            ...messages.slice(0, -1),
            { ...last, content: last.content + msg.output },
          ];
          scrollToBottom();
          break;
        }

        case "complete":
          if (!isRunning) break;
          // Update final stats from Ollama
          if (msg.tps !== undefined) tps = msg.tps;
          if (msg.numTokens !== undefined) numTokens = msg.numTokens;
          isRunning = false;
          generationPhase = null;
          refreshPendingData();
          break;

        case "error":
          error = msg.data;
          if (status === "loading") {
            // Error during model loading - go back to model selector
            status = null;
          }
          if (isRunning) {
            isRunning = false;
            generationPhase = null;
          }
          break;
      }
    });

    return () => unsub();
  });

  // ── Dashboard / pending data ──────────────────────────────────────
  async function showDashboardIfNeeded() {
    if (greetingShown || messages.length > 0) return;
    try {
      const pending = await getPendingActions();
      pendingData = pending;
      if (pending) {
        greetingShown = true;
        messages = [{ role: "assistant", type: "dashboard", pendingData: pending }];
        scrollToBottom();
      }
      // Check if user has any scan data at all
      const stats = await getScanStats();
      hasScanData = stats.classified > 0;
    } catch {
      // Non-critical
    }
  }

  async function refreshPendingData() {
    try {
      const pending = await getPendingActions();
      pendingData = pending;

      // Update the dashboard message in-place if it exists
      const dashIdx = messages.findIndex((m) => m.type === "dashboard");
      if (dashIdx !== -1) {
        if (pending && pending.total > 0) {
          messages = messages.map((m, i) =>
            i === dashIdx ? { ...m, pendingData: pending } : m
          );
        } else {
          // Remove the dashboard if no more pending items
          messages = messages.filter((_, i) => i !== dashIdx);
        }
      }

      const stats = await getScanStats();
      hasScanData = stats.classified > 0;
    } catch {
      // Non-critical
    }
  }

  // ── Action handlers (cockpit controls) ────────────────────────────
  async function markActed(emailId) {
    await updateClassificationStatus(emailId, "acted");
    await refreshPendingData();
  }

  async function dismiss(emailId) {
    await updateClassificationStatus(emailId, "dismissed");
    await refreshPendingData();
  }

  async function removeItem(emailId) {
    await deleteClassification(emailId);
    await refreshPendingData();
  }

  async function clearGroup(action) {
    await clearClassificationsByAction(action);
    await refreshPendingData();
  }

  async function triggerScan() {
    if (isScanning || !engine.isReady) return;
    isScanning = true;
    let scanResults = null;
    try {
      await scanEmails(engine, {
        count: 20,
        onProgress: (progress) => {
          if (progress.phase === "done" && progress.results?.length > 0) {
            scanResults = progress.results;
          }
        },
      });
      await refreshPendingData();

      // Show scan results as a batch event message in chat
      if (scanResults?.length > 0) {
        const eventMsg = buildBatchEventMessage(scanResults);
        messages = [...messages, eventMsg];
        scrollToBottom();
      }

      // If no dashboard message exists yet, insert one
      if (pendingData && !messages.some((m) => m.type === "dashboard")) {
        messages = [
          { role: "assistant", type: "dashboard", pendingData },
          ...messages,
        ];
        scrollToBottom();
      }
    } catch (e) {
      console.error("Scan failed:", e);
    } finally {
      isScanning = false;
    }
  }

  function handleCommand({ event, commandId }) {
    // For now, describe the command execution in chat
    const desc = `Execute "${commandId}" on ${event.type} event: "${event.data?.subject || "unknown"}"`;
    messages = [...messages, { role: "assistant", content: `Command: ${commandId}\n\nThis command is not yet implemented. In the future, "${commandId}" will be executed on the ${event.source} event "${event.data?.subject || ""}".` }];
    scrollToBottom();
  }

  // ── Helpers ────────────────────────────────────────────────────────
  function scrollToBottom() {
    tick().then(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    });
  }

  function loadModel() {
    status = "loading";
    localStorage.setItem("selectedModel", selectedModel);
    localStorage.setItem("aiBackend", backend);
    // Clear gpuInfo when switching to Ollama
    if (backend === "ollama") {
      gpuInfo = null;
    }
    engine.loadModel(selectedModel);
  }

  // Watch backend changes and update default model
  $effect(() => {
    if (backend === "webgpu" && !MODELS.find(m => m.id === selectedModel)) {
      selectedModel = MODELS[0].id;
    } else if (backend === "ollama" && !OLLAMA_MODELS.find(m => m.name === selectedModel)) {
      selectedModel = OLLAMA_MODELS[0].name;
    }
  });

  async function send(text) {
    if (!text || isRunning) return;

    messages = [...messages, { role: "user", content: text }];
    tps = null;
    isRunning = true;

    // Build system context — only load heavy email data when the user asks about emails
    let systemMessages = [];
    try {
      const emailKeywords = /\b(email|mail|inbox|message|sent|sender|from|subject|unread|gmail|pending|action|archive|delete|reply|follow.?up|prioriti|triage|urgent)\b/i;
      const context = emailKeywords.test(text)
        ? await buildEmailContext(text)
        : await buildLLMContext();

      if (context) {
        systemMessages = [{ role: "system", content: context }];
      }
    } catch {
      // Non-critical — continue without context
    }

    // Only include text messages for the LLM (skip dashboard messages)
    const plain = messages
      .filter((m) => m.type !== "dashboard")
      .map((m) => ({ role: m.role, content: m.content }));
    engine.generate([...systemMessages, ...plain]);
    scrollToBottom();
  }

  function stop() {
    engine.interrupt();
  }

  function reset() {
    engine.reset();
    messages = [];
    tps = null;
    numTokens = null;
    greetingShown = false;
    showDashboardIfNeeded();
  }
</script>

{#if status === null}
  <div class="container center">
    <BackendSelector bind:backend isWebGPUAvailable={IS_WEBGPU_AVAILABLE} />

    {#if backend === "webgpu"}
      <ModelSelector
        bind:selectedModel
        {gpuInfo}
        {error}
        onload={loadModel}
      />
    {:else if backend === "ollama"}
      <OllamaSettings
        bind:selectedModel
        bind:error
        onload={loadModel}
      />
    {/if}
  </div>

{:else if status === "loading"}
  <LoadingProgress message={loadingMessage} items={progressItems} />

{:else}
  <ChatView
    {messages}
    {pendingData}
    {hasScanData}
    engineReady={engine.isReady}
    {isScanning}
    {isRunning}
    {tps}
    {numTokens}
    {generationPhase}
    {gpuInfo}
    {backend}
    bind:chatContainer
    onsend={send}
    onstop={stop}
    onreset={reset}
    onmarkacted={markActed}
    ondismiss={dismiss}
    onremove={removeItem}
    oncleargroup={clearGroup}
    onscan={triggerScan}
    oncommand={handleCommand}
  />
{/if}

<style>
  .container {
    max-width: 520px;
    margin: auto;
    padding: 2rem;
  }
  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    gap: 0.75rem;
  }
</style>
