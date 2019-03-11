import { F0 } from '~/types';
import { useEffect } from 'react';

export function useResize(handler: F0) {
  useEffect(() => {
    if (!window) return;
    window.addEventListener('resize', handler, false);
    return () => window.removeEventListener('resize', handler, false);
  }, [handler])
}
