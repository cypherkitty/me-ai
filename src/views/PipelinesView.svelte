<script>
  import { onMount } from "svelte";
  import {
    getRules,
    getEventCategories,
    getExecutionPolicies,
    createRule,
    deleteRule,
    setRuleEnabled,
  } from "../lib/rules.js";
  import { getAllEventTypes } from "../lib/events.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { cn } from "$lib/utils.js";
  import {
    Plus,
    Trash2,
    RefreshCw,
    Puzzle,
    Edit2,
    GitBranch,
  } from "lucide-svelte";
  import "@xyflow/svelte/dist/style.css";
  import PipelineEditor from "../components/actions/PipelineEditor.svelte";
  import PluginRegistry from "../components/actions/PluginRegistry.svelte";

  // ── data ──────────────────────────────────────────────────────────────────
  let rules = $state([]);
  let loading = $state(true);
  let deleteOpen = $state(false);
  let deleteId = $state(null);

  let showPipelineEditor = $state(false);
  let editingRule = $state(null);

  let showPluginRegistry = $state(false);

  // ── helpers ───────────────────────────────────────────────────────────────
  function clone(obj) {
    return JSON.parse(
      JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)),
    );
  }

  // ── lookup helpers for UI rendering ───────────────────────────────────────
  function triggerText(rule) {
    if (!rule.triggers || rule.triggers.length === 0) return "Any Event";
    return (
      rule.triggers.length +
      " trigger" +
      (rule.triggers.length === 1 ? "" : "s")
    );
  }

  function actionText(rule) {
    if (!rule.actions || rule.actions.length === 0) return "No actions";
    return (
      rule.actions.length + " action" + (rule.actions.length === 1 ? "" : "s")
    );
  }

  // ── load ─────────────────────────────────────────────────────────────────
  async function load() {
    loading = true;
    try {
      rules = await getRules();
    } catch (e) {
      console.error("PipelinesView:", e);
    }
    loading = false;
  }

  onMount(load);

  // ── new rule ──────────────────────────────────────────────────────────────
  async function createNew() {
    const id = await createRule({
      name: "New Pipeline",
      description: "",
      enabled: true,
      priority: 5,
      triggers: [],
      actions: [],
      policy: "auto",
    });
    await load();
    // createRule returns the new ID string — find the full rule object after reload
    editingRule = clone(rules.find((r) => r.id === id) ?? null);
    showPipelineEditor = true;
  }

  // ── delete ────────────────────────────────────────────────────────────────
  async function doDelete() {
    if (!deleteId) return;
    await deleteRule(deleteId);
    deleteId = null;
    deleteOpen = false;
    await load();
  }

  async function toggleEnabled(rule) {
    await setRuleEnabled(rule.id, !rule.enabled);
    rule.enabled = !rule.enabled;
  }
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Header -->
  <div
    class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border"
  >
    <div>
      <div class="flex items-center gap-2 mb-0.5">
        <h1 class="text-sm font-semibold tracking-tight text-foreground">
          Routing Pipelines
        </h1>
        <span
          class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50"
          >/ rules</span
        >
      </div>
      <p class="text-xs text-muted-foreground">
        Visual pipelines routing events to actions by type and category.
      </p>
    </div>
    <div class="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon-sm"
        onclick={() => (showPluginRegistry = true)}
        class="gap-1.5 h-8 px-2.5 text-xs w-auto"
      >
        <Puzzle class="size-3.5" />Plugins
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onclick={load}
        class={cn(loading && "[&_svg]:animate-spin")}
      >
        <RefreshCw class="size-4" />
      </Button>
      <Button onclick={createNew} class="gap-2 shrink-0">
        <Plus class="size-4" />
        New Pipeline
      </Button>
    </div>
  </div>

  <PipelineEditor
    bind:open={showPipelineEditor}
    bind:rule={editingRule}
    onSave={load}
  />
  <PluginRegistry bind:open={showPluginRegistry} />

  <!-- Pipeline cards -->
  <ScrollArea class="flex-1 min-h-0 px-8 py-6">
    {#if loading}
      <div
        class="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground"
      >
        <div
          class="size-6 rounded-full border-2 border-border border-t-primary animate-spin"
        ></div>
        <span class="text-sm">Loading pipelines…</span>
      </div>
    {:else if rules.length === 0}
      <div
        class="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground"
      >
        <GitBranch class="size-14 opacity-20" />
        <span class="text-sm">No pipelines yet.</span>
        <Button variant="outline" onclick={createNew} class="gap-2">
          <Plus class="size-4" />Create Pipeline
        </Button>
      </div>
    {:else}
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-7xl">
        {#each rules as rule (rule.id)}
          <div
            class={cn(
              "rounded-xl border bg-card p-4 transition-colors hover:border-primary/50 flex flex-col gap-3",
              rule.enabled ? "border-border" : "border-border opacity-60",
            )}
          >
            <!-- Card header -->
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div
                  class="flex items-center gap-2 mb-1 cursor-pointer"
                  onclick={() => {
                    editingRule = clone(rule);
                    showPipelineEditor = true;
                  }}
                >
                  <span
                    class="text-base font-semibold tracking-tight text-primary hover:underline hover:underline-offset-2"
                    >{rule.name}</span
                  >
                  <Badge
                    variant="outline"
                    class="text-[0.6rem] font-mono h-4 px-1.5 tracking-wide"
                    >{rule.policy ?? "auto"}</Badge
                  >
                </div>
                {#if rule.description}
                  <p class="text-xs text-muted-foreground">
                    {rule.description}
                  </p>
                {/if}
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleEnabled(rule)}
                  aria-label="Toggle pipeline"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  class="ml-2 hover:bg-destructive/10 hover:text-destructive"
                  onclick={() => {
                    deleteId = rule.id;
                    deleteOpen = true;
                  }}
                  title="Delete pipeline"
                >
                  <Trash2 class="size-3.5" />
                </Button>
              </div>
            </div>

            <!-- Pipeline Summary Vis -->
            <div
              class="flex items-center gap-2 mt-auto pt-2 text-xs font-mono text-muted-foreground"
            >
              <div
                class="bg-secondary/50 px-2 py-1 flex items-center gap-1 rounded border border-border"
              >
                ⚡ {triggerText(rule)}
              </div>
              <div class="text-border">→</div>
              <div
                class="bg-secondary/50 px-2 py-1 rounded border border-border text-foreground font-semibold flex items-center gap-1"
              >
                {actionText(rule)}
              </div>
              <div class="flex-1"></div>
              <Button
                variant="secondary"
                size="sm"
                class="h-7 text-xs gap-1.5"
                onclick={() => {
                  editingRule = clone(rule);
                  showPipelineEditor = true;
                }}
              >
                <Edit2 class="size-3" /> Edit Canvas
              </Button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </ScrollArea>
</div>

<!-- Delete confirm dialog -->
<Dialog.Root
  bind:open={deleteOpen}
  onOpenChange={(o) => {
    if (!o) deleteId = null;
  }}
>
  <Dialog.Content class="max-w-sm">
    <Dialog.Header>
      <Dialog.Title>Delete Pipeline</Dialog.Title>
      <Dialog.Description
        >This will permanently remove the pipeline. This cannot be undone.</Dialog.Description
      >
    </Dialog.Header>
    <Dialog.Footer>
      <Button
        variant="outline"
        onclick={() => {
          deleteOpen = false;
          deleteId = null;
        }}>Cancel</Button
      >
      <Button variant="destructive" onclick={doDelete}>Delete</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
