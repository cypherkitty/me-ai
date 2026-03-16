import path from "node:path";
import fs from "node:fs";
import { defineConfig, type Plugin } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const ONNX_DIST = path.resolve("node_modules/onnxruntime-web/dist");
const CORE_PKG = path.resolve("node_modules/me-ai-core");

/** Bust Chrome's HTTP + V8 WASM code cache by appending the file's mtime. */
function wasmMtime(file: string): string {
  try { return String(fs.statSync(file).mtimeMs | 0); } catch { return "0"; }
}

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
    ((): Plugin => {
      function makeMiddleware() {
        return (req: { url?: string }, res: import("node:http").ServerResponse, next: () => void) => {
          const pathname = (req.url ?? "").split("?")[0];
          const basename = path.basename(pathname);
          if (pathname.includes("/wasm/") && (basename === "me_ai_core.js" || basename === "me_ai_core_bg.wasm")) {
            const file = path.join(CORE_PKG, basename);
            const toServe = fs.existsSync(file) ? file : null;
            if (toServe) {
              // Rewrite me_ai_core.js to append mtime to the .wasm fetch URL so
              // Chrome's V8 WASM code cache is busted on every rebuild.
              if (basename === "me_ai_core.js") {
                const mtime = wasmMtime(path.join(CORE_PKG, "me_ai_core_bg.wasm"));
                let src = fs.readFileSync(toServe, "utf-8");
                src = src.replace(/(me_ai_core_bg\.wasm)(['"])/g, `$1?v=${mtime}$2`);
                res.setHeader("Content-Type", "application/javascript");
                res.setHeader("Cache-Control", "no-store");
                res.end(src);
              } else {
                res.setHeader("Content-Type", "application/wasm");
                res.setHeader("Cache-Control", "no-store");
                fs.createReadStream(toServe).pipe(res);
              }
              return;
            }
          }
          if (basename.startsWith("ort-wasm") && (basename.endsWith(".mjs") || basename.endsWith(".wasm"))) {
            const file = path.join(ONNX_DIST, basename);
            if (fs.existsSync(file)) {
              res.setHeader("Content-Type", basename.endsWith(".wasm") ? "application/wasm" : "application/javascript");
              res.setHeader("Cache-Control", "no-store");
              fs.createReadStream(file).pipe(res);
              return;
            }
          }
          if (req.url?.endsWith(".wasm")) {
            res.setHeader("Content-Type", "application/wasm");
          }
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
          next();
        };
      }

      return {
        name: "cross-origin-opener-policy",
        configureServer(server) { server.middlewares.use(makeMiddleware()); },
        configurePreviewServer(server) { server.middlewares.use(makeMiddleware()); },
      };
    })(),
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
