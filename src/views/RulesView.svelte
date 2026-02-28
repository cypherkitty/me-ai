<script>
  import { onMount } from "svelte";
  import {
    getRules, getEventTypes, getEventCategories, getActions, getExecutionPolicies,
    createRule, updateRule, deleteRule, setRuleEnabled,
  } from "../lib/rules.js";
  import { Button }    from "$lib/components/ui/button/index.js";
  import { Badge }     from "$lib/components/ui/badge/index.js";
  import { Input }     from "$lib/components/ui/input/index.js";
  import { Label }     from "$lib/components/ui/label/index.js";
  import { Switch }    from "$lib/components/ui/switch/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import * as Dialog   from "$lib/components/ui/dialog/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { cn }        from "$lib/utils.js";
  import { Plus, Pencil, Trash2, X, ArrowUp, ArrowDown, ChevronRight, GitBranch } from "lucide-svelte";

  let rules      = $state([]);
  let eventTypes = $state([]);
  let eventCats  = $state([]);
  let actions    = $state([]);
  let policies   = $state([]);
  let loading    = $state(true);

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj, (_, v) => typeof v === "bigint" ? Number(v) : v));
  }

  let editing    = $state(null);
  let isNew      = $state(false);
  let saving     = $state(false);
  let deleteId   = $state(null);
  let editorOpen = $state(false);
  let deleteOpen = $state(false);

  const POLICY_META = {
    auto:       { label: "Auto",       desc: "Executes immediately" },
    supervised: { label: "Supervised", desc: "Executes + notifies" },
    manual:     { label: "Manual",     desc: "Awaits user approval" },
  };

  const POLICY_VARIANT = {
    auto:       "default",
    supervised: "secondary",
    manual:     "outline",
  };

  const TRIGGER_VARIANT = {
    event_type:     "default",
    event_category: "secondary",
  };

  async function load() {
    loading = true;
    try {
      [rules, eventTypes, eventCats, actions, policies] = await Promise.all([
        getRules(),
        getEventTypes(),
        getEventCategories(),
        getActions(),
        getExecutionPolicies(),
      ]);
    } catch (e) {
      console.error("RulesView load error:", e);
    }
    loading = false;
  }

  onMount(load);

  function startNew() {
    editing = { name: "", description: "", enabled: true, priority: 5, triggers: [], actions: [], policy: "auto" };
    isNew = true;
    editorOpen = true;
  }

  function startEdit(rule) {
    editing = clone(rule);
    isNew = false;
    editorOpen = true;
  }

  function cancelEdit() {
    editorOpen = false;
    editing = null;
    isNew = false;
  }

  async function save() {
    if (!editing) return;
    saving = true;
    try {
      if (isNew) await createRule(editing);
      else       await updateRule(editing.id, editing);
      cancelEdit();
      await load();
    } catch (e) {
      console.error("Save rule error:", e);
    }
    saving = false;
  }

  async function toggleEnabled(rule) {
    await setRuleEnabled(rule.id, !rule.enabled);
    rule.enabled = !rule.enabled;
  }

  async function doDelete() {
    if (!deleteId) return;
    await deleteRule(deleteId);
    deleteId = null;
    deleteOpen = false;
    await load();
  }

  function addTrigger(type) {
    if (!editing) return;
    editing.triggers = [...editing.triggers, { type, name: "" }];
  }
  function removeTrigger(i) { editing.triggers = editing.triggers.filter((_, idx) => idx !== i); }
  function addAction(name) {
    if (!editing || editing.actions.includes(name)) return;
    editing.actions = [...editing.actions, name];
  }
  function removeAction(i) { editing.actions = editing.actions.filter((_, idx) => idx !== i); }
  function moveAction(i, dir) {
    const arr = [...editing.actions];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    editing.actions = arr;
  }

  function triggerLabel(t) {
    const list = t.type === "event_type" ? eventTypes : eventCats;
    return list.find(x => x.name === t.name)?.label ?? t.name;
  }
  function actionLabel(name) {
    return actions.find(a => a.name === name)?.label ?? name;
  }
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Header -->
  <header class="flex items-center justify-between px-6 pt-5 pb-4 shrink-0">
    <div class="flex items-baseline gap-3">
      <h1 class="text-base font-bold text-foreground tracking-tight">Rules</h1>
      <span class="text-xs text-muted-foreground">{rules.length} rules</span>
    </div>
    <Button size="sm" onclick={startNew} class="gap-1.5">
      <Plus class="size-3.5" />
      New Rule
    </Button>
  </header>

  <!-- Rules list -->
  <ScrollArea class="flex-1 px-6 pb-6">
    {#if loading}
      <div class="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <div class="size-5 rounded-full border-2 border-border border-t-primary animate-spin"></div>
        <span class="text-xs">Loading rules…</span>
      </div>
    {:else if rules.length === 0}
      <div class="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <GitBranch class="size-10 opacity-30" />
        <span class="text-sm">No rules yet. Create your first rule.</span>
        <Button variant="outline" size="sm" onclick={startNew}>
          <Plus class="size-3.5 mr-1.5" />Create Rule
        </Button>
      </div>
    {:else}
      <div class="flex flex-col gap-2">
        {#each rules as rule (rule.id)}
          <div class={cn(
            "flex items-center gap-3 px-3.5 py-3 rounded-lg border transition-colors",
            "bg-card border-border/50 hover:border-border",
            !rule.enabled && "opacity-50"
          )}>
            <!-- Priority -->
            <div class="size-6 rounded-md bg-muted border border-border flex items-center justify-center text-[0.62rem] font-bold text-muted-foreground shrink-0">
              {rule.priority}
            </div>

            <!-- Toggle -->
            <Switch
              checked={rule.enabled}
              onCheckedChange={() => toggleEnabled(rule)}
              class="shrink-0"
            />

            <!-- Pipeline chain -->
            <div class="flex items-center gap-1.5 flex-1 min-w-0 flex-wrap">
              <span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/50">WHEN</span>
              {#each rule.triggers as t}
                <Badge variant={TRIGGER_VARIANT[t.type] ?? "outline"} class="text-xs px-2 h-5">
                  {triggerLabel(t)}
                </Badge>
              {/each}
              {#if rule.triggers.length === 0}
                <Badge variant="outline" class="text-xs px-2 h-5 italic">any event</Badge>
              {/if}

              <ChevronRight class="size-3 text-muted-foreground/30 shrink-0" />

              <span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/50">DO</span>
              {#each rule.actions as a, i}
                {#if i > 0}<span class="text-muted-foreground/30 text-xs">→</span>{/if}
                <Badge variant="secondary" class="text-xs px-2 h-5 font-mono">
                  {actionLabel(a)}
                </Badge>
              {/each}
              {#if rule.actions.length === 0}
                <Badge variant="outline" class="text-xs px-2 h-5 italic">no actions</Badge>
              {/if}

              <ChevronRight class="size-3 text-muted-foreground/30 shrink-0" />

              <span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/50">VIA</span>
              <Badge variant={POLICY_VARIANT[rule.policy] ?? "outline"} class="text-xs px-2 h-5 font-semibold">
                {POLICY_META[rule.policy]?.label ?? rule.policy}
              </Badge>
            </div>

            <!-- Rule name -->
            <div class="flex flex-col gap-0.5 min-w-0 max-w-[140px] shrink-0">
              <span class="text-[0.68rem] text-muted-foreground font-mono truncate" title={rule.name}>{rule.name}</span>
              {#if rule.description}
                <span class="text-[0.62rem] text-muted-foreground/40 truncate">{rule.description}</span>
              {/if}
            </div>

            <!-- Actions -->
            <div class="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon-sm" onclick={() => startEdit(rule)} title="Edit">
                <Pencil class="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onclick={() => { deleteId = rule.id; deleteOpen = true; }}
                title="Delete"
              >
                <Trash2 class="size-3" />
              </Button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </ScrollArea>
</div>

<!-- Rule editor dialog -->
<Dialog.Root bind:open={editorOpen} onOpenChange={(o) => { if (!o) cancelEdit(); }}>
  <Dialog.Content class="max-w-lg max-h-[90dvh] flex flex-col overflow-hidden">
    <Dialog.Header class="shrink-0">
      <Dialog.Title>{isNew ? "New Rule" : "Edit Rule"}</Dialog.Title>
      <Dialog.Description>
        Triple notation: <code class="text-xs bg-muted px-1 py-0.5 rounded">type:action:policy</code>
      </Dialog.Description>
    </Dialog.Header>

    {#if editing}
      <ScrollArea class="flex-1 overflow-y-auto">
        <div class="flex flex-col gap-4 px-1 py-2">
          <!-- Name -->
          <div class="space-y-1.5">
            <Label for="rule-name">Name</Label>
            <Input id="rule-name" bind:value={editing.name} placeholder="e.g. ad:delete:auto" />
          </div>

          <!-- Description -->
          <div class="space-y-1.5">
            <Label for="rule-desc">Description</Label>
            <Input id="rule-desc" bind:value={editing.description} placeholder="What this rule does" />
          </div>

          <!-- Priority + Enabled -->
          <div class="flex gap-4">
            <div class="space-y-1.5 flex-1">
              <Label for="rule-priority">Priority</Label>
              <Input id="rule-priority" type="number" bind:value={editing.priority} min="1" max="1000" class="w-24" />
            </div>
            <div class="space-y-1.5">
              <Label>Status</Label>
              <div class="flex items-center gap-2 h-9">
                <Switch
                  id="rule-enabled-toggle"
                  checked={editing.enabled}
                  onCheckedChange={(v) => editing.enabled = v}
                />
                <span class="text-sm text-muted-foreground">{editing.enabled ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Triggers -->
          <div class="space-y-2">
            <Label>Triggers</Label>
            <div class="flex flex-col gap-1.5">
              {#each editing.triggers as t, i}
                <div class="flex items-center gap-2">
                  <select
                    class="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground flex-1"
                    aria-label="Trigger type"
                    bind:value={t.type}
                  >
                    <option value="event_type">Event Type</option>
                    <option value="event_category">Event Category</option>
                  </select>
                  <select
                    class="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground flex-1"
                    aria-label="Trigger value"
                    bind:value={t.name}
                  >
                    <option value="">Select…</option>
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
                  <Button variant="ghost" size="icon-sm" onclick={() => removeTrigger(i)} aria-label="Remove trigger" class="shrink-0">
                    <X class="size-3" />
                  </Button>
                </div>
              {/each}
              <div class="flex gap-2">
                <Button variant="outline" size="sm" onclick={() => addTrigger("event_type")}>+ Event Type</Button>
                <Button variant="outline" size="sm" onclick={() => addTrigger("event_category")}>+ Category</Button>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Actions pipeline -->
          <div class="space-y-2">
            <Label>Action Pipeline <span class="text-xs text-muted-foreground">(ordered)</span></Label>
            <div class="flex flex-col gap-1.5">
              {#each editing.actions as a, i}
                <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-muted/40 border border-border/50">
                  <span class="size-5 rounded bg-muted flex items-center justify-center text-[0.6rem] font-bold text-muted-foreground shrink-0">{i + 1}</span>
                  <span class="flex-1 text-xs text-foreground">{actionLabel(a)}</span>
                  <div class="flex items-center gap-0.5">
                    <Button variant="ghost" size="icon-sm" onclick={() => moveAction(i, -1)} disabled={i === 0} aria-label="Move up">
                      <ArrowUp class="size-3" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onclick={() => moveAction(i, 1)} disabled={i === editing.actions.length - 1} aria-label="Move down">
                      <ArrowDown class="size-3" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onclick={() => removeAction(i)} aria-label="Remove action">
                      <X class="size-3" />
                    </Button>
                  </div>
                </div>
              {/each}
              <div class="flex flex-wrap gap-1.5">
                {#each actions.filter(a => !editing.actions.includes(a.name)) as a}
                  <Button variant="outline" size="sm" onclick={() => addAction(a.name)} class="text-xs h-7">{a.label}</Button>
                {/each}
              </div>
            </div>
          </div>

          <Separator />

          <!-- Execution policy -->
          <div class="space-y-2">
            <Label>Execution Policy</Label>
            <div class="flex gap-2">
              {#each policies as p}
                <button
                  onclick={() => editing.policy = p.name}
                  class={cn(
                    "flex-1 flex flex-col items-start px-3 py-2.5 rounded-lg border text-left transition-colors",
                    editing.policy === p.name
                      ? "text-foreground border-primary bg-accent"
                      : "text-muted-foreground border-border hover:bg-accent"
                  )}
                >
                  <span class="text-xs font-bold">{POLICY_META[p.name]?.label ?? p.name}</span>
                  <span class="text-[0.65rem] opacity-70 mt-0.5">{POLICY_META[p.name]?.desc ?? p.description}</span>
                </button>
              {/each}
            </div>
          </div>
        </div>
      </ScrollArea>
    {/if}

    <Dialog.Footer class="shrink-0 pt-2">
      <Button variant="outline" onclick={cancelEdit}>Cancel</Button>
      <Button onclick={save} disabled={saving}>
        {saving ? "Saving…" : isNew ? "Create Rule" : "Save Changes"}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- Delete confirmation dialog -->
<Dialog.Root bind:open={deleteOpen} onOpenChange={(o) => { if (!o) { deleteId = null; } }}>
  <Dialog.Content class="max-w-sm">
    <Dialog.Header>
      <Dialog.Title>Delete Rule</Dialog.Title>
      <Dialog.Description>This will permanently delete the rule. This action cannot be undone.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => { deleteOpen = false; deleteId = null; }}>Cancel</Button>
      <Button variant="destructive" onclick={doDelete}>Delete</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
