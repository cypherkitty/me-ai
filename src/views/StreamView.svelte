<script>
  import { onMount } from "svelte";
  import { getEvents, getEventStats } from "../lib/rules.js";
  import { Button }     from "$lib/components/ui/button/index.js";
  import { Badge }      from "$lib/components/ui/badge/index.js";
  import { Input }      from "$lib/components/ui/input/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { cn }         from "$lib/utils.js";
  import {
    Mail, Clock, RefreshCw, Search, Tag, Zap,
    CircleCheck, TriangleAlert, Activity,
  } from "lucide-svelte";

  let events  = $state([]);
  let stats   = $state({ total: 0, completed: 0, awaiting_user: 0, escalated: 0, failed: 0 });
  let loading = $state(true);
  let filterStatus = $state("");
  let searchQuery  = $state("");

  const SOURCE_COLORS = {
    gmail: "#ea4335", telegram: "#26a5e4", instagram: "#e1306c",
    youtube: "#ff0000", slack: "#611f69", twitter: "#1da1f2",
  };

  async function load() {
    loading = true;
    try {
      [events, stats] = await Promise.all([
        getEvents({ status: filterStatus || undefined, limit: 200 }),
        getEventStats(),
      ]);
    } catch (e) { console.error("StreamView:", e); }
    loading = false;
  }

  onMount(load);

  let displayed = $derived(
    events.filter(e => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.subject?.toLowerCase().includes(q) ||
        e.sender?.toLowerCase().includes(q) ||
        e.event_type?.toLowerCase().includes(q)
      );
    })
  );

  function formatTime(ts) {
    if (!ts) return "";
    const d = new Date(Number(ts));
    const diffM = Math.round((Date.now() - d) / 60000);
    if (diffM < 60)  return `${diffM}m ago`;
    const diffH = Math.round(diffM / 60);
    if (diffH < 24) return `${diffH}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function etLabel(et) { return et?.replace(/_/g, " ") ?? ""; }

  const STAT_FILTERS = [
    { key: "",              label: "All",       count: () => stats.total },
    { key: "completed",     label: "Completed", count: () => stats.completed },
    { key: "awaiting_user", label: "Awaiting",  count: () => stats.awaiting_user },
    { key: "escalated",     label: "Escalated", count: () => stats.escalated },
  ];
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Page header -->
  <div class="px-8 pt-5 pb-4 shrink-0 border-b border-border">
    <div class="flex items-center gap-2 mb-0.5">
      <h1 class="text-sm font-semibold tracking-tight text-foreground">Event Stream</h1>
      <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ live</span>
    </div>
    <p class="text-xs text-muted-foreground">Unified log of ingested events and execution traces.</p>
  </div>

  <!-- Filters bar -->
  <div class="flex items-center gap-3 px-8 py-2.5 shrink-0 border-b border-border">
    <div class="flex items-center gap-1">
      {#each STAT_FILTERS as sf}
        <Button
          variant={filterStatus === sf.key ? "secondary" : "ghost"}
          size="sm"
          onclick={() => { filterStatus = filterStatus === sf.key && sf.key !== "" ? "" : sf.key; load(); }}
          class="h-7 text-xs tracking-tight"
        >
          {sf.label} <span class="ml-1 opacity-50 tabular-nums">{sf.count()}</span>
        </Button>
      {/each}
    </div>
    <div class="flex-1"></div>
    <div class="relative w-52">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
      <Input bind:value={searchQuery} placeholder="Search events…" class="pl-9 h-8 text-xs" />
    </div>
    <Button variant="ghost" size="icon-sm" onclick={load} class={cn(loading && "[&_svg]:animate-spin")}>
      <RefreshCw class="size-3.5" />
    </Button>
  </div>

  <!-- Event feed -->
  <ScrollArea class="flex-1 px-8 py-5">
    {#if loading}
      <div class="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
        <div class="size-6 rounded-full border-2 border-border border-t-primary animate-spin"></div>
        <span class="text-sm">Loading events…</span>
      </div>
    {:else if displayed.length === 0}
      <div class="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
        <Activity class="size-12 opacity-20" />
        <span class="text-sm">No events found</span>
      </div>
    {:else}
      <div class="flex flex-col gap-3 max-w-3xl">
        {#each displayed as evt (evt.id)}
          {@const srcColor = SOURCE_COLORS[evt.source_name] ?? "#6b7280"}
          <div class="rounded border border-border bg-card overflow-hidden hover:border-border/60 transition-colors">

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
                  <span class="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock class="size-3" />
                    {formatTime(evt.timestamp)}
                  </span>
                </div>

                <!-- Subject -->
                <h3 class="text-base font-semibold text-foreground leading-snug mb-3">
                  {evt.subject || evt.content || "(no subject)"}
                </h3>

                <!-- Tags — shadcn Badge, variant only, no color overrides -->
                <div class="flex items-center gap-2 flex-wrap">
                  {#if evt.event_type}
                    <Badge variant="outline" class="gap-1.5 h-6 text-xs font-medium">
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

            <!-- Execution trace — custom div section, color styling allowed here -->
            {#if evt.rule_name || evt.actions_taken?.length}
              <div class="mx-3 mb-3 rounded bg-trace-bg border border-border px-4 py-3">
                <p class="text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Execution Trace
                </p>
                <div class="flex flex-col relative">
                  {#if evt.rule_name}
                    <div class="flex items-center gap-3 relative">
                      <div class="size-7 rounded-full bg-primary flex items-center justify-center shrink-0 z-10">
                        <Zap class="size-3.5 text-primary-foreground" />
                      </div>
                      {#if evt.actions_taken?.length}
                        <div class="absolute left-[13px] top-7 w-px h-5 bg-border"></div>
                      {/if}
                      <span class="text-sm text-muted-foreground">
                        Triggered by
                        <code class="text-foreground font-mono text-xs bg-accent px-1.5 py-0.5 rounded">
                          {evt.rule_name}
                        </code>
                      </span>
                    </div>
                  {/if}

                  {#if evt.actions_taken?.length}
                    {#each evt.actions_taken as action, i}
                      <div class="flex items-center gap-3 mt-5 relative">
                        {#if i < evt.actions_taken.length - 1}
                          <div class="absolute left-[13px] top-7 w-px h-5 bg-border"></div>
                        {/if}
                        <div class="size-7 rounded-full bg-node-action flex items-center justify-center shrink-0 z-10">
                          <CircleCheck class="size-3.5 text-white" />
                        </div>
                        <span class="text-sm text-muted-foreground">
                          Executed
                          <code class="text-foreground font-mono text-xs bg-accent px-1.5 py-0.5 rounded">
                            {action}
                          </code>
                        </span>
                      </div>
                    {/each}
                  {:else if evt.status === "awaiting_user"}
                    <div class="flex items-center gap-3 mt-5">
                      <div class="size-7 rounded-full bg-warning/20 border border-warning/40 flex items-center justify-center shrink-0">
                        <Clock class="size-3.5 text-warning" />
                      </div>
                      <span class="text-sm text-warning">Awaiting approval</span>
                    </div>
                  {:else if evt.status === "escalated"}
                    <div class="flex items-center gap-3 mt-5">
                      <div class="size-7 rounded-full bg-destructive/20 border border-destructive/40 flex items-center justify-center shrink-0">
                        <TriangleAlert class="size-3.5 text-destructive" />
                      </div>
                      <span class="text-sm text-destructive">Escalated</span>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </ScrollArea>
</div>
