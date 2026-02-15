/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { emailToMarkdown, htmlToMarkdownBody } from "../markdown-export.js";

// ── Realistic Amazon delivery email HTML (simplified) ───────────────

const AMAZON_DELIVERY_HTML = `
<html>
<head><style>.header { background: #232f3e; }</style></head>
<body>
  <table width="100%">
    <tr><td>
      <a href="https://www.amazon.com/gp/r.html?C=ABC123&M=urn:rtn:msg:2026&ref_=pe_orders">
        <img src="https://www.amazon.com/gp/r.html?C=ABC123&M=urn:rtn:msg:2026&H=xyz&ref_=pe_logo"
             alt="" width="1" height="1">
      </a>
      <table>
        <tr>
          <td>
            <a href="https://www.amazon.com/your-orders">Your Orders</a>
            <a href="https://www.amazon.com/your-account">Your Account</a>
            <a href="https://www.amazon.com/buy-again">Buy Again</a>
          </td>
        </tr>
      </table>
      <h1>Your package was delivered!</h1>
      <img src="https://images-na.ssl-images-amazon.com/images/G/01/shiptrack/delivered_photo_123.jpg"
           alt="Delivery photo" width="400" height="300">
      <p>
        <b>Delivered today</b><br>
        Your package was left near the front door or porch.
      </p>
      <p>
        <b>Elon - HAWTHORNE, CA</b><br>
        Order # 000-1234567-8901234
      </p>
      <a href="https://www.amazon.com/progress-tracker/package?orderId=000-1234567-8901234">
        <img src="https://images-na.ssl-images-amazon.com/images/G/01/shiptrack/track_btn.png"
             alt="Track package" width="150" height="40">
      </a>
      <table>
        <tr>
          <td>
            <img src="https://images-na.ssl-images-amazon.com/images/I/product_image.jpg"
                 alt="MooMee Bedding Duvet Cover" width="100" height="100">
          </td>
          <td>
            * MooMee Bedding Duvet Cover Set 100% Washed Cotton Linen Like
          </td>
        </tr>
      </table>
      <img src="https://www.amazon.com/gp/r.html?C=ABC&K=XYZ&M=urn:rtn:msg:2026&ref_=pe_img"
           alt="" width="600" height="1">
      <img src="https://images-na.ssl-images-amazon.com/images/G/01/nav/transp.gif"
           alt="" width="1" height="1">
    </td></tr>
  </table>
</body>
</html>
`;

// ── Simple HTML with images and links ───────────────────────────────

const SIMPLE_HTML_WITH_IMAGES = `
<html><body>
  <h1>Newsletter</h1>
  <p>Check out our new product:</p>
  <img src="https://example.com/product.jpg" alt="New Product">
  <p>Visit <a href="https://example.com">our website</a> for more.</p>
</body></html>
`;

const PLAIN_TEXT_ONLY_HTML = `
<html><body>
  <p>Hello, this is a plain text email with no images.</p>
  <p>Best regards,<br>John</p>
</body></html>
`;

const TRACKING_PIXEL_HTML = `
<html><body>
  <p>Hello World</p>
  <img src="https://tracker.example.com/pixel.gif" width="1" height="1" alt="">
  <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP" alt="">
  <img src="https://example.com/spacer.gif" width="1" height="1" alt="">
  <img src="https://example.com/real-image.jpg" width="600" height="400" alt="Photo">
</body></html>
`;

// ── htmlToMarkdownBody tests ────────────────────────────────────────

describe("htmlToMarkdownBody", () => {
  it("converts basic HTML with image to markdown", () => {
    const md = htmlToMarkdownBody(SIMPLE_HTML_WITH_IMAGES);
    expect(md).toContain("# Newsletter");
    expect(md).toContain("![New Product](https://example.com/product.jpg)");
    expect(md).toContain("[our website](https://example.com)");
  });

  it("converts paragraphs and line breaks", () => {
    const md = htmlToMarkdownBody(PLAIN_TEXT_ONLY_HTML);
    expect(md).toContain("Hello, this is a plain text email with no images.");
    expect(md).toContain("Best regards,");
    expect(md).toContain("John");
  });

  it("skips tracking pixels (1x1 images)", () => {
    const md = htmlToMarkdownBody(TRACKING_PIXEL_HTML);
    expect(md).toContain("Hello World");
    expect(md).not.toContain("pixel.gif");
    expect(md).not.toContain("spacer.gif");
    expect(md).not.toContain("data:image");
    // Real image should be kept
    expect(md).toContain("![Photo](https://example.com/real-image.jpg)");
  });

  it("preserves bold text", () => {
    const md = htmlToMarkdownBody("<p><b>Important</b> text</p>");
    expect(md).toContain("**Important**");
  });

  it("preserves italic text", () => {
    const md = htmlToMarkdownBody("<p><em>Emphasized</em> text</p>");
    expect(md).toContain("*Emphasized*");
  });

  it("converts headings at all levels", () => {
    const md = htmlToMarkdownBody("<h1>One</h1><h2>Two</h2><h3>Three</h3>");
    expect(md).toContain("# One");
    expect(md).toContain("## Two");
    expect(md).toContain("### Three");
  });

  it("converts horizontal rules", () => {
    const md = htmlToMarkdownBody("<p>Before</p><hr><p>After</p>");
    expect(md).toContain("---");
  });

  it("strips style and script tags", () => {
    const md = htmlToMarkdownBody(
      "<style>.red { color: red }</style><script>alert(1)</script><p>Content</p>"
    );
    expect(md).not.toContain(".red");
    expect(md).not.toContain("alert");
    expect(md).toContain("Content");
  });

  it("handles Amazon delivery email — keeps real images, skips tracking", () => {
    const md = htmlToMarkdownBody(AMAZON_DELIVERY_HTML);

    // Real content should be present
    expect(md).toContain("Your package was delivered!");
    expect(md).toContain("**Delivered today**");
    expect(md).toContain("HAWTHORNE, CA");
    expect(md).toContain("000-1234567-8901234");

    // Real images should be preserved
    expect(md).toContain("![Delivery photo](https://images-na.ssl-images-amazon.com/images/G/01/shiptrack/delivered_photo_123.jpg)");
    expect(md).toContain("![MooMee Bedding Duvet Cover](https://images-na.ssl-images-amazon.com/images/I/product_image.jpg)");

    // Tracking pixels and spacers should be filtered out
    expect(md).not.toContain("transp.gif");
    // 1x1 tracking pixel should be filtered
    expect(md).not.toMatch(/!\[\]\(https:\/\/www\.amazon\.com\/gp\/r\.html\?C=ABC123/);

    // Links should be preserved
    expect(md).toContain("[Your Orders](https://www.amazon.com/your-orders)");
    expect(md).toContain("[Your Account](https://www.amazon.com/your-account)");
  });

  it("handles empty HTML", () => {
    const md = htmlToMarkdownBody("<html><body></body></html>");
    expect(md).toBe("");
  });

  it("handles images inside links", () => {
    const md = htmlToMarkdownBody(
      '<a href="https://example.com"><img src="https://example.com/banner.jpg" alt="Banner"></a>'
    );
    // Should contain the image (link wrapping may vary but image must be present)
    expect(md).toContain("![Banner](https://example.com/banner.jpg)");
  });
});

// ── emailToMarkdown with htmlBody ───────────────────────────────────

describe("emailToMarkdown with htmlBody", () => {
  const MESSAGE_WITH_HTML = {
    subject: "Delivered: MooMee Bedding Duvet Cover",
    from: '"Amazon.com" <order-update@amazon.com>',
    to: "elon@spacex.com",
    date: "Fri, 14 Feb 2026 17:14:00 +0000",
    body: "Your package was delivered! Delivered today",
    htmlBody: SIMPLE_HTML_WITH_IMAGES,
  };

  it("uses htmlBody when available instead of plain text body", () => {
    const md = emailToMarkdown(MESSAGE_WITH_HTML);
    // Should use the HTML conversion (has image) not the plain text
    expect(md).toContain("![New Product](https://example.com/product.jpg)");
  });

  it("falls back to plain text body when no htmlBody", () => {
    const msg = { ...MESSAGE_WITH_HTML, htmlBody: null };
    const md = emailToMarkdown(msg);
    expect(md).toContain("Your package was delivered! Delivered today");
    expect(md).not.toContain("![");
  });

  it("still includes metadata table", () => {
    const md = emailToMarkdown(MESSAGE_WITH_HTML);
    expect(md).toContain("# Delivered: MooMee Bedding Duvet Cover");
    expect(md).toContain("| **From** |");
    expect(md).toContain("| **To** |");
    expect(md).toContain("| **Date** |");
    expect(md).toContain("---");
  });
});
