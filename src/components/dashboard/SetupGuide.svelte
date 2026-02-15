<script>
  import { onMount } from "svelte";
  import { mountLog } from "../../lib/debug.js";

  let { clientIdInput = $bindable(), onsave } = $props();

  onMount(() => mountLog("SetupGuide"));

  let copiedField = $state(null);

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      copiedField = text;
      setTimeout(() => { copiedField = null; }, 1500);
    } catch {
      // fallback: select text in a temp input
      const el = document.createElement("input");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      copiedField = text;
      setTimeout(() => { copiedField = null; }, 1500);
    }
  }

  const LOCALHOST = "http://localhost:5173";
  const PAGES = "https://cypherkitty.github.io";
</script>

<div class="setup-container">
  <div class="setup-card">
    <h2>Connect Gmail</h2>
    <p class="setup-intro">
      To access Gmail from the browser, you need a Google Cloud OAuth Client ID.
      This stays in your browser — no data is sent to any server.
    </p>

    <div class="setup-steps">
      <div class="step">
        <span class="step-num">1</span>
        <div>
          <a href="https://console.cloud.google.com/projectcreate" target="_blank" rel="noopener">
            Create a Google Cloud project
          </a>
          (or use an existing one)
        </div>
      </div>

      <div class="step">
        <span class="step-num">2</span>
        <div>
          <a href="https://console.cloud.google.com/apis/library/gmail.googleapis.com" target="_blank" rel="noopener">
            Enable the Gmail API
          </a>
          for your project
        </div>
      </div>

      <div class="step">
        <span class="step-num">3</span>
        <div>
          <a href="https://console.cloud.google.com/apis/credentials/oauthclient" target="_blank" rel="noopener">
            Create an OAuth 2.0 Client ID
          </a>
          (type: <strong>Web application</strong>)
        </div>
      </div>

      <div class="step">
        <span class="step-num">4</span>
        <div>
          <p class="step-label">Add these URLs to your OAuth client. Click to copy:</p>

          <div class="url-section">
            <span class="url-section-title">Authorized JavaScript origins:</span>
            <div class="url-chips">
              <button class="url-chip" onclick={() => copy(LOCALHOST)}>
                <code>{LOCALHOST}</code>
                <span class="copy-icon">{copiedField === LOCALHOST ? "✓" : "⧉"}</span>
              </button>
              <button class="url-chip" onclick={() => copy(PAGES)}>
                <code>{PAGES}</code>
                <span class="copy-icon">{copiedField === PAGES ? "✓" : "⧉"}</span>
              </button>
            </div>
          </div>

          <div class="url-section">
            <span class="url-section-title">Authorized redirect URIs:</span>
            <div class="url-chips">
              <button class="url-chip" onclick={() => copy(LOCALHOST)}>
                <code>{LOCALHOST}</code>
                <span class="copy-icon">{copiedField === LOCALHOST ? "✓" : "⧉"}</span>
              </button>
              <button class="url-chip" onclick={() => copy(PAGES)}>
                <code>{PAGES}</code>
                <span class="copy-icon">{copiedField === PAGES ? "✓" : "⧉"}</span>
              </button>
            </div>
          </div>

          <p class="step-hint">
            Both localhost (for development) and GitHub Pages (for production) are needed.
          </p>
        </div>
      </div>

      <div class="step">
        <span class="step-num">5</span>
        <div>Copy the <strong>Client ID</strong> and paste it below</div>
      </div>
    </div>

    <div class="client-id-form">
      <input
        type="text"
        placeholder="xxxx.apps.googleusercontent.com"
        bind:value={clientIdInput}
        onkeydown={(e) => e.key === "Enter" && onsave()}
      />
      <button class="btn primary" onclick={onsave} disabled={!clientIdInput.trim()}>
        Save
      </button>
    </div>
  </div>
</div>

<style>
  .setup-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    padding: 2rem;
  }
  .setup-card {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 2rem;
    max-width: 580px;
    width: 100%;
  }
  .setup-card h2 {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }
  .setup-intro {
    color: #999;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  /* ── Steps ───────────────────────────────────────────────────────── */
  .setup-steps {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-bottom: 1.5rem;
  }
  .step {
    display: flex;
    gap: 0.75rem;
    font-size: 0.85rem;
    color: #ccc;
    line-height: 1.5;
  }
  .step a {
    color: #60a5fa;
    text-decoration: none;
    font-weight: 500;
  }
  .step a:hover {
    text-decoration: underline;
  }
  .step-num {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #3b82f6;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    margin-top: 0.05rem;
  }
  .step-label {
    margin-bottom: 0.5rem;
    color: #aaa;
  }
  .step-hint {
    font-size: 0.75rem;
    color: #666;
    margin-top: 0.5rem;
    font-style: italic;
  }

  /* ── URL sections ────────────────────────────────────────────────── */
  .url-section {
    margin-bottom: 0.6rem;
  }
  .url-section-title {
    display: block;
    font-size: 0.75rem;
    color: #888;
    margin-bottom: 0.3rem;
  }
  .url-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .url-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.6rem;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    font-family: inherit;
    color: inherit;
  }
  .url-chip:hover {
    border-color: #4a90e2;
    background: #1f1f1f;
  }
  .url-chip code {
    font-size: 0.78rem;
    color: #e8e8e8;
    background: none;
    padding: 0;
  }
  .copy-icon {
    font-size: 0.75rem;
    color: #666;
    transition: color 0.15s;
  }
  .url-chip:hover .copy-icon {
    color: #60a5fa;
  }

  /* ── Client ID Form ──────────────────────────────────────────────── */
  .client-id-form {
    display: flex;
    gap: 0.5rem;
  }
  .client-id-form input {
    flex: 1;
    padding: 0.6rem 0.8rem;
    border: 1px solid #333;
    border-radius: 8px;
    background: #1a1a1a;
    color: #e8e8e8;
    font-size: 0.85rem;
    font-family: monospace;
    outline: none;
  }
  .client-id-form input:focus {
    border-color: #3b82f6;
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
</style>
