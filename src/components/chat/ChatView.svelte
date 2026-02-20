<script>
  import { onMount } from "svelte";
  import MessageBubble from "./MessageBubble.svelte";
  import EventMessage from "./EventMessage.svelte";
  import ActionDashboard from "./ActionDashboard.svelte";
  import QuickActions from "./QuickActions.svelte";
  import GpuPanel from "./GpuPanel.svelte";
  import { mountLog } from "../../lib/debug.js";

  onMount(() => mountLog("ChatView"));

  let {
    messages = [],
    pendingData = null,
    hasScanData = false,
    engineReady = false,
    isScanning = false,
    isRunning = false,
    tps = null,
    numTokens = null,
    generationPhase = null,
    gpuInfo = null,
    backend = "webgpu",
    chatContainer = $bindable(),
    onsend,
    onstop,
    onreset,
    onmarkacted,
    ondismiss,
    onremove,
    oncleargroup,
    onscan,
    oncommand,
  } = $props();

  let input = $state("");
  let showGpuPanel = $state(false);

  function handleKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text || isRunning) return;
    input = "";
    onsend(text);
  }

  function handleAskAI(question) {
    if (question && !isRunning) {
      onsend(question);
    }
  }
</script>

<div class="chat-wrapper">
  <header>
    {#if gpuInfo}
      <button class="gpu-badge" onclick={() => showGpuPanel = !showGpuPanel}>
        WebGPU {showGpuPanel ? "▲" : "▼"}
      </button>
    {:else if backend === "ollama"}
      <span class="backend-badge ollama">🦙 Ollama</span>
    {:else if backend === "openai"}
      <span class="backend-badge openai">⚡ OpenAI</span>
    {:else if backend === "anthropic"}
      <span class="backend-badge anthropic">🧠 Anthropic</span>
    {:else if backend === "google"}
      <span class="backend-badge google">🔍 Google</span>
    {:else if backend === "xai"}
      <span class="backend-badge xai">✖️ xAI</span>
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
    <span class="spacer"></span>
    <button class="btn small" onclick={onreset} disabled={isRunning}>Reset</button>
  </header>

  {#if showGpuPanel && gpuInfo}
    <GpuPanel {gpuInfo} />
  {/if}

  <div class="messages" bind:this={chatContainer}>
    {#if messages.length === 0 && !(pendingData && pendingData.total > 0)}
      <div class="empty">Send a message to start chatting.</div>
    {/if}

    {#each messages as msg, i}
      {#if msg.type === "dashboard"}
        <ActionDashboard
          pendingData={msg.pendingData}
          {onmarkacted}
          {ondismiss}
          {onremove}
          {oncleargroup}
          onaskai={handleAskAI}
        />
      {:else if msg.type === "event" || msg.type === "event-batch" || msg.type === "events-grouped"}
        <EventMessage {msg} {oncommand} />
      {:else}
        <MessageBubble
          {msg}
          isLast={i === messages.length - 1}
          {isRunning}
          {generationPhase}
          {numTokens}
        />
      {/if}
    {/each}
  </div>

  <QuickActions
    {hasScanData}
    {engineReady}
    {isScanning}
    {onscan}
  />

  <div class="input-row">
    <textarea
      rows="1"
      placeholder="Type a message..."
      bind:value={input}
      onkeydown={handleKeydown}
      disabled={isRunning}
    ></textarea>
    {#if isRunning}
      <button class="btn" onclick={onstop}>Stop</button>
    {:else}
      <button class="btn primary" onclick={handleSend} disabled={!input.trim()}>Send</button>
    {/if}
  </div>
</div>

<style>
  .chat-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #1f1f1f;
    flex-shrink: 0;
  }
  .spacer {
    flex: 1;
  }
  .stats {
    font-size: 0.75rem;
    color: #888;
  }
  .stats.preparing {
    color: #888;
    font-style: italic;
    animation: blink 1.5s ease-in-out infinite;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }

  /* ── GPU badge ───────────────────────────────────────────────────── */
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

  .backend-badge {
    font-size: 0.65rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .backend-badge.ollama {
    color: #a78bfa;
    background: rgba(167, 139, 250, 0.1);
    border: 1px solid rgba(167, 139, 250, 0.3);
  }
  .backend-badge.openai {
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  .backend-badge.anthropic {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
  }
  .backend-badge.google {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
  .backend-badge.xai {
    color: #e8e8e8;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  /* ── Messages ────────────────────────────────────────────────────── */
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

  /* ── Buttons ─────────────────────────────────────────────────────── */
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

  /* ── Input row ───────────────────────────────────────────────────── */
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
