import { formatDate, exportFilename } from "./email-utils.js";

export interface MessageForMarkdown {
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string | null;
  htmlBody?: string | null;
}

/**
 * Convert a parsed email message to Markdown format.
 * If the message has htmlBody, images and links are preserved as markdown syntax.
 */
export function emailToMarkdown(message: MessageForMarkdown): string {
  const lines: string[] = [];

  lines.push(`# ${message.subject}`);
  lines.push("");
  lines.push(`| | |`);
  lines.push(`|---|---|`);
  lines.push(`| **From** | ${escapeCell(message.from)} |`);
  lines.push(`| **To** | ${escapeCell(message.to)} |`);
  lines.push(`| **Date** | ${formatDate(message.date)} |`);
  lines.push("");
  lines.push("---");
  lines.push("");

  const bodyMd = message.htmlBody
    ? htmlToMarkdownBody(message.htmlBody)
    : null;

  lines.push(bodyMd || message.body || "*(no body)*");
  lines.push("");

  return lines.join("\n");
}

/** Escape pipe characters inside a Markdown table cell */
function escapeCell(text: string): string {
  return (text || "").replace(/\|/g, "\\|");
}

/**
 * Convert HTML to Markdown, preserving images, links, bold, and structure.
 * Uses DOMParser for accurate conversion.
 * Exported for testing.
 */
export function htmlToMarkdownBody(html: string): string | null {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");

    for (const el of doc.querySelectorAll("style, script, head")) el.remove();

    return nodeToMarkdown(doc.body).replace(/\n{3,}/g, "\n\n").trim();
  } catch {
    return null;
  }
}

function isSkippableImage(node: Element, src: string): boolean {
  if (!src || src.startsWith("data:")) return true;

  const w = parseInt(node.getAttribute("width") ?? "", 10);
  const h = parseInt(node.getAttribute("height") ?? "", 10);
  if ((w > 0 && w <= 3) || (h > 0 && h <= 3)) return true;

  const lower = src.toLowerCase();
  if (lower.includes("spacer") || lower.includes("transparent") || lower.includes("transp.gif")) return true;
  if (lower.includes("/track") && lower.includes("pixel")) return true;
  if (/amazon\.com\/gp\/r\.html\?/.test(src)) return true;
  if (/[?&](open|track|beacon|pixel|img)=/i.test(lower)) return true;
  if (lower.includes("mail.google.com/mail/u/") && lower.includes("view=fimg")) return false;
  if (/ci\d+\.\w+\.com\//.test(lower) || (lower.endsWith(".gif") && lower.includes("1x1"))) return true;

  return false;
}

function nodeToMarkdown(node: Node): string {
  if (node.nodeType === 3) {
    return (node.textContent ?? "").replace(/[ \t]+/g, " ");
  }

  if (node.nodeType !== 1) return "";

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  if (tag === "br") return "\n";
  if (tag === "hr") return "\n\n---\n\n";

  if (tag === "img") {
    const src = el.getAttribute("src") || "";
    const alt = el.getAttribute("alt") || "";
    if (isSkippableImage(el, src)) return "";
    return `![${alt}](${src})`;
  }

  const inner = Array.from(node.childNodes).map(nodeToMarkdown).join("");
  const trimmed = inner.trim();

  if (!trimmed && !["img", "br", "hr"].includes(tag)) return inner;

  if (tag === "p" || tag === "div") return `\n\n${trimmed}\n\n`;
  if (tag === "blockquote") return `\n\n> ${trimmed.replace(/\n/g, "\n> ")}\n\n`;
  if (/^h[1-6]$/.test(tag)) {
    const level = Number(tag[1]);
    return `\n\n${"#".repeat(level)} ${trimmed}\n\n`;
  }
  if (tag === "ul" || tag === "ol") return `\n\n${inner}\n\n`;
  if (tag === "li") {
    const marker = el.parentElement?.tagName.toLowerCase() === "ol" ? "1." : "-";
    return `${marker} ${trimmed}\n`;
  }

  if (tag === "a") {
    const href = el.getAttribute("href") || "";
    if (!href || href.startsWith("mailto:")) return trimmed;
    if (trimmed === href) return href;
    return `[${trimmed}](${href})`;
  }
  if (tag === "strong" || tag === "b") return `**${trimmed}**`;
  if (tag === "em" || tag === "i") return `*${trimmed}*`;
  if (tag === "code") return `\`${trimmed}\``;

  if (tag === "table") return `\n\n${inner}\n\n`;
  if (tag === "tr") {
    const cells = Array.from(el.children)
      .map((td) => nodeToMarkdown(td).trim())
      .join(" | ");
    return `| ${cells} |\n`;
  }
  if (tag === "td" || tag === "th") return inner;
  if (tag === "thead") {
    const headerRow = inner.trim();
    const colCount = (headerRow.match(/\|/g) || []).length - 1;
    const sep = "| " + Array(Math.max(colCount, 1)).fill("---").join(" | ") + " |";
    return `${headerRow}${sep}\n`;
  }
  if (tag === "tbody" || tag === "tfoot") return inner;

  return inner;
}

export interface MessageForFilename {
  subject: string;
  date: string;
}

/**
 * Generate a safe filename from an email subject.
 */
export function emailFilename(message: MessageForFilename): string {
  return exportFilename(message, "md");
}

/**
 * Trigger a browser download of the given text as a file.
 */
export function downloadText(
  content: string,
  filename: string,
  mimeType: string = "text/markdown;charset=utf-8"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
