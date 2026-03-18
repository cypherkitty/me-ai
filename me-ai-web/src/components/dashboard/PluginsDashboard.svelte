<script lang="ts">
  import { getCore } from "../../lib/store/core-store.js";
  
  import { SvelteSet } from "svelte/reactivity";

  interface PluginRegistryAction {
    actionId?: string;
    name?: string;
    description?: string;
    requiredScopes?: string[];
  }
  interface PluginRegistryEntry {
    pluginId?: string;
    pluginName?: string;
    actions?: PluginRegistryAction[];
  }

  const plugins = $derived.by(() => {
    try {
      const raw = getCore().getPluginRegistry() as PluginRegistryEntry[];
      if (!Array.isArray(raw)) return [];
      return raw.map((plugin) => ({
        id: plugin.pluginId ?? "",
        name: plugin.pluginName ?? "",
        actions: (plugin.actions ?? []).map((h) => ({
          id: h.actionId ?? "",
          name: h.name ?? "",
          description: h.description ?? "",
          scopes: h.requiredScopes || [],
        })),
      }));
    } catch {
      return [];
    }
  });

  const totalActions = $derived(plugins.reduce((s, p) => s + p.actions.length, 0));

  const ACTION_ICONS: Record<string, string> = {
    mark_read: "✓",
    mark_unread: "○",
    star: "★",
    unstar: "☆",
    trash: "🗑",
    delete: "✕",
    mark_spam: "⚠",
    archive: "↓",
    apply_label: "🏷",
    remove_label: "🏷",
    mark_important: "!",
    mark_not_important: "–",
    read_file: "📄",
    write_file: "✏",
    list_dir: "📁",
    create_file: "➕",
    delete_file: "🗑",
  };

  const expandedScopes = new SvelteSet<string>();
  const expandedPlugins = new SvelteSet<string>();

  function togglePlugin(pluginId: string) {
    if (expandedPlugins.has(pluginId)) expandedPlugins.delete(pluginId);
    else expandedPlugins.add(pluginId);
  }

  function toggleScopes(key: string) {
    if (expandedScopes.has(key)) expandedScopes.delete(key);
    else expandedScopes.add(key);
  }

  function shortScope(scope: string) {
    return scope.replace(/^https?:\/\/[^/]+\/auth\//, "");
  }
</script>

<div class="flex flex-col h-full overflow-hidden">
  <div class="px-6 pt-5 pb-4 shrink-0 border-b border-border">
    <h1 class="text-sm font-semibold tracking-tight text-foreground">Plugin Registry</h1>
    <p class="text-xs text-muted-foreground mt-1">
      {plugins.length} plugin{plugins.length === 1 ? "" : "s"} · {totalActions} actions available.
      No LLM required to view or configure.
    </p>
  </div>

  <div class="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
    <div class="flex flex-col gap-4 py-4">
      {#each plugins as plugin (plugin.id)}
        {@const isExpanded = expandedPlugins.has(plugin.id)}
        <div class="rounded-lg border border-border bg-card overflow-hidden">
          <button
            type="button"
            class="flex items-center justify-between w-full px-4 py-3 bg-muted/30 border-b border-border hover:bg-muted/50 transition-colors text-left"
            onclick={() => togglePlugin(plugin.id)}
          >
            <div class="flex items-center gap-2">
              <span class="text-[0.7rem] text-muted-foreground w-4 shrink-0">
                {isExpanded ? "▾" : "▸"}
              </span>
              <span class="text-sm font-semibold text-foreground">{plugin.name}</span>
              <code class="text-[0.65rem] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                {plugin.id}
              </code>
              <span class="text-[0.6rem] font-medium text-success">● active</span>
            </div>
            <span class="text-xs text-muted-foreground">
              {plugin.actions.length} action{plugin.actions.length === 1 ? "" : "s"}
            </span>
          </button>

          {#if isExpanded}
          <div class="divide-y divide-border">
            {#each plugin.actions as action (action.id)}
              {@const scopeKey = `${plugin.id}:${action.id}`}
              {@const scopesOpen = expandedScopes.has(scopeKey)}
              <div class="flex items-start gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors">
                <div
                  class="size-8 rounded flex items-center justify-center text-sm shrink-0 bg-muted"
                >
                  {ACTION_ICONS[action.id] ?? "·"}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-sm font-medium text-foreground">{action.name}</span>
                    <code class="text-[0.6rem] text-muted-foreground font-mono">{action.id}</code>
                  </div>
                  <p class="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                  {#if action.scopes.length}
                    <div class="mt-1.5">
                      <button
                        type="button"
                        class="text-[0.6rem] text-muted-foreground hover:text-foreground"
                        onclick={() => toggleScopes(scopeKey)}
                      >
                        {#if scopesOpen}▾{:else}▸{/if}
                        {action.scopes.length} scope{action.scopes.length === 1 ? "" : "s"}
                      </button>
                      {#if scopesOpen}
                        <div class="flex flex-wrap gap-1 mt-1">
                          {#each action.scopes as scope (scope)}
                            <span
                              class="text-[0.55rem] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary"
                              title={scope}
                            >
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

          {/if}
        </div>
      {/each}

      {#if plugins.length === 0}
        <div class="py-12 text-center text-muted-foreground text-sm">
          No plugins registered. Add plugins in <code class="bg-muted px-1 rounded">me-ai-core/src/plugins</code>.
        </div>
      {/if}
    </div>
  </div>
</div>
