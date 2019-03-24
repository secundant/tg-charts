export const profile = name => {
  performance.mark(name + '.start');
};
export const profileEnd = name => {
  performance.mark(name + '.end');
  performance.measure(name, name + '.start', name + '.end');
};
export const withProfile = (name, fn) => (...args) => {
  profile(name);
  const result = fn(...args);

  Object.defineProperty(fn, 'name', {
    value: name
  });
  profileEnd(name);
  return result;
};
