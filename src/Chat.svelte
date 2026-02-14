<script>
  import { onMount, tick } from "svelte";

  const IS_WEBGPU_AVAILABLE = !!navigator.gpu;

  // ── Available Models ───────────────────────────────────────────────
  const MODELS = [
    { id: "onnx-community/Qwen3-0.6B-ONNX", name: "Qwen3 0.6B", size: "~400 MB", description: "Fastest, best for quick answers" },
    { id: "onnx-community/Qwen3-1.7B-ONNX", name: "Qwen3 1.7B", size: "~1.1 GB", description: "Balanced speed and quality" },
    { id: "onnx-community/Qwen3-4B-ONNX", name: "Qwen3 4B", size: "~2.6 GB", description: "Better reasoning, slower" },
    { id: "onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX", name: "DeepSeek R1 1.5B", size: "~1 GB", description: "Strong reasoning, CoT focused" },
    { id: "onnx-community/Phi-4-mini-instruct-ONNX", name: "Phi-4 Mini", size: "~2.5 GB", description: "Microsoft, good at reasoning" },
    { id: "onnx-community/Phi-3-mini-128k-instruct-ONNX", name: "Phi-3 Mini 128k", size: "~2.6 GB", description: "128k context, reliable" },
    { id: "onnx-community/gemma-3-270m-it-ONNX", name: "Gemma 3 270M", size: "~190 MB", description: "Smallest, ultra fast" },
  ];

  // ── State ──────────────────────────────────────────────────────────
  let worker = $state(null);
  let selectedModel = $state(localStorage.getItem("selectedModel") || MODELS[0].id);
  let status = $state(null);       // null | "loading" | "ready"
  let error = $state(null);
  let loadingMessage = $state("");
  let progressItems = $state([]);

  let messages = $state([]);       // { role, content, thinking? }[]
  let input = $state("");
  let isRunning = $state(false);
  let tps = $state(null);
  let numTokens = $state(null);

  let chatContainer = $state(null);
  let gpuInfo = $state(null);
  let showGpuPanel = $state(false);
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

  function send() {
    const text = input.trim();
    if (!text || isRunning) return;
    messages = [...messages, { role: "user", content: text }];
    input = "";
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

  function handleKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
  }

  function formatBytesPrecise(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / Math.pow(k, i);
    const decimals = i >= 2 ? 2 : i >= 1 ? 1 : 0;
    return value.toFixed(decimals) + " " + sizes[i];
  }

  function progressPct(loaded, total) {
    if (!total || total <= 0) return null;
    return Math.min(100, (loaded / total) * 100);
  }
</script>

{#if !IS_WEBGPU_AVAILABLE}
  <div class="container center">
    <h1>WebGPU Not Available</h1>
    <p>Your browser does not support WebGPU. Please try Chrome 113+ or Edge 113+.</p>
  </div>

{:else if status === null}
  <div class="container center">
    <h1>me-ai</h1>
    <p class="subtitle">
      A private AI chat that runs <strong>entirely in your browser</strong> using WebGPU.
    </p>

    <div class="model-selector">
      <label for="model-select">Choose Model:</label>
      <select id="model-select" bind:value={selectedModel}>
        {#each MODELS as model}
          <option value={model.id}>
            {model.name} — {model.size}
          </option>
        {/each}
      </select>
      {#if selectedModel}
        {@const currentModel = MODELS.find(m => m.id === selectedModel)}
        {#if currentModel}
          <p class="model-description">{currentModel.description}</p>
        {/if}
      {/if}
    </div>

    {#if gpuInfo}
      <div class="gpu-card">
        <div class="gpu-card-header">
          <span class="gpu-dot"></span>
          <span>WebGPU Active</span>
        </div>
        <div class="gpu-card-body">
          <div class="gpu-row"><span>Vendor</span><span>{gpuInfo.vendor}</span></div>
          <div class="gpu-row"><span>Architecture</span><span>{gpuInfo.architecture}</span></div>
          {#if gpuInfo.device && gpuInfo.device !== "unknown"}
            <div class="gpu-row"><span>Device</span><span>{gpuInfo.device}</span></div>
          {/if}
          {#if gpuInfo.description && gpuInfo.description !== "unknown"}
            <div class="gpu-row"><span>Description</span><span>{gpuInfo.description}</span></div>
          {/if}
          {#if gpuInfo.limits?.maxBufferSize}
            <div class="gpu-row"><span>Max buffer</span><span>{formatBytes(gpuInfo.limits.maxBufferSize)}</span></div>
          {/if}
          {#if gpuInfo.features?.length}
            <div class="gpu-row"><span>Features</span><span>{gpuInfo.features.length} supported</span></div>
          {/if}
        </div>
      </div>
    {/if}
    {#if error}
      <p class="error">{error}</p>
    {/if}
    <button class="btn primary" onclick={loadModel} disabled={error}>
      Load Model
    </button>
  </div>

{:else if status === "loading"}
  <div class="container center loading-container">
    <h1>me-ai</h1>
    <p class="loading-msg">{loadingMessage}</p>
    {#each progressItems as item}
      {@const pct = item.total ? progressPct(item.loaded || 0, item.total) : null}
      <div class="progress-card">
        <div class="progress-header">
          <span class="progress-file" title={item.file}>{item.file}</span>
          {#if pct !== null}
            <span class="progress-percent">{pct.toFixed(1)}%</span>
          {/if}
        </div>
        {#if item.total}
          <div class="progress-bar">
            <div
              class="progress-fill"
              style="width: {Math.max(item.progress ?? 0, 0.5).toFixed(1)}%"
            ></div>
          </div>
          <div class="progress-numbers">
            <span class="progress-loaded">{formatBytesPrecise(item.loaded || 0)}</span>
            <span class="progress-sep">/</span>
            <span class="progress-total">{formatBytesPrecise(item.total)}</span>
            <span class="progress-raw" title="Exact bytes">({(item.loaded || 0).toLocaleString()} / {item.total.toLocaleString()} B)</span>
          </div>
        {:else}
          <div class="progress-bar">
            <div class="progress-fill indeterminate"></div>
          </div>
          <div class="progress-numbers">
            {#if item.loaded}
              <span class="progress-loaded">{formatBytesPrecise(item.loaded)}</span>
              <span class="progress-raw" title="Exact bytes">({item.loaded.toLocaleString()} B)</span>
            {:else}
              <span class="progress-indeterminate">downloading…</span>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>

{:else}
  <div class="chat-wrapper">
    <header>
      <h1>me-ai</h1>
      {#if gpuInfo}
        <button class="gpu-badge" onclick={() => showGpuPanel = !showGpuPanel}>
          WebGPU {showGpuPanel ? "▲" : "▼"}
        </button>
      {/if}
      {#if tps && !isRunning}
        <span class="stats">
          {numTokens} tokens in {(numTokens / tps).toFixed(1)}s
          ({tps.toFixed(1)} tok/s)
        </span>
      {:else if isRunning && generationPhase === "preparing"}
        <span class="stats preparing">preparing...</span>
      {:else if isRunning && generationPhase === "thinking"}
        <span class="stats preparing">thinking... {tps ? `${tps.toFixed(0)} tok/s` : ""}</span>
      {:else if tps && isRunning}
        <span class="stats">{tps.toFixed(1)} tok/s</span>
      {/if}
      <button class="btn small" onclick={reset} disabled={isRunning}>Reset</button>
    </header>

    {#if showGpuPanel && gpuInfo}
      <div class="gpu-panel">
        <div class="gpu-panel-grid">
          <div class="gpu-panel-item">
            <div class="gpu-panel-label">Status</div>
            <div class="gpu-panel-value ok">Active</div>
          </div>
          <div class="gpu-panel-item">
            <div class="gpu-panel-label">Vendor</div>
            <div class="gpu-panel-value">{gpuInfo.vendor}</div>
          </div>
          <div class="gpu-panel-item">
            <div class="gpu-panel-label">Architecture</div>
            <div class="gpu-panel-value">{gpuInfo.architecture}</div>
          </div>
          {#if gpuInfo.device && gpuInfo.device !== "unknown"}
            <div class="gpu-panel-item">
              <div class="gpu-panel-label">Device</div>
              <div class="gpu-panel-value">{gpuInfo.device}</div>
            </div>
          {/if}
          {#if gpuInfo.limits?.maxBufferSize}
            <div class="gpu-panel-item">
              <div class="gpu-panel-label">Max Buffer</div>
              <div class="gpu-panel-value">{formatBytes(gpuInfo.limits.maxBufferSize)}</div>
            </div>
          {/if}
          {#if gpuInfo.limits?.maxComputeInvocationsPerWorkgroup}
            <div class="gpu-panel-item">
              <div class="gpu-panel-label">Max Compute Invocations</div>
              <div class="gpu-panel-value">{gpuInfo.limits.maxComputeInvocationsPerWorkgroup}</div>
            </div>
          {/if}
          {#if gpuInfo.limits?.maxComputeWorkgroupStorageSize}
            <div class="gpu-panel-item">
              <div class="gpu-panel-label">Workgroup Storage</div>
              <div class="gpu-panel-value">{formatBytes(gpuInfo.limits.maxComputeWorkgroupStorageSize)}</div>
            </div>
          {/if}
          {#if gpuInfo.features?.length}
            <div class="gpu-panel-item full">
              <div class="gpu-panel-label">Features ({gpuInfo.features.length})</div>
              <div class="gpu-panel-features">
                {#each gpuInfo.features as feat}
                  <span class="gpu-feature-tag">{feat}</span>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <div class="messages" bind:this={chatContainer}>
      {#if messages.length === 0}
        <div class="empty">Send a message to start chatting.</div>
      {/if}

      {#each messages as msg, i}
        <div class="bubble {msg.role}">
          <div class="role">{msg.role === "user" ? "You" : "AI"}</div>

          {#if msg.role === "assistant"}
            {#if isRunning && msg === messages[messages.length - 1] && generationPhase === "thinking"}
              <div class="thinking-bar active">
                <span class="gen-dots"><span></span><span></span><span></span></span>
                <span>Thinking...</span>
                {#if numTokens}
                  <span class="thinking-tokens">{numTokens} tokens</span>
                {/if}
              </div>
            {:else if isRunning && msg === messages[messages.length - 1] && generationPhase === "preparing"}
              <div class="thinking-bar active">
                <span class="gen-dots"><span></span><span></span><span></span></span>
                <span>Preparing...</span>
              </div>
            {/if}

            {#if msg.thinking}
              <details class="thinking-details">
                <summary class="thinking-summary">
                  <span class="thinking-icon">💭</span>
                  Thinking
                  <span class="thinking-token-count">
                    {msg.thinking.split(/\s+/).length} words
                  </span>
                </summary>
                <div class="thinking-content">{msg.thinking}</div>
              </details>
            {/if}

            <div class="content">
              {#if isRunning && msg === messages[messages.length - 1] && !msg.content && generationPhase !== "thinking"}
                <div class="gen-status">
                  <span class="gen-dots"><span></span><span></span><span></span></span>
                  Generating...
                </div>
              {:else}
                {msg.content}{#if isRunning && msg === messages[messages.length - 1]}<span class="cursor">|</span>{/if}
              {/if}
            </div>
          {:else}
            <div class="content">{msg.content}</div>
          {/if}
        </div>
      {/each}
    </div>

    <div class="input-row">
      <textarea
        rows="1"
        placeholder="Type a message..."
        bind:value={input}
        onkeydown={handleKeydown}
        disabled={isRunning}
      ></textarea>
      {#if isRunning}
        <button class="btn" onclick={stop}>Stop</button>
      {:else}
        <button class="btn primary" onclick={send} disabled={!input.trim()}>Send</button>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* ── Shared ────────────────────────────────────────────────────── */
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
  .subtitle {
    color: #aaa;
    font-size: 1rem;
    line-height: 1.5;
  }
  .error {
    color: #f87171;
    font-size: 0.85rem;
  }

  /* ── Model selector ──────────────────────────────────────────────── */
  .model-selector {
    width: 100%;
    max-width: 400px;
    margin: 1.5rem 0;
    text-align: left;
  }
  .model-selector label {
    display: block;
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .model-selector select {
    width: 100%;
    padding: 0.65rem 0.8rem;
    font-size: 0.9rem;
    color: #e8e8e8;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
  }
  .model-selector select:hover {
    border-color: #4a90e2;
    background: #1f1f1f;
  }
  .model-selector select:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
  .model-description {
    font-size: 0.75rem;
    color: #777;
    margin-top: 0.4rem;
    font-style: italic;
  }

  /* ── GPU info card (landing page) ────────────────────────────────── */
  .gpu-card {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    width: 100%;
    max-width: 340px;
    text-align: left;
  }
  .gpu-card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #4ade80;
    margin-bottom: 0.5rem;
  }
  .gpu-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 6px #4ade80;
  }
  .gpu-card-body {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .gpu-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
  }
  .gpu-row span:first-child {
    color: #666;
  }
  .gpu-row span:last-child {
    color: #bbb;
    text-align: right;
  }

  /* ── GPU badge (chat header) ───────────────────────────────────── */
  .gpu-badge {
    font-size: 0.65rem;
    font-weight: 600;
    color: #4ade80;
    background: rgba(74, 222, 128, 0.1);
    border: 1px solid rgba(74, 222, 128, 0.3);
    padding: 0.2rem 0.55rem;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: background 0.15s;
  }
  .gpu-badge:hover {
    background: rgba(74, 222, 128, 0.2);
  }

  /* ── GPU detail panel (chat view) ──────────────────────────────── */
  .gpu-panel {
    background: #131313;
    border-bottom: 1px solid #1f1f1f;
    padding: 0.75rem 1rem;
    animation: slideDown 0.15s ease-out;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .gpu-panel-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem 1.5rem;
  }
  .gpu-panel-item {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
  .gpu-panel-item.full {
    grid-column: 1 / -1;
  }
  .gpu-panel-label {
    font-size: 0.65rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .gpu-panel-value {
    font-size: 0.8rem;
    color: #ccc;
  }
  .gpu-panel-value.ok {
    color: #4ade80;
    font-weight: 600;
  }
  .gpu-panel-features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-top: 0.2rem;
  }
  .gpu-feature-tag {
    font-size: 0.6rem;
    color: #888;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
  }

  /* ── Buttons ───────────────────────────────────────────────────── */
  .btn {
    padding: 0.55rem 1.2rem;
    border: 1px solid #333;
    border-radius: 8px;
    background: #1a1a1a;
    color: #e8e8e8;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn:hover:not(:disabled) {
    background: #2a2a2a;
  }
  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .btn.primary {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #fff;
  }
  .btn.primary:hover:not(:disabled) {
    background: #2563eb;
  }
  .btn.small {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }

  /* ── Loading progress ──────────────────────────────────────────── */
  .loading-container {
    max-width: 520px;
  }
  .loading-msg {
    color: #aaa;
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }
  .progress-card {
    width: 100%;
    margin-bottom: 0.75rem;
    padding: 0.75rem 1rem;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
  }
  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .progress-file {
    font-size: 0.75rem;
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
  }
  .progress-percent {
    font-size: 0.9rem;
    font-weight: 600;
    color: #3b82f6;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }
  .progress-bar {
    width: 100%;
    height: 8px;
    background: #222;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }
  .progress-fill {
    height: 100%;
    background: #3b82f6;
    border-radius: 4px;
    transition: width 0.2s;
  }
  .progress-fill.indeterminate {
    width: 30%;
    animation: slide 1.5s ease-in-out infinite;
  }
  @keyframes slide {
    0% { margin-left: 0%; }
    50% { margin-left: 70%; }
    100% { margin-left: 0%; }
  }
  .progress-numbers {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    flex-wrap: wrap;
    font-size: 0.8rem;
    color: #aaa;
    font-variant-numeric: tabular-nums;
  }
  .progress-loaded {
    color: #e8e8e8;
    font-weight: 500;
  }
  .progress-sep {
    color: #666;
  }
  .progress-total {
    color: #888;
  }
  .progress-raw {
    font-size: 0.65rem;
    color: #555;
    margin-left: 0.25rem;
  }
  .progress-indeterminate {
    color: #888;
    font-style: italic;
  }

  /* ── Chat layout ───────────────────────────────────────────────── */
  .chat-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #1f1f1f;
    flex-shrink: 0;
  }
  header h1 {
    font-size: 1.1rem;
    flex: 1;
  }
  .stats {
    font-size: 0.75rem;
    color: #888;
  }

  /* ── Messages ──────────────────────────────────────────────────── */
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .empty {
    margin: auto;
    color: #555;
    font-size: 0.95rem;
  }
  .bubble {
    max-width: 80%;
    padding: 0.7rem 1rem;
    border-radius: 12px;
    line-height: 1.55;
    font-size: 0.92rem;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .bubble.user {
    align-self: flex-end;
    background: #3b82f6;
    color: #fff;
    border-bottom-right-radius: 4px;
  }
  .bubble.assistant {
    align-self: flex-start;
    background: #1e1e1e;
    border-bottom-left-radius: 4px;
  }
  .role {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 0.25rem;
    opacity: 0.6;
  }
  .cursor {
    animation: blink 0.7s step-end infinite;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }

  /* ── Generation status indicator ─────────────────────────────── */
  .gen-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #888;
    font-size: 0.85rem;
    font-style: italic;
  }
  .gen-dots {
    display: inline-flex;
    gap: 3px;
  }
  .gen-dots span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #666;
    animation: dotPulse 1.2s ease-in-out infinite;
  }
  .gen-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }
  .gen-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }
  @keyframes dotPulse {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1.2); }
  }
  .stats.preparing {
    color: #888;
    font-style: italic;
    animation: blink 1.5s ease-in-out infinite;
  }

  /* ── Thinking bar (live indicator) ─────────────────────────── */
  .thinking-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.6rem;
    margin-bottom: 0.4rem;
    font-size: 0.8rem;
    color: #a78bfa;
    background: rgba(167, 139, 250, 0.08);
    border-radius: 6px;
    border-left: 3px solid #a78bfa;
  }
  .thinking-bar .gen-dots span {
    background: #a78bfa;
  }
  .thinking-tokens {
    margin-left: auto;
    font-size: 0.7rem;
    color: #7c6dbd;
    font-variant-numeric: tabular-nums;
  }

  /* ── Collapsible thinking section ──────────────────────────── */
  .thinking-details {
    margin-bottom: 0.4rem;
  }
  .thinking-summary {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
    font-size: 0.75rem;
    color: #7c6dbd;
    padding: 0.35rem 0.6rem;
    background: rgba(167, 139, 250, 0.06);
    border-radius: 6px;
    border-left: 3px solid rgba(167, 139, 250, 0.4);
    user-select: none;
    transition: background 0.15s;
    list-style: none;
  }
  .thinking-summary::-webkit-details-marker {
    display: none;
  }
  .thinking-summary::after {
    content: "▶";
    margin-left: auto;
    font-size: 0.6rem;
    transition: transform 0.15s;
  }
  .thinking-details[open] .thinking-summary::after {
    transform: rotate(90deg);
  }
  .thinking-summary:hover {
    background: rgba(167, 139, 250, 0.12);
  }
  .thinking-icon {
    font-size: 0.85rem;
  }
  .thinking-token-count {
    font-size: 0.65rem;
    color: #665da0;
    margin-left: 0.3rem;
  }
  .thinking-content {
    font-size: 0.75rem;
    color: #888;
    line-height: 1.5;
    padding: 0.5rem 0.6rem;
    margin-top: 0.3rem;
    background: rgba(167, 139, 250, 0.04);
    border-radius: 0 0 6px 6px;
    border-left: 3px solid rgba(167, 139, 250, 0.2);
    max-height: 300px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* ── Input row ─────────────────────────────────────────────────── */
  .input-row {
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-top: 1px solid #1f1f1f;
    flex-shrink: 0;
  }
  textarea {
    flex: 1;
    resize: none;
    border: 1px solid #333;
    border-radius: 8px;
    background: #1a1a1a;
    color: #e8e8e8;
    padding: 0.6rem 0.8rem;
    font-size: 0.92rem;
    font-family: inherit;
    line-height: 1.4;
    outline: none;
  }
  textarea:focus {
    border-color: #3b82f6;
  }
  textarea:disabled {
    opacity: 0.5;
  }
</style>
