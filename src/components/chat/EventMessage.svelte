<script>
  import CommandCard from "./CommandCard.svelte";
  import PipelineGraph from "../actions/PipelineGraph.svelte";
  import TaskCard from "./TaskCard.svelte";
  import { stringToHue } from "../../lib/format.js";
  import {
    executePipeline,
    executePipelineBatch,
    isAuthenticated,
    EVENT_GROUPS,
  } from "../../lib/plugins/execution-service.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { cn } from "$lib/utils.js";

  let { msg, oncommand, onexecuted, ondismiss } = $props();

  let expandedGroups = $state({});
  let executionState = $state({});
  let approvalPending = $state({});
  let executionCards = $state({});

  function shortSender(from) {
    if (!from) return "—";
    const name = from.replace(/<.*>/, "").trim();
    return name.length > 40 ? name.slice(0, 38) + "…" : name;
  }

  function shortDate(ts) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }

  function applyProgressToCard(key, progress, title) {
    const card = executionCards[key] ?? {
      type: "task-card",
      role: "assistant",
      title,
      model: null,
      status: "running",
      steps: [],
    };

    if (progress.phase === "pipeline_loaded") {
      card.steps = progress.actions.map((a) => ({
        id: a.id ?? a.commandId,
        label: a.name ?? a.commandId,
        status: "pending",
      }));
    } else if (progress.phase === "action_start") {
      card.steps = card.steps.map((s) =>
        s.id === (progress.actionId ?? progress.commandId)
          ? { ...s, status: "running", startedAt: Date.now() }
          : s,
      );
    } else if (progress.phase === "action_complete") {
      const ok = progress.result?.success !== false;
      card.steps = card.steps.map((s) =>
        s.id === (progress.actionId ?? progress.commandId)
          ? {
              ...s,
              status: ok ? "done" : "error",
              expandable: !!progress.result?.message,
              subContent: progress.result?.message ?? "",
            }
          : s,
      );
    } else if (progress.phase === "done") {
      card.status = card.steps.every((s) => s.status !== "error")
        ? "done"
        : "error";
    } else if (progress.phase === "error") {
      card.status = "error";
      card.steps = [
        ...card.steps.filter((s) => s.status !== "running"),
        {
          id: "__err",
          label: progress.error ?? "Execution failed",
          status: "error",
        },
      ];
    }
    executionCards = { ...executionCards, [key]: { ...card } };
  }

  async function handleExecute(event, emailId, approved = false) {
    if (!(await isAuthenticated())) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }
    const stateKey = `single_${emailId}`;
    const subject = event.data?.subject ?? event.type;
    const shortSubj =
      subject.length > 38 ? subject.slice(0, 36) + "…" : subject;
    executionState[stateKey] = { running: true, progress: null, result: null };
    executionCards = {
      ...executionCards,
      [stateKey]: {
        type: "task-card",
        role: "assistant",
        title: shortSubj,
        model: null,
        status: "running",
        steps: [],
      },
    };

    try {
      const result = await executePipeline(
        event,
        (progress) => {
          executionState[stateKey] = { ...executionState[stateKey], progress };
          applyProgressToCard(stateKey, progress, shortSubj);
        },
        approved,
      );

      if (result.requiresApproval) {
        executionState[stateKey] = {
          running: false,
          progress: null,
          result: null,
        };
        delete executionCards[stateKey];
        executionCards = { ...executionCards };
        approvalPending[stateKey] = {
          event,
          emailId,
          actions: result.actions,
          group: result.group,
          isBatch: false,
        };
        return;
      }
      executionState[stateKey] = { running: false, progress: null, result };
      if (result.success) onexecuted?.();
    } catch (error) {
      executionState[stateKey] = {
        running: false,
        progress: null,
        result: { success: false, message: error.message },
      };
      applyProgressToCard(
        stateKey,
        { phase: "error", error: error.message },
        shortSubj,
      );
    }
  }

  async function handleExecuteGroup(eventType, emails, approved = false) {
    if (!(await isAuthenticated())) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }
    const stateKey = `batch_${eventType}`;
    const title = `${formatLabel(eventType)} (${emails.length})`;
    executionState[stateKey] = { running: true, progress: null, result: null };
    executionCards = {
      ...executionCards,
      [stateKey]: {
        type: "task-card",
        role: "assistant",
        title,
        model: null,
        status: "running",
        steps: [],
      },
    };

    try {
      const result = await executePipelineBatch(
        eventType,
        emails,
        (progress) => {
          executionState[stateKey] = { ...executionState[stateKey], progress };
          applyProgressToCard(stateKey, progress, title);
        },
        approved,
      );

      if (result.requiresApproval) {
        executionState[stateKey] = {
          running: false,
          progress: null,
          result: null,
        };
        delete executionCards[stateKey];
        executionCards = { ...executionCards };
        approvalPending[stateKey] = {
          eventType,
          emails,
          actions: result.actions,
          group: result.group,
          isBatch: true,
        };
        return;
      }
      executionState[stateKey] = { running: false, progress: null, result };
      if (result.success) onexecuted?.();
    } catch (error) {
      executionState[stateKey] = {
        running: false,
        progress: null,
        result: { success: false, message: error.message },
      };
      applyProgressToCard(
        stateKey,
        { phase: "error", error: error.message },
        title,
      );
    }
  }

  async function handleApprove(stateKey) {
    const pending = approvalPending[stateKey];
    if (!pending) return;
    delete approvalPending[stateKey];
    approvalPending = { ...approvalPending };
    if (pending.isBatch)
      await handleExecuteGroup(pending.eventType, pending.emails, true);
    else await handleExecute(pending.event, pending.emailId, true);
  }

  function handleDismissApproval(stateKey) {
    delete approvalPending[stateKey];
    approvalPending = { ...approvalPending };
  }

  function toggleGroup(eventType) {
    expandedGroups = {
      ...expandedGroups,
      [eventType]: !expandedGroups[eventType],
    };
  }

  function formatLabel(str) {
    return str
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  }

  function eventTypeColor(eventType) {
    return `hsl(${stringToHue(eventType)}, 55%, 55%)`;
  }

  function getExecutionState(key) {
    return executionState[key];
  }
</script>

<!-- ── Reusable snippets ───────────────────────────────────────────── -->

{#snippet execBtn(label, isCritical, isRunning, result, onclick_fn)}
  <Button
    variant="outline"
    size="sm"
    onclick={() => {
      if (result?.success) {
        onexecuted?.();
        ondismiss?.();
      } else {
        onclick_fn();
      }
    }}
    disabled={isRunning}
    class={cn(
      "h-6 text-[0.6rem] font-bold uppercase tracking-wider px-2 shrink-0 pointer-events-auto",
      isCritical
        ? "text-warning border-warning/25 bg-warning/6 hover:bg-warning/12 hover:border-warning/40"
        : "text-primary border-primary/25 bg-primary/6 hover:bg-primary/12 hover:border-primary/40",
      result?.success &&
        "hover:opacity-80 !border-green-500/50 !text-green-500 !bg-green-500/10 cursor-pointer !ring-0 !ring-offset-0",
    )}
  >
    {#if isRunning}Running…
    {:else if result}{result.success ? "Done (Dismiss)" : "Failed"}
    {:else if isCritical}Review
    {:else}{label}
    {/if}
  </Button>
{/snippet}

{#snippet approvalCard(title, body, actions, stateKey, compact)}
  <div
    class={cn(
      "rounded border border-warning/25 bg-warning/6",
      compact
        ? "flex flex-wrap items-center gap-2 px-3 py-2"
        : "flex flex-col gap-2 px-3 py-2.5",
    )}
  >
    <div class="flex items-center gap-1.5">
      <span class="text-sm">⚠️</span>
      <span class="text-xs font-bold text-warning">{title}</span>
    </div>
    {#if body}
      <p class="text-[0.62rem] text-muted-foreground leading-relaxed">
        {@html body}
      </p>
    {/if}
    {#if actions?.length}
      <ul
        class="list-disc pl-4 text-[0.6rem] text-muted-foreground space-y-0.5"
      >
        {#each actions as action}
          <li>
            {#if action.icon}<span>{action.icon}</span>{/if}
            <strong class="text-foreground/70">{action.name}</strong>
            {#if action.description}<span class="opacity-60">
                — {action.description}</span
              >{/if}
          </li>
        {/each}
      </ul>
    {/if}
    <div class="flex gap-1.5">
      <Button
        variant="outline"
        size="sm"
        onclick={() => handleApprove(stateKey)}
        class="h-6 text-[0.6rem] font-bold text-warning border-warning/30 bg-warning/10 hover:bg-warning/20 px-2"
      >
        ✓ Confirm
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onclick={() => handleDismissApproval(stateKey)}
        class="h-6 text-[0.6rem] opacity-60 hover:opacity-100 px-2"
      >
        Cancel
      </Button>
    </div>
  </div>
{/snippet}

{#snippet eventCard(event, compact)}
  <div
    class={cn(
      "rounded border border-border flex flex-col gap-1",
      compact ? "bg-transparent border-none p-0" : "bg-card px-3 py-2.5",
    )}
  >
    <div class="flex items-center gap-2">
      <span
        class="text-[0.55rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-success/8 text-success"
      >
        {event.type}
      </span>
      <span
        class="text-[0.52rem] uppercase tracking-wide text-muted-foreground/40"
        >{event.source}</span
      >
      {#if compact && event.data?.subject}
        <span class="text-[0.66rem] text-muted-foreground truncate flex-1"
          >{event.data.subject}</span
        >
      {/if}
    </div>
    {#if !compact && event.data?.subject}
      <div class="text-[0.76rem] font-medium text-foreground leading-snug">
        {event.data.subject}
      </div>
    {/if}
    {#if event.data?.from || event.data?.date}
      <div class="text-[0.58rem] text-muted-foreground/40">
        {#if event.data?.from}{shortSender(event.data.from)}{/if}
        {#if event.data?.date}<span class="opacity-70">
            · {shortDate(event.data.date)}</span
          >{/if}
      </div>
    {/if}
    {#if event.metadata?.summary}
      <div class="text-[0.66rem] text-muted-foreground/70 leading-relaxed">
        {event.metadata.summary}
      </div>
    {/if}
    {#if event.metadata?.tags?.length}
      <div class="flex flex-wrap gap-1">
        {#each event.metadata.tags as tag}
          <span
            class="text-[0.52rem] font-semibold text-muted-foreground bg-foreground/4 px-1.5 py-0.5 rounded"
            >{tag}</span
          >
        {/each}
      </div>
    {/if}
    {#if event.metadata?.reason}
      <div class="text-[0.58rem] text-muted-foreground/40 italic">
        {event.metadata.reason}
      </div>
    {/if}
  </div>
{/snippet}

<!-- ── Single event ─────────────────────────────────────────────────── -->
{#if msg.type === "event"}
  <div class="self-start max-w-[90%] flex flex-col gap-1.5">
    {@render eventCard(msg.event, false)}

    {#if msg.commands?.length}
      {@const execStateKey = `single_${msg.event.data.emailId || Date.now()}`}
      {@const execState = getExecutionState(execStateKey)}
      {@const execApproval = approvalPending[execStateKey]}
      {@const grpDef = msg.event.metadata?.group
        ? EVENT_GROUPS[msg.event.metadata.group] || EVENT_GROUPS["CRITICAL"]
        : null}

      <div class="flex items-center justify-between gap-2">
        <span
          class="text-[0.55rem] font-bold uppercase tracking-wider text-muted-foreground/35"
          >Action Pipeline</span
        >
        {#if !execApproval}
          {@render execBtn(
            "Execute",
            grpDef?.requiresApproval,
            execState?.running,
            execState?.result,
            () => handleExecute(msg.event, msg.event.data.emailId),
          )}
        {/if}
      </div>

      {#if execApproval}
        {@render approvalCard(
          "Confirm execution?",
          null,
          null,
          execStateKey,
          true,
        )}
      {/if}

      <PipelineGraph
        eventType={msg.event.type}
        group={msg.event.metadata?.group}
        commands={msg.commands}
      />

      {#if executionCards[execStateKey] && executionCards[execStateKey].steps?.length > 0}
        <div class="mt-1 w-full">
          <TaskCard msg={executionCards[execStateKey]} />
        </div>
      {/if}
    {/if}
  </div>

  <!-- ── Batch events ─────────────────────────────────────────────────── -->
{:else if msg.type === "event-batch"}
  <div class="self-start max-w-[90%] flex flex-col gap-2">
    <p
      class="text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground/50"
    >
      Processed {msg.items.length} email{msg.items.length === 1 ? "" : "s"}
    </p>
    {#each msg.items as item}
      <div
        class="rounded border border-border bg-background px-3 py-2.5 flex flex-col gap-1.5"
      >
        {@render eventCard(item.event, true)}
        <PipelineGraph
          eventType={item.event.type}
          group={item.event.metadata?.group}
          commands={item.commands}
        />
      </div>
    {/each}
  </div>

  <!-- ── Grouped events ──────────────────────────────────────────────── -->
{:else if msg.type === "events-grouped"}
  <div class="self-start w-full max-w-[95%] flex flex-col gap-2">
    <div class="flex items-baseline gap-3 py-1">
      <span class="text-xs font-bold uppercase tracking-wider text-foreground"
        >Events</span
      >
      <span class="text-[0.62rem] text-muted-foreground/40">
        {msg.total} email{msg.total === 1 ? "" : "s"} in {msg.groups.length} event
        type{msg.groups.length === 1 ? "" : "s"}
      </span>
    </div>

    {#each msg.groups as group}
      {@const isExpanded = expandedGroups[group.eventType] ?? true}
      {@const batchStateKey = `batch_${group.eventType}`}
      {@const batchState = getExecutionState(batchStateKey)}
      {@const batchApproval = approvalPending[batchStateKey]}
      {@const grpDef = group.group
        ? EVENT_GROUPS[group.group] || EVENT_GROUPS["CRITICAL"]
        : null}

      <div class="rounded border border-border bg-card overflow-hidden">
        <!-- Group header row -->
        <div class="flex items-center gap-2 px-1 py-0.5">
          <button
            onclick={() => toggleGroup(group.eventType)}
            class="flex items-center gap-2 flex-1 px-3 py-2.5 text-left hover:bg-accent transition-colors"
          >
            <span
              class="text-[0.58rem] font-bold tracking-wider px-1.5 py-0.5 rounded text-white shrink-0"
              style:background={eventTypeColor(group.eventType)}
            >
              {formatLabel(group.eventType)}
            </span>
            {#if grpDef}
              <span
                class="text-[0.5rem] font-bold uppercase tracking-wider shrink-0"
                style:color={grpDef.color}
                title={grpDef.description}>{grpDef.label}</span
              >
            {/if}
            <span class="text-sm font-semibold text-foreground min-w-[18px]"
              >{group.emails.length}</span
            >
            <span class="flex-1"></span>
            <svg
              class={cn(
                "size-3.5 text-muted-foreground/30 transition-transform",
                isExpanded && "rotate-180",
              )}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {#if !batchApproval && group.emails.some((e) => e.status !== "executed")}
            <Button
              variant="outline"
              size="sm"
              onclick={(e) => {
                e.stopPropagation();
                if (batchState?.result?.success) {
                  onexecuted?.();
                  ondismiss?.();
                } else {
                  handleExecuteGroup(
                    group.eventType,
                    group.emails.filter((e) => e.status !== "executed"),
                  );
                }
              }}
              disabled={batchState?.running}
              class={cn(
                "h-6 text-[0.6rem] font-bold uppercase tracking-wider px-2 mr-2 shrink-0 pointer-events-auto",
                grpDef?.requiresApproval
                  ? "text-warning border-warning/25 bg-warning/6 hover:bg-warning/12 hover:border-warning/40"
                  : "text-primary border-primary/25 bg-primary/6 hover:bg-primary/12 hover:border-primary/40",
                batchState?.result?.success &&
                  "hover:opacity-80 !border-green-500/50 !text-green-500 !bg-green-500/10 cursor-pointer !ring-0 !ring-offset-0",
              )}
            >
              {#if batchState?.running}Running…
              {:else if batchState?.result}
                {batchState.result.success
                  ? `Done (Dismiss) (${batchState.result.successful ?? "?"}/${batchState.result.total ?? "?"})`
                  : "Failed"}
              {:else if grpDef?.requiresApproval}Review & Execute ({group.emails
                  .filter((e) => e.status !== "executed")
                  .length})
              {:else}Execute All ({group.emails.filter((e) => e.status !== "executed").length})
              {/if}
            </Button>
          {/if}
        </div>

        <!-- Approval dialog -->
        {#if batchApproval}
          <div class="px-3 pb-3">
            {@render approvalCard(
              "Review required — this is a CRITICAL event type",
              `The following actions will run on <strong>${group.emails.length} email${group.emails.length === 1 ? "" : "s"}</strong>. This changes email state and cannot be undone easily.`,
              batchApproval.actions,
              batchStateKey,
              false,
            )}
          </div>
        {/if}

        <!-- Batch execution task card -->
        {#if executionCards[batchStateKey] && !batchApproval && executionCards[batchStateKey].steps?.length > 0}
          <div class="px-3 pb-3">
            <TaskCard msg={executionCards[batchStateKey]} />
          </div>
        {/if}

        <!-- Email list -->
        {#if isExpanded}
          <div class="border-t border-border flex flex-col">
            {#each group.emails as email}
              {@const execStateKey = `single_${email.emailId}`}
              {@const execState = getExecutionState(execStateKey)}
              {@const execApproval = approvalPending[execStateKey]}
              <div
                class="flex flex-col gap-2 px-3.5 py-2.5 border-b border-border last:border-b-0"
              >
                <!-- Email info -->
                <div class="flex flex-col gap-0.5">
                  <div
                    class="text-[0.73rem] font-medium text-foreground leading-snug"
                  >
                    {email.subject}
                  </div>
                  <div class="text-[0.58rem] text-muted-foreground/40">
                    {#if email.from}<span class="opacity-70"
                        >{shortSender(email.from)}</span
                      >{/if}
                    {#if email.date}<span class="opacity-50">
                        · {shortDate(email.date)}</span
                      >{/if}
                  </div>
                  {#if email.summary}
                    <div
                      class="text-[0.63rem] text-muted-foreground/60 leading-relaxed mt-0.5"
                    >
                      {email.summary}
                    </div>
                  {/if}
                  {#if email.tags?.length}
                    <div class="flex flex-wrap gap-1 mt-0.5">
                      {#each email.tags as tag}
                        <span
                          class="text-[0.52rem] font-semibold text-muted-foreground bg-foreground/4 px-1.5 py-0.5 rounded"
                          >{tag}</span
                        >
                      {/each}
                    </div>
                  {/if}
                </div>

                <!-- Per-email pipeline -->
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center justify-between gap-2">
                    <span
                      class="text-[0.55rem] font-bold uppercase tracking-wider text-muted-foreground/35"
                      >Action Pipeline</span
                    >
                    {#if email.status !== "executed" && !execApproval}
                      {@render execBtn(
                        "Execute",
                        grpDef?.requiresApproval,
                        execState?.running,
                        execState?.result,
                        () =>
                          handleExecute(
                            {
                              type: group.eventType,
                              source: "gmail",
                              data: email,
                            },
                            email.emailId,
                          ),
                      )}
                    {/if}
                  </div>

                  {#if email.status !== "executed" && execApproval}
                    {@render approvalCard(
                      "Confirm execution?",
                      null,
                      null,
                      execStateKey,
                      true,
                    )}
                  {/if}

                  {#if group.commands?.length}
                    <PipelineGraph
                      eventType={group.eventType}
                      group={group.group}
                      commands={group.commands}
                    />
                  {:else}
                    <p class="text-[0.58rem] text-muted-foreground/35 italic">
                      No actions defined — configure in Control Board
                    </p>
                  {/if}

                  {#if executionCards[execStateKey] && !execApproval && executionCards[execStateKey].steps?.length > 0}
                    <div class="mt-0.5">
                      <TaskCard msg={executionCards[execStateKey]} />
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}
