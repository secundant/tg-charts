import { appendChildren } from './append';
import { mapObject } from '../fn';

export const createElementWithClassName = (className, children = [], tag = 'div') => el(tag, {
  class: className
}, children);

export const attributesNS = (element, attributes) => mapObject(attributes, element.setAttributeNS.bind(element, null));

export const el = (tag = '', attributes = {}, children = []) => {
  const element = document.createElement(tag);

  mapObject(attributes, element.setAttribute.bind(element));
  appendChildren(element, children);
  return element;
};

export const elNS = (args = [], attributes = {}) => {
  const element = document.createElementNS(...args);

  attributesNS(element, attributes);
  return element;
};
