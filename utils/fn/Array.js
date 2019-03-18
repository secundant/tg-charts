export const toArray = val => (Array.isArray(val) ? val : [val]);

export const isTruthy = val => !!val;

export const isFalsy = val => !val;

export const compact = (arr = []) => arr.filter(isTruthy);

export const flatten = (list = []) =>
  list.reduce((acc, item) => acc.concat(Array.isArray(item) ? flatten(item) : item), []);
