<script>
  import { onMount } from "svelte";
  import ErrorCard from "../shared/ErrorCard.svelte";
  import { mountLog } from "../../lib/debug.js";

  let { clientId, error = null, loadingAuth = false, onsignin, onclear, onsignout } = $props();

  onMount(() => mountLog("AuthCard"));
</script>

<div class="auth-container">
  <div class="auth-card">
    <h2>Gmail Dashboard</h2>
    <p class="auth-desc">
      Sign in with your Google account to browse your Gmail messages.
      Read-only access — nothing is modified.
    </p>

    {#if error}
      <ErrorCard {error} {onsignout} />
    {/if}

    <button class="btn google-btn" onclick={onsignin} disabled={loadingAuth}>
      {#if loadingAuth}
        <span class="spinner"></span> Signing in...
      {:else}
        <svg viewBox="0 0 24 24" width="18" height="18" class="google-icon">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      {/if}
    </button>

    <div class="client-id-info">
      <span class="client-id-label">Client ID:</span>
      <span class="client-id-value">{clientId.slice(0, 20)}...</span>
      <button class="btn-link" onclick={onclear}>Change</button>
    </div>
  </div>
</div>

<style>
  .auth-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    padding: 2rem;
  }
  .auth-card {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 2rem;
    max-width: 560px;
    width: 100%;
  }
  .auth-card h2 {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }
  .auth-desc {
    color: #999;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  /* ── Google button ───────────────────────────────────────────────── */
  .google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
    font-weight: 500;
    background: #fff;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s, box-shadow 0.15s;
  }
  .google-btn:hover:not(:disabled) {
    background: #f8f8f8;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
  .google-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .google-icon {
    flex-shrink: 0;
  }
  .client-id-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    font-size: 0.75rem;
    color: #666;
  }
  .client-id-value {
    font-family: monospace;
    color: #888;
  }
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
  .btn-link {
    background: none;
    border: none;
    color: #60a5fa;
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0;
  }
  .btn-link:hover {
    text-decoration: underline;
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
