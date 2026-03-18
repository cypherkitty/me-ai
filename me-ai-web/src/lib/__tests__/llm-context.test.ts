import { describe, it, expect } from "vitest";
import { initCore, getCore } from "../store/core-store.js";

describe("llm-context core exports", () => {
  it("initCore is exported from core-store", () => {
    expect(typeof initCore).toBe("function");
  });

  it("getCore is exported from core-store", () => {
    expect(typeof getCore).toBe("function");
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
