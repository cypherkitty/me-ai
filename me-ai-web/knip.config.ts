import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/**/*.svelte"],
  project: ["src/**/*.{ts,svelte}"],
  ignoreDependencies: ["me-ai-core", "tslib"],
  ignoreBinaries: ["wasm-pack"],
  ignoreExportsUsedInFile: true,
};

export default config;
