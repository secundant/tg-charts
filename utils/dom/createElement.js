import { appendChildren } from './append';
import { mapObject } from '../fn';
import { withProfile } from '../profiler';

export const createElementWithClassName = (className, children = [], tag = 'div', attributes = {}) => el(tag, {
  class: className,
  ...attributes
}, children);

export const setAttributeNS = (element, key, value) => element.setAttributeNS(null, key, value);

export const attributesNS = (element, attributes) => mapObject(attributes, setAttributeNS.bind(null, element));

export const el = (tag = '', attributes = {}, children = []) => {
  const element = document.createElement(tag);

  mapObject(attributes, element.setAttribute.bind(element));
  appendChildren(element, children);
  return element;
};

export const elNS = withProfile('elNS', (tag, attributes = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);

  attributesNS(element, attributes);
  return element;
});
