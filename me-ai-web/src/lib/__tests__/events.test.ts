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

  it("CRITICAL is NOT auto-execute, requires approval", () => {
    expect(EVENT_CATEGORY_TIERS.CRITICAL.autoExecute).toBe(false);
    expect(EVENT_CATEGORY_TIERS.CRITICAL.requiresApproval).toBe(true);
  });
});

describe("EVENT_CATEGORIES", () => {
  it("noise and info have auto policy", () => {
    expect(EVENT_CATEGORIES.noise.policy).toBe("auto");
    expect(EVENT_CATEGORIES.info.policy).toBe("auto");
  });

  it("critical has manual policy", () => {
    expect(EVENT_CATEGORIES.critical.policy).toBe("manual");
  });

  it("each category has the expected name", () => {
    expect(EVENT_CATEGORIES.noise.name).toBe("noise");
    expect(EVENT_CATEGORIES.info.name).toBe("info");
    expect(EVENT_CATEGORIES.critical.name).toBe("critical");
  });
});

describe("getCategoryForEventType", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns CRITICAL (default) for unknown event type", async () => {
    expect(await getCategoryForEventType("UNKNOWN_TYPE")).toBe("CRITICAL");
  });

  it("returns stored category for known event type", async () => {
    localStorage.setItem("me-ai-event-categories", JSON.stringify({ DELETE: "NOISE" }));
    expect(await getCategoryForEventType("DELETE")).toBe("NOISE");
  });

  it("normalizes INFORMATIONAL to INFO", async () => {
    localStorage.setItem("me-ai-event-categories", JSON.stringify({ ARCHIVE: "INFORMATIONAL" }));
    expect(await getCategoryForEventType("ARCHIVE")).toBe("INFO");
  });

  it("normalizes URGENT to CRITICAL", async () => {
    localStorage.setItem("me-ai-event-categories", JSON.stringify({ MEETING: "URGENT" }));
    expect(await getCategoryForEventType("MEETING")).toBe("CRITICAL");
  });

  it("normalizes IMPORTANT to CRITICAL", async () => {
    localStorage.setItem("me-ai-event-categories", JSON.stringify({ BILL: "IMPORTANT" }));
    expect(await getCategoryForEventType("BILL")).toBe("CRITICAL");
  });
});

describe("seedEventTypeFromLLM", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockCore.upsertEventType.mockResolvedValue(undefined);
  });

  it("stores NOISE tier for 'noise' category", async () => {
    await seedEventTypeFromLLM("newsletter", "noise");
    const map = JSON.parse(localStorage.getItem("me-ai-event-categories") ?? "{}");
    expect(map["NEWSLETTER"]).toBe("NOISE");
  });

  it("stores INFO tier for 'info' category", async () => {
    await seedEventTypeFromLLM("invoice", "info");
    const map = JSON.parse(localStorage.getItem("me-ai-event-categories") ?? "{}");
    expect(map["INVOICE"]).toBe("INFO");
  });

  it("stores CRITICAL tier for 'critical' category", async () => {
    await seedEventTypeFromLLM("security_alert", "critical");
    const map = JSON.parse(localStorage.getItem("me-ai-event-categories") ?? "{}");
    expect(map["SECURITY_ALERT"]).toBe("CRITICAL");
  });

  it("normalizes 'informational' to INFO", async () => {
    await seedEventTypeFromLLM("report", "informational");
    const map = JSON.parse(localStorage.getItem("me-ai-event-categories") ?? "{}");
    expect(map["REPORT"]).toBe("INFO");
  });

  it("normalizes 'important' to CRITICAL", async () => {
    await seedEventTypeFromLLM("bill", "important");
    const map = JSON.parse(localStorage.getItem("me-ai-event-categories") ?? "{}");
    expect(map["BILL"]).toBe("CRITICAL");
  });

  it("normalizes event type name to UPPER_SNAKE_CASE", async () => {
    await seedEventTypeFromLLM("track delivery", "noise");
    const map = JSON.parse(localStorage.getItem("me-ai-event-categories") ?? "{}");
    expect(map["TRACK_DELIVERY"]).toBe("NOISE");
  });

  it("does not overwrite an existing event type category", async () => {
    await seedEventTypeFromLLM("DELETE", "noise");
    await seedEventTypeFromLLM("DELETE", "critical");
    const map = JSON.parse(localStorage.getItem("me-ai-event-categories") ?? "{}");
    expect(map["DELETE"]).toBe("NOISE");
  });

  it("calls core.upsertEventType with correct arguments", async () => {
    await seedEventTypeFromLLM("NEWSLETTER", "noise");
    expect(mockCore.upsertEventType).toHaveBeenCalledWith(
      "NEWSLETTER",
      "NEWSLETTER",
      "noise",
      true
    );
  });

  it("does not throw if core.upsertEventType fails", async () => {
    mockCore.upsertEventType.mockRejectedValueOnce(new Error("DB error"));
    await expect(seedEventTypeFromLLM("TEST", "noise")).resolves.toBeUndefined();
  });

  it("ignores empty event type string", async () => {
    await seedEventTypeFromLLM("", "noise");
    expect(mockCore.upsertEventType).not.toHaveBeenCalled();
  });
});

describe("getActionsForEvent", () => {
  beforeEach(() => {
    localStorage.clear();
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

  it("prefers user-defined actions over resolved pipeline", async () => {
    const userActions = [
      { id: "custom_1", pluginId: "gmail", commandId: "archive", name: "Archive", description: "" },
    ];
    localStorage.setItem("me-ai-events", JSON.stringify({ DELETE: userActions }));

    const result = await getActionsForEvent("DELETE");
    expect(result).toEqual(userActions);
    expect(mockCore.getPipelineForEventResolved).not.toHaveBeenCalled();
  });

  it("falls back to pipeline when user map has empty array for type", async () => {
    localStorage.setItem("me-ai-events", JSON.stringify({ DELETE: [] }));
    mockCore.getPipelineForEventResolved.mockResolvedValue({
      actions: [{ pluginId: "gmail", commandId: "trash", order: 0 }],
    });
    const result = await getActionsForEvent("DELETE");
    expect(result).toHaveLength(1);
    expect(result[0].commandId).toBe("trash");
  });
});
