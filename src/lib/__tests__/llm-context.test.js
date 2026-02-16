import { describe, it, expect } from "vitest";
import * as llmContext from "../llm-context.js";

// ── API surface ──────────────────────────────────────────────────────
// These tests guard against accidentally re-introducing heavy context
// functions that load all emails into the LLM prompt on every message.
// See: https://github.com/cypherkitty/me-ai/pull/28

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

// ── Source-level guards ──────────────────────────────────────────────
// These tests read the source code of key modules to catch patterns
// that cause full table scans on every chat message.

describe("no full table scans in lightweight context path", () => {
  it("buildLLMContext source must not call toArray()", async () => {
    const src = await importSource("../llm-context.js");
    // buildLLMContext itself should not contain toArray
    expect(src).not.toMatch(/buildLLMContext[\s\S]*?toArray/);
  });

  it("getDataSummary source must not call toArray()", async () => {
    const src = await importSource("../store/query-layer.js");
    // Extract getDataSummary function body (from export to next export/function)
    const fnMatch = src.match(
      /export async function getDataSummary\b[\s\S]*?(?=\nexport |\nfunction |\nasync function )/
    );
    expect(fnMatch).not.toBeNull();
    const fnBody = fnMatch[0];
    expect(fnBody).not.toContain(".toArray()");
  });

  it("getDetailedSummary source must not call toArray()", async () => {
    const src = await importSource("../store/query-layer.js");
    const fnMatch = src.match(
      /export async function getDetailedSummary\b[\s\S]*?(?=\nexport |\nfunction |\nasync function )/
    );
    expect(fnMatch).not.toBeNull();
    const fnBody = fnMatch[0];
    expect(fnBody).not.toContain(".toArray()");
  });

  it("query-layer must not export getTopSenders", async () => {
    const src = await importSource("../store/query-layer.js");
    expect(src).not.toMatch(/export\s+.*getTopSenders/);
  });
});

// ── Helper ───────────────────────────────────────────────────────────

/** Read module source as a string (works in vitest with import.meta) */
async function importSource(relativePath) {
  const url = new URL(relativePath, import.meta.url);
  const fs = await import("node:fs/promises");
  return fs.readFile(url, "utf-8");
}
