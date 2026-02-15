import { describe, it, expect } from "vitest";
import { emailToJson, emailToJsonString, emailJsonFilename } from "../json-export.js";

// ── Fixtures ────────────────────────────────────────────────────────────

const FULL_MESSAGE = {
  id: "gmail:abc123",
  sourceType: "gmail",
  sourceId: "abc123",
  threadKey: "gmail:thread456",
  type: "email",
  from: "Alice <alice@example.com>",
  to: "bob@example.com",
  cc: "carol@example.com",
  subject: "Hello World",
  snippet: "Hi Bob, How are you?",
  body: "Hi Bob,\n\nHow are you?\n\nBest,\nAlice",
  htmlBody: "<p>Hi Bob,</p><p>How are you?</p>",
  date: new Date("2026-02-14T12:52:00-05:00").getTime(),
  labels: ["INBOX", "UNREAD"],
  messageId: "<msg1@example.com>",
  inReplyTo: null,
  references: null,
  raw: { id: "abc123", threadId: "thread456" },
  syncedAt: 1739558000000,
};

const MINIMAL_MESSAGE = {
  id: "gmail:xyz",
  subject: "Minimal",
  date: new Date("2026-01-01T00:00:00Z").getTime(),
};

// ── emailToJson ─────────────────────────────────────────────────────────

describe("emailToJson", () => {
  it("includes all content fields", () => {
    const json = emailToJson(FULL_MESSAGE);
    expect(json.id).toBe("gmail:abc123");
    expect(json.type).toBe("email");
    expect(json.threadKey).toBe("gmail:thread456");
    expect(json.subject).toBe("Hello World");
    expect(json.from).toBe("Alice <alice@example.com>");
    expect(json.to).toBe("bob@example.com");
    expect(json.cc).toBe("carol@example.com");
    expect(json.snippet).toBe("Hi Bob, How are you?");
    expect(json.body).toContain("Hi Bob");
    expect(json.htmlBody).toContain("<p>Hi Bob,</p>");
    expect(json.labels).toEqual(["INBOX", "UNREAD"]);
    expect(json.messageId).toBe("<msg1@example.com>");
  });

  it("includes both raw timestamp and formatted date", () => {
    const json = emailToJson(FULL_MESSAGE);
    expect(typeof json.date).toBe("number");
    expect(json.dateFormatted).toBeTruthy();
    expect(json.dateFormatted).toContain("2026");
  });

  it("strips internal/sync fields", () => {
    const json = emailToJson(FULL_MESSAGE);
    expect(json).not.toHaveProperty("raw");
    expect(json).not.toHaveProperty("syncedAt");
    expect(json).not.toHaveProperty("sourceType");
    expect(json).not.toHaveProperty("sourceId");
  });

  it("handles minimal message with defaults", () => {
    const json = emailToJson(MINIMAL_MESSAGE);
    expect(json.id).toBe("gmail:xyz");
    expect(json.subject).toBe("Minimal");
    expect(json.from).toBeNull();
    expect(json.to).toBeNull();
    expect(json.cc).toBeNull();
    expect(json.body).toBeNull();
    expect(json.htmlBody).toBeNull();
    expect(json.labels).toEqual([]);
    expect(json.snippet).toBe("");
    expect(json.type).toBe("email");
    expect(json.threadKey).toBeNull();
  });

  it("handles message with no date", () => {
    const json = emailToJson({ id: "test", subject: "No date" });
    expect(json.date).toBeNull();
    expect(json.dateFormatted).toBeNull();
  });
});

// ── emailToJsonString ──────────────────────────────────────────────────

describe("emailToJsonString", () => {
  it("returns valid JSON string", () => {
    const str = emailToJsonString(FULL_MESSAGE);
    const parsed = JSON.parse(str);
    expect(parsed.subject).toBe("Hello World");
    expect(parsed.from).toBe("Alice <alice@example.com>");
  });

  it("is pretty-printed with 2-space indentation", () => {
    const str = emailToJsonString(FULL_MESSAGE);
    expect(str).toContain("\n");
    // Second line should start with 2 spaces (first property)
    const lines = str.split("\n");
    expect(lines[1]).toMatch(/^ {2}"/);
  });

  it("round-trips cleanly", () => {
    const str = emailToJsonString(FULL_MESSAGE);
    const parsed = JSON.parse(str);
    const str2 = JSON.stringify(parsed, null, 2);
    expect(str).toBe(str2);
  });
});

// ── emailJsonFilename ──────────────────────────────────────────────────

describe("emailJsonFilename", () => {
  it("generates date-prefixed .json filename", () => {
    const name = emailJsonFilename(FULL_MESSAGE);
    expect(name).toMatch(/^2026-02-14_Hello-World\.json$/);
  });

  it("strips special characters from subject", () => {
    const name = emailJsonFilename({
      subject: "Re: [URGENT] Hello/World! @#$",
      date: new Date("2026-03-01").getTime(),
    });
    expect(name).toMatch(/\.json$/);
    expect(name).not.toMatch(/[[\]\/!@#$]/);
  });

  it("truncates long subjects", () => {
    const name = emailJsonFilename({
      subject: "A".repeat(100),
      date: new Date("2026-01-01").getTime(),
    });
    // date prefix + _ + 60 chars max + .json
    expect(name.length).toBeLessThanOrEqual(10 + 1 + 60 + 5);
  });

  it("uses fallback for missing subject", () => {
    const name = emailJsonFilename({ date: new Date("2026-01-01").getTime() });
    expect(name).toContain("email");
    expect(name).toMatch(/\.json$/);
  });
});
