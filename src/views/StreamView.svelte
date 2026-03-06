<script>
  import { onMount } from "svelte";
  import { getEventStats } from "../lib/rules.js";
  import { getAuditLog } from "../lib/store/audit.js";
  import { query } from "../lib/store/db.js";
  import { executePipeline } from "../lib/plugins/execution-service.js";
  import { updateClassificationStatus } from "../lib/triage.js";
  import PipelineTrace from "../components/PipelineTrace.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { cn } from "$lib/utils.js";
  import {
    Mail,
    Clock,
    RefreshCw,
    Search,
    Tag,
    Activity,
    Hourglass,
    Play,
    Loader,
    CheckCircle,
  } from "lucide-svelte";

  let events = $state([]);
  let stats = $state({
    total: 0,
    completed: 0,
    awaiting_user: 0,
    escalated: 0,
    failed: 0,
  });
  let loading = $state(true);
  let filterStatus = $state("");
  let searchQuery = $state("");
  /** @type {Record<string, { running: boolean, steps: any[], success?: boolean }>} */
  let execState = $state({});

  const SOURCE_COLORS = {
    gmail: "#ea4335",
    telegram: "#26a5e4",
    instagram: "#e1306c",
    youtube: "#ff0000",
    slack: "#611f69",
    twitter: "#1da1f2",
  };

  async function load() {
    loading = true;
    try {
      // Fetch both executed events (auditLog) and pending/awaiting (emailClassifications)
      const [{ entries: auditEntries }, pendingRows, st] = await Promise.all([
        getAuditLog({ limit: 200 }),
        query(`
          SELECT
            c.emailId as id,
            COALESCE(i.subject, c.subject) as subject,
            COALESCE(i."from", c."from") as sender,
            c.action as eventType,
            c."group" as event_category,
            c.reason,
            c.status,
            COALESCE(i.date, c.date) as timestamp,
            i.sourceType as source_name
          FROM emailClassifications c
          LEFT JOIN items i ON c.emailId = i.id
          WHERE c.status IN ('pending', 'escalated')
          ORDER BY COALESCE(i.date, c.date) DESC
          LIMIT 200
        `),
        getEventStats(),
      ]);

      // Tag executed entries
      const executed = auditEntries.map((e) => ({
        ...e,
        _streamStatus: e.success ? "completed" : "failed",
      }));
      // Tag pending entries
      const pending = pendingRows.map((r) => ({
        ...r,
        from: r.sender,
        _streamStatus: r.status === "escalated" ? "escalated" : "awaiting_user",
        success: null,
        steps: [],
      }));

      // Merge: deduplicate by emailId — prefer executed entry if both exist
      const executedIds = new Set(executed.map((e) => e.emailId));
      const filteredPending = pending.filter((p) => !executedIds.has(p.id));

      events = [...executed, ...filteredPending].sort(
        (a, b) =>
          Number(b.executedAt ?? b.timestamp ?? 0) -
          Number(a.executedAt ?? a.timestamp ?? 0),
      );
      stats = st;
    } catch (e) {
      console.error("StreamView:", e);
    }
    loading = false;
  }

  onMount(load);

  let displayed = $derived(
    events.filter((e) => {
      let keep = true;
      if (filterStatus === "completed") keep = e._streamStatus === "completed";
      else if (filterStatus === "failed") keep = e._streamStatus === "failed";
      else if (filterStatus === "awaiting_user")
        keep = e._streamStatus === "awaiting_user";
      if (!keep) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.subject?.toLowerCase().includes(q) ||
        e.from?.toLowerCase().includes(q) ||
        e.sender?.toLowerCase().includes(q) ||
        e.eventType?.toLowerCase().includes(q)
      );
    }),
  );

  function formatTime(ts) {
    if (!ts) return "";
    const d = new Date(Number(ts));
    const diffM = Math.round((Date.now() - d) / 60000);
    if (diffM < 60) return `${diffM}m ago`;
    const diffH = Math.round(diffM / 60);
    if (diffH < 24) return `${diffH}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function etLabel(et) {
    return et?.replace(/_/g, " ") ?? "";
  }

  /** Execute a pipeline directly from the stream for a pending event */
  async function executeFromStream(evt) {
    const id = evt.id ?? evt.emailId;
    let emailData = {};
    try {
      const rows = await query(`SELECT * FROM items WHERE id = ?`, [id]);
      emailData = rows[0] ?? {};
    } catch {}

    execState[id] = { running: true, steps: [] };
    // Also update the local event so the trace renders
    events = events.map((e) =>
      e.id === id || e.emailId === id ? { ...e, _execId: id } : e,
    );

    const event = {
      type: evt.eventType || evt.event_type || "UNKNOWN",
      source: emailData.sourceType || "gmail",
      data: {
        emailId: id,
        subject: emailData.subject ?? evt.subject,
        from: emailData.from ?? evt.from ?? evt.sender ?? evt.source_name,
        ...emailData,
      },
      metadata: { category: evt.event_category },
    };

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
      true,
    );

    execState[id] = {
      ...execState[id],
      running: false,
      success: result.success,
    };

    if (result.success) {
      try {
        await updateClassificationStatus(id, "executed");
      } catch {}
      // After 1.5s, reload so the item moves to completed in the audit log
      setTimeout(() => {
        load();
      }, 1500);
    }
  }

  const STAT_FILTERS = [
    { key: "", label: "All", count: () => stats.total },
    { key: "completed", label: "Completed", count: () => stats.completed },
    {
      key: "awaiting_user",
      label: "Awaiting",
      count: () => stats.awaiting_user,
    },
    { key: "failed", label: "Failed", count: () => stats.failed },
  ];
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Page header -->
  <div class="px-8 pt-5 pb-4 shrink-0 border-b border-border">
    <div class="flex items-center gap-2 mb-0.5">
      <h1 class="text-sm font-semibold tracking-tight text-foreground">
        Event Stream
      </h1>
      <span
        class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50"
        >/ live</span
      >
    </div>
    <p class="text-xs text-muted-foreground">
      Unified log of ingested events and execution traces.
    </p>
  </div>

  <!-- Filters bar -->
  <div
    class="flex items-center gap-3 px-8 py-2.5 shrink-0 border-b border-border"
  >
    <div class="flex items-center gap-1">
      {#each STAT_FILTERS as sf}
        <Button
          variant={filterStatus === sf.key ? "secondary" : "ghost"}
          size="sm"
          onclick={() => {
            filterStatus =
              filterStatus === sf.key && sf.key !== "" ? "" : sf.key;
            load();
          }}
          class="h-7 text-xs tracking-tight"
        >
          {sf.label}
          <span class="ml-1 opacity-50 tabular-nums">{sf.count()}</span>
        </Button>
      {/each}
    </div>
    <div class="flex-1"></div>
    <div class="relative w-52">
      <Search
        class="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
      />
      <Input
        bind:value={searchQuery}
        placeholder="Search events…"
        class="pl-9 h-8 text-xs"
      />
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

  <!-- Event feed -->
  <ScrollArea class="flex-1 px-8 py-5">
    {#if loading}
      <div
        class="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground"
      >
        <div
          class="size-6 rounded-full border-2 border-border border-t-primary animate-spin"
        ></div>
        <span class="text-sm">Loading events…</span>
      </div>
    {:else if displayed.length === 0}
      <div
        class="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground"
      >
        <Activity class="size-12 opacity-20" />
        <span class="text-sm">No events found</span>
      </div>
    {:else}
      <div class="flex flex-col gap-3 max-w-3xl">
        {#each displayed as evt (evt.id)}
          {@const srcColor = SOURCE_COLORS[evt.source_name] ?? "#6b7280"}
          {@const st = execState[evt.id ?? evt.emailId]}
          {@const activeSteps = evt.steps?.length ? evt.steps : st?.steps || []}
          <div
            class="rounded-xl border bg-card/60 backdrop-blur-md border-border/50 shadow-sm overflow-hidden hover:border-primary/30 transition-all"
          >
            <!-- Card content -->
            <div class="flex items-start gap-3 px-5 pt-4 pb-3.5">
              <!-- Source icon — custom div, color styling allowed -->
              <div
                class="size-8 rounded flex items-center justify-center shrink-0 mt-0.5"
                style="background:{srcColor}15;"
              >
                <Mail class="size-4" style="color:{srcColor};" />
              </div>

              <div class="flex-1 min-w-0">
                <!-- Sender + time -->
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-sm font-medium text-foreground truncate">
                    {evt.sender || evt.source_name || "Unknown"}
                  </span>
                  <span class="text-muted-foreground/30">·</span>
                  <span
                    class="flex items-center gap-1 text-xs text-muted-foreground shrink-0"
                  >
                    <Clock class="size-3" />
                    {formatTime(evt.timestamp)}
                  </span>
                </div>

                <!-- Subject -->
                <h3
                  class="text-base font-semibold text-foreground leading-snug mb-3"
                >
                  {evt.subject || evt.content || "(no subject)"}
                </h3>

                <!-- Tags — shadcn Badge, variant only, no color overrides -->
                <div class="flex items-center gap-2 flex-wrap">
                  {#if evt.event_type}
                    <Badge
                      variant="outline"
                      class="gap-1.5 h-6 text-xs font-medium"
                    >
                      <Tag class="size-3 shrink-0" />
                      {etLabel(evt.event_type)}
                    </Badge>
                  {/if}
                  {#if evt.event_category}
                    <Badge variant="secondary" class="h-6 text-xs capitalize">
                      {evt.event_category}
                    </Badge>
                  {/if}
                </div>
              </div>
            </div>

            <!-- Action bar for pending events -->
            {#if (evt._streamStatus === "awaiting_user" || evt._streamStatus === "escalated") && !evt.success}
              <div class="px-5 pb-4 pt-1 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  class="gap-1.5 h-7 text-xs"
                  disabled={st?.running || st?.success === true}
                  onclick={() => executeFromStream(evt)}
                >
                  {#if st?.running}
                    <Loader class="size-3 animate-spin" />
                    Running…
                  {:else if st?.success === true}
                    <CheckCircle class="size-3 text-emerald-500" />
                    Done
                  {:else}
                    <Play class="size-3" />
                    Execute manually
                  {/if}
                </Button>
              </div>
            {/if}

            <!-- Execution trace -->
            {#if activeSteps.length}
              <div class="mx-3 mb-3">
                <PipelineTrace steps={activeSteps} />
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </ScrollArea>
</div>
