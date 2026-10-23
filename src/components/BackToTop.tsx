import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export interface BackToTopProps {
  threshold?: number;
  className?: string;
  'aria-label'?: string;
  forceVisible?: boolean;
}

export function BackToTopButton({
  threshold = 400,
  className = '',
  'aria-label': ariaLabel = 'Wróć do góry',
  forceVisible = false,
}: BackToTopProps = {}) {
  const [visible, setVisible] = useState(forceVisible);

  useEffect(() => {
    if (forceVisible) {
      setVisible(true);
      return;
    }
    const toggleVisible = () => setVisible(window.scrollY > threshold);
    window.addEventListener('scroll', toggleVisible, { passive: true });
    // Check initial scroll position
    toggleVisible();
    return () => window.removeEventListener('scroll', toggleVisible);
  }, [threshold, forceVisible]);

  if (!visible) return null;
  return (
    <button
      id="back-to-top-btn"
      data-testid="back-to-top-btn"
      data-alias-testid="scroll-to-top-btn"
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`fixed bottom-6 right-6 z-40 p-3 bg-zinc-900 text-white rounded-full shadow-lg hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 focus:ring-2 focus:ring-emerald-500 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer ${className}`.trim()}
    >
      <ChevronUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}

export const BackToTop = BackToTopButton;
export default BackToTopButton;
