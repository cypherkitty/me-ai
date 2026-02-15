import { describe, it, expect } from "vitest";
import { emailToJson, emailToJsonString, emailJsonFilename } from "../json-export.js";

// ── Fixtures ────────────────────────────────────────────────────────────

/** Simulates a stored message with the raw Gmail API response */
const GMAIL_RAW = {
  id: "abc123",
  threadId: "thread456",
  labelIds: ["INBOX", "UNREAD"],
  snippet: "Hi Bob, How are you?",
  internalDate: "1739558000000",
  payload: {
    headers: [
      { name: "From", value: "Alice <alice@example.com>" },
      { name: "To", value: "bob@example.com" },
      { name: "Subject", value: "Hello World" },
      { name: "Date", value: "Fri, 14 Feb 2026 12:52:00 -0500" },
    ],
    mimeType: "text/plain",
    body: { data: "SGkgQm9i" },
  },
};

const FULL_MESSAGE = {
  id: "gmail:abc123",
  sourceType: "gmail",
  sourceId: "abc123",
  threadKey: "gmail:thread456",
  type: "email",
  from: "Alice <alice@example.com>",
  to: "bob@example.com",
  subject: "Hello World",
  date: new Date("2026-02-14T12:52:00-05:00").getTime(),
  labels: ["INBOX", "UNREAD"],
  raw: GMAIL_RAW,
  syncedAt: 1739558000000,
};

const MESSAGE_NO_RAW = {
  id: "gmail:xyz",
  subject: "No raw data",
  date: new Date("2026-01-01T00:00:00Z").getTime(),
};

// ── emailToJson ─────────────────────────────────────────────────────────

describe("emailToJson", () => {
  it("returns the exact raw Gmail API response", () => {
    const json = emailToJson(FULL_MESSAGE);
    expect(json).toBe(GMAIL_RAW);
  });

  it("preserves all Gmail API fields", () => {
    const json = emailToJson(FULL_MESSAGE);
    expect(json.id).toBe("abc123");
    expect(json.threadId).toBe("thread456");
    expect(json.labelIds).toEqual(["INBOX", "UNREAD"]);
    expect(json.snippet).toBe("Hi Bob, How are you?");
    expect(json.payload.headers).toHaveLength(4);
    expect(json.payload.mimeType).toBe("text/plain");
  });

  it("does not include our normalized fields", () => {
    const json = emailToJson(FULL_MESSAGE);
    expect(json).not.toHaveProperty("sourceType");
    expect(json).not.toHaveProperty("syncedAt");
    expect(json).not.toHaveProperty("threadKey");
    expect(json).not.toHaveProperty("type");
  });

  it("returns null when raw field is missing", () => {
    const json = emailToJson(MESSAGE_NO_RAW);
    expect(json).toBeNull();
  });
});

// ── emailToJsonString ──────────────────────────────────────────────────

describe("emailToJsonString", () => {
  it("returns valid JSON matching the raw Gmail response", () => {
    const str = emailToJsonString(FULL_MESSAGE);
    const parsed = JSON.parse(str);
    expect(parsed.id).toBe("abc123");
    expect(parsed.threadId).toBe("thread456");
    expect(parsed.payload.headers[0].name).toBe("From");
  });

  it("is pretty-printed with 2-space indentation", () => {
    const str = emailToJsonString(FULL_MESSAGE);
    expect(str).toContain("\n");
    const lines = str.split("\n");
    expect(lines[1]).toMatch(/^ {2}"/);
  });

  it("round-trips cleanly", () => {
    const str = emailToJsonString(FULL_MESSAGE);
    const parsed = JSON.parse(str);
    const str2 = JSON.stringify(parsed, null, 2);
    expect(str).toBe(str2);
  });

  it("returns 'null' when raw is missing", () => {
    const str = emailToJsonString(MESSAGE_NO_RAW);
    expect(str).toBe("null");
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
    expect(name.length).toBeLessThanOrEqual(10 + 1 + 60 + 5);
  });

  it("uses fallback for missing subject", () => {
    const name = emailJsonFilename({ date: new Date("2026-01-01").getTime() });
    expect(name).toContain("email");
    expect(name).toMatch(/\.json$/);
  });
});
