<script lang="ts">
  import AuditView   from "./AuditView.svelte";
  import ModelsView  from "./ModelsView.svelte";
  import DataManager from "../components/actions/DataManager.svelte";
  import { cn }      from "$lib/utils.js";
  import { ClipboardList, Database, BrainCircuit } from "lucide-svelte";

  type Section = "audit" | "models" | "data";
  let activeSection = $state<Section>("audit");

  const NAV_ITEMS: { id: Section; label: string; icon: typeof ClipboardList }[] = [
    { id: "audit",  label: "Audit Trail",     icon: ClipboardList },
    { id: "models", label: "Local Models",    icon: BrainCircuit  },
    { id: "data",   label: "Data Management", icon: Database      },
  ];
</script>

<div class="flex flex-1 min-h-0 overflow-hidden">

  <!-- ── Left sidebar ────────────────────────────────────────────── -->
  <aside class="w-48 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden">
    <div class="px-4 pt-4 pb-2 shrink-0">
      <span class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/40">
        Dashboard
      </span>
    </div>

    <nav class="flex flex-col flex-1 overflow-y-auto py-1">
      {#each NAV_ITEMS as item}
        <button
          class={cn(
            "relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors text-left w-full",
            activeSection === item.id
              ? "text-foreground font-medium bg-sidebar-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
          )}
          onclick={() => { activeSection = item.id; }}
        >
          {#if activeSection === item.id}
            <span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>
          {/if}
          <item.icon class="size-3.5 shrink-0" />
          <span class="flex-1 tracking-tight">{item.label}</span>
        </button>
      {/each}
    </nav>
  </aside>

  <!-- ── Main content ─────────────────────────────────────────────── -->
  <main class="flex-1 min-h-0 overflow-hidden flex flex-col bg-background">
    {#if activeSection === "audit"}
      <AuditView />
    {:else if activeSection === "models"}
      <ModelsView />
    {:else if activeSection === "data"}
      <DataManager />
    {/if}
  </main>

</div>
