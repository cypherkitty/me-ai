/**
 * @vitest-environment jsdom
 *
 * HTML-to-Markdown conversion lives in Rust (formatting/markdown.rs).
 * Message → markdown orchestration lives in Rust (`emailMessageToMarkdown`).
 */
import { describe, it, expect, vi } from "vitest";
import type { MessageForMarkdown } from "../core.js";
import { getCore } from "../store/core-store.js";

const mockEmailDateToEpochMs = (d: unknown): number => {
  if (d === "" || d == null) return 0;
  if (typeof d === "number" && Number.isFinite(d)) return d;
  if (typeof d === "bigint") return Number(d);
  const s = String(d).trim();
  if (!s) return 0;
  if (/^\d+$/.test(s)) {
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }
  const parsed = Date.parse(s);
  return Number.isFinite(parsed) ? parsed : 0;
};

function emailToMarkdownImpl(
  subject: string,
  from: string,
  to: string,
  dateMs: number,
  body: string | undefined,
  htmlBody: string | undefined
): string {
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

const mockCore = {
  emailDateToEpochMs: mockEmailDateToEpochMs,
  exportEmailFilename: vi.fn((subject: string, date: unknown, ext: string) => {
    const ms = mockEmailDateToEpochMs(date);
    return `${ms > 0 ? "2026-02-14" : "unknown-date"}_${subject}.${ext}`;
  }),
  emailToMarkdown: vi.fn(emailToMarkdownImpl),
  emailMessageToMarkdown: vi.fn((msg: MessageForMarkdown) => {
    const dateMs = mockEmailDateToEpochMs(msg.date);
    const bodyRaw = msg.body;
    const body =
      bodyRaw != null && String(bodyRaw).trim() !== "" ? String(bodyRaw).trim() : undefined;
    const htmlRaw = msg.htmlBody;
    const htmlBody =
      htmlRaw != null && String(htmlRaw).trim() !== "" ? String(htmlRaw).trim() : undefined;
    return (mockCore.emailToMarkdown as typeof emailToMarkdownImpl)(
      msg.subject || "",
      msg.from || "",
      msg.to || "",
      dateMs,
      body,
      htmlBody
    );
  }),
  exportEmailMessageFilename: vi.fn((msg: MessageForMarkdown, ext: string) => {
    const ms = mockEmailDateToEpochMs(msg.date);
    return `${ms > 0 ? "2026-02-14" : "unknown-date"}_${msg.subject || ""}.${ext}`;
  }),
  htmlToMarkdownBody: vi.fn((_html: string) => null as string | null),
};

vi.mock("../store/core-store.js", () => ({
  getCore: () => mockCore,
  coreStore: { subscribe: vi.fn(), set: vi.fn(), update: vi.fn() },
}));

const emailToMarkdown = (m: MessageForMarkdown) => getCore().emailMessageToMarkdown(m);
const emailFilename = (m: Pick<MessageForMarkdown, "subject" | "date">) =>
  getCore().exportEmailMessageFilename(
    {
      subject: m.subject,
      from: "",
      to: "",
      date: m.date,
      body: null,
    },
    "md"
  );

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

  it("emailMessageToMarkdown unpacks into the same args as emailToMarkdown", () => {
    vi.mocked(mockCore.emailToMarkdown).mockClear();
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
      mockEmailDateToEpochMs("2026-01-01"),
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
