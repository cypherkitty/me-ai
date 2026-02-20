<script>
  import {
    getAllEventTypes,
    getAllEventTypeGroups,
    getCommandsForEvent,
    saveCommandsForEvent,
    addCommandToEvent,
    removeCommandFromEvent,
    updateCommandInEvent,
    addEventType,
    deleteEventType,
    getGroupForEventType,
    setGroupForEventType,
    EVENT_GROUPS,
  } from "../../lib/events.js";
  import { getAvailableActions } from "../../lib/plugins/execution-service.js";
  import { stringToHue } from "../../lib/format.js";

  let { open = $bindable(false) } = $props();

  let eventTypes = $state([]);
  let commandCounts = $state({});
  let eventTypeGroups = $state({});
  let selectedType = $state(null);
  let selectedTypeHasOverride = $state(false);
  let selectedTypeGroup = $state("INFO");
  let commands = $state([]);
  let editingCmd = $state(null);
  let showNewType = $state(false);
  let newTypeName = $state("");
  let showPicker = $state(false);

  // All actions available from registered plugins, grouped by plugin
  const PLUGIN_ACTIONS = (() => {
    const gmail = getAvailableActions("gmail");
    return [{ pluginId: "gmail", pluginName: "Gmail", actions: gmail }];
  })();

  // Icons for well-known action IDs
  const ACTION_ICONS = {
    mark_read:         "✓",
    mark_unread:       "○",
    star:              "★",
    unstar:            "☆",
    trash:             "🗑",
    delete:            "✕",
    mark_spam:         "⚠",
    archive:           "↓",
    apply_label:       "🏷",
    remove_label:      "🏷",
    mark_important:    "!",
    mark_not_important:"–",
  };

  async function refresh() {
    eventTypes = await getAllEventTypes();
    const counts = {};
    await Promise.all(eventTypes.map(async t => {
      counts[t] = (await getCommandsForEvent(t)).length;
    }));
    commandCounts = counts;
    eventTypeGroups = await getAllEventTypeGroups();
    if (selectedType) {
      commands = (await getCommandsForEvent(selectedType)).map(c => ({ ...c }));
      selectedTypeHasOverride = await hasUserOverride(selectedType);
      selectedTypeGroup = await getGroupForEventType(selectedType);
    }
  }

  $effect(() => {
    if (open) refresh();
  });

  async function selectType(type) {
    selectedType = type;
    commands = (await getCommandsForEvent(type)).map(c => ({ ...c }));
    selectedTypeHasOverride = await hasUserOverride(type);
    selectedTypeGroup = await getGroupForEventType(type);
    editingCmd = null;
    showPicker = false;
  }

  async function handleGroupChange(newGroup) {
    if (!selectedType) return;
    await setGroupForEventType(selectedType, newGroup);
    selectedTypeGroup = newGroup;
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

  /** Add a plugin-provided action to the current event type's pipeline. */
  async function handleAddPluginAction(handler) {
    await addCommandToEvent(selectedType, {
      id: handler.actionId,
      name: handler.name,
      description: handler.description,
      icon: ACTION_ICONS[handler.actionId] || undefined,
    });
    await refresh();
  }

  /** Whether an action ID is already in the current pipeline. */
  function isInPipeline(actionId) {
    return commands.some(c => c.id === actionId);
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
            <span class="sidebar-title">Event Types</span>
            <button class="icon-btn" title="Add event type" onclick={() => showNewType = !showNewType}>+</button>
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
                <span class="spacer-flex"></span>
                {#if eventTypeGroups[type]}
                  {@const grp = EVENT_GROUPS[eventTypeGroups[type]]}
                  {#if grp}
                    <span class="type-group-chip" style:color={grp.color} title={grp.description}>
                      {grp.label}
                    </span>
                  {/if}
                {/if}
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
              <div class="group-selector">
                {#each Object.values(EVENT_GROUPS) as grp}
                  <button
                    class="group-chip"
                    class:active={selectedTypeGroup === grp.id}
                    style:--grp-color={grp.color}
                    onclick={() => handleGroupChange(grp.id)}
                    title={grp.description}
                  >
                    {grp.label}
                  </button>
                {/each}
              </div>
              <button class="text-btn danger" onclick={handleDeleteType}>Delete</button>
              <button class="small-btn" onclick={() => { showPicker = !showPicker; editingCmd = null; }}>
                {showPicker ? "Cancel" : "+ Add Action"}
              </button>
            </div>

            {#if showPicker}
              <div class="action-picker">
                {#each PLUGIN_ACTIONS as group}
                  <div class="picker-group">
                    <div class="picker-group-label">
                      <span class="picker-plugin-badge">{group.pluginName}</span>
                      <span class="picker-hint">Click to add to pipeline</span>
                    </div>
                    <div class="picker-grid">
                      {#each group.actions as handler}
                        {@const added = isInPipeline(handler.actionId)}
                        <button
                          class="picker-tile"
                          class:added
                          onclick={() => handleAddPluginAction(handler)}
                          title={handler.description}
                        >
                          <span class="picker-tile-icon">{ACTION_ICONS[handler.actionId] ?? "·"}</span>
                          <span class="picker-tile-name">{handler.name}</span>
                          {#if added}
                            <span class="picker-tile-added">✓ added</span>
                          {/if}
                        </button>
                      {/each}
                    </div>
                  </div>
                {/each}
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
                <p>No event types yet. Run a scan to discover event types, or click <strong>+</strong> to create one manually.</p>
              {:else}
                <p>Select an event type on the left to view and edit its action pipeline.</p>
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
  .spacer-flex { flex: 1; }
  .type-count {
    font-size: 0.58rem;
    color: #555;
    flex-shrink: 0;
  }
  .type-group-chip {
    font-size: 0.52rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    flex-shrink: 0;
    opacity: 0.8;
  }

  /* ── Group selector ───────────────────────────────────────────────── */
  .group-selector {
    display: flex;
    gap: 0.2rem;
    flex-shrink: 0;
  }
  .group-chip {
    padding: 0.15rem 0.45rem;
    font-size: 0.58rem;
    font-weight: 600;
    border-radius: 4px;
    border: 1px solid transparent;
    background: #1a1a1a;
    color: #555;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.12s;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
  .group-chip:hover {
    color: var(--grp-color);
    border-color: var(--grp-color);
  }
  .group-chip.active {
    color: var(--grp-color);
    border-color: var(--grp-color);
    background: color-mix(in srgb, var(--grp-color) 12%, transparent);
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

  /* ── Inline edit form (existing rows) ────────────────────────────── */
  .form-row {
    display: flex;
    gap: 0.3rem;
  }
  .icon-input { width: 50px; flex-shrink: 0; text-align: center; }
  .name-input { flex: 1; min-width: 0; }
  .desc-input { width: 100%; }
  .cmd-row.editing input {
    padding: 0.3rem 0.4rem;
    font-size: 0.68rem;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 4px;
    color: #e8e8e8;
    font-family: inherit;
    outline: none;
  }
  .cmd-row.editing input:focus {
    border-color: #3b82f6;
  }
  .form-actions {
    display: flex;
    gap: 0.3rem;
    justify-content: flex-end;
  }

  /* ── Plugin action picker ─────────────────────────────────────────── */
  .action-picker {
    border-bottom: 1px solid #1e1e1e;
    padding: 0.6rem 0.7rem;
    background: #0d0d0d;
    flex-shrink: 0;
  }
  .picker-group-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .picker-plugin-badge {
    font-size: 0.58rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.12);
    border: 1px solid rgba(59, 130, 246, 0.25);
    border-radius: 4px;
    padding: 0.1rem 0.4rem;
  }
  .picker-hint {
    font-size: 0.58rem;
    color: #444;
  }
  .picker-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.3rem;
  }
  .picker-tile {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.15rem;
    padding: 0.45rem 0.5rem;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 7px;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: all 0.13s;
    position: relative;
    overflow: hidden;
  }
  .picker-tile:hover {
    background: #1e1e1e;
    border-color: #3b82f6;
  }
  .picker-tile.added {
    border-color: rgba(52, 211, 153, 0.35);
    background: rgba(52, 211, 153, 0.05);
  }
  .picker-tile.added:hover {
    border-color: rgba(52, 211, 153, 0.6);
    background: rgba(52, 211, 153, 0.1);
  }
  .picker-tile-icon {
    font-size: 1rem;
    line-height: 1;
    margin-bottom: 0.1rem;
    color: #aaa;
  }
  .picker-tile.added .picker-tile-icon {
    color: #34d399;
  }
  .picker-tile-name {
    font-size: 0.64rem;
    font-weight: 600;
    color: #ccc;
    line-height: 1.3;
  }
  .picker-tile.added .picker-tile-name {
    color: #34d399;
  }
  .picker-tile-added {
    font-size: 0.52rem;
    color: #34d399;
    font-weight: 600;
    letter-spacing: 0.02em;
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
