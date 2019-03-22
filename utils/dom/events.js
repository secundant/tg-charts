import { forEach, keys } from '../fn';

export const addListener = (element, key, handler) => element.addEventListener(key, handler, false);
export const listen = (element, keys, handler) => forEach(keys, key => addListener(element, key, handler));
export const subscribeToEvents = (target, handlers) =>
  forEach(keys(handlers), key => listen(target, key.split(' '), handlers[key]));
