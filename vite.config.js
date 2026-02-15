import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  // VITE_BASE overrides the base path (used by PR preview deploys).
  // Fallback: "/me-ai/" in CI, "/" locally.
  base: process.env.VITE_BASE || (process.env.GITHUB_ACTIONS ? "/me-ai/" : "/"),
  plugins: [svelte()],
});
