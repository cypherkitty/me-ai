<script>
  import { cn } from "$lib/utils.js";

  let { backend = $bindable("webgpu"), isWebGPUAvailable = true } = $props();

  const options = [
    {
      id: "webgpu",
      icon: "🔷",
      label: "WebGPU",
      desc: "Browser, private, no server",
      disabled: !isWebGPUAvailable,
    },
    {
      id: "ollama",
      icon: "🦙",
      label: "Ollama",
      desc: "Local server, larger models",
    },
    {
      id: "cloud",
      icon: "☁️",
      label: "Cloud APIs",
      desc: "ChatGPT, Claude, Gemini, Grok",
    },
  ];
</script>

<div class="w-full mb-4">
  <p
    class="text-[0.68rem] font-bold uppercase tracking-widest text-foreground/50 text-left mb-3"
  >
    AI Backend
  </p>

  <div class="flex flex-col gap-3">
    <!-- First row: first two options side by side -->
    <div class="grid grid-cols-2 gap-3">
      {#each options.slice(0, 2) as opt}
        {@render optionBtn(opt)}
      {/each}
    </div>
    <!-- Remaining options: each full width -->
    {#each options.slice(2) as opt}
      {@render optionBtn(opt)}
    {/each}
  </div>

  {#snippet optionBtn(opt)}
    <button
      onclick={() => (backend = opt.id)}
      disabled={opt.disabled}
      class={cn(
        "flex items-center gap-3 p-3.5 text-left rounded border transition-all w-full",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        backend === opt.id
          ? "bg-primary/8 border-primary/40"
          : "bg-card border-border hover:bg-accent hover:border-primary/25",
      )}
    >
      <span class="text-2xl leading-none shrink-0">{opt.icon}</span>
      <div class="flex-1 min-w-0">
        <div
          class={cn(
            "text-sm font-semibold tracking-tight mb-0.5",
            backend === opt.id ? "text-primary" : "text-foreground",
          )}
        >
          {opt.label}
        </div>
        <div class="text-xs text-muted-foreground">{opt.desc}</div>
      </div>
    </button>
  {/snippet}

  {#if !isWebGPUAvailable && backend === "webgpu"}
    <p
      class="mt-2.5 px-3 py-2 text-xs text-warning bg-warning/8 border border-warning/20 rounded text-center"
    >
      WebGPU not available in this browser. Use Ollama or upgrade your browser.
    </p>
  {/if}
</div>
