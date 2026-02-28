<script>
  import { cn } from "$lib/utils.js";

  let { backend = $bindable("webgpu"), isWebGPUAvailable = true } = $props();

  const options = [
    { id: "webgpu",  icon: "🔷", label: "WebGPU",     desc: "Browser, private, no server", disabled: !isWebGPUAvailable },
    { id: "ollama",  icon: "🦙", label: "Ollama",     desc: "Local server, larger models" },
    { id: "cloud",   icon: "☁️", label: "Cloud APIs", desc: "ChatGPT, Claude, Gemini, Grok" },
  ];
</script>

<div class="w-full max-w-[520px] mx-auto mb-6">
  <p class="text-[0.68rem] font-bold uppercase tracking-widest text-muted-foreground/40 text-center mb-3">
    AI Backend
  </p>

  <div class="grid grid-cols-2 gap-3">
    {#each options as opt}
      <button
        onclick={() => backend = opt.id}
        disabled={opt.disabled}
        class={cn(
          "flex items-center gap-3 p-3.5 text-left rounded border transition-all",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          backend === opt.id
            ? "bg-primary/8 border-primary/40"
            : "bg-card border-border hover:bg-accent hover:border-primary/25"
        )}
      >
        <span class="text-2xl leading-none shrink-0">{opt.icon}</span>
        <div class="flex-1 min-w-0">
          <div class={cn(
            "text-sm font-semibold tracking-tight mb-0.5",
            backend === opt.id ? "text-primary" : "text-foreground"
          )}>
            {opt.label}
          </div>
          <div class="text-xs text-muted-foreground">{opt.desc}</div>
        </div>
      </button>
    {/each}
  </div>

  {#if !isWebGPUAvailable && backend === "webgpu"}
    <p class="mt-2.5 px-3 py-2 text-xs text-warning bg-warning/8 border border-warning/20 rounded text-center">
      WebGPU not available in this browser. Use Ollama or upgrade your browser.
    </p>
  {/if}
</div>
