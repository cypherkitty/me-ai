# Rust + TypeScript WASM integration blueprint

Based on [duckdb-wasm-shell](https://github.com/duckdb/duckdb-wasm/tree/main/packages/duckdb-wasm-shell). They use Rust WASM in the browser with minimal bindings.

## How duckdb-wasm-shell does it

### 1. Single Rust crate, wasm-pack web target

- **Crate**: `packages/duckdb-wasm-shell/crate/` (Rust)
- **Build**: `wasm-pack build --target web --out-dir ./pkg --out-name shell` (debug or release)
- **Output**: `crate/pkg/shell.js` (glue), `crate/pkg/shell_bg.wasm` (binary)
- No custom tooling; standard wasm-pack output.

### 2. TypeScript imports the pkg directly

```ts
// packages/duckdb-wasm-shell/src/shell.ts
import * as shell from '../crate/pkg';
```

- No hand-written “bindings” layer.
- All Rust exports are used as `shell.embed`, `shell.resize`, `shell.write`, etc.

### 3. Init = default export, then call exports

```ts
// Initialize the Rust WASM
await shell.default(props.shellModule);

// Then use exported functions
shell.embed(props.container, runtime, options);
shell.write(text);
shell.resize(width, height);
```

- `shell.default` is the wasm-pack **init** (loads/instantiates the WASM). It can take an optional `RequestInfo | URL | Response | BufferSource | WebAssembly.Module`.
- After `await shell.default(...)`, all other exports are safe to call.

### 4. Build pipeline (bundle.mjs)

1. Run wasm-pack in the crate dir.
2. Copy `shell_bg.wasm` into `dist/`.
3. Bundle TS with esbuild, **keeping** `@duckdb/duckdb-wasm` (and other deps) **external**.
4. Publish `dist/shell.mjs`, `dist/shell.cjs`, `dist/shell_bg.wasm`.

So: **one** wasm-pack build, **one** init call, **direct** use of generated exports. No extra binding generators or custom glue.

### 5. Rust side: plain wasm_bindgen exports

- `#[wasm_bindgen(start)]` for one-time setup (e.g. panic hook, logger).
- Exports are normal `#[wasm_bindgen]` / `#[wasm_bindgen(js_name = "...")]` functions and types.
- They pass a **JS object** (`ShellRuntime`) into Rust; wasm_bindgen handles the boundary. No custom serde-over-the-wire for this; the runtime is a JS class with methods the shell calls back into.

---

## Differences from me-ai today

| Aspect | duckdb-wasm-shell | me-ai |
|--------|-------------------|--------|
| Who runs the DB | JS (DuckDB is a separate Emscripten C++ WASM). Rust shell only does UI. | Rust builds SQL; **JS runs DuckDB** via an adapter (`query`/`exec`). |
| Init | `await shell.default(wasmModule)`; no args. | `init(adapter)` — we pass the JS adapter so Rust can call back into JS to run SQL. |
| Bindings | None; use pkg as-is. | We already use wasm-pack pkg; the only “binding” is the **adapter** (required so Rust can run SQL in JS). |

So we **already** follow the same idea: wasm-pack, single init, direct use of exports. The adapter in me-ai is not “crazy bindings” — it’s the minimal callback layer so that:

- Rust owns **all SQL** (no SQL strings in TS).
- Execution stays in JS (DuckDB-WASM + OPFS, etc.).

---

## Takeaways for me-ai

1. **Keep using wasm-pack `--target web`** and the generated pkg (as we do). No need to switch to a custom binding layer.
2. **Init pattern**: We can align with the shell style:
   - Load WASM (e.g. from `/wasm/me_ai_core.js` or from `me-ai-core` package).
   - Call `init(adapter)` once (our adapter is the only extra argument).
   - Then use `getEventTypes()`, `createSchemaAndMigrations()`, etc., directly.
3. **Single entry**: Like the shell, we have one init and then only exported functions. No need for extra “binding” files beyond the adapter interface.
4. **Optional**: We could expose a **default** export that is `init` and keep the rest as named exports, so the usage looks like:
   ```ts
   import init, * as core from 'me-ai-core';
   await init(createDbAdapter());
   await core.createSchemaAndMigrations();
   ```
   That matches the shell’s `await shell.default(module)` then `shell.embed(...)` style.

---

## Reference

- [duckdb-wasm-shell (GitHub)](https://github.com/duckdb/duckdb-wasm/tree/main/packages/duckdb-wasm-shell)
- Shell embed flow: `embed()` → `shell.default(shellModule)` → `shell.embed(container, runtime, options)`.
- Build: `bundle.mjs` runs wasm-pack, copies WASM, then esbuild for TS.
- [wasm-pack target web](https://rustwasm.github.io/docs/wasm-pack/commands/build.html): generates default init + named exports.
