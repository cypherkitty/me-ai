<script>
  import { onMount, tick } from "svelte";
  import { getSetting, setSetting } from "./lib/store/settings.js";
  import { MODELS } from "./lib/models.js";
  import { OLLAMA_MODELS } from "./lib/ollama-models.js";
  import { API_MODELS } from "./lib/api-models.js";
  import { getUnifiedEngine } from "./lib/unified-engine.js";
  import { getPendingActions } from "./lib/store/query-layer.js";
  import { buildLLMContext, buildEmailContext } from "./lib/llm-context.js";
  import {
    buildBatchEventMessage,
    buildGroupedEventsMessage,
  } from "./lib/events.js";
  import { getClassificationsGrouped } from "./lib/triage.js";
  import {
    updateClassificationStatus,
    deleteClassification,
    clearClassificationsByAction,
    scanEmails,
    getScanStats,
  } from "./lib/triage.js";
  import { executePipelineBatch } from "./lib/plugins/execution-service.js";
  import BackendSelector from "./components/chat/BackendSelector.svelte";
  import ModelSelector from "./components/chat/ModelSelector.svelte";
  import OllamaSettings from "./components/chat/OllamaSettings.svelte";
  import CloudApiSettings from "./components/chat/CloudApiSettings.svelte";
  import LoadingProgress from "./components/chat/LoadingProgress.svelte";
  import ChatView from "./components/chat/ChatView.svelte";

  const IS_WEBGPU_AVAILABLE = !!navigator.gpu;

  // ── State ──────────────────────────────────────────────────────────
  const engine = getUnifiedEngine();
  let backend = $state("webgpu");
  let selectedModel = $state("onnx-community/gpt-oss-20b-ONNX");
  let status = $state(null); // null | "loading" | "ready"
  let error = $state(null);
  let loadingMessage = $state("");
  // Track whether the user has explicitly initiated a load in this session.
  // Prevents stale worker errors from a previous session showing on page load.
  let loadInitiated = false;
  let progressItems = $state([]);

  let messages = $state([]);
  let isRunning = $state(false);
  let tps = $state(null);
  let numTokens = $state(null);
  let enableThinking = $state(false);
  let loadDtype = $state("q4f16");
  let loadDevice = $state("webgpu");
  let maxTokens = $state(4096);
  let doSample = $state(false);
  let temperature = $state(0.7);
  let repetitionPenalty = $state(1.1);

  let chatContainer = $state(null);
  let gpuInfo = $state(null);
  let generationPhase = $state(null);

  // ── Cockpit state ─────────────────────────────────────────────────
  let pendingData = $state(null);
  let hasScanData = $state(false);
  let isScanning = $state(false);
  let greetingShown = false;

  // ── Shared engine listener ─────────────────────────────────────────
  onMount(async () => {
    // Restore saved backend, model, and options from IndexedDB
    const [
      savedBackend,
      savedModel,
      savedEnableThinking,
      savedLoadDtype,
      savedLoadDevice,
      savedMaxTokens,
      savedDoSample,
      savedTemperature,
      savedRepetitionPenalty,
    ] = await Promise.all([
      getSetting("aiBackend"),
      getSetting("selectedModel"),
      getSetting("enableThinking"),
      getSetting("loadDtype"),
      getSetting("loadDevice"),
      getSetting("maxTokens"),
      getSetting("doSample"),
      getSetting("temperature"),
      getSetting("repetitionPenalty"),
    ]);
    if (savedBackend) backend = savedBackend;
    if (savedModel) selectedModel = savedModel;
    if (savedEnableThinking !== undefined) enableThinking = savedEnableThinking;
    if (savedLoadDtype) loadDtype = savedLoadDtype;
    if (savedLoadDevice) loadDevice = savedLoadDevice;
    if (savedMaxTokens != null) maxTokens = savedMaxTokens;
    if (savedDoSample !== undefined) doSample = savedDoSample;
    if (savedTemperature != null) temperature = savedTemperature;
    if (savedRepetitionPenalty != null)
      repetitionPenalty = savedRepetitionPenalty;

    if (engine.status === "idle") {
      engine.check();
    }

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
            item.file === msg.file ? { ...item, ...msg } : item,
          );
          break;

        case "done":
          progressItems = progressItems.filter(
            (item) => item.file !== msg.file,
          );
          break;

        case "ready":
          status = "ready";
          showDashboardIfNeeded();
          break;

        case "start":
          if (!isRunning) break;
          generationPhase = msg.phase || "preparing";
          messages = [
            ...messages,
            {
              role: "assistant",
              content: "",
              thinking: "",
              model: selectedModel,
            },
          ];
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
          scrollToBottom(false);
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
          scrollToBottom(false);
          break;
        }

        case "complete":
          if (!isRunning) break;
          // Update final stats from Ollama
          if (msg.tps !== undefined) tps = msg.tps;
          if (msg.numTokens !== undefined) numTokens = msg.numTokens;
          isRunning = false;
          generationPhase = null;

          // --- BEGIN INTERCEPTOR ---
          const lastMsg = messages[messages.length - 1];
          if (lastMsg && lastMsg.role === "assistant" && lastMsg.content) {
            let newContent = lastMsg.content;
            let didIntercept = false;

            // 1. Intercept Execution Commands
            const execRegex = /\[EXECUTE:GROUP:([A-Z_]+)\]/g;
            let match;
            const executedGroups = [];
            while ((match = execRegex.exec(newContent)) !== null) {
              executedGroups.push(match[1]);
            }
            if (executedGroups.length > 0) {
              newContent = newContent
                .replace(/\[EXECUTE:GROUP:[A-Z_]+\]/g, "")
                .trim();
              didIntercept = true;
              for (const group of executedGroups) {
                if (
                  pendingData &&
                  pendingData.groups &&
                  pendingData.groups[group]
                ) {
                  runAutomatedExecution(group, pendingData.groups[group]);
                }
              }
            }

            // 2. Intercept Dashboard Command
            if (newContent.includes("[SHOW:DASHBOARD]")) {
              newContent = newContent.replace(/\[SHOW:DASHBOARD\]/g, "").trim();
              didIntercept = true;

              // Asynchronously fetch and inject the dashboard (pending only)
              getClassificationsGrouped({ pendingOnly: true })
                .then((grouped) => {
                  if (grouped.order.length > 0) {
                    buildGroupedEventsMessage(grouped).then((eventsMsg) => {
                      messages = [...messages, eventsMsg];
                      scrollToBottom();
                    });
                  }
                })
                .catch((err) => {
                  messages = [
                    ...messages,
                    {
                      role: "assistant",
                      content: `Failed to load events dashboard: ${err.message}`,
                    },
                  ];
                });
            }

            if (didIntercept) {
              messages = [
                ...messages.slice(0, -1),
                {
                  ...lastMsg,
                  content:
                    newContent === "" ? "Okay, here you go:" : newContent,
                },
              ];
            }
          }
          // --- END INTERCEPTOR ---

          refreshPendingData();
          break;

        case "error":
          if (loadInitiated) {
            error = msg.data;
          }
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
        messages = [
          { role: "assistant", type: "dashboard", pendingData: pending },
        ];
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
            i === dashIdx ? { ...m, pendingData: pending } : m,
          );
        } else {
          // Remove the dashboard if no more pending items
          messages = messages.filter((_, i) => i !== dashIdx);
        }
      }

      // Refresh the last events-grouped message so handled events disappear from the list
      const eventsGroupedIdx = messages.findLastIndex(
        (m) => m.type === "events-grouped",
      );
      if (eventsGroupedIdx !== -1) {
        const grouped = await getClassificationsGrouped({ pendingOnly: true });
        if (grouped.order.length === 0) {
          messages = messages.filter((_, i) => i !== eventsGroupedIdx);
        } else {
          const eventsMsg = await buildGroupedEventsMessage(grouped);
          messages = messages.map((m, i) =>
            i === eventsGroupedIdx ? eventsMsg : m,
          );
        }
      }

      const stats = await getScanStats();
      hasScanData = stats.classified > 0;
    } catch {
      // Non-critical
    }
  }

  // ── Action handlers (cockpit controls) ────────────────────────────

  async function runAutomatedExecution(eventType, emails) {
    if (!engine.isReady) return;
    const taskIdx = messages.length;
    const title = `${eventType
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ")} (${emails.length})`;

    messages = [
      ...messages,
      {
        role: "assistant",
        type: "task-card",
        title: `Executing ${title}`,
        status: "running",
        steps: [],
      },
    ];
    scrollToBottom();

    const updateTask = (patch) => Object.assign(messages[taskIdx], patch);

    try {
      const result = await executePipelineBatch(
        eventType,
        emails,
        (progress) => {
          const s = messages[taskIdx].steps || [];
          if (progress.phase === "pipeline_loaded") {
            updateTask({
              steps: progress.actions.map((a) => ({
                id: a.id ?? a.commandId,
                label: a.name ?? a.commandId,
                status: "pending",
              })),
            });
          } else if (progress.phase === "action_start") {
            updateTask({
              steps: s.map((step) =>
                step.id === (progress.actionId ?? progress.commandId)
                  ? { ...step, status: "running", startedAt: Date.now() }
                  : step,
              ),
            });
          } else if (progress.phase === "action_complete") {
            const ok = progress.result?.success !== false;
            updateTask({
              steps: s.map((step) =>
                step.id === (progress.actionId ?? progress.commandId)
                  ? {
                      ...step,
                      status: ok ? "done" : "error",
                      expandable: !!progress.result?.message,
                      subContent: progress.result?.message ?? "",
                    }
                  : step,
              ),
            });
          } else if (progress.phase === "done") {
            updateTask({
              status: (messages[taskIdx].steps || []).every(
                (step) => step.status !== "error",
              )
                ? "done"
                : "error",
            });
          } else if (progress.phase === "error") {
            updateTask({
              status: "error",
              steps: [
                ...s.filter((step) => step.status !== "running"),
                {
                  id: "__err",
                  label: progress.error ?? "Execution failed",
                  status: "error",
                },
              ],
            });
          }
        },
        true, // Auto-approve since user initiated it via chat
      );

      if (result.success) await refreshPendingData();
    } catch (e) {
      updateTask({
        status: "error",
        steps: [
          ...(messages[taskIdx].steps ?? []).filter(
            (step) => step.status !== "running",
          ),
          {
            id: "error",
            label: `Execution failed: ${e.message}`,
            status: "error",
          },
        ],
      });
    }
  }

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

    // Determine current model label for the task card badge
    const activeBackend =
      backend === "cloud"
        ? API_MODELS.find((m) => m.id === selectedModel)?.provider || "cloud"
        : backend;

    // Push a live task card into the chat.
    // Capture the index so we can mutate through the $state proxy later.
    const taskIdx = messages.length;
    messages = [
      ...messages,
      {
        role: "assistant",
        type: "task-card",
        title: "Scanning Emails",
        model: activeBackend,
        status: "running",
        steps: [
          {
            id: "fetch",
            label: "Fetching recent emails…",
            status: "running",
            startedAt: Date.now(),
          },
        ],
      },
    ];
    scrollToBottom();

    // Helper: mutate the task card through the reactive proxy
    const updateTask = (patch) => Object.assign(messages[taskIdx], patch);

    let scanResults = null;
    let emailCount = 0;

    // Completed email steps accumulate here during the scan
    const completedSteps = [];

    try {
      let classifyStartedAt = null;
      let totalEmails = 0;

      await scanEmails(engine, {
        count: 20,
        onProgress: (progress) => {
          if (progress.phase === "loading") {
            messages[taskIdx].steps = [
              {
                id: "fetch",
                label: "Loading recent emails…",
                status: "running",
                startedAt: Date.now(),
              },
            ];
          } else if (progress.phase === "scanning") {
            totalEmails = progress.total ?? 0;
            if (!classifyStartedAt) classifyStartedAt = Date.now();
            const subject = progress.email?.subject ?? "unknown";
            const shortSubj =
              subject.length > 46 ? subject.slice(0, 44) + "…" : subject;
            // Show completed steps + a running step for current email
            messages[taskIdx].steps = [
              {
                id: "fetch",
                label: `Found ${totalEmails} emails to scan`,
                status: "done",
                detail: `${totalEmails} messages`,
              },
              ...completedSteps,
              {
                id: `email-${progress.current}`,
                label: shortSubj,
                status: "running",
                startedAt: classifyStartedAt,
                detail: `${progress.current}/${progress.total}`,
              },
            ];
          } else if (progress.phase === "classified") {
            const subject = progress.email?.subject ?? "unknown";
            const shortSubj =
              subject.length > 46 ? subject.slice(0, 44) + "…" : subject;
            const cls = progress.result;
            const group = cls?.group ?? "";
            const action = cls?.action ?? "";
            const reason = cls?.reason ?? "";
            const summary = cls?.summary ?? "";

            // Build expandable detail text
            const lines = [];
            if (summary) lines.push(summary);
            if (action) lines.push(`Action: ${action}`);
            if (reason) lines.push(`Reason: ${reason}`);

            completedSteps.push({
              id: `email-${progress.current}`,
              label: shortSubj,
              status: "done",
              detail: action || group,
              expandable: true,
              badges: [group, action].filter(Boolean),
              subContent: lines.join("\n"),
            });

            // Continue showing current completed steps + next running slot
            messages[taskIdx].steps = [
              {
                id: "fetch",
                label: `Found ${totalEmails} emails to scan`,
                status: "done",
                detail: `${totalEmails} messages`,
              },
              ...completedSteps,
            ];
          } else if (progress.phase === "done") {
            if (progress.results?.length > 0) {
              scanResults = progress.results;
            }
            emailCount = totalEmails;
          }
        },
      });

      // Final state: fetch step + all individual email steps (already in completedSteps)
      const classified = completedSteps.length;
      messages[taskIdx].steps = [
        {
          id: "fetch",
          label: `Fetched ${emailCount} emails`,
          status: "done",
          detail: `${emailCount} messages`,
        },
        ...completedSteps,
      ];
      messages[taskIdx].description =
        classified > 0
          ? `Classified ${classified} email${classified !== 1 ? "s" : ""} into event types. Expand any row to see classification details.`
          : "No new emails to classify.";
      updateTask({ status: "done", title: `Scanned ${emailCount} Emails` });

      await refreshPendingData();

      // Show scan results as a batch event message in chat
      if (scanResults?.length > 0) {
        const eventMsg = await buildBatchEventMessage(scanResults);
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
      messages[taskIdx].status = "error";
      messages[taskIdx].steps = [
        ...(messages[taskIdx].steps ?? []).filter(
          (s) => s.status !== "running",
        ),
        { id: "error", label: `Scan failed: ${e.message}`, status: "error" },
      ];
    } finally {
      isScanning = false;
    }
  }

  function handleCommand({ event, commandId }) {
    // For now, describe the command execution in chat
    const desc = `Execute "${commandId}" on ${event.type} event: "${event.data?.subject || "unknown"}"`;
    messages = [
      ...messages,
      {
        role: "assistant",
        content: `Command: ${commandId}\n\nThis command is not yet implemented. In the future, "${commandId}" will be executed on the ${event.source} event "${event.data?.subject || ""}".`,
      },
    ];
    scrollToBottom();
  }

  // ── Helpers ────────────────────────────────────────────────────────
  /** @param {boolean} [force] - If false, only scroll when user is near bottom (avoids fighting scroll during streaming) */
  function scrollToBottom(force = true) {
    tick().then(() => {
      if (!chatContainer) return;
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 80;
      if (force || nearBottom) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    });
  }

  async function loadModel() {
    status = "loading";
    error = null;
    loadInitiated = true;
    await setSetting("selectedModel", selectedModel);
    await setSetting("aiBackend", backend);
    await setSetting("loadDtype", loadDtype);
    await setSetting("loadDevice", loadDevice);
    // Clear gpuInfo when not using WebGPU
    if (backend !== "webgpu") {
      gpuInfo = null;
    }
    const loadOptions =
      backend === "webgpu" ? { dtype: loadDtype, device: loadDevice } : {};
    engine.loadModel(selectedModel, loadOptions);
  }

  async function clearCacheAndRetry() {
    error = null;
    status = "loading";
    await engine.clearCache(selectedModel);
    await loadModel();
  }

  // Watch backend changes and update default model
  $effect(() => {
    if (backend === "webgpu" && !MODELS.find((m) => m.id === selectedModel)) {
      selectedModel = MODELS[0].id;
    } else if (
      backend === "ollama" &&
      !OLLAMA_MODELS.find((m) => m.name === selectedModel)
    ) {
      selectedModel = OLLAMA_MODELS[0].name;
    } else if (
      backend === "cloud" &&
      !API_MODELS.find((m) => m.id === selectedModel)
    ) {
      selectedModel = API_MODELS[0].id;
    }
  });

  // Persist chat options when they change
  $effect(() => {
    setSetting("enableThinking", enableThinking);
    setSetting("maxTokens", maxTokens);
    setSetting("doSample", doSample);
    setSetting("temperature", temperature);
    setSetting("repetitionPenalty", repetitionPenalty);
  });

  async function send(text) {
    if (!text || isRunning) return;

    // 1. Instant Interceptor: Dashboard
    if (text.trim() === "[SHOW:DASHBOARD]") {
      try {
        const grouped = await getClassificationsGrouped({ pendingOnly: true });
        if (!grouped.order.length) {
          messages = [
            ...messages,
            {
              role: "assistant",
              content:
                "No pending classified emails. Run a scan first or all events are already handled.",
            },
          ];
        } else {
          const eventsMsg = await buildGroupedEventsMessage(grouped);
          messages = [...messages, eventsMsg];
        }
      } catch (err) {
        messages = [
          ...messages,
          {
            role: "assistant",
            content: `Failed to load events dashboard: ${err.message}`,
          },
        ];
      }
      scrollToBottom();
      return;
    }

    // 2. Instant Interceptor: Execution
    const execRegex = /^\[EXECUTE:GROUP:([A-Z_]+)\]$/;
    const match = execRegex.exec(text.trim());
    if (match) {
      const group = match[1];
      if (pendingData && pendingData.groups && pendingData.groups[group]) {
        runAutomatedExecution(group, pendingData.groups[group]);
      }
      return;
    }

    // Handle legacy /events command
    if (text.trim().toLowerCase() === "/events") {
      messages = [...messages, { role: "user", content: text }];
      try {
        const grouped = await getClassificationsGrouped({ pendingOnly: true });
        if (!grouped.order.length) {
          messages = [
            ...messages,
            {
              role: "assistant",
              content:
                "No pending classified emails. Run a scan first or all events are already handled.",
            },
          ];
        } else {
          const eventsMsg = await buildGroupedEventsMessage(grouped);
          messages = [...messages, eventsMsg];
        }
      } catch (err) {
        messages = [
          ...messages,
          {
            role: "assistant",
            content: `Failed to load events: ${err.message}`,
          },
        ];
      }
      scrollToBottom();
      return;
    }

    messages = [...messages, { role: "user", content: text }];
    tps = null;
    isRunning = true;

    // Build system context — only load heavy email data when the user asks about emails
    let systemMessages = [];
    try {
      const emailKeywords =
        /\b(email|mail|inbox|message|sent|sender|from|subject|unread|gmail|pending|action|archive|delete|reply|follow.?up|prioriti|triage|urgent)\b/i;
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
      .filter(
        (m) =>
          m.type !== "dashboard" &&
          m.type !== "events-grouped" &&
          m.type !== "event-batch" &&
          m.type !== "event",
      )
      .map((m) => ({ role: m.role, content: m.content }));
    engine.generate([...systemMessages, ...plain], {
      enableThinking,
      maxTokens,
      do_sample: doSample,
      temperature,
      top_p: 0.95,
      top_k: 50,
      repetition_penalty: repetitionPenalty,
    });
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
  <div class="w-full h-full overflow-y-auto flex justify-center">
    <div class="w-full max-w-2xl px-4 py-8 flex flex-col gap-0">
      <BackendSelector bind:backend isWebGPUAvailable={IS_WEBGPU_AVAILABLE} />

      {#if backend === "webgpu"}
        <ModelSelector
          bind:selectedModel
          bind:loadDtype
          bind:loadDevice
          {gpuInfo}
          {error}
          onload={loadModel}
          onclearerror={() => {
            error = null;
          }}
          onclearcache={clearCacheAndRetry}
        />
      {:else if backend === "ollama"}
        <OllamaSettings bind:selectedModel bind:error onload={loadModel} />
      {:else if backend === "cloud"}
        <CloudApiSettings bind:selectedModel bind:error onload={loadModel} />
      {/if}
    </div>
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
    bind:enableThinking
    bind:maxTokens
    bind:doSample
    bind:temperature
    bind:repetitionPenalty
    backend={backend === "cloud"
      ? API_MODELS.find((m) => m.id === selectedModel)?.provider || "cloud"
      : backend}
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
    onexecuted={refreshPendingData}
  />
{/if}
