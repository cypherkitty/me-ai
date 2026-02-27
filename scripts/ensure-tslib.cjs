/**
 * Ensures tslib is materialised in node_modules.
 *
 * apache-arrow (a DuckDB WASM dependency) imports tslib as a bare specifier
 * but npm sometimes marks it as `ideallyInert` and skips creating the directory.
 * This postinstall script fetches it from the npm registry if missing.
 */

const fs   = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const tslibDir = path.join(__dirname, "..", "node_modules", "tslib");

if (!fs.existsSync(tslibDir) || !fs.existsSync(path.join(tslibDir, "tslib.js"))) {
  console.log("[postinstall] tslib missing from node_modules — fetching...");
  try {
    fs.mkdirSync(tslibDir, { recursive: true });
    execSync(
      "curl -sL https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz | tar -xz -C node_modules/tslib --strip-components=1",
      { cwd: path.join(__dirname, ".."), stdio: "inherit" }
    );
    console.log("[postinstall] tslib installed successfully.");
  } catch (e) {
    console.warn("[postinstall] Could not fetch tslib:", e.message);
  }
} else {
  console.log("[postinstall] tslib already present.");
}
