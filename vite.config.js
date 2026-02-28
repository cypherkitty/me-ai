import path from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // VITE_BASE overrides the base path (used by PR preview deploys).
  // Fallback: "/me-ai/" in CI, "/" locally.
  base: process.env.VITE_BASE || (process.env.GITHUB_ACTIONS ? "/me-ai/" : "/"),
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
  plugins: [
    tailwindcss(),
    svelte(),
    // COOP header needed for OPFS (DuckDB persistence).
    // We use "same-origin-allow-popups" instead of the stricter "same-origin"
    // so that Google OAuth popups can still communicate back to this window.
    // Chrome 109+ removed the crossOriginIsolated requirement for OPFS sync
    // handles, so OPFS keeps working without COEP / strict COOP.
    {
      name: "cross-origin-opener-policy",
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
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
