import { compact, flatten } from 'lodash';
import { join, pipe } from 'ramda';

export const joinClassNames = pipe(
  flatten,
  compact,
  join(' ')
);
export const cn = joinClassNames;

export const baseClassName = (...classNames) => {
  const className = cn(classNames);

  return (...optionalClassNames) => cn(optionalClassNames.concat(className));
};
export const wrapClassName = (...classNames) => {
  const className = cn(classNames);

  return (value, ...optionalClassNames) => {
    const originalClassName = value ? className : null;

    return optionalClassNames.length ? cn(optionalClassNames.concat(originalClassName)) : originalClassName;
  };
};
export const withClassNames = classNamesMap => {
  const classNamesKeys = keys(classNamesMap);

  return (value, ...optionalClassNames) =>
    cn(optionalClassNames.concat(classNamesKeys.map(key => (value[key] ? classNamesMap[key] : null))));
};
