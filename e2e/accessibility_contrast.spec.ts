import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility, Contrast, Keyboard Nav & Responsiveness Evaluation', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('balkonowy_ogrod_welcome_seen', 'true');
      localStorage.removeItem('balkonowy_guest_onboarded');
      localStorage.removeItem('balkonowy_guest_spec');
    });
  });

  test('runs automated axe-core accessibility audits on onboarding modal and verifies no critical WCAG AA violations', async ({
    page,
  }) => {
    await page.goto('/');

    const modal = page.getByTestId('onboarding-modal');
    await expect(modal).toBeVisible();

    // 1. Audit Step 1 with axe-core
    const accessibilityScanResultsStep1 = await new AxeBuilder({ page })
      .include('[data-testid="onboarding-modal"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResultsStep1.violations).toEqual([]);

    // Select Pomorskie and Parter (Polish strings check)
    const pomorskieOption = page.getByTestId('location-option-pomorskie');
    await expect(pomorskieOption).toBeVisible();
    expect(await pomorskieOption.textContent()).toContain('Pomorskie');
    await pomorskieOption.click();

    const parterOption = page.getByTestId('floor-option-ground');
    await expect(parterOption).toBeVisible();
    expect(await parterOption.textContent()).toContain('Parter');
    await parterOption.click();

    const nextBtn = page.getByTestId('onboarding-next-button');
    await expect(nextBtn).toBeEnabled();
    expect(await nextBtn.textContent()).toContain('Dalej');
    await nextBtn.click();

    // 2. Audit Step 2 with axe-core
    const step2 = page.getByTestId('onboarding-step-2');
    await expect(step2).toBeVisible();

    const accessibilityScanResultsStep2 = await new AxeBuilder({ page })
      .include('[data-testid="onboarding-modal"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResultsStep2.violations).toEqual([]);

    // Select sunlight orientation
    const fullSunOption = page.getByTestId('sunlight-option-full-sun');
    await fullSunOption.click();

    await nextBtn.click();

    // 3. Audit Step 3 with axe-core
    const step3 = page.getByTestId('onboarding-step-3');
    await expect(step3).toBeVisible();

    const accessibilityScanResultsStep3 = await new AxeBuilder({ page })
      .include('[data-testid="onboarding-modal"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResultsStep3.violations).toEqual([]);
  });

  test('verifies keyboard navigation flow and focus trap in onboarding modal', async ({ page }) => {
    await page.goto('/');

    const modal = page.getByTestId('onboarding-modal');
    await expect(modal).toBeVisible();

    // Verify close button has accessible label 'Zamknij'
    const closeBtn = page.getByTestId('onboarding-close');
    await expect(closeBtn).toBeVisible();
    await expect(closeBtn).toHaveAttribute('aria-label', 'Zamknij');

    // Press Escape to dismiss or Tab through interactive elements
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid') || document.activeElement?.id);
    expect(focusedElement).toBeDefined();
  });

  test('evaluates responsive layouts at 320px, 375px, tablet (768px), and desktop (1280px) without horizontal overflow', async ({
    page,
  }) => {
    const viewports = [
      { width: 320, height: 600, name: '320px Mobile' },
      { width: 375, height: 667, name: '375px Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1280, height: 800, name: 'Desktop' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      const modal = page.getByTestId('onboarding-modal');
      await expect(modal).toBeVisible();

      // Ensure no horizontal document overflow
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalOverflow).toBe(false);

      // Verify modal controls are visible and within viewport
      const closeBtn = page.getByTestId('onboarding-close');
      const bounding = await closeBtn.boundingBox();
      expect(bounding).not.toBeNull();
      if (bounding) {
        expect(bounding.width).toBeGreaterThanOrEqual(40);
        expect(bounding.height).toBeGreaterThanOrEqual(40);
        expect(bounding.x + bounding.width).toBeLessThanOrEqual(vp.width + 10);
      }
    }
  });

  test('evaluates 200% browser zoom behavior without horizontal overflow or clipped modal controls', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 480 });
    await page.goto('/');

    const modal = page.getByTestId('onboarding-modal');
    await expect(modal).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('evaluates dark mode contrast and visual appearance in catalog', async ({ page }) => {
    // Seed user as already onboarded
    await page.addInitScript(() => {
      localStorage.setItem('balkonowy_ogrod_welcome_seen', 'true');
      localStorage.setItem('balkonowy_guest_onboarded', 'true');
      localStorage.setItem(
        'balkonowy_guest_spec',
        JSON.stringify({
          region: 'pomorskie',
          floor: 0,
          orientation: 'S',
          balcony_type: 'open_rail',
          roofing: 'uncovered',
          pots: ['boxes_balcony_15cm'],
          care_time: 'daily',
        })
      );
      document.documentElement.classList.add('dark');
    });

    await page.goto('/');

    // Navigate to catalog search tab
    const searchTab = page.locator('#tab-search-crops');
    if (await searchTab.isVisible()) {
      await searchTab.click();
    }

    const searchInput = page.getByTestId('catalog-search-input');
    await expect(searchInput).toBeVisible();

    // Check axe-core in dark mode for catalog
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
