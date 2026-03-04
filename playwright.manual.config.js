import { defineConfig } from "@playwright/test";

/** Config for manual verification - no webServer, assumes dev server is already running */
export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  retries: 0,
  reporter: "list",
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  use: {
    baseURL: "http://localhost:5174",
  },
});
