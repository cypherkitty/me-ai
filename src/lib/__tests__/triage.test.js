import { describe, it, expect } from "vitest";
import { parseTriageResponse } from "../triage.js";

// ── parseTriageResponse ──────────────────────────────────────────────
// The LLM now processes one email at a time and returns a flat array
// of action items: [{type, title, description, dueDate, priority}, ...]
// or [] if no action is needed.

describe("parseTriageResponse", () => {
  it("parses well-formed JSON array with actions", () => {
    const input = JSON.stringify([
      { type: "todo", title: "Reply to Alice", description: "About project deadline", dueDate: "2026-02-20", priority: "high" },
    ]);

    const result = parseTriageResponse(input);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("todo");
    expect(result[0].title).toBe("Reply to Alice");
    expect(result[0].priority).toBe("high");
    expect(result[0].dueDate).toBe("2026-02-20");
  });

  it("parses empty array (no action needed)", () => {
    const result = parseTriageResponse("[]");
    expect(result).toEqual([]);
  });

  it("handles JSON wrapped in markdown code blocks", () => {
    const input = '```json\n[{"type": "note", "title": "Shipping update", "description": "Package arriving Friday", "dueDate": null, "priority": "low"}]\n```';

    const result = parseTriageResponse(input);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("note");
    expect(result[0].title).toBe("Shipping update");
  });

  it("handles JSON with surrounding text", () => {
    const input = 'Here is the analysis:\n\n[{"type": "calendar", "title": "Team meeting", "description": "Monday standup", "dueDate": "2026-02-18", "priority": "medium"}]\n\nDone.';

    const result = parseTriageResponse(input);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("calendar");
    expect(result[0].dueDate).toBe("2026-02-18");
  });

  it("returns empty array for empty response", () => {
    expect(parseTriageResponse("")).toEqual([]);
    expect(parseTriageResponse(null)).toEqual([]);
    expect(parseTriageResponse(undefined)).toEqual([]);
  });

  it("returns empty array for response with no JSON", () => {
    expect(parseTriageResponse("No action needed for this email.")).toEqual([]);
    expect(parseTriageResponse("This is just a newsletter, no action required.")).toEqual([]);
  });

  it("returns empty array for malformed JSON", () => {
    expect(parseTriageResponse('[{"type": "todo", "title": BROKEN')).toEqual([]);
  });

  it("returns empty array if parsed value is not an array", () => {
    expect(parseTriageResponse('{"type": "todo", "title": "Something"}')).toEqual([]);
  });

  it("handles multiple actions from one email", () => {
    const input = JSON.stringify([
      { type: "todo", title: "Task A", description: "Do this", dueDate: null, priority: "high" },
      { type: "note", title: "Note B", description: "Remember this", dueDate: null, priority: "low" },
      { type: "calendar", title: "Meeting C", description: "Wed 3pm", dueDate: "2026-03-05", priority: "medium" },
    ]);

    const result = parseTriageResponse(input);
    expect(result).toHaveLength(3);
    expect(result[0].type).toBe("todo");
    expect(result[1].type).toBe("note");
    expect(result[2].type).toBe("calendar");
  });

  it("handles code block without language tag", () => {
    const input = '```\n[{"type": "todo", "title": "Follow up", "description": "", "dueDate": null, "priority": "medium"}]\n```';
    const result = parseTriageResponse(input);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Follow up");
  });

  it("handles pretty-printed JSON", () => {
    const input = `[
  {
    "type": "todo",
    "title": "Pay invoice",
    "description": "Invoice #1234 due",
    "dueDate": "2026-02-28",
    "priority": "high"
  }
]`;

    const result = parseTriageResponse(input);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Pay invoice");
    expect(result[0].dueDate).toBe("2026-02-28");
  });
});
