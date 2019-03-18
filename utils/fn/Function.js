export const identity = v => v;

export const pipe = (...fns) => val =>
  fns.reduce((acc, fn) => fn(acc), val);
