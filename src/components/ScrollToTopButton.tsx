import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export interface ScrollToTopButtonProps {
  className?: string;
  threshold?: number;
  'aria-label'?: string;
  forceVisible?: boolean;
}

/**
 * Floating ScrollToTopButton component
 * - Rendered with fixed bottom-6 right-6 z-40 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition-all duration-300
 * - Toggles visibility using window.scrollY > 400
 * - Triggers smooth scrolling via window.scrollTo({ top: 0, behavior: 'smooth' })
 * - Maintains min 44x44px touch targets on mobile viewports
 */
export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  className = '',
  threshold = 400,
  'aria-label': ariaLabel = 'Przewiń do góry',
  forceVisible = false,
}) => {
  const [isVisible, setIsVisible] = useState(forceVisible);

  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }

    const checkScroll = () => {
      if (typeof window !== 'undefined') {
        setIsVisible(window.scrollY > threshold);
      }
    };

    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', checkScroll);
    };
  }, [threshold, forceVisible]);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      id="scroll-to-top-btn"
      data-testid="scroll-to-top-btn"
      type="button"
      onClick={scrollToTop}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`fixed bottom-6 right-6 z-40 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${className}`}
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
};

export default ScrollToTopButton;
