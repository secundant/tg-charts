export function styles(dictionary) {
  return Object.keys(dictionary).reduce((result, key) => {
    result[key] = createStyle(dictionary[key]);
    return result;
  }, {});
}

export function createStyle(dictionary) {
  return Object.keys(dictionary).reduce((result, key) => {
    result.push(`${key}:${dictionary[key]}`);
    return result;
  }, []).join(';');
}

export const OFFSET_REGULAR = '16px';
export const OFFSET_GLOBAL_SIDE = OFFSET_REGULAR;
