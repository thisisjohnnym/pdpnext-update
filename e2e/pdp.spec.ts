import { expect, test } from "@playwright/test";

import { PDP_VIEWPORT } from "../playwright.config";

test.describe("PDP — 4RW-0 / 3YT-0", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(PDP_VIEWPORT);
    await page.goto("/");
    await page.waitForSelector("#pdp-hero", { state: "visible" });
  });

  test("home route loads (not 404)", async ({ page }) => {
    await expect(page).toHaveURL("/");
    await expect(page.locator("#pdp-hero")).toBeVisible();
  });

  test("legacy /redesign redirects to /", async ({ page }) => {
    const response = await page.goto("/redesign");
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL("/");
  });

  test("on-land hero has video slide and 14 gallery pills", async ({ page }) => {
    const heroVideo = page.locator("#pdp-hero video");
    await expect(heroVideo).toHaveCount(1);
    await expect(heroVideo).toHaveAttribute("src", /tabby-hero\.mp4/);

    const pills = page.locator("#pdp-hero button[aria-label^='Go to slide']");
    await expect(pills).toHaveCount(14);

    const activePill = page.locator("#pdp-hero button[aria-label='Go to slide 1']");
    await expect(activePill).toHaveClass(/h-\[30px\]/);
  });

  test("product card copy matches spec", async ({ page }) => {
    const card = page.locator("#pdp-hero");
    await expect(card.getByText("Tabby 26", { exact: true })).toBeVisible();
    await expect(card.getByText("— shoulder bag")).toBeVisible();
    await expect(card.getByText("$575")).toBeVisible();
    await expect(
      card.getByText("Our signature shoulder bag", { exact: false }),
    ).toBeVisible();
  });

  test("action rail shows PDP counts", async ({ page }) => {
    await expect(page.getByLabel(/1\.2M likes/i)).toBeVisible();
    await expect(page.getByLabel(/128 comments/i)).toBeVisible();
    await expect(page.getByLabel(/3\.4k shares/i)).toBeVisible();
  });

  test("floating CTA bar has 8px inset and 54px height", async ({ page }) => {
    const bar = page.locator(".pdp-bottom-bar").last();
    await expect(bar).toBeVisible();

    const inset = await page.evaluate(() => {
      const bars = document.querySelectorAll(".pdp-bottom-bar");
      const el = bars[bars.length - 1];
      const grid = el?.querySelector(".pdp-page");
      const button = el?.querySelector("button");
      if (!grid || !button) return null;
      const gridRect = grid.getBoundingClientRect();
      return {
        left: gridRect.left,
        right: window.innerWidth - gridRect.right,
        buttonHeight: button.getBoundingClientRect().height,
      };
    });

    expect(inset).not.toBeNull();
    expect(inset!.left).toBeGreaterThanOrEqual(7);
    expect(inset!.left).toBeLessThanOrEqual(9);
    expect(inset!.right).toBeGreaterThanOrEqual(7);
    expect(inset!.right).toBeLessThanOrEqual(9);
    expect(inset!.buttonHeight).toBeGreaterThanOrEqual(53);
    expect(inset!.buttonHeight).toBeLessThanOrEqual(55);
  });

  test("bottom bar color swatch uses deployed tabby25 asset", async ({ page }) => {
    const swatch = page.locator(".pdp-bottom-bar img").first();
    await expect(swatch).toHaveAttribute("src", /tabby25/);
  });

  test("scroll sections appear in PDP order", async ({ page }) => {
    const ids = [
      "pdp-hero",
      "pdp-assets",
      "pdp-ways-to-wear",
      "pdp-capacity",
      "pdp-ugc",
      "pdp-hotspots",
      "pdp-360",
    ];

    for (const id of ids) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }

    const tops = await page.evaluate((sectionIds) => {
      return sectionIds.map(
        (id) => document.getElementById(id)?.getBoundingClientRect().top ?? 0,
      );
    }, ids);

    for (let index = 1; index < tops.length; index += 1) {
      expect(tops[index]).toBeGreaterThanOrEqual(tops[index - 1]!);
    }
  });

  test("color sheet opens from floating bar", async ({ page }) => {
    await page.getByRole("button", { name: /^Black/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("add to bag sheet opens", async ({ page }) => {
    await page.locator(".pdp-bottom-bar").getByRole("button", { name: "Add to bag" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("gallery indicator hides after scrolling past hero", async ({ page }) => {
    await page.locator("#pdp-assets").scrollIntoViewIfNeeded();
    await expect(page.locator("#pdp-hero [data-hero-chrome]")).toBeHidden();
  });

  test("on-land screenshot gate at 430px", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("pdp-on-land-430.png", {
      maxDiffPixelRatio: 0.15,
      animations: "disabled",
    });
  });

  test("page ends after pdp-360 with no legacy commerce tail", async ({ page }) => {
    await page.locator("#pdp-360").scrollIntoViewIfNeeded();
    await expect(page.locator("#pdp-360")).toBeVisible();

    for (const heading of ["Compare the family", "FAQs", "Reviews"] as const) {
      await expect(page.getByRole("heading", { name: heading, exact: true })).toHaveCount(0);
    }

    await expect(page.locator("footer")).toHaveCount(0);
  });
});
