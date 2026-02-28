import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { setSetting, getSetting } from "./lib/store/settings.js";

const app = mount(App, { target: document.getElementById("app") });

// Expose DB helpers on window for Playwright E2E tests.
// These are no-ops in production but harmless.
window.__setSetting = setSetting;
window.__getSetting = getSetting;

export default app;
