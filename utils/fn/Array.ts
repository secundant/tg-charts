export const toArray = <T>(value: T | T[]): T[] | [T] => Array.isArray(value) ? value : [value];
export const compact = <T>(value: Array<T | FalseLike> | Nil): T[] => value ? value.filter(isTrueLike) : [];
export const isFalseLike = (value: any): value is FalseLike => !value;
export const isTrueLike = (value: any): value is TrueLike => !!value;

export type Nil = void | undefined | null;
export type TrueLike = Exclude<any, FalseLike>;
export type FalseLike = Nil | false | '' | 0;
