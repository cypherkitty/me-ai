<script>
  import { pluginRegistry } from "../../lib/plugins/plugin-registry.js";

  let { open = $bindable(false) } = $props();

  // Snapshot all plugins and their handlers at open time
  const plugins = $derived.by(() => {
    if (!open) return [];
    return pluginRegistry.getAllPlugins().map(plugin => ({
      id: plugin.pluginId,
      name: plugin.serviceName,
      actions: plugin.getHandlers().map(h => ({
        id: h.actionId,
        name: h.name,
        description: h.description,
        scopes: h.requiredScopes || [],
      })),
    }));
  });

  // Icons for well-known action IDs (same map as ActionEditor)
  const ACTION_ICONS = {
    mark_read:          "✓",
    mark_unread:        "○",
    star:               "★",
    unstar:             "☆",
    trash:              "🗑",
    delete:             "✕",
    mark_spam:          "⚠",
    archive:            "↓",
    apply_label:        "🏷",
    remove_label:       "🏷",
    mark_important:     "!",
    mark_not_important: "–",
  };

  // Total action count across all plugins
  const totalActions = $derived(plugins.reduce((s, p) => s + p.actions.length, 0));

  let expandedScopes = $state(new Set());

  function toggleScopes(key) {
    const next = new Set(expandedScopes);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    expandedScopes = next;
  }

  function shortScope(scope) {
    // e.g. "https://www.googleapis.com/auth/gmail.modify" → "gmail.modify"
    return scope.replace(/^https?:\/\/[^/]+\/auth\//, "");
  }
</script>

{#if open}
  <div
    class="overlay"
    role="dialog"
    aria-label="Plugin Registry"
    tabindex="-1"
    onkeydown={(e) => e.key === "Escape" && (open = false)}
  >
    <div class="panel">

      <!-- Header -->
      <div class="panel-header">
        <div class="header-left">
          <span class="header-icon">⚙</span>
          <div>
            <h2>Plugin Registry</h2>
            <span class="subtitle">
              {plugins.length} plugin{plugins.length === 1 ? "" : "s"} · {totalActions} actions available
            </span>
          </div>
        </div>
        <button class="close-btn" onclick={() => open = false}>✕</button>
      </div>

      <!-- Body -->
      <div class="panel-body">
        {#each plugins as plugin}
          <div class="plugin-section">
            <!-- Plugin header -->
            <div class="plugin-header">
              <div class="plugin-title-row">
                <span class="plugin-name">{plugin.name}</span>
                <code class="plugin-id">{plugin.id}</code>
                <span class="plugin-status">● active</span>
              </div>
              <span class="plugin-action-count">
                {plugin.actions.length} action{plugin.actions.length === 1 ? "" : "s"}
              </span>
            </div>

            <!-- Actions table -->
            <div class="actions-table">
              {#each plugin.actions as action}
                {@const scopeKey = `${plugin.id}:${action.id}`}
                {@const scopesOpen = expandedScopes.has(scopeKey)}
                <div class="action-row">
                  <div class="action-icon" title={action.id}>
                    {ACTION_ICONS[action.id] ?? "·"}
                  </div>
                  <div class="action-body">
                    <div class="action-top">
                      <span class="action-name">{action.name}</span>
                      <code class="action-id">{action.id}</code>
                    </div>
                    <span class="action-desc">{action.description}</span>
                    {#if action.scopes.length}
                      <div class="scopes-row">
                        <button
                          class="scopes-toggle"
                          onclick={() => toggleScopes(scopeKey)}
                        >
                          {#if scopesOpen}▾{:else}▸{/if}
                          {action.scopes.length} scope{action.scopes.length === 1 ? "" : "s"}
                        </button>
                        {#if scopesOpen}
                          <div class="scopes-list">
                            {#each action.scopes as scope}
                              <span class="scope-chip" title={scope}>
                                {shortScope(scope)}
                              </span>
                            {/each}
                          </div>
                        {/if}
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}

        {#if plugins.length === 0}
          <div class="empty">No plugins registered.</div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="panel-footer">
        <span class="footer-note">
          Add plugins by extending <code>BasePlugin</code> and calling
          <code>pluginRegistry.registerPlugin()</code>
        </span>
        <button class="close-footer-btn" onclick={() => open = false}>Close</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }

  .panel {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 14px;
    width: 100%;
    max-width: 680px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ── Header ─────────────────────────────────────────────────────── */
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid #222;
    flex-shrink: 0;
  }
  .header-left {
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }
  .header-icon {
    font-size: 1.4rem;
    opacity: 0.7;
  }
  .panel-header h2 {
    font-size: 0.95rem;
    font-weight: 700;
    color: #e8e8e8;
    margin: 0 0 0.1rem;
  }
  .subtitle {
    font-size: 0.65rem;
    color: #555;
  }
  .close-btn {
    background: none;
    border: none;
    color: #555;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0.3rem 0.4rem;
    border-radius: 4px;
    transition: all 0.12s;
    font-family: inherit;
  }
  .close-btn:hover { color: #ccc; background: rgba(255,255,255,0.05); }

  /* ── Body ───────────────────────────────────────────────────────── */
  .panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem 0;
  }

  /* ── Plugin section ─────────────────────────────────────────────── */
  .plugin-section {
    margin: 0.5rem 0.75rem 1rem;
    border: 1px solid #222;
    border-radius: 10px;
    overflow: hidden;
  }
  .plugin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.55rem 0.85rem;
    background: #161616;
    border-bottom: 1px solid #222;
  }
  .plugin-title-row {
    display: flex;
    align-items: center;
    gap: 0.55rem;
  }
  .plugin-name {
    font-size: 0.82rem;
    font-weight: 700;
    color: #e0e0e0;
  }
  .plugin-id {
    font-size: 0.62rem;
    color: #3b82f6;
    background: rgba(59,130,246,0.1);
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 4px;
    padding: 0.05rem 0.35rem;
    font-family: 'Courier New', monospace;
  }
  .plugin-status {
    font-size: 0.6rem;
    font-weight: 600;
    color: #34d399;
    letter-spacing: 0.02em;
  }
  .plugin-action-count {
    font-size: 0.62rem;
    color: #555;
  }

  /* ── Actions table ──────────────────────────────────────────────── */
  .actions-table {
    display: flex;
    flex-direction: column;
  }
  .action-row {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    padding: 0.55rem 0.85rem;
    border-bottom: 1px solid #181818;
    transition: background 0.12s;
  }
  .action-row:last-child { border-bottom: none; }
  .action-row:hover { background: rgba(255,255,255,0.02); }

  .action-icon {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 7px;
    font-size: 0.85rem;
    color: #999;
    margin-top: 0.1rem;
  }

  .action-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .action-top {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .action-name {
    font-size: 0.75rem;
    font-weight: 600;
    color: #ddd;
  }
  .action-id {
    font-size: 0.6rem;
    color: #666;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 3px;
    padding: 0.05rem 0.3rem;
    font-family: 'Courier New', monospace;
  }
  .action-desc {
    font-size: 0.65rem;
    color: #666;
    line-height: 1.4;
  }

  /* ── Scopes ─────────────────────────────────────────────────────── */
  .scopes-row {
    margin-top: 0.15rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .scopes-toggle {
    background: none;
    border: none;
    color: #444;
    font-size: 0.58rem;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    text-align: left;
    transition: color 0.12s;
  }
  .scopes-toggle:hover { color: #777; }
  .scopes-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
  }
  .scope-chip {
    font-size: 0.55rem;
    font-family: 'Courier New', monospace;
    color: #888;
    background: rgba(59,130,246,0.07);
    border: 1px solid rgba(59,130,246,0.15);
    border-radius: 3px;
    padding: 0.08rem 0.35rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 260px;
  }

  /* ── Footer ─────────────────────────────────────────────────────── */
  .panel-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1rem;
    border-top: 1px solid #1e1e1e;
    flex-shrink: 0;
    gap: 1rem;
  }
  .footer-note {
    font-size: 0.6rem;
    color: #444;
    line-height: 1.5;
  }
  .footer-note code {
    color: #3b82f6;
    font-family: 'Courier New', monospace;
  }
  .close-footer-btn {
    flex-shrink: 0;
    padding: 0.3rem 0.75rem;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 6px;
    color: #aaa;
    font-size: 0.65rem;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.12s;
  }
  .close-footer-btn:hover { background: #222; border-color: #444; color: #ddd; }

  .empty {
    padding: 2rem;
    text-align: center;
    color: #444;
    font-size: 0.78rem;
  }
</style>
