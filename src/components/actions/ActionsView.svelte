<script>
  import ScanControl from "./ScanControl.svelte";
  import ActionGroup from "./ActionGroup.svelte";
  import PromptInspector from "./PromptInspector.svelte";
  import ActionEditor from "./ActionEditor.svelte";
  import PluginRegistry from "./PluginRegistry.svelte";
  import DataManager from "./DataManager.svelte";
  import { actionColor } from "../../lib/triage.js";

  let {
    engineStatus,
    modelName,
    groups = {},
    groupOrder = [],
    counts = {},
    stats = null,
    expandedGroup = null,
    isScanning = false,
    scanProgress = null,
    scanCount = $bindable(20),
    error = null,
    onscan,
    onrescan,
    ontogglegroup,
    onmarkacted,
    ondismiss,
    onremove,
    oncleargroup,
    ondismisserror,
    onstop,
    onrefresh,
    oncloseprogress,
  } = $props();

  let showInspector = $state(false);
  let showActionEditor = $state(false);
  let showPluginRegistry = $state(false);

  /** Grab a sample email from the first group to show in the inspector */
  let sampleEmail = $derived.by(() => {
    for (const action of groupOrder) {
      const items = groups[action];
      if (items?.length > 0) return items[0];
    }
    return null;
  });
</script>

<div class="actions-container">
  <ScanControl
    {engineStatus}
    {modelName}
    {isScanning}
    {scanProgress}
    {stats}
    bind:scanCount
    {onscan}
    {onrescan}
    {onstop}
    {oncloseprogress}
    oninspect={() => showInspector = true}
  />

  <PromptInspector bind:open={showInspector} {sampleEmail} />
  <ActionEditor bind:open={showActionEditor} />
  <PluginRegistry bind:open={showPluginRegistry} />

  <div class="toolbar">
    <button class="toolbar-btn" onclick={() => showPluginRegistry = true}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
      Plugins
    </button>
    <button class="toolbar-btn" onclick={() => showActionEditor = true}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 3v18M3 12h18"/>
      </svg>
      Edit Actions
    </button>
  </div>

  {#if error}
    <div class="error-card">
      <span>{error}</span>
      <button class="error-dismiss" onclick={ondismisserror}>✕</button>
    </div>
  {/if}

  {#if counts.total > 0}
    <div class="groups-list">
      {#each groupOrder as actionId (actionId)}
        <ActionGroup
          action={actionId}
          color={actionColor(actionId)}
          count={groups[actionId]?.length || 0}
          items={groups[actionId] || []}
          expanded={expandedGroup === actionId}
          ontoggle={() => ontogglegroup(actionId)}
          {onmarkacted}
          {ondismiss}
          {onremove}
          oncleargroup={() => oncleargroup(actionId)}
        />
      {/each}
    </div>

    <div class="actions-footer">
      <span class="footer-stat">
        {counts.total} emails classified into {groupOrder.length} groups
      </span>
    </div>
  {:else if !isScanning}
    <div class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="m9 14 2 2 4-4"/>
      </svg>
      <h3>No emails classified yet</h3>
      <p>Click <strong>Scan New</strong> to classify your recent emails. The LLM will determine action types, tags, and summaries automatically.</p>
    </div>
  {/if}

  <DataManager {groupOrder} onrefresh={onrefresh} />
</div>

<style>
  .actions-container {
    max-width: 640px;
    margin: 0 auto;
    padding: 1rem;
  }

  .error-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background: rgba(248, 113, 113, 0.1);
    border: 1px solid rgba(248, 113, 113, 0.3);
    border-radius: 8px;
    margin-bottom: 0.75rem;
    font-size: 0.8rem;
    color: #f87171;
  }

  .error-dismiss {
    background: none;
    border: none;
    color: #f87171;
    cursor: pointer;
    font-size: 1rem;
    padding: 0 0.2rem;
  }

  .groups-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .actions-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid #222;
  }

  .footer-stat {
    font-size: 0.72rem;
    color: #555;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 3rem 1.5rem;
    gap: 0.6rem;
  }

  .empty-state h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #999;
  }

  .empty-state p {
    font-size: 0.82rem;
    color: #666;
    line-height: 1.5;
    max-width: 380px;
  }

  .toolbar {
    display: flex;
    justify-content: flex-end;
    gap: 0.4rem;
    margin-bottom: 0.6rem;
  }
  .toolbar-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.7rem;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 6px;
    color: #aaa;
    font-size: 0.68rem;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
  }
  .toolbar-btn:hover {
    background: #222;
    border-color: #444;
    color: #ddd;
  }
  .toolbar-btn svg {
    flex-shrink: 0;
  }
</style>
