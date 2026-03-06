<script>
  import { onMount } from "svelte";
  import {
    getPendingApprovals,
    rejectClassification,
    getCategoryPipelines,
  } from "../lib/rules.js";
  import { executePipeline } from "../lib/plugins/execution-service.js";
  import { updateClassificationStatus } from "../lib/triage.js";
  import { query } from "../lib/store/db.js";
  import PipelineTrace from "../components/PipelineTrace.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { cn } from "$lib/utils.js";
  import {
    Clock,
    CheckCircle,
    XCircle,
    RefreshCw,
    Mail,
    Play,
    Loader,
  } from "lucide-svelte";

  let events = $state([]);
  let loading = $state(true);
  let selected = $state(null);
  /** @type {Record<string, { running: boolean, steps: any[], success?: boolean, error?: string }>} */
  let execState = $state({});

  async function load() {
    loading = true;
    execState = {};
    try {
      events = await getPendingApprovals({ limit: 100 });
    } catch (e) {
      console.error("ApprovalsView:", e);
    }
    loading = false;
    if (events.length && !selected) selected = events[0];
  }

  onMount(load);

  /** Execute the selected event's pipeline right here in the dashboard */
  async function execute(evt) {
    const id = evt.id;
    // Look up the full email data needed by executePipeline
    let emailData;
    try {
      const rows = await query(`SELECT * FROM items WHERE id = ?`, [id]);
      emailData = rows[0] ?? {};
    } catch {
      emailData = {};
    }

    execState[id] = { running: true, steps: [] };

    const event = {
      type: evt.event_type || "UNKNOWN",
      source: emailData.sourceType || "gmail",
      data: {
        id,
        emailId: id,
        subject: emailData.subject ?? evt.subject,
        from: emailData.from ?? evt.from ?? evt.source_name,
        ...emailData,
      },
      metadata: { category: evt.event_category },
    };

    // Use the same category pipeline as Pipelines view (e.g. Important → Star + Mark as Important)
    const categoryName = (evt.event_category || "").toLowerCase().trim();
    const pipelines = await getCategoryPipelines();
    const cat = pipelines.find(
      (c) => c.category?.toLowerCase().trim() === categoryName
    );
    const actionsOverride = cat?.actions?.length ? cat.actions : undefined;

    const result = await executePipeline(
      event,
      (progress) => {
        const st = execState[id] || { running: true, steps: [] };
        if (progress.phase === "pipeline_loaded") {
          execState[id] = {
            ...st,
            steps: progress.actions.map((a) => ({
              label: a.name ?? a.commandId,
              commandId: a.commandId,
              status: "pending",
            })),
          };
        } else if (progress.phase === "action_start") {
          execState[id] = {
            ...st,
            steps: st.steps.map((s) =>
              s.commandId === (progress.actionId ?? progress.commandId)
                ? { ...s, status: "running" }
                : s,
            ),
          };
        } else if (progress.phase === "action_complete") {
          const ok = progress.result?.success !== false;
          execState[id] = {
            ...st,
            steps: st.steps.map((s) =>
              s.commandId === (progress.actionId ?? progress.commandId)
                ? {
                    ...s,
                    status: ok ? "done" : "error",
                    message: progress.result?.message,
                  }
                : s,
            ),
          };
        }
      },
      true /* approved */,
      actionsOverride ? { actionsOverride } : undefined,
    );

    execState[id] = {
      ...execState[id],
      running: false,
      success: result.success,
      error: result.message,
    };

    if (result.success) {
      // Persist the executed status so this email doesn't reappear on refresh
      try {
        await updateClassificationStatus(id, "executed");
      } catch {}
      // Remove from pending list after a short delay so the user sees success
      setTimeout(() => {
        events = events.filter((e) => e.id !== id);
        if (selected?.id === id) selected = events[0] ?? null;
        delete execState[id];
      }, 1500);
    }
  }

  async function reject(evt) {
    try {
      await rejectClassification(evt.id);
      events = events.filter((e) => e.id !== evt.id);
      if (selected?.id === evt.id) selected = events[0] ?? null;
    } catch (e) {
      console.error("Reject:", e);
    }
  }

  function formatTime(ts) {
    if (!ts) return "";
    const d = new Date(Number(ts));
    const diffM = Math.round((Date.now() - d) / 60000);
    if (diffM < 60) return `${diffM}m ago`;
    const diffH = Math.round(diffM / 60);
    if (diffH < 24) return `${diffH}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
</script>

<div class="flex h-full overflow-hidden">
  <!-- Left: event list -->
  <div
    class="w-72 shrink-0 flex flex-col border-r border-border overflow-hidden"
  >
    <div
      class="flex items-center justify-between px-5 pt-4 pb-3 shrink-0 border-b border-border"
    >
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-sm font-semibold tracking-tight text-foreground">
            Action Required
          </h2>
          {#if events.length > 0}
            <span
              class="text-[0.6rem] font-bold tabular-nums px-1.5 py-px rounded bg-warning/15 text-warning"
              >{events.length}</span
            >
          {/if}
        </div>
        <p class="text-xs text-muted-foreground/60 mt-0.5">
          Awaiting approval to proceed
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onclick={load}
        class={cn(loading && "[&_svg]:animate-spin")}
      >
        <RefreshCw class="size-3.5" />
      </Button>
    </div>

    <ScrollArea class="flex-1">
      {#if loading}
        <div
          class="flex items-center justify-center py-16 text-muted-foreground"
        >
          <div
            class="size-5 rounded-full border-2 border-border border-t-primary animate-spin"
          ></div>
        </div>
      {:else if events.length === 0}
        <div
          class="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground px-4 text-center"
        >
          <CheckCircle class="size-10 opacity-20" />
          <span class="text-sm">No pending approvals</span>
        </div>
      {:else}
        <div class="flex flex-col gap-1 px-3 pb-4">
          {#each events as evt (evt.id)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div
              role="button"
              tabindex="0"
              onclick={() => (selected = evt)}
              onkeydown={(e) => e.key === "Enter" && (selected = evt)}
              class={cn(
                "relative flex flex-col gap-1.5 px-3 py-3 rounded border cursor-pointer transition-colors",
                "border-l-2",
                selected?.id === evt.id
                  ? "bg-accent border-warning/40 border-l-warning"
                  : "bg-card border-border border-l-warning/30 hover:border-l-warning/70",
              )}
            >
              <!-- Source + time -->
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1.5 flex-1 min-w-0">
                  <Mail class="size-3 text-muted-foreground shrink-0" />
                  <span class="text-xs text-muted-foreground truncate"
                    >{evt.source_name ?? "unknown"}</span
                  >
                </div>
                <span
                  class="text-[0.65rem] text-muted-foreground/60 shrink-0 flex items-center gap-1"
                >
                  <Clock class="size-2.5" />{formatTime(evt.timestamp)}
                </span>
              </div>

              <!-- Subject -->
              <p
                class="text-sm font-semibold text-foreground leading-snug line-clamp-2"
              >
                {evt.subject || evt.content || "(no subject)"}
              </p>

              <!-- Matched workflow -->
              {#if evt.rule_name}
                <Badge variant="outline" class="text-xs w-fit">
                  {evt.rule_name}
                </Badge>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </ScrollArea>
  </div>

  <!-- Right: detail + action panel -->
  {#if selected}
    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <!-- Status bar -->
      <div
        class="flex items-center gap-3 px-7 py-4 border-b border-border shrink-0 bg-warning/5"
      >
        <div class="size-2 rounded-full bg-warning animate-pulse"></div>
        <span class="text-xs font-bold uppercase tracking-widest text-warning"
          >Action Paused</span
        >
        <span class="text-xs text-muted-foreground ml-auto"
          >{formatTime(selected.timestamp)}</span
        >
      </div>

      <ScrollArea class="flex-1 px-7 py-6">
        <div class="flex flex-col gap-6 max-w-xl">
          <!-- Event details -->
          <div class="flex flex-col gap-1.5">
            <p
              class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              From
            </p>
            <p class="text-sm text-foreground">
              {selected.sender || selected.source_name || "Unknown"}
            </p>
          </div>

          <div class="flex flex-col gap-1.5">
            <p
              class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              Subject
            </p>
            <h3
              class="text-lg font-semibold tracking-tight text-foreground leading-snug"
            >
              {selected.subject || "(no subject)"}
            </h3>
          </div>

          {#if selected.content}
            <div class="flex flex-col gap-1.5">
              <p
                class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >
                Content
              </p>
              <p class="text-sm text-muted-foreground leading-relaxed">
                {selected.content}
              </p>
            </div>
          {/if}

          {#if selected.rule_name}
            <Separator />
            <div class="flex flex-col gap-3">
              <p
                class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >
                Matched Workflow
              </p>
              <div
                class="flex items-center gap-2.5 px-4 py-3 rounded bg-muted/40 border border-border"
              >
                <div
                  class="size-6 rounded bg-primary/15 flex items-center justify-center shrink-0"
                >
                  <Clock class="size-3.5 text-primary" />
                </div>
                <div>
                  <p
                    class="text-sm font-semibold tracking-tight text-foreground"
                  >
                    {selected.rule_name}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Paused — awaiting approval to proceed
                  </p>
                </div>
              </div>
            </div>
          {/if}

          {#if selected.event_type || selected.event_category}
            <div class="flex items-center gap-2 flex-wrap">
              {#if selected.event_type}
                <Badge variant="outline" class="text-xs"
                  >{selected.event_type.replace(/_/g, " ")}</Badge
                >
              {/if}
              {#if selected.event_category}
                <Badge variant="secondary" class="text-xs capitalize"
                  >{selected.event_category}</Badge
                >
              {/if}
            </div>
          {/if}
        </div>
      </ScrollArea>

      <!-- Execute / Reject action panel -->
      {#if selected}
        {@const st = execState[selected.id]}
        {#if st?.steps?.length}
          <div class="px-7 py-4 border-t border-border shrink-0">
            <PipelineTrace steps={st.steps} />
            {#if !st.running && st.success === false && st.error}
              <p class="text-xs text-destructive mt-2">{st.error}</p>
            {/if}
          </div>
        {/if}
        <div class="px-7 py-4 border-t border-border shrink-0 flex gap-3">
          <Button
            variant="destructive"
            class="flex-1 gap-2"
            disabled={st?.running}
            onclick={() => reject(selected)}
          >
            <XCircle class="size-4" />
            Reject
          </Button>
          <Button
            class="flex-1 gap-2"
            disabled={st?.running || st?.success === true}
            onclick={() => execute(selected)}
          >
            {#if st?.running}
              <Loader class="size-4 animate-spin" />
              Running…
            {:else if st?.success === true}
              <CheckCircle class="size-4" />
              Done!
            {:else}
              <Play class="size-4" />
              Review &amp; Execute
            {/if}
          </Button>
        </div>
      {/if}
    </div>
  {:else if !loading}
    <div class="flex-1 flex items-center justify-center text-muted-foreground">
      <div class="flex flex-col items-center gap-2">
        <CheckCircle class="size-12 opacity-20" />
        <span class="text-sm">Select an event to review</span>
      </div>
    </div>
  {/if}
</div>
