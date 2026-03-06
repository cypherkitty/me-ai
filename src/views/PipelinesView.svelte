<script lang="ts">
  import { onMount } from "svelte";
  import {
    getCategoryPipelines,
    getPendingItemsByCategory,
    getPendingCountByCategory,
    updateCategoryPipeline,
    updateCategoryPolicy,
    deleteEventType,
    moveEventTypeToCategory,
    unassignEventTypeFromCategory,
  } from "../lib/rules.js";
  import { executePipeline, isAuthenticated } from "../lib/plugins/execution-service.js";
  import PipelineEditor from "../components/actions/PipelineEditor.svelte";
  import PipelineGraph from "../components/actions/PipelineGraph.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import {
    ChevronDown,
    ChevronRight,
    Plus,
    Play,
    Trash2,
    Loader,
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
  /** Pending count per category (category name -> number) */
  let pendingCounts = $state<Record<string, number>>({});
  /** Category currently running Execute (category name or null) */
  let executingCategory = $state<string | null>(null);

  // Editor state
  let showEditor = $state(false);
  let editingRule = $state<any>(null);

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

  onMount(load);

  async function load() {
    loading = true;
    try {
      const cats = (await getCategoryPipelines()) as CatPipeline[];
      categories = cats;
      const entries = await Promise.all(
        cats.map(async (c) => [c.category, await getPendingCountByCategory(c.category)] as const),
      );
      pendingCounts = Object.fromEntries(entries);
    } catch (e) {
      console.error("Failed to load category pipelines:", e);
    } finally {
      loading = false;
    }
  }

  async function handleExecuteCategory(cat: CatPipeline) {
    if (!(await isAuthenticated())) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }
    if (cat.actions.length === 0) {
      alert("No actions in this category pipeline — add actions first (Edit Actions).");
      return;
    }
    const items = await getPendingItemsByCategory(cat.category);
    if (items.length === 0) {
      alert(`No pending items in ${cat.label}.`);
      return;
    }
    executingCategory = cat.category;
    let ok = 0;
    let failed = 0;
    try {
      for (const item of items) {
        const event = {
          type: item.eventType,
          source: item.sourceType,
          data: {
            emailId: item.id,
            subject: item.subject,
            from: item.from,
          },
          metadata: { category: item.event_category },
        };
        const result = (await executePipeline(event, undefined, true)) as {
          success?: boolean;
        };
        if (result.success) ok += 1;
        else failed += 1;
      }
      if (failed > 0) {
        alert(`Done: ${ok} succeeded, ${failed} failed.`);
      }
      pendingCounts = { ...pendingCounts, [cat.category]: 0 };
    } catch (e) {
      console.error("Execute category failed:", e);
      alert(`Execution failed: ${(e as Error).message}`);
    } finally {
      executingCategory = null;
    }
  }

  function toggleExpand(cat: string) {
    expanded = { ...expanded, [cat]: !expanded[cat] };
  }

  async function handlePolicyChange(cat: string, newPolicy: string) {
    await updateCategoryPolicy(cat, newPolicy);
    await load();
  }

  function editCategoryPipeline(catName: string) {
    const cat = categories.find((c) => c.category === catName);
    if (!cat) return;

    // Create a mock rule for the editor
    editingRule = {
      id: `cat:${cat.category}`,
      name: `Category: ${cat.label}`,
      description: "",
      triggers: [{ type: "event_category", name: cat.category }],
      actions: JSON.parse(JSON.stringify(cat.actions)),
      enabled: true,
      priority: cat.priority,
      _eventTypes: cat.eventTypes || [],
    };
    showEditor = true;
  }

  async function handleEditorSave(
    actions?: any[],
    typesToMove?: string[],
    typesToDelete?: string[],
  ) {
    if (!editingRule || !editingRule.id.startsWith("cat:") || !actions) return;
    const catName = editingRule.id.split(":")[1];

    const newActions = actions.map((a, i) => ({
      pluginId: a.pluginId,
      commandId: a.commandId,
      order: i,
    }));

    await updateCategoryPipeline(catName, newActions);

    // Assign any added event types to this category mapping
    if (typesToMove && typesToMove.length > 0) {
      for (const t of typesToMove) {
        await moveEventTypeToCategory(t, catName);
      }
    }

    // Unassign any event types marked for removal
    if (typesToDelete && typesToDelete.length > 0) {
      for (const t of typesToDelete) {
        await unassignEventTypeFromCategory(t);
      }
    }

    await load();
  }

  async function handleDeleteType(typeName: string) {
    if (confirm(`Are you sure you want to delete event type '${typeName}'?`)) {
      await deleteEventType(typeName);
      await load();
    }
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
            <div
              class="px-6 pb-4 border-t border-border/40 pt-3 flex flex-col items-start gap-1"
            >
              <div class="flex items-center justify-between w-full gap-2 flex-wrap">
                <span
                  class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/40 font-semibold"
                >
                  Default Pipeline
                </span>
                <div class="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    class="gap-2 h-7 text-xs"
                    disabled={
                      executingCategory === cat.category ||
                      cat.actions.length === 0 ||
                      (pendingCounts[cat.category] ?? 0) === 0
                    }
                    onclick={() => handleExecuteCategory(cat)}
                  >
                    {#if executingCategory === cat.category}
                      <Loader class="size-3 animate-spin" /> Running…
                    {:else}
                      <Play class="size-3" />
                      Execute{pendingCounts[cat.category]
                        ? ` (${pendingCounts[cat.category]})`
                        : ""}
                    {/if}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    class="gap-2 h-7 text-xs"
                    onclick={() => editCategoryPipeline(cat.category)}
                  >
                    <Plus class="size-3" /> Edit Actions
                  </Button>
                </div>
              </div>

              {#if cat.actions.length === 0}
                <div
                  class="flex items-center gap-2 mt-2 text-xs text-muted-foreground/30 italic"
                >
                  No default actions — user must act manually
                </div>
              {:else}
                <PipelineGraph
                  commands={cat.actions}
                  eventType={`Any ${cat.label} event`}
                  eventTypes={cat.eventTypes.map((t) => t.name)}
                  group={cat.category.toUpperCase()}
                  policy={cat.policy}
                />
              {/if}
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
                        <div class="ml-auto flex items-center gap-1.5">
                          <button
                            onclick={() => handleDeleteType(et.name)}
                            class="text-muted-foreground/40 hover:text-destructive transition-colors px-1 h-5"
                            title="Delete Event Type"
                          >
                            <Trash2 class="size-3.5" />
                          </button>
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

  <PipelineEditor
    bind:open={showEditor}
    bind:rule={editingRule}
    customSave={true}
    onSave={handleEditorSave}
  />
</div>
