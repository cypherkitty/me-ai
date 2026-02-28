<script>
  import { onMount } from "svelte";
  import { getPlugins, setPluginEnabled } from "../lib/rules.js";
  import { Badge }      from "$lib/components/ui/badge/index.js";
  import { Switch }     from "$lib/components/ui/switch/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { cn }         from "$lib/utils.js";
  import { Info, Puzzle } from "lucide-svelte";

  let plugins = $state([]);
  let loading = $state(true);

  const PLUGIN_META = {
    gmail_plugin:     { color: "#ea4335", icon: "G", desc: "Gmail email management" },
    telegram_plugin:  { color: "#26a5e4", icon: "T", desc: "Telegram messaging" },
    instagram_plugin: { color: "#e1306c", icon: "I", desc: "Instagram interactions" },
    ai_summarizer:    { color: "#8b5cf6", icon: "∑", desc: "AI-powered content summarization" },
    notifier:         { color: "#f59e0b", icon: "N", desc: "User notifications and escalation" },
    ai_classifier:    { color: "#10b981", icon: "C", desc: "AI event classification (runs first on all events)" },
  };

  async function load() {
    loading = true;
    try { plugins = await getPlugins(); }
    catch (e) { console.error("PluginsView load error:", e); }
    loading = false;
  }

  onMount(load);

  async function togglePlugin(plugin) {
    if (plugin.name === "ai_classifier") return;
    await setPluginEnabled(plugin.name, !plugin.enabled);
    plugin.enabled = !plugin.enabled;
  }
</script>

<div class="flex flex-col h-full overflow-hidden">
  <div class="px-8 pt-5 pb-4 shrink-0 border-b border-border">
    <div class="flex items-center gap-2 mb-0.5">
      <h1 class="text-sm font-semibold tracking-tight text-foreground">Plugins</h1>
      <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ registry</span>
    </div>
    <p class="text-xs text-muted-foreground">{plugins.filter(p => p.enabled).length} active — plugins provide actions and handle sources.</p>
  </div>

  <ScrollArea class="flex-1 px-8 pb-6">
    {#if loading}
      <div class="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <div class="size-5 rounded-full border-2 border-border border-t-primary animate-spin"></div>
        <span class="text-xs">Loading plugins…</span>
      </div>
    {:else}
      <div class="flex flex-col gap-3">
        <div class="grid gap-2" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
          {#each plugins as plugin (plugin.name)}
            {@const meta = PLUGIN_META[plugin.name] ?? { color: "#6366f1", icon: "P", desc: "" }}
            <div class={cn(
              "flex flex-col gap-2.5 p-3.5 rounded border bg-card transition-colors",
              "border-border/50 hover:border-border",
              !plugin.enabled && "opacity-50"
            )}>
              <!-- Header row -->
              <div class="flex items-start gap-2.5">
                <div
                  class="size-8 rounded flex items-center justify-center text-sm font-black shrink-0"
                  style="background:{meta.color}15;color:{meta.color};"
                >
                  {meta.icon}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-baseline gap-1.5 mb-0.5">
                    <span class="text-sm font-semibold text-foreground">{plugin.label}</span>
                    <code class="text-[0.62rem] text-muted-foreground/50 font-mono">v{plugin.version}</code>
                  </div>
                  <span class="text-xs text-muted-foreground">{meta.desc}</span>
                </div>
                <div class="shrink-0">
                  {#if plugin.name === "ai_classifier"}
                    <Badge variant="default" class="text-xs">System</Badge>
                  {:else}
                    <Switch
                      checked={plugin.enabled}
                      onCheckedChange={() => togglePlugin(plugin)}
                      aria-label={plugin.enabled ? `Disable ${plugin.label}` : `Enable ${plugin.label}`}
                    />
                  {/if}
                </div>
              </div>

              <!-- Actions -->
              {#if plugin.actions?.length}
                <div class="flex flex-col gap-1 pt-2 border-t border-border/40">
                  <span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40">Actions</span>
                  <div class="flex flex-wrap gap-1">
                    {#each plugin.actions as a}
                      <Badge variant="secondary" class="text-xs px-1.5 h-4">{a.label}</Badge>
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- Sources -->
              {#if plugin.sources?.length}
                <div class="flex flex-col gap-1 pt-2 border-t border-border/40">
                  <span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40">Handles</span>
                  <div class="flex flex-wrap gap-1">
                    {#each plugin.sources as s}
                      <Badge variant="outline" class="text-xs px-1.5 h-4">{s.label}</Badge>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Info box -->
        <div class="flex items-start gap-2.5 px-3.5 py-3 rounded border border-border/40 bg-muted/20 text-muted-foreground mt-1">
          <Info class="size-3.5 shrink-0 mt-0.5 opacity-60" />
          <p class="text-xs leading-relaxed">
            Plugins provide Actions and handle Sources. Disabling a plugin makes all its actions
            unavailable at runtime — existing rules that reference those actions will be skipped.
            The <strong class="text-muted-foreground/80">AI Classifier</strong> plugin is always active; it runs before all rules
            and assigns EventType + EventCategory to every incoming event.
          </p>
        </div>
      </div>
    {/if}
  </ScrollArea>
</div>
