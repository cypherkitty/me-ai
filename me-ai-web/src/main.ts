import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { setSetting, getSetting } from "$lib/store/settings";
import { initCore } from "$lib/core";

// Init core after document is ready so IndexedDB open runs in a valid browser context.
async function startCoreInit() {
  try {
    await initCore();
  } catch (e) {
    console.error("[core] init failed", e);
  }
  const el = document.getElementById("app");
  if (!el) throw new Error("Missing #app element");
  mount(App, { target: el });
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

