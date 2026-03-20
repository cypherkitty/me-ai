import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/**/*.svelte"],
  project: ["src/**/*.{ts,svelte}"],
  ignoreDependencies: ["tslib"],
  ignoreBinaries: ["wasm-pack"],
  ignoreExportsUsedInFile: true,
};

export default config;
