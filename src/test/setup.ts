import '@testing-library/jest-dom';

// Polyfill window.matchMedia if not available in jsdom
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// Polyfill Element.prototype.scrollIntoView
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// Polyfill default mock for getBoundingClientRect
if (typeof Element !== 'undefined') {
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () {
    const rect = originalGetBoundingClientRect.call(this);
    if (rect.width === 0 && rect.height === 0) {
      // Return a valid bounding box inside viewport for visible elements in jsdom
      const isHidden =
        this.getAttribute('aria-hidden') === 'true' ||
        (this as HTMLElement).style?.display === 'none' ||
        (this as HTMLElement).style?.visibility === 'hidden' ||
        this.classList?.contains('hidden') ||
        this.classList?.contains('invisible');

      if (!isHidden) {
        return {
          top: 100,
          left: 100,
          bottom: 150,
          right: 300,
          width: 200,
          height: 50,
          x: 100,
          y: 100,
          toJSON: () => {},
        };
      }
    }
    return rect;
  };
}
