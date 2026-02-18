<script>
  import {
    getAllEventTypes,
    getCommandsForEvent,
    saveCommandsForEvent,
    addCommandToEvent,
    removeCommandFromEvent,
    updateCommandInEvent,
    addEventType,
    deleteEventType,
  } from "../../lib/events.js";
  import { stringToHue } from "../../lib/format.js";

  let { open = $bindable(false) } = $props();

  let eventTypes = $state([]);
  let commandCounts = $state({});
  let selectedType = $state(null);
  let selectedTypeHasOverride = $state(false);
  let commands = $state([]);
  let editingCmd = $state(null);
  let showNewType = $state(false);
  let newTypeName = $state("");
  let showNewCmd = $state(false);
  let newCmd = $state({ name: "", description: "", icon: "" });

  async function refresh() {
    eventTypes = await getAllEventTypes();
    const counts = {};
    await Promise.all(eventTypes.map(async t => {
      counts[t] = (await getCommandsForEvent(t)).length;
    }));
    commandCounts = counts;
    if (selectedType) {
      commands = (await getCommandsForEvent(selectedType)).map(c => ({ ...c }));
      selectedTypeHasOverride = await hasUserOverride(selectedType);
    }
  }

  $effect(() => {
    if (open) refresh();
  });

  async function selectType(type) {
    selectedType = type;
    commands = (await getCommandsForEvent(type)).map(c => ({ ...c }));
    selectedTypeHasOverride = await hasUserOverride(type);
    editingCmd = null;
    showNewCmd = false;
  }

  function formatLabel(str) {
    return str.split("_").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
  }

  function typeColor(action) {
    return `hsl(${stringToHue(action)}, 55%, 55%)`;
  }

  async function handleAddType() {
    const name = newTypeName.trim();
    if (!name) return;
    await addEventType(name);
    newTypeName = "";
    showNewType = false;
    await refresh();
    const normalized = name.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
    await selectType(normalized);
  }

  async function handleDeleteType() {
    if (!selectedType) return;
    await deleteEventType(selectedType);
    selectedType = null;
    commands = [];
    selectedTypeHasOverride = false;
    await refresh();
  }

  async function handleAddCommand() {
    if (!newCmd.name.trim()) return;
    const id = newCmd.name.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    await addCommandToEvent(selectedType, {
      id,
      name: newCmd.name.trim(),
      description: newCmd.description.trim(),
      icon: newCmd.icon.trim() || undefined,
    });
    newCmd = { name: "", description: "", icon: "" };
    showNewCmd = false;
    await refresh();
  }

  async function handleRemoveCommand(cmdId) {
    await removeCommandFromEvent(selectedType, cmdId);
    await refresh();
  }

  function startEdit(cmd) {
    editingCmd = { ...cmd };
  }

  async function saveEdit() {
    if (!editingCmd) return;
    await updateCommandInEvent(selectedType, editingCmd.id, {
      name: editingCmd.name,
      description: editingCmd.description,
      icon: editingCmd.icon,
    });
    editingCmd = null;
    await refresh();
  }

  function cancelEdit() {
    editingCmd = null;
  }

  async function moveCommand(idx, direction) {
    const arr = [...commands];
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    await saveCommandsForEvent(selectedType, arr);
    await refresh();
  }
</script>

{#if open}
  <div class="editor-overlay" role="dialog">
    <div class="editor-panel">
      <div class="editor-header">
        <h2>Action Pipeline Editor</h2>
        <span class="subtitle">Configure sequential action pipelines for each event type</span>
        <button class="close-btn" onclick={() => open = false}>&#10005;</button>
      </div>

      <div class="editor-body">
        <!-- Left: event types list -->
        <div class="types-sidebar">
          <div class="sidebar-head">
            <span class="sidebar-title">Events</span>
            <button class="icon-btn" title="Add event" onclick={() => showNewType = !showNewType}>+</button>
          </div>

          {#if showNewType}
            <div class="new-type-form">
              <input
                type="text"
                placeholder="e.g. ESCALATE"
                bind:value={newTypeName}
                onkeydown={(e) => e.key === "Enter" && handleAddType()}
              />
              <button class="small-btn" onclick={handleAddType}>Add</button>
            </div>
          {/if}

          <div class="types-list">
            {#each eventTypes as type}
              <button
                class="type-item"
                class:selected={selectedType === type}
                onclick={() => selectType(type)}
              >
                <span class="type-dot" style:background={typeColor(type)}></span>
                <span class="type-label">{formatLabel(type)}</span>
                <span class="type-count">{commandCounts[type] ?? 0}</span>
              </button>
            {/each}
          </div>
        </div>

        <!-- Right: commands for selected type -->
        <div class="commands-panel">
          {#if selectedType}
            <div class="commands-head">
              <span class="type-badge" style:background={typeColor(selectedType)}>
                {formatLabel(selectedType)}
              </span>
              <span class="cmd-count">{commands.length} action{commands.length === 1 ? "" : "s"}</span>
              <span class="pipeline-note">• Sequential pipeline</span>
              <span class="spacer"></span>
              <button class="text-btn danger" onclick={handleDeleteType}>Delete event</button>
              <button class="small-btn" onclick={() => { showNewCmd = !showNewCmd; editingCmd = null; }}>
                {showNewCmd ? "Cancel" : "+ Add Action"}
              </button>
            </div>

            {#if showNewCmd}
              <div class="cmd-form">
                <div class="form-row">
                  <input type="text" placeholder="Icon (emoji)" bind:value={newCmd.icon} class="icon-input" />
                  <input type="text" placeholder="Action name" bind:value={newCmd.name} class="name-input" />
                </div>
                <input type="text" placeholder="Description" bind:value={newCmd.description} class="desc-input" />
                <div class="form-actions">
                  <button class="small-btn primary" onclick={handleAddCommand}>Add Action</button>
                </div>
              </div>
            {/if}

            <div class="commands-list">
              {#each commands as cmd, i (cmd.id)}
                {#if editingCmd?.id === cmd.id}
                  <div class="cmd-row editing">
                    <div class="form-row">
                      <input type="text" bind:value={editingCmd.icon} class="icon-input" placeholder="Icon" />
                      <input type="text" bind:value={editingCmd.name} class="name-input" placeholder="Name" />
                    </div>
                    <input type="text" bind:value={editingCmd.description} class="desc-input" placeholder="Description" />
                    <div class="form-actions">
                      <button class="small-btn primary" onclick={saveEdit}>Save</button>
                      <button class="small-btn" onclick={cancelEdit}>Cancel</button>
                    </div>
                  </div>
                {:else}
                  <div class="cmd-row">
                    <div class="step-marker">{i + 1}</div>
                    <div class="cmd-main">
                      {#if cmd.icon}<span class="cmd-icon">{cmd.icon}</span>{/if}
                      <div class="cmd-info">
                        <span class="cmd-name">{cmd.name}</span>
                        <span class="cmd-desc">{cmd.description}</span>
                      </div>
                    </div>
                    <div class="cmd-actions">
                      <button
                        class="icon-btn small"
                        title="Move up"
                        disabled={i === 0}
                        onclick={() => moveCommand(i, -1)}
                      >&#9650;</button>
                      <button
                        class="icon-btn small"
                        title="Move down"
                        disabled={i === commands.length - 1}
                        onclick={() => moveCommand(i, 1)}
                      >&#9660;</button>
                      <button class="icon-btn small" title="Edit" onclick={() => startEdit(cmd)}>&#9998;</button>
                      <button class="icon-btn small danger" title="Remove" onclick={() => handleRemoveCommand(cmd.id)}>&#10005;</button>
                    </div>
                  </div>
                {/if}
              {/each}

              {#if commands.length === 0}
                <div class="empty-cmds">No actions yet. Add one above.</div>
              {/if}
            </div>

          {:else}
            <div class="no-selection">
              {#if eventTypes.length === 0}
                <p>No events yet. Click <strong>+</strong> to create your first event and define its action pipeline.</p>
              {:else}
                <p>Select an event on the left to view and edit its actions.</p>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .editor-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }
  .editor-panel {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 14px;
    width: 100%;
    max-width: 720px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .editor-header {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    padding: 0.8rem 1rem;
    border-bottom: 1px solid #222;
    flex-shrink: 0;
  }
  .editor-header h2 {
    font-size: 0.95rem;
    font-weight: 700;
    color: #e8e8e8;
    margin: 0;
  }
  .subtitle {
    font-size: 0.68rem;
    color: #666;
    flex: 1;
  }
  .close-btn {
    background: none;
    border: none;
    color: #666;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    transition: all 0.15s;
  }
  .close-btn:hover {
    color: #ccc;
    background: rgba(255, 255, 255, 0.05);
  }

  .editor-body {
    display: flex;
    flex: 1;
    overflow: hidden;
    min-height: 0;
  }

  /* ── Sidebar ──────────────────────────────────────────────────────── */
  .types-sidebar {
    width: 200px;
    border-right: 1px solid #222;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  .sidebar-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.6rem;
    border-bottom: 1px solid #1e1e1e;
  }
  .sidebar-title {
    font-size: 0.6rem;
    font-weight: 700;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .new-type-form {
    display: flex;
    gap: 0.3rem;
    padding: 0.4rem 0.5rem;
    border-bottom: 1px solid #1e1e1e;
  }
  .new-type-form input {
    flex: 1;
    min-width: 0;
    padding: 0.3rem 0.4rem;
    font-size: 0.65rem;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 4px;
    color: #e8e8e8;
    font-family: inherit;
    outline: none;
  }
  .new-type-form input:focus {
    border-color: #3b82f6;
  }
  .types-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.2rem 0;
  }
  .type-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: 100%;
    padding: 0.4rem 0.6rem;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    color: #bbb;
    font-family: inherit;
    font-size: 0.68rem;
    transition: background 0.12s;
  }
  .type-item:hover {
    background: rgba(255, 255, 255, 0.04);
  }
  .type-item.selected {
    background: rgba(59, 130, 246, 0.1);
    color: #e8e8e8;
  }
  .type-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .type-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .type-count {
    font-size: 0.58rem;
    color: #555;
    flex-shrink: 0;
  }

  /* ── Commands panel ───────────────────────────────────────────────── */
  .commands-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }
  .commands-head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.7rem;
    border-bottom: 1px solid #1e1e1e;
    flex-shrink: 0;
  }
  .type-badge {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 0.12rem 0.45rem;
    border-radius: 5px;
    color: #fff;
    white-space: nowrap;
  }
  .cmd-count {
    font-size: 0.62rem;
    color: #666;
  }
  .pipeline-note {
    font-size: 0.58rem;
    color: #555;
    font-style: italic;
  }
  .spacer { flex: 1; }

  .commands-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.3rem 0;
  }

  .cmd-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.7rem;
    border-bottom: 1px solid #181818;
    transition: background 0.12s;
  }
  .cmd-row:hover {
    background: rgba(255, 255, 255, 0.02);
  }
  .step-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: rgba(59, 130, 246, 0.15);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 50%;
    color: #3b82f6;
    font-size: 0.62rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  .cmd-row.editing {
    flex-direction: column;
    align-items: stretch;
    gap: 0.3rem;
    padding: 0.55rem 0.7rem;
    background: rgba(59, 130, 246, 0.04);
    border: 1px solid rgba(59, 130, 246, 0.15);
    border-radius: 8px;
    margin: 0.2rem 0.4rem;
  }
  .cmd-main {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    min-width: 0;
    flex: 1;
  }
  .cmd-icon {
    font-size: 0.85rem;
    flex-shrink: 0;
  }
  .cmd-info {
    display: flex;
    flex-direction: column;
    gap: 0.05rem;
    min-width: 0;
  }
  .cmd-name {
    font-size: 0.72rem;
    font-weight: 600;
    color: #ddd;
  }
  .cmd-desc {
    font-size: 0.6rem;
    color: #777;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cmd-actions {
    display: flex;
    gap: 0.15rem;
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .cmd-row:hover .cmd-actions {
    opacity: 1;
  }

  /* ── Buttons ──────────────────────────────────────────────────────── */
  .icon-btn {
    background: none;
    border: 1px solid #333;
    border-radius: 4px;
    color: #888;
    cursor: pointer;
    font-size: 0.72rem;
    padding: 0.2rem 0.4rem;
    line-height: 1;
    transition: all 0.12s;
    font-family: inherit;
  }
  .icon-btn:hover:not(:disabled) {
    color: #ccc;
    border-color: #555;
    background: rgba(255, 255, 255, 0.05);
  }
  .icon-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .icon-btn.small {
    font-size: 0.58rem;
    padding: 0.15rem 0.3rem;
  }
  .icon-btn.danger:hover {
    color: #f87171;
    border-color: rgba(248, 113, 113, 0.4);
  }

  .small-btn {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 5px;
    color: #ccc;
    cursor: pointer;
    font-size: 0.62rem;
    padding: 0.25rem 0.55rem;
    font-family: inherit;
    transition: all 0.12s;
    white-space: nowrap;
  }
  .small-btn:hover {
    background: #222;
    border-color: #444;
  }
  .small-btn.primary {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #fff;
  }
  .small-btn.primary:hover {
    background: #2563eb;
  }

  .text-btn {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 0.6rem;
    text-decoration: underline;
    padding: 0;
    font-family: inherit;
  }
  .text-btn:hover {
    color: #999;
  }
  .text-btn.danger {
    color: #555;
  }
  .text-btn.danger:hover {
    color: #f87171;
  }

  /* ── Form ─────────────────────────────────────────────────────────── */
  .cmd-form {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.55rem 0.7rem;
    border-bottom: 1px solid #1e1e1e;
    background: rgba(59, 130, 246, 0.03);
  }
  .form-row {
    display: flex;
    gap: 0.3rem;
  }
  .icon-input {
    width: 50px;
    flex-shrink: 0;
    text-align: center;
  }
  .name-input {
    flex: 1;
    min-width: 0;
  }
  .desc-input {
    width: 100%;
  }
  .cmd-form input, .cmd-row.editing input {
    padding: 0.3rem 0.4rem;
    font-size: 0.68rem;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 4px;
    color: #e8e8e8;
    font-family: inherit;
    outline: none;
  }
  .cmd-form input:focus, .cmd-row.editing input:focus {
    border-color: #3b82f6;
  }
  .form-actions {
    display: flex;
    gap: 0.3rem;
    justify-content: flex-end;
  }

  /* ── Empty state ──────────────────────────────────────────────────── */
  .no-selection {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
  }
  .no-selection p {
    color: #555;
    font-size: 0.78rem;
    text-align: center;
  }
  .empty-cmds {
    padding: 1.5rem;
    color: #555;
    font-size: 0.72rem;
    text-align: center;
  }
</style>
