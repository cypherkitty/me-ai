<script>
  import { onMount } from "svelte";
  import { marked } from "marked";
  import DOMPurify from "dompurify";
  import { formatDate } from "../../lib/email-utils.js";
  import { emailToMarkdown, emailFilename, downloadText } from "../../lib/markdown-export.js";
  import { mountLog } from "../../lib/debug.js";

  let { message, loading = false, onclose } = $props();

  onMount(() => mountLog("MessageModal"));

  // ── Configure marked ──────────────────────────────────────────────
  const renderer = new marked.Renderer();
  renderer.link = ({ href, title, text }) => {
    const t = title ? ` title="${title}"` : "";
    return `<a href="${href}"${t} target="_blank" rel="noopener">${text}</a>`;
  };
  marked.setOptions({ breaks: true, gfm: true, renderer });

  // ── Markdown preview state ────────────────────────────────────────
  let showMarkdown = $state(false);
  let mdTab = $state("raw"); // "raw" | "preview"

  let markdownText = $derived(message.body ? emailToMarkdown(message) : "");

  function toggleMarkdown() {
    showMarkdown = !showMarkdown;
    mdTab = "raw";
  }

  function downloadMd() {
    downloadText(markdownText, emailFilename(message));
  }

  /** Render markdown to sanitized HTML using marked + DOMPurify */
  function renderMarkdown(md) {
    const raw = marked.parse(md);
    return DOMPurify.sanitize(raw, {
      ADD_ATTR: ["target"],
      ALLOW_TAGS: [
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "br", "hr", "blockquote", "pre", "code",
        "strong", "b", "em", "i", "a", "img",
        "ul", "ol", "li",
        "table", "thead", "tbody", "tr", "th", "td",
        "del", "s",
      ],
    });
  }

  // ── Sandboxed HTML iframe ─────────────────────────────────────────
  let iframeEl = $state(null);

  $effect(() => {
    if (iframeEl && message.htmlBody && !loading && !showMarkdown) {
      // Write HTML into the sandboxed iframe
      const doc = iframeEl.contentDocument || iframeEl.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 14px;
                line-height: 1.5;
                color: #e0e0e0;
                background: #1a1a1a;
                margin: 0;
                padding: 16px;
                word-break: break-word;
              }
              a { color: #60a5fa; }
              img { max-width: 100%; height: auto; }
              table { border-collapse: collapse; max-width: 100%; }
              td, th { padding: 4px 8px; }
            </style>
          </head>
          <body>${message.htmlBody}</body>
          </html>
        `);
        doc.close();
      }
    }
  });
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
          <button
            class="action-btn"
            class:active={showMarkdown}
            onclick={toggleMarkdown}
            title="View as Markdown"
          >
            .md
          </button>
        {/if}
        <button class="modal-close" onclick={onclose}>✕</button>
      </div>
    </div>

    {#if showMarkdown}
      <!-- ── Markdown view ─────────────────────────────────────────── -->
      <div class="md-toolbar">
        <div class="md-tabs">
          <button
            class="md-tab"
            class:active={mdTab === "raw"}
            onclick={() => mdTab = "raw"}
          >Raw</button>
          <button
            class="md-tab"
            class:active={mdTab === "preview"}
            onclick={() => mdTab = "preview"}
          >Preview</button>
        </div>
        <button class="action-btn download-btn" onclick={downloadMd} title="Download .md file">
          Download
        </button>
      </div>
      <div class="md-body">
        {#if mdTab === "raw"}
          <pre class="md-raw">{markdownText}</pre>
        {:else}
          <div class="md-preview">
            {@html renderMarkdown(markdownText)}
          </div>
        {/if}
      </div>
    {:else}
      <!-- ── Email view ────────────────────────────────────────────── -->
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
        {:else if message.htmlBody}
          <iframe
            bind:this={iframeEl}
            class="html-frame"
            sandbox="allow-same-origin"
            title="Email content"
          ></iframe>
        {:else if message.body}
          <pre class="message-text">{message.body}</pre>
        {:else}
          <p class="empty-body">Loading...</p>
        {/if}
      </div>
    {/if}
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
    max-width: 780px;
    width: 100%;
    max-height: 85vh;
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
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }
  .action-btn:hover {
    border-color: #3b82f6;
    color: #e8e8e8;
  }
  .action-btn.active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #fff;
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

  /* ── Email meta ─────────────────────────────────────────────────── */
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

  /* ── Email body ─────────────────────────────────────────────────── */
  .modal-body {
    padding: 0;
    overflow-y: auto;
    flex: 1;
  }
  .html-frame {
    width: 100%;
    height: 100%;
    min-height: 400px;
    border: none;
    background: #1a1a1a;
  }
  .message-text {
    font-size: 0.85rem;
    color: #ccc;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: inherit;
    margin: 0;
    padding: 1.25rem;
  }
  .empty-body {
    color: #666;
    font-style: italic;
    padding: 1.25rem;
  }

  /* ── Markdown view ──────────────────────────────────────────────── */
  .md-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1.25rem;
    border-bottom: 1px solid #222;
    background: #131313;
  }
  .md-tabs {
    display: flex;
    gap: 0.25rem;
  }
  .md-tab {
    padding: 0.3rem 0.7rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 5px;
    color: #888;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }
  .md-tab:hover {
    color: #ccc;
  }
  .md-tab.active {
    background: #222;
    border-color: #333;
    color: #e8e8e8;
  }
  .download-btn {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
  }
  .md-body {
    overflow-y: auto;
    flex: 1;
  }
  .md-raw {
    font-size: 0.8rem;
    color: #b8b8b8;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: "SF Mono", "Fira Code", "Cascadia Code", monospace;
    margin: 0;
    padding: 1.25rem;
    background: #111;
  }
  .md-preview {
    padding: 1.25rem;
    font-size: 0.9rem;
    color: #ddd;
    line-height: 1.6;
    overflow-wrap: break-word;
    word-break: break-word;
  }
  .md-preview :global(h1) {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0.75rem 0;
    color: #e8e8e8;
  }
  .md-preview :global(h2) {
    font-size: 1.15rem;
    font-weight: 600;
    margin: 0.6rem 0;
    color: #e8e8e8;
  }
  .md-preview :global(h3) {
    font-size: 1rem;
    font-weight: 600;
    margin: 0.5rem 0;
    color: #e8e8e8;
  }
  .md-preview :global(table) {
    border-collapse: collapse;
    margin-bottom: 1rem;
    font-size: 0.82rem;
    width: auto;
  }
  .md-preview :global(th),
  .md-preview :global(td) {
    padding: 0.3rem 0.6rem;
    border: 1px solid #333;
    color: #ccc;
  }
  .md-preview :global(th) {
    background: #1e1e1e;
    font-weight: 600;
    color: #e8e8e8;
  }
  .md-preview :global(hr) {
    border: none;
    border-top: 1px solid #333;
    margin: 1rem 0;
  }
  .md-preview :global(p) {
    margin: 0.3rem 0;
  }
  .md-preview :global(strong) {
    color: #e8e8e8;
  }
  .md-preview :global(a) {
    color: #60a5fa;
    text-decoration: none;
  }
  .md-preview :global(a:hover) {
    text-decoration: underline;
  }
  .md-preview :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 0.5rem 0;
  }
  .md-preview :global(blockquote) {
    border-left: 3px solid #444;
    padding-left: 0.75rem;
    margin: 0.5rem 0;
    color: #aaa;
  }
  .md-preview :global(code) {
    background: #1e1e1e;
    padding: 0.15rem 0.35rem;
    border-radius: 3px;
    font-size: 0.85em;
  }
  .md-preview :global(pre) {
    background: #1e1e1e;
    padding: 0.75rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 0.5rem 0;
  }
  .md-preview :global(pre code) {
    background: none;
    padding: 0;
  }
  .md-preview :global(ul),
  .md-preview :global(ol) {
    padding-left: 1.5rem;
    margin: 0.3rem 0;
  }
  .md-preview :global(li) {
    margin: 0.15rem 0;
  }

  /* ── Loading ────────────────────────────────────────────────────── */
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
