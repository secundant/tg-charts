export function createElement(tag, attributes, children) {
  const element = document.createElement(tag);

  for (const attributeName of Object.keys(attributes)) {
    element.setAttribute(attributeName, attributes[attributeName]);
  }
  if (children) {
    for (const child of children) {
      element.appendChild(child);
    }
  }
  return element;
}

export function createElementNS(args, attributes) {
  const element = document.createElementNS(...args);

  for (const attributeName of Object.keys(attributes)) {
    element.setAttributeNS(null, attributeName, attributes[attributeName]);
  }
  return element;
}

export const el = createElement;
export const elNS = createElementNS;
