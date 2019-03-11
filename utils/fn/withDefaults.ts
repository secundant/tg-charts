import { F1, OptionalKeys } from '~/types';

export const withDefaults = <T extends {}>(defaults: OptionalKeys<T>): F1<T, Required<T>> => overrides => ({
  ...defaults,
  ...overrides
});
