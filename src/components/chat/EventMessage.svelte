<script>
  import { onMount } from "svelte";
  import CommandCard from "./CommandCard.svelte";
  import { stringToHue } from "../../lib/format.js";
  import { executePipeline, executePipelineBatch, isAuthenticated } from "../../lib/workers/execution-service.js";
  import { getAllEventTypes } from "../../lib/events.js";

  let { msg, oncommand } = $props();

  let expandedGroups = $state({});
  let executionState = $state({});
  let userEvents = $state([]);               // user-defined event names
  let selectedEventPerGroup = $state({});    // tag -> selected event name

  onMount(async () => {
    userEvents = await getAllEventTypes();
  });

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

  function getSelectedEvent(tag) {
    return selectedEventPerGroup[tag] ?? userEvents[0] ?? "";
  }

  function setSelectedEvent(tag, eventName) {
    selectedEventPerGroup = { ...selectedEventPerGroup, [tag]: eventName };
  }

  async function handleExecute(tag, email) {
    const eventName = getSelectedEvent(tag);
    if (!eventName) {
      alert("No event selected. Create an event in the Actions page first.");
      return;
    }
    if (!await isAuthenticated()) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }

    const stateKey = `single_${email.emailId}`;
    executionState[stateKey] = { running: true, progress: null, result: null };

    try {
      const event = { type: eventName, source: "gmail", data: email };
      const result = await executePipeline(event, (progress) => {
        executionState[stateKey] = { ...executionState[stateKey], progress };
      });
      executionState[stateKey] = { running: false, progress: null, result };
    } catch (error) {
      executionState[stateKey] = {
        running: false,
        progress: null,
        result: { success: false, message: error.message },
      };
    }
  }

  async function handleExecuteGroup(tag, emails) {
    const eventName = getSelectedEvent(tag);
    if (!eventName) {
      alert("No event selected. Create an event in the Actions page first.");
      return;
    }
    if (!await isAuthenticated()) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }

    const stateKey = `batch_${tag}`;
    executionState[stateKey] = { running: true, progress: null, result: null };

    try {
      const result = await executePipelineBatch(eventName, emails, (progress) => {
        executionState[stateKey] = { ...executionState[stateKey], progress };
      });
      executionState[stateKey] = { running: false, progress: null, result };
    } catch (error) {
      executionState[stateKey] = {
        running: false,
        progress: null,
        result: { success: false, message: error.message },
      };
    }
  }

  function toggleGroup(tag) {
    expandedGroups = { ...expandedGroups, [tag]: !expandedGroups[tag] };
  }

  function formatLabel(str) {
    return str
      .split("_")
      .map(w => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  }

  function tagColor(tag) {
    return `hsl(${stringToHue(tag)}, 55%, 55%)`;
  }

  function getExecutionState(key) {
    return executionState[key];
  }
</script>

{#if msg.type === "event"}
  <!-- Single event message -->
  <div class="event-msg">
    <div class="event-card">
      <div class="event-head">
        {#if msg.event.metadata?.tag}
          <span class="event-type">{msg.event.metadata.tag}</span>
        {/if}
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
            {#if item.event.metadata?.tag}
              <span class="event-type">{item.event.metadata.tag}</span>
            {/if}
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

{:else if msg.type === "events-grouped"}
  <!-- Grouped by tag; user picks a user-defined event to execute -->
  <div class="events-grouped">
    <div class="grouped-head">
      <span class="grouped-title">Scanned emails</span>
      <span class="grouped-stat">{msg.total} email{msg.total === 1 ? "" : "s"} · {msg.groups.length} tag{msg.groups.length === 1 ? "" : "s"}</span>
    </div>

    {#each msg.groups as group}
      {@const isExpanded = expandedGroups[group.tag] ?? true}
      {@const batchState = getExecutionState(`batch_${group.tag}`)}
      {@const selectedEvt = getSelectedEvent(group.tag)}
      <div class="group-block">
        <div class="group-header-row">
          <button class="group-header" onclick={() => toggleGroup(group.tag)}>
            <span class="tag-label">Tag</span>
            <span class="group-badge" style:background={tagColor(group.tag)}>
              {formatLabel(group.tag)}
            </span>
            <span class="group-count">{group.emails.length}</span>
            <span class="spacer"></span>
            <svg
              class="chevron"
              class:open={isExpanded}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>

        <!-- Event picker + Execute All -->
        <div class="event-exec-row">
          {#if userEvents.length === 0}
            <span class="no-events-hint">No events defined — create one in the Actions page</span>
          {:else}
            <span class="exec-label">Run event:</span>
            <select
              class="event-select"
              value={selectedEvt}
              onchange={(e) => setSelectedEvent(group.tag, e.target.value)}
            >
              {#each userEvents as evt}
                <option value={evt}>{formatLabel(evt)}</option>
              {/each}
            </select>
            <button
              class="execute-all-btn"
              onclick={() => handleExecuteGroup(group.tag, group.emails)}
              disabled={batchState?.running || !selectedEvt}
            >
              {#if batchState?.running}
                ⏳ Running...
              {:else if batchState?.result}
                {batchState.result.success ? `✅ Done (${batchState.result.successful}/${batchState.result.total})` : `❌ Failed`}
              {:else}
                ▶ All ({group.emails.length})
              {/if}
            </button>
          {/if}
        </div>

        {#if batchState?.result}
          <div class="batch-result" class:success={batchState.result.success} class:error={!batchState.result.success}>
            {batchState.result.message}
          </div>
        {/if}

        {#if isExpanded}
          <div class="group-emails">
            {#each group.emails as email}
              {@const execState = getExecutionState(`single_${email.emailId}`)}
              <div class="email-item">
                <div class="email-main">
                  <div class="email-subject">{email.subject}</div>
                  <div class="email-meta">
                    {#if email.from}<span class="email-from">{shortSender(email.from)}</span>{/if}
                    {#if email.date}<span class="sep"> · </span><span class="email-date">{shortDate(email.date)}</span>{/if}
                  </div>
                  {#if email.summary}
                    <div class="email-summary">{email.summary}</div>
                  {/if}
                  {#if email.tags?.length}
                    <div class="email-tags">
                      {#each email.tags as t}
                        <span class="tag">{t}</span>
                      {/each}
                    </div>
                  {/if}
                </div>
                {#if userEvents.length > 0}
                  <div class="email-exec-row">
                    <button
                      class="execute-btn"
                      onclick={() => handleExecute(group.tag, email)}
                      disabled={execState?.running || !selectedEvt}
                    >
                      {#if execState?.running}
                        ⏳ Running...
                      {:else if execState?.result}
                        {execState.result.success ? "✅ Done" : "❌ Failed"}
                      {:else}
                        ▶ Execute
                      {/if}
                    </button>
                    {#if execState?.result}
                      <span class="exec-result-inline" class:success={execState.result.success} class:error={!execState.result.success}>
                        {execState.result.message}
                      </span>
                    {/if}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
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

  /* ── Grouped events (/events command) ─────────────────────────────── */
  .events-grouped {
    align-self: flex-start;
    width: 100%;
    max-width: 95%;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .grouped-head {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    padding: 0.2rem 0 0.3rem;
  }
  .grouped-title {
    font-size: 0.8rem;
    font-weight: 700;
    color: #ccc;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .grouped-stat {
    font-size: 0.65rem;
    color: #555;
  }

  .group-block {
    background: #131313;
    border: 1px solid #222;
    border-radius: 10px;
    overflow: hidden;
  }
  .group-header-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.4rem 0.3rem 0;
  }
  .tag-label {
    font-size: 0.52rem;
    font-weight: 700;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-left: 0.7rem;
  }
  .event-exec-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.7rem 0.4rem;
    border-top: 1px solid #1a1a1a;
    background: rgba(59, 130, 246, 0.03);
  }
  .exec-label {
    font-size: 0.6rem;
    color: #666;
    flex-shrink: 0;
  }
  .event-select {
    flex: 1;
    min-width: 0;
    padding: 0.25rem 0.4rem;
    font-size: 0.62rem;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 5px;
    color: #ccc;
    font-family: inherit;
    outline: none;
    cursor: pointer;
  }
  .event-select:focus {
    border-color: #3b82f6;
  }
  .no-events-hint {
    font-size: 0.6rem;
    color: #555;
    font-style: italic;
  }
  .email-exec-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.3rem;
    flex-wrap: wrap;
  }
  .exec-result-inline {
    font-size: 0.6rem;
    font-weight: 500;
  }
  .exec-result-inline.success { color: #22c55e; }
  .exec-result-inline.error { color: #ef4444; }
  .group-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    padding: 0.55rem 0.7rem;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    color: #e8e8e8;
    font-family: inherit;
    transition: background 0.15s;
  }
  .group-header:hover {
    background: rgba(255, 255, 255, 0.03);
  }
  .execute-all-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.35rem 0.6rem;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 6px;
    color: #10b981;
    font-size: 0.62rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .execute-all-btn:hover {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.5);
  }
  .group-badge {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 0.12rem 0.45rem;
    border-radius: 5px;
    color: #fff;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .group-count {
    font-size: 0.75rem;
    font-weight: 600;
    color: #ccc;
    min-width: 18px;
  }
  .spacer { flex: 1; }
  .chevron {
    flex-shrink: 0;
    color: #555;
    transition: transform 0.2s ease;
  }
  .chevron.open {
    transform: rotate(180deg);
  }

  .group-emails {
    border-top: 1px solid #1e1e1e;
    display: flex;
    flex-direction: column;
  }
  .email-item {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.55rem 0.7rem;
    border-bottom: 1px solid #1a1a1a;
  }
  .email-item:last-child {
    border-bottom: none;
  }
  .email-main {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .email-item .email-subject {
    font-size: 0.75rem;
    font-weight: 500;
    color: #ddd;
    line-height: 1.3;
  }
  .email-meta {
    font-size: 0.6rem;
    color: #555;
  }
  .email-from {
    color: #777;
  }
  .email-date {
    color: #555;
  }
  .email-summary {
    font-size: 0.65rem;
    color: #888;
    line-height: 1.4;
    margin-top: 0.1rem;
  }
  .email-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
    margin-top: 0.1rem;
  }
  .execute-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 5px;
    color: #3b82f6;
    font-size: 0.62rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
  }
  .execute-btn:hover:not(:disabled) {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
  }
  .execute-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .batch-result {
    padding: 0.4rem 0.5rem;
    border-radius: 5px;
    font-size: 0.62rem;
    font-weight: 500;
    margin: 0.2rem 0.7rem 0.3rem;
  }
  .batch-result.success {
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #22c55e;
  }
  .batch-result.error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
  }

  .execute-all-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.3rem 0.6rem;
    background: rgba(59, 130, 246, 0.12);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 5px;
    color: #3b82f6;
    font-size: 0.64rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
  }
  .execute-all-btn:hover:not(:disabled) {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
  }
  .execute-all-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
