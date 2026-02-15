<script>
  import { onMount } from "svelte";
  import { formatDate } from "../../lib/email-utils.js";
  import { emailToMarkdown, emailFilename, downloadText } from "../../lib/markdown-export.js";
  import { mountLog } from "../../lib/debug.js";

  let { message, loading = false, onclose } = $props();

  onMount(() => mountLog("MessageModal"));

  function exportMarkdown() {
    const md = emailToMarkdown(message);
    const filename = emailFilename(message);
    downloadText(md, filename);
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<div class="modal-overlay" onclick={onclose} role="dialog" aria-modal="true">
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="modal-content" onclick={(e) => e.stopPropagation()} role="document">
    <div class="modal-header">
      <h3 class="modal-subject">{message.subject}</h3>
      <div class="header-actions">
        {#if message.body}
          <button class="action-btn" onclick={exportMarkdown} title="Export as Markdown">
            .md
          </button>
        {/if}
        <button class="modal-close" onclick={onclose}>✕</button>
      </div>
    </div>
    <div class="modal-meta">
      <div class="meta-row">
        <span class="meta-label">From:</span>
        <span>{message.from}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">To:</span>
        <span>{message.to}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Date:</span>
        <span>{formatDate(message.date)}</span>
      </div>
    </div>
    <div class="modal-body">
      {#if loading}
        <div class="loading-state">
          <span class="spinner"></span>
          <span>Loading message...</span>
        </div>
      {:else if message.body}
        <pre class="message-text">{message.body}</pre>
      {:else}
        <p class="empty-body">Loading...</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1rem;
  }
  .modal-content {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    max-width: 720px;
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.25rem 0.75rem;
    border-bottom: 1px solid #222;
  }
  .modal-subject {
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.4;
  }
  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;
  }
  .action-btn {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 5px;
    color: #aaa;
    font-size: 0.7rem;
    font-weight: 600;
    font-family: monospace;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    transition: border-color 0.15s, color 0.15s;
  }
  .action-btn:hover {
    border-color: #3b82f6;
    color: #e8e8e8;
  }
  .modal-close {
    background: none;
    border: none;
    color: #888;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.2rem;
    line-height: 1;
    flex-shrink: 0;
  }
  .modal-close:hover {
    color: #e8e8e8;
  }
  .modal-meta {
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid #222;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .meta-row {
    display: flex;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #ccc;
    line-height: 1.4;
  }
  .meta-label {
    color: #666;
    flex-shrink: 0;
    min-width: 3rem;
  }
  .modal-body {
    padding: 1.25rem;
    overflow-y: auto;
    flex: 1;
  }
  .message-text {
    font-size: 0.85rem;
    color: #ccc;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: inherit;
    margin: 0;
  }
  .empty-body {
    color: #666;
    font-style: italic;
  }
  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 3rem 1rem;
    color: #888;
    font-size: 0.9rem;
  }
  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid #333;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
