<script lang="ts">
    import { updateRule } from "../../lib/rules.js";
    import { getAllEventTypes } from "../../lib/events.js";
    import { getAvailableActions } from "../../lib/plugins/execution-service.js";
    import { onMount, untrack } from "svelte";

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
        _eventTypes?: { name: string; label: string; autoCreated: boolean }[];
    }
    interface Props {
        open?: boolean;
        rule?: PipelineRule | null;
        onSave?: (
            actions?: any[],
            typesToMove?: string[],
        ) => void | Promise<void>;
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

    let {
        open = $bindable(false),
        rule = $bindable(null),
        onSave,
        customSave = false, // Add this here
    }: Props & { customSave?: boolean } = $props();

    let eventTypes = $state<string[]>([]);
    let commands = $state<RuleAction[]>([]);
    let triggers = $state<RuleTrigger[]>([]);
    let typesToMove = $state<string[]>([]);

    let editingCmd = $state<EditingCmd | null>(null);
    let showActionPicker = $state(false);

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
        eventTypes = (await getAllEventTypes()) as string[];
    });

    $effect(() => {
        // Track open/rule changes, then initialize without causing cycles
        const isOpen = open;
        const currentRule = rule;
        untrack(() => {
            if (isOpen && currentRule) {
                commands = (currentRule.actions || []).map((c) => ({ ...c }));
                triggers = (currentRule.triggers || []).map((t) => ({ ...t }));
                typesToMove = [];
            } else {
                commands = [];
                triggers = [];
                typesToMove = [];
            }
        });
    });

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
    }

    function isInPipeline(actionId: string): boolean {
        return commands.some((c) => c.commandId === actionId);
    }

    function handleRemoveCommand(cmdId: string) {
        commands = commands.filter((c) => c.id !== cmdId);
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
    }

    function cancelEdit() {
        editingCmd = null;
    }

    // ... (rest omitted to not override variables, wait, I can just replace `savePipeline()`)

    async function savePipeline() {
        try {
            if (rule) {
                rule.actions = commands;
                rule.triggers = triggers.filter((t) => t.name !== "");

                if (customSave) {
                    onSave?.(rule.actions, typesToMove);
                } else {
                    await updateRule(rule.id, {
                        actions: rule.actions,
                        triggers: rule.triggers,
                        name: rule.name,
                        description: rule.description,
                        priority: rule.priority,
                    });
                    onSave?.();
                }
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
                            <label
                                class="text-xs font-bold text-muted-foreground"
                                for="pe-name">NAME</label
                            >
                            <input
                                id="pe-name"
                                type="text"
                                bind:value={rule.name}
                                class="bg-black/20 border border-border px-2 py-1 rounded text-sm min-w-[200px]"
                            />
                        </div>
                        <div class="flex items-center gap-2 flex-1">
                            <label
                                class="text-xs font-bold text-muted-foreground"
                                for="pe-desc">DESC</label
                            >
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
            <div class="editor-body p-8 flex flex-col items-center bg-black">
                {#if rule && rule.triggers}
                    <div
                        class="flex items-stretch justify-center max-w-5xl w-full gap-5 mx-auto mt-8"
                    >
                        <!-- TRIGGER CONTAINER -->
                        <div
                            class="w-[340px] shrink-0 flex flex-col items-center z-10"
                        >
                            <div
                                class="w-full border border-border bg-card rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden"
                            >
                                <div
                                    class="px-5 py-4 border-b border-border/50 flex items-center gap-4 bg-secondary/20"
                                >
                                    <div
                                        class="size-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="size-5"
                                            ><polygon
                                                points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                                            /></svg
                                        >
                                    </div>
                                    <div class="flex flex-col">
                                        <span
                                            class="text-[10px] font-bold uppercase tracking-widest text-blue-500/80 mb-0.5"
                                            >Trigger</span
                                        >
                                        <span class="text-base font-semibold"
                                            >Detect AI Event Type</span
                                        >
                                    </div>
                                </div>
                                <div
                                    class="p-5 bg-background border-t border-border/50"
                                >
                                    <div class="mb-3">
                                        {#if triggers.length > 0 && triggers[0].type === "event_category"}
                                            <p
                                                class="text-xs text-muted-foreground leading-relaxed mb-4"
                                            >
                                                Event types assigned to this
                                                category will trigger this
                                                pipeline.
                                            </p>

                                            <div
                                                class="flex flex-wrap gap-1.5 mb-4"
                                            >
                                                {#each rule?._eventTypes || [] as et}
                                                    <div
                                                        class="px-2 py-1 bg-secondary/80 border border-border rounded text-xs text-muted-foreground flex items-center gap-1.5 font-medium transition-colors hover:bg-secondary"
                                                    >
                                                        {et.name}
                                                    </div>
                                                {/each}
                                                {#each typesToMove as et}
                                                    <div
                                                        class="px-2 py-1 bg-primary/20 border border-primary/40 text-primary-foreground rounded text-xs flex items-center gap-1.5 font-medium transition-colors"
                                                    >
                                                        {et}
                                                        <button
                                                            class="text-primary-foreground/50 hover:text-primary-foreground transition-colors ml-0.5"
                                                            onclick={() =>
                                                                (typesToMove =
                                                                    typesToMove.filter(
                                                                        (t) =>
                                                                            t !==
                                                                            et,
                                                                    ))}
                                                            aria-label="Remove pending event type"
                                                            >✕</button
                                                        >
                                                    </div>
                                                {/each}
                                            </div>

                                            <select
                                                value=""
                                                onchange={(e) => {
                                                    const val = (
                                                        e.currentTarget as HTMLSelectElement
                                                    ).value;
                                                    if (val)
                                                        typesToMove = [
                                                            ...typesToMove,
                                                            val,
                                                        ];
                                                    requestAnimationFrame(
                                                        () => {
                                                            (
                                                                e.target as HTMLSelectElement
                                                            ).value = "";
                                                        },
                                                    );
                                                }}
                                                class="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors"
                                            >
                                                <option
                                                    value=""
                                                    disabled
                                                    selected
                                                    >+ Add Event Type...</option
                                                >
                                                {#each eventTypes.filter((et) => !(rule?._eventTypes || []).find((t) => t.name === et) && !typesToMove.includes(et)) as et}
                                                    <option value={et}
                                                        >{et
                                                            .toLowerCase()
                                                            .replace(/_/g, " ")
                                                            .replace(
                                                                /\b([a-z])/g,
                                                                (c) =>
                                                                    c.toUpperCase(),
                                                            )}</option
                                                    >
                                                {/each}
                                            </select>
                                        {:else if triggers.length > 0}
                                            <p
                                                class="text-xs text-muted-foreground leading-relaxed mb-3"
                                            >
                                                Trigger this pipeline when the
                                                AI engine identifies the email's
                                                core purpose as this Event Type:
                                            </p>
                                            <select
                                                bind:value={triggers[0].name}
                                                class="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors"
                                            >
                                                <option value="" disabled
                                                    >Select Event Type...</option
                                                >
                                                {#each eventTypes as et}
                                                    <option value={et}
                                                        >{et
                                                            .toLowerCase()
                                                            .replace(/_/g, " ")
                                                            .replace(
                                                                /\b([a-z])/g,
                                                                (c) =>
                                                                    c.toUpperCase(),
                                                            )}</option
                                                    >
                                                {/each}
                                            </select>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CONNECTOR -->
                        <div
                            class="flex flex-col items-center w-12 pt-[64px] shrink-0"
                        >
                            <div
                                class="w-full h-px bg-border flex items-center justify-center"
                            >
                                <div
                                    class="size-4 rounded-full border border-border bg-card flex items-center justify-center"
                                >
                                    <div
                                        class="size-1.5 rounded-full bg-muted-foreground/30"
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <!-- ACTIONS SEQUENCE CONTAINER -->
                        <div
                            class="w-[420px] shrink-0 border border-border bg-card rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden z-10 flex flex-col"
                        >
                            <div
                                class="px-5 py-4 border-b border-border/50 flex items-center gap-4 bg-secondary/20 shrink-0"
                            >
                                <div
                                    class="size-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="size-5 fill-emerald-500/20"
                                        ><polygon
                                            points="6 3 20 12 6 21 6 3"
                                        /></svg
                                    >
                                </div>
                                <div class="flex flex-col">
                                    <span
                                        class="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 mb-0.5"
                                        >Actions</span
                                    >
                                    <span class="text-base font-semibold"
                                        >Execute in order</span
                                    >
                                </div>
                            </div>
                            <div
                                class="p-5 bg-background flex-1 flex flex-col gap-3 min-h-[300px]"
                            >
                                {#each commands as cmd, i}
                                    <div
                                        class="group relative bg-secondary/30 border border-border/50 hover:border-border hover:bg-secondary/50 rounded-xl p-3 flex items-center gap-4 transition-all"
                                    >
                                        <div
                                            class="size-7 rounded border border-border/50 bg-background/50 flex justify-center items-center text-xs font-mono text-muted-foreground shrink-0"
                                        >
                                            {i + 1}
                                        </div>
                                        <div
                                            class="size-8 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-sm shrink-0 text-lg"
                                        >
                                            {cmd.icon || "⚙️"}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div
                                                class="font-medium text-sm truncate"
                                            >
                                                {cmd.name}
                                            </div>
                                            {#if cmd.description}
                                                <div
                                                    class="text-xs text-muted-foreground truncate"
                                                >
                                                    {cmd.description}
                                                </div>
                                            {/if}
                                        </div>
                                        <div
                                            class="action-controls opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 pr-2"
                                        >
                                            <button
                                                class="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-background transition-colors"
                                                onclick={() => startEdit(cmd)}
                                                title="Edit"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    class="size-4"
                                                    ><path
                                                        d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
                                                    /></svg
                                                >
                                            </button>
                                            <button
                                                class="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                                                onclick={() =>
                                                    handleRemoveCommand(cmd.id)}
                                                title="Remove"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    class="size-4"
                                                    ><path d="M3 6h18" /><path
                                                        d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
                                                    /><path
                                                        d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
                                                    /><line
                                                        x1="10"
                                                        x2="10"
                                                        y1="11"
                                                        y2="17"
                                                    /><line
                                                        x1="14"
                                                        x2="14"
                                                        y1="11"
                                                        y2="17"
                                                    /></svg
                                                >
                                            </button>
                                        </div>
                                    </div>
                                {/each}
                                <button
                                    class="w-full mt-2 py-4 rounded-xl border-2 border-dashed border-border/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-sm text-muted-foreground font-medium transition-colors flex items-center justify-center gap-2"
                                    onclick={() => {
                                        showActionPicker = true;
                                        editingCmd = null;
                                    }}
                                >
                                    <span class="text-xl leading-none mb-0.5"
                                        >+</span
                                    > Add Action
                                </button>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>

            <!-- ACTION PICKER SLIDE PANEL -->
            {#if showActionPicker}
                <div
                    class="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm"
                    onclick={() => (showActionPicker = false)}
                    aria-hidden="true"
                ></div>
                <div
                    class="fixed right-0 top-0 bottom-0 w-[400px] bg-card border-l border-border/60 z-50 flex flex-col shadow-2xl transition-transform"
                >
                    <div
                        class="flex items-center justify-between px-6 py-4 border-b border-border/50"
                    >
                        <h3 class="text-base font-semibold text-foreground">
                            Select Action
                        </h3>
                        <button
                            class="close-btn-small"
                            onclick={() => (showActionPicker = false)}
                            >&#10005;</button
                        >
                    </div>
                    <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                        {#each PLUGIN_ACTIONS as group}
                            <div class="flex flex-col gap-3">
                                <div>
                                    <span
                                        class="text-xs font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md"
                                        >{group.pluginName}</span
                                    >
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    {#each group.actions as handler}
                                        {@const added = isInPipeline(
                                            handler.actionId,
                                        )}
                                        <button
                                            class="flex flex-col gap-2 p-3 bg-[#111] border border-border rounded-xl hover:bg-secondary hover:border-blue-500/50 transition-all text-left group"
                                            class:border-emerald-500={added}
                                            class:bg-emerald-500_10={added}
                                            onclick={() =>
                                                handleAddPluginAction(
                                                    handler,
                                                    group.pluginId,
                                                )}
                                            title={handler.description}
                                        >
                                            <span
                                                class="text-2xl text-muted-foreground group-hover:text-foreground transition-colors"
                                                >{ACTION_ICONS_MAP[
                                                    handler.actionId
                                                ] ?? "·"}</span
                                            >
                                            <span
                                                class="text-xs font-semibold text-foreground/80"
                                                >{handler.name}</span
                                            >
                                            {#if added}<span
                                                    class="text-[10px] uppercase font-bold text-emerald-500 mt-auto"
                                                    >✓ Added</span
                                                >{/if}
                                        </button>
                                    {/each}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- EDIT COMMAND SLIDE PANEL -->
            {#if editingCmd}
                <div
                    class="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm"
                    onclick={cancelEdit}
                    aria-hidden="true"
                ></div>
                <div
                    class="fixed right-0 top-0 bottom-0 w-[400px] bg-card border-l border-border/60 z-50 flex flex-col shadow-2xl transition-transform"
                >
                    <div
                        class="flex items-center justify-between px-6 py-4 border-b border-border/50"
                    >
                        <h3
                            class="text-base font-semibold flex items-center gap-2"
                        >
                            <span class="text-xl"
                                >{editingCmd.icon || "⚙️"}</span
                            >
                            {editingCmd.name || "Edit Action"}
                        </h3>
                        <button class="close-btn-small" onclick={cancelEdit}
                            >&#10005;</button
                        >
                    </div>
                    <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                        <div class="flex flex-col gap-4">
                            <div class="flex gap-4">
                                <div class="flex flex-col gap-2 w-16 shrink-0">
                                    <label
                                        for="edit-icon"
                                        class="text-xs font-bold text-muted-foreground/80 uppercase"
                                        >Icon</label
                                    >
                                    <input
                                        id="edit-icon"
                                        type="text"
                                        bind:value={editingCmd.icon}
                                        class="bg-secondary/50 border border-border px-3 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:bg-secondary outline-none transition-all text-center"
                                    />
                                </div>
                                <div class="flex flex-col gap-2 flex-1">
                                    <label
                                        for="edit-name"
                                        class="text-xs font-bold text-muted-foreground/80 uppercase"
                                        >Name</label
                                    >
                                    <input
                                        id="edit-name"
                                        type="text"
                                        bind:value={editingCmd.name}
                                        class="bg-secondary/50 border border-border px-3 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:bg-secondary outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                                <label
                                    for="edit-desc"
                                    class="text-xs font-bold text-muted-foreground/80 uppercase"
                                    >Description</label
                                >
                                <input
                                    id="edit-desc"
                                    type="text"
                                    bind:value={editingCmd.description}
                                    class="bg-secondary/50 border border-border px-3 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:bg-secondary outline-none transition-all"
                                />
                            </div>
                            <div
                                class="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50"
                            >
                                <label
                                    for="edit-handler"
                                    class="text-xs font-bold text-muted-foreground/80 uppercase"
                                    >Plugin Handler</label
                                >
                                <select
                                    id="edit-handler"
                                    bind:value={editingCmd.pluginCommandKey}
                                    class="bg-secondary/50 border border-border px-3 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:bg-secondary outline-none transition-all cursor-pointer"
                                >
                                    <option value="" disabled
                                        >Select handler function...</option
                                    >
                                    {#each PLUGIN_ACTIONS as group}
                                        <optgroup label={group.pluginName}>
                                            {#each group.actions as handler}
                                                <option
                                                    value="{group.pluginId}:{handler.actionId}"
                                                    >{handler.name}</option
                                                >
                                            {/each}
                                        </optgroup>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div
                        class="p-5 border-t border-border/50 flex gap-3 bg-card/50"
                    >
                        <button
                            class="flex-1 bg-secondary text-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-secondary/80 transition-colors border border-border"
                            onclick={cancelEdit}>Cancel</button
                        >
                        <button
                            class="flex-1 bg-blue-600/90 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-600 transition-colors"
                            onclick={saveEdit}>Save Config</button
                        >
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .editor-overlay {
        position: fixed;
        inset: 0;
        background: #000;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }
    .editor-panel {
        background: #0a0a0a;
        border: none;
        border-radius: 0;
        width: 100vw;
        max-width: none;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
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

    .close-btn-small {
        background: transparent;
        border: none;
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
    .close-btn-small:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.05);
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
</style>
