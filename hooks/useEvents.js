import { useLayoutEffect, useMemo } from 'react';

export function useEvents(element, createHandlers, deps) {
  const allDeps = deps ? deps.concat(element) : [element];
  const handlers = useMemo(() => {
    if (!element) return null;
    return createHandlers();
  }, allDeps);

  useLayoutEffect(() => {
    if (!handlers || !element) return;
    const entries = Object.entries(handlers);

    entries.forEach(([key, handler]) => element.addEventListener(key, handler, false));
    return () => entries.forEach(([key, handler]) => element.removeEventListener(key, handler, false));
  }, allDeps);
}
