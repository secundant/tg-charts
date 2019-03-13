export function createElement(tag, attributes, ...children) {
  const element = document.createElement(tag);

  for (const attributeName of Object.keys(attributes)) {
    element.setAttribute(attributeName, attributes[attributeName]);
  }
  for (const child of children) {
    element.appendChild(child);
  }
  return element;
}

export const el = createElement;
