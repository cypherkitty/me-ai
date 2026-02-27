import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  // VITE_BASE overrides the base path (used by PR preview deploys).
  // Fallback: "/me-ai/" in CI, "/" locally.
  base: process.env.VITE_BASE || (process.env.GITHUB_ACTIONS ? "/me-ai/" : "/"),
  plugins: [
    svelte(),
    // Cross-Origin Isolation headers required for:
    //   - OPFS (SharedArrayBuffer / synchronous OPFS access)
    //   - DuckDB WASM pthread workers
    {
      name: "cross-origin-isolation",
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          next();
        });
      },
    },
  ],
  optimizeDeps: {
    // DuckDB ships pre-built WASM + worker bundles — exclude from Vite's
    // dep optimisation so the ?url and ?worker imports resolve correctly.
    exclude: ["@duckdb/duckdb-wasm"],
    // apache-arrow (DuckDB dependency) lists tslib as a peer dep; include it
    // so Vite pre-bundles it and makes it available to arrow's ESM imports.
    include: ["tslib"],
  },
  test: {
    exclude: ["e2e/**", "node_modules/**"],
  },
});
