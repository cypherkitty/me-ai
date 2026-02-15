<script>
  import { onMount } from "svelte";
  import { parseError } from "../../lib/error-parser.js";
  import { mountLog } from "../../lib/debug.js";

  let { error, ondismiss = null, onsignout = null } = $props();

  let parsed = $derived(parseError(error));

  onMount(() => mountLog("ErrorCard"));
</script>

<div class="error-card">
  {#if ondismiss}
    <div class="error-card-header">
      <div class="error-card-title">{parsed.title}</div>
      <button class="error-dismiss" onclick={ondismiss}>✕</button>
    </div>
  {:else}
    <div class="error-card-title">{parsed.title}</div>
  {/if}
  <p class="error-card-desc">{parsed.description}</p>
  {#if parsed.fix}
    <p class="error-card-fix">{parsed.fix}</p>
  {/if}
  {#if parsed.link}
    <a class="error-card-link" href={parsed.link.url} target="_blank" rel="noopener">
      {parsed.link.label} →
    </a>
  {/if}
  {#if parsed.action === "signout" && onsignout}
    <button class="btn small error-action" onclick={onsignout}>Sign Out & Retry</button>
  {/if}
</div>

<style>
  .error-card {
    background: rgba(248, 113, 113, 0.06);
    border: 1px solid rgba(248, 113, 113, 0.25);
    border-left: 4px solid #f87171;
    border-radius: 8px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
  }
  .error-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .error-card-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: #f87171;
    margin-bottom: 0.35rem;
  }
  .error-dismiss {
    background: none;
    border: none;
    color: #666;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.1rem;
    line-height: 1;
    flex-shrink: 0;
  }
  .error-dismiss:hover {
    color: #f87171;
  }
  .error-card-desc {
    font-size: 0.82rem;
    color: #ccc;
    line-height: 1.5;
    margin-bottom: 0.35rem;
  }
  .error-card-fix {
    font-size: 0.8rem;
    color: #4ade80;
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }
  .error-card-link {
    display: inline-block;
    font-size: 0.82rem;
    color: #60a5fa;
    text-decoration: none;
    font-weight: 500;
    margin-bottom: 0.3rem;
  }
  .error-card-link:hover {
    text-decoration: underline;
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
  .btn:hover:not(:disabled) {
    background: #2a2a2a;
  }
  .btn.small {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }
  .error-action {
    margin-top: 0.5rem;
    border-color: rgba(248, 113, 113, 0.4);
    color: #f87171;
  }
  .error-action:hover:not(:disabled) {
    background: rgba(248, 113, 113, 0.1);
  }
</style>
