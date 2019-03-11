export const toArray = value => Array.isArray(value) ? value : [value];
export const compact = value => value ? value.filter(isTrueLike) : [];
export const isFalseLike = value => !value;
export const isTrueLike = value => !!value;
