import { test, expect } from "@playwright/test";

// ────────────────────────────────────────────────────────────
// App shell — Chat mode
// ────────────────────────────────────────────────────────────
test.describe("App shell", () => {
  test("renders brand and workflow links in chat mode", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("me-ai").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Start here/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Scan&Chat/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Sources/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Control/i })).toBeVisible();
  });

  test("shows AI backend selector on load", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("AI BACKEND")).toBeVisible();
    await expect(page.getByRole("button", { name: /WebGPU/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Ollama/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Cloud APIs/i })).toBeVisible();
  });
});

// ────────────────────────────────────────────────────────────
// Navigation — Home workflow
// ────────────────────────────────────────────────────────────
test.describe("Navigation", () => {
  test("navigates to control mode via Control link", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /Control/i }).click();
    await expect(page).toHaveURL(/#pipelines/);

    await expect(page.getByRole("heading", { name: "Routing Pipelines" })).toBeVisible();
  });

  test("navigates back to chat from pipeline sidebar", async ({ page }) => {
    await page.goto("/#stream");

    await page.getByRole("link", { name: /Back to Chat/i }).click();
    await expect(page).toHaveURL(/#chat/);

    await expect(page.getByText("AI BACKEND")).toBeVisible();
  });

  test("direct navigation to #stream shows Event Stream", async ({ page }) => {
    await page.goto("/#stream");

    await expect(page.getByRole("heading", { name: "Event Stream" })).toBeVisible();
  });

  test("direct navigation to #pipelines shows Pipelines heading", async ({ page }) => {
    await page.goto("/#pipelines");

    await expect(page.getByRole("heading", { name: "Routing Pipelines" })).toBeVisible();
  });

  test("direct navigation to #audit shows Audit Trail heading", async ({ page }) => {
    await page.goto("/#audit");

    await expect(page.getByRole("heading", { name: "Audit Trail" })).toBeVisible();
  });

  test("direct navigation to #sources shows Sources heading", async ({ page }) => {
    await page.goto("/#sources");

    await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
  });

  test("direct navigation to #scan shows Email Triage heading", async ({ page }) => {
    await page.goto("/#scan");

    await expect(page.getByRole("heading", { name: "Email Triage" })).toBeVisible();
  });
});

// ────────────────────────────────────────────────────────────
// Chat page — model selector
// ────────────────────────────────────────────────────────────
test.describe("Chat page", () => {
  test("shows model selector with Choose Model label", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("CHOOSE MODEL")).toBeVisible();
    await expect(page.getByRole("combobox", { name: /Choose Model/i })).toBeVisible();
  });

  test("shows Load Model button", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: "Load Model" })).toBeVisible();
  });

  test("WebGPU backend is selected by default", async ({ page }) => {
    await page.goto("/");

    const webgpuBtn = page.getByRole("button", { name: /WebGPU/i });
    await expect(webgpuBtn).toBeVisible();
  });

  test("switching to Ollama backend swaps model selector", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /Ollama/i }).click();

    await expect(page.locator("#model-select")).not.toBeVisible();
    await expect(page.locator("#ollama-model")).toBeVisible();
  });

  test("thinking is collapsed by default, expands on click", async ({ page }) => {
    test.skip(!!process.env.CI, "Requires WebGPU — skipped in CI");
    test.setTimeout(180_000);
    await page.goto("/");
    const hasWebGPU = await page.evaluate(async () => {
      if (!("gpu" in navigator)) return false;
      try {
        const adapter = await (
          navigator as unknown as { gpu: { requestAdapter(): Promise<unknown> } }
        ).gpu.requestAdapter();
        return adapter !== null;
      } catch {
        return false;
      }
    });
    test.skip(!hasWebGPU, "Requires WebGPU — skipped when GPU unavailable");

    await page.getByRole("button", { name: "Load Model" }).click();

    const input = page.getByPlaceholder(/Type a message|message/i);
    await expect(input).toBeVisible({ timeout: 120_000 });

    const thinkingSwitch = page.getByRole("switch", { name: /Thinking/i });
    if (await thinkingSwitch.isVisible()) {
      if ((await thinkingSwitch.getAttribute("aria-checked")) !== "true") {
        await thinkingSwitch.click();
      }
    }

    await input.fill("hi");
    await input.press("Enter");

    const reasoningTrigger = page.getByText("Internal reasoning");
    await expect(reasoningTrigger).toBeVisible({ timeout: 60_000 });

    const preContent = page.locator("pre").filter({ hasText: /Analyze|Request|Thinking/i });
    await expect(preContent).toBeHidden();

    await reasoningTrigger.click();

    await expect(preContent).toBeVisible({ timeout: 5_000 });
  });
});

// ────────────────────────────────────────────────────────────
// Pipeline sidebar
// ────────────────────────────────────────────────────────────
test.describe("Pipeline sidebar", () => {
  test("shows all sidebar nav items", async ({ page }) => {
    await page.goto("/#stream");

    await expect(page.getByRole("link", { name: /Event Stream/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Pipelines/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Approvals/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Audit Trail/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Scan/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Settings/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Back to Chat/i })).toBeVisible();
  });

  test("sidebar nav links navigate correctly", async ({ page }) => {
    await page.goto("/#stream");

    await page.getByRole("link", { name: /Audit Trail/i }).click();
    await expect(page).toHaveURL(/#audit/);
    await expect(page.getByRole("heading", { name: "Audit Trail" })).toBeVisible();
  });
});

// ────────────────────────────────────────────────────────────
// OAuth pages
// ────────────────────────────────────────────────────────────
test.describe("OAuth pages", () => {
  test("#auth shows Google OAuth page", async ({ page }) => {
    await page.goto("/");
    await page.goto("/#auth");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Google OAuth" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Sign in with Google/i })).toBeVisible();
  });

  test("#oauth-redirect shows redirect OAuth page", async ({ page }) => {
    await page.goto("/");
    await page.goto("/#oauth-redirect");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Google OAuth" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Sign in with Google/i })).toBeVisible();
  });

  test("OAuth pages have back to chat link", async ({ page }) => {
    await page.goto("/");
    await page.goto("/#auth");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("link", { name: /Back to Chat/i })).toBeVisible();
  });
});
