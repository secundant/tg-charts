export const classNames = (classes = []) => classes.join(' ');

export const baseClassName = (...classes) => (...optionalClassNames) => classNames([...classes, ...optionalClassNames]);

export const CLASS_LIST_METHOD_ADD = 'add';
export const CLASS_LIST_METHOD_REMOVE = 'remove';
export const CLASS_LIST_METHOD_TOGGLE = 'toggle';

export const applyClassList = (element, className, method) => element.classList[method](className);
export const setClassName = (element, className, add) =>
  applyClassList(element, className, add ? CLASS_LIST_METHOD_ADD : CLASS_LIST_METHOD_REMOVE);
export const addClassName = (element, className) => applyClassList(element, className, CLASS_LIST_METHOD_ADD);
