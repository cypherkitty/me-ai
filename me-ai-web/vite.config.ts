import path from "node:path";
import fs from "node:fs";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

const ONNX_DIST = path.resolve("node_modules/onnxruntime-web/dist");
const CORE_PKG = path.resolve("node_modules/me-ai-core");
/** Fallback when me-ai-core is not installed (e.g. dev before task install). */
const CORE_PKG_FALLBACK = path.resolve("..", "me-ai-core", "pkg");

export default defineConfig({
  base: process.env.VITE_BASE ?? (process.env.GITHUB_ACTIONS ? "/me-ai/" : "/"),
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
  plugins: [
    wasm(),
    topLevelAwait(),
    tailwindcss(),
    svelte(),
    {
      name: "cross-origin-opener-policy",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url ?? "").split("?")[0];
          const basename = path.basename(pathname);
          if (pathname.includes("/wasm/") && (basename === "me_ai_core.js" || basename === "me_ai_core_bg.wasm")) {
            const file = path.join(CORE_PKG, basename);
            const fallback = path.join(CORE_PKG_FALLBACK, basename);
            const toServe = fs.existsSync(file) ? file : fs.existsSync(fallback) ? fallback : null;
            if (toServe) {
              res.setHeader("Content-Type", basename.endsWith(".wasm") ? "application/wasm" : "application/javascript");
              res.setHeader("Cache-Control", "no-cache");
              fs.createReadStream(toServe).pipe(res);
              return;
            }
          }
          if (basename.startsWith("ort-wasm") && (basename.endsWith(".mjs") || basename.endsWith(".wasm"))) {
            const file = path.join(ONNX_DIST, basename);
            if (fs.existsSync(file)) {
              res.setHeader("Content-Type", basename.endsWith(".wasm") ? "application/wasm" : "application/javascript");
              res.setHeader("Cache-Control", "no-cache");
              fs.createReadStream(file).pipe(res);
              return;
            }
          }
          if (req.url?.endsWith(".wasm")) {
            res.setHeader("Content-Type", "application/wasm");
          }
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url ?? "").split("?")[0];
          const basename = path.basename(pathname);
          if (pathname.includes("/wasm/") && (basename === "me_ai_core.js" || basename === "me_ai_core_bg.wasm")) {
            const file = path.join(CORE_PKG, basename);
            const fallback = path.join(CORE_PKG_FALLBACK, basename);
            const toServe = fs.existsSync(file) ? file : fs.existsSync(fallback) ? fallback : null;
            if (toServe) {
              res.setHeader("Content-Type", basename.endsWith(".wasm") ? "application/wasm" : "application/javascript");
              res.setHeader("Cache-Control", "no-cache");
              fs.createReadStream(toServe).pipe(res);
              return;
            }
          }
          if (basename.startsWith("ort-wasm") && (basename.endsWith(".mjs") || basename.endsWith(".wasm"))) {
            const file = path.join(ONNX_DIST, basename);
            if (fs.existsSync(file)) {
              res.setHeader("Content-Type", basename.endsWith(".wasm") ? "application/wasm" : "application/javascript");
              res.setHeader("Cache-Control", "no-cache");
              fs.createReadStream(file).pipe(res);
              return;
            }
          }
          if (req.url?.endsWith(".wasm")) {
            res.setHeader("Content-Type", "application/wasm");
          }
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
          next();
        });
      },
    },
    viteStaticCopy({
      targets: [
        { src: "node_modules/onnxruntime-web/dist/ort-wasm*.wasm", dest: "." },
        { src: "node_modules/onnxruntime-web/dist/ort-wasm*.mjs", dest: "." },
        { src: "node_modules/me-ai-core/me_ai_core.js", dest: "wasm" },
        { src: "node_modules/me-ai-core/me_ai_core_bg.wasm", dest: "wasm" },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: path.resolve("index.html"),
    },
  },
  optimizeDeps: {
    exclude: ["me-ai-core"],
    include: ["tslib"],
  },
  test: {
    exclude: ["e2e/**", "node_modules/**"],
  },
});
