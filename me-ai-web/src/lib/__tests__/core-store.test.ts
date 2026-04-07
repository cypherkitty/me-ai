import { describe, it, expect, vi } from "vitest";

// Mock me-ai-core WASM before importing the store
vi.mock("me-ai-core", () => ({
  default: vi.fn().mockResolvedValue(undefined),
  MeAiCore: vi.fn().mockImplementation(() => ({
    createSchemaAndMigrations: vi.fn().mockResolvedValue(undefined),
  })),
}));

import { getCore, coreStore } from "../store/core-store.js";

describe("getCore", () => {
  it("throws when core is null and init has not been attempted", () => {
    coreStore.set({ core: null, initFailed: false });
    expect(() => getCore()).toThrow("Core not initialized. Call initCore() first.");
  });

  it("throws a distinct message when init previously failed", () => {
    coreStore.set({ core: null, initFailed: true });
    expect(() => getCore()).toThrow("Core init failed previously.");
  });

  it("returns core when initialized", () => {
    const fakeCore = { getEventTypes: vi.fn() } as unknown as ReturnType<typeof getCore>;
    coreStore.set({ core: fakeCore, initFailed: false });
    expect(getCore()).toBe(fakeCore);
  });
});
