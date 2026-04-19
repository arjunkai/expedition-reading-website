import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("home page", () => {
  test("loads with the tagline H1 and both hero CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /every child deserves a chance to learn/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /donate books.*funds/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /partner with us/i })).toBeVisible();
  });

  test("renders all three impact stats", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/5,000\+/)).toBeVisible();
    await expect(page.getByText(/20\+/)).toBeVisible();
    await expect(page.getByText(/200\+/)).toBeVisible();
  });

  test("renders all three program cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Hospital Bassinet Books" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "School Partnerships" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Community Drives" })).toBeVisible();
  });

  test("home page has donate links pointing to PayPal or the get-involved page", async ({ page }) => {
    await page.goto("/");
    const donateLinks = page.getByRole("link", { name: /donate/i });
    const count = await donateLinks.count();
    expect(count).toBeGreaterThanOrEqual(2);
    const hrefs: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await donateLinks.nth(i).getAttribute("href");
      expect(href, `donate link #${i} must target PayPal or /get-involved`).toMatch(
        /\/get-involved|paypal\.com/,
      );
      if (href) hrefs.push(href);
    }
    // Expect a mix: at least one goes straight to PayPal, at least one to the get-involved tier page.
    expect(hrefs.some((h) => h.includes("paypal.com"))).toBe(true);
    expect(hrefs.some((h) => h.includes("/get-involved"))).toBe(true);
  });

  test("emits no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(String(err)));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  test("has no serious/critical axe violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});
