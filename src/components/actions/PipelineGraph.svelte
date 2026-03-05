<script>
  import { EVENT_GROUPS, DEFAULT_GROUP } from "../../lib/events.js";
  import { getAvailableActions } from "../../lib/plugins/execution-service.js";

  let {
    eventType,
    eventTypes = null,
    group,
    commands = [],
    onExecute = undefined,
    executionState = null,
    policy = "auto",
  } = $props();

  let grpDef = $derived(
    group
      ? EVENT_GROUPS[group] || EVENT_GROUPS[DEFAULT_GROUP]
      : EVENT_GROUPS[DEFAULT_GROUP],
  );

  const PLUGIN_ACTIONS = (() => {
    const gmail = getAvailableActions("gmail");
    return [{ pluginId: "gmail", pluginName: "Gmail", actions: gmail }];
  })();

  const ACTION_ICONS = {
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
  };

  let enrichedCommands = $derived.by(() => {
    return commands.map((c) => {
      const clone = { ...c };
      if (
        clone.commandId &&
        clone.pluginId &&
        clone.commandId.startsWith(clone.pluginId + ":")
      ) {
        clone.commandId = clone.commandId.slice(clone.pluginId.length + 1);
      }
      const group = PLUGIN_ACTIONS.find((p) => p.pluginId === clone.pluginId);
      const handler = group?.actions.find(
        (a) => a.actionId === clone.commandId,
      );
      if (handler) {
        clone.name = clone.name || handler.name;
        clone.description = clone.description || handler.description;
        clone.icon = clone.icon || ACTION_ICONS[handler.actionId];
      } else {
        clone.name = clone.name || clone.commandId || "Unknown action";
      }
      return clone;
    });
  });
</script>

<div class="flex items-center overflow-x-auto py-3 gap-6">
  <!-- Trigger Node -->
  <div
    class="shrink-0 bg-card border border-border rounded-xl w-[260px] text-foreground flex flex-col shadow-sm"
  >
    <div
      class="p-2.5 pb-2 border-b border-border/50 flex items-center justify-between bg-card rounded-t-xl"
    >
      <div class="flex items-center gap-2">
        <div
          class="size-5 rounded bg-primary/10 flex items-center justify-center text-primary text-[10px] shrink-0 shadow-sm border border-primary/20"
        >
          ⚡
        </div>
        <span
          class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate"
          style:color={grpDef?.color}
        >
          {grpDef?.label || "Event"}
        </span>
      </div>
      <span
        class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-secondary"
        class:text-green-400={policy === "auto"}
        class:text-yellow-400={policy === "supervised"}
        class:text-red-400={policy === "manual"}
      >
        {policy}
      </span>
    </div>

    <div
      class="p-3 pt-2 flex flex-col gap-1.5 relative bg-background rounded-b-xl"
    >
      <div
        class="font-semibold text-xs text-foreground flex items-baseline gap-1.5"
      >
        <span class="text-muted-foreground text-[10px] font-mono">1.</span>
        <span class="truncate" title={eventType}>{eventType}</span>
      </div>

      {#if eventTypes && eventTypes.length > 0}
        <div class="flex flex-wrap gap-1 mt-1 pl-4">
          {#each eventTypes as et}
            <span
              class="text-[9px] px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground border border-border/50 uppercase truncate max-w-full"
            >
              {et}
            </span>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  {#if commands.length > 0}
    <!-- Connector Arrow -->
    <div class="flex items-center w-[20px] shrink-0 -mx-3 z-10">
      <div class="h-[2px] bg-border flex-1"></div>
      <div class="text-border text-[10px] -ml-1">▶</div>
    </div>
  {/if}

  {#each enrichedCommands as cmd, i}
    <!-- Action Node -->
    <div
      class="shrink-0 bg-card border border-border rounded-xl w-[260px] text-foreground flex flex-col shadow-sm relative group"
    >
      <div
        class="p-2.5 pb-2 border-b border-border/50 flex items-center justify-between bg-card rounded-t-xl"
      >
        <div class="flex items-center gap-2">
          <div
            class="size-5 rounded bg-secondary flex items-center justify-center text-foreground text-[10px] shrink-0 shadow-sm border border-border/50"
          >
            {cmd.icon || "⚙️"}
          </div>
          <span
            class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate"
          >
            {cmd.pluginId ? cmd.pluginId : "ACTION"}
          </span>
        </div>
      </div>

      <div class="p-3 pt-2 flex flex-col gap-1 bg-background rounded-b-xl">
        <div
          class="font-semibold text-xs text-foreground flex items-baseline gap-1.5"
        >
          <span class="text-muted-foreground text-[10px] font-mono"
            >{i + 2}.</span
          >
          <span class="truncate" title={cmd.name}>{cmd.name}</span>
        </div>

        {#if cmd.description}
          <div
            class="text-[10px] text-muted-foreground leading-snug line-clamp-1 pl-4 opacity-80"
            aria-label={cmd.description}
          >
            {cmd.description}
          </div>
        {/if}

        {#if !cmd.pluginId || !cmd.commandId}
          <div
            class="mt-1 ml-4 text-[8px] font-bold text-warning bg-warning/10 px-1 py-0.5 rounded-[3px] self-start uppercase"
          >
            Unbound
          </div>
        {/if}
      </div>
    </div>

    {#if i < commands.length - 1}
      <!-- Connector Arrow -->
      <div class="flex items-center w-[20px] shrink-0 -mx-3 z-10">
        <div class="h-[2px] bg-border flex-1"></div>
        <div class="text-border text-[10px] -ml-1">▶</div>
      </div>
    {/if}
  {/each}
</div>
