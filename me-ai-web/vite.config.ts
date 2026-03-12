import path from "node:path";
import fs from "node:fs";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const ONNX_DIST = path.resolve("node_modules/onnxruntime-web/dist");

export default defineConfig({
  base: process.env.VITE_BASE ?? (process.env.GITHUB_ACTIONS ? "/me-ai/" : "/"),
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
  plugins: [
    tailwindcss(),
    svelte(),
    {
      name: "cross-origin-opener-policy",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url ?? "").split("?")[0];
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
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: path.resolve("index.html"),
    },
  },
  optimizeDeps: {
    exclude: ["@duckdb/duckdb-wasm"],
    include: ["tslib"],
  },
  test: {
    exclude: ["e2e/**", "node_modules/**"],
  },
});
