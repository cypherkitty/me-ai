<script>
  import { onMount } from "svelte";
  import { getEvents, getEventStats } from "../lib/rules.js";
  import { Button }    from "$lib/components/ui/button/index.js";
  import { Badge }     from "$lib/components/ui/badge/index.js";
  import * as Table    from "$lib/components/ui/table/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { cn }        from "$lib/utils.js";
  import { RefreshCw, Clock } from "lucide-svelte";

  let events  = $state([]);
  let stats   = $state({ total: 0, completed: 0, awaiting_user: 0, escalated: 0, failed: 0 });
  let loading = $state(true);
  let selected = $state(null);

  const SOURCE_COLORS = {
    gmail: "#ea4335", telegram: "#26a5e4", instagram: "#e1306c",
    youtube: "#ff0000", slack: "#611f69", twitter: "#1da1f2",
  };

  const STATUS_ITEMS = [
    { key: "completed",     label: "Completed" },
    { key: "awaiting_user", label: "Awaiting" },
    { key: "escalated",     label: "Escalated" },
    { key: "failed",        label: "Failed" },
  ];

  const STATUS_VARIANT = {
    completed:     "secondary",
    awaiting_user: "secondary",
    escalated:     "destructive",
    failed:        "outline",
  };

  async function load() {
    loading = true;
    try {
      [events, stats] = await Promise.all([
        getEvents({ limit: 500 }),
        getEventStats(),
      ]);
    } catch (e) {
      console.error("AuditView load error:", e);
    }
    loading = false;
  }

  onMount(load);

  function formatTs(ts) {
    if (!ts) return "—";
    return new Date(Number(ts)).toLocaleString("en-US", {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  }

  function etLabel(et) { return et?.replace(/_/g, " ") ?? "—"; }
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Header -->
  <div class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border">
    <div>
      <div class="flex items-center gap-2 mb-0.5">
        <h1 class="text-sm font-semibold tracking-tight text-foreground">Audit Trail</h1>
        <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ log</span>
      </div>
      <p class="text-xs text-muted-foreground">{stats.total} events logged across all pipelines.</p>
    </div>
    <Button variant="ghost" size="icon-sm" onclick={load} title="Refresh" class={cn(loading && "[&_svg]:animate-spin")}>
      <RefreshCw class="size-3.5" />
    </Button>
  </div>

  <!-- Summary stats -->
  <div class="flex gap-2 px-8 pt-4 pb-3 shrink-0 flex-wrap border-b border-border">
    {#each STATUS_ITEMS as item}
      <div class="flex flex-col items-center px-4 py-2 rounded border bg-card border-border/50 min-w-[68px]">
        <span class="text-base font-bold tabular-nums text-foreground">{stats[item.key] ?? 0}</span>
        <span class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/50 mt-0.5">{item.label}</span>
      </div>
    {/each}
  </div>

  <!-- Table -->
  <ScrollArea class="flex-1 px-8 pb-6">
    {#if loading}
      <div class="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <div class="size-5 rounded-full border-2 border-border border-t-primary animate-spin"></div>
        <span class="text-xs">Loading audit trail…</span>
      </div>
    {:else if events.length === 0}
      <div class="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <Clock class="size-10 opacity-30" />
        <span class="text-sm">No events in the audit trail yet</span>
      </div>
    {:else}
      <Table.Root>
        <Table.Header>
          <Table.Row class="border-border/40 hover:bg-transparent">
            <Table.Head class="text-[0.68rem] text-muted-foreground/60 font-semibold uppercase tracking-wider">Timestamp</Table.Head>
            <Table.Head class="text-[0.68rem] text-muted-foreground/60 font-semibold uppercase tracking-wider">Source</Table.Head>
            <Table.Head class="text-[0.68rem] text-muted-foreground/60 font-semibold uppercase tracking-wider">Subject</Table.Head>
            <Table.Head class="text-[0.68rem] text-muted-foreground/60 font-semibold uppercase tracking-wider">Type</Table.Head>
            <Table.Head class="text-[0.68rem] text-muted-foreground/60 font-semibold uppercase tracking-wider">Category</Table.Head>
            <Table.Head class="text-[0.68rem] text-muted-foreground/60 font-semibold uppercase tracking-wider">Rule</Table.Head>
            <Table.Head class="text-[0.68rem] text-muted-foreground/60 font-semibold uppercase tracking-wider">Actions</Table.Head>
            <Table.Head class="text-[0.68rem] text-muted-foreground/60 font-semibold uppercase tracking-wider">Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each events as evt (evt.id)}
            <Table.Row
              class={cn(
                "border-border/30 cursor-pointer text-xs transition-colors",
                selected?.id === evt.id && "bg-accent/50"
              )}
              onclick={() => selected = selected?.id === evt.id ? null : evt}
            >
              <Table.Cell class="text-muted-foreground font-mono text-[0.65rem] whitespace-nowrap">
                {formatTs(evt.timestamp)}
              </Table.Cell>
              <Table.Cell>
                <div class="flex items-center gap-1.5">
                  <span
                    class="size-2 rounded-full shrink-0"
                    style="background:{SOURCE_COLORS[evt.source_name] ?? 'var(--muted-foreground)'}"
                  ></span>
                  <span class="text-muted-foreground">{evt.source_name ?? "—"}</span>
                </div>
              </Table.Cell>
              <Table.Cell class="max-w-[200px]">
                <span class="truncate block text-foreground/80" title={evt.subject || evt.content}>
                  {evt.subject || evt.content?.slice(0, 50) || "(no subject)"}
                </span>
              </Table.Cell>
              <Table.Cell>
                {#if evt.event_type}
                  <Badge variant="outline" class="text-xs px-1.5 h-4 capitalize">
                    {etLabel(evt.event_type)}
                  </Badge>
                {:else}<span class="text-muted-foreground/40">—</span>{/if}
              </Table.Cell>
              <Table.Cell>
                {#if evt.event_category}
                  <Badge variant="secondary" class="text-xs px-1.5 h-4">
                    {evt.event_category}
                  </Badge>
                {:else}<span class="text-muted-foreground/40">—</span>{/if}
              </Table.Cell>
              <Table.Cell class="max-w-[120px]">
                {#if evt.rule_name}
                  <span class="text-muted-foreground font-mono text-[0.62rem] truncate block">{evt.rule_name}</span>
                {:else}<span class="text-muted-foreground/40">—</span>{/if}
              </Table.Cell>
              <Table.Cell>
                {#if evt.actions_taken?.length}
                  <div class="flex gap-1 flex-wrap">
                    {#each evt.actions_taken as a}
                      <code class="text-[0.6rem] px-1 py-0.5 bg-muted/40 border border-border/30 rounded text-info/60 font-mono">{a}</code>
                    {/each}
                  </div>
                {:else}<span class="text-muted-foreground/40">—</span>{/if}
              </Table.Cell>
              <Table.Cell>
                <Badge variant={STATUS_VARIANT[evt.status] ?? "outline"} class="text-xs px-1.5 h-4">
                  {evt.status === "awaiting_user" ? "Awaiting" : (evt.status ?? "—")}
                </Badge>
              </Table.Cell>
            </Table.Row>

            <!-- Expanded detail -->
            {#if selected?.id === evt.id}
              <Table.Row class="border-border/20 bg-accent/20 hover:bg-accent/20">
                <Table.Cell colspan={8} class="py-3 px-4">
                  <div class="flex flex-col gap-2.5">
                    <div class="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-4">
                      {#each [
                        { label: "Event ID", val: evt.id, mono: true },
                        { label: "Sender",   val: evt.sender || "—" },
                        { label: "Rule ID",  val: evt.rule_id || "—", mono: true },
                        { label: "Priority", val: evt.rule_priority ?? "—" },
                      ] as item}
                        <div class="flex flex-col gap-0.5">
                          <span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40">{item.label}</span>
                          <span class={cn("text-xs text-muted-foreground", item.mono && "font-mono")}>{item.val}</span>
                        </div>
                      {/each}
                    </div>
                    {#if evt.content}
                      <div class="flex flex-col gap-1">
                        <span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40">Content</span>
                        <p class="text-xs text-muted-foreground leading-relaxed">{evt.content}</p>
                      </div>
                    {/if}
                    {#if evt.output}
                      <div class="flex flex-col gap-1">
                        <span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40">Output</span>
                        <pre class="text-[0.65rem] text-info/70 bg-muted/30 rounded p-2 overflow-x-auto font-mono">{JSON.stringify(evt.output, null, 2)}</pre>
                      </div>
                    {/if}
                  </div>
                </Table.Cell>
              </Table.Row>
            {/if}
          {/each}
        </Table.Body>
      </Table.Root>
    {/if}
  </ScrollArea>
</div>
