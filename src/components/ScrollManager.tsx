import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Route-level scroll handling for the SPA:
 * - "/" and route changes start at the top,
 * - a hash link (e.g. the bottom bar's `#tool-directory`) scrolls to its target
 *   once the destination has rendered.
 */
export const ScrollManager: React.FC = () => {
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        const timer = window.setTimeout(
          () => target.scrollIntoView({ behavior: 'smooth', block: 'start' }),
          40,
        );
        return () => window.clearTimeout(timer);
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash, search]);

  return null;
};
