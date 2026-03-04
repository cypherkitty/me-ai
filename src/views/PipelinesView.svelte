<script lang="ts">
  import { onMount } from "svelte";
  import {
    getCategoryPipelines,
    updateCategoryPipeline,
    updateCategoryPolicy,
    moveEventTypeToCategory,
    getActions,
    getPlugins,
  } from "../lib/rules.js";
  import { EVENT_CATEGORIES, EXECUTION_POLICIES } from "../lib/events.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { cn } from "$lib/utils.js";
  import {
    ChevronDown,
    ChevronRight,
    GripVertical,
    Plus,
    Trash2,
    X,
    Layers,
    Shield,
  } from "lucide-svelte";

  interface CatPipeline {
    category: string;
    label: string;
    priority: number;
    policy: string;
    actions: Array<{ pluginId: string; commandId: string; order: number }>;
    eventTypes: Array<{
      name: string;
      label: string;
      autoCreated: boolean;
    }>;
  }

  let categories = $state<CatPipeline[]>([]);
  let loading = $state(true);
  let expanded = $state<Record<string, boolean>>({});
  let editingCategory = $state<string | null>(null);

  // Available actions from plugins for the action picker
  let availableActions = $state<
    Array<{ pluginId: string; commandId: string; label: string }>
  >([]);

  const catColors: Record<string, string> = {
    noise: "#6b7280",
    informational: "#3b82f6",
    important: "#d97706",
    urgent: "#ef4444",
  };

  const catIcons: Record<string, string> = {
    noise: "🗑",
    informational: "📋",
    important: "⭐",
    urgent: "🚨",
  };

  const policyLabels: Record<string, string> = {
    auto: "Auto-execute",
    supervised: "Execute & notify",
    manual: "User approval",
  };

  onMount(load);

  async function load() {
    loading = true;
    try {
      categories = (await getCategoryPipelines()) as CatPipeline[];

      // Build available actions list from plugins
      const plugins = (await getPlugins()) as any[];
      const allActions: Array<{
        pluginId: string;
        commandId: string;
        label: string;
      }> = [];
      for (const p of plugins) {
        if (!p.enabled) continue;
        for (const a of p.actions || []) {
          allActions.push({
            pluginId: p.name,
            commandId: `${p.name.replace("_plugin", "")}:${a}`,
            label: `${p.label}: ${a}`,
          });
        }
      }
      availableActions = allActions;
    } catch (e) {
      console.error("Failed to load category pipelines:", e);
    } finally {
      loading = false;
    }
  }

  function toggleExpand(cat: string) {
    expanded = { ...expanded, [cat]: !expanded[cat] };
  }

  async function handlePolicyChange(cat: string, newPolicy: string) {
    await updateCategoryPolicy(cat, newPolicy);
    await load();
  }

  async function removeAction(cat: string, idx: number) {
    const c = categories.find((c) => c.category === cat);
    if (!c) return;
    const updated = c.actions.filter((_, i) => i !== idx);
    await updateCategoryPipeline(
      cat,
      updated.map((a) => ({ pluginId: a.pluginId, commandId: a.commandId })),
    );
    await load();
  }

  async function addAction(cat: string, action: (typeof availableActions)[0]) {
    const c = categories.find((c) => c.category === cat);
    if (!c) return;
    const updated = [
      ...c.actions,
      { pluginId: action.pluginId, commandId: action.commandId },
    ];
    await updateCategoryPipeline(cat, updated);
    await load();
    editingCategory = null;
  }

  async function handleMoveType(typeName: string, newCat: string) {
    await moveEventTypeToCategory(typeName, newCat);
    await load();
  }
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Header -->
  <div
    class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border"
  >
    <div>
      <div class="flex items-center gap-2 mb-0.5">
        <Shield class="size-5 text-primary/60" />
        <h2 class="text-xl font-bold tracking-tight text-foreground">
          Category Pipelines
        </h2>
      </div>
      <p class="text-sm text-muted-foreground/60">
        Categories carry default action pipelines. AI assigns event types to
        categories.
      </p>
    </div>
  </div>

  <!-- Category cards -->
  <ScrollArea class="flex-1 min-h-0 px-8 py-6">
    {#if loading}
      <div
        class="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground"
      >
        <div
          class="size-6 border-2 border-border border-t-primary rounded-full animate-spin"
        ></div>
        Loading…
      </div>
    {:else}
      <div class="flex flex-col gap-4 max-w-4xl">
        {#each categories as cat (cat.category)}
          {@const color = catColors[cat.category] || "#888"}
          {@const icon = catIcons[cat.category] || "📦"}
          <div
            class="rounded-xl border bg-[#0a0f18] border-border hover:border-primary/30 transition-all"
          >
            <!-- Category header -->
            <div class="flex items-center gap-3 px-6 py-4">
              <div
                class="size-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                style="background: {color}18; color: {color}"
              >
                {icon}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-bold text-foreground">
                    {cat.label}
                  </h3>
                  <Badge
                    variant="outline"
                    class="text-[0.6rem] px-1.5 py-0"
                    style="color: {color}; border-color: {color}40"
                  >
                    {cat.eventTypes.length} type{cat.eventTypes.length !== 1
                      ? "s"
                      : ""}
                  </Badge>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-muted-foreground/50">Policy:</span>
                  <select
                    value={cat.policy}
                    onchange={(e) =>
                      handlePolicyChange(
                        cat.category,
                        (e.target as HTMLSelectElement).value,
                      )}
                    class="h-6 px-1.5 text-xs rounded border border-input bg-background text-foreground"
                  >
                    <option value="auto">Auto-execute</option>
                    <option value="supervised">Execute & notify</option>
                    <option value="manual">User approval</option>
                  </select>
                </div>
              </div>

              <button
                onclick={() => toggleExpand(cat.category)}
                class="p-2 text-muted-foreground/40 hover:text-foreground transition-colors"
              >
                {#if expanded[cat.category]}
                  <ChevronDown class="size-4" />
                {:else}
                  <ChevronRight class="size-4" />
                {/if}
              </button>
            </div>

            <!-- Pipeline actions -->
            <div class="px-6 pb-4 border-t border-border/40 pt-3">
              <span
                class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/40 font-semibold"
                >Default Pipeline</span
              >
              {#if cat.actions.length === 0}
                <div
                  class="flex items-center gap-2 mt-2 text-xs text-muted-foreground/30 italic"
                >
                  No default actions — user must act manually
                </div>
              {:else}
                <div class="flex flex-wrap items-center gap-1.5 mt-2">
                  {#each cat.actions as action, i}
                    <div
                      class="flex items-center gap-1 px-2 py-1 rounded-md border border-border/60 bg-card/50 text-xs text-foreground"
                    >
                      <span class="opacity-60">{action.commandId}</span>
                      <button
                        onclick={() => removeAction(cat.category, i)}
                        class="ml-0.5 text-muted-foreground/30 hover:text-destructive transition-colors"
                      >
                        <X class="size-3" />
                      </button>
                    </div>
                    {#if i < cat.actions.length - 1}
                      <span class="text-muted-foreground/20 text-xs">→</span>
                    {/if}
                  {/each}
                </div>
              {/if}

              <!-- Add action -->
              <div class="mt-2">
                {#if editingCategory === cat.category}
                  <div
                    class="flex flex-wrap gap-1 mt-1 p-2 rounded border border-border/40 bg-background/50"
                  >
                    {#each availableActions as action}
                      <button
                        onclick={() => addAction(cat.category, action)}
                        class="px-2 py-0.5 rounded text-xs border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                      >
                        {action.label}
                      </button>
                    {/each}
                    <button
                      onclick={() => (editingCategory = null)}
                      class="px-2 py-0.5 rounded text-xs text-muted-foreground/40 hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                {:else}
                  <button
                    onclick={() => (editingCategory = cat.category)}
                    class="flex items-center gap-1 text-xs text-primary/60 hover:text-primary transition-colors mt-1"
                  >
                    <Plus class="size-3" /> Add action
                  </button>
                {/if}
              </div>
            </div>

            <!-- Event types (expandable) -->
            {#if expanded[cat.category]}
              <div class="px-6 pb-4 border-t border-border/40 pt-3">
                <span
                  class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/40 font-semibold"
                  >Event Types in this Category</span
                >
                {#if cat.eventTypes.length === 0}
                  <p class="text-xs text-muted-foreground/30 mt-2 italic">
                    No event types assigned yet
                  </p>
                {:else}
                  <div class="flex flex-col gap-1 mt-2">
                    {#each cat.eventTypes as et}
                      <div
                        class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card/30 border border-border/30"
                      >
                        <span class="text-xs font-mono text-foreground/80"
                          >{et.name}</span
                        >
                        {#if et.autoCreated}
                          <Badge
                            variant="outline"
                            class="text-[0.55rem] px-1 py-0 text-muted-foreground/40 border-border/30"
                            >AI</Badge
                          >
                        {/if}
                        <div class="ml-auto">
                          <select
                            value={cat.category}
                            onchange={(e) =>
                              handleMoveType(
                                et.name,
                                (e.target as HTMLSelectElement).value,
                              )}
                            class="h-5 px-1 text-[0.6rem] rounded border border-input bg-background text-muted-foreground"
                          >
                            {#each categories as c}
                              <option value={c.category}>{c.label}</option>
                            {/each}
                          </select>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </ScrollArea>
</div>
