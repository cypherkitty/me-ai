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
  
  import { SvelteFlow, Background, Controls } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  import TriggerNode from "./nodes/TriggerNode.svelte";
  import ActionNode from "./nodes/ActionNode.svelte";
  import AddNode from "./nodes/AddNode.svelte";

  const nodeTypes = {
    trigger: TriggerNode,
    action: ActionNode,
    add: AddNode
  };

  let { open = $bindable(false) } = $props();

  let eventTypes = $state([]);
  let commandCounts = $state({});
  let eventTypeGroups = $state({});
  let selectedType = $state(null);
  let selectedTypeGroup = $state("INFO");
  let commands = $state([]);
  let editingCmd = $state(null);
  let showNewType = $state(false);
  let newTypeName = $state("");
  let showPicker = $state(false);

  let nodes = $state.raw([]);
  let edges = $state.raw([]);

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
      selectedTypeGroup = await getGroupForEventType(selectedType);
    }
  }

  $effect(() => {
    if (open) refresh();
  });

  $effect(() => {
    if (selectedType) {
      updateGraph();
    } else {
      nodes = [];
      edges = [];
    }
  });

  function updateGraph() {
    const newNodes = [];
    const newEdges = [];
    
    newNodes.push({
      id: 'trigger',
      type: 'trigger',
      position: { x: 50, y: 100 },
      data: { 
        label: selectedType,
        group: selectedTypeGroup,
      }
    });
    
    let prevId = 'trigger';
    let x = 300;
    
    commands.forEach((cmd, i) => {
      newNodes.push({
        id: cmd.id,
        type: 'action',
        position: { x, y: 100 },
        data: {
          cmd,
          onEdit: () => startEdit(cmd),
          onDelete: () => handleRemoveCommand(cmd.id),
        }
      });
      
      newEdges.push({
        id: `e-${prevId}-${cmd.id}`,
        source: prevId,
        target: cmd.id,
        animated: true,
        style: "stroke: #666; stroke-width: 2"
      });
      
      prevId = cmd.id;
      x += 270;
    });
    
    // Add Node
    newNodes.push({
      id: 'add-action',
      type: 'add',
      position: { x, y: 135 },
      data: {
        onClick: () => { showPicker = true; editingCmd = null; }
      }
    });
    newEdges.push({
      id: `e-${prevId}-add-action`,
      source: prevId,
      target: 'add-action',
      style: "stroke: #444; stroke-width: 2; stroke-dasharray: 4"
    });
    
    nodes = newNodes;
    edges = newEdges;
  }

  async function selectType(type) {
    selectedType = type;
    commands = (await getCommandsForEvent(type)).map(c => ({ ...c }));
    selectedTypeGroup = await getGroupForEventType(type);
    editingCmd = null;
    showPicker = false;
  }

  async function handleGroupChange(newGroup) {
    if (!selectedType) return;
    await setGroupForEventType(selectedType, newGroup);
    selectedTypeGroup = newGroup;
    updateGraph();
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
    await refresh();
  }

  async function handleAddPluginAction(handler, pluginId) {
    await addCommandToEvent(selectedType, {
      id: handler.actionId,
      pluginId,
      commandId: handler.actionId,
      name: handler.name,
      description: handler.description,
      icon: ACTION_ICONS[handler.actionId] || undefined,
    });
    showPicker = false;
    await refresh();
  }

  function isInPipeline(actionId) {
    return commands.some(c => c.id === actionId);
  }

  async function handleRemoveCommand(cmdId) {
    await removeCommandFromEvent(selectedType, cmdId);
    await refresh();
  }

  function startEdit(cmd) {
    showPicker = false;
    editingCmd = { 
      ...cmd, 
      pluginCommandKey: cmd.pluginId && cmd.commandId ? `${cmd.pluginId}:${cmd.commandId}` : "" 
    };
  }

  async function saveEdit() {
    if (!editingCmd) return;
    await updateCommandInEvent(selectedType, editingCmd.id, {
      name: editingCmd.name,
      description: editingCmd.description,
      icon: editingCmd.icon,
      pluginId: editingCmd.pluginId,
      commandId: editingCmd.commandId,
    });
    editingCmd = null;
    await refresh();
  }

  function cancelEdit() {
    editingCmd = null;
  }

  async function handleCreateCustomAction() {
    const newId = `custom_${Date.now()}`;
    await addCommandToEvent(selectedType, {
      id: newId,
      pluginId: "",
      commandId: "",
      name: "New Custom Action",
      description: "",
      icon: "⚡",
    });
    showPicker = false;
    await refresh();
    const cmd = commands.find(c => c.id === newId);
    if (cmd) startEdit(cmd);
  }
</script>

{#if open}
  <div class="editor-overlay" role="dialog">
    <div class="editor-panel">
      <div class="editor-header">
        <h2>Action Pipeline Editor</h2>
        <span class="subtitle">n8n-like visual graph editor</span>
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

        <!-- Right: canvas panel -->
        <div class="commands-panel">
          {#if selectedType}
            <div class="commands-head">
              <span class="type-badge" style:background={typeColor(selectedType)}>
                {formatLabel(selectedType)}
              </span>
              <span class="cmd-count">{commands.length} action{commands.length === 1 ? "" : "s"}</span>
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
            </div>

            <div class="canvas-wrapper">
              <SvelteFlow 
                {nodes} 
                {edges} 
                {nodeTypes} 
                fitView 
                fitViewOptions={{ padding: 0.2, minZoom: 0.8 }}
                minZoom={0.5}
                maxZoom={1.5}
                colorMode="dark"
              >
                <Background bgColor="#111" patternColor="#333" />
                <Controls showInteractive={false} />
              </SvelteFlow>

              <!-- Floating overlay panels for Picker & Editor -->
              {#if showPicker}
                <div class="floating-panel picker-panel">
                  <div class="panel-header">
                    <h3>Add Action Node</h3>
                    <button class="close-btn" onclick={() => showPicker = false}>&#10005;</button>
                  </div>
                  <div class="action-picker">
                    {#each PLUGIN_ACTIONS as group}
                      <div class="picker-group">
                        <div class="picker-group-label">
                          <span class="picker-plugin-badge">{group.pluginName}</span>
                        </div>
                        <div class="picker-grid">
                          {#each group.actions as handler}
                            {@const added = isInPipeline(handler.actionId)}
                            <button
                              class="picker-tile"
                              class:added
                              onclick={() => handleAddPluginAction(handler, group.pluginId)}
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
                    <div class="picker-custom-row">
                      <button class="small-btn primary" onclick={handleCreateCustomAction}>+ Create Custom Action</button>
                      <span class="picker-hint" style="margin-left: 0.5rem;">Link to any plugin command</span>
                    </div>
                  </div>
                </div>
              {/if}

              {#if editingCmd}
                <div class="floating-panel editor-panel-inner">
                  <div class="panel-header">
                    <h3>Edit Action Node</h3>
                    <button class="close-btn" onclick={cancelEdit}>&#10005;</button>
                  </div>
                  <div class="cmd-form">
                    <div class="form-row">
                      <input type="text" bind:value={editingCmd.icon} class="icon-input" placeholder="Icon" />
                      <input type="text" bind:value={editingCmd.name} class="name-input" placeholder="Name" />
                    </div>
                    <input type="text" bind:value={editingCmd.description} class="desc-input" placeholder="Description" />
                    
                    <div class="form-row">
                      <select 
                        class="plugin-select" 
                        bind:value={editingCmd.pluginCommandKey} 
                        onchange={(e) => {
                          if (e.target.value) {
                            const [pId, cId] = e.target.value.split(':');
                            editingCmd.pluginId = pId;
                            editingCmd.commandId = cId;
                          } else {
                            editingCmd.pluginId = "";
                            editingCmd.commandId = "";
                          }
                        }}
                      >
                        <option value="">-- Select Plugin Command --</option>
                        {#each PLUGIN_ACTIONS as group}
                          <optgroup label={group.pluginName}>
                            {#each group.actions as handler}
                              <option value="{group.pluginId}:{handler.actionId}">
                                {handler.name} ({handler.actionId})
                              </option>
                            {/each}
                          </optgroup>
                        {/each}
                      </select>
                    </div>

                    <div class="form-actions">
                      <button class="small-btn primary" onclick={saveEdit}>Save</button>
                      <button class="small-btn" onclick={cancelEdit}>Cancel</button>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <div class="no-selection">
              {#if eventTypes.length === 0}
                <p>No event types yet. Run a scan to discover event types, or click <strong>+</strong> to create one manually.</p>
              {:else}
                <p>Select an event type on the left to view and edit its visual graph.</p>
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
    background: rgba(0, 0, 0, 0.75);
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
    max-width: 1000px;
    height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  }

  .editor-header {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    padding: 0.8rem 1rem;
    border-bottom: 1px solid #222;
    flex-shrink: 0;
    background: #151515;
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
    width: 240px;
    border-right: 1px solid #222;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    background: #131313;
  }
  .sidebar-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 0.8rem;
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
    padding: 0.5rem 0.8rem;
    border-bottom: 1px solid #1e1e1e;
    background: #1a1a1a;
  }
  .new-type-form input {
    flex: 1;
    min-width: 0;
    padding: 0.3rem 0.4rem;
    font-size: 0.65rem;
    background: #111;
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
    padding: 0.4rem 0;
  }
  .type-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: 100%;
    padding: 0.5rem 0.8rem;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    color: #bbb;
    font-family: inherit;
    font-size: 0.72rem;
    transition: background 0.12s;
  }
  .type-item:hover {
    background: rgba(255, 255, 255, 0.04);
  }
  .type-item.selected {
    background: rgba(59, 130, 246, 0.1);
    color: #e8e8e8;
    border-left: 3px solid #3b82f6;
    padding-left: calc(0.8rem - 3px);
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
    font-size: 0.6rem;
    color: #555;
    flex-shrink: 0;
  }
  .type-group-chip {
    font-size: 0.55rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    flex-shrink: 0;
    opacity: 0.8;
  }

  /* ── Canvas panel ─────────────────────────────────────────────────── */
  .commands-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
    position: relative;
    background: #0d0d0d;
  }
  .commands-head {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 1rem;
    border-bottom: 1px solid #1e1e1e;
    flex-shrink: 0;
    background: #111;
    z-index: 10;
  }
  .type-badge {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 0.15rem 0.5rem;
    border-radius: 5px;
    color: #fff;
    white-space: nowrap;
  }
  .cmd-count {
    font-size: 0.65rem;
    color: #666;
  }
  .spacer { flex: 1; }

  .canvas-wrapper {
    flex: 1;
    position: relative;
  }

  /* ── Group selector ───────────────────────────────────────────────── */
  .group-selector {
    display: flex;
    gap: 0.25rem;
    flex-shrink: 0;
  }
  .group-chip {
    padding: 0.2rem 0.5rem;
    font-size: 0.6rem;
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

  /* ── Floating panels (over canvas) ────────────────────────────────── */
  .floating-panel {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 320px;
    background: #161616;
    border: 1px solid #333;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
    z-index: 50;
    max-height: calc(100% - 40px);
  }
  .picker-panel {
    width: 360px;
  }
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.8rem;
    border-bottom: 1px solid #2a2a2a;
    background: #1a1a1a;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .panel-header h3 {
    margin: 0;
    font-size: 0.75rem;
    color: #eee;
  }
  
  .action-picker {
    padding: 0.8rem;
    overflow-y: auto;
  }
  .picker-group-label {
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
  .picker-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.4rem;
    margin-bottom: 1rem;
  }
  .picker-tile {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.15rem;
    padding: 0.5rem;
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 7px;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: all 0.13s;
  }
  .picker-tile:hover {
    background: #1e1e1e;
    border-color: #3b82f6;
  }
  .picker-tile.added {
    border-color: rgba(52, 211, 153, 0.35);
    background: rgba(52, 211, 153, 0.05);
  }
  .picker-tile-icon {
    font-size: 1.1rem;
    line-height: 1;
    margin-bottom: 0.2rem;
    color: #aaa;
  }
  .picker-tile.added .picker-tile-icon { color: #34d399; }
  .picker-tile-name {
    font-size: 0.68rem;
    font-weight: 600;
    color: #ccc;
    line-height: 1.3;
  }
  .picker-tile.added .picker-tile-name { color: #34d399; }
  .picker-tile-added {
    font-size: 0.55rem;
    color: #34d399;
    font-weight: 600;
    margin-top: 0.2rem;
  }
  .picker-custom-row {
    padding-top: 0.8rem;
    border-top: 1px dashed #333;
    display: flex;
    align-items: center;
  }
  .picker-hint {
    font-size: 0.6rem;
    color: #666;
  }

  .cmd-form {
    padding: 0.8rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .form-row {
    display: flex;
    gap: 0.4rem;
  }
  .icon-input { width: 50px; flex-shrink: 0; text-align: center; }
  .name-input { flex: 1; min-width: 0; }
  .cmd-form input, .plugin-select {
    padding: 0.4rem 0.5rem;
    font-size: 0.72rem;
    background: #111;
    border: 1px solid #333;
    border-radius: 4px;
    color: #e8e8e8;
    font-family: inherit;
    outline: none;
    width: 100%;
  }
  .cmd-form input:focus, .plugin-select:focus { border-color: #3b82f6; }
  .form-actions {
    display: flex;
    gap: 0.4rem;
    justify-content: flex-end;
    margin-top: 0.5rem;
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
  }
  .icon-btn:hover:not(:disabled) {
    color: #ccc;
    border-color: #555;
    background: rgba(255, 255, 255, 0.05);
  }

  .small-btn {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 5px;
    color: #ccc;
    cursor: pointer;
    font-size: 0.65rem;
    padding: 0.3rem 0.6rem;
    font-family: inherit;
    transition: all 0.12s;
    white-space: nowrap;
  }
  .small-btn:hover { background: #222; border-color: #444; }
  .small-btn.primary { background: #3b82f6; border-color: #3b82f6; color: #fff; }
  .small-btn.primary:hover { background: #2563eb; }

  .text-btn {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 0.65rem;
    text-decoration: underline;
    padding: 0;
  }
  .text-btn:hover { color: #999; }
  .text-btn.danger { color: #555; }
  .text-btn.danger:hover { color: #f87171; }

  .no-selection {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
  }
  .no-selection p {
    color: #555;
    font-size: 0.85rem;
    text-align: center;
  }
</style>
