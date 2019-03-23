import { nextID } from '../utils';
import { createElementWithClassName } from '../utils/dom/createElement';
import style from './style.scss';

export function createAxisX({ transition, renderer, viewBox, globalState }) {
  const id = nextID();
  const container = createElementWithClassName(style.AxisXContainer);

  return container
}

const getNextList = (offset, visible) => {

};

const createAxisElement = (textContent, top, className) => {
  const element = createElementWithClassName(`${style.AxisX}${className ? ' ' + className : ''}`);

  element.style = `bottom:${90 * (top / 5)}%`;
  element.textContent = textContent;
  return element;
};
