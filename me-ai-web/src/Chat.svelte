<script lang="ts">
  import { onMount, tick } from "svelte";
  import { SettingValue, AiBackend } from "./lib/core.js";
  import type { ApiModel } from "./lib/core.js";
  import { coreStore, getCore } from "./lib/store/core-store.js";
  import { getUnifiedEngine } from "./lib/unified-engine.js";
  import { getPendingActions } from "./lib/store/query-layer.js";
  import {
    buildBatchEventMessage,
    buildEventsByCategoryMessage,
    type ByCategory,
  } from "./lib/events.js";
  import { getClassificationsByCategory } from "./lib/triage.js";
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

  const IS_WEBGPU_AVAILABLE = !!((navigator as unknown as { gpu?: unknown }).gpu);

  // ── State ──────────────────────────────────────────────────────────
  const engine = getUnifiedEngine();
  let backend = $state<AiBackend>(AiBackend.WebGpu);
  let selectedModel = $state("onnx-community/gpt-oss-20b-ONNX");
  let apiModels: ApiModel[] = $state([]);
  $effect(() => {
    const { core } = $coreStore;
    if (!core) { apiModels = []; return; }
    try {
      apiModels = (core as unknown as { getApiModels(): ApiModel[] }).getApiModels();
    } catch (e) {
      console.error("[Chat] getApiModels failed:", e);
      apiModels = [];
    }
  });
  interface ChatMsg {
    role?: string;
    type?: string;
    content?: string;
    thinking?: string;
    model?: string;
    status?: string;
    title?: string;
    description?: string;
    steps?: Array<Record<string, unknown>>;
    pendingData?: PendingData;
    [key: string]: unknown;
  }

  interface PendingData {
    total: number;
    order: string[];
    categories: Record<string, unknown[]>;
  }

  let status = $state<string | null>(null); // null | "loading" | "ready"
  let error = $state<string | null>(null);
  let loadingMessage = $state("");
  // Track whether the user has explicitly initiated a load in this session.
  // Prevents stale worker errors from a previous session showing on page load.
  let loadInitiated = false;
  let progressItems = $state<Record<string, unknown>[]>([]);

  let messages = $state<ChatMsg[]>([]);
  let isRunning = $state(false);
  let tps = $state<number | null>(null);
  let numTokens = $state<number | null>(null);
  let enableThinking = $state(false);
  let loadDtype = $state("q4f16");
  let loadDevice = $state("webgpu");
  let maxTokens = $state(4096);
  let doSample = $state(false);
  let temperature = $state(0.7);
  let repetitionPenalty = $state(1.1);

  let chatContainer = $state<HTMLElement | null>(null);
  let gpuInfo = $state<Record<string, unknown> | null>(null);
  let generationPhase = $state<string | null>(null);

  // ── Cockpit state ─────────────────────────────────────────────────
  let pendingData = $state<PendingData | null>(null);
  let hasScanData = $state(false);
  let isScanning = $state(false);
  let greetingShown = false;
  /** Set when IndexedDB/core is unavailable; settings are not persisted. */
  let storageUnavailable = $state(false);

  // ── Shared engine listener ─────────────────────────────────────────
  let _engineUnsub: (() => void) | undefined;
  onMount(() => {
    (async () => {
    // Restore saved backend, model, and options from settings (IndexedDB)
    try {
      const sv = await getCore().loadSettings();
      if (sv.aiBackend !== undefined) backend = sv.aiBackend;
      if (sv.selectedModel) selectedModel = sv.selectedModel;
      if (sv.enableThinking !== undefined) enableThinking = sv.enableThinking;
      if (sv.loadDtype) loadDtype = sv.loadDtype;
      if (sv.loadDevice) loadDevice = sv.loadDevice;
      if (sv.maxTokens != null) maxTokens = sv.maxTokens;
      if (sv.doSample !== undefined) doSample = sv.doSample;
      if (sv.temperature != null) temperature = sv.temperature;
      if (sv.repetitionPenalty != null) repetitionPenalty = sv.repetitionPenalty;
    } catch {
      storageUnavailable = true;
    }

    if (engine.status === "idle") {
      engine.check();
    }

    if (engine.isReady) {
      showDashboardIfNeeded();
    }

    const unsub = engine.onMessage((rawMsg) => {
      const msg = rawMsg as Record<string, unknown>;
      switch (msg.status) {
        case "webgpu-info":
          gpuInfo = msg.data as Record<string, unknown>;
          break;

        case "loading":
          status = "loading";
          loadingMessage = msg.data as string;
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
          generationPhase = (msg.phase as string) || "preparing";
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
          generationPhase = msg.phase as string;
          break;

        case "thinking": {
          if (!isRunning) break;
          tps = (msg.tps as number) ?? null;
          numTokens = (msg.numTokens as number) ?? null;
          const last = messages[messages.length - 1];
          messages = [
            ...messages.slice(0, -1),
            { ...last, thinking: (last.thinking || "") + (msg.content as string) },
          ];
          scrollToBottom(false);
          break;
        }

        case "thinking-done": {
          if (!isRunning) break;
          tps = (msg.tps as number) ?? null;
          numTokens = (msg.numTokens as number) ?? null;
          const last = messages[messages.length - 1];
          messages = [
            ...messages.slice(0, -1),
            { ...last, thinking: msg.content as string },
          ];
          break;
        }

        case "update": {
          if (!isRunning) break;
          tps = (msg.tps as number) ?? null;
          numTokens = (msg.numTokens as number) ?? null;
          const last = messages[messages.length - 1];
          messages = [
            ...messages.slice(0, -1),
            { ...last, content: (last.content ?? "") + (msg.output as string) },
          ];
          scrollToBottom(false);
          break;
        }

        case "complete": {
          if (!isRunning) break;
          // Update final stats from Ollama
          if (msg.tps !== undefined) tps = (msg.tps as number) ?? null;
          if (msg.numTokens !== undefined) numTokens = (msg.numTokens as number) ?? null;
          isRunning = false;
          generationPhase = null;

          // --- BEGIN INTERCEPTOR ---
          const lastMsg = messages[messages.length - 1];
          if (lastMsg && lastMsg.role === "assistant" && lastMsg.content) {
            let newContent = lastMsg.content;
            let didIntercept = false;

            // 1. Intercept Execution Commands
            const execRegex = /\[EXECUTE:CATEGORY:([A-Z_]+)\]/g;
            let match;
            const executedCategories: string[] = [];
            while ((match = execRegex.exec(newContent)) !== null) {
              executedCategories.push(match[1]);
            }
            if (executedCategories.length > 0) {
              newContent = newContent
                .replace(/\[EXECUTE:CATEGORY:[A-Z_]+\]/g, "")
                .trim();
              didIntercept = true;
              for (const eventType of executedCategories) {
                if (
                  pendingData &&
                  pendingData.categories &&
                  pendingData.categories[eventType]
                ) {
                  runAutomatedExecution(eventType, pendingData.categories[eventType]);
                }
              }
            }

            // 2. Intercept Dashboard Command
            if (newContent.includes("[SHOW:DASHBOARD]")) {
              newContent = newContent.replace(/\[SHOW:DASHBOARD\]/g, "").trim();
              didIntercept = true;

              // Asynchronously fetch and inject the dashboard (pending only)
              getClassificationsByCategory({ pendingOnly: true })
                .then((byCategory) => {
                  if (byCategory.order.length > 0) {
                    buildEventsByCategoryMessage(byCategory as unknown as ByCategory).then((eventsMsg) => {
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
                      content: `Failed to load events dashboard: ${(err as Error)?.message ?? String(err)}`,
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
        }

        case "error":
          if (loadInitiated) {
            error = msg.data as string;
          }
          if (status === "loading") {
            // Error during model loading - go back to model selector
            status = null;
          }
          if (isRunning) {
            isRunning = false;
            generationPhase = null;
            // Replace empty assistant bubble with error text
            const errLast = messages[messages.length - 1];
            if (errLast && errLast.role === "assistant" && !errLast.content) {
              messages = [
                ...messages.slice(0, -1),
                { ...errLast, content: `Error: ${(msg.data as string) || "Unknown error"}` },
              ];
            }
          }
          break;
      }
    });

    _engineUnsub = unsub;
    })();
    return () => _engineUnsub?.();
  });

  // ── Dashboard / pending data ──────────────────────────────────────
  async function showDashboardIfNeeded() {
    if (greetingShown || messages.length > 0) return;
    try {
      const pending = await getPendingActions();
      pendingData = pending as PendingData | null;
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
      pendingData = pending as PendingData | null;

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

      // Refresh the last events-by-category message so handled events disappear from the list
      const eventsByCategoryIdx = messages.findLastIndex(
        (m) => m.type === "events-by-category",
      );
      if (eventsByCategoryIdx !== -1) {
        const byCategory = await getClassificationsByCategory({ pendingOnly: true });
        if (byCategory.order.length === 0) {
          messages = messages.filter((_, i) => i !== eventsByCategoryIdx);
        } else {
          const eventsMsg = await buildEventsByCategoryMessage(byCategory as unknown as ByCategory);
          messages = messages.map((m, i) =>
            i === eventsByCategoryIdx ? eventsMsg : m,
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

  async function runAutomatedExecution(eventType: string, emails: unknown[]) {
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

    const updateTask = (patch: Record<string, unknown>) => Object.assign(messages[taskIdx], patch);

    try {
      const result = await executePipelineBatch(
        eventType,
        emails as Array<Record<string, unknown>>,
        (progress) => {
          const s = messages[taskIdx].steps || [];
          if (progress.phase === "pipeline_loaded") {
            updateTask({
              steps: (progress.actions ?? []).map((rawA) => {
                const a = rawA as Record<string, unknown>;
                return {
                  id: a.id ?? a.commandId,
                  label: a.name ?? a.commandId,
                  status: "pending",
                };
              }),
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
            const r = progress.result as { success?: boolean; message?: string } | undefined;
            const ok = r?.success !== false;
            updateTask({
              steps: s.map((step) =>
                step.id === (progress.actionId ?? progress.commandId)
                  ? {
                      ...step,
                      status: ok ? "done" : "error",
                      expandable: !!r?.message,
                      subContent: r?.message ?? "",
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
            label: `Execution failed: ${(e as Error)?.message ?? String(e)}`,
            status: "error",
          },
        ],
      });
    }
  }

  async function markActed(emailId: string) {
    await updateClassificationStatus(emailId, "acted");
    await refreshPendingData();
  }

  async function dismiss(emailId: string) {
    await updateClassificationStatus(emailId, "dismissed");
    await refreshPendingData();
  }

  async function removeItem(emailId: string) {
    await deleteClassification(emailId);
    await refreshPendingData();
  }

  async function clearCategory(action: string) {
    await clearClassificationsByAction(action);
    await refreshPendingData();
  }

  async function triggerScan() {
    if (isScanning || !engine.isReady) return;
    isScanning = true;

    // Determine current model label for the task card badge
    const activeBackend =
      backend === AiBackend.Cloud
        ? apiModels.find((m) => m.id === selectedModel)?.provider || "cloud"
        : backend === AiBackend.Ollama ? "ollama" : "webgpu";

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
    const updateTask = (patch: Record<string, unknown>) => Object.assign(messages[taskIdx], patch);

    let scanResults: unknown[] | null = null;
    let emailCount = 0;

    // Completed email steps accumulate here during the scan
    const completedSteps: Array<Record<string, unknown>> = [];

    try {
      let classifyStartedAt: number | null = null;
      let totalEmails = 0;

      await scanEmails(engine as unknown as Parameters<typeof scanEmails>[0], {
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
            const categoryTier = cls?.categoryTier ?? cls?.category ?? "";
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
              detail: action || categoryTier,
              expandable: true,
              badges: [categoryTier, action].filter(Boolean),
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
            if ((progress.results?.length ?? 0) > 0) {
              scanResults = progress.results ?? null;
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
      const typedScanResults = scanResults as unknown as Parameters<typeof buildBatchEventMessage>[0] | null;
      if (typedScanResults && typedScanResults.length > 0) {
        const eventMsg = await buildBatchEventMessage(typedScanResults);
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
        { id: "error", label: `Scan failed: ${(e as Error)?.message ?? String(e)}`, status: "error" },
      ];
    } finally {
      isScanning = false;
    }
  }

  function handleCommand(cmd: { event: Record<string, unknown>; commandId: string } | { id: string }) {
    if (!("event" in cmd)) return;
    const { event, commandId } = cmd;
    const evData = event?.data as Record<string, unknown> | undefined;
    messages = [
      ...messages,
      {
        role: "assistant",
        content: `Command: ${commandId}\n\nThis command is not yet implemented. In the future, "${commandId}" will be executed on the ${event.source} event "${evData?.subject || ""}".`,
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
    try {
      const sv = new SettingValue();
      sv.selectedModel = selectedModel;
      sv.aiBackend = backend;
      sv.loadDtype = loadDtype;
      sv.loadDevice = loadDevice;
      await getCore().saveSettings(sv);
    } catch {
      storageUnavailable = true;
    }
    // Clear gpuInfo when not using WebGPU
    if (backend !== AiBackend.WebGpu) {
      gpuInfo = null;
    }
    const loadOptions =
      backend === AiBackend.WebGpu ? { dtype: loadDtype, device: loadDevice } : {};
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
    const models = getCore().getOnnxModels();
    const ollamaModels = getCore().getOllamaModels();
    if (backend === AiBackend.WebGpu && !models.find((m) => m.id === selectedModel)) {
      if (models[0]) selectedModel = models[0].id;
    } else if (
      backend === AiBackend.Ollama &&
      !ollamaModels.find((m) => m.name === selectedModel)
    ) {
      if (ollamaModels[0]) selectedModel = ollamaModels[0].name;
    } else if (
      backend === AiBackend.Cloud &&
      !apiModels.find((m) => m.id === selectedModel)
    ) {
      if (apiModels[0]) selectedModel = apiModels[0].id;
    }
  });

  // Persist chat options when they change (no-op when storage unavailable)
  $effect(() => {
    const a = enableThinking;
    const b = maxTokens;
    const c = doSample;
    const d = temperature;
    const e = repetitionPenalty;
    (async () => {
      try {
        const sv = new SettingValue();
        sv.enableThinking = a;
        sv.maxTokens = b;
        sv.doSample = c;
        sv.temperature = d;
        sv.repetitionPenalty = e;
        await getCore().saveSettings(sv);
      } catch {
        storageUnavailable = true;
      }
    })();
  });

  async function send(text: string) {
    if (!text || isRunning) return;

    // 1. Instant Interceptor: Dashboard
    if (text.trim() === "[SHOW:DASHBOARD]") {
      try {
        const byCategory = await getClassificationsByCategory({ pendingOnly: true });
        if (!byCategory.order.length) {
          messages = [
            ...messages,
            {
              role: "assistant",
              content:
                "No pending classified emails. Run a scan first or all events are already handled.",
            },
          ];
        } else {
          const eventsMsg = await buildEventsByCategoryMessage(byCategory as unknown as ByCategory);
          messages = [...messages, eventsMsg];
        }
      } catch (err) {
        messages = [
          ...messages,
          {
            role: "assistant",
            content: `Failed to load events dashboard: ${(err as Error)?.message ?? String(err)}`,
          },
        ];
      }
      scrollToBottom();
      return;
    }

    // 2. Instant Interceptor: Execution
    const execRegex = /^\[EXECUTE:CATEGORY:([A-Z_]+)\]$/;
    const match = execRegex.exec(text.trim());
    if (match) {
      const eventType = match[1];
      if (pendingData && pendingData.categories && pendingData.categories[eventType]) {
        runAutomatedExecution(eventType, pendingData.categories[eventType]);
      }
      return;
    }

    // Handle legacy /events command
    if (text.trim().toLowerCase() === "/events") {
      messages = [...messages, { role: "user", content: text }];
      try {
        const byCategory = await getClassificationsByCategory({ pendingOnly: true });
        if (!byCategory.order.length) {
          messages = [
            ...messages,
            {
              role: "assistant",
              content:
                "No pending classified emails. Run a scan first or all events are already handled.",
            },
          ];
        } else {
          const eventsMsg = await buildEventsByCategoryMessage(byCategory as unknown as ByCategory);
          messages = [...messages, eventsMsg];
        }
      } catch (err) {
        messages = [
          ...messages,
          {
            role: "assistant",
            content: `Failed to load events: ${(err as Error)?.message ?? String(err)}`,
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
    let systemMessages: Array<{ role: string; content: string }> = [];
    try {
      const emailKeywords =
        /\b(email|mail|inbox|message|sent|sender|from|subject|unread|gmail|pending|action|archive|delete|reply|follow.?up|prioriti|triage|urgent)\b/i;
      const context = emailKeywords.test(text)
        ? await getCore().buildEmailContext(text)
        : await getCore().buildLlmContext() || null;

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
          m.type !== "events-by-category" &&
          m.type !== "event-batch" &&
          m.type !== "event",
      )
      .filter((m) => m.role != null && m.content != null)
      .map((m) => ({ role: m.role as string, content: m.content as string }));
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

<div class="w-full h-full flex flex-col overflow-hidden">
  {#if storageUnavailable}
    <div
      class="shrink-0 px-3 py-2 text-center text-sm bg-amber-500/20 text-amber-200 border-b border-amber-500/30"
      role="alert"
    >
      Storage unavailable (e.g. private browsing). Settings and data are not persisted.
    </div>
  {/if}
{#if status === null}
  <div class="w-full h-full overflow-y-auto flex justify-center">
    <div class="w-full max-w-2xl px-4 py-8 flex flex-col gap-0">
      <BackendSelector bind:backend isWebGPUAvailable={IS_WEBGPU_AVAILABLE} />

      {#if backend === AiBackend.WebGpu}
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
      {:else if backend === AiBackend.Ollama}
        <OllamaSettings bind:selectedModel bind:error onload={loadModel} />
      {:else if backend === AiBackend.Cloud}
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
    backend={backend === AiBackend.Cloud
      ? apiModels.find((m) => m.id === selectedModel)?.provider || "cloud"
      : backend === AiBackend.Ollama ? "ollama" : "webgpu"}
    bind:chatContainer
    onsend={send}
    onstop={stop}
    onreset={reset}
    onmarkacted={markActed}
    ondismiss={dismiss}
    onremove={removeItem}
    onclearcategory={clearCategory}
    onscan={triggerScan}
    oncommand={handleCommand}
    onexecuted={refreshPendingData}
  />
{/if}
</div>
