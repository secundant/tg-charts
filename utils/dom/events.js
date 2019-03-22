import { forEach } from '../fn';

export const addListener = (element, key, handler) => element.addEventListener(key, handler, false);
export const listen = (element, keys, handler) => forEach(keys, key => addListener(element, key, handler));

export function subscribeToEvents(target, handlers) {
  const keys = Object.keys(handlers);

  forEach(keys, key => addListener(target, key, handlers[key]));
  return () => keys.forEach(name => target.removeEventListener(name, handlers[name], false))
}
