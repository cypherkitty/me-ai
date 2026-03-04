<script lang="ts">
  import { onMount } from "svelte";
  import {
    getRules,
    createRule,
    deleteRule,
    setRuleEnabled,
  } from "../lib/rules.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { cn } from "$lib/utils.js";
  import { getGroupForEventType, groupToPolicy } from "../lib/events.js";
  import {
    Plus,
    Trash2,
    RefreshCw,
    Puzzle,
    Edit2,
    GitBranch,
    Zap,
  } from "lucide-svelte";
  import "@xyflow/svelte/dist/style.css";
  import PipelineEditor from "../components/actions/PipelineEditor.svelte";
  import PluginRegistry from "../components/actions/PluginRegistry.svelte";

  // ── data ──────────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules = $state<any[]>([]);
  let loading = $state(true);
  let deleteOpen = $state(false);
  let deleteId = $state(null);

  let showPipelineEditor = $state(false);
  let editingRule = $state(null);

  let showPluginRegistry = $state(false);

  // ── helpers ───────────────────────────────────────────────────────────────
  function clone(obj: unknown) {
    return JSON.parse(
      JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)),
    );
  }

  // Pre-load groups to synchronously render policy badging
  let groupCache: Record<string, string> = {};

  async function resolveRulePolicy(rule: any): Promise<string> {
    const types = (rule.triggers ?? []).filter(
      (t: any) => t.type === "event_type",
    );
    if (types.length === 0) return "manual"; // Safe default if no trigger selected
    const etName = types[0].name;

    // Check if we already cached the group
    if (!groupCache[etName]) {
      groupCache[etName] = await getGroupForEventType(etName);
    }
    return groupToPolicy(groupCache[etName]);
  }
  function groupedTriggers(rule: any) {
    const types = (rule.triggers ?? []).filter(
      (t: any) => t.type === "event_type",
    );
    const cats = (rule.triggers ?? []).filter(
      (t: any) => t.type === "event_category",
    );
    return { types, cats };
  }

  // ── load ─────────────────────────────────────────────────────────────────
  async function load() {
    loading = true;
    try {
      const fetchedRules = await getRules();
      for (const r of fetchedRules) {
        (r as any).uiPolicy = await resolveRulePolicy(r);
      }
      rules = fetchedRules;
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

  async function toggleEnabled(rule: any) {
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
      <div class="flex flex-col gap-3 max-w-4xl">
        {#each rules as rule (rule.id)}
          {@const { types } = groupedTriggers(rule)}
          <div
            class={cn(
              "rounded-xl border bg-[#0a0f18] transition-all",
              rule.enabled
                ? "border-border hover:border-primary/40"
                : "border-border/50 opacity-50",
            )}
          >
            <!-- Row: name + controls -->
            <div
              class="flex items-center gap-3 px-6 py-5 border-b border-border/60"
            >
              <div class="flex-1 min-w-0 flex flex-col gap-1.5 justify-center">
                <button
                  class="text-lg font-bold tracking-tight text-foreground hover:text-primary transition-colors text-left flex items-center gap-2"
                  onclick={() => {
                    editingRule = clone(rule);
                    showPipelineEditor = true;
                  }}
                >
                  <Zap class="size-5 text-blue-500" />
                  {#if types.length > 0}
                    <span class="capitalize"
                      >{types[0].name.replace(/_/g, " ")}</span
                    >
                  {:else}
                    <span class="italic text-muted-foreground/80"
                      >Any Event Type</span
                    >
                  {/if}
                </button>
                <div
                  class="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <span>AI Category:</span>
                  {#if groupCache[types[0]?.name] === "NOISE" || (!types[0] && rule.uiPolicy === "auto")}
                    <Badge
                      variant="outline"
                      class="bg-slate-500/10 text-slate-400 border-slate-500/20 text-[0.65rem] h-5"
                      >Noise</Badge
                    >
                    <span class="text-muted-foreground/50">→</span>
                    <span class="italic text-green-400/80">Auto Execution</span>
                  {:else}
                    <Badge
                      variant="outline"
                      class="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[0.65rem] h-5"
                      >Important</Badge
                    >
                    <span class="text-muted-foreground/50">→</span>
                    <span class="italic text-red-400/80">Manual Execution</span>
                  {/if}
                </div>
              </div>
              <div class="flex items-start gap-2 shrink-0">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleEnabled(rule)}
                  aria-label="Toggle pipeline"
                  class="mt-1"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  class="text-muted-foreground hover:text-foreground h-8 w-8"
                  onclick={() => {
                    editingRule = clone(rule);
                    showPipelineEditor = true;
                  }}
                  title="Edit pipeline"><Edit2 class="size-4" /></Button
                >
                <Button
                  variant="ghost"
                  size="icon-sm"
                  class="text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                  onclick={() => {
                    deleteId = rule.id;
                    deleteOpen = true;
                  }}
                  title="Delete pipeline"><Trash2 class="size-4" /></Button
                >
              </div>
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
  onOpenChange={(o: boolean) => {
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
