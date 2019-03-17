/**
 * @param {* | *[]} value
 * @returns {*[]}
 */
export const toArray = value => Array.isArray(value) ? value : [value];
export const compact = value => value ? value.filter(isTrueLike) : [];
export const isFalseLike = value => !value;
export const isTrueLike = value => !!value;
export const flatten = list => list.reduce((result, item) => {
  if (Array.isArray(item)) {
    list.push(...flatten(item));
  } else {
    list.push(item);
  }
  return result;
}, []);
