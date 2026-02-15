<script>
  import { onMount, tick } from "svelte";
  import { MODELS } from "./lib/models.js";
  import ModelSelector from "./components/chat/ModelSelector.svelte";
  import LoadingProgress from "./components/chat/LoadingProgress.svelte";
  import ChatView from "./components/chat/ChatView.svelte";

  const IS_WEBGPU_AVAILABLE = !!navigator.gpu;

  // ── State ──────────────────────────────────────────────────────────
  let worker = $state(null);
  let selectedModel = $state(localStorage.getItem("selectedModel") || MODELS[0].id);
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

  // ── Worker setup ───────────────────────────────────────────────────
  onMount(() => {
    worker = new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });
    worker.postMessage({ type: "check" });

    worker.addEventListener("message", (e) => {
      const msg = e.data;

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
          break;

        case "start":
          generationPhase = msg.phase || "preparing";
          messages = [...messages, { role: "assistant", content: "", thinking: "" }];
          break;

        case "phase":
          generationPhase = msg.phase;
          break;

        case "thinking": {
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
          isRunning = false;
          generationPhase = null;
          break;

        case "error":
          error = msg.data;
          isRunning = false;
          generationPhase = null;
          break;
      }
    });

    return () => worker?.terminate();
  });

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
    worker.postMessage({ type: "load", modelId: selectedModel });
  }

  function send(text) {
    if (!text || isRunning) return;
    messages = [...messages, { role: "user", content: text }];
    tps = null;
    isRunning = true;
    const plain = messages.map((m) => ({ role: m.role, content: m.content }));
    worker.postMessage({ type: "generate", data: plain });
    scrollToBottom();
  }

  function stop() {
    worker.postMessage({ type: "interrupt" });
  }

  function reset() {
    worker.postMessage({ type: "reset" });
    messages = [];
    tps = null;
    numTokens = null;
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
