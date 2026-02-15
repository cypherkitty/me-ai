<script>
  import { formatBytesPrecise, progressPct } from "../../lib/format.js";

  let { message = "", items = [] } = $props();
</script>

<div class="container center loading-container">
  <h1>me-ai</h1>
  <p class="loading-msg">{message}</p>
  {#each items as item}
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

<style>
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
</style>
