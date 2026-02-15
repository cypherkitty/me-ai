<script>
  import { onMount } from "svelte";
  import Chat from "./Chat.svelte";
  import Dashboard from "./Dashboard.svelte";
  import Actions from "./Actions.svelte";

  function getPage() {
    const hash = location.hash;
    if (hash === "#dashboard") return "dashboard";
    if (hash === "#actions") return "actions";
    return "chat";
  }

  let page = $state(getPage());

  onMount(() => {
    function onHashChange() {
      page = getPage();
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  });
</script>

<div class="app-shell">
  <nav class="top-nav">
    <a class="nav-brand" href="#chat">me-ai</a>
    <div class="nav-links">
      <a href="#chat" class:active={page === "chat"}>Chat</a>
      <a href="#actions" class:active={page === "actions"}>Actions</a>
      <a href="#dashboard" class:active={page === "dashboard"}>Dashboard</a>
    </div>
  </nav>
  <main>
    <div class="page-view" style:display={page === "chat" ? "flex" : "none"}>
      <Chat />
    </div>
    <div class="page-view" style:display={page === "actions" ? "flex" : "none"}>
      <Actions />
    </div>
    <div class="page-view" style:display={page === "dashboard" ? "flex" : "none"}>
      <Dashboard />
    </div>
  </main>
</div>

<style>
  /* ── Global reset & base ──────────────────────────────────────── */
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif;
    background: #0f0f0f;
    color: #e8e8e8;
    height: 100dvh;
    overflow: hidden;
  }
  :global(#app) {
    height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  /* ── App shell ────────────────────────────────────────────────── */
  .app-shell {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* ── Top nav ──────────────────────────────────────────────────── */
  .top-nav {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    height: 44px;
    border-bottom: 1px solid #1f1f1f;
    background: #111;
    flex-shrink: 0;
  }
  .nav-brand {
    font-size: 0.95rem;
    font-weight: 700;
    color: #e8e8e8;
    text-decoration: none;
    letter-spacing: -0.02em;
  }
  .nav-brand:hover {
    color: #fff;
  }
  .nav-links {
    display: flex;
    gap: 0.25rem;
    margin-left: auto;
  }
  .nav-links a {
    padding: 0.3rem 0.7rem;
    border-radius: 6px;
    font-size: 0.8rem;
    color: #777;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
  }
  .nav-links a:hover {
    color: #ccc;
    background: rgba(255, 255, 255, 0.05);
  }
  .nav-links a.active {
    color: #e8e8e8;
    background: rgba(255, 255, 255, 0.08);
  }

  /* ── Page views ───────────────────────────────────────────────── */
  main {
    flex: 1;
    overflow: hidden;
    display: flex;
  }
  .page-view {
    flex: 1;
    flex-direction: column;
    overflow: hidden;
  }
</style>
