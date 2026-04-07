import { describe, it, expect, vi } from "vitest";
import { emailToMarkdown, emailFilename } from "../markdown-export.js";
import type { MessageForMarkdown } from "../markdown-export.js";

const mockExportFilename = (subject: string, dateMs: number, ext: string): string => {
  const slugify = (s: string) => {
    const src = s || "email";
    const slug = src
      .split("")
      .map((c: string) => (/[a-zA-Z0-9_-]/.test(c) ? c : c === " " ? "-" : ""))
      .join("")
      .slice(0, 60)
      .replace(/-+$/, "");
    return slug || "email";
  };
  const shortDate = (ms: number) => {
    if (!ms || ms <= 0 || !isFinite(ms)) return "email";
    const d = new Date(ms);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  return `${shortDate(dateMs)}_${slugify(subject)}.${ext}`;
};

vi.mock("../store/core-store.js", () => ({
  getCore: () => ({ exportFilename: mockExportFilename }),
  coreStore: { subscribe: vi.fn(), set: vi.fn(), update: vi.fn() },
}));

const BASIC_MESSAGE: MessageForMarkdown = {
  subject: "Hello World",
  from: "Alice <alice@example.com>",
  to: "bob@example.com",
  date: "Wed, 14 Feb 2026 12:52:00 -0500",
  body: "Hi Bob,\n\nHow are you?\n\nBest,\nAlice",
};

const AMAZON_MESSAGE: MessageForMarkdown = {
  subject: "Elon Musk, will you rate your transaction at Amazon.com?",
  from: "Amazon Marketplace <marketplace-messages@amazon.com>",
  to: "elon@spacex.com",
  date: "Sat, 14 Feb 2026 12:52:00 +0000",
  body: "Dear Elon Musk,\nWill you share your experience?",
};

describe("emailToMarkdown", () => {
  it("starts with the subject as an H1 heading", () => {
    const md = emailToMarkdown(BASIC_MESSAGE);
    const firstLine = md.split("\n")[0];
    expect(firstLine).toBe("# Hello World");
  });

  it("contains a markdown metadata table", () => {
    const md = emailToMarkdown(BASIC_MESSAGE);
    expect(md).toContain("| | |");
    expect(md).toContain("|---|---|");
    expect(md).toContain("| **From** |");
    expect(md).toContain("| **To** |");
    expect(md).toContain("| **Date** |");
  });

  it("includes sender and recipient in the table", () => {
    const md = emailToMarkdown(BASIC_MESSAGE);
    expect(md).toContain("Alice <alice@example.com>");
    expect(md).toContain("bob@example.com");
  });

  it("includes a horizontal rule separator before the body", () => {
    const md = emailToMarkdown(BASIC_MESSAGE);
    expect(md).toContain("\n---\n");
  });

  it("includes the full message body", () => {
    const md = emailToMarkdown(BASIC_MESSAGE);
    expect(md).toContain("Hi Bob,\n\nHow are you?\n\nBest,\nAlice");
  });

  it("shows placeholder when body is null", () => {
    const msg = { ...BASIC_MESSAGE, body: null };
    const md = emailToMarkdown(msg);
    expect(md).toContain("*(no body)*");
  });

  it("shows placeholder when body is empty string", () => {
    const msg = { ...BASIC_MESSAGE, body: "" };
    const md = emailToMarkdown(msg);
    expect(md).toContain("*(no body)*");
  });

  it("escapes pipe characters in From/To fields", () => {
    const msg = {
      ...BASIC_MESSAGE,
      from: "Foo | Bar <foo@example.com>",
      to: "baz|qux@example.com",
    };
    const md = emailToMarkdown(msg);
    expect(md).toContain("Foo \\| Bar <foo@example.com>");
    expect(md).toContain("baz\\|qux@example.com");
    expect(md).not.toMatch(/\| Foo \| Bar/);
  });

  it("ends with a trailing newline", () => {
    const md = emailToMarkdown(BASIC_MESSAGE);
    expect(md.endsWith("\n")).toBe(true);
  });

  it("produces valid markdown structure for a real-world email", () => {
    const md = emailToMarkdown(AMAZON_MESSAGE);
    const lines = md.split("\n");
    expect(lines[0]).toBe("# Elon Musk, will you rate your transaction at Amazon.com?");
    expect(lines[1]).toBe("");
    expect(lines[2]).toBe("| | |");
    expect(lines[3]).toBe("|---|---|");
    expect(lines[4]).toMatch(/^\| \*\*From\*\* \| .+ \|$/);
    expect(lines[5]).toMatch(/^\| \*\*To\*\* \| .+ \|$/);
    expect(lines[6]).toMatch(/^\| \*\*Date\*\* \| .+ \|$/);
    expect(lines[7]).toBe("");
    expect(lines[8]).toBe("---");
    expect(lines[9]).toBe("");
    expect(lines[10]).toBe("Dear Elon Musk,");
  });
});

describe("emailFilename", () => {
  it("produces a .md file", () => {
    const name = emailFilename(BASIC_MESSAGE);
    expect(name.endsWith(".md")).toBe(true);
  });

  it("starts with a YYYY-MM-DD date prefix", () => {
    const name = emailFilename(BASIC_MESSAGE);
    expect(name).toMatch(/^\d{4}-\d{2}-\d{2}_/);
  });

  it("includes a slug derived from the subject", () => {
    const name = emailFilename(BASIC_MESSAGE);
    expect(name).toContain("Hello-World");
  });

  it("strips special characters from the subject", () => {
    const name = emailFilename(AMAZON_MESSAGE);
    expect(name).not.toContain("?");
    expect(name).not.toContain(",");
  });

  it("truncates long subjects to 60 characters in the slug", () => {
    const msg = {
      ...BASIC_MESSAGE,
      subject: "A".repeat(100),
    };
    const name = emailFilename(msg);
    expect(name.length).toBeLessThanOrEqual(74);
  });

  it("falls back to 'email' for invalid dates", () => {
    const msg = { ...BASIC_MESSAGE, date: "not-a-date" };
    const name = emailFilename(msg);
    expect(name.endsWith(".md")).toBe(true);
  });

  it("uses 'email' as slug when subject is empty", () => {
    const msg = { ...BASIC_MESSAGE, subject: "" };
    const name = emailFilename(msg);
    expect(name).toContain("email");
  });

  it("replaces spaces with hyphens", () => {
    const name = emailFilename(BASIC_MESSAGE);
    expect(name).not.toMatch(/ /);
    expect(name).toContain("Hello-World");
  });
});
