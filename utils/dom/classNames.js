export const classNames = (classes = []) => classes.join(' ');

export const baseClassName = (...classes) =>
  (...optionalClassNames) => classNames([...classes, ...optionalClassNames]);
