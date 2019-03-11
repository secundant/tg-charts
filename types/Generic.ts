export type OptionalKeys<T> = { [K in keyof T]: T extends Record<K, T[K]> ? never : K } extends {
    [_ in keyof T]: infer U
  }
  ? {} extends U
    ? never
    : U
  : never;

export type PickOptional<T> = {
  [Key in OptionalKeys<T>]: T[Key];
}

export type F0<R = any> = () => R;
export type F1<A1 = any, R = any> = (a1: A1) => R;
export type F1Rest<A1 = any, Args extends any[] = any[], R = any> = (a1: A1, ...args: Args) => R;
