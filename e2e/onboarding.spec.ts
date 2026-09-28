import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Onboarding Flow - Deterministic Selectors & Complete User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Seed localStorage so the onboarding setup wizard is displayed immediately upon load
    await page.addInitScript(() => {
      localStorage.setItem('balkonowy_ogrod_welcome_seen', 'true');
      localStorage.removeItem('balkonowy_guest_onboarded');
      localStorage.removeItem('balkonowy_guest_spec');
    });
  });

  test('completes full onboarding journey interacting only via data-testid and role/name', async ({ page }) => {
    await page.goto('/');

    // 1. Verify modal container and semantic dialog attributes
    const modal = page.getByTestId('onboarding-modal');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(modal).toHaveAttribute('data-modal-ready', 'true');

    // 2. STEP 1: Location & Floor
    const step1 = page.getByTestId('onboarding-step-1');
    await expect(step1).toBeVisible();

    // Verify search input by semantic testid
    const searchInput = page.getByTestId('location-search');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Gdańsk');
    await expect(page.getByTestId('location-option-pomorskie')).toBeVisible();
    await searchInput.clear();

    // Select region 'Pomorskie' using domain-based testid
    const pomorskieOption = page.getByTestId('location-option-pomorskie');
    await expect(pomorskieOption).toBeVisible();
    await pomorskieOption.click();

    // Select ground floor ('Parter') using domain-based testid
    const groundFloorOption = page.getByTestId('floor-option-ground');
    await expect(groundFloorOption).toBeVisible();
    await groundFloorOption.click();

    // Proceed to Step 2 via Next button
    const nextBtn = page.getByTestId('onboarding-next');
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // 3. STEP 2: Sunlight / Orientation
    const step2 = page.getByTestId('onboarding-step-2');
    await expect(step2).toBeVisible();
    await expect(step1).not.toBeAttached();

    // Verify filter buttons exist
    const mainFilter = page.getByTestId('sunlight-filter-main');
    await expect(mainFilter).toBeVisible();

    // Select Full Sun (South - 'Południe') using domain-based testid
    const fullSunOption = page.getByTestId('sunlight-option-full-sun');
    await expect(fullSunOption).toBeVisible();
    await fullSunOption.click();

    // Proceed to Step 3 via Next button
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // 4. STEP 3: Railing, Roofing, Containers & Care
    const step3 = page.getByTestId('onboarding-step-3');
    await expect(step3).toBeVisible();
    await expect(step2).not.toBeAttached();

    // Verify railing and roofing selectors
    await expect(page.getByTestId('railing-select')).toBeVisible();
    await expect(page.getByTestId('roofing-select')).toBeVisible();

    // Toggle container option using domain-based testid
    const containerOption = page.getByTestId('pot-option-boxes_balcony_15cm');
    await expect(containerOption).toBeVisible();
    await containerOption.click();

    // Select care time using domain-based testid
    const careOption = page.getByTestId('care-option-daily');
    await expect(careOption).toBeVisible();
    await careOption.click();

    // Test backward navigation with onboarding-prev button
    const prevBtn = page.getByTestId('onboarding-prev');
    await expect(prevBtn).toBeVisible();
    await prevBtn.click();

    // Returned to Step 2 in place
    await expect(page.getByTestId('onboarding-step-2')).toBeVisible();
    await expect(page.getByTestId('onboarding-step-3')).not.toBeAttached();

    // Go forward again to Step 3
    await page.getByTestId('onboarding-next').click();
    await expect(page.getByTestId('onboarding-step-3')).toBeVisible();

    // Final Save and Continue ('Zapisz i przejdź')
    const saveBtn = page.getByTestId('onboarding-save-and-continue');
    await expect(saveBtn).toBeVisible();
    await expect(saveBtn).toHaveText(/Zapisz i przejdź/i);
    await saveBtn.click();

    // 5. Verify modal successfully closed and user is in the main app
    await expect(modal).not.toBeVisible();
  });

  test('can dismiss modal using close button when not first time onboarding', async ({ page }) => {
    // Seed localStorage as already having an existing spec
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
          pots: ['boxes_balcony_15cm'],
          care_time: 'daily',
        })
      );
    });

    await page.goto('/');

    const editBalconyBtn = page.getByRole('button', { name: /balkon/i }).first();
    const openSetupBtn = page.getByRole('button', { name: /Zmień parametry balkonu/i });
    const modal = page.getByTestId('onboarding-modal');

    // Helper to open setup modal from header
    const openModal = async () => {
      await expect(editBalconyBtn).toBeVisible();
      await editBalconyBtn.click();
      await expect(openSetupBtn).toBeVisible();
      await openSetupBtn.click();
      await expect(modal).toBeVisible();
    };

    // Open setup modal first time
    await openModal();

    // Verify modal is open with close button visible
    const closeBtn = page.getByTestId('onboarding-close');
    await expect(closeBtn).toBeVisible();
    await expect(closeBtn).toHaveAttribute('aria-label', 'Zamknij');
    await expect(closeBtn).toHaveAttribute('type', 'button');

    // 1. Dismiss via mouse click
    await closeBtn.click();
    await expect(modal).not.toBeVisible();

    // 2. Reopen modal and test keyboard Enter
    await openModal();
    await expect(closeBtn).toBeVisible();
    await closeBtn.focus();
    await expect(closeBtn).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(modal).not.toBeVisible();

    // 3. Reopen modal and test keyboard Space
    await openModal();
    await expect(closeBtn).toBeVisible();
    await closeBtn.focus();
    await expect(closeBtn).toBeFocused();
    await page.keyboard.press('Space');
    await expect(modal).not.toBeVisible();

    // 4. Reopen modal and test Escape key dismissal
    await openModal();
    await expect(modal).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('modal traps focus, marks background inert (preventing "Szukaj nowych upraw" activation), and passes axe-core accessibility checks', async ({ page }) => {
    await page.goto('/');

    const modal = page.getByTestId('onboarding-modal');
    await expect(modal).toBeVisible();

    // 1. Verify application background #root is marked inert and aria-hidden
    const root = page.locator('#root');
    await expect(root).toHaveAttribute('inert', '');
    await expect(root).toHaveAttribute('aria-hidden', 'true');

    // 2. Verify that background controls like "Szukaj nowych upraw" cannot be focused or activated
    const backgroundSearchBtn = page.locator('#tab-search-crops');
    await expect(backgroundSearchBtn).toBeAttached();

    // Background button is stripped from accessibility tree due to inert
    await expect(page.getByRole('button', { name: /Szukaj nowych upraw/i })).toHaveCount(0);

    // Clicking an inert element in Playwright throws because pointer events are blocked
    let clickError = null;
    try {
      await backgroundSearchBtn.click({ timeout: 1500 });
    } catch (e: any) {
      clickError = e;
    }
    expect(clickError).not.toBeNull();

    // 3. Automated accessibility check with axe-core
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#modal-root')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    // 4. Keyboard navigation & focus trap:
    // Tab multiple times and verify activeElement stays inside the modal dialog
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      const isInside = await modal.evaluate((node) => {
        return node.contains(document.activeElement) || node === document.activeElement;
      });
      expect(isInside).toBe(true);
    }

    // Shift+Tab multiple times and verify activeElement stays inside the modal dialog
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Shift+Tab');
      const isInside = await modal.evaluate((node) => {
        return node.contains(document.activeElement) || node === document.activeElement;
      });
      expect(isInside).toBe(true);
    }
  });

  test('sticky footer remains visible without scrolling across small viewports (mobile safari / small height)', async ({ page }) => {
    // Emulate small mobile viewport (e.g. mobile Safari 375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const modal = page.getByTestId('onboarding-modal');
    await expect(modal).toBeVisible();

    const footer = page.getByTestId('onboarding-footer');
    await expect(footer).toBeVisible();

    // Primary action is visible within viewport bounds without requiring scroll
    const nextBtn = page.getByTestId('onboarding-next');
    await expect(nextBtn).toBeVisible();

    const nextBox = await nextBtn.boundingBox();
    expect(nextBox).not.toBeNull();
    if (nextBox) {
      expect(nextBox.y + nextBox.height).toBeLessThanOrEqual(667);
      expect(nextBox.y).toBeGreaterThan(0);
    }

    // In step 1 with empty selection, visible helper message is displayed
    const helperMsg = page.getByTestId('onboarding-cta-helper');
    await expect(helperMsg).toBeVisible();
    await expect(helperMsg).toHaveText(/Wybierz województwo oraz piętro/i);

    // Emulate landscape or keyboard-open small height state (e.g. 500px viewport height)
    await page.setViewportSize({ width: 600, height: 500 });
    await page.waitForTimeout(100);

    // Verify footer and next button remain visible in viewport
    await expect(footer).toBeVisible();
    await expect(nextBtn).toBeVisible();
    const shortBox = await nextBtn.boundingBox();
    expect(shortBox).not.toBeNull();
    if (shortBox) {
      expect(shortBox.y + shortBox.height).toBeLessThanOrEqual(500);
      expect(shortBox.y).toBeGreaterThan(0);
    }
  });

  test('Step 2: progressive disclosure, non-blocking recommendation, and selecting option enables Dalej', async ({ page }) => {
    await page.goto('/');

    // Complete Step 1: select location (Pomorskie) and floor (Parter)
    await page.getByTestId('location-option-pomorskie').click();
    await page.getByTestId('floor-option-ground').click();
    await page.getByTestId('onboarding-next').click();

    // Verify on Step 2
    const step2 = page.getByTestId('onboarding-step-2');
    await expect(step2).toBeVisible();

    // 1. Non-blocking recommendation badge is shown
    const recommendationBadge = page.getByTestId('sunlight-recommended-badge');
    await expect(recommendationBadge).toBeVisible();
    await expect(recommendationBadge).toHaveText(/Rekomendowane/i);

    // 2. Recommendation must NOT auto-select option without user confirmation
    const nextBtn = page.getByTestId('onboarding-next');
    await expect(nextBtn).toBeDisabled();

    // Helper message explains selection is required
    const helperMsg = page.getByTestId('onboarding-cta-helper');
    await expect(helperMsg).toBeVisible();
    await expect(helperMsg).toHaveText(/Wybierz kierunek świata/i);

    // 3. Progressive disclosure: technical details are hidden by default
    const detailsSection = page.getByTestId('sunlight-details-full-sun');
    await expect(detailsSection).toHaveCount(0);

    // Click help control to expand details
    const helpBtn = page.getByTestId('sunlight-info-full-sun');
    await expect(helpBtn).toBeVisible();
    await helpBtn.click();

    // Now details section is visible with thermal info
    await expect(detailsSection).toBeVisible();
    await expect(detailsSection).toContainText('Południe (S)');

    // Toggle details closed via help button
    await helpBtn.click();
    await expect(detailsSection).toHaveCount(0);

    // 4. Selecting one sunlight option enables "Dalej" and updates selected state
    const fullSunOption = page.getByTestId('sunlight-option-full-sun');
    await fullSunOption.click();

    await expect(fullSunOption).toHaveAttribute('data-selected', 'true');
    await expect(fullSunOption).toContainText('Wybrano');
    await expect(nextBtn).toBeEnabled();
    await expect(helperMsg).not.toBeVisible();

    // 5. Proceed to Step 3 and submit
    await nextBtn.click();
    await expect(page.getByTestId('onboarding-step-3')).toBeVisible();

    const saveBtn = page.getByTestId('onboarding-save-and-continue');
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    // Modal closes and spec is saved to localStorage
    await expect(page.getByTestId('onboarding-modal')).not.toBeVisible();
    const savedSpecJson = await page.evaluate(() => localStorage.getItem('balkonowy_guest_spec'));
    expect(savedSpecJson).not.toBeNull();
    const savedSpec = JSON.parse(savedSpecJson!);
    expect(savedSpec.region).toBe('pomorskie');
    expect(savedSpec.floor).toBe(0);
    expect(savedSpec.orientation).toBe('S');
  });
});
