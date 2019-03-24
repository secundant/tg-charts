import { withProfile } from '../profiler';

export const appendChildren = (element, nodes) => nodes.forEach(node => appendChild(element, node));
export const appendChild = (element, child) => element.appendChild(child);
export const prepend = withProfile('prepend', (element, ...children) => element.prepend(...children));
export const removeChild = withProfile('removeChild', (element, node) => element.removeChild(node));
export const removeChildren = (element, nodes) => nodes.forEach(node => removeChild(element, node));
export const toggleWithPrepend = (element, node, condition) =>
  condition ? prepend(element, node) : element.contains(node) && removeChild(element, node);
export const toggleWithAppend = (element, node, condition) =>
  condition ? appendChild(element, node) : element.contains(node) && removeChild(element, node);
