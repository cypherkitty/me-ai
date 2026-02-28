<script>
  import { onMount } from "svelte";
  import {
    getRules, getEventTypes, getEventCategories, getActions, getExecutionPolicies,
    createRule, updateRule, deleteRule, setRuleEnabled,
  } from "../lib/rules.js";
  import { Button }     from "$lib/components/ui/button/index.js";
  import { Badge }      from "$lib/components/ui/badge/index.js";
  import { Input }      from "$lib/components/ui/input/index.js";
  import { Label }      from "$lib/components/ui/label/index.js";
  import { Switch }     from "$lib/components/ui/switch/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import * as Dialog    from "$lib/components/ui/dialog/index.js";
  import { Separator }  from "$lib/components/ui/separator/index.js";
  import { cn }         from "$lib/utils.js";
  import {
    Plus, Trash2, GitBranch, Settings, RefreshCw, ChevronDown,
  } from "lucide-svelte";
  import "@xyflow/svelte/dist/style.css";
  import PipelineCanvas from "../components/pipeline/PipelineCanvas.svelte";

  // ── per-card node/edge builders ───────────────────────────────────────────
  const NODE_W  = 175;
  const NODE_H  = 52;
  const ACT_X   = 230;   // x of action column
  const POL_X   = 460;   // x of policy column
  const ROW_H   = NODE_H + 12;  // 64px per row

  const EDGE_BASE = "stroke: rgba(255,255,255,0.12); stroke-width: 1.5;";

  function buildNodes(rule) {
    const trs  = rule.triggers ?? [];
    const acts = rule.actions  ?? [];
    const rows = Math.max(trs.length, acts.length, 1);
    const midY = ((rows - 1) * ROW_H) / 2;

    const nodes = [];

    trs.forEach((t, i) =>
      nodes.push({
        id: `t${i}`, type: "trigger",
        position: { x: 0, y: i * ROW_H },
        data: {
          triggerType: t.type,
          label: t.name ? (t.type === "event_type" ? etLabel(t.name) : ecLabel(t.name)) : null,
        },
        width: NODE_W, height: NODE_H,
        draggable: false, selectable: false, connectable: false,
      })
    );

    acts.forEach((a, i) =>
      nodes.push({
        id: `a${i}`, type: "action",
        position: { x: ACT_X, y: i * ROW_H },
        data: { label: actLabel(a) },
        width: NODE_W, height: NODE_H,
        draggable: false, selectable: false, connectable: false,
      })
    );

    nodes.push({
      id: "policy", type: "policy",
      position: { x: POL_X, y: midY },
      data: { label: rule.policy ?? "auto" },
      width: 155, height: NODE_H,
      draggable: false, selectable: false, connectable: false,
    });

    return nodes;
  }

  function buildEdges(rule) {
    const trs  = rule.triggers ?? [];
    const acts = rule.actions  ?? [];
    const auto = rule.policy === "auto";
    const edges = [];

    trs.forEach((_, i) => {
      const tgt = acts.length ? "a0" : "policy";
      edges.push({ id: `te${i}`, source: `t${i}`, target: tgt, type: "smoothstep", animated: auto, style: EDGE_BASE });
    });

    acts.forEach((_, i) => {
      if (i < acts.length - 1)
        edges.push({ id: `ae${i}`, source: `a${i}`, target: `a${i + 1}`, type: "smoothstep", animated: auto, style: EDGE_BASE });
    });

    if (acts.length)
      edges.push({ id: "pe", source: `a${acts.length - 1}`, target: "policy", type: "smoothstep", animated: auto, style: EDGE_BASE });

    return edges;
  }

  function canvasHeight(rule) {
    const rows = Math.max((rule.triggers ?? []).length, (rule.actions ?? []).length, 1);
    return rows * ROW_H + 32;
  }

  // Called by PipelineCanvas when a node is clicked — parse the id to kind+index
  function handleNodeClick(rule, nodeId) {
    if (nodeId === "policy") { openNode(rule, "policy"); return; }
    if (nodeId.startsWith("t")) { openNode(rule, "trigger", parseInt(nodeId.slice(1))); return; }
    if (nodeId.startsWith("a")) { openNode(rule, "action",  parseInt(nodeId.slice(1))); return; }
  }

  // ── data ──────────────────────────────────────────────────────────────────
  let rules      = $state([]);
  let eventTypes = $state([]);
  let eventCats  = $state([]);
  let actions    = $state([]);
  let policies   = $state([]);
  let loading    = $state(true);
  let saving     = $state(false);
  let deleteOpen = $state(false);
  let deleteId   = $state(null);

  // ── parameters panel ─────────────────────────────────────────────────────
  let panelOpen   = $state(false);
  let panelRule   = $state(null);   // which rule card we're editing
  let panelNode   = $state(null);   // { kind: 'trigger'|'action'|'policy', index? }

  // ── inline rule-level edit state ─────────────────────────────────────────
  let dirtyRules  = $state({});    // ruleId → patched fields

  // ── helpers ───────────────────────────────────────────────────────────────
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj, (_, v) => typeof v === "bigint" ? Number(v) : v));
  }

  // ── lookup helpers ────────────────────────────────────────────────────────
  function etLabel(name)  { return eventTypes.find(x => x.name === name)?.label  ?? name; }
  function ecLabel(name)  { return eventCats.find(x => x.name === name)?.label   ?? name; }
  function actLabel(name) { return actions.find(x => x.name === name)?.label     ?? name; }

  // ── load ─────────────────────────────────────────────────────────────────
  async function load() {
    loading = true;
    try {
      [rules, eventTypes, eventCats, actions, policies] = await Promise.all([
        getRules(), getEventTypes(), getEventCategories(), getActions(), getExecutionPolicies(),
      ]);
    } catch (e) { console.error("PipelinesView:", e); }
    loading = false;
  }

  onMount(load);

  // ── open parameters panel for a node ─────────────────────────────────────
  function openNode(rule, kind, index = null) {
    panelRule = clone(rule);
    panelNode = { kind, index };
    panelOpen = true;
  }

  async function savePanel() {
    if (!panelRule) return;
    saving = true;
    try {
      await updateRule(panelRule.id, panelRule);
      const i = rules.findIndex(r => r.id === panelRule.id);
      if (i !== -1) rules[i] = clone(panelRule);
    } catch (e) { console.error("Save:", e); }
    saving = false;
    panelOpen = false;
  }

  // ── add / remove helpers that mutate panelRule ────────────────────────────
  function addTrigger(type) {
    panelRule.triggers = [...(panelRule.triggers ?? []), { type, name: "" }];
  }
  function removeTrigger(i) {
    panelRule.triggers = panelRule.triggers.filter((_, idx) => idx !== i);
  }
  function addAction() {
    const available = actions.filter(a => !(panelRule.actions ?? []).includes(a.name));
    if (available.length) panelRule.actions = [...(panelRule.actions ?? []), available[0].name];
  }
  function removeAction(i) {
    panelRule.actions = panelRule.actions.filter((_, idx) => idx !== i);
  }

  // ── new rule ──────────────────────────────────────────────────────────────
  async function createNew() {
    const r = await createRule({ name: "new rule", description: "", enabled: true, priority: 5, triggers: [], actions: [], policy: "auto" });
    await load();
    openNode(r ?? { name: "new rule", triggers: [], actions: [], policy: "auto" }, "meta");
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
  <div class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border">
    <div>
      <div class="flex items-center gap-2 mb-0.5">
        <h1 class="text-sm font-semibold tracking-tight text-foreground">Routing Pipelines</h1>
        <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ rules</span>
      </div>
      <p class="text-xs text-muted-foreground">
        Node-based pipelines routing events to actions by type and category.
      </p>
    </div>
    <div class="flex items-center gap-2">
      <Button variant="ghost" size="icon-sm" onclick={load} class={cn(loading && "[&_svg]:animate-spin")}>
        <RefreshCw class="size-4" />
      </Button>
      <Button onclick={createNew} class="gap-2">
        <Plus class="size-4" />
        New Pipeline
      </Button>
    </div>
  </div>

  <!-- Pipeline cards -->
  <ScrollArea class="flex-1 px-8 py-6">
    {#if loading}
      <div class="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <div class="size-6 rounded-full border-2 border-border border-t-primary animate-spin"></div>
        <span class="text-sm">Loading pipelines…</span>
      </div>
    {:else if rules.length === 0}
      <div class="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <GitBranch class="size-14 opacity-20" />
        <span class="text-sm">No pipelines yet.</span>
        <Button variant="outline" onclick={createNew} class="gap-2">
          <Plus class="size-4" />Create Pipeline
        </Button>
      </div>
    {:else}
      <div class="flex flex-col gap-4 max-w-4xl">
        {#each rules as rule (rule.id)}
          <div class={cn(
            "rounded border bg-card overflow-hidden transition-colors",
            rule.enabled ? "border-border" : "border-border opacity-50"
          )}>
            <!-- Card header -->
            <div class="flex items-center gap-3 px-4 pt-3.5 pb-2.5">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-sm font-semibold tracking-tight text-foreground">{rule.name}</span>
                  <Badge variant="outline" class="text-[0.6rem] font-mono h-4 px-1.5 tracking-wide">{rule.policy ?? "auto"}</Badge>
                </div>
                {#if rule.description}
                  <p class="text-xs text-muted-foreground">{rule.description}</p>
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
                  onclick={() => { openNode(rule, "meta"); }}
                  title="Edit pipeline"
                >
                  <Settings class="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onclick={() => { deleteId = rule.id; deleteOpen = true; }}
                  title="Delete pipeline"
                >
                  <Trash2 class="size-3.5" />
                </Button>
              </div>
            </div>

            <!-- Node canvas — SvelteFlow -->
            <div class="px-3 pb-4">
              <PipelineCanvas
                nodes={buildNodes(rule)}
                edges={buildEdges(rule)}
                height={canvasHeight(rule)}
                onNodeClick={(id) => handleNodeClick(rule, id)}
              />
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </ScrollArea>
</div>

<!-- ── Parameters modal (Dialog) ────────────────────────────────────────── -->
<Dialog.Root bind:open={panelOpen}>
  <Dialog.Content class="max-w-md flex flex-col p-0 gap-0 max-h-[85vh]">
    <!-- Header -->
    <Dialog.Header class="flex-row items-center gap-2.5 px-6 pt-5 pb-4 border-b border-border shrink-0 space-y-0">
      <Settings class="size-4 text-muted-foreground shrink-0" />
      <Dialog.Title class="text-base font-semibold">Parameters</Dialog.Title>
    </Dialog.Header>

    {#if panelRule}
      <ScrollArea class="flex-1 min-h-0">
        <div class="flex flex-col gap-6 px-6 py-5">

          <!-- META: rule name, description, priority -->
          {#if panelNode?.kind === "meta"}
            <div class="space-y-1.5">
              <Label class="text-xs font-bold uppercase tracking-widest text-muted-foreground">NAME</Label>
              <Input bind:value={panelRule.name} placeholder="e.g. ad:delete:auto" />
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs font-bold uppercase tracking-widest text-muted-foreground">DESCRIPTION</Label>
              <Input bind:value={panelRule.description} placeholder="What this pipeline does" />
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs font-bold uppercase tracking-widest text-muted-foreground">PRIORITY</Label>
              <Input type="number" bind:value={panelRule.priority} min="1" max="1000" class="w-28" />
            </div>
          {/if}

          <!-- TRIGGER: event_type + event_category per trigger -->
          {#if panelNode?.kind === "trigger"}
            {@const triggers = panelRule.triggers ?? []}

            {#each triggers as t, i}
              <div class="flex flex-col gap-3 p-3 rounded border border-border bg-muted/20">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {t.type === "event_type" ? "EVENT TYPE" : "EVENT CATEGORY"}
                  </span>
                  <Button variant="ghost" size="icon-sm" onclick={() => removeTrigger(i)}>
                    <Trash2 class="size-3" />
                  </Button>
                </div>

                <!-- Type selector -->
                <div class="space-y-1">
                  <Label class="text-xs text-muted-foreground">Kind</Label>
                  <select
                    class="w-full h-9 rounded border border-input bg-background px-3 text-sm text-foreground"
                    bind:value={t.type}
                    aria-label="Trigger kind"
                  >
                    <option value="event_type">Event Type</option>
                    <option value="event_category">Event Category</option>
                  </select>
                </div>

                <!-- Value dropdown -->
                <div class="space-y-1">
                  <Label class="text-xs text-muted-foreground">Value</Label>
                  <div class="relative">
                    <select
                      class="w-full h-9 rounded border border-input bg-background px-3 text-sm text-foreground appearance-none pr-9"
                      bind:value={t.name}
                      aria-label="Trigger value"
                    >
                      <option value="">(Any)</option>
                      {#if t.type === "event_type"}
                        {#each eventTypes as et}
                          <option value={et.name}>{et.label}</option>
                        {/each}
                      {:else}
                        {#each eventCats as ec}
                          <option value={ec.name}>{ec.label}</option>
                        {/each}
                      {/if}
                    </select>
                    <ChevronDown class="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            {/each}

            <div class="flex gap-2">
              <Button variant="outline" size="sm" onclick={() => addTrigger("event_type")} class="flex-1 gap-1.5">
                <Plus class="size-3.5" />Event Type
              </Button>
              <Button variant="outline" size="sm" onclick={() => addTrigger("event_category")} class="flex-1 gap-1.5">
                <Plus class="size-3.5" />Category
              </Button>
            </div>
          {/if}

          <!-- ACTION: operation picker -->
          {#if panelNode?.kind === "action"}
            {@const actionList = panelRule.actions ?? []}

            {#each actionList as a, i}
              <div class="flex flex-col gap-3 p-3 rounded border border-border bg-muted/20">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-widest text-muted-foreground">OPERATION</span>
                  <Button variant="ghost" size="icon-sm" onclick={() => removeAction(i)}>
                    <Trash2 class="size-3" />
                  </Button>
                </div>
                <div class="relative">
                  <select
                    class="w-full h-9 rounded border border-input bg-background px-3 text-sm text-foreground appearance-none pr-9"
                    bind:value={actionList[i]}
                    onchange={(e) => { panelRule.actions[i] = e.target.value; }}
                    aria-label="Action operation"
                  >
                    {#each actions as act}
                      <option value={act.name}>{act.label ?? act.name}</option>
                    {/each}
                  </select>
                  <ChevronDown class="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            {/each}

            <Button variant="outline" size="sm" onclick={addAction} class="gap-1.5">
              <Plus class="size-3.5" />Add Action
            </Button>
          {/if}

          <!-- POLICY: execution mode -->
          {#if panelNode?.kind === "policy"}
            <div class="space-y-1.5">
              <Label class="text-xs font-bold uppercase tracking-widest text-muted-foreground">EXECUTION MODE</Label>
              <div class="relative">
                <select
                  class="w-full h-9 rounded border border-input bg-background px-3 text-sm text-foreground appearance-none pr-9"
                  bind:value={panelRule.policy}
                  aria-label="Execution mode"
                >
                  {#each (policies.length ? policies : [{name:"auto"},{name:"supervised"},{name:"manual"}]) as p}
                    <option value={p.name}>{p.name}</option>
                  {/each}
                </select>
                <ChevronDown class="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              </div>
              <p class="text-xs text-muted-foreground mt-1">
                {#if panelRule.policy === "auto"}
                  Actions execute immediately without confirmation.
                {:else if panelRule.policy === "supervised"}
                  Actions execute and you receive a notification.
                {:else}
                  Actions are paused and waiting for your approval.
                {/if}
              </p>
            </div>
          {/if}

        </div>
      </ScrollArea>

      <!-- Done button -->
      <Dialog.Footer class="px-6 py-4 border-t border-border shrink-0">
        <Button onclick={savePanel} disabled={saving} class="w-full">
          {saving ? "Saving…" : "Done"}
        </Button>
      </Dialog.Footer>
    {/if}
  </Dialog.Content>
</Dialog.Root>

<!-- Delete confirm dialog -->
<Dialog.Root bind:open={deleteOpen} onOpenChange={(o) => { if (!o) deleteId = null; }}>
  <Dialog.Content class="max-w-sm">
    <Dialog.Header>
      <Dialog.Title>Delete Pipeline</Dialog.Title>
      <Dialog.Description>This will permanently remove the pipeline. This cannot be undone.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => { deleteOpen = false; deleteId = null; }}>Cancel</Button>
      <Button variant="destructive" onclick={doDelete}>Delete</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
