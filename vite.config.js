import path from "path";
import fs from "fs";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const ONNX_DIST = path.resolve("node_modules/onnxruntime-web/dist");

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
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url || "").split("?")[0];
          const basename = path.basename(pathname);
          // Serve onnxruntime-web .mjs and .wasm from node_modules so the LLM worker
          // can load them at origin root (env.backends.onnx.wasm.wasmPaths = origin + "/").
          if (basename.startsWith("ort-wasm") && (basename.endsWith(".mjs") || basename.endsWith(".wasm"))) {
            const file = path.join(ONNX_DIST, basename);
            if (fs.existsSync(file)) {
              res.setHeader("Content-Type", basename.endsWith(".wasm") ? "application/wasm" : "application/javascript");
              res.setHeader("Cache-Control", "no-cache");
              fs.createReadStream(file).pipe(res);
              return;
            }
          }
          if (req.url && req.url.endsWith(".wasm")) {
            res.setHeader("Content-Type", "application/wasm");
          }
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url || "").split("?")[0];
          const basename = path.basename(pathname);
          if (basename.startsWith("ort-wasm") && (basename.endsWith(".mjs") || basename.endsWith(".wasm"))) {
            const file = path.join(ONNX_DIST, basename);
            if (fs.existsSync(file)) {
              res.setHeader("Content-Type", basename.endsWith(".wasm") ? "application/wasm" : "application/javascript");
              res.setHeader("Cache-Control", "no-cache");
              fs.createReadStream(file).pipe(res);
              return;
            }
          }
          if (req.url && req.url.endsWith(".wasm")) {
            res.setHeader("Content-Type", "application/wasm");
          }
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
          next();
        });
      },
    },
    // Copy onnxruntime-web WASM + .mjs to build root so the LLM worker can fetch them at /
    viteStaticCopy({
      targets: [
        { src: "node_modules/onnxruntime-web/dist/ort-wasm*.wasm", dest: "." },
        { src: "node_modules/onnxruntime-web/dist/ort-wasm*.mjs", dest: "." },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: path.resolve("index.html"),
    },
  },
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
