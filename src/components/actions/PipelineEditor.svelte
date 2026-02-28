<script lang="ts">
    import { updateRule, getEventCategories } from "../../lib/rules.js";
    import { getAllEventTypes } from "../../lib/events.js";
    import { getAvailableActions } from "../../lib/plugins/execution-service.js";
    import { onMount, untrack } from "svelte";

    import {
        SvelteFlow,
        Background,
        Controls,
        SmoothStepEdge,
    } from "@xyflow/svelte";
    import FitViewOnChange from "../actions/nodes/FitViewOnChange.svelte";
    import "@xyflow/svelte/dist/style.css";
    import TriggerNode from "../actions/nodes/TriggerNode.svelte";
    import ActionNode from "../actions/nodes/ActionNode.svelte";
    import PolicyNode from "../actions/nodes/PolicyNode.svelte";

    const nodeTypes = {
        trigger: TriggerNode,
        action: ActionNode,
        policy: PolicyNode,
    };
    const edgeTypes = { smoothstep: SmoothStepEdge };

    interface RuleAction {
        id: string;
        pluginId: string;
        commandId: string;
        name: string;
        description: string;
        icon?: string;
    }
    interface RuleTrigger {
        type: "event_type" | "event_category";
        name: string;
    }
    interface PipelineRule {
        id: string;
        name: string;
        description: string;
        enabled: boolean;
        priority: number;
        triggers: RuleTrigger[];
        actions: RuleAction[];
        policy: string;
    }
    interface Props {
        open?: boolean;
        rule?: PipelineRule | null;
        onSave?: () => void;
    }
    interface ActionHandler {
        actionId: string;
        name: string;
        description: string;
        requiredScopes?: string[];
    }
    interface PluginGroup {
        pluginId: string;
        pluginName: string;
        actions: ActionHandler[];
    }
    interface EditingCmd extends RuleAction {
        pluginCommandKey: string;
    }

    let { open = $bindable(false), rule = $bindable(null), onSave }: Props = $props();

    let eventTypes = $state<string[]>([]);
    let eventCats = $state<{ name: string; label: string }[]>([]);
    let commands = $state<RuleAction[]>([]);
    let triggers = $state<RuleTrigger[]>([]);
    let policy = $state("auto");

    let editingCmd = $state<EditingCmd | null>(null);
    let showActionPicker = $state(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let nodes = $state.raw<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let edges = $state.raw<any[]>([]);

    const PLUGIN_ACTIONS: PluginGroup[] = (() => {
        const gmail = getAvailableActions("gmail") as ActionHandler[];
        return [{ pluginId: "gmail", pluginName: "Gmail", actions: gmail }];
    })();

    const ACTION_ICONS = {
        mark_read: "✓",
        mark_unread: "○",
        star: "★",
        unstar: "☆",
        trash: "🗑",
        delete: "✕",
        mark_spam: "⚠",
        archive: "↓",
        apply_label: "🏷",
        remove_label: "🏷",
        mark_important: "!",
        mark_not_important: "–",
    };

    onMount(async () => {
        eventTypes = await getAllEventTypes() as string[];
        eventCats = (await getEventCategories()) as { name: string; label: string }[];
    });

    $effect(() => {
        // Track open/rule changes, then initialize without causing cycles
        const isOpen = open;
        const currentRule = rule;
        untrack(() => {
            if (isOpen && currentRule) {
                commands = (currentRule.actions || []).map((c) => ({ ...c }));
                triggers = (currentRule.triggers || []).map((t) => ({ ...t }));
                policy = currentRule.policy || "auto";
                updateGraph();
            } else {
                nodes = [];
                edges = [];
                commands = [];
                triggers = [];
            }
        });
    });

    function getTriggers(): RuleTrigger[] {
        return triggers.length > 0
            ? triggers
            : [{ type: "event_type" as const, name: "" }];
    }

    function formatTriggerLabel(t: RuleTrigger): string {
        if (!t.name) return "(any)";
        if (t.type === "event_category") {
            return eventCats.find((c) => c.name === t.name)?.label || t.name;
        }
        return t.name
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase());
    }

    function updateGraph() {
        if (!rule) return;
        const newNodes: any[] = [];
        const newEdges: any[] = [];
        const ROW_H = 64;
        const currentTriggers = getTriggers();
        const rows = Math.max(currentTriggers.length, commands.length + 1, 1);
        const midY = ((rows - 1) * ROW_H) / 2;

        // Triggers (Column 0)
        currentTriggers.forEach((t, i) => {
            newNodes.push({
                id: `t${i}`,
                type: "trigger",
                position: { x: 50, y: 100 + i * ROW_H },
                data: {
                    triggerType: t.type,
                    label: formatTriggerLabel(t),
                    isEditable: true,
                    triggerData: t,
                    eventTypes,
                    eventCats,
                    onChange: (newT: RuleTrigger) => {
                        triggers[i] = newT;
                        updateGraph();
                    },
                    onDelete: () => {
                        triggers = triggers.filter((_, idx) => idx !== i);
                        updateGraph();
                    },
                },
            });
        });

        // Add Trigger Button
        newNodes.push({
            id: `add-trigger`,
            type: "trigger", // Reusing trigger style but modified
            position: { x: 50, y: 100 + currentTriggers.length * ROW_H },
            data: {
                triggerType: "add",
                label: "+ Add Trigger condition",
                onClick: () => {
                    triggers = [...triggers, { type: "event_type" as const, name: "" }];
                    updateGraph();
                },
            },
        });

        let prevGroup = currentTriggers.map((_, i) => `t${i}`);
        let x = 320;

        // Actions (Column 1+)
        commands.forEach((cmd) => {
            newNodes.push({
                id: cmd.id,
                type: "action",
                position: { x, y: 100 },
                data: {
                    cmd,
                    onEdit: () => startEdit(cmd),
                    onDelete: () => handleRemoveCommand(cmd.id),
                },
            });

            prevGroup.forEach((src) => {
                newEdges.push({
                    id: `e-${src}-${cmd.id}`,
                    source: src,
                    target: cmd.id,
                    type: "smoothstep",
                    animated: policy === "auto",
                    style: "stroke: #666; stroke-width: 2",
                });
            });

            prevGroup = [cmd.id];
            x += 220;
        });

        // Add Action Button
        newNodes.push({
            id: "add-action",
            type: "action", // Reusing action style but modified
            position: { x, y: 100 },
            data: {
                cmd: { name: "+ Add Action", icon: "➕" },
                onClick: () => {
                    showActionPicker = true;
                    editingCmd = null;
                },
            },
        });

        prevGroup.forEach((src) => {
            newEdges.push({
                id: `e-${src}-add-action`,
                source: src,
                target: "add-action",
                type: "smoothstep",
                style: "stroke: #444; stroke-width: 2; stroke-dasharray: 4",
            });
        });

        x += 220;

        // Policy Node (Final Column)
        newNodes.push({
            id: "policy",
            type: "policy",
            position: { x, y: 100 + midY },
            data: {
                label: policy,
                isEditable: true,
                onChange: (p: string) => {
                    policy = p;
                    updateGraph();
                },
            },
        });

        // Connect last action to Policy
        newEdges.push({
            id: `e-add-action-policy`,
            source: "add-action",
            target: "policy",
            type: "smoothstep",
            animated: policy === "auto",
            style: "stroke: #666; stroke-width: 2",
        });

        nodes = newNodes;
        edges = newEdges;
    }

    const ACTION_ICONS_MAP = ACTION_ICONS as Record<string, string>;

    function handleAddPluginAction(handler: ActionHandler, pluginId: string) {
        commands = [
            ...commands,
            {
                id: handler.actionId + "_" + Date.now(),
                pluginId,
                commandId: handler.actionId,
                name: handler.name,
                description: handler.description,
                icon: ACTION_ICONS_MAP[handler.actionId],
            },
        ];
        showActionPicker = false;
        updateGraph();
    }

    function isInPipeline(actionId: string): boolean {
        return commands.some((c) => c.commandId === actionId);
    }

    function handleRemoveCommand(cmdId: string) {
        commands = commands.filter((c) => c.id !== cmdId);
        updateGraph();
    }

    function startEdit(cmd: RuleAction) {
        showActionPicker = false;
        editingCmd = {
            ...cmd,
            pluginCommandKey:
                cmd.pluginId && cmd.commandId
                    ? `${cmd.pluginId}:${cmd.commandId}`
                    : "",
        };
    }

    function saveEdit() {
        if (!editingCmd) return;
        const idx = commands.findIndex((c) => c.id === editingCmd!.id);
        if (idx !== -1) {
            commands[idx] = {
                ...commands[idx],
                name: editingCmd.name,
                description: editingCmd.description,
                icon: editingCmd.icon,
                pluginId: editingCmd.pluginId,
                commandId: editingCmd.commandId,
            };
        }
        editingCmd = null;
        updateGraph();
    }

    function cancelEdit() {
        editingCmd = null;
    }

    function handleCreateCustomAction() {
        const newId = `custom_${Date.now()}`;
        commands = [
            ...commands,
            {
                id: newId,
                pluginId: "",
                commandId: "",
                name: "New Custom Action",
                description: "",
                icon: "⚡",
            },
        ];
        showActionPicker = false;
        updateGraph();
        const cmd = commands.find((c) => c.id === newId);
        if (cmd) startEdit(cmd);
    }

    async function savePipeline() {
        try {
            if (rule) {
                rule.actions = commands;
                rule.triggers = triggers.filter((t) => t.name !== "");
                rule.policy = policy;

                await updateRule(rule.id, {
                    actions: rule.actions,
                    triggers: rule.triggers,
                    policy: rule.policy,
                    name: rule.name,
                    description: rule.description,
                    priority: rule.priority,
                });
                onSave?.();
            }
        } catch (e) {
            console.error("[PipelineEditor] save failed:", e);
        } finally {
            open = false;
        }
    }
</script>

{#if open}
    <div class="editor-overlay" role="dialog">
        <div class="editor-panel">
            <!-- Header -->
            <div class="editor-header">
                <div
                    class="header-left border-r border-border pr-4 mr-4 shrink-0"
                >
                    <h2>Unified Pipeline Editor</h2>
                    <span class="subtitle font-mono text-muted-foreground"
                        >{rule?.id?.slice(0, 8)}</span
                    >
                </div>

                <div class="header-center flex gap-4 flex-1 items-center">
                    {#if rule}
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-bold text-muted-foreground" for="pe-name">NAME</label>
                        <input
                            id="pe-name"
                            type="text"
                            bind:value={rule.name}
                            class="bg-black/20 border border-border px-2 py-1 rounded text-sm min-w-[200px]"
                        />
                    </div>
                    <div class="flex items-center gap-2 flex-1">
                        <label class="text-xs font-bold text-muted-foreground" for="pe-desc">DESC</label>
                        <input
                            id="pe-desc"
                            type="text"
                            bind:value={rule.description}
                            class="bg-black/20 border border-border px-2 py-1 rounded text-sm w-full"
                        />
                    </div>
                    {/if}
                </div>

                <div class="header-right shrink-0 flex items-center gap-3">
                    <button class="small-btn primary" onclick={savePipeline}
                        >Save Pipeline</button
                    >
                    <button class="close-btn" onclick={() => (open = false)}
                        >&#10005;</button
                    >
                </div>
            </div>

            <!-- Body / Canvas -->
            <div class="editor-body">
                {#if rule}
                    <SvelteFlow
                        {nodes}
                        {edges}
                        {nodeTypes}
                        {edgeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.15 }}
                        minZoom={0.15}
                        maxZoom={1.5}
                        colorMode="dark"
                        style="position: absolute; inset: 0; background: #0a0a0a;"
                    >
                        <Background bgColor="#0a0a0a" patternColor="#222" />
                        <Controls />
                        <FitViewOnChange {nodes} />
                    </SvelteFlow>

                    <!-- Floating Action Picker -->
                    {#if showActionPicker}
                        <div class="floating-panel picker-panel">
                            <div class="panel-header">
                                <h3>Select Action</h3>
                                <button
                                    class="close-btn"
                                    onclick={() => (showActionPicker = false)}
                                    >&#10005;</button
                                >
                            </div>
                            <div class="action-picker">
                                {#each PLUGIN_ACTIONS as group}
                                    <div class="picker-group">
                                        <div class="picker-group-label">
                                            <span class="picker-plugin-badge"
                                                >{group.pluginName}</span
                                            >
                                        </div>
                                        <div class="picker-grid">
                                            {#each group.actions as handler}
                                                {@const added = isInPipeline(
                                                    handler.actionId,
                                                )}
                                                <button
                                                    class="picker-tile"
                                                    class:added
                                                    onclick={() =>
                                                        handleAddPluginAction(
                                                            handler,
                                                            group.pluginId,
                                                        )}
                                                    title={handler.description}
                                                >
                                                    <span
                                                        class="picker-tile-icon"
                                                        >{ACTION_ICONS_MAP[
                                                            handler.actionId
                                                        ] ?? "·"}</span
                                                    >
                                                    <span
                                                        class="picker-tile-name"
                                                        >{handler.name}</span
                                                    >
                                                    {#if added}
                                                        <span
                                                            class="picker-tile-added"
                                                            >✓ added</span
                                                        >
                                                    {/if}
                                                </button>
                                            {/each}
                                        </div>
                                    </div>
                                {/each}
                                <div class="picker-custom-row">
                                    <button
                                        class="small-btn primary"
                                        onclick={handleCreateCustomAction}
                                        >+ Create Custom Action</button
                                    >
                                </div>
                            </div>
                        </div>
                    {/if}

                    <!-- Floating Action Editor -->
                    {#if editingCmd}
                        <div class="floating-panel editor-panel-inner">
                            <div class="panel-header">
                                <h3>Edit Action Config</h3>
                                <button class="close-btn" onclick={cancelEdit}
                                    >&#10005;</button
                                >
                            </div>
                            <div class="cmd-form">
                                <div class="form-row">
                                    <input
                                        type="text"
                                        bind:value={editingCmd.icon}
                                        class="icon-input"
                                        placeholder="Icon"
                                    />
                                    <input
                                        type="text"
                                        bind:value={editingCmd.name}
                                        class="name-input"
                                        placeholder="Name"
                                    />
                                </div>
                                <input
                                    type="text"
                                    bind:value={editingCmd.description}
                                    class="desc-input"
                                    placeholder="Description"
                                />

                                <div class="form-row">
                                    <select
                                        class="plugin-select"
                                        bind:value={editingCmd.pluginCommandKey}
                                        onchange={(e) => {
                                            const val = (e.target as HTMLSelectElement).value;
                                            if (editingCmd && val) {
                                                const [pId, cId] = val.split(":");
                                                editingCmd.pluginId = pId;
                                                editingCmd.commandId = cId;
                                            } else if (editingCmd) {
                                                editingCmd.pluginId = "";
                                                editingCmd.commandId = "";
                                            }
                                        }}
                                    >
                                        <option value=""
                                            >-- Select Plugin Command --</option
                                        >
                                        {#each PLUGIN_ACTIONS as group}
                                            <optgroup label={group.pluginName}>
                                                {#each group.actions as handler}
                                                    <option
                                                        value="{group.pluginId}:{handler.actionId}"
                                                    >
                                                        {handler.name} ({handler.actionId})
                                                    </option>
                                                {/each}
                                            </optgroup>
                                        {/each}
                                    </select>
                                </div>

                                <div class="form-actions">
                                    <button
                                        class="small-btn primary items-center justify-center flex-1"
                                        onclick={saveEdit}>Save Action</button
                                    >
                                    <button
                                        class="small-btn flex-1 items-center justify-center"
                                        onclick={cancelEdit}>Cancel</button
                                    >
                                </div>
                            </div>
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .editor-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }
    .editor-panel {
        background: #0a0a0a;
        border: 1px solid #2a2a2a;
        border-radius: 12px;
        width: 100%;
        max-width: 1400px;
        height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    }

    .editor-header {
        display: flex;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #222;
        background: #111;
    }
    .editor-header h2 {
        font-size: 1rem;
        font-weight: 700;
        color: #fff;
        margin: 0;
    }

    .close-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #999;
        font-size: 1rem;
        cursor: pointer;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transition: all 0.2s;
    }
    .close-btn:hover {
        color: #fff;
        background: rgba(255, 100, 100, 0.2);
        border-color: rgba(255, 100, 100, 0.5);
    }

    .small-btn {
        font-size: 0.7rem;
        font-weight: 600;
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        border: 1px solid #333;
        background: #222;
        color: #ccc;
        cursor: pointer;
        transition: all 0.2s;
    }
    .small-btn.primary {
        background: #3b82f6;
        color: #fff;
        border-color: #2563eb;
    }
    .small-btn:hover {
        background: #333;
    }
    .small-btn.primary:hover {
        background: #2563eb;
    }

    .editor-body {
        position: relative;
        flex: 1;
        min-height: 0;
        overflow: hidden;
    }

    .floating-panel {
        position: absolute;
        bottom: 24px;
        right: 24px;
        background: #151515;
        border: 1px solid #333;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        z-index: 10;
    }
    .picker-panel {
        width: 380px;
        max-height: 70vh;
    }
    .editor-panel-inner {
        width: 340px;
    }

    .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.6rem 1rem;
        border-bottom: 1px solid #2a2a2a;
        background: #1a1a1a;
        border-radius: 8px 8px 0 0;
    }
    .panel-header h3 {
        margin: 0;
        font-size: 0.8rem;
        color: #fff;
    }

    .action-picker {
        padding: 1rem;
        overflow-y: auto;
    }
    .picker-group-label {
        margin-bottom: 0.5rem;
    }
    .picker-plugin-badge {
        font-size: 0.6rem;
        font-weight: 700;
        color: #3b82f6;
        background: rgba(59, 130, 246, 0.15);
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
    }
    .picker-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    .picker-tile {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        padding: 0.6rem;
        background: #111;
        border: 1px solid #2a2a2a;
        border-radius: 6px;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s;
    }
    .picker-tile:hover {
        background: #1a1a1a;
        border-color: #3b82f6;
    }
    .picker-tile.added {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.05);
    }
    .picker-tile-icon {
        font-size: 1.2rem;
        color: #888;
    }
    .picker-tile.added .picker-tile-icon {
        color: #10b981;
    }
    .picker-tile-name {
        font-size: 0.7rem;
        font-weight: 600;
        color: #ccc;
    }
    .picker-tile.added .picker-tile-name {
        color: #10b981;
    }
    .picker-tile-added {
        font-size: 0.6rem;
        color: #10b981;
        font-weight: 700;
        text-transform: uppercase;
    }

    .cmd-form {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
    .form-row {
        display: flex;
        gap: 0.5rem;
    }
    .icon-input {
        width: 3rem;
        text-align: center;
        font-size: 1.1rem;
    }
    .name-input {
        flex: 1;
    }
    .cmd-form input,
    .cmd-form select {
        background: #0a0a0a;
        border: 1px solid #333;
        padding: 0.5rem;
        border-radius: 5px;
        color: #fff;
        font-size: 0.75rem;
    }
    .cmd-form input:focus,
    .cmd-form select:focus {
        border-color: #3b82f6;
    }
    .plugin-select {
        width: 100%;
    }
</style>
