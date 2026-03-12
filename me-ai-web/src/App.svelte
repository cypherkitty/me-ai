<script lang="ts">
  import { onMount } from "svelte";
  import AppRouter from "./AppRouter.svelte";
  import { getEventStats } from "./lib/rules.js";

  const CP_PAGES = ["stream", "pipelines", "approvals"];
  const OAUTH_PAGES = ["auth", "oauth-redirect"];
  const SOURCE_PAGES = ["sources", "plugins"];
  const SCAN_PAGES = ["scan"];
  const ADMIN_PAGES = ["admin"];
  const ALL_PAGES = [...OAUTH_PAGES, ...SOURCE_PAGES, ...SCAN_PAGES, ...CP_PAGES, ...ADMIN_PAGES, "home", "chat"];

  function getPage() {
    const h = location.hash.replace("#", "");
    if (h === "chat") return "home";
    return ALL_PAGES.includes(h) ? h : "home";
  }

  let page = $state(getPage());
  const inOAuth = $derived(OAUTH_PAGES.includes(page));
  const inSources = $derived(SOURCE_PAGES.includes(page));
  const inScan = $derived(SCAN_PAGES.includes(page));
  const inCP = $derived(CP_PAGES.includes(page));
  const inAdmin = $derived(ADMIN_PAGES.includes(page));
  const inHome = $derived(page === "home");

  interface EventStats {
    total: number;
    completed: number;
    awaiting_user: number;
    escalated: number;
    failed: number;
  }
  let stats = $state<EventStats>({ total: 0, completed: 0, awaiting_user: 0, escalated: 0, failed: 0 });

  async function loadStats() {
    try {
      stats = (await getEventStats()) as EventStats;
    } catch {}
  }

  onMount(() => {
    const onHash = () => {
      page = getPage();
      if (CP_PAGES.includes(getPage())) loadStats();
    };
    window.addEventListener("hashchange", onHash);
    if (inCP) loadStats();
    return () => window.removeEventListener("hashchange", onHash);
  });
</script>

<div class="h-dvh w-full overflow-hidden">
  <AppRouter {page} {inOAuth} {inHome} {inSources} {inScan} {inAdmin} {stats} />
</div>
