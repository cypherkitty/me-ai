import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { setSetting, getSetting } from "./lib/store/settings.js";
import { initCore } from "./lib/core.js";

const el = document.getElementById("app");
if (!el) throw new Error("Missing #app element");
const app = mount(App, { target: el });

// Eager-init core (shell-style): load WASM and schema in background so first use is fast.
initCore().catch((e) => {
  console.error("[core] init failed", e);
  console.warn("[core] IndexedDB may be unavailable (e.g. private browsing). Settings will use localStorage.");
});

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
