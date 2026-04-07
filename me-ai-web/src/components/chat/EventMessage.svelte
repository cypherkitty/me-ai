<script lang="ts">
  import PipelineGraph from "../actions/PipelineGraph.svelte";
  import TaskCard from "./TaskCard.svelte";
  import { stringToHue } from "../../lib/format.js";
  import {
    executePipeline,
    executePipelineBatch,
    isAuthenticated,
    EVENT_CATEGORY_TIERS,
  } from "../../lib/plugins/execution-service.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  import type { EmailEvent, ExecutionProgress } from "$lib/types.js";

  interface CommandShape {
    commandId?: string;
    pluginId?: string;
    name?: string;
    description?: string;
    icon?: string;
    [key: string]: unknown;
  }
  interface BatchItem {
    event: EmailLike;
    commands?: CommandShape[];
  }
  interface EmailLike {
    emailId?: string;
    subject?: string;
    from?: string;
    date?: number | string;
    summary?: string;
    reason?: string;
    tags?: string[];
    status?: string;
    type?: string;
    source?: string;
    data?: {
      subject?: string;
      from?: string;
      date?: string;
      snippet?: string;
      [k: string]: unknown;
    };
    metadata?: { category?: string; [k: string]: unknown };
    [k: string]: unknown;
  }
  interface CategoryBlock {
    eventType: string;
    category?: string;
    emails: EmailLike[];
    commands?: CommandShape[];
  }
  interface EventMsg {
    type?: string;
    event?: EmailEvent;
    items?: BatchItem[];
    categories?: CategoryBlock[];
    commands?: CommandShape[];
    total?: number;
    [key: string]: unknown;
  }
  interface ExecResult {
    success: boolean;
    message?: string;
    requiresApproval?: boolean;
    actions?: unknown[];
    category?: string;
  }
  interface ExecStateEntry {
    running: boolean;
    progress: ExecutionProgress | null;
    result: ExecResult | null;
  }
  interface ApprovalEntry {
    isBatch: boolean;
    event?: EmailEvent;
    emailId?: string;
    eventType?: string;
    emails?: EmailLike[];
    actions?: unknown[];
    category?: string;
  }
  interface TaskCardShape {
    type: string;
    role: string;
    title: string;
    model?: string;
    status: string;
    steps: TaskStep[];
    [key: string]: unknown;
  }
  interface TaskStep {
    id: string;
    label: string;
    status: string;
    expandable?: boolean;
    subContent?: string;
    startedAt?: number;
    [key: string]: unknown;
  }

  interface Props {
    msg: EventMsg;
    onexecuted?: () => void;
    ondismiss?: () => void;
  }
  let { msg, onexecuted, ondismiss }: Props = $props();

  let expandedCategories = $state<Record<string, boolean>>({});
  let executionState = $state<Record<string, ExecStateEntry>>({});
  let approvalPending = $state<Record<string, ApprovalEntry>>({});
  let executionCards = $state<Record<string, TaskCardShape>>({});

  function shortSender(from: string) {
    if (!from) return "—";
    const name = from.replace(/<.*>/, "").trim();
    return name.length > 40 ? name.slice(0, 38) + "…" : name;
  }

  function shortDate(ts: number | null | undefined) {
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

  function applyProgressToCard(key: string, progress: ExecutionProgress, title: string) {
    const card: TaskCardShape = executionCards[key] ?? {
      type: "task-card",
      role: "assistant",
      title,
      model: undefined,
      status: "running",
      steps: [],
    };

    if (progress.phase === "pipeline_loaded") {
      const actions = (progress.actions ?? []) as Array<Record<string, unknown>>;
      card.steps = actions.map((a) => ({
        id: (a.id ?? a.commandId) as string,
        label: (a.name ?? a.commandId) as string,
        status: "pending",
      }));
    } else if (progress.phase === "action_start") {
      card.steps = card.steps.map((s) =>
        s.id === (progress.actionId ?? progress.commandId)
          ? { ...s, status: "running", startedAt: Date.now() }
          : s
      );
    } else if (progress.phase === "action_complete") {
      const r = progress.result as { success?: boolean; message?: string } | undefined;
      const ok = r?.success !== false;
      card.steps = card.steps.map((s) =>
        s.id === (progress.actionId ?? progress.commandId)
          ? {
              ...s,
              status: ok ? "done" : "error",
              expandable: !!r?.message,
              subContent: r?.message ?? "",
            }
          : s
      );
    } else if (progress.phase === "done") {
      card.status = card.steps.every((s) => s.status !== "error") ? "done" : "error";
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

  async function handleExecute(event: EmailEvent, emailId: string, approved = false) {
    if (!(await isAuthenticated())) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }
    const stateKey = `single_${emailId}`;
    const subject = event.data?.subject ?? event.type;
    const shortSubj = subject.length > 38 ? subject.slice(0, 36) + "…" : subject;
    executionState[stateKey] = { running: true, progress: null, result: null };
    executionCards = {
      ...executionCards,
      [stateKey]: {
        type: "task-card",
        role: "assistant",
        title: shortSubj,
        model: undefined,
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
        approved
      );

      if (result.success !== false && result.requiresApproval) {
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
          category: result.category,
          isBatch: false,
        };
        return;
      }
      executionState[stateKey] = { running: false, progress: null, result };
      if (result.success) onexecuted?.();
    } catch (error) {
      const errMsg = (error as Error)?.message ?? String(error);
      executionState[stateKey] = {
        running: false,
        progress: null,
        result: { success: false, message: errMsg },
      };
      applyProgressToCard(stateKey, { phase: "error", error: errMsg }, shortSubj);
    }
  }

  async function handleExecuteGroup(eventType: string, emails: EmailLike[], approved = false) {
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
        model: undefined,
        status: "running",
        steps: [],
      },
    };

    try {
      const result = await executePipelineBatch(
        eventType,
        emails as unknown as Array<Record<string, unknown>>,
        (progress) => {
          executionState[stateKey] = { ...executionState[stateKey], progress };
          applyProgressToCard(stateKey, progress, title);
        },
        approved
      );

      if (result.success !== false && result.requiresApproval) {
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
          category: result.category,
          isBatch: true,
        };
        return;
      }
      executionState[stateKey] = { running: false, progress: null, result };
      if (result.success) onexecuted?.();
    } catch (error) {
      const errMsg = (error as Error)?.message ?? String(error);
      executionState[stateKey] = {
        running: false,
        progress: null,
        result: { success: false, message: errMsg },
      };
      applyProgressToCard(stateKey, { phase: "error", error: errMsg }, title);
    }
  }

  async function handleApprove(stateKey: string) {
    const pending = approvalPending[stateKey];
    if (!pending) return;
    delete approvalPending[stateKey];
    approvalPending = { ...approvalPending };
    if (pending.isBatch)
      await handleExecuteGroup(pending.eventType ?? "", pending.emails ?? [], true);
    else await handleExecute(pending.event!, pending.emailId ?? "", true);
  }

  function handleDismissApproval(stateKey: string) {
    delete approvalPending[stateKey];
    approvalPending = { ...approvalPending };
  }

  function toggleCategory(eventType: string) {
    expandedCategories = {
      ...expandedCategories,
      [eventType]: !expandedCategories[eventType],
    };
  }

  function formatLabel(str: string) {
    return str
      .split("_")
      .map((w: string) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  }

  function eventTypeColor(eventType: string) {
    return `hsl(${stringToHue(eventType)}, 55%, 55%)`;
  }

  function getExecutionState(key: string) {
    return executionState[key];
  }
</script>

<!-- ── Reusable snippets ───────────────────────────────────────────── -->

{#snippet execBtn(
  label: string,
  isCritical: boolean,
  isRunning: boolean,
  result: ExecResult | null | undefined,
  onclick_fn: () => void
)}
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
        "hover:opacity-80 !border-green-500/50 !text-green-500 !bg-green-500/10 cursor-pointer !ring-0 !ring-offset-0"
    )}
  >
    {#if isRunning}Running…
    {:else if result}{result.success ? "Done (Dismiss)" : "Failed"}
    {:else if isCritical}Review
    {:else}{label}
    {/if}
  </Button>
{/snippet}

{#snippet approvalCard(
  title: string,
  body: string,
  actions: CommandShape[],
  stateKey: string,
  compact: boolean
)}
  <div
    class={cn(
      "rounded border border-warning/25 bg-warning/6",
      compact ? "flex flex-wrap items-center gap-2 px-3 py-2" : "flex flex-col gap-2 px-3 py-2.5"
    )}
  >
    <div class="flex items-center gap-1.5">
      <span class="text-sm">⚠️</span>
      <span class="text-xs font-bold text-warning">{title}</span>
    </div>
    {#if body}
      <p class="text-[0.62rem] text-muted-foreground leading-relaxed">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html body}
      </p>
    {/if}
    {#if actions?.length}
      <ul class="list-disc pl-4 text-[0.6rem] text-muted-foreground space-y-0.5">
        {#each actions as action (action.name)}
          <li>
            {#if action.icon}<span>{action.icon}</span>{/if}
            <strong class="text-foreground/70">{action.name}</strong>
            {#if action.description}<span class="opacity-60"> — {action.description}</span>{/if}
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

{#snippet eventCard(event: EmailEvent, compact: boolean)}
  <div
    class={cn(
      "rounded border border-border flex flex-col gap-1",
      compact ? "bg-transparent border-none p-0" : "bg-card px-3 py-2.5"
    )}
  >
    <div class="flex items-center gap-2">
      <span
        class="text-[0.55rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-success/8 text-success"
      >
        {event.type}
      </span>
      <span class="text-[0.52rem] uppercase tracking-wide text-muted-foreground/40"
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
            · {shortDate(typeof event.data.date === "number" ? event.data.date : null)}</span
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
        {#each event.metadata.tags as tag (tag)}
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
    {@render eventCard(msg.event!, false)}

    {#if msg.commands?.length}
      {@const _ev = msg.event!}
      {@const execStateKey = `single_${(_ev.data.emailId as string) || Date.now()}`}
      {@const execState = getExecutionState(execStateKey)}
      {@const execApproval = approvalPending[execStateKey]}
      {@const categoryDef = _ev.metadata?.category
        ? EVENT_CATEGORY_TIERS[_ev.metadata.category] || EVENT_CATEGORY_TIERS["CRITICAL"]
        : null}

      <div class="flex items-center justify-between gap-2">
        <span class="text-[0.55rem] font-bold uppercase tracking-wider text-muted-foreground/35"
          >Action Pipeline</span
        >
        {#if !execApproval}
          {@render execBtn(
            "Execute",
            categoryDef?.requiresApproval ?? false,
            execState?.running ?? false,
            execState?.result,
            () => handleExecute(_ev, _ev.data.emailId as string)
          )}
        {/if}
      </div>

      {#if execApproval}
        {@render approvalCard("Confirm execution?", "", [], execStateKey, true)}
      {/if}

      <PipelineGraph
        eventType={_ev.type}
        category={_ev.metadata?.category}
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
    <p class="text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground/50">
      Processed {msg.items?.length ?? 0} email{(msg.items?.length ?? 0) === 1 ? "" : "s"}
    </p>
    {#each msg.items ?? [] as item (item.event?.data?.emailId ?? item.event?.type)}
      <div class="rounded border border-border bg-background px-3 py-2.5 flex flex-col gap-1.5">
        {@render eventCard(item.event as unknown as EmailEvent, true)}
        <PipelineGraph
          eventType={item.event.type ?? ""}
          category={item.event.metadata?.category}
          commands={item.commands}
        />
      </div>
    {/each}
  </div>

  <!-- ── Events by category ──────────────────────────────────────────── -->
{:else if msg.type === "events-by-category"}
  <div class="self-start w-full max-w-[95%] flex flex-col gap-2">
    <div class="flex items-baseline gap-3 py-1">
      <span class="text-xs font-bold uppercase tracking-wider text-foreground">Events</span>
      <span class="text-[0.62rem] text-muted-foreground/40">
        {msg.total} email{msg.total === 1 ? "" : "s"} in {msg.categories?.length ?? 0} event type{(msg
          .categories?.length ?? 0) === 1
          ? ""
          : "s"}
      </span>
    </div>

    {#each msg.categories ?? [] as catBlock (catBlock.eventType)}
      {@const isExpanded = expandedCategories[catBlock.eventType] ?? true}
      {@const batchStateKey = `batch_${catBlock.eventType}`}
      {@const batchState = getExecutionState(batchStateKey)}
      {@const batchApproval = approvalPending[batchStateKey]}
      {@const categoryDef = catBlock.category
        ? (
            EVENT_CATEGORY_TIERS as Record<
              string,
              (typeof EVENT_CATEGORY_TIERS)[keyof typeof EVENT_CATEGORY_TIERS]
            >
          )[catBlock.category] || EVENT_CATEGORY_TIERS["CRITICAL"]
        : null}

      <div class="rounded border border-border bg-card overflow-hidden">
        <!-- Category header row -->
        <div class="flex items-center gap-2 px-1 py-0.5">
          <button
            onclick={() => toggleCategory(catBlock.eventType)}
            class="flex items-center gap-2 flex-1 px-3 py-2.5 text-left hover:bg-accent transition-colors"
          >
            <span
              class="text-[0.58rem] font-bold tracking-wider px-1.5 py-0.5 rounded text-white shrink-0"
              style:background={eventTypeColor(catBlock.eventType)}
            >
              {formatLabel(catBlock.eventType)}
            </span>
            {#if categoryDef}
              <span
                class="text-[0.5rem] font-bold uppercase tracking-wider shrink-0"
                style:color={categoryDef.color}
                title={categoryDef.description}>{categoryDef.label}</span
              >
            {/if}
            <span class="text-sm font-semibold text-foreground min-w-[18px]"
              >{catBlock.emails.length}</span
            >
            <span class="flex-1"></span>
            <svg
              class={cn(
                "size-3.5 text-muted-foreground/30 transition-transform",
                isExpanded && "rotate-180"
              )}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {#if !batchApproval && catBlock.emails.some((e) => (e as Record<string, unknown>).status !== "executed")}
            <Button
              variant="outline"
              size="sm"
              onclick={(e: MouseEvent) => {
                e.stopPropagation();
                if (batchState?.result?.success) {
                  onexecuted?.();
                  ondismiss?.();
                } else {
                  handleExecuteGroup(
                    catBlock.eventType,
                    catBlock.emails.filter(
                      (e) => (e as Record<string, unknown>).status !== "executed"
                    )
                  );
                }
              }}
              disabled={batchState?.running}
              class={cn(
                "h-6 text-[0.6rem] font-bold uppercase tracking-wider px-2 mr-2 shrink-0 pointer-events-auto",
                categoryDef?.requiresApproval
                  ? "text-warning border-warning/25 bg-warning/6 hover:bg-warning/12 hover:border-warning/40"
                  : "text-primary border-primary/25 bg-primary/6 hover:bg-primary/12 hover:border-primary/40",
                batchState?.result?.success &&
                  "hover:opacity-80 !border-green-500/50 !text-green-500 !bg-green-500/10 cursor-pointer !ring-0 !ring-offset-0"
              )}
            >
              {#if batchState?.running}Running…
              {:else if batchState?.result}
                {batchState.result.success ? `Done (Dismiss)` : "Failed"}
              {:else if categoryDef?.requiresApproval}Review & Execute ({catBlock.emails.filter(
                  (e) => (e as Record<string, unknown>).status !== "executed"
                ).length})
              {:else}Execute All ({catBlock.emails.filter(
                  (e) => (e as Record<string, unknown>).status !== "executed"
                ).length})
              {/if}
            </Button>
          {/if}
        </div>

        <!-- Approval dialog -->
        {#if batchApproval}
          <div class="px-3 pb-3">
            {@render approvalCard(
              "Review required — this is a CRITICAL event type",
              `The following actions will run on <strong>${catBlock.emails.length} email${catBlock.emails.length === 1 ? "" : "s"}</strong>. This changes email state and cannot be undone easily.`,
              (batchApproval.actions ?? []) as CommandShape[],
              batchStateKey,
              false
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
            {#each catBlock.emails as email (email.emailId)}
              {@const execStateKey = `single_${email.emailId}`}
              {@const execState = getExecutionState(execStateKey)}
              {@const execApproval = approvalPending[execStateKey]}
              <div class="flex flex-col gap-2 px-3.5 py-2.5 border-b border-border last:border-b-0">
                <!-- Email info -->
                <div class="flex flex-col gap-0.5">
                  <div class="text-[0.73rem] font-medium text-foreground leading-snug">
                    {email.subject}
                  </div>
                  <div class="text-[0.58rem] text-muted-foreground/40">
                    {#if email.from}<span class="opacity-70">{shortSender(email.from ?? "")}</span
                      >{/if}
                    {#if email.date}<span class="opacity-50">
                        · {shortDate(typeof email.date === "number" ? email.date : null)}</span
                      >{/if}
                  </div>
                  {#if email.summary}
                    <div class="text-[0.63rem] text-muted-foreground/60 leading-relaxed mt-0.5">
                      {email.summary}
                    </div>
                  {/if}
                  {#if email.tags?.length}
                    <div class="flex flex-wrap gap-1 mt-0.5">
                      {#each email.tags as tag (tag)}
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
                        categoryDef?.requiresApproval ?? false,
                        execState?.running ?? false,
                        execState?.result,
                        () =>
                          handleExecute(
                            {
                              type: catBlock.eventType,
                              source: "gmail",
                              data: email as EmailEvent["data"],
                            },
                            email.emailId ?? ""
                          )
                      )}
                    {/if}
                  </div>

                  {#if email.status !== "executed" && execApproval}
                    {@render approvalCard("Confirm execution?", "", [], execStateKey, true)}
                  {/if}

                  {#if catBlock.commands?.length}
                    <PipelineGraph
                      eventType={catBlock.eventType}
                      category={catBlock.category}
                      commands={catBlock.commands}
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
