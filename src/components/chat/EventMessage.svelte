<script>
  import CommandCard from "./CommandCard.svelte";

  let { msg, oncommand } = $props();

  function shortSender(from) {
    if (!from) return "—";
    const name = from.replace(/<.*>/, "").trim();
    return name.length > 40 ? name.slice(0, 38) + "…" : name;
  }

  function shortDate(ts) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    } catch { return ""; }
  }

  function handleCommand(event, commandId) {
    oncommand?.({ event, commandId });
  }
</script>

{#if msg.type === "event"}
  <!-- Single event message -->
  <div class="event-msg">
    <div class="event-card">
      <div class="event-head">
        <span class="event-type">{msg.event.type}</span>
        <span class="event-source">{msg.event.source}</span>
      </div>
      {#if msg.event.data?.subject}
        <div class="event-subject">{msg.event.data.subject}</div>
      {/if}
      <div class="event-meta">
        {#if msg.event.data?.from}{shortSender(msg.event.data.from)}{/if}
        {#if msg.event.data?.date}<span class="sep"> · </span>{shortDate(msg.event.data.date)}{/if}
      </div>
      {#if msg.event.metadata?.summary}
        <div class="event-summary">{msg.event.metadata.summary}</div>
      {/if}
      {#if msg.event.metadata?.tags?.length}
        <div class="event-tags">
          {#each msg.event.metadata.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      {/if}
      {#if msg.event.metadata?.reason}
        <div class="event-reason">{msg.event.metadata.reason}</div>
      {/if}
    </div>
    {#if msg.commands?.length}
      <div class="commands">
        {#each msg.commands as cmd}
          <CommandCard command={cmd} onexecute={(id) => handleCommand(msg.event, id)} />
        {/each}
      </div>
    {/if}
  </div>

{:else if msg.type === "event-batch"}
  <!-- Batch: multiple events from a scan -->
  <div class="event-batch">
    <div class="batch-head">
      <span class="batch-title">Processed {msg.items.length} email{msg.items.length === 1 ? "" : "s"}</span>
    </div>
    {#each msg.items as item}
      <div class="event-msg compact">
        <div class="event-card">
          <div class="event-head">
            <span class="event-type">{item.event.type}</span>
            {#if item.event.data?.subject}
              <span class="event-subject-inline">{item.event.data.subject}</span>
            {/if}
          </div>
          <div class="event-meta">
            {#if item.event.data?.from}{shortSender(item.event.data.from)}{/if}
            {#if item.event.data?.date}<span class="sep"> · </span>{shortDate(item.event.data.date)}{/if}
          </div>
          {#if item.event.metadata?.summary}
            <div class="event-summary">{item.event.metadata.summary}</div>
          {/if}
        </div>
        <div class="commands compact">
          {#each item.commands as cmd}
            <CommandCard command={cmd} onexecute={(id) => handleCommand(item.event, id)} />
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  .event-msg {
    align-self: flex-start;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .event-msg.compact {
    padding: 0.5rem;
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 10px;
    max-width: 100%;
  }

  /* Event card */
  .event-card {
    padding: 0.5rem 0.65rem;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
  }
  .compact .event-card {
    padding: 0.35rem 0.5rem;
    background: transparent;
    border: none;
    border-radius: 0;
  }
  .event-head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.2rem;
  }
  .event-type {
    font-size: 0.6rem;
    font-weight: 700;
    color: #34d399;
    background: rgba(52, 211, 153, 0.1);
    padding: 0.12rem 0.4rem;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }
  .event-source {
    font-size: 0.55rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .event-subject {
    font-size: 0.78rem;
    font-weight: 500;
    color: #ddd;
    margin-bottom: 0.1rem;
    line-height: 1.3;
  }
  .event-subject-inline {
    font-size: 0.68rem;
    color: #bbb;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
  .event-meta {
    font-size: 0.6rem;
    color: #555;
    margin-bottom: 0.15rem;
  }
  .event-summary {
    font-size: 0.68rem;
    color: #999;
    line-height: 1.4;
    margin-bottom: 0.1rem;
  }
  .event-reason {
    font-size: 0.6rem;
    color: #666;
    font-style: italic;
    margin-top: 0.1rem;
  }
  .event-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
    margin-bottom: 0.1rem;
  }
  .tag {
    font-size: 0.55rem;
    font-weight: 600;
    color: #888;
    background: rgba(255,255,255,0.05);
    padding: 0.08rem 0.35rem;
    border-radius: 3px;
  }

  /* Commands */
  .commands {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .commands.compact {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.2rem;
  }
  .commands.compact :global(.command-card) {
    width: auto;
    flex: 0 0 auto;
  }

  /* Batch container */
  .event-batch {
    align-self: flex-start;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .batch-head {
    padding: 0.3rem 0;
  }
  .batch-title {
    font-size: 0.72rem;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .sep { color: #333; }
</style>
