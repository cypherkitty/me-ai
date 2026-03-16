<script lang="ts">
  import { Settings } from "lucide-svelte";
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Header -->
  <div class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border">
    <div>
      <div class="flex items-center gap-2 mb-0.5">
        <Settings class="size-5 text-primary/60" />
        <h2 class="text-xl font-bold tracking-tight text-foreground">Settings</h2>
      </div>
      <p class="text-sm text-muted-foreground/60">
        Application configuration and preferences.
      </p>
    </div>
  </div>

  <div class="flex flex-col items-center justify-center flex-1 gap-3 text-muted-foreground/40">
    <Settings class="size-9" />
    <p class="text-sm">No settings configured yet.</p>
  </div>
</div>
