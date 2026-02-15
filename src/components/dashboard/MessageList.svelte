<script>
  import { onMount } from "svelte";
  import { formatDate, extractName, initial } from "../../lib/email-utils.js";
  import { mountLog } from "../../lib/debug.js";

  let { messages = [], onselect } = $props();

  onMount(() => mountLog("MessageList"));
</script>

<div class="message-list">
  {#each messages as msg}
    <button class="message-row" onclick={() => onselect(msg)}>
      <div class="msg-avatar">{initial(msg.from)}</div>
      <div class="msg-body">
        <div class="msg-top">
          <span class="msg-from">{extractName(msg.from)}</span>
          <span class="msg-date">{formatDate(msg.date)}</span>
        </div>
        <div class="msg-subject">{msg.subject}</div>
        <div class="msg-snippet">{msg.snippet}</div>
      </div>
    </button>
  {/each}
</div>

<style>
  .message-list {
    display: flex;
    flex-direction: column;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    overflow: hidden;
  }
  .message-row {
    display: flex;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    background: #161616;
    border: none;
    border-bottom: 1px solid #222;
    cursor: pointer;
    transition: background 0.1s;
    text-align: left;
    color: inherit;
    font-family: inherit;
    width: 100%;
  }
  .message-row:last-child {
    border-bottom: none;
  }
  .message-row:hover {
    background: #1c1c1c;
  }
  .msg-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #2a2a2a;
    color: #aaa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 600;
    flex-shrink: 0;
  }
  .msg-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .msg-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
  }
  .msg-from {
    font-size: 0.85rem;
    font-weight: 600;
    color: #e8e8e8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .msg-date {
    font-size: 0.7rem;
    color: #666;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .msg-subject {
    font-size: 0.82rem;
    color: #ccc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .msg-snippet {
    font-size: 0.75rem;
    color: #777;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
