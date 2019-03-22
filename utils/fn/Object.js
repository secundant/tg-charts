export const keys = Object.keys;

export const mapObject = (object, fn) => keys(object).map(key => fn(key, object[key]));
