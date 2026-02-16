import { test, expect } from "@playwright/test";

// ────────────────────────────────────────────────────────────
// App shell
// ────────────────────────────────────────────────────────────
test.describe("App shell", () => {
  test("renders nav with brand and links", async ({ page }) => {
    await page.goto("/");

    // Brand link
    const brand = page.locator("a.nav-brand");
    await expect(brand).toBeVisible();
    await expect(brand).toHaveText("me-ai");

    // Nav links
    const navLinks = page.locator(".nav-links a");
    await expect(navLinks).toHaveCount(3);
    await expect(navLinks.nth(0)).toHaveText("Chat");
    await expect(navLinks.nth(1)).toHaveText("Actions");
    await expect(navLinks.nth(2)).toHaveText("Dashboard");
  });

  test("Chat link is active by default", async ({ page }) => {
    await page.goto("/");

    const chatLink = page.locator('.nav-links a[href="#chat"]');
    await expect(chatLink).toHaveClass(/active/);

    const dashboardLink = page.locator('.nav-links a[href="#dashboard"]');
    await expect(dashboardLink).not.toHaveClass(/active/);
  });
});

// ────────────────────────────────────────────────────────────
// Navigation
// ────────────────────────────────────────────────────────────
test.describe("Navigation", () => {
  test("navigates from Chat to Dashboard via nav link", async ({ page }) => {
    await page.goto("/");

    // Click Dashboard link
    await page.locator('.nav-links a[href="#dashboard"]').click();
    await expect(page).toHaveURL(/#dashboard/);

    // Dashboard link should be active
    const dashboardLink = page.locator('.nav-links a[href="#dashboard"]');
    await expect(dashboardLink).toHaveClass(/active/);

    // Chat link should no longer be active
    const chatLink = page.locator('.nav-links a[href="#chat"]');
    await expect(chatLink).not.toHaveClass(/active/);
  });

  test("navigates from Dashboard back to Chat", async ({ page }) => {
    await page.goto("/#dashboard");

    // Click Chat link
    await page.locator('.nav-links a[href="#chat"]').click();
    await expect(page).toHaveURL(/#chat/);

    const chatLink = page.locator('.nav-links a[href="#chat"]');
    await expect(chatLink).toHaveClass(/active/);
  });

  test("direct navigation to #dashboard works", async ({ page }) => {
    await page.goto("/#dashboard");

    const dashboardLink = page.locator('.nav-links a[href="#dashboard"]');
    await expect(dashboardLink).toHaveClass(/active/);

    // Dashboard content should be visible (SetupGuide when no clientId)
    const dashboard = page.locator(".dashboard");
    await expect(dashboard).toBeVisible();
  });
});

// ────────────────────────────────────────────────────────────
// Chat page
// ────────────────────────────────────────────────────────────
test.describe("Chat page", () => {
  test("shows WebGPU message or model selector", async ({ page }) => {
    await page.goto("/");

    // The chat page view should be visible
    const chatView = page.locator('.page-view').first();
    await expect(chatView).toBeVisible();

    // Depending on browser WebGPU support, we see one or the other.
    // Playwright's Chromium headless may or may not support WebGPU,
    // so we check for either outcome.
    const webgpuNotAvailable = page.getByText("WebGPU Not Available");
    const modelSelector = page.getByText("Choose Model:");

    const hasWebGPUMessage = await webgpuNotAvailable.isVisible().catch(() => false);
    const hasModelSelector = await modelSelector.isVisible().catch(() => false);

    // One of them must be visible
    expect(hasWebGPUMessage || hasModelSelector).toBe(true);
  });
});

// ────────────────────────────────────────────────────────────
// Dashboard page — no client ID (SetupGuide)
// ────────────────────────────────────────────────────────────
test.describe("Dashboard page (no client ID)", () => {
  test("shows setup guide when no client ID is configured", async ({ page }) => {
    // Make sure no client ID is stored
    await page.goto("/#dashboard");
    await page.evaluate(() => localStorage.removeItem("googleClientId"));
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Navigate to dashboard
    await page.locator('.nav-links a[href="#dashboard"]').click();

    // Should see the client ID form (part of SetupGuide)
    const clientIdInput = page.locator('.client-id-form input[type="text"]');
    await expect(clientIdInput).toBeVisible();
    await expect(clientIdInput).toHaveAttribute("placeholder", /apps\.googleusercontent\.com/);
  });
});

// ────────────────────────────────────────────────────────────
// Dashboard page — with client ID (AuthCard)
// ────────────────────────────────────────────────────────────
test.describe("Dashboard page (with client ID)", () => {
  test("shows auth card when client ID is set via localStorage", async ({ page }) => {
    // Set localStorage before the app loads via addInitScript
    await page.addInitScript(() => {
      localStorage.setItem("googleClientId", "fake-client-id.apps.googleusercontent.com");
    });

    // Full page load with dashboard hash — component reads clientId on mount
    await page.goto("/#dashboard");
    await page.waitForLoadState("networkidle");

    // Should see the auth card with "Gmail Dashboard" heading
    const heading = page.getByRole("heading", { name: "Gmail Dashboard" });
    await expect(heading).toBeVisible();

    // Should see the Google sign-in button
    const signInButton = page.getByRole("button", { name: /Sign in with Google/ });
    await expect(signInButton).toBeVisible();

    // Cleanup
    await page.evaluate(() => localStorage.removeItem("googleClientId"));
  });
});

// ────────────────────────────────────────────────────────────
// Actions page
// ────────────────────────────────────────────────────────────
test.describe("Actions page", () => {
  test("navigates to Actions page and shows empty state", async ({ page }) => {
    await page.goto("/#actions");

    // Actions link should be active
    const actionsLink = page.locator('.nav-links a[href="#actions"]');
    await expect(actionsLink).toHaveClass(/active/);

    // Should show the empty state
    const heading = page.getByRole("heading", { name: "No emails classified yet" });
    await expect(heading).toBeVisible();
  });

  test("shows scan control with model status", async ({ page }) => {
    await page.goto("/#actions");

    // Should see the Email Triage label
    const triageLabel = page.getByText("Email Triage");
    await expect(triageLabel).toBeVisible();

    // Should see the Scan New button
    const scanButton = page.getByRole("button", { name: "Scan New" });
    await expect(scanButton).toBeVisible();
  });

  test("navigates from Chat to Actions", async ({ page }) => {
    await page.goto("/");

    await page.locator('.nav-links a[href="#actions"]').click();
    await expect(page).toHaveURL(/#actions/);

    const actionsLink = page.locator('.nav-links a[href="#actions"]');
    await expect(actionsLink).toHaveClass(/active/);
  });
});
