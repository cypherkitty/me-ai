<script>
  import { onMount, tick } from "svelte";
  import { MODELS } from "./lib/models.js";
  import { getEngine } from "./lib/llm-engine.js";
  import {
    buildLLMContext,
    buildEmailContext,
    buildPendingActionsContext,
    getPendingActions,
    buildGreetingMessage,
    buildInitialSuggestions,
  } from "./lib/store/query-layer.js";
  import ModelSelector from "./components/chat/ModelSelector.svelte";
  import LoadingProgress from "./components/chat/LoadingProgress.svelte";
  import ChatView from "./components/chat/ChatView.svelte";

  const IS_WEBGPU_AVAILABLE = !!navigator.gpu;

  // ── State ──────────────────────────────────────────────────────────
  const engine = getEngine();
  let selectedModel = $state(localStorage.getItem("selectedModel") || MODELS[0].id);
  let status = $state(null);       // null | "loading" | "ready"
  let error = $state(null);
  let loadingMessage = $state("");
  let progressItems = $state([]);

  let messages = $state([]);
  let suggestions = $state([]);
  let isRunning = $state(false);
  let tps = $state(null);
  let numTokens = $state(null);

  let chatContainer = $state(null);
  let gpuInfo = $state(null);
  let generationPhase = $state(null);

  let greetingShown = false;

  // ── Shared engine listener ─────────────────────────────────────────
  onMount(() => {
    engine.check();

    // If the model is already ready (loaded from another page), greet immediately
    if (engine.isReady) {
      showGreetingIfNeeded();
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
          showGreetingIfNeeded();
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
          isRunning = false;
          generationPhase = null;
          refreshSuggestions();
          break;

        case "error":
          if (!isRunning) break;
          error = msg.data;
          isRunning = false;
          generationPhase = null;
          break;
      }
    });

    return () => unsub();
  });

  // ── Greeting & suggestions ─────────────────────────────────────────
  async function showGreetingIfNeeded() {
    if (greetingShown || messages.length > 0) return;
    try {
      const pending = await getPendingActions();
      if (pending) {
        greetingShown = true;
        const greeting = buildGreetingMessage(pending);
        messages = [{ role: "assistant", content: greeting }];
        suggestions = buildInitialSuggestions(pending);
        scrollToBottom();
      }
    } catch {
      // Non-critical
    }
  }

  async function refreshSuggestions() {
    try {
      const pending = await getPendingActions();
      if (pending && pending.total > 0) {
        suggestions = buildInitialSuggestions(pending);
      } else {
        suggestions = [];
      }
    } catch {
      suggestions = [];
    }
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
    engine.loadModel(selectedModel);
  }

  async function send(text) {
    if (!text || isRunning) return;

    // Clear suggestions when user sends a message
    suggestions = [];

    messages = [...messages, { role: "user", content: text }];
    tps = null;
    isRunning = true;

    // Build system context from stored data
    let systemMessages = [];
    try {
      const pendingCtx = await buildPendingActionsContext();

      const emailKeywords = /\b(email|mail|inbox|message|sent|sender|from|subject|unread|gmail|pending|action|archive|delete|reply|follow.?up|prioriti|triage|urgent)\b/i;
      let context;
      if (emailKeywords.test(text) || pendingCtx) {
        context = await buildEmailContext(text);
        if (pendingCtx) {
          context = (context || "") + "\n\n" + pendingCtx;
        }
      } else {
        context = await buildLLMContext();
      }
      if (context) {
        systemMessages = [{ role: "system", content: context }];
      }
    } catch {
      // Non-critical — continue without context
    }

    const plain = messages.map((m) => ({ role: m.role, content: m.content }));
    engine.generate([...systemMessages, ...plain]);
    scrollToBottom();
  }

  function stop() {
    engine.interrupt();
  }

  function reset() {
    engine.reset();
    messages = [];
    suggestions = [];
    tps = null;
    numTokens = null;
    greetingShown = false;
    showGreetingIfNeeded();
  }
</script>

{#if !IS_WEBGPU_AVAILABLE}
  <div class="container center">
    <h1>WebGPU Not Available</h1>
    <p>Your browser does not support WebGPU. Please try Chrome 113+ or Edge 113+.</p>
  </div>

{:else if status === null}
  <ModelSelector
    bind:selectedModel
    {gpuInfo}
    {error}
    onload={loadModel}
  />

{:else if status === "loading"}
  <LoadingProgress message={loadingMessage} items={progressItems} />

{:else}
  <ChatView
    {messages}
    {suggestions}
    {isRunning}
    {tps}
    {numTokens}
    {generationPhase}
    {gpuInfo}
    bind:chatContainer
    onsend={send}
    onstop={stop}
    onreset={reset}
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
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
</style>
