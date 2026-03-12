/**
 * Ensures me-ai-core is present in node_modules (built pkg copied from me-ai-core/pkg).
 * Run from me-ai-web. Uses Task from repo root so core is built and copied.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const webDir = path.join(__dirname, "..");
const repoRoot = path.join(webDir, "..");
const corePkg = path.join(repoRoot, "me-ai-core", "pkg");
const targetDir = path.join(webDir, "node_modules", "me-ai-core");
const marker = path.join(targetDir, "me_ai_core.js");

if (!fs.existsSync(marker)) {
  console.log("[postinstall] me-ai-core missing from node_modules — building and copying...");
  try {
    execSync("task build:core copy:core", { cwd: repoRoot, stdio: "inherit" });
    console.log("[postinstall] me-ai-core ready in node_modules.");
  } catch (e) {
    console.warn("[postinstall] Could not build/copy me-ai-core. Run from repo root: task install");
  }
}
