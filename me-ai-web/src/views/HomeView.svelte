<script lang="ts">
  import Chat from "../Chat.svelte";
  import WorkflowHeader from "../components/shared/WorkflowHeader.svelte";

  let chatStage = $state<"configure" | "loading" | "chat">("configure");
</script>

<div class="flex flex-col h-full overflow-hidden">
  <WorkflowHeader
    currentSection={chatStage === "chat" ? "scan-chat" : "start"}
    {chatStage}
  />

  <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
    <Chat
      onstagechange={(stage) => {
        chatStage = stage;
      }}
    />
  </div>
</div>
