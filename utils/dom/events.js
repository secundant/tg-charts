export function subscribeToEvents(target, handlers) {
  const keys = Object.keys(handlers);

  keys.forEach(name => target.addEventListener(name, handlers[name], false));
  return () => keys.forEach(name => target.removeEventListener(name, handlers[name], false))
}
