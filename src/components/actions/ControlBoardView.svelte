<script>
  import ScanControl from "./ScanControl.svelte";
  import ActionGroup from "./ActionGroup.svelte";
  import PromptInspector from "./PromptInspector.svelte";
  import { actionColor } from "../../lib/triage.js";
  import { EVENT_CATEGORIES } from "../../lib/events.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { ShieldCheck } from "lucide-svelte";

  let {
    engineStatus,
    modelName,
    groups = {},
    groupOrder = [],
    eventTypeToCategory = {},
    counts = {},
    stats = null,
    expandedGroup = null,
    isScanning = false,
    scanProgress = null,
    scanCount = $bindable(20),
    error = null,
    successMsg = null,
    onscan,
    onrescan,
    ontogglegroup,
    onexecute,
    onmarkacted,
    ondismiss,
    onremove,
    oncleargroup,
    ondismisserror,
    ondismisssuccess,
    onstop,
    oncloseprogress,
  } = $props();

  let showInspector = $state(false);

  /** Grab a sample email from the first group to show in the inspector */
  let sampleEmail = $derived.by(() => {
    for (const action of groupOrder) {
      const items = groups[action];
      if (items?.length > 0) return items[0];
    }
    return null;
  });

  const CATEGORY_ORDER = ["urgent", "important", "informational", "noise"];

  // Group the event types by category
  let categoriesWithGroups = $derived.by(() => {
    const res = [];
    for (const catName of CATEGORY_ORDER) {
      const actionIds = groupOrder.filter(
        (id) => eventTypeToCategory[id] === catName,
      );
      if (actionIds.length > 0) {
        res.push({
          name: catName,
          category: EVENT_CATEGORIES[catName],
          actionIds,
        });
      }
    }
    // Also catch any unknown/unmapped event types just in case
    const unknownIds = groupOrder.filter(
      (id) => !CATEGORY_ORDER.includes(eventTypeToCategory[id]),
    );
    if (unknownIds.length > 0) {
      res.push({
        name: "unknown",
        category: {
          name: "unknown",
          label: "Other",
          color: "#888",
          policy: "manual",
        },
        actionIds: unknownIds,
      });
    }
    return res;
  });
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Page header -->
  <div
    class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border"
  >
    <div>
      <div class="flex items-center gap-2 mb-0.5">
        <h1 class="text-sm font-semibold tracking-tight text-foreground">
          Email Triage
        </h1>
        <span
          class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50"
          >/ scan</span
        >
      </div>
      <p class="text-xs text-muted-foreground">
        Classify emails using AI and execute actions by group.
      </p>
    </div>
    <div class="flex items-center gap-1">
      <a
        href="#admin"
        class="inline-flex items-center gap-1.5 h-7 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-accent no-underline"
      >
        <ShieldCheck class="size-3.5" />Admin
      </a>
    </div>
  </div>

  <PromptInspector bind:open={showInspector} {sampleEmail} />

  <ScrollArea class="flex-1 min-h-0 px-8 py-5">
    <!-- Error / success banners -->
    {#if error}
      <div
        class="flex items-center justify-between px-3 py-2 rounded border border-destructive/30 bg-destructive/8 text-xs text-destructive mb-4"
      >
        <span>{error}</span>
        <button
          onclick={ondismisserror}
          class="text-destructive/60 hover:text-destructive ml-3 transition-colors"
          >✕</button
        >
      </div>
    {/if}
    {#if successMsg}
      <div
        class="flex items-center justify-between px-3 py-2 rounded border border-success/30 bg-success/8 text-xs text-success mb-4"
      >
        <span>{successMsg}</span>
        <button
          onclick={ondismisssuccess}
          class="text-success/60 hover:text-success ml-3 transition-colors"
          >✕</button
        >
      </div>
    {/if}

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
      oninspect={() => (showInspector = true)}
    />

    {#if counts.total > 0}
      <div class="flex flex-col gap-6">
        {#each categoriesWithGroups as catBlock (catBlock.name)}
          <div class="flex flex-col gap-2">
            <!-- Category Header -->
            <div class="flex items-center gap-2 mb-1 pl-1">
              <span
                class="size-2 rounded-full"
                style:background={catBlock.category.color}
              ></span>
              <h3
                class="text-xs font-bold uppercase tracking-widest text-muted-foreground/70"
                style:color={catBlock.category.color}
              >
                {catBlock.category.label}
              </h3>
              {#if catBlock.category.policy === "auto"}
                <span
                  class="ml-auto text-[10px] font-bold uppercase text-emerald-500/80 bg-emerald-500/10 px-1.5 py-0.5 rounded"
                  >Auto</span
                >
              {:else}
                <span
                  class="ml-auto text-[10px] uppercase text-muted-foreground/40 font-medium"
                  >{catBlock.category.policy}</span
                >
              {/if}
            </div>

            <!-- Event types within category -->
            <div class="flex flex-col gap-2">
              {#each catBlock.actionIds as actionId (actionId)}
                <ActionGroup
                  action={actionId}
                  color={actionColor(actionId)}
                  count={groups[actionId]?.length || 0}
                  items={groups[actionId] || []}
                  expanded={expandedGroup === actionId}
                  ontoggle={() => ontogglegroup(actionId)}
                  onexecute={(email) => onexecute(actionId, email)}
                  {onmarkacted}
                  {ondismiss}
                  {onremove}
                  oncleargroup={() => oncleargroup(actionId)}
                />
              {/each}
            </div>
          </div>
        {/each}
      </div>
      <div class="pt-3 mt-1 border-t border-border">
        <span class="text-xs text-muted-foreground/40 tabular-nums">
          {counts.total} emails classified into {groupOrder.length} groups
        </span>
      </div>
    {:else if !isScanning}
      <div
        class="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          class="opacity-20"
        >
          <path
            d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
          />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="m9 14 2 2 4-4" />
        </svg>
        <span class="text-sm">No emails classified yet</span>
        <p
          class="text-xs text-muted-foreground/50 text-center max-w-[340px] leading-relaxed"
        >
          Click <strong class="text-muted-foreground/70">Scan New</strong> to classify
          your recent emails. The LLM will determine action types, tags, and summaries
          automatically.
        </p>
      </div>
    {/if}
  </ScrollArea>
</div>
