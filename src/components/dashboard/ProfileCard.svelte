<script>
  import { onMount } from "svelte";
  import { initial } from "../../lib/email-utils.js";
  import { mountLog } from "../../lib/debug.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Card, CardContent } from "$lib/components/ui/card/index.js";

  let { profile = null, loadingProfile = false, onsignout } = $props();

  onMount(() => mountLog("ProfileCard"));
</script>

<Card class="mb-4">
  <CardContent class="flex items-center gap-4 px-5 py-4">
    <div class="size-[42px] rounded-full bg-primary flex items-center justify-center text-primary-foreground text-base font-bold shrink-0">
      {profile ? initial(profile.emailAddress) : "?"}
    </div>
    <div class="flex-1 flex flex-col gap-0.5 min-w-0">
      {#if loadingProfile}
        <span class="text-sm text-muted-foreground">Loading profile…</span>
      {:else if profile}
        <span class="text-sm font-semibold text-foreground truncate">{profile.emailAddress}</span>
        <span class="text-xs text-muted-foreground/60">
          {profile.messagesTotal?.toLocaleString() || "?"} messages
          · {profile.threadsTotal?.toLocaleString() || "?"} threads
        </span>
      {/if}
    </div>
    <Button variant="outline" size="sm" onclick={onsignout}>Sign Out</Button>
  </CardContent>
</Card>
