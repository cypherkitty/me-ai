import { describe, it, expect } from "vitest";
import { parseClassification, actionColor, tagColor } from "../triage.js";

// ── parseClassification ──────────────────────────────────────────────
// The LLM returns a freeform JSON object per email:
// {"action": "DELETE", "reason": "...", "summary": "...", "tags": ["ad", "promotion"]}

describe("parseClassification", () => {
  it("parses a full classification with all fields", () => {
    const input = JSON.stringify({
      action: "DELETE",
      reason: "Promotional email from a clothing store",
      summary: "Old Navy 30% off sale. Valid through Feb 28.",
      tags: ["ad", "promotion", "clothing"],
    });
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.action).toBe("DELETE");
    expect(result.reason).toBe("Promotional email from a clothing store");
    expect(result.summary).toBe("Old Navy 30% off sale. Valid through Feb 28.");
    expect(result.tags).toEqual(["ad", "promotion", "clothing"]);
  });

  it("accepts any UPPER_SNAKE_CASE action", () => {
    const actions = [
      "DELETE", "REPLY", "TRACK_DELIVERY", "PAY_BILL", "SCHEDULE_MEETING",
      "READ_LATER", "ARCHIVE", "UNSUBSCRIBE", "SAVE_RECEIPT", "NO_ACTION",
    ];
    for (const action of actions) {
      const input = JSON.stringify({ action, reason: "test", summary: "test", tags: [] });
      const result = parseClassification(input);
      expect(result).not.toBeNull();
      expect(result.action).toBe(action);
    }
  });

  it("normalizes lowercase action to UPPER_SNAKE_CASE", () => {
    const input = '{"action": "track delivery", "reason": "x", "summary": "y", "tags": []}';
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.action).toBe("TRACK_DELIVERY");
  });

  it("normalizes kebab-case action", () => {
    const input = '{"action": "read-later", "reason": "x", "summary": "y", "tags": []}';
    const result = parseClassification(input);
    expect(result.action).toBe("READ_LATER");
  });

  it("normalizes tags to lowercase", () => {
    const input = JSON.stringify({
      action: "DELETE",
      reason: "Spam",
      summary: "Spam email",
      tags: ["Ad", "PROMOTION", "Clothing Store"],
    });
    const result = parseClassification(input);
    expect(result.tags).toEqual(["ad", "promotion", "clothing store"]);
  });

  it("limits tags to 10", () => {
    const input = JSON.stringify({
      action: "DELETE",
      reason: "x",
      summary: "y",
      tags: Array.from({ length: 15 }, (_, i) => `tag${i}`),
    });
    const result = parseClassification(input);
    expect(result.tags).toHaveLength(10);
  });

  it("handles missing tags field", () => {
    const input = '{"action": "DELETE", "reason": "Ad", "summary": "Promo email"}';
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.tags).toEqual([]);
  });

  it("handles missing summary field", () => {
    const input = '{"action": "DELETE", "reason": "Ad"}';
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.summary).toBe("");
  });

  it("handles JSON wrapped in markdown code blocks", () => {
    const input = '```json\n{"action": "REPLY", "reason": "Question from Bob", "summary": "Bob asks about the deadline.", "tags": ["work", "urgent"]}\n```';
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.action).toBe("REPLY");
    expect(result.tags).toEqual(["work", "urgent"]);
  });

  it("handles JSON with surrounding text", () => {
    const input = 'Here is my analysis:\n\n{"action": "TRACK_DELIVERY", "reason": "Package shipped", "summary": "Amazon order shipped via UPS.", "tags": ["delivery", "amazon"]}\n\nDone.';
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.action).toBe("TRACK_DELIVERY");
  });

  it("returns null for empty response", () => {
    expect(parseClassification("")).toBeNull();
    expect(parseClassification(null)).toBeNull();
    expect(parseClassification(undefined)).toBeNull();
  });

  it("returns null for response with no JSON", () => {
    expect(parseClassification("This email is just an ad.")).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    expect(parseClassification('{"action": "DELETE", "reason": BROKEN')).toBeNull();
  });

  it("returns null for missing action field", () => {
    expect(parseClassification('{"reason": "test", "summary": "test"}')).toBeNull();
  });

  it("returns null for array instead of object", () => {
    expect(parseClassification('[{"action": "DELETE"}]')).toBeNull();
  });

  it("handles pretty-printed JSON", () => {
    const input = `{
  "action": "PAY_BILL",
  "reason": "Utility bill due next week",
  "summary": "Electric bill for $142.50 due Feb 25. Account ending 4321.",
  "tags": ["billing", "utility", "payment"]
}`;
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.action).toBe("PAY_BILL");
    expect(result.summary).toContain("$142.50");
    expect(result.tags).toContain("billing");
  });

  it("filters out empty/whitespace tags", () => {
    const input = JSON.stringify({
      action: "DELETE",
      reason: "x",
      summary: "y",
      tags: ["ad", "", "  ", "spam"],
    });
    const result = parseClassification(input);
    expect(result.tags).toEqual(["ad", "spam"]);
  });
});

// ── Color generation ─────────────────────────────────────────────────

describe("actionColor", () => {
  it("returns a valid HSL color", () => {
    const color = actionColor("DELETE");
    expect(color).toMatch(/^hsl\(\d+, 55%, 55%\)$/);
  });

  it("returns same color for same input", () => {
    expect(actionColor("DELETE")).toBe(actionColor("DELETE"));
  });

  it("returns different colors for different inputs", () => {
    expect(actionColor("DELETE")).not.toBe(actionColor("REPLY"));
  });
});

describe("tagColor", () => {
  it("returns a valid HSL color", () => {
    const color = tagColor("ad");
    expect(color).toMatch(/^hsl\(\d+, 40%, 35%\)$/);
  });

  it("returns same color for same input", () => {
    expect(tagColor("ad")).toBe(tagColor("ad"));
  });
});
