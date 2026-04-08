<script lang="ts">
  import { onMount } from "svelte";
  import { getSavedToken, isTokenValid } from "../../lib/google-auth.js";
  import { getSavedTwitterToken } from "../../lib/twitter-auth.js";
  import { getClassificationCounts } from "../../lib/core.js";
  import { getCore } from "../../lib/store/core-store.js";
  import { getGmailSyncStatus } from "../../lib/store/gmail-sync.js";
  import { getTwitterSyncStatus } from "../../lib/store/twitter-sync.js";
  import { getUnifiedEngine } from "../../lib/unified-engine.js";
  import {
    GitBranch,
    CheckCircle2,
    Zap,
    Mail,
    ShieldCheck,
    MessageSquare,
    Shield,
    LaptopMinimal,
    SlidersHorizontal,
  } from "lucide-svelte";

  interface SyncStatus {
    synced: boolean;
    totalItems: number | bigint;
    lastSyncAt: number | null;
    hasMore: boolean;
  }

  interface Props {
    currentSection?: "start" | "scan-chat" | "sources" | "control";
    chatStage?: "configure" | "loading" | "chat";
  }

  let { currentSection = "start", chatStage = "configure" }: Props = $props();

  const HOME_STAGE_KEY = "me-ai-home-stage";

  let gmailConnected = $state(false);
  let emailCount = $state(0);
  let scannedCount = $state(0);
  let pipelineCount = $state(0);
  let checking = $state(true);

  function toCount(value: number | bigint | null | undefined): number {
    if (typeof value === "bigint") return Number(value);
    return Number(value ?? 0);
  }

  const engine = getUnifiedEngine();
  let engineReady = $state(engine.isReady);

  $effect(() => {
    const unsub = engine.onMessage((rawMsg: unknown) => {
      const msg = rawMsg as { status?: string };
      if (msg.status === "ready") engineReady = true;
    });
    return unsub;
  });

  onMount(async () => {
    try {
      const token = await getSavedToken();
      if (token && (await isTokenValid())) {
        gmailConnected = true;
      }
    } catch {
      /* no-op */
    }

    try {
      const status = (await getGmailSyncStatus()) as unknown as SyncStatus;
      emailCount = toCount(status.totalItems);
    } catch {
      /* no-op */
    }

    try {
      const twStatus = (await getTwitterSyncStatus()) as unknown as SyncStatus;
      emailCount += toCount(twStatus.totalItems);
    } catch {
      /* no-op */
    }

    try {
      const twToken = await getSavedTwitterToken();
      if (twToken) gmailConnected = true;
    } catch {
      /* no-op */
    }

    try {
      const { getDirectories } = await import("../../lib/plugins/filesystem-store.js");
      const dirs = await getDirectories();
      if (dirs.length > 0) gmailConnected = true;
    } catch {
      /* no-op */
    }

    try {
      const counts = (await getClassificationCounts()) as { total?: number };
      scannedCount = counts.total ?? 0;
    } catch {
      /* no-op */
    }

    try {
      const stats = (await getCore().getEventStats()) as { total?: number };
      pipelineCount = stats.total ?? 0;
    } catch {
      /* no-op */
    }

    checking = false;
  });

  const configureState = $derived(
    chatStage === "configure" || chatStage === "loading"
      ? "active"
      : engineReady
        ? "done"
        : "active"
  );
  const scanChatState = $derived(
    currentSection === "scan-chat" || chatStage === "chat"
      ? scannedCount > 0
        ? "done"
        : "active"
      : engineReady
        ? "active"
        : "idle"
  );
  const sourcesState = $derived(
    currentSection === "sources"
      ? "active"
      : gmailConnected
        ? "done"
        : engineReady
          ? "active"
          : "idle"
  );
  const controlState = $derived(
    currentSection === "control"
      ? pipelineCount > 0
        ? "done"
        : "active"
      : pipelineCount > 0
        ? "done"
        : scannedCount > 0 || engineReady
          ? "active"
          : "idle"
  );

  function setPreferredStage(stage: "configure" | "chat") {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(HOME_STAGE_KEY, stage);
    }
    window.dispatchEvent(
      new CustomEvent(stage === "chat" ? "me-ai:open-chat" : "me-ai:open-configure")
    );
  }

  function goStartHere(event: Event) {
    event.preventDefault();
    setPreferredStage("configure");
    window.location.hash = "#home";
  }

  function goScanChat(event: Event) {
    event.preventDefault();
    setPreferredStage("chat");
    window.location.hash = "#home";
  }

  const TRUST_BADGES = [
    { icon: Shield, label: "Open Source" },
    { icon: LaptopMinimal, label: "Browser-First" },
    { icon: SlidersHorizontal, label: "Yours to Control" },
  ];
</script>

<div class="flex flex-col shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
  <div class="flex items-center gap-3 px-4 h-11 border-b border-border/70 bg-sidebar/80">
    <div class="size-6 rounded bg-primary flex items-center justify-center shrink-0">
      <Zap class="size-3.5 text-primary-foreground" />
    </div>
    <span class="text-sm font-semibold tracking-tight text-foreground">me-ai</span>
    <div class="flex-1"></div>
    <div class="hidden lg:flex items-center gap-2">
      {#each TRUST_BADGES as badge (badge.label)}
        <span
          class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-border/70 bg-background/70 text-[0.66rem] text-foreground/75"
        >
          <badge.icon class="size-3.5 text-primary/80" />
          <span>{badge.label}</span>
        </span>
      {/each}
    </div>
  </div>

  <div class="px-6 py-2.5">
    {#if checking}
      <div class="flex items-center justify-center gap-4 animate-pulse h-10">
        <div class="h-8 w-32 bg-muted/40 rounded-full"></div>
        <div class="h-px w-8 bg-muted/40"></div>
        <div class="h-8 w-32 bg-muted/40 rounded-full"></div>
        <div class="h-px w-8 bg-muted/40"></div>
        <div class="h-8 w-32 bg-muted/40 rounded-full"></div>
        <div class="h-px w-8 bg-muted/40"></div>
        <div class="h-8 w-32 bg-muted/40 rounded-full"></div>
      </div>
    {:else}
      <div class="flex items-center justify-center gap-0 overflow-x-auto">
        <nav aria-label="Progress" class="flex items-center min-w-max">
          <a
            href="#home"
            onclick={goStartHere}
            class="relative flex items-center group no-underline"
          >
            <div
              class={`flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                currentSection === "start"
                  ? "bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm"
                  : configureState === "done"
                    ? "bg-success/10 hover:bg-success/20 text-success"
                    : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <div
                class={`flex items-center justify-center size-5 rounded-full shrink-0 transition-colors ${
                  currentSection === "start"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : configureState === "done"
                      ? "bg-success text-success-foreground"
                      : "bg-muted-foreground/20 text-muted-foreground"
                }`}
              >
                {#if configureState === "done" && currentSection !== "start"}
                  <CheckCircle2 class="size-3" />
                {:else}
                  <Zap class="size-3" />
                {/if}
              </div>
              <div class="flex flex-col">
                <span class="text-[0.7rem] font-bold uppercase tracking-wider leading-none"
                  >Start here</span
                >
                {#if chatStage === "loading"}
                  <span class="text-[0.6rem] opacity-80 mt-1 leading-none">Preparing model</span>
                {:else if configureState === "done" && currentSection !== "start"}
                  <span class="text-[0.6rem] opacity-80 mt-1 leading-none">Model configured</span>
                {:else}
                  <span class="text-[0.6rem] opacity-60 mt-1 leading-none">Choose your model</span>
                {/if}
              </div>
            </div>
          </a>

          <div
            class={`w-6 sm:w-12 md:w-16 h-px mx-2 transition-colors duration-500 ${scanChatState !== "idle" ? "bg-primary/40" : "bg-border/60"}`}
          ></div>

          <a
            href="#home"
            onclick={goScanChat}
            class={`relative flex items-center group no-underline ${scanChatState === "idle" ? "pointer-events-none opacity-40 mix-blend-luminosity" : ""}`}
          >
            <div
              class={`flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                currentSection === "scan-chat"
                  ? "bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm"
                  : scanChatState === "done"
                    ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500"
                    : scanChatState === "active"
                      ? "bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm"
                      : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <div
                class={`flex items-center justify-center size-5 rounded-full shrink-0 transition-colors ${
                  currentSection === "scan-chat"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : scanChatState === "done"
                      ? "bg-amber-500 text-white"
                      : scanChatState === "active"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted-foreground/20 text-muted-foreground"
                }`}
              >
                {#if scanChatState === "done" && currentSection !== "scan-chat"}
                  <CheckCircle2 class="size-3" />
                {:else}
                  <MessageSquare class="size-3" />
                {/if}
              </div>
              <div class="flex flex-col">
                <span class="text-[0.7rem] font-bold uppercase tracking-wider leading-none"
                  >Scan&amp;Chat</span
                >
                {#if scanChatState === "done"}
                  <span class="text-[0.6rem] opacity-80 mt-1 leading-none"
                    >{scannedCount.toLocaleString()} classified</span
                  >
                {:else if scanChatState === "active"}
                  <span class="text-[0.6rem] opacity-80 mt-1 leading-none">Ready to work</span>
                {:else}
                  <span class="text-[0.6rem] opacity-60 mt-1 leading-none"
                    >Complete setup first</span
                  >
                {/if}
              </div>
            </div>
          </a>

          <div
            class={`w-6 sm:w-12 md:w-16 h-px mx-2 transition-colors duration-500 ${sourcesState !== "idle" ? "bg-primary/40" : "bg-border/60"}`}
          ></div>

          <a href="#sources" class="relative flex items-center group no-underline">
            <div
              class={`flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                currentSection === "sources"
                  ? "bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm"
                  : sourcesState === "done"
                    ? "bg-primary/10 hover:bg-primary/20 text-primary"
                    : sourcesState === "active"
                      ? "bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm"
                      : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <div
                class={`flex items-center justify-center size-5 rounded-full shrink-0 transition-colors ${
                  currentSection === "sources"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : sourcesState === "done"
                      ? "bg-primary text-primary-foreground"
                      : sourcesState === "active"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted-foreground/20 text-muted-foreground"
                }`}
              >
                {#if sourcesState === "done" && currentSection !== "sources"}
                  <CheckCircle2 class="size-3" />
                {:else}
                  <Mail class="size-3" />
                {/if}
              </div>
              <div class="flex flex-col">
                <span class="text-[0.7rem] font-bold uppercase tracking-wider leading-none"
                  >Sources</span
                >
                {#if sourcesState === "done"}
                  <span class="text-[0.6rem] opacity-80 mt-1 leading-none"
                    >{emailCount.toLocaleString()} synced</span
                  >
                {:else if sourcesState === "active"}
                  <span class="text-[0.6rem] opacity-80 mt-1 leading-none">Connect your data</span>
                {:else}
                  <span class="text-[0.6rem] opacity-60 mt-1 leading-none">Optional next step</span>
                {/if}
              </div>
            </div>
          </a>

          <div
            class={`w-6 sm:w-12 md:w-16 h-px mx-2 transition-colors duration-500 ${controlState !== "idle" ? "bg-primary/40" : "bg-border/60"}`}
          ></div>

          <a href="#pipelines" class="relative flex items-center group no-underline">
            <div
              class={`flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                currentSection === "control"
                  ? "bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm"
                  : controlState === "done"
                    ? "bg-primary/10 hover:bg-primary/20 text-primary"
                    : controlState === "active"
                      ? "bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm"
                      : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <div
                class={`flex items-center justify-center size-5 rounded-full shrink-0 transition-colors ${
                  currentSection === "control"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : controlState === "done"
                      ? "bg-primary text-primary-foreground"
                      : controlState === "active"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted-foreground/20 text-muted-foreground"
                }`}
              >
                {#if controlState === "done" && currentSection !== "control"}
                  <CheckCircle2 class="size-3" />
                {:else}
                  <GitBranch class="size-3" />
                {/if}
              </div>
              <div class="flex flex-col">
                <span class="text-[0.7rem] font-bold uppercase tracking-wider leading-none"
                  >Control</span
                >
                {#if controlState === "done"}
                  <span class="text-[0.6rem] opacity-80 mt-1 leading-none"
                    >{pipelineCount} {pipelineCount === 1 ? "rule" : "rules"} active</span
                  >
                {:else if controlState === "active"}
                  <span class="text-[0.6rem] opacity-80 mt-1 leading-none">Configure rules</span>
                {:else}
                  <span class="text-[0.6rem] opacity-60 mt-1 leading-none">Pending scan</span>
                {/if}
              </div>
            </div>
          </a>

          <div class="h-8 w-px bg-border/80 ml-6 mr-1 shrink-0" aria-hidden="true"></div>
          <a
            href="#admin"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[0.7rem] font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 transition-colors no-underline shrink-0"
            title="Admin dashboard"
          >
            <ShieldCheck class="size-3.5 shrink-0" />
            <span class="tracking-tight">Admin</span>
          </a>
        </nav>
      </div>
    {/if}
  </div>
</div>
