<script>
  import { onMount } from "svelte";
  import { mountLog } from "../../lib/debug.js";
  let { msg, isLast = false, isRunning = false, generationPhase = null, numTokens = null } = $props();

  onMount(() => mountLog(`MessageBubble[${msg.role}]`));
</script>

<div class="bubble {msg.role}">
  <div class="role">{msg.role === "user" ? "You" : "AI"}</div>

  {#if msg.role === "assistant"}
    {#if isRunning && isLast && generationPhase === "thinking"}
      <div class="thinking-bar active">
        <span class="gen-dots"><span></span><span></span><span></span></span>
        <span>Thinking...</span>
        {#if numTokens}
          <span class="thinking-tokens">{numTokens} tokens</span>
        {/if}
      </div>
    {:else if isRunning && isLast && generationPhase === "preparing"}
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
      {#if isRunning && isLast && !msg.content && generationPhase !== "thinking"}
        <div class="gen-status">
          <span class="gen-dots"><span></span><span></span><span></span></span>
          Generating...
        </div>
      {:else}
        {msg.content}{#if isRunning && isLast}<span class="cursor">|</span>{/if}
      {/if}
    </div>
  {:else}
    <div class="content">{msg.content}</div>
  {/if}
</div>

<style>
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

  /* ── Generation status ───────────────────────────────────────────── */
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

  /* ── Thinking bar (live) ────────────────────────────────────────── */
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

  /* ── Collapsible thinking section ────────────────────────────────── */
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
</style>
