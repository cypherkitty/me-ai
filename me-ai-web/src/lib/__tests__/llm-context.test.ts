import { describe, it, expect } from "vitest";
import * as llmContext from "../llm-context.js";

describe("llm-context exports", () => {
  it("exports buildLLMContext", () => {
    expect(typeof llmContext.buildLLMContext).toBe("function");
  });

  it("exports buildEmailContext", () => {
    expect(typeof llmContext.buildEmailContext).toBe("function");
  });

  it("must NOT export buildPendingActionsContext", () => {
    expect(llmContext).not.toHaveProperty("buildPendingActionsContext");
  });

  it("must NOT export any function with 'pending' in the name", () => {
    const pendingExports = Object.keys(llmContext).filter((k) =>
      /pending/i.test(k)
    );
    expect(pendingExports).toEqual([]);
  });
});

describe("no full table scans in lightweight context path", () => {
  it("buildLLMContext source must not call toArray()", async () => {
    const src = await importSource("../llm-context.ts");
    expect(src).not.toMatch(/buildLLMContext[\s\S]*?toArray/);
  });

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
