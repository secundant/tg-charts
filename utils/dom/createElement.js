import { appendChildren } from './append';
import { mapObject } from '../fn';

export const createElementWithClassName = (className, children = [], tag = 'div', attributes = {}) => el(tag, {
  class: className,
  ...attributes
}, children);

export const attributesNS = (element, attributes) => mapObject(attributes, element.setAttributeNS.bind(element, null));

export const el = (tag = '', attributes = {}, children = []) => {
  const element = document.createElement(tag);

  mapObject(attributes, element.setAttribute.bind(element));
  appendChildren(element, children);
  return element;
};

export const elNS = (tag, attributes = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);

  attributesNS(element, attributes);
  return element;
};
