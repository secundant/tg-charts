import { useEffect } from 'react';

export function useResize(handler) {
  useEffect(() => {
    if (!window) return;
    window.addEventListener('resize', handler, false);
    return () => window.removeEventListener('resize', handler, false);
  }, [handler])
}
