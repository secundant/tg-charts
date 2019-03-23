export const CLASS_LIST_METHOD_ADD = 'add';
export const CLASS_LIST_METHOD_REMOVE = 'remove';
export const CLASS_LIST_METHOD_TOGGLE = 'toggle';

export const applyClassList = (element, className, method) => element.classList[method](className);
export const setClassName = (element, className, add) =>
  applyClassList(element, className, add ? CLASS_LIST_METHOD_ADD : CLASS_LIST_METHOD_REMOVE);
