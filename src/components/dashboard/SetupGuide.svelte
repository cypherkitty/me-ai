<script>
  let { clientIdInput = $bindable(), onsave } = $props();
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
          Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener">
            Google Cloud Console
          </a> and create a project (or use existing)
        </div>
      </div>
      <div class="step">
        <span class="step-num">2</span>
        <div>
          Enable the <strong>Gmail API</strong> under
          <em>APIs & Services → Library</em>
        </div>
      </div>
      <div class="step">
        <span class="step-num">3</span>
        <div>
          Go to <em>APIs & Services → Credentials</em> and create an
          <strong>OAuth 2.0 Client ID</strong> (type: Web application)
        </div>
      </div>
      <div class="step">
        <span class="step-num">4</span>
        <div>
          Add these to your OAuth client:
          <ul>
            <li>Authorized JavaScript origins: <code>http://localhost:5173</code></li>
            <li>Authorized redirect URIs: <code>http://localhost:5173</code></li>
          </ul>
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
    max-width: 560px;
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
    gap: 0.75rem;
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
  .step ul {
    margin: 0.3rem 0 0 1rem;
    list-style: disc;
  }
  .step li {
    margin-bottom: 0.2rem;
  }
  .step code {
    background: #222;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    font-size: 0.8rem;
    color: #e8e8e8;
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
