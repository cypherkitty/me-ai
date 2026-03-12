import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { setSetting, getSetting } from "./lib/store/settings.js";
import { initCore } from "./lib/core.js";

const el = document.getElementById("app");
if (!el) throw new Error("Missing #app element");
const app = mount(App, { target: el });

// Init core after document is ready so IndexedDB open runs in a valid browser context.
function startCoreInit() {
  initCore().catch((e) => {
    console.error("[core] init failed", e);
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startCoreInit);
} else {
  startCoreInit();
}

// Expose DB helpers on window for Playwright E2E tests.
// These are no-ops in production but harmless.
declare global {
  interface Window {
    __setSetting: typeof setSetting;
    __getSetting: typeof getSetting;
  }
}
window.__setSetting = setSetting;
window.__getSetting = getSetting;

export default app;
