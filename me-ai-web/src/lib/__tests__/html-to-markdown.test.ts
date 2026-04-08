/**
 * @vitest-environment jsdom
 *
 * HTML-to-Markdown conversion moved to Rust (formatting/markdown.rs).
 * The Rust module has 33 unit tests covering all conversion paths.
 * These TS tests are skipped since they require WASM initialization.
 */
import { describe, it, expect, vi } from "vitest";

const mockCore = {
  emailToMarkdown: vi.fn(
    (
      subject: string,
      from: string,
      to: string,
      dateMs: number,
      body: string | undefined,
      htmlBody: string | undefined
    ) => {
      const dateStr =
        dateMs > 0 && Number.isFinite(dateMs) ? new Date(dateMs).toISOString().slice(0, 10) : "";
      const lines = [`# ${subject}`, "", "| | |", "|---|---|"];
      lines.push(`| **From** | ${from} |`);
      lines.push(`| **To** | ${to} |`);
      lines.push(`| **Date** | ${dateStr} |`);
      lines.push("", "---", "");
      lines.push(htmlBody ? "(html converted)" : body || "*(no body)*");
      return lines.join("\n");
    }
  ),
  htmlToMarkdownBody: vi.fn((_html: string) => null as string | null),
  exportFilename: vi.fn(
    (subject: string, _dateMs: number, ext: string) => `2026-02-14_${subject}.${ext}`
  ),
};

vi.mock("../store/core-store.js", () => ({
  getCore: () => mockCore,
  coreStore: { subscribe: vi.fn(), set: vi.fn(), update: vi.fn() },
}));

// Import after mock setup
const { emailToMarkdown, emailFilename } = await import("../markdown-export.js");

describe("emailToMarkdown", () => {
  it("includes metadata table with subject, from, to, date", () => {
    const md = emailToMarkdown({
      subject: "Test Subject",
      from: "sender@example.com",
      to: "recipient@example.com",
      date: "2026-02-14",
      body: "Hello world",
      htmlBody: null,
    });
    expect(md).toContain("# Test Subject");
    expect(md).toContain("| **From** |");
    expect(md).toContain("| **To** |");
    expect(md).toContain("| **Date** |");
    expect(md).toContain("---");
  });

  it("delegates to core.emailToMarkdown", () => {
    emailToMarkdown({
      subject: "Sub",
      from: "a@b.com",
      to: "c@d.com",
      date: "2026-01-01",
      body: "body",
      htmlBody: "<p>html</p>",
    });
    expect(mockCore.emailToMarkdown).toHaveBeenCalledWith(
      "Sub",
      "a@b.com",
      "c@d.com",
      Date.parse("2026-01-01"),
      "body",
      "<p>html</p>"
    );
  });
});

describe("emailFilename", () => {
  it("generates a safe filename", () => {
    const name = emailFilename({ subject: "Test", date: "2026-02-14" });
    expect(name).toContain(".md");
  });
});
