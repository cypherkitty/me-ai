import { describe, it, expect } from "vitest";
import { parseTriageResponse } from "../triage.js";

// ── parseTriageResponse ──────────────────────────────────────────────

describe("parseTriageResponse", () => {
  it("parses well-formed JSON array", () => {
    const input = JSON.stringify([
      {
        emailIndex: 0,
        actions: [
          { type: "todo", title: "Reply to Alice", description: "About project deadline", dueDate: "2026-02-20", priority: "high" },
        ],
      },
      { emailIndex: 1, actions: [] },
    ]);

    const result = parseTriageResponse(input);
    expect(result).toHaveLength(2);
    expect(result[0].emailIndex).toBe(0);
    expect(result[0].actions).toHaveLength(1);
    expect(result[0].actions[0].type).toBe("todo");
    expect(result[0].actions[0].title).toBe("Reply to Alice");
    expect(result[1].actions).toHaveLength(0);
  });

  it("handles JSON wrapped in markdown code blocks", () => {
    const input = '```json\n[{"emailIndex": 0, "actions": [{"type": "note", "title": "Shipping update", "description": "Package arriving Friday", "dueDate": null, "priority": "low"}]}]\n```';

    const result = parseTriageResponse(input);
    expect(result).toHaveLength(1);
    expect(result[0].actions[0].type).toBe("note");
    expect(result[0].actions[0].title).toBe("Shipping update");
  });

  it("handles JSON with surrounding text", () => {
    const input = 'Here is the analysis:\n\n[{"emailIndex": 0, "actions": [{"type": "calendar", "title": "Team meeting", "description": "Monday standup", "dueDate": "2026-02-18", "priority": "medium"}]}]\n\nDone.';

    const result = parseTriageResponse(input);
    expect(result).toHaveLength(1);
    expect(result[0].actions[0].type).toBe("calendar");
  });

  it("returns empty array for empty response", () => {
    expect(parseTriageResponse("")).toEqual([]);
    expect(parseTriageResponse(null)).toEqual([]);
    expect(parseTriageResponse(undefined)).toEqual([]);
  });

  it("returns empty array for response with no JSON", () => {
    expect(parseTriageResponse("No actionable emails found.")).toEqual([]);
    expect(parseTriageResponse("I analyzed all 5 emails and none require action.")).toEqual([]);
  });

  it("returns empty array for malformed JSON", () => {
    expect(parseTriageResponse('[{"emailIndex": 0, "actions": [BROKEN')).toEqual([]);
  });

  it("returns empty array if parsed value is not an array", () => {
    expect(parseTriageResponse('{"emailIndex": 0}')).toEqual([]);
  });

  it("handles multiple emails with mixed actions", () => {
    const input = JSON.stringify([
      { emailIndex: 0, actions: [] },
      {
        emailIndex: 1,
        actions: [
          { type: "todo", title: "Task A", description: "", dueDate: null, priority: "high" },
          { type: "note", title: "Note B", description: "Info", dueDate: null, priority: "low" },
        ],
      },
      { emailIndex: 2, actions: [{ type: "calendar", title: "Meeting", description: "Wed 3pm", dueDate: "2026-03-05", priority: "medium" }] },
    ]);

    const result = parseTriageResponse(input);
    expect(result).toHaveLength(3);
    expect(result[0].actions).toHaveLength(0);
    expect(result[1].actions).toHaveLength(2);
    expect(result[2].actions).toHaveLength(1);
  });

  it("handles code block without language tag", () => {
    const input = '```\n[{"emailIndex": 0, "actions": []}]\n```';
    const result = parseTriageResponse(input);
    expect(result).toHaveLength(1);
  });

  it("handles pretty-printed JSON", () => {
    const input = `[
  {
    "emailIndex": 0,
    "actions": [
      {
        "type": "todo",
        "title": "Pay invoice",
        "description": "Invoice #1234 due",
        "dueDate": "2026-02-28",
        "priority": "high"
      }
    ]
  }
]`;

    const result = parseTriageResponse(input);
    expect(result).toHaveLength(1);
    expect(result[0].actions[0].title).toBe("Pay invoice");
    expect(result[0].actions[0].dueDate).toBe("2026-02-28");
  });
});
