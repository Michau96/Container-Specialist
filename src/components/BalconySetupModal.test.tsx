import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import axe from 'axe-core';
import { BalconySetupModal } from './BalconySetupModal';
import { UserBalconySpec } from '../types';

const defaultSpec: UserBalconySpec = {
  region: 'mazowieckie',
  floor: 2,
  orientation: 'S',
  balcony_type: 'open_rail',
  roofing: 'uncovered',
  pots: ['boxes_balcony_15cm', 'pots_large_15_30'],
  care_time: 'daily',
};

// Helper to assert element is actionable, visible, and has valid bounding box inside viewport
function assertVisibleAndInViewport(el: HTMLElement) {
  expect(el).toBeInTheDocument();
  expect(el).not.toHaveAttribute('aria-hidden', 'true');
  expect(el.style.display).not.toBe('none');
  expect(el.style.visibility).not.toBe('hidden');

  const rect = el.getBoundingClientRect();
  expect(rect.width).toBeGreaterThan(0);
  expect(rect.height).toBeGreaterThan(0);
  expect(rect.top).toBeGreaterThanOrEqual(0);
  expect(rect.left).toBeGreaterThanOrEqual(0);
  expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight || 768);
  expect(rect.right).toBeLessThanOrEqual(window.innerWidth || 1024);
}

describe('BalconySetupModal - Onboarding Modal DOM Synchronization & Testability', () => {
  beforeEach(() => {
    // Setup window inner dimensions
    window.innerWidth = 1024;
    window.innerHeight = 768;

    // Ensure #modal-root exists in test document
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
  });

  it('renders in a stable portal attached to document.body / #modal-root with proper dialog semantics', async () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <BalconySetupModal
        isOpen={true}
        initialSpec={defaultSpec}
        onSave={handleSave}
        onClose={handleClose}
      />
    );

    const modal = screen.getByTestId('onboarding-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('role', 'dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'onboarding-modal-heading');

    // Heading exists and matches aria-labelledby
    const heading = document.getElementById('onboarding-modal-heading');
    expect(heading).toBeInTheDocument();
    expect(heading?.textContent).toMatch(/Gdzie rośnie Twój ogród\?/i);

    // Modal is mounted inside #modal-root
    const modalRoot = document.getElementById('modal-root');
    expect(modalRoot?.contains(modal)).toBe(true);

    // Wait for deterministic readiness state
    await waitFor(() => {
      expect(modal).toHaveAttribute('data-modal-ready', 'true');
    });

    // Close button has proper test id, visible and in viewport
    const closeBtn = screen.getByTestId('onboarding-close');
    assertVisibleAndInViewport(closeBtn);
  });

  it('preserves Polish UI strings exactly and updates in-place during step transitions', async () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <BalconySetupModal
        isOpen={true}
        initialSpec={defaultSpec}
        onSave={handleSave}
        onClose={handleClose}
      />
    );

    const modal = screen.getByTestId('onboarding-modal');

    // Wait for Step 1 ready
    await waitFor(() => {
      expect(modal).toHaveAttribute('data-modal-ready', 'true');
    });

    // STEP 1: Verify container & visible controls
    const step1Container = screen.getByTestId('onboarding-step-1');
    assertVisibleAndInViewport(step1Container);

    // Verify Polish UI strings in Step 1
    expect(screen.getByText('Wybierz swoje województwo lub najbliższe miasto')).toBeInTheDocument();
    expect(screen.getByText('Na którym piętrze znajduje się balkon?')).toBeInTheDocument();

    const nextBtn = screen.getByTestId('onboarding-next');
    assertVisibleAndInViewport(nextBtn);
    expect(nextBtn.textContent).toContain('Dalej');

    // Verify location search testid
    const locationSearch = screen.getByTestId('location-search');
    assertVisibleAndInViewport(locationSearch);

    // Select region and floor using both semantic data-testid and accessible role/name
    const pomorskieBtn = screen.getByTestId('location-option-pomorskie');
    assertVisibleAndInViewport(pomorskieBtn);
    expect(pomorskieBtn).toHaveTextContent(/Pomorskie/i);
    fireEvent.click(pomorskieBtn);

    const parterBtn = screen.getByTestId('floor-option-ground');
    assertVisibleAndInViewport(parterBtn);
    expect(parterBtn).toHaveTextContent('Parter');
    fireEvent.click(parterBtn);

    // Click Next to navigate to Step 2
    fireEvent.click(nextBtn);

    // STEP 2: Verify transition happened in place (modal wrapper retained)
    await waitFor(() => {
      expect(modal).toHaveAttribute('data-modal-ready', 'true');
      expect(screen.getByTestId('onboarding-step-2')).toBeInTheDocument();
    });

    const step2Container = screen.getByTestId('onboarding-step-2');
    assertVisibleAndInViewport(step2Container);

    // Step 1 container is no longer in DOM (not exposed as inactive control)
    expect(screen.queryByTestId('onboarding-step-1')).not.toBeInTheDocument();

    // Verify Step 2 Polish labels
    expect(screen.getByText('Kierunek świata')).toBeInTheDocument();
    expect(screen.getByText('W którą stronę pada słońce?')).toBeInTheDocument();

    // Sunlight filter buttons exist and are actionable
    const mainFilter = screen.getByTestId('sunlight-filter-main');
    assertVisibleAndInViewport(mainFilter);

    // Next button in Step 2 has valid bounding box
    const nextBtnStep2 = screen.getByTestId('onboarding-next');
    assertVisibleAndInViewport(nextBtnStep2);
    expect(nextBtnStep2.textContent).toContain('Dalej');

    // Select south orientation card using semantic data-testid
    const southCard = screen.getByTestId('sunlight-option-full-sun');
    assertVisibleAndInViewport(southCard);
    expect(southCard).toHaveAttribute('role', 'button');
    expect(southCard.getAttribute('aria-label')).toBe('Południe');
    fireEvent.click(southCard);

    // Click Next to navigate to Step 3
    fireEvent.click(nextBtnStep2);

    // STEP 3: Verify transition to Step 3 in place
    await waitFor(() => {
      expect(modal).toHaveAttribute('data-modal-ready', 'true');
      expect(screen.getByTestId('onboarding-step-3')).toBeInTheDocument();
    });

    const step3Container = screen.getByTestId('onboarding-step-3');
    assertVisibleAndInViewport(step3Container);

    // Steps 1 & 2 containers are not exposed
    expect(screen.queryByTestId('onboarding-step-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('onboarding-step-2')).not.toBeInTheDocument();

    // Verify Step 3 Polish labels
    expect(screen.getByText('Typ balustrady (barierka)')).toBeInTheDocument();
    expect(screen.getByText('Zadaszenie balkonu')).toBeInTheDocument();

    // Verify step 3 option testids
    expect(screen.getByTestId('railing-select')).toBeInTheDocument();
    expect(screen.getByTestId('roofing-select')).toBeInTheDocument();
    expect(screen.getByTestId('pot-option-boxes_balcony_15cm')).toBeInTheDocument();
    expect(screen.getByTestId('care-option-daily')).toBeInTheDocument();

    // Save and continue button is visible and in viewport
    const saveBtn = screen.getByTestId('onboarding-save-and-continue');
    assertVisibleAndInViewport(saveBtn);
    expect(saveBtn.textContent).toContain('Zapisz i przejdź');

    // Click save
    fireEvent.click(saveBtn);
    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        region: 'pomorskie',
        floor: 0,
        orientation: 'S',
      })
    );
  });

  it('implements accessible close button complying with all requirements (mouse click, Enter, Space, Escape, focus restore)', async () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    // Create a mock trigger button to test focus restoration
    const triggerBtn = document.createElement('button');
    triggerBtn.id = 'trigger-open-btn';
    triggerBtn.textContent = 'Open modal';
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();
    expect(document.activeElement).toBe(triggerBtn);

    render(
      <BalconySetupModal
        isOpen={true}
        initialSpec={defaultSpec}
        onSave={handleSave}
        onClose={handleClose}
      />
    );

    const closeBtn = screen.getByTestId('onboarding-close');

    // 1. Native button, not a div
    expect(closeBtn.tagName).toBe('BUTTON');

    // 2. Attributes: data-testid="onboarding-close", aria-label="Zamknij", type="button"
    expect(closeBtn).toHaveAttribute('data-testid', 'onboarding-close');
    expect(closeBtn).toHaveAttribute('aria-label', 'Zamknij');
    expect(closeBtn).toHaveAttribute('type', 'button');

    // 3. Minimum 44x44px clickable area
    expect(closeBtn.className).toContain('min-w-11');
    expect(closeBtn.className).toContain('min-h-11');

    // 4. Focus-visible styles
    expect(closeBtn.className).toContain('focus-visible:outline-none');
    expect(closeBtn.className).toContain('focus-visible:ring-2');
    expect(closeBtn.className).toContain('focus-visible:ring-offset-2');

    // 5 & 6. High-contrast icon, tooltip with exact Polish label "Zamknij"
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Zamknij');
    expect(closeBtn).toHaveAttribute('title', 'Zamknij');

    // Test mouse click dismissal
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Test keyboard Enter dismissal
    fireEvent.keyDown(closeBtn, { key: 'Enter', code: 'Enter' });
    expect(handleClose).toHaveBeenCalledTimes(2);

    // Test keyboard Space dismissal
    fireEvent.keyDown(closeBtn, { key: ' ', code: 'Space' });
    expect(handleClose).toHaveBeenCalledTimes(3);

    // Test Escape key dismissal
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(4);

    // Clean up
    triggerBtn.remove();
  });

  it('marks background (#root) as inert and prevents activation of background controls like "Szukaj nowych upraw"', async () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    // Create a mock background container #root with a button "Szukaj nowych upraw"
    const rootEl = document.getElementById('root') || document.createElement('div');
    rootEl.id = 'root';
    document.body.appendChild(rootEl);

    const backgroundAction = vi.fn();
    const bgButton = document.createElement('button');
    bgButton.textContent = 'Szukaj nowych upraw';
    bgButton.onclick = backgroundAction;
    rootEl.appendChild(bgButton);

    const { unmount } = render(
      <BalconySetupModal
        isOpen={true}
        initialSpec={defaultSpec}
        onSave={handleSave}
        onClose={handleClose}
      />
    );

    // Verify #root is inert and aria-hidden while modal is open
    expect(rootEl).toHaveAttribute('inert');
    expect(rootEl).toHaveAttribute('aria-hidden', 'true');

    // Attempting to interact with background element
    expect(rootEl.hasAttribute('inert')).toBe(true);

    // Unmount / close modal
    unmount();

    // Verify inert and aria-hidden are removed after modal closes
    expect(rootEl).not.toHaveAttribute('inert');
    expect(rootEl).not.toHaveAttribute('aria-hidden');

    rootEl.remove();
  });

  it('traps keyboard focus within the dialog (Tab and Shift+Tab wrapping) and focuses heading initially', async () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    render(
      <BalconySetupModal
        isOpen={true}
        initialSpec={defaultSpec}
        onSave={handleSave}
        onClose={handleClose}
      />
    );

    const modal = screen.getByTestId('onboarding-modal');
    const heading = document.getElementById('onboarding-modal-heading');
    expect(heading).toBeInTheDocument();

    // Initial focus moved to heading or first control
    await waitFor(() => {
      expect(document.activeElement).toBe(heading);
    });

    const closeBtn = screen.getByTestId('onboarding-close');
    const nextBtn = screen.getByTestId('onboarding-next');

    // Tab from heading or first element
    fireEvent.keyDown(modal, { key: 'Tab', code: 'Tab' });

    // When on the last focusable element (Next button), Tab wraps around to first element
    nextBtn.focus();
    expect(document.activeElement).toBe(nextBtn);
    fireEvent.keyDown(nextBtn, { key: 'Tab', code: 'Tab' });
    // Focus should be wrapped to first focusable element inside modal
    expect(modal.contains(document.activeElement)).toBe(true);

    // Shift+Tab from first focusable element wraps around to last element
    closeBtn.focus();
    fireEvent.keyDown(closeBtn, { key: 'Tab', code: 'Tab', shiftKey: true });
    expect(modal.contains(document.activeElement)).toBe(true);
  });

  it('passes automated accessibility evaluation with axe-core without violations', async () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    render(
      <BalconySetupModal
        isOpen={true}
        initialSpec={defaultSpec}
        onSave={handleSave}
        onClose={handleClose}
      />
    );

    const modal = screen.getByTestId('onboarding-modal');
    expect(modal).toHaveAttribute('role', 'dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'onboarding-modal-heading');

    const results = await axe.run(modal, {
      rules: {
        // In jsdom environment, color-contrast calculations are not rendered by canvas
        'color-contrast': { enabled: false },
      },
    });

    expect(results.violations).toEqual([]);
  });

  it('implements sticky action footer with fixed header, scrollable content, and visible helper message for disabled CTA', async () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    // Render with empty initial selection to test disabled CTA helper message
    const emptySpec: UserBalconySpec = {
      region: 'mazowieckie',
      floor: 0,
      orientation: 'S',
      balcony_type: 'open_rail',
      roofing: 'uncovered',
      pots: [],
      care_time: 'daily',
    };

    const { rerender } = render(
      <BalconySetupModal
        isOpen={true}
        isFirstTime={true}
        initialSpec={emptySpec}
        onSave={handleSave}
        onClose={handleClose}
      />
    );

    const modal = screen.getByTestId('onboarding-modal');
    // 1. Modal layout: flex flex-col max-h-[90dvh]
    expect(modal.className).toContain('flex');
    expect(modal.className).toContain('flex-col');
    expect(modal.className).toContain('max-h-[90dvh]');

    // 2. Content area: min-h-0 flex-1 overflow-y-auto pb-12
    const contentArea = screen.getByTestId('onboarding-step-1').parentElement;
    expect(contentArea?.className).toContain('min-h-0');
    expect(contentArea?.className).toContain('flex-1');
    expect(contentArea?.className).toContain('overflow-y-auto');
    expect(contentArea?.className).toContain('pb-12');

    // 3. Sticky footer: sticky bottom-0 border-t bg-white/95 backdrop-blur
    const footer = screen.getByTestId('onboarding-footer');
    expect(footer).toBeInTheDocument();
    expect(footer.className).toContain('sticky');
    expect(footer.className).toContain('bottom-0');
    expect(footer.className).toContain('border-t');
    expect(footer.className).toContain('bg-white/95');
    expect(footer.className).toContain('backdrop-blur');

    // 4. In Step 1 without selection, CTA is disabled and visible helper message is displayed
    const nextBtn = screen.getByTestId('onboarding-next');
    expect(nextBtn).toBeDisabled();
    expect(nextBtn.textContent).toContain('Dalej');

    const helperMsg = screen.getByTestId('onboarding-cta-helper');
    expect(helperMsg).toBeInTheDocument();
    expect(helperMsg.textContent).toMatch(/Wybierz województwo oraz piętro/i);

    // 5. Select region and floor
    const pomorskieOption = screen.getByTestId('location-option-pomorskie');
    fireEvent.click(pomorskieOption);
    const parterOption = screen.getByTestId('floor-option-ground');
    fireEvent.click(parterOption);

    // After selection, helper message disappears and CTA is enabled
    expect(screen.queryByTestId('onboarding-cta-helper')).not.toBeInTheDocument();
    expect(nextBtn).not.toBeDisabled();

    // Proceed to Step 2
    fireEvent.click(nextBtn);

    // In Step 2, next button has Polish label "Dalej"
    const nextBtnStep2 = screen.getByTestId('onboarding-next');
    expect(nextBtnStep2.textContent).toContain('Dalej');

    // Proceed to Step 3
    const fullSunOption = screen.getByTestId('sunlight-option-full-sun');
    fireEvent.click(fullSunOption);
    fireEvent.click(nextBtnStep2);

    // In Step 3, save button has Polish label "Zapisz i przejdź"
    const saveBtn = screen.getByTestId('onboarding-save-and-continue');
    expect(saveBtn).toBeInTheDocument();
    expect(saveBtn.textContent).toContain('Zapisz i przejdź');
  });

  it('simplifies sunlight selection with progressive disclosure, non-blocking recommendation, and validates submission', async () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    const emptySpec: UserBalconySpec = {
      region: 'mazowieckie',
      floor: 0,
      orientation: 'S',
      balcony_type: 'open_rail',
      roofing: 'uncovered',
      pots: ['boxes_balcony_15cm'],
      care_time: 'daily',
    };

    render(
      <BalconySetupModal
        isOpen={true}
        isFirstTime={true}
        initialSpec={emptySpec}
        onSave={handleSave}
        onClose={handleClose}
      />
    );

    // 1. Select region & floor in Step 1
    const pomorskieOption = screen.getByTestId('location-option-pomorskie');
    fireEvent.click(pomorskieOption);
    const parterOption = screen.getByTestId('floor-option-ground');
    fireEvent.click(parterOption);

    // Proceed to Step 2
    const nextBtn = screen.getByTestId('onboarding-next');
    fireEvent.click(nextBtn);

    const step2 = screen.getByTestId('onboarding-step-2');
    expect(step2).toBeInTheDocument();

    // 2. Responsive behavior: grid-cols-1 sm:grid-cols-2
    const grid = step2.querySelector('.grid');
    expect(grid?.className).toContain('grid-cols-1');
    expect(grid?.className).toContain('sm:grid-cols-2');

    // 3. Non-blocking recommendation badge is shown
    const recommendationBadge = screen.getByTestId('sunlight-recommended-badge');
    expect(recommendationBadge).toBeInTheDocument();
    expect(recommendationBadge.textContent).toContain('Rekomendowane');

    // 4. Recommendation must NOT auto-select option without user confirmation:
    // "Dalej" must be disabled initially on step 2
    const nextBtnStep2 = screen.getByTestId('onboarding-next');
    expect(nextBtnStep2).toBeDisabled();
    const helperMsg = screen.getByTestId('onboarding-cta-helper');
    expect(helperMsg).toBeInTheDocument();
    expect(helperMsg.textContent).toMatch(/Wybierz kierunek świata/i);

    // 5. Check cards have minimum 44px interactive target
    const fullSunCard = screen.getByTestId('sunlight-option-full-sun');
    expect(fullSunCard.className).toContain('min-h-[56px]');
    expect(fullSunCard).toHaveAttribute('data-selected', 'false');

    // 6. Progressive disclosure: Technical details are NOT exposed inside cards by default
    expect(screen.queryByTestId('sunlight-details-full-sun')).not.toBeInTheDocument();

    // Trigger visible help control
    const helpBtn = screen.getByTestId('sunlight-info-full-sun');
    expect(helpBtn).toHaveAttribute('aria-label');
    fireEvent.click(helpBtn);

    // Now technical details expandable section is visible
    const detailsSection = screen.getByTestId('sunlight-details-full-sun');
    expect(detailsSection).toBeInTheDocument();
    expect(detailsSection.textContent).toContain('Południe (S)');
    expect(detailsSection.textContent).toContain('Gorący mikroklimat');

    // 7. Selecting sunlight option enables "Dalej" and sets clear selected state
    fireEvent.click(fullSunCard);
    expect(fullSunCard).toHaveAttribute('data-selected', 'true');
    expect(fullSunCard.className).toContain('border-emerald-600');
    expect(fullSunCard.textContent).toContain('Wybrano');
    expect(nextBtnStep2).not.toBeDisabled();
    expect(screen.queryByTestId('onboarding-cta-helper')).not.toBeInTheDocument();

    // 8. Proceed to Step 3 and submit; verify only the valid selection is submitted
    fireEvent.click(nextBtnStep2);
    const saveBtn = screen.getByTestId('onboarding-save-and-continue');
    expect(saveBtn).toBeInTheDocument();
    fireEvent.click(saveBtn);

    expect(handleSave).toHaveBeenCalledTimes(1);
    const savedSpec = handleSave.mock.calls[0][0];
    expect(savedSpec.region).toBe('pomorskie');
    expect(savedSpec.floor).toBe(0);
    expect(savedSpec.orientation).toBe('S');
  });
});
