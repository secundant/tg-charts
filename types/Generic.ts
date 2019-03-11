export type OptionalKeys<T> = { [K in keyof T]: T extends Record<K, T[K]> ? never : K } extends {
    [_ in keyof T]: infer U
  }
  ? {} extends U
    ? never
    : U
  : never;

export type F0<R> = () => R;
export type F1<A1, R> = (a1: A1) => R;
export type F1Rest<A1, Args extends any[], R> = (a1: A1, ...args: Args) => R;
