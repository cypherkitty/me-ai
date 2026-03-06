<script>
    import { cn } from "$lib/utils.js";
    import { CircleCheck, TriangleAlert } from "lucide-svelte";

    /**
     * @typedef {Object} Step
     * @property {boolean} [success]
     * @property {string} [status] - "running", "done", "error", "pending" (used in chat)
     * @property {string} [actionName]
     * @property {string} [commandId]
     * @property {string} [label] - alternative to actionName/commandId
     * @property {string} [message]
     * @property {string} [error]
     */

    /** @type {{ steps: Step[], class?: string }} */
    let { steps = [], class: className } = $props();
</script>

{#if steps?.length}
    <div
        class={cn(
            "rounded bg-trace-bg border border-border px-4 py-3",
            className,
        )}
    >
        <p
            class="text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground mb-3"
        >
            Execution Trace
        </p>
        <div class="flex flex-col relative">
            {#each steps as step, i}
                {@const isSuccess =
                    step.success === true || step.status === "done"}
                {@const isError =
                    step.success === false || step.status === "error"}
                {@const isRunning = step.status === "running"}
                {@const isPending =
                    step.status === "pending" ||
                    (!isSuccess && !isError && !isRunning)}
                {@const name = step.actionName || step.commandId || step.label}
                {@const msg =
                    step.message ||
                    step.error ||
                    (step.status === "error" ? "Execution failed" : "")}

                <div
                    class="flex items-center gap-3 mt-1 mb-4 relative last:mb-0"
                >
                    {#if i < steps.length - 1}
                        <div
                            class="absolute left-[13px] top-7 w-px h-7 bg-border"
                        ></div>
                    {/if}

                    <div
                        class={cn(
                            "size-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors",
                            isSuccess && "bg-node-action",
                            isError && "bg-destructive",
                            isRunning &&
                                "bg-primary border-2 border-primary/30 animate-pulse",
                            isPending && "bg-muted border border-border",
                        )}
                    >
                        {#if isSuccess}
                            <CircleCheck class="size-3.5 text-white" />
                        {:else if isError}
                            <TriangleAlert class="size-3.5 text-white" />
                        {:else if isRunning}
                            <div
                                class="size-1.5 rounded-full bg-white animate-ping"
                            ></div>
                        {:else}
                            <div
                                class="size-1.5 rounded-full bg-muted-foreground/30"
                            ></div>
                        {/if}
                    </div>

                    <div class="flex flex-col min-w-0">
                        <span
                            class="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap"
                        >
                            <span
                                class={cn(
                                    "opacity-70",
                                    isRunning &&
                                        "text-primary font-medium opacity-100",
                                )}
                            >
                                {#if isSuccess}Executed
                                {:else if isError}Failed
                                {:else if isRunning}Running…
                                {:else}Pending
                                {/if}
                            </span>
                            {#if name}
                                <code
                                    class="text-foreground font-mono text-xs bg-accent px-1.5 py-0.5 rounded truncate max-w-[200px]"
                                    title={name}
                                >
                                    {name}
                                </code>
                            {/if}
                        </span>
                        {#if msg && !isPending}
                            <span
                                class={cn(
                                    "text-[0.65rem] mt-0.5 leading-snug",
                                    isError
                                        ? "text-destructive"
                                        : "text-muted-foreground/60",
                                )}
                            >
                                {msg}
                            </span>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}
