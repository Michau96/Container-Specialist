import { test, expect } from '@playwright/test';

test.describe('Catalog Consistency and Tomato Search Scenario', () => {
  test.beforeEach(async ({ page }) => {
    // Seed localStorage so user starts already onboarded directly in catalog view
    await page.addInitScript(() => {
      localStorage.setItem('balkonowy_ogrod_welcome_seen', 'true');
      localStorage.setItem('balkonowy_guest_onboarded', 'true');
      localStorage.setItem(
        'balkonowy_guest_spec',
        JSON.stringify({
          region: 'mazowieckie',
          floor: 2,
          orientation: 'S',
          balcony_type: 'open_rail',
          roofing: 'uncovered',
          pots: ['pots_medium_5_15', 'pots_large_15_30'],
          care_time: 'daily',
        })
      );
    });
  });

  test('searches for "Pomidor" and displays verified tomato card with stable identifiers and correct entity mapping', async ({ page }) => {
    await page.goto('/');

    // Switch to catalog / search tab if not already active
    const searchTab = page.locator('#tab-search-crops');
    if (await searchTab.isVisible()) {
      await searchTab.click();
    }

    const searchInput = page.locator('#search-vegetables-input');
    await expect(searchInput).toBeVisible();

    // 1. Exact Polish query "Pomidor"
    await searchInput.fill('Pomidor');

    // 2. Tomato card exists and is visible
    const tomatoCard = page.getByTestId('plant-card-pomidor-karlowy');
    await expect(tomatoCard).toBeVisible();
    await expect(tomatoCard).toHaveAttribute('data-plant-id', 'pomidor-karlowy');

    // 3. Title mapping
    const title = page.getByTestId('plant-title-pomidor-karlowy');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Pomidor');

    // 4. Category mapping
    const category = page.getByTestId('plant-category-pomidor-karlowy');
    await expect(category).toBeVisible();
    await expect(category).toHaveText('Psiankowate');

    // 5. Image mapping
    const img = page.getByTestId('plant-image-pomidor-karlowy');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('src', /1592841200221-a6898f307baa/);

    // 6. Case-insensitive search ("pomidor")
    await searchInput.fill('pomidor');
    await expect(page.getByTestId('plant-card-pomidor-karlowy')).toBeVisible();

    // 7. Partial query ("pomi")
    await searchInput.fill('pomi');
    await expect(page.getByTestId('plant-card-pomidor-karlowy')).toBeVisible();

    // 8. No-result state: no unrelated fallback cards shown
    await searchInput.fill('nieistniejaca_roslina_xyz999');
    await expect(page.getByTestId('no-results-container')).toBeVisible();
    await expect(page.getByTestId('no-results-heading')).toBeVisible();
    await expect(page.getByTestId('plant-card-pomidor-karlowy')).not.toBeVisible();
  });
});
