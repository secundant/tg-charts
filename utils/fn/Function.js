export const identity = v => v;

export const pipe = (...fns) => val =>
  fns.reduce((acc, fn) => fn(acc), val);

export const memoize = (fn, getKey = identity) => {
  const cache = new Map();

  return (...args) => {
    const key = getKey(...args);

    if (cache.has(key)) return cache.get(key);
    const value = fn(...args);

    cache.set(key, value);
    return value;
  }
};
