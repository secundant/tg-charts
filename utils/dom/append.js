export const appendChildren = (element, nodes) => nodes.forEach(node => appendChild(element, node));
export const appendChild = (element, child) => element.appendChild(child);
export const prepend = (element, ...children) => element.prepend(...children);
export const removeChild = (element, node) => element.removeChild(node);
export const removeChildren = (element, nodes) => nodes.forEach(node => removeChild(element, node));
