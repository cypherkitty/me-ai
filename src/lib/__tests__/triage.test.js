import { describe, it, expect } from "vitest";
import { parseClassification, VALID_ACTIONS } from "../triage.js";

// ── parseClassification ──────────────────────────────────────────────
// The LLM returns a single JSON object per email:
// {"action": "DELETE", "reason": "Promotional email"}

describe("parseClassification", () => {
  it("parses well-formed DELETE classification", () => {
    const input = '{"action": "DELETE", "reason": "Promotional email from a store"}';
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.action).toBe("DELETE");
    expect(result.reason).toBe("Promotional email from a store");
  });

  it("parses NOTIFY classification", () => {
    const input = '{"action": "NOTIFY", "reason": "Package has been delivered"}';
    const result = parseClassification(input);
    expect(result.action).toBe("NOTIFY");
  });

  it("parses READ_SUMMARIZE classification", () => {
    const input = '{"action": "READ_SUMMARIZE", "reason": "Weekly Rust newsletter with updates"}';
    const result = parseClassification(input);
    expect(result.action).toBe("READ_SUMMARIZE");
  });

  it("parses REPLY_NEEDED classification", () => {
    const input = '{"action": "REPLY_NEEDED", "reason": "Colleague asking about project status"}';
    const result = parseClassification(input);
    expect(result.action).toBe("REPLY_NEEDED");
  });

  it("parses REVIEW classification", () => {
    const input = '{"action": "REVIEW", "reason": "Billing change notification"}';
    const result = parseClassification(input);
    expect(result.action).toBe("REVIEW");
  });

  it("parses NO_ACTION classification", () => {
    const input = '{"action": "NO_ACTION", "reason": "Automated order confirmation"}';
    const result = parseClassification(input);
    expect(result.action).toBe("NO_ACTION");
  });

  it("handles JSON wrapped in markdown code blocks", () => {
    const input = '```json\n{"action": "DELETE", "reason": "Spam"}\n```';
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.action).toBe("DELETE");
  });

  it("handles JSON with surrounding text", () => {
    const input = 'Here is my classification:\n\n{"action": "NOTIFY", "reason": "Delivery update"}\n\nDone.';
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.action).toBe("NOTIFY");
  });

  it("normalizes lowercase action to uppercase", () => {
    const input = '{"action": "delete", "reason": "Ad"}';
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.action).toBe("DELETE");
  });

  it("returns null for empty response", () => {
    expect(parseClassification("")).toBeNull();
    expect(parseClassification(null)).toBeNull();
    expect(parseClassification(undefined)).toBeNull();
  });

  it("returns null for response with no JSON", () => {
    expect(parseClassification("This email is just an ad.")).toBeNull();
    expect(parseClassification("No action needed.")).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    expect(parseClassification('{"action": "DELETE", "reason": BROKEN')).toBeNull();
  });

  it("returns null for unknown action type", () => {
    expect(parseClassification('{"action": "SOMETHING_ELSE", "reason": "test"}')).toBeNull();
  });

  it("returns null for array instead of object", () => {
    expect(parseClassification('[{"action": "DELETE"}]')).toBeNull();
  });

  it("handles missing reason field", () => {
    const input = '{"action": "DELETE"}';
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.action).toBe("DELETE");
    expect(result.reason).toBe("");
  });

  it("handles pretty-printed JSON", () => {
    const input = `{
  "action": "READ_SUMMARIZE",
  "reason": "Tech newsletter with useful articles"
}`;
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.action).toBe("READ_SUMMARIZE");
    expect(result.reason).toBe("Tech newsletter with useful articles");
  });

  it("handles code block without language tag", () => {
    const input = '```\n{"action": "NO_ACTION", "reason": "Confirmation email"}\n```';
    const result = parseClassification(input);
    expect(result).not.toBeNull();
    expect(result.action).toBe("NO_ACTION");
  });

  it("validates all known action types", () => {
    for (const action of VALID_ACTIONS) {
      const input = JSON.stringify({ action, reason: "test" });
      const result = parseClassification(input);
      expect(result).not.toBeNull();
      expect(result.action).toBe(action);
    }
  });
});
