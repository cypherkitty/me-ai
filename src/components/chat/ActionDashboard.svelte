<script>
  import { actionColor } from "../../lib/triage.js";
  import { getActionsForEvent, getGroupForEventType } from "../../lib/events.js";
  import PipelineGraph from "../actions/PipelineGraph.svelte";

  let {
    pendingData = null,
    onmarkacted,
    ondismiss,
    onremove,
    oncleargroup,
    onaskai,
  } = $props();

  let activeGroup = $state(null);
  let confirmClear = $state(null);
  let activePipeline = $state([]);
  let activeTier = $state(null);

  /** Expand/collapse a group; exposed so external controls can call it */
  export function toggleGroup(action) {
    activeGroup = activeGroup === action ? null : action;
    confirmClear = null;
  }

  $effect(() => {
    if (activeGroup) {
      getActionsForEvent(activeGroup).then(actions => activePipeline = actions);
      getGroupForEventType(activeGroup).then(grp => activeTier = grp);
    } else {
      activePipeline = [];
      activeTier = null;
    }
  });

  function fmt(str) {
    return str.split("_").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
  }

  function shortDate(ts) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch { return ""; }
  }

  function shortSender(from) {
    if (!from) return "";
    const name = from.replace(/<.*>/, "").trim();
    return name.length > 24 ? name.slice(0, 22) + "…" : name;
  }
</script>

{#if pendingData && pendingData.total > 0}
  <div class="widget">
    <!-- ── Summary line ──────────────────────────────── -->
    <div class="summary">
      {pendingData.total} item{pendingData.total !== 1 ? "s" : ""} need attention
    </div>

    <!-- ── Group chips ───────────────────────────────── -->
    <div class="chips">
      {#each pendingData.order as action (action)}
        {@const items = pendingData.groups[action]}
        {@const color = actionColor(action)}
        {@const isActive = activeGroup === action}
        <button
          class="chip" class:active={isActive}
          style:--c={color}
          onclick={() => toggleGroup(action)}
        >
          <span class="dot" style:background={color}></span>
          {fmt(action)}
          <span class="cnt">{items.length}</span>
        </button>
      {/each}
    </div>

    <!-- ── Drilled-in group ──────────────────────────── -->
    {#if activeGroup && pendingData.groups[activeGroup]}
      {@const items = pendingData.groups[activeGroup]}
      {@const color = actionColor(activeGroup)}
      <div class="detail">
        <div class="detail-head" style:border-color={color}>
          <button class="back-btn" onclick={() => { activeGroup = null; confirmClear = null; }}>
            ←
          </button>
          <span class="detail-title">{fmt(activeGroup)}</span>
          <span class="detail-cnt">{items.length}</span>
        </div>

        <div class="pipeline-preview" style="margin-bottom: 0.5rem; background: #111; padding: 0.2rem 0.5rem; border-radius: 8px; border: 1px solid #1a1a1a;">
          <PipelineGraph 
            eventType={activeGroup} 
            group={activeTier} 
            commands={activePipeline} 
          />
        </div>

        <div class="emails">
          {#each items as item (item.emailId)}
            <div class="erow">
              <button
                class="einfo"
                onclick={() => onaskai?.(`Tell me about the email "${item.subject}" from ${item.from}`)}
                title="Ask AI about this email"
              >
                <span class="esubj">{item.subject}</span>
                <span class="emeta">{shortSender(item.from)}{#if item.date}<span class="edate">{shortDate(item.date)}</span>{/if}</span>
              </button>
              <div class="ebtns">
                <button class="abtn ok" title="Handled" onclick={() => onmarkacted?.(item.emailId)}>✓</button>
                <button class="abtn no" title="Dismiss" onclick={() => ondismiss?.(item.emailId)}>✕</button>
              </div>
            </div>
          {/each}
        </div>

        <div class="batch">
          {#if confirmClear !== activeGroup}
            <button class="bbtn" onclick={() => items.forEach((i) => onmarkacted?.(i.emailId))}>All handled</button>
            <button class="bbtn muted" onclick={() => confirmClear = activeGroup}>Clear group</button>
          {:else}
            <span class="bconf">Remove {items.length}?</span>
            <button class="bbtn" onclick={() => confirmClear = null}>Cancel</button>
            <button class="bbtn danger" onclick={() => { oncleargroup?.(activeGroup); confirmClear = null; activeGroup = null; }}>Delete</button>
          {/if}
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  /* ── Widget container ────────────────────────────── */
  .widget {
    background: #141414;
    border: 1px solid #232323;
    border-radius: 12px;
    padding: 0.55rem 0.65rem;
    max-width: 420px;
    align-self: flex-start;
  }

  /* ── Summary ─────────────────────────────────────── */
  .summary {
    font-size: 0.74rem;
    font-weight: 500;
    color: #999;
    margin-bottom: 0.4rem;
  }

  /* ── Chips ───────────────────────────────────────── */
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.18rem 0.45rem;
    background: transparent;
    border: 1px solid #282828;
    border-radius: 14px;
    color: #999;
    font-size: 0.66rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.12s;
    font-family: inherit;
    white-space: nowrap;
  }
  .chip:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: #3a3a3a;
    color: #ccc;
  }
  .chip.active {
    background: color-mix(in srgb, var(--c) 10%, transparent);
    border-color: color-mix(in srgb, var(--c) 40%, transparent);
    color: var(--c);
  }

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .cnt {
    font-size: 0.6rem;
    font-weight: 700;
    color: #666;
    min-width: 14px;
    text-align: center;
  }
  .chip.active .cnt {
    color: inherit;
    opacity: 0.7;
  }

  /* ── Drilled-in detail ───────────────────────────── */
  .detail {
    margin-top: 0.45rem;
    border-top: 1px solid #1e1e1e;
    padding-top: 0.4rem;
  }

  .detail-head {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding-bottom: 0.3rem;
    border-bottom: 2px solid;
    margin-bottom: 0.3rem;
  }

  .back-btn {
    background: none;
    border: none;
    color: #666;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
    transition: color 0.12s;
    line-height: 1;
  }
  .back-btn:hover { color: #ccc; }

  .detail-title {
    font-size: 0.74rem;
    font-weight: 600;
    color: #ccc;
    flex: 1;
  }

  .detail-cnt {
    font-size: 0.62rem;
    color: #666;
  }

  /* ── Email rows ──────────────────────────────────── */
  .emails {
    display: flex;
    flex-direction: column;
  }

  .erow {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.28rem 0.15rem;
    border-bottom: 1px solid #1a1a1a;
  }
  .erow:last-child {
    border-bottom: none;
  }

  .einfo {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.05rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    color: inherit;
    padding: 0;
    font-family: inherit;
  }
  .einfo:hover .esubj { color: #fff; }

  .esubj {
    font-size: 0.72rem;
    font-weight: 500;
    color: #ccc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.12s;
  }

  .emeta {
    font-size: 0.6rem;
    color: #555;
    display: flex;
    gap: 0.35rem;
  }

  .edate {
    color: #444;
    flex-shrink: 0;
  }

  /* ── Action buttons ──────────────────────────────── */
  .ebtns {
    display: flex;
    gap: 0.1rem;
    flex-shrink: 0;
    opacity: 0.4;
    transition: opacity 0.12s;
  }
  .erow:hover .ebtns { opacity: 1; }

  .abtn {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    font-size: 0.68rem;
    font-weight: 600;
    transition: all 0.12s;
  }
  .abtn.ok { color: #555; }
  .abtn.ok:hover { background: rgba(52, 211, 153, 0.12); color: #34d399; }
  .abtn.no { color: #555; }
  .abtn.no:hover { background: rgba(248, 113, 113, 0.12); color: #f87171; }

  /* ── Batch row ───────────────────────────────────── */
  .batch {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.35rem;
    padding-top: 0.3rem;
    margin-top: 0.15rem;
    border-top: 1px solid #1a1a1a;
  }

  .bbtn {
    font-size: 0.62rem;
    font-weight: 500;
    color: #777;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    transition: all 0.12s;
    font-family: inherit;
  }
  .bbtn:hover { color: #aaa; background: rgba(255, 255, 255, 0.04); }
  .bbtn.muted { color: #555; }
  .bbtn.muted:hover { color: #888; }
  .bbtn.danger { color: #888; }
  .bbtn.danger:hover { color: #f87171; background: rgba(248, 113, 113, 0.08); }

  .bconf {
    font-size: 0.62rem;
    color: #888;
    margin-right: auto;
  }
</style>
