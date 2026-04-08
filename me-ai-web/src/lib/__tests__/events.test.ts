// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  EVENT_CATEGORY_TIERS,
  EVENT_CATEGORIES,
  getCategoryForEventType,
  seedEventTypeFromLLM,
  getActionsForEvent,
} from "../core.js";

const mockCore = {
  categoryTierToName: (tier: string) => tier.toLowerCase(),
  getEmailClassifications: vi.fn().mockResolvedValue([]),
  getPipelineForEventResolved: vi.fn().mockResolvedValue(null),
  upsertEventType: vi.fn().mockResolvedValue(undefined),
  getCategoryForEventType: vi.fn().mockResolvedValue("CRITICAL"),
  seedEventTypeFromLLM: vi.fn().mockResolvedValue(undefined),
  getAllEventTypes: vi.fn().mockResolvedValue([]),
};

vi.mock("../store/core-store.js", () => ({
  getCore: () => mockCore,
  coreStore: { subscribe: vi.fn(), set: vi.fn(), update: vi.fn() },
}));

describe("EVENT_CATEGORY_TIERS", () => {
  it("defines NOISE, INFO, CRITICAL tiers", () => {
    expect(EVENT_CATEGORY_TIERS.NOISE).toBeDefined();
    expect(EVENT_CATEGORY_TIERS.INFO).toBeDefined();
    expect(EVENT_CATEGORY_TIERS.CRITICAL).toBeDefined();
  });

  it("NOISE is auto-execute, no approval required", () => {
    expect(EVENT_CATEGORY_TIERS.NOISE.autoExecute).toBe(true);
    expect(EVENT_CATEGORY_TIERS.NOISE.requiresApproval).toBe(false);
  });

  it("INFO is auto-execute, no approval required", () => {
    expect(EVENT_CATEGORY_TIERS.INFO.autoExecute).toBe(true);
    expect(EVENT_CATEGORY_TIERS.INFO.requiresApproval).toBe(false);
  });

  it("CRITICAL requires approval, no auto-execute", () => {
    expect(EVENT_CATEGORY_TIERS.CRITICAL.autoExecute).toBe(false);
    expect(EVENT_CATEGORY_TIERS.CRITICAL.requiresApproval).toBe(true);
  });
});

describe("EVENT_CATEGORIES", () => {
  it("defines noise, info, critical categories", () => {
    expect(EVENT_CATEGORIES.noise).toBeDefined();
    expect(EVENT_CATEGORIES.info).toBeDefined();
    expect(EVENT_CATEGORIES.critical).toBeDefined();
  });

  it("each category has the expected name", () => {
    expect(EVENT_CATEGORIES.noise.name).toBe("noise");
    expect(EVENT_CATEGORIES.info.name).toBe("info");
    expect(EVENT_CATEGORIES.critical.name).toBe("critical");
  });
});

describe("getCategoryForEventType", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns CRITICAL (default) for unknown event type", async () => {
    mockCore.getCategoryForEventType.mockResolvedValue("CRITICAL");
    expect(await getCategoryForEventType("UNKNOWN_TYPE")).toBe("CRITICAL");
  });

  it("returns stored category from Rust core", async () => {
    mockCore.getCategoryForEventType.mockResolvedValue("NOISE");
    expect(await getCategoryForEventType("DELETE")).toBe("NOISE");
  });
});

describe("seedEventTypeFromLLM", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCore.seedEventTypeFromLLM.mockResolvedValue(undefined);
  });

  it("delegates to core.seedEventTypeFromLLM", async () => {
    await seedEventTypeFromLLM("newsletter", "noise");
    expect(mockCore.seedEventTypeFromLLM).toHaveBeenCalledWith("newsletter", "noise");
  });

  it("does not throw if core method fails", async () => {
    mockCore.seedEventTypeFromLLM.mockRejectedValueOnce(new Error("DB error"));
    await expect(seedEventTypeFromLLM("TEST", "noise")).rejects.toThrow("DB error");
  });
});

describe("getActionsForEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCore.getPipelineForEventResolved.mockResolvedValue(null);
  });

  it("returns empty array for unknown event type with no pipeline", async () => {
    expect(await getActionsForEvent("UNKNOWN")).toEqual([]);
  });

  it("returns empty array for empty event type string", async () => {
    expect(await getActionsForEvent("")).toEqual([]);
  });

  it("maps resolved pipeline actions to Action objects", async () => {
    mockCore.getPipelineForEventResolved.mockResolvedValue({
      actions: [
        { pluginId: "gmail", commandId: "trash", order: 0 },
        { pluginId: "gmail", commandId: "mark_read", order: 1 },
      ],
    });
    const result = await getActionsForEvent("DELETE");
    expect(result).toHaveLength(2);
    expect(result[0].pluginId).toBe("gmail");
    expect(result[0].commandId).toBe("trash");
    expect(result[1].commandId).toBe("mark_read");
  });
});
