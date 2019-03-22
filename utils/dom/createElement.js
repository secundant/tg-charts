import { appendChildren } from './append';

export const createElementWithClassName = (className, children = [], tag = 'div') => el(tag, {
  class: className
}, children);

export const el = (tag = '', attributes = {}, children = []) => {
  const element = document.createElement(tag);

  for (const attributeName of Object.keys(attributes)) {
    element.setAttribute(attributeName, attributes[attributeName]);
  }

  appendChildren(element, children);
  return element;
};

export const elNS = (args = [], attributes = {}) => {
  const element = document.createElementNS(...args);

  for (const attributeName of Object.keys(attributes)) {
    element.setAttributeNS(null, attributeName, attributes[attributeName]);
  }

  return element;
};
