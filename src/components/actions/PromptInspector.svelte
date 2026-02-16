<script>
  import { SYSTEM_PROMPT, CLASSIFICATION_CONFIG, formatEmailPrompt } from "../../lib/triage.js";

  let { open = $bindable(false), sampleEmail = null } = $props();

  let activeTab = $state("system");

  function samplePrompt() {
    if (sampleEmail) return formatEmailPrompt(sampleEmail);
    return [
      "Subject: Your order has shipped!",
      "From: orders@example.com",
      "To: me",
      "Date: Sat, Feb 15, 2026",
      "Labels: INBOX, CATEGORY_UPDATES",
      "",
      "Hi! Your order #12345 has shipped via FedEx. Tracking number: 7891011...",
    ].join("\n");
  }

  function close() {
    open = false;
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) close();
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="backdrop" onclick={handleBackdrop} onkeydown={(e) => e.key === "Escape" && close()}>
    <div class="modal" role="dialog" aria-label="Prompt Inspector">
      <div class="modal-header">
        <h2>Prompt Inspector</h2>
        <button class="close-btn" onclick={close} aria-label="Close">✕</button>
      </div>

      <div class="tabs">
        <button
          class="tab" class:active={activeTab === "system"}
          onclick={() => activeTab = "system"}
        >System Prompt</button>
        <button
          class="tab" class:active={activeTab === "email"}
          onclick={() => activeTab = "email"}
        >Email Template</button>
        <button
          class="tab" class:active={activeTab === "config"}
          onclick={() => activeTab = "config"}
        >Generation Config</button>
      </div>

      <div class="modal-body">
        {#if activeTab === "system"}
          <div class="section-desc">
            This is the system prompt sent to the LLM before each email. It instructs the model
            on how to classify emails and what JSON format to produce.
          </div>
          <pre class="code-block">{SYSTEM_PROMPT}</pre>

        {:else if activeTab === "email"}
          <div class="section-desc">
            Each email is formatted into this template and sent as the user message.
            The full email body is included.
          </div>
          <div class="template-format">
            <div class="format-label">Format:</div>
            <pre class="code-block template">Subject: {"{email.subject}"}
From: {"{email.from}"}
To: {"{email.to}"}
Date: {"{formatted date}"}
Labels: {"{email.labels}"}

{"{email.body (full content)"}</pre>
          </div>
          <div class="template-format">
            <div class="format-label">Sample:</div>
            <pre class="code-block sample">{samplePrompt()}</pre>
          </div>

        {:else if activeTab === "config"}
          <div class="section-desc">
            These generation parameters control how the LLM produces its output
            for email classification.
          </div>
          <div class="config-grid">
            <div class="config-row">
              <span class="config-key">max_new_tokens</span>
              <span class="config-val">{CLASSIFICATION_CONFIG.maxTokens}</span>
              <span class="config-desc">Maximum tokens in the response (classification needs ~150)</span>
            </div>
            <div class="config-row">
              <span class="config-key">enable_thinking</span>
              <span class="config-val">{CLASSIFICATION_CONFIG.enableThinking ? "true" : "false"}</span>
              <span class="config-desc">Thinking mode disabled — structured JSON doesn't need reasoning</span>
            </div>
            <div class="config-row">
              <span class="config-key">do_sample</span>
              <span class="config-val">{CLASSIFICATION_CONFIG.doSample ? "true" : "false"}</span>
              <span class="config-desc">Greedy decoding — deterministic, consistent output</span>
            </div>
          </div>

          <div class="section-desc" style="margin-top: 1rem;">
            The full message array sent to the model:
          </div>
          <pre class="code-block">[
  {"{"} role: "system", content: SYSTEM_PROMPT {"}"},
  {"{"} role: "user",   content: formatEmailPrompt(email) {"}"}
]</pre>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }

  .modal {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 14px;
    width: min(600px, 92vw);
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1rem 0.6rem;
    border-bottom: 1px solid #222;
  }

  .modal-header h2 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #e8e8e8;
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    color: #666;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    transition: color 0.15s, background 0.15s;
  }
  .close-btn:hover {
    color: #ccc;
    background: #2a2a2a;
  }

  .tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid #222;
    padding: 0 1rem;
  }

  .tab {
    padding: 0.5rem 0.8rem;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: #666;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }
  .tab:hover { color: #aaa; }
  .tab.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }

  .modal-body {
    padding: 1rem;
    overflow-y: auto;
    flex: 1;
  }

  .section-desc {
    font-size: 0.78rem;
    color: #888;
    line-height: 1.5;
    margin-bottom: 0.75rem;
  }

  .code-block {
    background: #0d0d0d;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 0.75rem;
    font-family: "SF Mono", "Fira Code", "Cascadia Code", monospace;
    font-size: 0.72rem;
    line-height: 1.55;
    color: #c9d1d9;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-x: auto;
  }

  .code-block.template { color: #7dd3fc; }
  .code-block.sample { color: #a5b4fc; }

  .template-format {
    margin-bottom: 0.75rem;
  }

  .format-label {
    font-size: 0.72rem;
    font-weight: 600;
    color: #999;
    margin-bottom: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .config-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .config-row {
    display: grid;
    grid-template-columns: 140px 60px 1fr;
    gap: 0.5rem;
    align-items: baseline;
    padding: 0.4rem 0.6rem;
    background: #0d0d0d;
    border: 1px solid #222;
    border-radius: 6px;
  }

  .config-key {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 0.72rem;
    color: #7dd3fc;
  }

  .config-val {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 0.72rem;
    color: #fbbf24;
    font-weight: 600;
  }

  .config-desc {
    font-size: 0.7rem;
    color: #666;
  }
</style>
