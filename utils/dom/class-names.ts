import { flatten } from 'lodash';
import { compact, FalseLike, keys } from '~/utils';
import { Dictionary, join, pipe } from 'ramda';
import { F1, F1Rest } from '~/types';

export const joinClassNames = pipe<DirtyClassNamesList, Array<string | FalseLike>, string[], string>(
  flatten,
  compact,
  join(' ')
);
export const cn = joinClassNames;

export const baseClassName = (...classNames: DirtyClassNamesList) => {
  const className = cn(classNames);

  return (...optionalClassNames: DirtyClassNamesList) => cn(optionalClassNames.concat(className));
};
export const wrapClassName = (...classNames: DirtyClassNamesList): F1Rest<boolean, DirtyClassNamesList, string | null> => {
  const className = cn(classNames);

  return (value, ...optionalClassNames: DirtyClassNamesList) => {
    const originalClassName = value ? className : null;

    return optionalClassNames.length ? cn(optionalClassNames.concat(originalClassName)) : originalClassName;
  };
};
export const withClassNames = <T extends Dictionary<boolean>>(
  classNamesMap: Record<keyof T, string>
): F1<T, string> => {
  const classNamesKeys = keys(classNamesMap);

  return (value, ...optionalClassNames: DirtyClassNamesList) =>
    cn(optionalClassNames.concat(classNamesKeys.map(key => (value[key] ? classNamesMap[key] : null))));
};

export type DirtyClassNamesList = Array<string | FalseLike | Array<string | FalseLike>>;
