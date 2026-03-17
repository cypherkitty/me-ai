import { describe, it, expect } from "vitest";
import * as core from "../core.js";

describe("llm-context core exports", () => {
  it("exports buildLlmContext", () => {
    expect(typeof core.buildLlmContext).toBe("function");
  });

  it("exports buildEmailContext", () => {
    expect(typeof core.buildEmailContext).toBe("function");
  });
});

describe("no full table scans in lightweight context path", () => {
  it("query-layer must not export getTopSenders", async () => {
    const src = await importSource("../store/query-layer.ts");
    expect(src).not.toMatch(/export\s+.*getTopSenders/);
  });
});

async function importSource(relativePath: string): Promise<string> {
  const url = new URL(relativePath, import.meta.url);
  const fs = await import("node:fs/promises");
  return fs.readFile(url, "utf-8");
}
